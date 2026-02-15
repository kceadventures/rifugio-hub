-- Seed Rifugio Darling Hill location
INSERT INTO locations (name, slug, address, city, state, timezone, color_theme)
VALUES (
  'Rifugio Darling Hill',
  'darling-hill',
  '2099 Darling Hill Rd',
  'Lyndonville',
  'VT',
  'America/New_York',
  'darling-hill'
);

-- Seed Rifugio Litchfield Hills location
INSERT INTO locations (name, slug, address, city, state, timezone, color_theme)
VALUES (
  'Rifugio Litchfield Hills',
  'litchfield-hills',
  '461 Bantam Rd',
  'Litchfield',
  'CT',
  'America/New_York',
  'litchfield-hills'
);

-- Create channels for Darling Hill
INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'rides'::channel_category,
  'Rides',
  'Cycling rides and bike events',
  1
FROM locations WHERE slug = 'darling-hill';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'runs'::channel_category,
  'Runs',
  'Running groups and trail runs',
  2
FROM locations WHERE slug = 'darling-hill';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'yoga-wellness'::channel_category,
  'Yoga & Wellness',
  'Yoga classes, wellness activities, and mindfulness',
  3
FROM locations WHERE slug = 'darling-hill';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'announcements'::channel_category,
  'Announcements',
  'Important updates and news from Rifugio',
  4
FROM locations WHERE slug = 'darling-hill';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'social'::channel_category,
  'Social',
  'Community events and social gatherings',
  5
FROM locations WHERE slug = 'darling-hill';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'general'::channel_category,
  'General',
  'General discussion and community chat',
  6
FROM locations WHERE slug = 'darling-hill';

-- Create channels for Litchfield Hills
INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'rides'::channel_category,
  'Rides',
  'Cycling rides and bike events',
  1
FROM locations WHERE slug = 'litchfield-hills';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'runs'::channel_category,
  'Runs',
  'Running groups and trail runs',
  2
FROM locations WHERE slug = 'litchfield-hills';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'yoga-wellness'::channel_category,
  'Yoga & Wellness',
  'Yoga classes, wellness activities, and mindfulness',
  3
FROM locations WHERE slug = 'litchfield-hills';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'announcements'::channel_category,
  'Announcements',
  'Important updates and news from Rifugio',
  4
FROM locations WHERE slug = 'litchfield-hills';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'social'::channel_category,
  'Social',
  'Community events and social gatherings',
  5
FROM locations WHERE slug = 'litchfield-hills';

INSERT INTO channels (location_id, category, name, description, sort_order)
SELECT
  id,
  'general'::channel_category,
  'General',
  'General discussion and community chat',
  6
FROM locations WHERE slug = 'litchfield-hills';
