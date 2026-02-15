'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { getConversationsForUser } from '@/lib/db';
import { ConversationList } from '@/components/messages/conversation-list';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import type { Conversation } from '@/lib/types';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        const fetchedConversations = await getConversationsForUser(user.id);
        setConversations(fetchedConversations);
        setLoading(false);
      }
    }
    load();
  }, [user]);

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Messages</h1>
          <Link href="/members">
            <Button variant="secondary" size="sm">
              New Message
            </Button>
          </Link>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={MessageCircle}
            title="No conversations yet"
            description="Start a conversation by visiting the members page"
            action={
              <Link href="/members">
                <Button>Browse Members</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <ConversationList conversations={conversations} currentUserId={user?.id || ''} />
      )}
    </div>
  );
}
