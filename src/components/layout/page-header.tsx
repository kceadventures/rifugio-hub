'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export function PageHeader({ title, showBack = false }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="py-4 px-5">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6 text-ink" />
          </button>
        )}
        <h1 className="font-display text-2xl text-ink">{title}</h1>
      </div>
    </header>
  );
}
