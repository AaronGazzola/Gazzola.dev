-- Create function to get current user ID from session variable
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "user" 
    WHERE id = current_user_id() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "task" ENABLE ROW LEVEL SECURITY;

-- Grant permissions to app_user
GRANT CONNECT ON DATABASE neondb TO "app_user";
GRANT USAGE ON SCHEMA public TO "app_user";

-- User: only SELECT (no insert/update/delete policies)
GRANT SELECT ON "user" TO "app_user";

-- Profile: SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON "profile" TO "app_user";

-- Conversation: SELECT, UPDATE, INSERT, DELETE
GRANT SELECT, UPDATE, INSERT, DELETE ON "conversation" TO "app_user";

-- Message: SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON "message" TO "app_user";

-- Contract: SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON "contract" TO "app_user";

-- Task: SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON "task" TO "app_user";

-- Sequences needed for INSERT operations
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "app_user";

-- User policies: SELECT only (own user or admin)
CREATE POLICY "user_select_policy" ON "user" FOR SELECT 
  USING (id = current_user_id() OR is_admin());

-- Profile policies: SELECT/INSERT/UPDATE (related user or admin), DELETE (admin only)
CREATE POLICY "profile_select_policy" ON "profile" FOR SELECT 
  USING ("userId" = current_user_id() OR is_admin());

CREATE POLICY "profile_insert_policy" ON "profile" FOR INSERT 
  WITH CHECK ("userId" = current_user_id() OR is_admin());

CREATE POLICY "profile_update_policy" ON "profile" FOR UPDATE 
  USING ("userId" = current_user_id() OR is_admin());

CREATE POLICY "profile_delete_policy" ON "profile" FOR DELETE 
  USING (is_admin());

-- Conversation policies: SELECT/UPDATE (participant or admin), INSERT/DELETE (admin only)
CREATE POLICY "conversation_select_policy" ON "conversation" FOR SELECT 
  USING (current_user_id() = ANY(participants) OR is_admin());

CREATE POLICY "conversation_update_policy" ON "conversation" FOR UPDATE 
  USING (current_user_id() = ANY(participants) OR is_admin());

CREATE POLICY "conversation_insert_policy" ON "conversation" FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "conversation_delete_policy" ON "conversation" FOR DELETE 
  USING (is_admin());

-- Message policies: SELECT/INSERT (conversation participant or admin), UPDATE/DELETE (admin only)
CREATE POLICY "message_select_policy" ON "message" FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM "conversation" 
      WHERE "conversation".id = "message"."conversationId" 
      AND (current_user_id() = ANY("conversation".participants) OR is_admin())
    )
  );

CREATE POLICY "message_insert_policy" ON "message" FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "conversation" 
      WHERE "conversation".id = "message"."conversationId" 
      AND (current_user_id() = ANY("conversation".participants) OR is_admin())
    )
  );

CREATE POLICY "message_update_policy" ON "message" FOR UPDATE 
  USING (is_admin());

CREATE POLICY "message_delete_policy" ON "message" FOR DELETE 
  USING (is_admin());

-- Contract policies
CREATE POLICY "contract_select_policy" ON "contract" FOR SELECT 
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "profile" 
      WHERE "profile".id = "contract"."profileId" 
      AND "profile"."userId" = current_user_id()
    )
  );

CREATE POLICY "contract_insert_policy" ON "contract" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "profile" 
      WHERE "profile".id = "contract"."profileId" 
      AND "profile"."userId" = current_user_id()
    )
  );

CREATE POLICY "contract_update_policy" ON "contract" FOR UPDATE 
  USING (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "profile" 
        WHERE "profile".id = "contract"."profileId" 
        AND "profile"."userId" = current_user_id()
      ) AND "isPaid" = false
    )
  );

CREATE POLICY "contract_delete_policy" ON "contract" FOR DELETE 
  USING (is_admin());

-- Task policies
CREATE POLICY "task_select_policy" ON "task" FOR SELECT 
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

CREATE POLICY "task_insert_policy" ON "task" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
      AND "contract"."isPaid" = false
    )
  );

CREATE POLICY "task_update_policy" ON "task" FOR UPDATE 
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
      AND "contract"."isPaid" = false
    )
  );

CREATE POLICY "task_delete_policy" ON "task" FOR DELETE 
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
      AND "contract"."isPaid" = false
    )
  );