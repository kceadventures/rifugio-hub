"use client";

import { useMockAuth } from "@/lib/mock/auth-context";

export function useAuth() {
  const { user, signIn, signOut, switchUser } = useMockAuth();

  const isStaff = user?.role === "admin" || user?.role === "staff";
  const isAdmin = user?.role === "admin";

  return { user, signIn, signOut, switchUser, isStaff, isAdmin };
}
