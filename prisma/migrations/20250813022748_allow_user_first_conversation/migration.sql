-- Create function to check if current user already has a conversation
CREATE OR REPLACE FUNCTION user_has_conversation() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "conversation" 
    WHERE current_user_id() = ANY(participants)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing conversation insert policy
DROP POLICY IF EXISTS "conversation_insert_policy" ON "conversation";

-- Create new conversation insert policy that allows users to insert their first conversation
CREATE POLICY "conversation_insert_policy" ON "conversation" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    (
      NOT user_has_conversation() AND 
      current_user_id() = ANY(participants)
    )
  );