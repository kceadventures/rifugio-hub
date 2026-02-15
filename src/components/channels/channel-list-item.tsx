import Link from 'next/link';
import type { Channel, Post } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import { ChannelIcon } from './channel-icon';
import { Badge } from '@/components/ui/badge';

interface ChannelListItemProps {
  channel: Channel;
  lastPost?: Post;
  unreadCount?: number;
}

export function ChannelListItem({ channel, lastPost, unreadCount }: ChannelListItemProps) {
  return (
    <Link
      href={`/channels/${channel.id}`}
      className="flex items-center gap-3 py-3 px-5 w-full hover:bg-surface transition"
    >
      <div className="bg-surface rounded-xl p-2.5 shrink-0">
        <ChannelIcon category={channel.category} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium">{channel.name}</div>
        {lastPost && (
          <div className="text-sm text-ink-muted truncate">
            {lastPost.body}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        {lastPost && (
          <div className="text-xs text-ink-muted">
            {relativeTime(lastPost.created_at)}
          </div>
        )}
        {unreadCount !== undefined && unreadCount > 0 && (
          <Badge variant="accent">{unreadCount}</Badge>
        )}
      </div>
    </Link>
  );
}
