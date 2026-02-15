import type { ChannelCategory } from "./types";

export const CHANNEL_META: Record<
  ChannelCategory,
  { label: string; icon: string; description: string }
> = {
  rides: {
    label: "Rides",
    icon: "Bike",
    description: "Road rides, gravel, MTB outings",
  },
  runs: {
    label: "Runs",
    icon: "Footprints",
    description: "Club runs, trail runs, track sessions",
  },
  "yoga-wellness": {
    label: "Yoga & Wellness",
    icon: "Heart",
    description: "Yoga, Pilates, sauna, recovery",
  },
  announcements: {
    label: "Announcements",
    icon: "Megaphone",
    description: "Important updates from the team",
  },
  social: {
    label: "Social",
    icon: "PartyPopper",
    description: "Events, gatherings, community fun",
  },
  general: {
    label: "General",
    icon: "MessageSquare",
    description: "Everything else",
  },
};

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  staff: "Instructor",
  member: "Member",
};
