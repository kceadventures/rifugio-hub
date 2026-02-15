'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useLocation } from '@/providers/location-provider';
import { getChannelsByLocation, addPost } from '@/lib/db';
import { PageHeader } from '@/components/layout/page-header';
import { PostForm } from '@/components/posts/post-form';
import type { Channel } from '@/lib/types';

function NewPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isStaff, isAdmin } = useAuth();
  const { currentLocation } = useLocation();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const channelParam = searchParams.get('channel');

  useEffect(() => {
    async function load() {
      if (!isStaff && !isAdmin) {
        router.push('/feed');
        return;
      }

      if (currentLocation) {
        const fetchedChannels = await getChannelsByLocation(currentLocation.id);
        setChannels(fetchedChannels);
        setLoading(false);
      }
    }
    load();
  }, [currentLocation, isStaff, isAdmin, router]);

  const handleSubmit = async (data: {
    channelId: string;
    title?: string;
    body: string;
    bookingUrl?: string;
  }) => {
    if (!user || !currentLocation) return;

    const newPost = await addPost({
      channel_id: data.channelId,
      title: data.title,
      body: data.body,
      booking_url: data.bookingUrl,
      author_id: user.id,
      is_pinned: false,
    });

    router.push(`/channels/${newPost.channel_id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="New Post" showBack />

      <div className="p-6">
        <PostForm
          channels={channels}
          defaultChannelId={channelParam || undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    }>
      <NewPostContent />
    </Suspense>
  );
}
