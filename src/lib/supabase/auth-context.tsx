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
  // Retries for new signups where the callback may still be creating the profile.
  const fetchProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (data) return data as Profile;

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
        return null;
      }

      // Profile not found yet — wait and retry (callback may still be creating it)
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    console.error("Profile not found after retries for user:", authUser.id);
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
