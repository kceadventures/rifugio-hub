-- Fix member_locations RLS: allow users to see all members at locations they belong to.
-- The original policy only let users see their own rows, which broke the Members page
-- and any query that joins through member_locations.

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Users can view their own location memberships" ON member_locations;

-- Replace with: users can see memberships at any location they also belong to
CREATE POLICY "Users can view memberships at their locations"
  ON member_locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM member_locations ml
      WHERE ml.profile_id = auth.uid()
      AND ml.location_id = member_locations.location_id
    )
  );
