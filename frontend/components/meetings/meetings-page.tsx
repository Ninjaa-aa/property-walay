"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { formatPriceShort } from "@/lib/utils/format-price";
import type { MeetingWithProperty } from "@/types/meeting";

const statusVariants: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-600 text-white" },
  pending: { label: "Pending", className: "bg-amber-500 text-white" },
  unknown: { label: "Unknown", className: "bg-muted text-foreground" },
};

export function MeetingsPage() {
  const { user, loading: userLoading } = useUserProfile();
  const [meetings, setMeetings] = useState<MeetingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("meetings")
          .select(
            `id, user_id, property_id, status, message, webhook_response, created_at,
             property:properties!meetings_property_id_fkey (
               our_id, title, area_name, current_price, currency, images
             )`
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          // Fallback without FK join if relation not defined
          const { data: fallback, error: fallbackError } = await supabase
            .from("meetings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (fallbackError) throw fallbackError;

          if (cancelled) return;

          const ids = (fallback ?? []).map((m) => m.property_id);
          let propsMap = new Map<string, MeetingWithProperty["property"]>();
          if (ids.length > 0) {
            const { data: props } = await supabase
              .from("properties")
              .select("our_id, title, area_name, current_price, currency, images")
              .in("our_id", ids);
            propsMap = new Map(
              (props ?? []).map((p) => [p.our_id, p as NonNullable<MeetingWithProperty["property"]>])
            );
          }

          setMeetings(
            (fallback ?? []).map((m) => ({
              ...(m as MeetingWithProperty),
              property: propsMap.get(m.property_id) ?? null,
            }))
          );
        } else {
          if (cancelled) return;
          setMeetings(((data ?? []) as unknown) as MeetingWithProperty[]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meetings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, userLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [meetings.length]);

  const totalPages = Math.max(1, Math.ceil(meetings.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMeetings = meetings.slice(startIndex, endIndex);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please sign in to view your meetings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl">Meetings</h1>
          <p className="text-muted-foreground mt-2">
            Track every meeting request you have sent to property dealers.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        {meetings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="text-muted-foreground mb-4 h-16 w-16" />
              <h3 className="mb-2 text-lg font-semibold">No meeting requests yet</h3>
              <p className="text-muted-foreground mb-4 text-center text-sm">
                Find a property you like and click &ldquo;Schedule Meeting&rdquo; to get started.
              </p>
              <Button asChild>
                <Link href="/dashboard/search">
                  <Search className="h-4 w-4" />
                  Browse properties
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedMeetings.map((meeting) => {
              const variant =
                statusVariants[meeting.status?.toLowerCase()] ??
                statusVariants.unknown;
              const price =
                meeting.property?.current_price &&
                formatPriceShort(
                  meeting.property.current_price,
                  meeting.property.currency || "PKR"
                );

              return (
                <Card key={meeting.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">
                        {meeting.property?.title || "Property"}
                      </CardTitle>
                      {meeting.property?.area_name && (
                        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          {meeting.property.area_name}
                        </p>
                      )}
                      <p className="text-muted-foreground mt-1 text-xs">
                        Requested {formatRelativeTime(meeting.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={variant.className}>{variant.label}</Badge>
                      {price && (
                        <span className="text-primary text-sm font-semibold">
                          {price}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  {meeting.message && (
                    <CardContent>
                      <Separator className="mb-4" />
                      <p className="text-sm whitespace-pre-wrap">{meeting.message}</p>
                    </CardContent>
                  )}
                  <CardContent className={meeting.message ? "pt-0" : undefined}>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/search/${meeting.property_id}`}>
                        View property
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {meetings.length > pageSize && (
              <Card>
                <CardContent className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
                  <p className="text-muted-foreground text-sm">
                    Showing {startIndex + 1}-{Math.min(endIndex, meetings.length)} of{" "}
                    {meetings.length} meetings
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
