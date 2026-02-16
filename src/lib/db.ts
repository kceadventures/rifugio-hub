// Unified data layer — switches between mock and Supabase based on NEXT_PUBLIC_DEMO_MODE
//
// IMPORTANT: We use dynamic import() for supabase/db so that the Supabase client
// is never instantiated in demo mode (where SUPABASE_URL is not set).

import * as mockDb from "./mock/mock-db";
import type {
  Location,
  Profile,
  Channel,
  Post,
  Comment,
  Conversation,
  DirectMessage,
} from "./types";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Lazy-load the Supabase DB module only when needed
let _supabaseDb: typeof import("./supabase/db") | null = null;
async function getSupabaseDb() {
  if (!_supabaseDb) {
    _supabaseDb = await import("./supabase/db");
  }
  return _supabaseDb;
}

// ── Location queries ───────────────────────────────────────

export async function getLocations(): Promise<Location[]> {
  if (isDemoMode) return mockDb.getLocations();
  const sb = await getSupabaseDb();
  return sb.getLocations();
}

export async function getLocation(id: string): Promise<Location | undefined> {
  if (isDemoMode) return mockDb.getLocation(id);
  const sb = await getSupabaseDb();
  return sb.getLocation(id);
}

// ── Profile queries ────────────────────────────────────────

export async function getProfiles(): Promise<Profile[]> {
  if (isDemoMode) return mockDb.getProfiles();
  const sb = await getSupabaseDb();
  return sb.getProfiles();
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  if (isDemoMode) return mockDb.getProfile(id);
  const sb = await getSupabaseDb();
  return sb.getProfile(id);
}

export async function getProfilesByLocation(
  locationId: string
): Promise<Profile[]> {
  if (isDemoMode) return mockDb.getProfilesByLocation(locationId);
  const sb = await getSupabaseDb();
  return sb.getProfilesByLocation(locationId);
}

export async function getLocationsByUser(
  userId: string
): Promise<{ location_id: string; is_primary: boolean }[]> {
  if (isDemoMode) {
    // In demo mode, return mock member_locations
    const { SEED_MEMBER_LOCATIONS } = await import("./mock/seed-data");
    return SEED_MEMBER_LOCATIONS.filter((ml) => ml.profile_id === userId).map(
      (ml) => ({ location_id: ml.location_id, is_primary: ml.is_primary })
    );
  }
  const sb = await getSupabaseDb();
  return sb.getLocationsByUser(userId);
}

// ── Channel queries ────────────────────────────────────────

export async function getChannelsByLocation(
  locationId: string
): Promise<Channel[]> {
  if (isDemoMode) return mockDb.getChannelsByLocation(locationId);
  const sb = await getSupabaseDb();
  return sb.getChannelsByLocation(locationId);
}

export async function getChannel(id: string): Promise<Channel | undefined> {
  if (isDemoMode) return mockDb.getChannel(id);
  const sb = await getSupabaseDb();
  return sb.getChannel(id);
}

// ── Post queries ───────────────────────────────────────────

export async function getPostsByChannel(channelId: string): Promise<Post[]> {
  if (isDemoMode) return mockDb.getPostsByChannel(channelId);
  const sb = await getSupabaseDb();
  return sb.getPostsByChannel(channelId);
}

export async function getPost(id: string): Promise<Post | undefined> {
  if (isDemoMode) return mockDb.getPost(id);
  const sb = await getSupabaseDb();
  return sb.getPost(id);
}

export async function getPostsByLocation(
  locationId: string
): Promise<Post[]> {
  if (isDemoMode) return mockDb.getPostsByLocation(locationId);
  const sb = await getSupabaseDb();
  return sb.getPostsByLocation(locationId);
}

export async function addPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">
): Promise<Post> {
  if (isDemoMode) return mockDb.addPost(post);
  const sb = await getSupabaseDb();
  return sb.addPost(post);
}

// ── Comment queries ────────────────────────────────────────

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  if (isDemoMode) return mockDb.getCommentsByPost(postId);
  const sb = await getSupabaseDb();
  return sb.getCommentsByPost(postId);
}

export async function addComment(
  comment: Omit<Comment, "id" | "created_at" | "updated_at">
): Promise<Comment> {
  if (isDemoMode) return mockDb.addComment(comment);
  const sb = await getSupabaseDb();
  return sb.addComment(comment);
}

// ── Conversation queries ───────────────────────────────────

export async function getConversationsForUser(
  userId: string
): Promise<Conversation[]> {
  if (isDemoMode) return mockDb.getConversationsForUser(userId);
  const sb = await getSupabaseDb();
  return sb.getConversationsForUser(userId);
}

export async function getConversation(
  id: string
): Promise<Conversation | undefined> {
  if (isDemoMode) return mockDb.getConversation(id);
  const sb = await getSupabaseDb();
  return sb.getConversation(id);
}

export async function getMessagesByConversation(
  conversationId: string
): Promise<DirectMessage[]> {
  if (isDemoMode) return mockDb.getMessagesByConversation(conversationId);
  const sb = await getSupabaseDb();
  return sb.getMessagesByConversation(conversationId);
}

export async function addMessage(
  msg: Omit<DirectMessage, "id" | "created_at">
): Promise<DirectMessage> {
  if (isDemoMode) return mockDb.addMessage(msg);
  const sb = await getSupabaseDb();
  return sb.addMessage(msg);
}

export async function getOrCreateConversation(
  userA: string,
  userB: string
): Promise<Conversation> {
  if (isDemoMode) return mockDb.getOrCreateConversation(userA, userB);
  const sb = await getSupabaseDb();
  return sb.getOrCreateConversation(userA, userB);
}
