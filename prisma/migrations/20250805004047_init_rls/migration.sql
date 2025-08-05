-- Enable Row Level Security (RLS) on all tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "file_upload" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for USER table
-- Admin users can see all users, regular users can only see themselves
CREATE POLICY user_select_policy ON "user"
  FOR SELECT
  USING (
    is_admin() OR id = current_user_id()
  );

-- Admin users can insert any user, regular users cannot insert users (handled by auth system)
CREATE POLICY user_insert_policy ON "user"
  FOR INSERT
  WITH CHECK (is_admin());

-- Admin users can update any user, regular users can only update themselves
CREATE POLICY user_update_policy ON "user"
  FOR UPDATE
  USING (
    is_admin() OR id = current_user_id()
  );

-- Only admin users can delete users
CREATE POLICY user_delete_policy ON "user"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for SESSION table
-- Users can see their own sessions, admins can see all
CREATE POLICY session_select_policy ON "session"
  FOR SELECT
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- Sessions are managed by auth system
CREATE POLICY session_insert_policy ON "session"
  FOR INSERT
  WITH CHECK (
    is_admin() OR "userId" = current_user_id()
  );

CREATE POLICY session_update_policy ON "session"
  FOR UPDATE
  USING (
    is_admin() OR "userId" = current_user_id()
  );

CREATE POLICY session_delete_policy ON "session"
  FOR DELETE
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- RLS Policies for ACCOUNT table
-- Users can see their own accounts, admins can see all
CREATE POLICY account_select_policy ON "account"
  FOR SELECT
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- Accounts are managed by auth system
CREATE POLICY account_insert_policy ON "account"
  FOR INSERT
  WITH CHECK (
    is_admin() OR "userId" = current_user_id()
  );

CREATE POLICY account_update_policy ON "account"
  FOR UPDATE
  USING (
    is_admin() OR "userId" = current_user_id()
  );

CREATE POLICY account_delete_policy ON "account"
  FOR DELETE
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- RLS Policies for VERIFICATION table
-- Only admins can access verification records
CREATE POLICY verification_select_policy ON "verification"
  FOR SELECT
  USING (is_admin());

CREATE POLICY verification_insert_policy ON "verification"
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY verification_update_policy ON "verification"
  FOR UPDATE
  USING (is_admin());

CREATE POLICY verification_delete_policy ON "verification"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for PROFILE table
-- Users can see their own profile, admins can see all profiles
CREATE POLICY profile_select_policy ON "profile"
  FOR SELECT
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- Users can create their own profile, admins can create any profile
CREATE POLICY profile_insert_policy ON "profile"
  FOR INSERT
  WITH CHECK (
    is_admin() OR "userId" = current_user_id()
  );

-- Users can update their own profile, admins can update any profile
CREATE POLICY profile_update_policy ON "profile"
  FOR UPDATE
  USING (
    is_admin() OR "userId" = current_user_id()
  );

-- Only admins can delete profiles (based on test requirements)
CREATE POLICY profile_delete_policy ON "profile"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for CONTRACT table
-- Users can see contracts for their own profile, admins can see all
CREATE POLICY contract_select_policy ON "contract"
  FOR SELECT
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "profile" 
      WHERE "profile".id = "contract"."profileId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can create contracts for their own profile, admins can create any contract
CREATE POLICY contract_insert_policy ON "contract"
  FOR INSERT
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1 FROM "profile" 
      WHERE "profile".id = "profileId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can update unpaid contracts for their own profile, admins can update any contract
CREATE POLICY contract_update_policy ON "contract"
  FOR UPDATE
  USING (
    is_admin() OR (
      EXISTS (
        SELECT 1 FROM "profile" 
        WHERE "profile".id = "contract"."profileId" 
        AND "profile"."userId" = current_user_id()
      ) AND "isPaid" = false
    )
  );

-- Only admins can delete contracts (based on test requirements)
CREATE POLICY contract_delete_policy ON "contract"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for TASK table
-- Users can see tasks for contracts on their profile, admins can see all
CREATE POLICY task_select_policy ON "task"
  FOR SELECT
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can create tasks for contracts on their profile, admins can create any task
CREATE POLICY task_insert_policy ON "task"
  FOR INSERT
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can update tasks for contracts on their profile, admins can update any task
CREATE POLICY task_update_policy ON "task"
  FOR UPDATE
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Only admins can delete tasks (based on test requirements)
CREATE POLICY task_delete_policy ON "task"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for CONVERSATION table
-- Users can see conversations they participate in, admins can see all
CREATE POLICY conversation_select_policy ON "conversation"
  FOR SELECT
  USING (
    is_admin() OR current_user_id() = ANY("participants")
  );

