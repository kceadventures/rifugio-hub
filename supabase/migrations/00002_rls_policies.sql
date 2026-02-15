-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_customers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Anyone authenticated can view all profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- LOCATIONS POLICIES
-- =====================================================

-- All authenticated users can view locations
CREATE POLICY "Locations are viewable by authenticated users"
  ON locations FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert locations
CREATE POLICY "Admins can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update locations
CREATE POLICY "Admins can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- MEMBER_LOCATIONS POLICIES
-- =====================================================

-- Users can view their own location memberships
CREATE POLICY "Users can view their own location memberships"
  ON member_locations FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Admins can view all location memberships
CREATE POLICY "Admins can view all location memberships"
  ON member_locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can join locations
CREATE POLICY "Users can join locations"
  ON member_locations FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Users can update their own memberships
CREATE POLICY "Users can update their own memberships"
  ON member_locations FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Users can leave locations
CREATE POLICY "Users can leave locations"
  ON member_locations FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());

-- Admins can manage all memberships
CREATE POLICY "Admins can manage all memberships"
  ON member_locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- CHANNELS POLICIES
-- =====================================================

-- Authenticated users can view channels for their locations
CREATE POLICY "Users can view channels for their locations"
  ON channels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM member_locations
      WHERE member_locations.profile_id = auth.uid()
      AND member_locations.location_id = channels.location_id
    )
  );

-- Admins and staff can create channels
CREATE POLICY "Admins and staff can create channels"
  ON channels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Admins and staff can update channels
CREATE POLICY "Admins and staff can update channels"
  ON channels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- =====================================================
-- POSTS POLICIES
-- =====================================================

-- Users can view posts in channels they're members of
CREATE POLICY "Users can view posts in their location channels"
  ON posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM channels
      INNER JOIN member_locations ON member_locations.location_id = channels.location_id
      WHERE channels.id = posts.channel_id
      AND member_locations.profile_id = auth.uid()
    )
  );

-- Authenticated users can create posts in their location channels
CREATE POLICY "Users can create posts in their location channels"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM channels
      INNER JOIN member_locations ON member_locations.location_id = channels.location_id
      WHERE channels.id = posts.channel_id
      AND member_locations.profile_id = auth.uid()
    )
  );

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Admins and staff can update any post
CREATE POLICY "Admins and staff can update any post"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Admins and staff can delete any post
CREATE POLICY "Admins and staff can delete any post"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- =====================================================
-- COMMENTS POLICIES
-- =====================================================

-- Users can view comments on posts they can view
CREATE POLICY "Users can view comments on visible posts"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      INNER JOIN channels ON channels.id = posts.channel_id
      INNER JOIN member_locations ON member_locations.location_id = channels.location_id
      WHERE posts.id = comments.post_id
      AND member_locations.profile_id = auth.uid()
    )
  );

-- Users can create comments on posts they can view
CREATE POLICY "Users can create comments on visible posts"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM posts
      INNER JOIN channels ON channels.id = posts.channel_id
      INNER JOIN member_locations ON member_locations.location_id = channels.location_id
      WHERE posts.id = comments.post_id
      AND member_locations.profile_id = auth.uid()
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Admins and staff can delete any comment
CREATE POLICY "Admins and staff can delete any comment"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- =====================================================
-- CONVERSATIONS POLICIES
-- =====================================================

-- Users can view conversations they're part of
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    participant_one = auth.uid() OR participant_two = auth.uid()
  );

-- Users can create conversations with others
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    participant_one = auth.uid() OR participant_two = auth.uid()
  );

-- =====================================================
-- DIRECT_MESSAGES POLICIES
-- =====================================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view their direct messages"
  ON direct_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = direct_messages.conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send direct messages"
  ON direct_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = direct_messages.conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  );

-- Users can update read status on messages in their conversations
CREATE POLICY "Users can update message read status"
  ON direct_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = direct_messages.conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = direct_messages.conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  );

-- =====================================================
-- SHOPIFY_CUSTOMERS POLICIES
-- =====================================================

-- Users can view their own Shopify customer record
CREATE POLICY "Users can view their own Shopify record"
  ON shopify_customers FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Only admins can manage Shopify customer records
CREATE POLICY "Admins can manage Shopify records"
  ON shopify_customers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
