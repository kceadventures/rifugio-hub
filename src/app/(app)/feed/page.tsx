'use client';

import { useEffect, useState } from 'react';
import { Hash } from 'lucide-react';
import { useLocation } from '@/providers/location-provider';
import { getPostsByLocation } from '@/lib/mock/mock-db';
import { FeedCard } from '@/components/feed/feed-card';
import { FeedSection } from '@/components/feed/feed-section';
import { PinnedBanner } from '@/components/feed/pinned-banner';
import { EmptyState } from '@/components/ui/empty-state';
import { isToday, isThisWeek } from '@/lib/utils';
import type { Post } from '@/lib/types';

export default function FeedPage() {
  const { currentLocation } = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentLocation) {
      const fetchedPosts = getPostsByLocation(currentLocation.id);
      setPosts(fetchedPosts);
      setLoading(false);
    }
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  const pinnedPosts = posts.filter((post) => post.is_pinned);
  const todayPosts = posts.filter((post) => !post.is_pinned && isToday(post.created_at));
  const thisWeekPosts = posts.filter(
    (post) => !post.is_pinned && !isToday(post.created_at) && isThisWeek(post.created_at)
  );

  const hasAnyPosts = posts.length > 0;

  if (!hasAnyPosts) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="font-display text-3xl font-bold mb-8">Feed</h1>
        <EmptyState
          icon={Hash}
          title="Nothing yet"
          description="Posts from your clubhouse will appear here"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6">
        <h1 className="font-display text-3xl font-bold mb-8">Feed</h1>
      </div>

      {pinnedPosts.length > 0 && <PinnedBanner posts={pinnedPosts} />}

      {todayPosts.length > 0 && (
        <FeedSection title="Today">
          {todayPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </FeedSection>
      )}

      {thisWeekPosts.length > 0 && (
        <FeedSection title="This Week">
          {thisWeekPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </FeedSection>
      )}

      {todayPosts.length === 0 && thisWeekPosts.length === 0 && pinnedPosts.length > 0 && (
        <div className="p-6">
          <EmptyState
            icon={Hash}
            title="No recent posts"
            description="Check back later for new updates"
          />
        </div>
      )}
    </div>
  );
}
