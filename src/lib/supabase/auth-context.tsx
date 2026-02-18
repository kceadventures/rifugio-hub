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
  // Retries once after a delay for new signups where the callback
  // may not have created the profile yet.
  const fetchProfile = useCallback(async (authUser: User, retries = 2) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error || !data) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 1000));
        return fetchProfile(authUser, retries - 1);
      }
      console.error("Failed to fetch profile:", error);
      setUser(null);
      return;
    }

    setUser(data as Profile);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
