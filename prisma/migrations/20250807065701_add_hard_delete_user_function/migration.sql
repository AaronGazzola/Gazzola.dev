-- Create a function to hard delete user by email with security definer
CREATE OR REPLACE FUNCTION hard_delete_user_by_email(user_email TEXT)
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete all related records first
    DELETE FROM "Session" WHERE "userId" IN (
        SELECT id FROM "User" WHERE email = user_email
    );
    
    DELETE FROM "Account" WHERE "userId" IN (
        SELECT id FROM "User" WHERE email = user_email
    );
    
    DELETE FROM "Verification" WHERE identifier = user_email;
    
    DELETE FROM "Payment" WHERE "userId" IN (
        SELECT id FROM "User" WHERE email = user_email
    );
    
    DELETE FROM "Contract" WHERE "userId" IN (
        SELECT id FROM "User" WHERE email = user_email
    );
    
    -- Finally delete the user
    DELETE FROM "User" WHERE email = user_email;
END;
$$;