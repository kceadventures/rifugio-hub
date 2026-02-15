export type UserRole = "admin" | "staff" | "member";

export type ChannelCategory =
  | "rides"
  | "runs"
  | "yoga-wellness"
  | "announcements"
  | "social"
  | "general";

export interface Location {
  id: string;
  name: string;
  slug: string;
  address?: string;
  city: string;
  state: string;
  timezone: string;
  image_url?: string;
  color_theme?: "darling-hill" | "litchfield-hills";
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
}

export interface MemberLocation {
  id: string;
  profile_id: string;
  location_id: string;
  is_primary: boolean;
}

export interface Channel {
  id: string;
  location_id: string;
  category: ChannelCategory;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Post {
  id: string;
  channel_id: string;
  author_id: string;
  title?: string;
  body: string;
  image_url?: string;
  booking_url?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
  channel?: Channel;
  comment_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
}

export interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  updated_at: string;
  // Joined
  other_participant?: Profile;
  last_message?: DirectMessage;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at?: string;
  created_at: string;
  // Joined
  sender?: Profile;
}
