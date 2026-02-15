"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { getLocations } from "@/lib/db";
import { SEED_MEMBER_LOCATIONS } from "@/lib/mock/seed-data";
import type { Location } from "@/lib/types";

interface LocationContextType {
  currentLocation: Location | null;
  setLocationId: (id: string) => void;
  userLocations: Location[];
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<string>("loc-1");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const locations = await getLocations();
      setAllLocations(locations);
      setLoaded(true);
    }
    load();
  }, []);

  const userLocations = useMemo(() => {
    if (!user) return allLocations;
    const ids = SEED_MEMBER_LOCATIONS.filter(
      (ml) => ml.profile_id === user.id
    ).map((ml) => ml.location_id);
    return allLocations.filter((l) => ids.includes(l.id));
  }, [user, allLocations]);

  useEffect(() => {
    if (!loaded) return;
    if (!user) {
      setLocationId("loc-1");
      return;
    }
    const primary = SEED_MEMBER_LOCATIONS.find(
      (ml) => ml.profile_id === user.id && ml.is_primary
    );
    const defaultId = primary?.location_id ?? userLocations[0]?.id ?? "loc-1";
    setLocationId(defaultId);
  }, [user, userLocations, loaded]);

  const currentLocation =
    allLocations.find((l) => l.id === locationId) ?? allLocations[0] ?? null;

  return (
    <LocationContext.Provider
      value={{ currentLocation, setLocationId, userLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
