"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { scheduleMeeting } from "@/lib/api/meetings";

interface RequestMeetingResult {
  ok: boolean;
  status?: string;
  message?: string | null;
}

export function useScheduleMeeting() {
  const router = useRouter();
  const { user, profile, loading: profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(false);

  const requestMeeting = useCallback(
    async (propertyId: string): Promise<RequestMeetingResult> => {
      if (profileLoading) {
        toast.info("Loading your profile, please try again in a moment.");
        return { ok: false };
      }

      if (!user || !profile) {
        toast.error("Please sign in to schedule a meeting.");
        return { ok: false };
      }

      const missing: string[] = [];
      if (!profile.phone?.trim()) missing.push("phone number");
      if (!profile.calendly_link?.trim()) missing.push("Calendly link");

      if (missing.length > 0) {
        toast.error(`Missing ${missing.join(" and ")}`, {
          description: "Add them in Settings before scheduling a meeting.",
          action: {
            label: "Go to Settings",
            onClick: () => router.push("/dashboard/settings"),
          },
        });
        return { ok: false };
      }

      // Prevent duplicate meeting requests for the same property within 7 days.
      const supabase = createClient();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentMeeting, error: recentMeetingError } = await supabase
        .from("meetings")
        .select("id, created_at")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentMeetingError) {
        console.error("Failed to check recent meeting requests:", recentMeetingError);
      }
      if (recentMeeting) {
        toast.error("Meeting already requested for this property", {
          description: "You can request another meeting for this property after 7 days.",
          action: {
            label: "View meetings",
            onClick: () => router.push("/dashboard/meetings"),
          },
        });
        return { ok: false };
      }

      setLoading(true);
      const toastId = toast.loading("Sending your meeting request...");
      try {
        const response = await scheduleMeeting(user.id, propertyId);
        const completed = response.status?.toLowerCase() === "completed";
        const { error: insertError } = await supabase.from("meetings").insert({
          user_id: user.id,
          property_id: propertyId,
          status: response.status || "unknown",
          message: response.message ?? null,
          webhook_response: response.raw ?? null,
        });
        if (insertError) {
          console.error("Failed to persist meeting:", insertError);
        }

        if (completed) {
          toast.success("Meeting request sent", {
            id: toastId,
            description:
              "Your contact number and Calendly link have been shared. The dealer will reach out shortly.",
            action: {
              label: "View meetings",
              onClick: () => router.push("/dashboard/meetings"),
            },
          });
          return { ok: true, status: response.status, message: response.message };
        }

        toast.error("Meeting could not be scheduled", {
          id: toastId,
          description: response.message || "Please try again later.",
        });
        return { ok: false, status: response.status, message: response.message };
      } catch (err) {
        console.error(err);
        toast.error("Failed to send meeting request", {
          id: toastId,
          description: err instanceof Error ? err.message : undefined,
        });
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [router, user, profile, profileLoading]
  );

  return { requestMeeting, loading };
}
