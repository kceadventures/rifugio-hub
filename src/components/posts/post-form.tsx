'use client';

import { useState } from 'react';
import type { Channel } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface PostFormProps {
  channels: Channel[];
  defaultChannelId?: string;
  onSubmit: (data: {
    channelId: string;
    title?: string;
    body: string;
    bookingUrl?: string;
  }) => void;
}

export function PostForm({ channels, defaultChannelId, onSubmit }: PostFormProps) {
  const [channelId, setChannelId] = useState(defaultChannelId || channels[0]?.id || '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim() || !channelId) return;

    onSubmit({
      channelId,
      title: title.trim() || undefined,
      body: body.trim(),
      bookingUrl: bookingUrl.trim() || undefined,
    });

    setTitle('');
    setBody('');
    setBookingUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="channel" className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
          Channel
        </label>
        <select
          id="channel"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink"
          required
        >
          {channels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
          Title (Optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
          Message
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening?"
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted resize-none"
          required
        />
      </div>

      <div>
        <label htmlFor="bookingUrl" className="block text-xs uppercase tracking-wider text-ink-muted mb-2">
          Booking Link (Optional)
        </label>
        <input
          id="bookingUrl"
          type="url"
          value={bookingUrl}
          onChange={(e) => setBookingUrl(e.target.value)}
          placeholder="Peek Pro booking link (optional)"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted"
        />
      </div>

      <Button type="submit" variant="primary" size="md">
        Post
      </Button>
    </form>
  );
}
