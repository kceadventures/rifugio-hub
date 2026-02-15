'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getMessagesByConversation, addMessage, getConversationsForUser } from '@/lib/db';
import { PageHeader } from '@/components/layout/page-header';
import { MessageThread } from '@/components/messages/message-thread';
import { MessageInput } from '@/components/messages/message-input';
import type { DirectMessage, Conversation } from '@/lib/types';

export default function ConversationPage() {
  const params = useParams();
  const { user } = useAuth();
  const conversationId = params.conversationId as string;

  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        const fetchedMessages = await getMessagesByConversation(conversationId);
        setMessages(fetchedMessages);

        const conversations = await getConversationsForUser(user.id);
        const currentConv = conversations.find((c) => c.id === conversationId);
        setConversation(currentConv || null);
        setLoading(false);
      }
    }
    load();
  }, [conversationId, user]);

  const handleSend = async (content: string) => {
    if (!user) return;

    const newMessage = await addMessage({
      conversation_id: conversationId,
      sender_id: user.id,
      body: content,
    });

    setMessages((prev) => [...prev, newMessage]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  const otherParticipantName = conversation?.other_participant?.full_name || 'User';

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      <PageHeader title={otherParticipantName} showBack />

      <div className="flex-1 overflow-y-auto">
        <MessageThread messages={messages} currentUserId={user?.id || ''} />
      </div>

      <div className="border-t border-border-subtle bg-surface-primary p-4">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
