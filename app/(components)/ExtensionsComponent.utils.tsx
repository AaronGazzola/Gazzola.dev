export const ResendLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
  >
    <rect width="24" height="24" rx="4" fill="#000000" />
    <path
      d="M6 8h12v1.5H6V8zm0 3.5h12V13H6v-1.5zm0 3.5h7v1.5H6V15z"
      fill="white"
    />
    <path d="M15 15l3 2.5-3 2.5v-5z" fill="white" />
  </svg>
);

export const StripeLogo = () => (
  <svg
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <rect width="28" height="28" rx="6" fill="#635BFF" />
    <path
      d="M13.3 11.5c0-.7.6-1 1.4-1 1.2 0 2.8.4 4 1V8.4c-1.3-.5-2.6-.8-4-.8-3.3 0-5.5 1.7-5.5 4.6 0 4.5 6.2 3.8 6.2 5.7 0 .7-.7 1-1.5 1-1.3 0-3-.6-4.3-1.3v3.2c1.5.6 3 1 4.3 1 3.3 0 5.6-1.7 5.6-4.6 0-4.8-6.2-4-6.2-5.7z"
      fill="white"
    />
  </svg>
);

export const LexicalLogo = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="h-5 w-5 flex-shrink-0"
  >
    <path
      d="M3 3h18v18H3V3z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M7 7h10M7 12h10M7 17h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CloudflareLogo = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <path
      d="M19.2 13.9l-1.5-3.1c-.1-.2-.3-.3-.5-.3h-3.4c-.3 0-.5.2-.5.5v.2l-.2.9c0 .1 0 .2.1.3.1.1.2.1.3.1h3.1l.9 1.8H6.8c-.2 0-.4-.2-.4-.4l.5-2.4c.1-.3.2-.6.4-.8.2-.2.5-.3.8-.3h5.5c.2 0 .4-.2.4-.4v-1c0-.2-.2-.4-.4-.4H8.1c-.9 0-1.6.2-2.2.6-.6.4-1 1-1.2 1.7l-.5 2.4c0 .1 0 .2-.1.2H2.8c-.2 0-.4.2-.4.4v1c0 .2.2.4.4.4h.9l-.6 2.4c-.1.3-.2.6-.4.8-.2.2-.5.3-.8.3H.8c-.2 0-.4.2-.4.4v1c0 .2.2.4.4.4h1.1c.9 0 1.6-.2 2.2-.6.6-.4 1-1 1.2-1.7l.6-2.4h11.8c.3 0 .6-.1.8-.3.2-.2.4-.5.5-.8l.2-.9c.1-.2.1-.4 0-.6z"
      fill="#F6821F"
    />
  </svg>
);

export const PlaywrightLogo = () => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <defs>
      <linearGradient id="pw-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2D4552" />
        <stop offset="100%" stopColor="#1C2B33" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#pw-gradient)" />
    <path
      d="M50 20C63.8 20 75 31.2 75 45c0 6.9-2.8 13.1-7.3 17.6L50 80 32.3 62.6C27.8 58.1 25 51.9 25 45c0-13.8 11.2-25 25-25z"
      fill="#E44D26"
    />
    <path
      d="M50 35c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z"
      fill="white"
    />
  </svg>
);

export const VitestLogo = () => (
  <svg
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <defs>
      <linearGradient id="vitest-yellow" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FCC72B" />
        <stop offset="100%" stopColor="#FDB022" />
      </linearGradient>
      <linearGradient id="vitest-green" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#729B1B" />
        <stop offset="100%" stopColor="#578216" />
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#vitest-green)" rx="32" />
    <path d="M128 40L200 200H56L128 40z" fill="url(#vitest-yellow)" />
    <path d="M128 90L170 170H86L128 90z" fill="url(#vitest-green)" />
  </svg>
);

import { Mail, Milestone, Plus } from "lucide-react";
import { SupabaseLogo as SupabaseLogoBase } from "./NextStepsComponent.utils";

export const MailIcon = () => <Mail className="h-5 w-5 flex-shrink-0" />;

