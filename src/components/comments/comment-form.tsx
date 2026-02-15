'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentFormProps {
  onSubmit: (body: string) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) return;

    onSubmit(body.trim());
    setBody('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-elevated border-t border-border-subtle p-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted"
        />
        <Button type="submit" variant="primary" size="md">
          <Send size={16} />
        </Button>
      </div>
    </form>
  );
}
