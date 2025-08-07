-- Create SECURITY DEFINER function to check if contract is paid
-- This bypasses RLS to prevent circular dependency between contract and payment policies
CREATE OR REPLACE FUNCTION contract_is_paid(contract_id TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "payment" 
    WHERE "payment"."contractId" = contract_id 
    AND "payment".status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies that reference isPaid column or cause circular dependency
DROP POLICY IF EXISTS "contract_update_policy" ON "contract";
DROP POLICY IF EXISTS "task_insert_policy" ON "task";
DROP POLICY IF EXISTS "task_update_policy" ON "task";
DROP POLICY IF EXISTS "task_delete_policy" ON "task";
DROP POLICY IF EXISTS "payment_user_select_policy" ON "payment";

-- Create new contract update policy using the SECURITY DEFINER function
-- Prevents updating contracts once they are paid
CREATE POLICY "contract_update_policy" ON "contract" FOR UPDATE 
  USING (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "profile" 
        WHERE "profile".id = "contract"."profileId" 
        AND "profile"."userId" = current_user_id()
      ) AND NOT contract_is_paid("contract".id)
    )
  );

-- Create new task policies using the SECURITY DEFINER function
-- Prevents inserting, updating, or deleting tasks for paid contracts
CREATE POLICY "task_insert_policy" ON "task" FOR INSERT 
  WITH CHECK (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "contract" 
        JOIN "profile" ON "profile".id = "contract"."profileId"
        WHERE "contract".id = "task"."contractId" 
        AND "profile"."userId" = current_user_id()
      ) AND NOT contract_is_paid("task"."contractId")
    )
  );

CREATE POLICY "task_update_policy" ON "task" FOR UPDATE 
  USING (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "contract" 
        JOIN "profile" ON "profile".id = "contract"."profileId"
        WHERE "contract".id = "task"."contractId" 
        AND "profile"."userId" = current_user_id()
      ) AND NOT contract_is_paid("task"."contractId")
    )
  );

CREATE POLICY "task_delete_policy" ON "task" FOR DELETE 
  USING (
    is_admin() OR 
    (
      EXISTS (
        SELECT 1 FROM "contract" 
        JOIN "profile" ON "profile".id = "contract"."profileId"
        WHERE "contract".id = "task"."contractId" 
        AND "profile"."userId" = current_user_id()
      ) AND NOT contract_is_paid("task"."contractId")
    )
  );

-- Create secure payment processing function with validation
-- This function validates payment ownership and Stripe session before updating
CREATE OR REPLACE FUNCTION process_payment_securely(
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_amount DECIMAL,
  contract_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  payment_record RECORD;
  contract_record RECORD;
BEGIN
  -- Validate that payment exists and matches expected values
  SELECT * INTO payment_record FROM "payment" 
  WHERE "stripeSessionId" = stripe_session_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found for session: %', stripe_session_id;
  END IF;
  
  -- Validate that contract exists and matches
  SELECT * INTO contract_record FROM "contract" 
  WHERE id = contract_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contract not found: %', contract_id;
  END IF;
  
  -- Validate payment belongs to the contract
  IF payment_record."contractId" != contract_id THEN
    RAISE EXCEPTION 'Payment does not belong to specified contract';
  END IF;
  
  -- Validate payment amount matches (prevent tampering)
  IF payment_record.amount != payment_amount THEN
    RAISE EXCEPTION 'Payment amount mismatch. Expected: %, Got: %', payment_record.amount, payment_amount;
  END IF;
  
  -- Validate payment is not already completed (prevent double processing)
  IF payment_record.status = 'completed' THEN
    RAISE EXCEPTION 'Payment already completed';
  END IF;
  
  -- Update payment record with completed status
  UPDATE "payment" 
  SET 
    status = 'completed',
    "stripePaymentIntentId" = stripe_payment_intent_id,
    "paidAt" = NOW(),
    "updatedAt" = NOW()
  WHERE "stripeSessionId" = stripe_session_id;
  
  -- Update contract to mark as paid
  UPDATE "contract" 
  SET 
    "isPaid" = true,
    "updatedAt" = NOW()
  WHERE id = contract_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;