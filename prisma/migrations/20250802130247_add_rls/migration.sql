-- Enable RLS on tables (excluding better-auth core tables)
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "file_upload" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;

-- Create function to get current user ID (compatible with existing RLS utils)
CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_user_id', true);
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin() RETURNS BOOLEAN AS $$
DECLARE
    user_id TEXT;
    user_role TEXT;
BEGIN
    user_id := get_current_user_id();
    
    IF user_id IS NULL OR user_id = '' THEN
        RETURN FALSE;
    END IF;
    
    SELECT role INTO user_role 
    FROM "user" 
    WHERE id = user_id;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profile policies: Users can view/edit their own profile, admins can view/edit all
CREATE POLICY profile_select_policy ON "profile"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "userId" = get_current_user_id()
    );

CREATE POLICY profile_insert_policy ON "profile"
    FOR INSERT WITH CHECK (
        is_current_user_admin() OR 
        "userId" = get_current_user_id()
    );

CREATE POLICY profile_update_policy ON "profile"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        "userId" = get_current_user_id()
    );

CREATE POLICY profile_delete_policy ON "profile"
    FOR DELETE USING (
        is_current_user_admin() OR 
        "userId" = get_current_user_id()
    );

-- Contract policies: Users can view contracts they're related to, edit only unpaid contracts they're related to, admins can do all
CREATE POLICY contract_select_policy ON "contract"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
    );

CREATE POLICY contract_insert_policy ON "contract"
    FOR INSERT WITH CHECK (
        is_current_user_admin() OR 
        "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
    );

CREATE POLICY contract_update_policy ON "contract"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        ("profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id()) AND "isPaid" = false)
    );

CREATE POLICY contract_delete_policy ON "contract"
    FOR DELETE USING (
        is_current_user_admin()
    );

-- Task policies: Users can view/edit tasks for contracts they're related to, admins can do all
CREATE POLICY task_select_policy ON "task"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "contractId" IN (
            SELECT id FROM "contract" 
            WHERE "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
        )
    );

CREATE POLICY task_insert_policy ON "task"
    FOR INSERT WITH CHECK (
        is_current_user_admin() OR 
        "contractId" IN (
            SELECT id FROM "contract" 
            WHERE "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
        )
    );

CREATE POLICY task_update_policy ON "task"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        "contractId" IN (
            SELECT id FROM "contract" 
            WHERE "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
        )
    );

CREATE POLICY task_delete_policy ON "task"
    FOR DELETE USING (
        is_current_user_admin()
    );

-- Conversation policies: Only admins can create, users can view conversations they participate in
CREATE POLICY conversation_select_policy ON "conversation"
    FOR SELECT USING (
        is_current_user_admin() OR 
        get_current_user_id() = ANY("participants")
    );

CREATE POLICY conversation_insert_policy ON "conversation"
    FOR INSERT WITH CHECK (
        is_current_user_admin()
    );

CREATE POLICY conversation_update_policy ON "conversation"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        get_current_user_id() = ANY("participants")
    );

CREATE POLICY conversation_delete_policy ON "conversation"
    FOR DELETE USING (
        is_current_user_admin()
    );

-- Message policies: Users can view/create messages in conversations they participate in
CREATE POLICY message_select_policy ON "message"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "conversationId" IN (
            SELECT id FROM "conversation" 
            WHERE get_current_user_id() = ANY("participants")
        )
    );

CREATE POLICY message_insert_policy ON "message"
    FOR INSERT WITH CHECK (
        is_current_user_admin() OR 
        ("conversationId" IN (
            SELECT id FROM "conversation" 
            WHERE get_current_user_id() = ANY("participants")
        ) AND "senderId" = get_current_user_id())
    );

CREATE POLICY message_update_policy ON "message"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        ("senderId" = get_current_user_id() AND "conversationId" IN (
            SELECT id FROM "conversation" 
            WHERE get_current_user_id() = ANY("participants")
        ))
    );

CREATE POLICY message_delete_policy ON "message"
    FOR DELETE USING (
        is_current_user_admin() OR 
        "senderId" = get_current_user_id()
    );

-- File upload policies: Users can view/manage files for messages they sent
CREATE POLICY file_upload_select_policy ON "file_upload"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "messageId" IN (
            SELECT id FROM "message" 
            WHERE "senderId" = get_current_user_id()
        )
    );

CREATE POLICY file_upload_insert_policy ON "file_upload"
    FOR INSERT WITH CHECK (
        is_current_user_admin() OR 
        "messageId" IN (
            SELECT id FROM "message" 
            WHERE "senderId" = get_current_user_id()
        )
    );

CREATE POLICY file_upload_update_policy ON "file_upload"
    FOR UPDATE USING (
        is_current_user_admin() OR 
        "messageId" IN (
            SELECT id FROM "message" 
            WHERE "senderId" = get_current_user_id()
        )
    );

CREATE POLICY file_upload_delete_policy ON "file_upload"
    FOR DELETE USING (
        is_current_user_admin() OR 
        "messageId" IN (
            SELECT id FROM "message" 
            WHERE "senderId" = get_current_user_id()
        )
    );

-- Payment policies: Users can view payments for their contracts, only admins can modify
CREATE POLICY payment_select_policy ON "payment"
    FOR SELECT USING (
        is_current_user_admin() OR 
        "contractId" IN (
            SELECT id FROM "contract" 
            WHERE "profileId" IN (SELECT id FROM "profile" WHERE "userId" = get_current_user_id())
        )
    );

CREATE POLICY payment_insert_policy ON "payment"
    FOR INSERT WITH CHECK (
        is_current_user_admin()
    );

CREATE POLICY payment_update_policy ON "payment"
    FOR UPDATE USING (
        is_current_user_admin()
    );

CREATE POLICY payment_delete_policy ON "payment"
    FOR DELETE USING (
        is_current_user_admin()
    );