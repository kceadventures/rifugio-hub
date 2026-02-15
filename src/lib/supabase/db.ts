import { supabase } from './client';
import type {
  Location,
  Profile,
  Channel,
  Post,
  Comment,
  Conversation,
  DirectMessage,
} from '@/lib/types';

// ── Location queries ───────────────────────────────────────

export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*');

  if (error) throw error;
  return data ?? [];
}

export async function getLocation(id: string): Promise<Location | undefined> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? undefined;
}

// ── Profile queries ────────────────────────────────────────

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) throw error;
  return data ?? [];
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? undefined;
}

export async function getProfilesByLocation(locationId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('member_locations')
    .select('profile_id, profiles(*)')
    .eq('location_id', locationId);

  if (error) throw error;
  // Supabase returns the joined table as an array; grab the first (only) entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.profiles).flat().filter(Boolean) as Profile[];
}

// ── Channel queries ────────────────────────────────────────

export async function getChannelsByLocation(locationId: string): Promise<Channel[]> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('location_id', locationId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getChannel(id: string): Promise<Channel | undefined> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? undefined;
}

// ── Post queries ───────────────────────────────────────────

export async function getPostsByChannel(channelId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles!author_id(*), channel:channels!channel_id(*), comments(count)')
    .eq('channel_id', channelId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    comment_count: row.comments?.[0]?.count ?? 0,
    comments: undefined,
  }));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles!author_id(*), channel:channels!channel_id(*), comments(count)')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return undefined;

  return {
    ...data,
    comment_count: data.comments?.[0]?.count ?? 0,
    comments: undefined,
  };
}

export async function getPostsByLocation(locationId: string): Promise<Post[]> {
  // First get channels for this location
  const { data: channelData, error: channelError } = await supabase
    .from('channels')
    .select('id')
    .eq('location_id', locationId);

  if (channelError) throw channelError;

  const channelIds = (channelData ?? []).map((c: { id: string }) => c.id);
  if (channelIds.length === 0) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles!author_id(*), channel:channels!channel_id(*), comments(count)')
    .in('channel_id', channelIds)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    comment_count: row.comments?.[0]?.count ?? 0,
    comments: undefined,
  }));
}

export async function addPost(
  post: Omit<Post, 'id' | 'created_at' | 'updated_at'>
): Promise<Post> {
  // Strip any joined fields before inserting
  const { author, channel, comment_count, ...insertData } = post as Post;

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Comment queries ────────────────────────────────────────

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:profiles!author_id(*)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addComment(
  comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>
): Promise<Comment> {
  // Strip any joined fields before inserting
  const { author, ...insertData } = comment as Comment;

  const { data, error } = await supabase
    .from('comments')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Conversation queries ───────────────────────────────────

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Enrich each conversation with other_participant and last_message
  const conversations = data ?? [];
  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const otherId =
        conv.participant_one === userId
          ? conv.participant_two
          : conv.participant_one;

      // Fetch other participant profile
      const { data: otherProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherId)
        .single();

      // Fetch the most recent message in the conversation
      const { data: lastMessages } = await supabase
        .from('direct_messages')
        .select('*, sender:profiles!sender_id(*)')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        ...conv,
        other_participant: otherProfile ?? undefined,
        last_message: lastMessages?.[0] ?? undefined,
      };
    })
  );

  return enriched;
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? undefined;
}

export async function getMessagesByConversation(
  conversationId: string
): Promise<DirectMessage[]> {
  const { data, error } = await supabase
    .from('direct_messages')
    .select('*, sender:profiles!sender_id(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addMessage(
  msg: Omit<DirectMessage, 'id' | 'created_at'>
): Promise<DirectMessage> {
  // Strip any joined fields before inserting
  const { sender, ...insertData } = msg as DirectMessage;

  const { data, error } = await supabase
    .from('direct_messages')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;

  // Update conversation timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', msg.conversation_id);

  return data;
}

export async function getOrCreateConversation(
  userA: string,
  userB: string
): Promise<Conversation> {
  // Ensure participant_one < participant_two (alphabetical) to match DB constraint
  const [p1, p2] = [userA, userB].sort();

  // Try to find existing conversation
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('participant_one', p1)
    .eq('participant_two', p2)
    .single();

  if (existing) return existing;
  if (findError && findError.code !== 'PGRST116') throw findError;

  // Create new conversation
  const { data: newConv, error: createError } = await supabase
    .from('conversations')
    .insert({ participant_one: p1, participant_two: p2 })
    .select()
    .single();

  if (createError) throw createError;
  return newConv;
}
