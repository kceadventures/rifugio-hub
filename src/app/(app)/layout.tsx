'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/providers/auth-provider';
import { LocationProvider, useLocation } from '@/providers/location-provider';
import { useAuth } from '@/lib/hooks/use-auth';
import { TopBar } from '@/components/layout/top-bar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { LocationSwitcher } from '@/components/layout/location-switcher';
import { DemoSwitcher } from '@/components/layout/demo-switcher';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isDemoMode && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (!isDemoMode && (loading || !user)) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display italic text-3xl text-ink mb-2">Rifugio</h1>
          <p className="text-ink-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [isLocationSwitcherOpen, setIsLocationSwitcherOpen] = useState(false);
  const { currentLocation } = useLocation();

  return (
    <div
      className="min-h-screen bg-surface"
      data-location={currentLocation?.color_theme ?? currentLocation?.slug ?? ''}
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
      <AuthGuard>
        <LocationProvider>
          <AppShell>{children}</AppShell>
        </LocationProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
