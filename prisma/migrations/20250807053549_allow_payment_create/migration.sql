-- Enable RLS on payment table
ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;

-- Grant permissions to app_user
GRANT SELECT, INSERT, UPDATE, DELETE ON "payment" TO "app_user";

-- Allow any authenticated user to create payments (needed for checkout flow)
CREATE POLICY "payment_insert_policy" ON "payment" FOR INSERT 
  WITH CHECK (current_user_id() IS NOT NULL);

-- Allow users to see payments for their own contracts, admins see all
CREATE POLICY "payment_select_policy" ON "payment" FOR SELECT 
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "payment"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );

-- Only admins can update payments (protects against tampering)
CREATE POLICY "payment_update_policy" ON "payment" FOR UPDATE 
  USING (is_admin());

-- Only admins can delete payments  
CREATE POLICY "payment_delete_policy" ON "payment" FOR DELETE 
  USING (is_admin());