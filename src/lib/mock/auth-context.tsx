"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { SEED_PROFILES } from "./seed-data";
import type { Profile } from "../types";

interface MockAuthContextType {
  user: Profile | null;
  signIn: (email: string) => void;
  signOut: () => void;
  switchUser: (userId: string) => void;
}

export const MockAuthContext = createContext<MockAuthContextType | undefined>(
  undefined
);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(SEED_PROFILES[0]);

  const signIn = useCallback((email: string) => {
    const profile = SEED_PROFILES.find((p) => p.email === email);
    if (profile) setUser(profile);
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const switchUser = useCallback((userId: string) => {
    const profile = SEED_PROFILES.find((p) => p.id === userId);
    if (profile) setUser(profile);
  }, []);

  return (
    <MockAuthContext.Provider value={{ user, signIn, signOut, switchUser }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
}
