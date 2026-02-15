"use client";

import dynamic from "next/dynamic";
import { MockAuthProvider } from "@/lib/mock/auth-context";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Lazy-load SupabaseAuthProvider so the Supabase client is never
// instantiated when running in demo mode (no SUPABASE_URL set).
const SupabaseAuthProvider = dynamic(
  () =>
    import("@/lib/supabase/auth-context").then(
      (mod) => mod.SupabaseAuthProvider
    ),
  { ssr: false }
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isDemoMode) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}
