'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { SEED_PROFILES } from '@/lib/mock/seed-data';
import { ROLE_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function DemoSwitcher() {
  const { user, switchUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    switchUser(profileId);
    setIsExpanded(false);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-20 right-4 z-60">
      {isExpanded ? (
        <div className="bg-ink text-white rounded-2xl shadow-2xl overflow-hidden">
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full px-4 py-2 flex items-center justify-between gap-2 hover:bg-white/10 transition-colors border-b border-white/10"
          >
            <span className="text-xs font-body">Switch User</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <div className="max-h-96 overflow-y-auto">
            {SEED_PROFILES.map((profile) => {
              const isCurrentUser = user.id === profile.id;

              return (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile.id)}
                  className={cn(
                    'w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors text-left',
                    isCurrentUser && 'bg-white/5'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {profile.full_name}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {ROLE_LABELS[profile.role]}
                    </div>
                  </div>
                  {isCurrentUser && (
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-ink text-white rounded-full px-3 py-1.5 shadow-lg hover:bg-ink/90 transition-colors flex items-center gap-2"
        >
          <span className="text-xs font-body">{user.full_name}</span>
          <Badge variant="muted" className="text-xs">
            {ROLE_LABELS[user.role]}
          </Badge>
          <ChevronUp className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