export const MilestoneIcon = () => (
  <Milestone className="h-5 w-5 flex-shrink-0" />
);

export const SupabaseIcon = () => (
  <div className="h-5 w-5 flex-shrink-0">
    <SupabaseLogoBase className="h-full w-full" />
  </div>
);

export const PlaywrightPlusVitestLogo = () => (
  <div className="flex flex-col sm:flex-row items-center gap-0.5 flex-shrink-0 mr-1 lg:mr-2">
    <PlaywrightLogo />
    <Plus className="h-4 w-4 flex-shrink-0" />
    <VitestLogo />
  </div>
);

export const generateResendEmailPrompt = () => {
  return `AI PROMPT: SETUP SUPABASE AUTH EMAIL TEMPLATES WITH REACT EMAIL
====================================================================

INSTRUCTIONS FOR AI:

Before implementing anything, you MUST first create a comprehensive plan that includes:
1. All implementation steps in order
2. The EXACT verbatim final response you will give to the user for manual configuration steps
3. Verification steps

DO NOT start implementation until the plan is complete and approved.

IMPLEMENTATION PLAN STRUCTURE:

Your plan should include these phases:

PHASE 1: SETUP REACT EMAIL TEMPLATES
-------------------------------------
1. Check if react-email is installed in package.json devDependencies
   - If not, add it with: npm install -D react-email@latest

2. Check if @react-email/components is installed in package.json devDependencies
   - If not, add it with: npm install -D @react-email/components@latest

3. Read styles/globals.css to extract CSS variables from :root selector (light mode):
   - --font (font family)
   - --shadow (box shadow)
   - --radius (border radius)
   - --letter-spacing (letter spacing)
   - --spacing (base spacing unit)
   - Color variables:
     --background
     --foreground
     --card
     --card-foreground
     --popover
     --popover-foreground
     --primary
     --primary-foreground
     --secondary
     --secondary-foreground
     --muted
     --muted-foreground
     --accent
     --accent-foreground
     --destructive
     --destructive-foreground
     --border
     --input
     --ring

   NOTE: If colors use OKLCH format, convert to hex/RGB (email clients don't support OKLCH)
   - Install culori: npm install -D culori
   - Use formatHex() from culori to convert OKLCH to hex: formatHex({ mode: 'oklch', l, c, h })

4. Read the app's header component to get:
   - App logo URL or component
   - App title/name
   - Check common locations: components/Header.tsx, components/header.tsx, or layout files

5. Identify the Google Font used in --font variable and note the font family name
   NOTE: Prepare web-safe fallbacks (custom fonts don't load reliably in emails)

6. Create email template files in emails/ directory:
   Required templates:
   - confirmation.tsx - Email verification
   - recovery.tsx - Password reset
   - invite.tsx - User invitations
   - magic_link.tsx - Magic link authentication
   - email_change.tsx - Email change confirmation

   Each template should:
   - Import necessary components from @react-email/components (Do not use pure HTML, use react-email)
   - Import the Google Font using <Font> component or inline @import
   - Use CSS variables from globals.css converted to inline styles
   - Include app logo/title in header
   - Use color variables appropriately (e.g., --primary for buttons)
   - Apply --radius to buttons and cards
   - Apply --shadow to elevated elements
   - Use --font for all text
   - Use --letter-spacing for text
   - Use --spacing for margins/padding (multiply as needed: calc(var(--spacing) * 2))
   - Include Supabase template variables: {{ .ConfirmationURL }}, {{ .Token }}, {{ .Email }}, etc. (React Email preserves these string literals in HTML export)
   - Be responsive and compatible with email clients

7. Add email compilation script to package.json scripts:
   "email:build": "react-email export && cp out/*.html supabase/templates/"

   This script will:
   - Export all React Email templates from emails/ to HTML in the out/ directory
   - Copy the compiled HTML files to supabase/templates/


PHASE 2: CONFIGURE SUPABASE
----------------------------
1. Create supabase/templates/ directory if it doesn't exist

2. Verify Supabase CLI is linked:
   - Check if project is linked with: supabase projects list
   - If needed, guide user to link: supabase link --project-ref [project-ref from ".env.local"]

3. Pull existing configuration from remote:
   Run: npx supabase config pull

   This will create a config.toml with ALL your current Supabase settings.
   IMPORTANT: This step ensures you don't overwrite existing configuration.

4. Add email template configuration to the existing supabase/config.toml:
   [auth.email.template.confirmation]
   subject = "Confirm your email - [App Name]"
   content_path = "./supabase/templates/confirmation.html"

   [auth.email.template.recovery]
   subject = "Reset your password - [App Name]"
   content_path = "./supabase/templates/recovery.html"

   [auth.email.template.invite]
   subject = "You've been invited to [App Name]"
   content_path = "./supabase/templates/invite.html"

   [auth.email.template.magic_link]
   subject = "Your magic link - [App Name]"
   content_path = "./supabase/templates/magic_link.html"

   [auth.email.template.email_change]
   subject = "Confirm your email change - [App Name]"
   content_path = "./supabase/templates/email_change.html"

5. Compile React Email templates to HTML:
   Run: npm run email:build

   This will export all templates from emails/ and copy them to supabase/templates/

6. Push the complete configuration back to Supabase:
   npx supabase config push

   This pushes ALL settings in config.toml, including both existing configuration
   and the new email template settings.


PHASE 3: UPDATE DOCUMENTATION
------------------------------
1. Add a new section to CLAUDE.md titled "# Email Template Development"

2. The section should include:

   ## Previewing Email Templates

   This project uses React Email for email template development. All email templates
   are located in \`emails/\` and are written as React components.

   To preview and develop email templates:

   \`\`\`bash
   npx react-email dev
   \`\`\`

   This starts a development server (typically at http://localhost:3000) where you can:
   - Preview all email templates
   - Test responsive design by resizing the viewport
   - See changes in real-time with hot reload
   - View templates across different email clients

   ## Template Structure

   Email templates use CSS variables from \`styles/globals.css\` (light mode) for
   consistent styling with the application. Templates are compiled to HTML with
   inline styles for email client compatibility.

   ## Deploying Template Changes

   After modifying templates in \`emails/\`:
   1. Compile to HTML: \`npm run email:build\`
   2. Templates are saved to \`supabase/templates/\`
   3. Push to Supabase: \`supabase config push\`


PHASE 4: PREPARE FINAL USER INSTRUCTIONS
-----------------------------------------
Write the EXACT verbatim instructions that will be given to the user.
DO NOT paraphrase these in your final response - copy them word-for-word.

The instructions should cover:

=== BEGIN VERBATIM USER INSTRUCTIONS ===

# Email Templates Setup Complete!

I've configured all the email templates in your repository. Now you need to complete the setup in Resend and Supabase.

## What Was Done in Your Repo

✅ Installed React Email dependencies
✅ Created email templates in \`emails/\`:
   - confirmation.tsx - Email verification
   - recovery.tsx - Password reset
   - invite.tsx - User invitations
   - magic_link.tsx - Magic link authentication
   - email_change.tsx - Email change confirmation
✅ Compiled templates to HTML in \`supabase/templates/\`
✅ Pulled existing Supabase configuration from remote
✅ Added email template configuration to \`supabase/config.toml\`
✅ Pushed complete configuration back to your Supabase project
✅ Updated CLAUDE.md with preview instructions

## Preview Your Templates

To preview the email templates locally:

\`\`\`bash
npx react-email dev
\`\`\`

Then open http://localhost:3000 in your browser.

---

## Next Steps: Manual Configuration Required

You need to complete these steps in Resend and Supabase Dashboard.


### STEP 1: CREATE RESEND ACCOUNT

1. Go to https://resend.com/signup
2. Sign up for a free account
3. Verify your email address
4. You'll be directed to the Resend dashboard


### STEP 2: ADD AND VERIFY YOUR DOMAIN

1. In the Resend dashboard, click **"Domains"** in the left sidebar
2. Click **"Add Domain"**
3. Enter your domain:
   - Use your main domain (e.g., \`yourdomain.com\`)
   - OR use a subdomain (e.g., \`mail.yourdomain.com\`)
4. Click **"Add"**

5. Resend will show you DNS records to add. You need to add these to your domain registrar

6. **Add DNS records to your domain registrar:**
   - Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Navigate to DNS settings
   - Add each TXT record exactly as shown in Resend
   - Copy/paste carefully - don't modify the values
   - Save changes

7. **Wait for verification:**
   - DNS propagation can take up to 24 hours (usually faster)
   - Check verification status in Resend dashboard
   - Status will change from "Pending" to "Verified" when ready
   - You can also check at https://dns.email to see if records are live


### STEP 3: GET YOUR RESEND API KEY

1. In Resend dashboard, click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name: \`Production Sending Key\`
4. Under **"Permissions"**, select:
   - **"Sending access"**
   - Choose your verified domain
5. Click **"Create"**
6. **IMPORTANT:** Copy the API key immediately
   - You'll only see it once
   - Store it somewhere secure temporarily
   - Format: \`re_xxxxxxxxxxxxxxxxxxxxx\`


### STEP 4: CONFIGURE SMTP IN SUPABASE

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. In the left sidebar, click **"Project Settings"** (gear icon at bottom)
4. Click **"Auth"** in the settings menu
5. Scroll down to **"SMTP Settings"** section
6. Toggle **"Enable Custom SMTP"** to ON

7. Fill in the SMTP configuration:

   **Sender Email:**
   \`\`\`
   noreply@yourdomain.com
   \`\`\`
   (Use your verified domain from Resend)

   **Sender Name:**
   \`\`\`
   Your App Name
   \`\`\`
   (This appears as the "From" name in emails)

   **Host:**
   \`\`\`
   smtp.resend.com
   \`\`\`

   **Port Number:**
   \`\`\`
   587
   \`\`\`
   (For TLS encryption. You can also use 465 for SSL)

   **Username:**
   \`\`\`
   resend
   \`\`\`
   (This is always "resend" - don't change it)

   **Password:**
   \`\`\`
   [Paste your Resend API key here]
   \`\`\`
   (The key you copied in Step 3, starting with re_)

8. Click **"Save"** at the bottom

9. **Test the configuration:**
   - Supabase will send a test email
   - Check the inbox for your sender email address
   - If successful, your SMTP is working
   - If failed, double-check all settings and ensure domain is verified


### STEP 5: CONFIGURE SITE URL

1. Still in Supabase Project Settings → Auth
2. Scroll up to **"URL Configuration"** section
3. Set **"Site URL"** to your application's URL:
   \`\`\`
   https://yourdomain.com
   \`\`\`
   (This is used in email verification links)

4. Add **"Redirect URLs"** if needed:
   - Add any callback URLs your app uses
   - Example: \`https://yourdomain.com/**\`

5. Click **"Save"**


### STEP 6: TEST YOUR EMAIL SETUP

1. **Test Email Verification:**
   - Sign up a new user in your app
   - Check your inbox for the confirmation email
   - Verify it uses your custom template and branding
   - Click the confirmation link to verify it works

2. **Test Password Reset:**
   - Click "Forgot Password" in your app
   - Enter an email address
   - Check inbox for reset email
   - Verify custom template
   - Click reset link to ensure it works

3. **Check Resend Dashboard:**
   - Go to Resend dashboard → "Emails"
   - You should see your sent emails listed
   - Check delivery status
   - View any errors or bounces

Email templates have been created and deployed to supabase - Users will receive branded transactional emails for all authentication flows once you have completed the configuration steps described above.

  To modify email templates in the future:

  1. Edit the React component in emails/
  2. Preview changes: npx react-email dev
  3. Compile to HTML: npm run email:build
  4. If working on a new machine or remote config changed: npx supabase config pull
  5. Push to Supabase: npx supabase config push
  6. Test with a real auth flow

=== END VERBATIM USER INSTRUCTIONS ===`;
};
