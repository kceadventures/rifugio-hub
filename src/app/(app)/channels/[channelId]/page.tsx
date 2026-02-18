'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Hash } from 'lucide-react';
import Link from 'next/link';
import { getPostsByChannel, getChannel } from '@/lib/db';
import { useAuth } from '@/lib/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { PostCard } from '@/components/posts/post-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CHANNEL_META } from '@/lib/constants';
import type { Post, Channel, ChannelCategory } from '@/lib/types';

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const { isStaff } = useAuth();
  const channelId = params.channelId as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [channelData, setChannelData] = useState<Channel | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [fetchedPosts, fetchedChannel] = await Promise.all([
        getPostsByChannel(channelId),
        getChannel(channelId),
      ]);
      setPosts(fetchedPosts);
      setChannelData(fetchedChannel);
      setLoading(false);
    }
    load();
  }, [channelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Use the DB channel name, fall back to CHANNEL_META for demo mode, then 'Channel'
  const channelName = channelData?.name || CHANNEL_META[channelId as ChannelCategory]?.label || 'Channel';

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title={channelName} showBack />

      <div className="p-6 space-y-4">
        {posts.length === 0 ? (
          <EmptyState
            icon={Hash}
            title="No posts yet"
            description="Be the first to post in this channel"
          />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {isStaff && (
        <Link href={`/new-post?channel=${channelId}`}>
          <Button
            size="lg"
            className="fixed bottom-24 right-6 rounded-full shadow-lg w-14 h-14 p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      )}
    </div>
  );
}
