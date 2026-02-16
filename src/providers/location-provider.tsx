"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { getLocations, getLocationsByUser } from "@/lib/db";
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
  const [memberLocationIds, setMemberLocationIds] = useState<
    { location_id: string; is_primary: boolean }[]
  >([]);
  const [locationId, setLocationId] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  // Load locations and user's memberships
  useEffect(() => {
    async function load() {
      try {
        const locations = await getLocations();
        setAllLocations(locations);

        if (user) {
          const memberships = await getLocationsByUser(user.id);
          setMemberLocationIds(memberships);
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
      setLoaded(true);
    }
    load();
  }, [user]);

  const userLocations = useMemo(() => {
    if (!user || memberLocationIds.length === 0) return allLocations;
    const ids = memberLocationIds.map((ml) => ml.location_id);
    const filtered = allLocations.filter((l) => ids.includes(l.id));
    return filtered.length > 0 ? filtered : allLocations;
  }, [user, allLocations, memberLocationIds]);

  // Set default location when data loads
  useEffect(() => {
    if (!loaded || allLocations.length === 0) return;

    if (user && memberLocationIds.length > 0) {
      const primary = memberLocationIds.find((ml) => ml.is_primary);
      const defaultId =
        primary?.location_id ?? memberLocationIds[0]?.location_id ?? allLocations[0]?.id;
      setLocationId(defaultId);
    } else {
      setLocationId(allLocations[0]?.id ?? "");
    }
  }, [user, memberLocationIds, allLocations, loaded]);

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
