'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/providers/location-provider';
import { getChannelsByLocation, getPostsByChannel } from '@/lib/db';
import { ChannelListItem } from '@/components/channels/channel-list-item';
import type { Channel, Post } from '@/lib/types';

export default function ChannelsPage() {
  const { currentLocation } = useLocation();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelPosts, setChannelPosts] = useState<Map<string, Post>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (currentLocation) {
        const fetchedChannels = await getChannelsByLocation(currentLocation.id);
        setChannels(fetchedChannels);

        const postsMap = new Map<string, Post>();
        for (const channel of fetchedChannels) {
          const posts = await getPostsByChannel(channel.id);
          if (posts.length > 0) {
            postsMap.set(channel.id, posts[0]);
          }
        }
        setChannelPosts(postsMap);
        setLoading(false);
      }
    }
    load();
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6">
        <h1 className="font-display text-3xl font-bold mb-8">Channels</h1>
      </div>

      <div className="divide-y divide-border-subtle">
        {channels.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            lastPost={channelPosts.get(channel.id)}
          />
        ))}
      </div>
    </div>
  );
}
