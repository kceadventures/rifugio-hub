import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-11 px-4 rounded-xl border border-border bg-surface-elevated text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent transition text-base',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
