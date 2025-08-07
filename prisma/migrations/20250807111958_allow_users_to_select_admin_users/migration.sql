-- Drop the existing user select policy
DROP POLICY IF EXISTS "user_select_policy" ON "user";

-- Create new user select policy that allows any user to select admin users
CREATE POLICY "user_select_policy" ON "user" FOR SELECT 
  USING (
    -- Own user record: can access all columns
    id = current_user_id() OR 
    -- Admin users: can access all columns
    is_admin() OR
    -- Admin users queried by non-admin users: only basic access (for role lookup)
    (role = 'admin' AND NOT is_admin())
  );