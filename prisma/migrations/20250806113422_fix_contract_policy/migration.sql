-- Drop existing contract and task policies that check isPaid column
DROP POLICY IF EXISTS "contract_update_policy" ON "contract";
DROP POLICY IF EXISTS "task_insert_policy" ON "task";
DROP POLICY IF EXISTS "task_update_policy" ON "task";
DROP POLICY IF EXISTS "task_delete_policy" ON "task";

-- Create new contract update policy that checks for payment instead of isPaid
CREATE POLICY "contract_update_policy" ON "contract" FOR UPDATE 
  USING (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "profile" 
        WHERE "profile".id = "contract"."profileId" 
        AND "profile"."userId" = current_user_id()
      ) AND NOT EXISTS (
        SELECT 1 FROM "payment" 
        WHERE "payment"."contractId" = "contract".id 
        AND "payment".status = 'completed'
      )
    )
  );

-- Create new task policies that check for payment instead of isPaid
CREATE POLICY "task_insert_policy" ON "task" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "task"."contractId" 
      AND "profile"."userId" = current_user_id()
      AND NOT EXISTS (
        SELECT 1 FROM "payment" 
        WHERE "payment"."contractId" = "contract".id 
        AND "payment".status = 'completed'
      )
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
      AND NOT EXISTS (
        SELECT 1 FROM "payment" 
        WHERE "payment"."contractId" = "contract".id 
        AND "payment".status = 'completed'
      )
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
      AND NOT EXISTS (
        SELECT 1 FROM "payment" 
        WHERE "payment"."contractId" = "contract".id 
        AND "payment".status = 'completed'
      )
    )
  );

-- Grant app_user access to payment table
GRANT SELECT, INSERT ON "payment" TO app_user;

-- Admin policy for payment table (select/insert any row)
CREATE POLICY "payment_admin_policy" ON "payment" FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- User policy for payment table (select payments for their contracts only)
CREATE POLICY "payment_user_select_policy" ON "payment" FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM "contract" 
      JOIN "profile" ON "profile".id = "contract"."profileId"
      WHERE "contract".id = "payment"."contractId" 
      AND "profile"."userId" = current_user_id()
    )
  );