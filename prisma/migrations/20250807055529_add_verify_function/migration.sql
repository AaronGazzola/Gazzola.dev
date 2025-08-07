-- Grant UPDATE permission on user table to app_user
GRANT UPDATE ON "user" TO "app_user";

-- Create function to verify user email with SECURITY DEFINER
CREATE OR REPLACE FUNCTION verify_user_email(target_user_id TEXT) RETURNS VOID AS $$
BEGIN
  -- Only allow current user to verify their own email or admin to verify any email
  IF target_user_id != current_user_id() AND NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot verify email for other users';
  END IF;
  
  -- Update the user's emailVerified status
  UPDATE "user" 
  SET "emailVerified" = true, "updatedAt" = NOW()
  WHERE id = target_user_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with id: %', target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to soft delete user with SECURITY DEFINER
CREATE OR REPLACE FUNCTION soft_delete_user(target_user_id TEXT) RETURNS VOID AS $$
BEGIN
  -- Only allow current user to delete their own account or admin to delete any account
  IF target_user_id != current_user_id() AND NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot delete account for other users';
  END IF;
  
  -- Update user record with soft delete and anonymization
  UPDATE "user" 
  SET 
    "isDeleted" = true,
    "deletedAt" = NOW(),
    "email" = EXTRACT(EPOCH FROM NOW())::TEXT, -- Anonymize email with timestamp
    "name" = NULL,
    "image" = NULL,
    "updatedAt" = NOW()
  WHERE id = target_user_id;
  
  -- Check if user update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with id: %', target_user_id;
  END IF;
  
  -- Anonymize related profile data
  UPDATE "profile" 
  SET 
    "firstName" = NULL,
    "lastName" = NULL,
    "email" = NULL,
    "phone" = NULL,
    "company" = NULL,
    "updatedAt" = NOW()
  WHERE "userId" = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;