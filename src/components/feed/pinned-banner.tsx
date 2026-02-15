import Link from 'next/link';
import type { Post } from '@/lib/types';

interface PinnedBannerProps {
  posts: Array<Post & {
    author?: {
      id: string;
      full_name: string;
    };
    channel?: {
      id: string;
      name: string;
    };
  }>;
}

export function PinnedBanner({ posts }: PinnedBannerProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/channels/${post.channel_id}/${post.id}`}
          className="block bg-accent/5 border-l-2 border-accent rounded-xl p-4 mx-5 mb-2 hover:bg-accent/10 transition"
        >
          <div className="flex items-start justify-between gap-3 mb-1">
            {post.title && (
              <h3 className="font-medium text-ink flex-1">{post.title}</h3>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-white font-medium flex-shrink-0">
              Pinned
            </span>
          </div>
          <p className="text-sm text-ink-muted line-clamp-2">{post.body}</p>
        </Link>
      ))}
    </div>
  );
}
