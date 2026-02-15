'use client';

import { Check } from 'lucide-react';
import { useLocation } from '@/providers/location-provider';
import { cn } from '@/lib/utils';

interface LocationSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationSwitcher({ isOpen, onClose }: LocationSwitcherProps) {
  const { currentLocation, setLocationId, userLocations } = useLocation();

  const handleLocationSelect = (locationId: string) => {
    setLocationId(locationId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-ink/50 transition-opacity z-40',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-surface-elevated rounded-t-2xl shadow-2xl transition-transform duration-300 z-50 pb-[env(safe-area-inset-bottom)]',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="p-5">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-5" />

          <h2 className="font-display text-xl text-ink mb-4">Your Locations</h2>

          <div className="space-y-2">
            {userLocations.map((location) => {
              const isCurrentLocation = currentLocation?.id === location.id;

              return (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="text-left">
                    <div className="font-body font-medium text-ink">
                      {location.name}
                    </div>
                    <div className="text-sm text-ink-muted">
                      {location.city}, {location.state}
                    </div>
                  </div>

                  {isCurrentLocation && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
