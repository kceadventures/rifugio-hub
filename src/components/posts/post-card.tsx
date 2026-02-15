import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { Post } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookingLink } from './booking-link';
import { ROLE_LABELS } from '@/lib/constants';

interface PostCardProps {
  post: Post & {
    author?: { full_name: string; avatar_url?: string; role?: string };
    channel?: { id: string; name: string };
    comment_count?: number;
  };
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const isStaffOrAdmin = post.author?.role === 'staff' || post.author?.role === 'admin';

  return (
    <Link href={`/channels/${post.channel_id}/${post.id}`}>
      <Card>
        <div className="flex items-center gap-2">
          <Avatar name={post.author?.full_name || ''} src={post.author?.avatar_url} size="sm" />
          <span className="font-medium text-sm">{post.author?.full_name}</span>
          {isStaffOrAdmin && post.author?.role && (
            <Badge variant="accent">{ROLE_LABELS[post.author.role]}</Badge>
          )}
          <span className="text-xs text-ink-muted ml-auto">
            {relativeTime(post.created_at)}
          </span>
        </div>

        {compact && post.channel && (
          <div className="mt-2">
            <Badge variant="default">{post.channel.name}</Badge>
          </div>
        )}

        {post.title && (
          <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
        )}

        <p
          className={cn(
            'text-sm text-ink-muted leading-relaxed mt-2',
            compact && 'line-clamp-3'
          )}
        >
          {post.body}
        </p>

        {post.image_url && (
          <div className="rounded-xl mt-3 aspect-video bg-border-subtle" />
        )}

        {post.booking_url && (
          <div className="mt-3">
            <BookingLink url={post.booking_url} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 text-xs text-ink-muted">
          <MessageCircle size={16} />
          <span>{post.comment_count || 0} comments</span>
        </div>
      </Card>
    </Link>
  );
}
