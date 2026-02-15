import type { Comment } from '@/lib/types';
import { CommentItem } from './comment-item';

interface CommentListProps {
  comments: (Comment & {
    author?: { full_name: string; avatar_url?: string };
  })[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center text-sm text-ink-muted py-8">
        No comments yet
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
