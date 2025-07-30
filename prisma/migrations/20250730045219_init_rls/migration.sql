-- Enable Row Level Security
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

-- Create function to get current user ID from session
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
DECLARE
    user_id TEXT;
BEGIN
    -- Get user_id from current session context
    SELECT current_setting('app.current_user_id', true) INTO user_id;
    RETURN user_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role 
    FROM "user" 
    WHERE id = current_user_id() AND "isDeleted" = false;
    
    RETURN COALESCE(user_role = 'admin', false);
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USER table policies
CREATE POLICY "Users can view their own record" ON "user"
    FOR SELECT USING (id = current_user_id());

CREATE POLICY "Admins can view all users" ON "user"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can update their own record" ON "user"
    FOR UPDATE USING (id = current_user_id());

CREATE POLICY "Admins can update any user" ON "user"
    FOR UPDATE USING (is_admin());

-- SESSION table policies
CREATE POLICY "Users can view their own sessions" ON "session"
    FOR SELECT USING ("userId" = current_user_id());

CREATE POLICY "Users can insert their own sessions" ON "session"
    FOR INSERT WITH CHECK ("userId" = current_user_id());

CREATE POLICY "Users can update their own sessions" ON "session"
    FOR UPDATE USING ("userId" = current_user_id());

CREATE POLICY "Users can delete their own sessions" ON "session"
    FOR DELETE USING ("userId" = current_user_id());

-- ACCOUNT table policies
CREATE POLICY "Users can access their own accounts" ON "account"
    FOR ALL USING ("userId" = current_user_id());

-- VERIFICATION table policies
CREATE POLICY "Allow all verification operations" ON "verification"
    FOR ALL USING (true);

-- PROFILE table policies
CREATE POLICY "Users can view their own profile" ON "profile"
    FOR SELECT USING ("userId" = current_user_id());

CREATE POLICY "Admins can view all profiles" ON "profile"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can manage their own profile" ON "profile"
    FOR ALL USING ("userId" = current_user_id());

CREATE POLICY "Admins can manage all profiles" ON "profile"
    FOR ALL USING (is_admin());

-- CONVERSATION table policies
CREATE POLICY "Users can access conversations they participate in" ON "conversation"
    FOR SELECT USING (current_user_id() = ANY(participants));

CREATE POLICY "Admins can access all conversations" ON "conversation"
    FOR SELECT USING (is_admin());

CREATE POLICY "Only admins can create conversations" ON "conversation"
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Users can update conversations they participate in" ON "conversation"
    FOR UPDATE USING (current_user_id() = ANY(participants));

CREATE POLICY "Admins can update any conversation" ON "conversation"
    FOR UPDATE USING (is_admin());

-- MESSAGE table policies
CREATE POLICY "Users can view messages in their conversations" ON "message"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "conversation" 
            WHERE id = "conversationId" 
            AND current_user_id() = ANY(participants)
        )
    );

CREATE POLICY "Admins can view all messages" ON "message"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can send messages as themselves" ON "message"
    FOR INSERT WITH CHECK (
        "senderId" = current_user_id() 
        AND EXISTS (
            SELECT 1 FROM "conversation" 
            WHERE id = "conversationId" 
            AND current_user_id() = ANY(participants)
        )
    );

CREATE POLICY "Admins can send messages as themselves" ON "message"
    FOR INSERT WITH CHECK (
        "senderId" = current_user_id() 
        AND is_admin()
    );

-- FILE_UPLOAD table policies
CREATE POLICY "Users can access files in their messages" ON "file_upload"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "message" m
            JOIN "conversation" c ON m."conversationId" = c.id
            WHERE m.id = "messageId" 
            AND current_user_id() = ANY(c.participants)
        )
    );

CREATE POLICY "Admins can access all files" ON "file_upload"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can upload files to their messages" ON "file_upload"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "message" m
            JOIN "conversation" c ON m."conversationId" = c.id
            WHERE m.id = "messageId" 
            AND m."senderId" = current_user_id()
            AND current_user_id() = ANY(c.participants)
        )
    );

-- CONTRACT table policies
CREATE POLICY "Users can view their own contracts" ON "contract"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "profile" 
            WHERE id = "profileId" 
            AND "userId" = current_user_id()
        )
    );

CREATE POLICY "Admins can view all contracts" ON "contract"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create contracts for themselves" ON "contract"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "profile" 
            WHERE id = "profileId" 
            AND "userId" = current_user_id()
        )
    );

CREATE POLICY "Admins can create contracts for anyone" ON "contract"
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Users can update their own contracts" ON "contract"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "profile" 
            WHERE id = "profileId" 
            AND "userId" = current_user_id()
        )
    );

CREATE POLICY "Admins can update any contract" ON "contract"
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete contracts" ON "contract"
    FOR DELETE USING (is_admin());

-- TASK table policies
CREATE POLICY "Users can view tasks in their unpaid contracts" ON "task"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
            AND co."isPaid" = false
        )
    );

CREATE POLICY "Admins can view all tasks" ON "task"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can manage tasks in their unpaid contracts" ON "task"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
            AND co."isPaid" = false
        )
    );

CREATE POLICY "Users can update tasks in their unpaid contracts" ON "task"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
            AND co."isPaid" = false
        )
    );

CREATE POLICY "Users can delete tasks in their unpaid contracts" ON "task"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
            AND co."isPaid" = false
        )
    );

CREATE POLICY "Admins can manage all tasks" ON "task"
    FOR ALL USING (is_admin());

-- PAYMENT table policies
CREATE POLICY "Users can view payments for their contracts" ON "payment"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
        )
    );

CREATE POLICY "Admins can view all payments" ON "payment"
    FOR SELECT USING (is_admin());

CREATE POLICY "Users can create payments for their contracts" ON "payment"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "contract" co
            JOIN "profile" p ON co."profileId" = p.id
            WHERE co.id = "contractId" 
            AND p."userId" = current_user_id()
        )
    );

CREATE POLICY "Admins can create any payment" ON "payment"
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "System can update payments" ON "payment"
    FOR UPDATE USING (true);

