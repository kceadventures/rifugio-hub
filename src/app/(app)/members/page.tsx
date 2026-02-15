'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useLocation } from '@/providers/location-provider';
import { getProfilesByLocation, getOrCreateConversation } from '@/lib/db';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ROLE_LABELS } from '@/lib/constants';
import type { Profile } from '@/lib/types';

export default function MembersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (currentLocation) {
        const fetchedMembers = await getProfilesByLocation(currentLocation.id);
        setMembers(fetchedMembers);
        setLoading(false);
      }
    }
    load();
  }, [currentLocation]);

  const handleMemberClick = async (member: Profile) => {
    if (!user || member.id === user.id) return;

    const conversation = await getOrCreateConversation(user.id, member.id);
    router.push(`/messages/${conversation.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6">
        <h1 className="font-display text-3xl font-bold mb-8">Members</h1>
      </div>

      <div className="px-6 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="cursor-pointer"
            onClick={() => handleMemberClick(member)}
          >
            <Card className="p-4 hover:bg-surface-secondary transition-colors">
              <div className="flex items-start gap-4">
                <Avatar src={member.avatar_url} name={member.full_name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-text-primary">{member.full_name}</h3>
                    {member.role && (
                      <Badge variant="muted">
                        {ROLE_LABELS[member.role]}
                      </Badge>
                    )}
                  </div>
                  {member.bio && (
                    <p className="text-sm text-text-secondary line-clamp-2">{member.bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
