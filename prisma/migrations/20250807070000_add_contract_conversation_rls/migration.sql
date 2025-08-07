-- Enable RLS on _ContractToConversation junction table
ALTER TABLE "_ContractToConversation" ENABLE ROW LEVEL SECURITY;

-- Grant SELECT permissions to app_user
GRANT SELECT ON "_ContractToConversation" TO "app_user";

-- RLS policy for _ContractToConversation: SELECT (admin OR related contract owner OR conversation participant)
CREATE POLICY "_contracttoconversation_select_policy" ON "_ContractToConversation" FOR SELECT 
  USING (
    is_admin() OR 
    -- User owns the related contract through profile
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "_ContractToConversation"."A" 
      AND "profile"."userId" = current_user_id()
    ) OR
    -- User is participant in the related conversation
    EXISTS (
      SELECT 1 FROM "conversation" 
      WHERE "conversation".id = "_ContractToConversation"."B" 
      AND current_user_id() = ANY("conversation".participants)
    )
  );