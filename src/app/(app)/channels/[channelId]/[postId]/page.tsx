'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPost, getCommentsByPost, addComment } from '@/lib/db';
import { useAuth } from '@/lib/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { CommentList } from '@/components/comments/comment-list';
import { CommentForm } from '@/components/comments/comment-form';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookingLink } from '@/components/posts/booking-link';
import { relativeTime } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import type { Post, Comment } from '@/lib/types';

export default function PostDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const fetchedPost = await getPost(postId);
      const fetchedComments = await getCommentsByPost(postId);
      setPost(fetchedPost || null);
      setComments(fetchedComments);
      setLoading(false);
    }
    load();
  }, [postId]);

  const handleCommentSubmit = async (content: string) => {
    if (!user || !post) return;

    const newComment = await addComment({
      post_id: post.id,
      author_id: user.id,
      body: content,
    });

    setComments((prev) => [...prev, newComment]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="Post" showBack />

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Avatar src={post.author?.avatar_url} name={post.author?.full_name || ''} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-text-primary">{post.author?.full_name}</span>
                {post.author?.role && (
                  <Badge variant="muted">
                    {ROLE_LABELS[post.author.role]}
                  </Badge>
                )}
                <span className="text-sm text-text-secondary">
                  {relativeTime(post.created_at)}
                </span>
              </div>
            </div>
          </div>

          {post.title && (
            <h1 className="text-2xl font-bold text-text-primary mb-3">{post.title}</h1>
          )}

          <div className="text-text-primary whitespace-pre-wrap">{post.body}</div>

          {post.image_url && (
            <div className="mt-4 rounded-lg overflow-hidden bg-surface-secondary">
              <div className="aspect-video flex items-center justify-center text-text-secondary">
                Image: {post.image_url}
              </div>
            </div>
          )}

          {post.booking_url && (
            <div className="mt-4">
              <BookingLink url={post.booking_url} />
            </div>
          )}
        </div>

        <div className="border-t border-border-subtle pt-6">
          <h2 className="text-lg font-semibold mb-4">Comments ({comments.length})</h2>
          <CommentList comments={comments} />
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-surface-primary border-t border-border-subtle p-4">
        <CommentForm onSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
}
