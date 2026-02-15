-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Enable realtime for direct_messages
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;

-- Enable realtime for conversations
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
