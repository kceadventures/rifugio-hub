import type { Comment } from '@/lib/types';
import { relativeTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface CommentItemProps {
  comment: Comment & {
    author?: { full_name: string; avatar_url?: string };
  };
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="py-3 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={comment.author?.full_name || ''} src={comment.author?.avatar_url} size="sm" />
        <span className="font-medium text-sm">{comment.author?.full_name}</span>
        <span className="text-xs text-ink-muted ml-auto">
          {relativeTime(comment.created_at)}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{comment.body}</p>
    </div>
  );
}
