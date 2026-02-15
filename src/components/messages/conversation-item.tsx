import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { relativeTime } from '@/lib/utils';
import type { Conversation } from '@/lib/types';

interface ConversationItemProps {
  conversation: Conversation & {
    other_participant?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
    last_message?: {
      body: string;
      created_at: string;
    } | null;
  };
  currentUserId: string;
}

export function ConversationItem({ conversation, currentUserId }: ConversationItemProps) {
  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex items-center gap-3 py-3 px-5 hover:bg-surface-elevated/50 transition border-b border-border-subtle"
    >
      <Avatar
        src={conversation.other_participant?.avatar_url}
        name={conversation.other_participant?.full_name || ''}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-ink">
          {conversation.other_participant?.full_name}
        </div>
        {conversation.last_message && (
          <div className="text-sm text-ink-muted truncate">
            {conversation.last_message.body}
          </div>
        )}
      </div>

      {conversation.last_message && (
        <div className="text-xs text-ink-muted flex-shrink-0">
          {relativeTime(conversation.last_message.created_at)}
        </div>
      )}
    </Link>
  );
}
