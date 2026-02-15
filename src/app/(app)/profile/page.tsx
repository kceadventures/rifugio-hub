'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useLocation } from '@/providers/location-provider';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROLE_LABELS } from '@/lib/constants';

export default function ProfilePage() {
  const { user } = useAuth();
  const { userLocations } = useLocation();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6">
        <h1 className="font-display text-3xl font-bold mb-8">Profile</h1>

        <div className="space-y-6">
          <div className="flex flex-col items-center text-center mb-8">
            <Avatar src={user.avatar_url} name={user.full_name} size="lg" className="mb-4" />
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
              {user.full_name}
            </h2>
            {user.role && (
              <Badge variant="muted" className="mb-3">
                {ROLE_LABELS[user.role]}
              </Badge>
            )}
            <p className="text-text-secondary">{user.email}</p>
          </div>

          {user.bio && (
            <Card className="p-6">
              <h3 className="font-semibold text-text-primary mb-3">Bio</h3>
              <p className="text-text-secondary whitespace-pre-wrap">{user.bio}</p>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold text-text-primary mb-4">Locations</h3>
            <div className="space-y-2">
              {userLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-3 py-2 px-3 bg-surface-secondary rounded-lg"
                >
                  <div>
                    <div className="font-medium text-text-primary">{location.name}</div>
                    <div className="text-sm text-text-secondary">{location.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Button variant="secondary" size="lg" className="w-full" disabled>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
