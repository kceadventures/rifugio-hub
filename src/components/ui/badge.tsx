import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'muted';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full font-medium inline-flex items-center text-xs',
        variant === 'default' && 'bg-surface border border-border text-ink',
        variant === 'accent' && 'bg-accent/10 text-accent',
        variant === 'muted' && 'bg-surface text-ink-muted',
        className
      )}
    >
      {children}
    </span>
  );
}
