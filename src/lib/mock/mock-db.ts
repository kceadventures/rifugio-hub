import {
  SEED_LOCATIONS,
  SEED_PROFILES,
  SEED_MEMBER_LOCATIONS,
  SEED_CHANNELS,
  SEED_POSTS,
  SEED_COMMENTS,
  SEED_CONVERSATIONS,
  SEED_DIRECT_MESSAGES,
} from "./seed-data";
import type {
  Location,
  Profile,
  Channel,
  Post,
  Comment,
  Conversation,
  DirectMessage,
} from "../types";

// Mutable copies
const locations = [...SEED_LOCATIONS];
const profiles = [...SEED_PROFILES];
const memberLocations = [...SEED_MEMBER_LOCATIONS];
const channels = [...SEED_CHANNELS];
let posts = [...SEED_POSTS];
let comments = [...SEED_COMMENTS];
let conversations = [...SEED_CONVERSATIONS];
let directMessages = [...SEED_DIRECT_MESSAGES];

// ── Location queries ───────────────────────────────────────

export function getLocations(): Location[] {
  return [...locations];
}

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

// ── Profile queries ────────────────────────────────────────

export function getProfiles(): Profile[] {
  return [...profiles];
}

export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function getProfilesByLocation(locationId: string): Profile[] {
  const memberIds = memberLocations
    .filter((ml) => ml.location_id === locationId)
    .map((ml) => ml.profile_id);
  return profiles.filter((p) => memberIds.includes(p.id));
}

// ── Channel queries ────────────────────────────────────────

export function getChannelsByLocation(locationId: string): Channel[] {
  return channels
    .filter((c) => c.location_id === locationId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getChannel(id: string): Channel | undefined {
  return channels.find((c) => c.id === id);
}

// ── Post queries ───────────────────────────────────────────

function enrichPost(post: Post) {
  const author = profiles.find((p) => p.id === post.author_id);
  const channel = channels.find((c) => c.id === post.channel_id);
  const comment_count = comments.filter((c) => c.post_id === post.id).length;
  return { ...post, author, channel, comment_count };
}

export function getPostsByChannel(channelId: string) {
  return posts
    .filter((p) => p.channel_id === channelId)
    .map(enrichPost)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function getPost(id: string) {
  const post = posts.find((p) => p.id === id);
  if (!post) return undefined;
  return enrichPost(post);
}

export function getPostsByLocation(locationId: string) {
  const channelIds = channels
    .filter((c) => c.location_id === locationId)
    .map((c) => c.id);
  return posts
    .filter((p) => channelIds.includes(p.channel_id))
    .map(enrichPost)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function addPost(post: Omit<Post, "id" | "created_at" | "updated_at">): Post {
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  posts = [newPost, ...posts];
  return newPost;
}

// ── Comment queries ────────────────────────────────────────

export function getCommentsByPost(postId: string) {
  return comments
    .filter((c) => c.post_id === postId)
    .map((c) => ({
      ...c,
      author: profiles.find((p) => p.id === c.author_id),
    }))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export function addComment(
  comment: Omit<Comment, "id" | "created_at" | "updated_at">
): Comment {
  const newComment: Comment = {
    ...comment,
    id: `cmt-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  comments = [...comments, newComment];
  return newComment;
}

// ── Conversation queries ───────────────────────────────────

export function getConversationsForUser(userId: string) {
  return conversations
    .filter(
      (c) => c.participant_one === userId || c.participant_two === userId
    )
    .map((conv) => {
      const otherId =
        conv.participant_one === userId
          ? conv.participant_two
          : conv.participant_one;
      const other_participant = profiles.find((p) => p.id === otherId);
      const msgs = directMessages
        .filter((m) => m.conversation_id === conv.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      return {
        ...conv,
        other_participant,
        last_message: msgs[0],
      };
    })
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
}

export function getConversation(id: string) {
  return conversations.find((c) => c.id === id);
}

export function getMessagesByConversation(conversationId: string) {
  return directMessages
    .filter((m) => m.conversation_id === conversationId)
    .map((m) => ({
      ...m,
      sender: profiles.find((p) => p.id === m.sender_id),
    }))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export function addMessage(
  msg: Omit<DirectMessage, "id" | "created_at">
): DirectMessage {
  const newMsg: DirectMessage = {
    ...msg,
    id: `dm-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  directMessages = [...directMessages, newMsg];

  // Update conversation timestamp
  conversations = conversations.map((c) =>
    c.id === msg.conversation_id
      ? { ...c, updated_at: new Date().toISOString() }
      : c
  );
  return newMsg;
}

export function getOrCreateConversation(
  userA: string,
  userB: string
): Conversation {
  const existing = conversations.find(
    (c) =>
      (c.participant_one === userA && c.participant_two === userB) ||
      (c.participant_one === userB && c.participant_two === userA)
  );
  if (existing) return existing;

  const [p1, p2] = [userA, userB].sort();
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    participant_one: p1,
    participant_two: p2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  conversations = [...conversations, newConv];
  return newConv;
}
