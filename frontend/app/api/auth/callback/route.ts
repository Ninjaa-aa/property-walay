import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists, if not create it (for Google OAuth users)
      const { error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it
        const firstName =
          data.user.user_metadata?.first_name ||
          data.user.user_metadata?.full_name?.split(" ")[0] ||
          data.user.user_metadata?.name?.split(" ")[0] ||
          "";
        const lastName =
          data.user.user_metadata?.last_name ||
          data.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
          data.user.user_metadata?.name?.split(" ").slice(1).join(" ") ||
          "";

        await supabase.from("profiles").upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: data.user.email || "",
          role: "Property Seeker", // Default role
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}
