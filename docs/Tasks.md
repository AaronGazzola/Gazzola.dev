# Tasks

- Make sure that the generated readme contains the correct auth/admin/anon permissions for each page
- Make sure that a "/verify" route is generated in the page and layout builder
- Add route protection beyond hook response redirection
- the handle_new_user database function is currently missing some required fields. Update the generation logic to ensure that it updates all required fields on the profile
  - The database migration needs to be generated with the timestamp columns using "DEFAULT NOW()"
- Add in the resend email sending config to the generation process, or to the extensions
- Update the supabase client template files to use this approach: ` 
Your browser-client.ts uses createClient from  
@supabase/supabase-js with localStorage. It should use  
createBrowserClient from @supabase/ssr which stores  
sessions in cookies that the server can read.
// browser-client.ts should use:  
import { createBrowserClient } from "@supabase/ssr";`
- Ensure that the seed script doesn't add a profile, only add a profile in the db trigger when a user is created
