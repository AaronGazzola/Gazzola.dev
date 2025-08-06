-- Allow users to insert payments for their own contracts (via profile id)
-- Note: Admin payment insert policy already exists in previous migration

CREATE POLICY "payment_user_insert_policy" ON "payment" FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "payment"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );