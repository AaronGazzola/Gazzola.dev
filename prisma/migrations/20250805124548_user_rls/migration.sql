-- Drop all existing policies on user table
DROP POLICY IF EXISTS user_select_policy ON "user";
DROP POLICY IF EXISTS user_insert_policy ON "user";
DROP POLICY IF EXISTS user_update_policy ON "user";
DROP POLICY IF EXISTS user_delete_policy ON "user";

-- Create restrictive user table policy
-- Only allow SELECT: admins can select any user row, users can select their own user row
-- All other operations (INSERT, UPDATE, DELETE) are blocked for everyone
CREATE POLICY user_select_policy ON "user"
  FOR SELECT
  USING (
    is_admin() OR id = current_user_id()
  );