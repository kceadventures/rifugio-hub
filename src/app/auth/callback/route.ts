import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (code) {
    // PKCE flow — exchange code for session
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // Magic link / OTP flow
    await supabase.auth.verifyOtp({
      token_hash,
      type: type as "magiclink" | "email",
    });
  }

  // After auth, check if user has a profile. If not, create one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      // Create a profile for the new user
      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "New Member";

      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email!,
        full_name: fullName,
        role: "member",
      });

      // Also join all locations by default
      const { data: locations } = await supabase
        .from("locations")
        .select("id");

      if (locations && locations.length > 0) {
        const memberships = locations.map((loc, i) => ({
          profile_id: user.id,
          location_id: loc.id,
          is_primary: i === 0,
        }));

        await supabase.from("member_locations").insert(memberships);
      }
    }
  }

  // Redirect to the feed
  return NextResponse.redirect(new URL("/feed", requestUrl.origin));
}
