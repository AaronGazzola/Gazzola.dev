-- Enable RLS on file_upload table
ALTER TABLE "file_upload" ENABLE ROW LEVEL SECURITY;

-- Grant permissions to app_user
GRANT SELECT, INSERT, UPDATE, DELETE ON "file_upload" TO "app_user";

-- RLS policy for file_upload: SELECT (admin OR conversation participant through message)
CREATE POLICY "file_upload_select_policy" ON "file_upload" FOR SELECT 
  USING (
    is_admin() OR 
    -- User is participant in the conversation containing the message with this file
    EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "conversation".id = "message"."conversationId"
      WHERE "message".id = "file_upload"."messageId" 
      AND current_user_id() = ANY("conversation".participants)
    )
  );

-- RLS policy for file_upload: INSERT (admin OR conversation participant through message)
CREATE POLICY "file_upload_insert_policy" ON "file_upload" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    -- User is participant in the conversation containing the message with this file
    EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "conversation".id = "message"."conversationId"
      WHERE "message".id = "file_upload"."messageId" 
      AND current_user_id() = ANY("conversation".participants)
    )
  );

-- RLS policy for file_upload: UPDATE (admin OR conversation participant through message)
CREATE POLICY "file_upload_update_policy" ON "file_upload" FOR UPDATE 
  USING (
    is_admin() OR 
    -- User is participant in the conversation containing the message with this file
    EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "conversation".id = "message"."conversationId"
      WHERE "message".id = "file_upload"."messageId" 
      AND current_user_id() = ANY("conversation".participants)
    )
  );

-- RLS policy for file_upload: DELETE (admin OR conversation participant through message)
CREATE POLICY "file_upload_delete_policy" ON "file_upload" FOR DELETE 
  USING (
    is_admin() OR 
    -- User is participant in the conversation containing the message with this file
    EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "conversation".id = "message"."conversationId"
      WHERE "message".id = "file_upload"."messageId" 
      AND current_user_id() = ANY("conversation".participants)
    )
  );