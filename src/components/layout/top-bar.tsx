'use client';

import { ChevronDown } from 'lucide-react';
import { useLocation } from '@/providers/location-provider';
import { useAuth } from '@/lib/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';

interface TopBarProps {
  onOpenLocationSwitcher: () => void;
}

export function TopBar({ onOpenLocationSwitcher }: TopBarProps) {
  const { currentLocation } = useLocation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-elevated/80 backdrop-blur-lg border-b border-border z-50">
      <div className="h-full flex items-center justify-between px-5">
        <button
          onClick={onOpenLocationSwitcher}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <h1 className="font-display text-lg text-ink">
            {currentLocation?.name || 'Select Location'}
          </h1>
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        </button>

        <div>
          {user && (
            <Avatar
              name={user.full_name}
              src={user.avatar_url}
              size="sm"
            />
          )}
        </div>
      </div>
    </header>
  );
}
