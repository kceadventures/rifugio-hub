import type { ReactNode } from 'react';

interface FeedSectionProps {
  title: string;
  children: ReactNode;
}

export function FeedSection({ title, children }: FeedSectionProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3 px-5">
        {title}
      </h2>
      {children}
    </section>
  );
}