-- Only admins can create conversations (based on test requirements)
CREATE POLICY conversation_insert_policy ON "conversation"
  FOR INSERT
  WITH CHECK (is_admin());

-- Users can update conversations they participate in, admins can update all
CREATE POLICY conversation_update_policy ON "conversation"
  FOR UPDATE
  USING (
    is_admin() OR current_user_id() = ANY("participants")
  );

-- Only admins can delete conversations (based on test requirements)
CREATE POLICY conversation_delete_policy ON "conversation"
  FOR DELETE
  USING (is_admin());

-- RLS Policies for MESSAGE table
-- Users can see messages in conversations they participate in, admins can see all
CREATE POLICY message_select_policy ON "message"
  FOR SELECT
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "conversation" 
      WHERE "conversation".id = "message"."conversationId" 
      AND current_user_id() = ANY("conversation"."participants")
    )
  );

-- Users can create messages in conversations they participate in, admins can create any message
CREATE POLICY message_insert_policy ON "message"
  FOR INSERT
  WITH CHECK (
    is_admin() OR (
      "senderId" = current_user_id() AND
      EXISTS (
        SELECT 1 FROM "conversation" 
        WHERE "conversation".id = "conversationId" 
        AND current_user_id() = ANY("conversation"."participants")
      )
    )
  );

-- Users can update their own messages in conversations they participate in, admins can update any message
CREATE POLICY message_update_policy ON "message"
  FOR UPDATE
  USING (
    is_admin() OR (
      "senderId" = current_user_id() AND
      EXISTS (
        SELECT 1 FROM "conversation" 
        WHERE "conversation".id = "message"."conversationId" 
        AND current_user_id() = ANY("conversation"."participants")
      )
    )
  );

-- Users can delete their own messages in conversations they participate in, admins can delete any message
CREATE POLICY message_delete_policy ON "message"
  FOR DELETE
  USING (
    is_admin() OR (
      "senderId" = current_user_id() AND
      EXISTS (
        SELECT 1 FROM "conversation" 
        WHERE "conversation".id = "message"."conversationId" 
        AND current_user_id() = ANY("conversation"."participants")
      )
    )
  );

-- RLS Policies for FILE_UPLOAD table
-- Users can see file uploads for messages they can see, admins can see all
CREATE POLICY file_upload_select_policy ON "file_upload"
  FOR SELECT
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "message"."conversationId" = "conversation".id
      WHERE "message".id = "file_upload"."messageId" 
      AND current_user_id() = ANY("conversation"."participants")
    )
  );

-- Users can create file uploads for their own messages, admins can create any file upload
CREATE POLICY file_upload_insert_policy ON "file_upload"
  FOR INSERT
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "message"."conversationId" = "conversation".id
      WHERE "message".id = "messageId" 
      AND "message"."senderId" = current_user_id()
      AND current_user_id() = ANY("conversation"."participants")
    )
  );

-- Users can update file uploads for their own messages, admins can update any file upload
CREATE POLICY file_upload_update_policy ON "file_upload"
  FOR UPDATE
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "message"."conversationId" = "conversation".id
      WHERE "message".id = "file_upload"."messageId" 
      AND "message"."senderId" = current_user_id()
      AND current_user_id() = ANY("conversation"."participants")
    )
  );

-- Users can delete file uploads for their own messages, admins can delete any file upload
CREATE POLICY file_upload_delete_policy ON "file_upload"
  FOR DELETE
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "message" 
      JOIN "conversation" ON "message"."conversationId" = "conversation".id
      WHERE "message".id = "file_upload"."messageId" 
      AND "message"."senderId" = current_user_id()
      AND current_user_id() = ANY("conversation"."participants")
    )
  );

-- RLS Policies for PAYMENT table
-- Users can see payments for contracts on their profile, admins can see all
CREATE POLICY payment_select_policy ON "payment"
  FOR SELECT
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "payment"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can create payments for contracts on their profile, admins can create any payment
CREATE POLICY payment_insert_policy ON "payment"
  FOR INSERT
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Users can update payments for contracts on their profile, admins can update any payment
CREATE POLICY payment_update_policy ON "payment"
  FOR UPDATE
  USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "contract"."profileId" = "profile".id
      WHERE "contract".id = "payment"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Only admins can delete payments
CREATE POLICY payment_delete_policy ON "payment"
  FOR DELETE
  USING (is_admin());