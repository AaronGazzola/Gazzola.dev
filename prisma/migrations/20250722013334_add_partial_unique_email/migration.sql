-- This is an empty migration.

-- Drop existing unique constraint if it exists
DROP INDEX IF EXISTS "user_email_key";

-- Create partial unique index for non-null emails
CREATE UNIQUE INDEX "user_email_unique_when_not_null" ON "user"("email") WHERE "email" IS NOT NULL;