"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "./client";
import type { Profile } from "../types";
import type { User, Session } from "@supabase/supabase-js";

interface SupabaseAuthContextType {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const SupabaseAuthContext = createContext<
  SupabaseAuthContextType | undefined
>(undefined);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from profiles table.
  // If profile doesn't exist (new user), auto-create it.
  const fetchProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    // First attempt: just try to get the profile
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data) return data as Profile;

    // Profile not found (PGRST116) — auto-create it
    if (error && error.code === "PGRST116") {
      const fullName =
        (authUser.user_metadata?.full_name as string) ||
        authUser.email?.split("@")[0] ||
        "New Member";

      const { error: insertError } = await supabase.from("profiles").insert({
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        role: "member",
      });

      if (insertError) {
        console.error("Auto-create profile error:", insertError);
        return null;
      }

      // Also create location memberships
      const { data: locations } = await supabase.from("locations").select("id");
      if (locations && locations.length > 0) {
        await supabase.from("member_locations").insert(
          locations.map((loc: { id: string }, i: number) => ({
            profile_id: authUser.id,
            location_id: loc.id,
            is_primary: i === 0,
          }))
        );
      }

      // Re-fetch the newly created profile
      const { data: newProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      return newProfile as Profile | null;
    }

    if (error) {
      console.error("Profile fetch error:", error);
    }
    return null;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(s);

        if (s?.user) {
          const profile = await fetchProfile(s.user);
          if (mounted) {
            setUser(profile);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    init();

    // Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return;

      setSession(s);

      if (s?.user) {
        const profile = await fetchProfile(s.user);
        if (mounted) {
          setUser(profile);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const redirectTo =
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}/auth/callback`,
      },
    });

    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <SupabaseAuthContext.Provider
      value={{ user, session, loading, signInWithMagicLink, signOut }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error(
      "useSupabaseAuth must be used within SupabaseAuthProvider"
    );
  }
  return context;
}
