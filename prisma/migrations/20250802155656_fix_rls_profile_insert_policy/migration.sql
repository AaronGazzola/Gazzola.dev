-- Fix profile insert policy to be admin-only
-- Users should not be able to create new profile records via direct database operations
-- Profile creation should be handled through application logic during user registration

DROP POLICY IF EXISTS profile_insert_policy ON "profile";

CREATE POLICY profile_insert_policy ON "profile"
    FOR INSERT WITH CHECK (
        is_current_user_admin()
    );