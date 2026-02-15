import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <Icon className="w-12 h-12 text-ink-muted/30 mb-4" strokeWidth={1.5} />
      <h3 className="font-medium text-ink mb-2">{title}</h3>
      <p className="text-ink-muted text-sm mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
