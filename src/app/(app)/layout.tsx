'use client';

import { useState } from 'react';
import { AuthProvider } from '@/providers/auth-provider';
import { LocationProvider, useLocation } from '@/providers/location-provider';
import { TopBar } from '@/components/layout/top-bar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { LocationSwitcher } from '@/components/layout/location-switcher';
import { DemoSwitcher } from '@/components/layout/demo-switcher';

function AppShell({ children }: { children: React.ReactNode }) {
  const [isLocationSwitcherOpen, setIsLocationSwitcherOpen] = useState(false);
  const { currentLocation } = useLocation();

  return (
    <div
      className="min-h-screen bg-surface"
      data-location={currentLocation.color_theme ?? currentLocation.slug}
    >
      <TopBar onOpenLocationSwitcher={() => setIsLocationSwitcherOpen(true)} />

      <main className="pt-14 pb-20 min-h-screen overflow-y-auto">
        {children}
      </main>

      <BottomNav />

      <LocationSwitcher
        isOpen={isLocationSwitcherOpen}
        onClose={() => setIsLocationSwitcherOpen(false)}
      />

      <DemoSwitcher />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppShell>{children}</AppShell>
      </LocationProvider>
    </AuthProvider>
  );
}
