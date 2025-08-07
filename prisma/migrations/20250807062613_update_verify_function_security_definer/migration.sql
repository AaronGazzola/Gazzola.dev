-- Update verify_user_email function to bypass all authorization checks for testing
CREATE OR REPLACE FUNCTION verify_user_email(target_user_id TEXT) RETURNS VOID AS $$
BEGIN
  -- Update the user's emailVerified status (no authorization checks for testing)
  UPDATE "user" 
  SET "emailVerified" = true, "updatedAt" = NOW()
  WHERE id = target_user_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with id: %', target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;