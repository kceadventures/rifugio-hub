import { ConversationItem } from './conversation-item';
import type { Conversation } from '@/lib/types';

interface ConversationListProps {
  conversations: Array<Conversation & {
    other_participant?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
    last_message?: {
      body: string;
      created_at: string;
    } | null;
  }>;
  currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA;
  });

  if (sortedConversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-5">
        <p className="text-sm text-ink-muted">No conversations yet</p>
      </div>
    );
  }

  return (
    <div>
      {sortedConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
