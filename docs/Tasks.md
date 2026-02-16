# Tasks

- Add route protection beyond hook response redirection
- make unauthenticated errors silent when not critical
- update the signup to resend the verify email and redirect to the verify page if an account with that email already exists and is not verified
- Update the supabase phase of the starter kit plan to pull and push the config with default settings and the site url and redirect urls with glob endings (eg "localhost:3000/\*\*")
- add a styled 404
- Implement the contact form with the resend prompt
- Add terms, privacy, about and contact instructions to the starter kit plan prompt
- remove "More options coming soon" from readme component - add sign in options to the extensions
- Make it very clear that each plan phase should end with creating a new plan for the next phase
- Update the schema generation to establish an FK relationship to all relation tables:

```
-- profiles.user_id references auth.users
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
```

- change resend key and beep.buzz keys
- when signing up, check the
  When email confirmation is enabled,
  Supabase doesn't return an error for
  duplicate emails — it returns a successful
  response with data.user.identities as an
  empty array. The fix now checks for that
  empty identities array after the error
  check and throws before onSuccess can
  redirect to /verify.
- handle_new_user db function should consider NOT NULL columns when inserting - make sure NULL is not inserted into NOT NULL columns - I think this is resolved by only initializing the profile at sign up and then filling in the actual profile data at the /welcome page
- no confirm password input - use show/hide password
- the seed script should not create the profile
- the extension prompt should specify that it does not need to search, all of the information is available in the prompt
