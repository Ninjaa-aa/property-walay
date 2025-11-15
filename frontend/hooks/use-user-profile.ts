import { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseUser, UserProfile } from "@/types/user";

interface UseUserProfileReturn {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    let loadingComplete = false;

    // Set a timeout to prevent infinite loading (10 seconds max)
    timeoutId = setTimeout(() => {
      if (mounted && !loadingComplete) {
        console.warn("User profile loading timeout - setting loading to false");
        setLoading(false);
        loadingComplete = true;
      }
    }, 10000);

    const fetchUserAndProfile = async () => {
      try {
        // Use getSession() instead of getUser() - more reliable for client-side
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError || !session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          loadingComplete = true;
          if (timeoutId) clearTimeout(timeoutId);
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        // Fetch profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!mounted) return;

        if (!profileError && profileData) {
          setProfile(profileData);
        } else {
          // Profile doesn't exist or error occurred
          setProfile(null);
        }

        setLoading(false);
        loadingComplete = true;
        if (timeoutId) clearTimeout(timeoutId);

        // Now set up auth state change listener AFTER initial load
        // This prevents race conditions
        if (!subscriptionRef.current) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (!mounted) return;

            const newUser = newSession?.user ?? null;
            setUser(newUser);

            if (newUser) {
              // Fetch profile when auth state changes
              try {
                const { data: profileData, error } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", newUser.id)
                  .single();

                if (!error && profileData) {
                  setProfile(profileData);
                } else {
                  setProfile(null);
                }
              } catch (error) {
                console.error("Error fetching profile on auth change:", error);
                setProfile(null);
              }
            } else {
              setProfile(null);
            }
          });

          subscriptionRef.current = subscription;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (mounted) {
          setLoading(false);
          loadingComplete = true;
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
    };

    fetchUserAndProfile();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [supabase]);

  return { user, profile, loading };
}
