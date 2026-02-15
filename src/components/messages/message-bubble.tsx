import { relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { DirectMessage } from '@/lib/types';

interface MessageBubbleProps {
  message: DirectMessage & {
    sender?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  };
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[75%]', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isOwn
              ? 'bg-accent text-white rounded-br-sm'
              : 'bg-surface-elevated border border-border-subtle rounded-bl-sm'
          )}
        >
          <p className="text-sm leading-relaxed">{message.body}</p>
        </div>
        <span className={cn('text-xs', isOwn ? 'text-white/60' : 'text-ink-muted')}>
          {relativeTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}
