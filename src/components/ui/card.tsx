import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Card({ children, className, padding = 'md', href }: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const baseClasses = cn(
    'bg-surface-elevated rounded-2xl border border-border-subtle',
    paddingClasses[padding],
    href && 'hover:border-border transition',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
