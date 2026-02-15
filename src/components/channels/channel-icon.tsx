import {
  Bike,
  Footprints,
  Heart,
  Megaphone,
  PartyPopper,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';
import type { ChannelCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChannelIconProps {
  category: ChannelCategory;
  size?: number;
  className?: string;
}

const CATEGORY_ICONS: Record<ChannelCategory, LucideIcon> = {
  rides: Bike,
  runs: Footprints,
  'yoga-wellness': Heart,
  announcements: Megaphone,
  social: PartyPopper,
  general: MessageSquare,
};

export function ChannelIcon({ category, size = 20, className }: ChannelIconProps) {
  const Icon = CATEGORY_ICONS[category];

  return <Icon size={size} className={className} />;
}
