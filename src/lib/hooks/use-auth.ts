"use client";

import { useMockAuth } from "@/lib/mock/auth-context";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// In demo mode we use the mock auth hook directly.
// In production mode, SupabaseAuthProvider supplies context
// via its own hook — but we lazily reference it to avoid
// importing the Supabase client at module load time.

// We store the Supabase auth hook reference once resolved.
let _useSupabaseAuth: (() => {
  user: import("@/lib/types").Profile | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}) | null = null;

export function useAuth() {
  if (isDemoMode) {
    return useMockAuthHook();
  }

  // In production, the Supabase auth context is provided by SupabaseAuthProvider
  // which is dynamically loaded. We need to import the hook lazily.
  // Since this runs client-side only and the provider is already loaded,
  // we can do a synchronous require-style import.
  if (!_useSupabaseAuth) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@/lib/supabase/auth-context");
    _useSupabaseAuth = mod.useSupabaseAuth;
  }

  return useSupabaseAuthHook();
}

function useMockAuthHook() {
  const { user, signIn, signOut, switchUser } = useMockAuth();

  const isStaff = user?.role === "admin" || user?.role === "staff";
  const isAdmin = user?.role === "admin";

  return {
    user,
    loading: false,
    signIn,
    signOut,
    switchUser,
    signInWithMagicLink: async (_email: string) => ({ error: null }),
    isStaff,
    isAdmin,
  };
}

function useSupabaseAuthHook() {
  const { user, loading, signInWithMagicLink, signOut } = _useSupabaseAuth!();

  const isStaff = user?.role === "admin" || user?.role === "staff";
  const isAdmin = user?.role === "admin";

  return {
    user,
    loading,
    signIn: (_email: string) => {},
    signOut,
    switchUser: (_userId: string) => {},
    signInWithMagicLink,
    isStaff,
    isAdmin,
  };
}
