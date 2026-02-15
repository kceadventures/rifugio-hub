import { ExternalLink } from 'lucide-react';

interface BookingLinkProps {
  url: string;
  label?: string;
}

export function BookingLink({ url, label = 'Book This Activity' }: BookingLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-accent text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-accent-hover transition"
    >
      {label}
      <ExternalLink size={14} />
    </a>
  );
}
