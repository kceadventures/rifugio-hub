import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { relativeTime } from '@/lib/utils';
import type { Post } from '@/lib/types';

interface FeedCardProps {
  post: Post & {
    author?: {
      id: string;
      full_name: string;
      avatar_url?: string;
      role?: string;
    };
    channel?: {
      id: string;
      name: string;
      color?: string;
    };
    comment_count?: number;
  };
}

export function FeedCard({ post }: FeedCardProps) {
  const isStaff = post.author?.role === 'staff' || post.author?.role === 'admin';

  return (
    <Link
      href={`/channels/${post.channel_id}/${post.id}`}
      className="block bg-surface border border-border rounded-lg p-4 hover:bg-surface-elevated/50 transition"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: post.channel?.color || '#6366f1' }}
          />
          <span className="font-medium text-ink">{post.channel?.name}</span>
        </div>
        <span className="text-xs text-ink-muted">{relativeTime(post.created_at)}</span>
      </div>

      <div className="flex items-start gap-3 mb-2">
        <Avatar
          src={post.author?.avatar_url}
          name={post.author?.full_name || ''}
          size="sm"
        />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-ink">{post.author?.full_name}</span>
          {isStaff && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
              Staff
            </span>
          )}
        </div>
      </div>

      {post.title && (
        <h3 className="font-semibold text-ink mb-1">{post.title}</h3>
      )}

      <p className="text-sm text-ink-muted line-clamp-2 mb-2">{post.body}</p>

      {post.booking_url && (
        <div className="mb-2">
          <span className="text-sm text-accent font-medium">View booking →</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-ink-muted">
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs">{post.comment_count || 0}</span>
      </div>
    </Link>
  );
}
