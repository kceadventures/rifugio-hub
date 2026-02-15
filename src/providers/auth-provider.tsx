"use client";

import { MockAuthProvider } from "@/lib/mock/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <MockAuthProvider>{children}</MockAuthProvider>;
}
