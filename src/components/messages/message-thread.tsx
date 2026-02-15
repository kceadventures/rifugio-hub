'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';
import type { DirectMessage } from '@/lib/types';

interface MessageThreadProps {
  messages: Array<DirectMessage & {
    sender?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  }>;
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.sender_id === currentUserId}
        />
      ))}
    </div>
  );
}
