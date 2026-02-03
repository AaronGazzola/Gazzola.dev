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
  return `I need help setting up custom email delivery with Resend for my Next.js + Supabase application. Let's work through this step by step.

PHASE 1: RESEND ACCOUNT SETUP & DOMAIN VERIFICATION

1. CREATE RESEND ACCOUNT
   - Sign up at https://resend.com/signup
   - Once signed in, you'll be directed to the dashboard

2. ADD YOUR DOMAIN
   - In the Resend dashboard, navigate to "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., yourdomain.com or mail.yourdomain.com)
   - Resend will generate the required DNS records

3. ADD DNS RECORDS TO YOUR DOMAIN REGISTRAR
   Resend requires the following DNS records for domain verification:

   - SPF Record (TXT): Authorizes Resend to send emails from your domain
   - DKIM Record (TXT): Contains a public key for email authentication
   - Optional DMARC Record (TXT): Additional email authentication policy

   Steps:
   - Copy each DNS record from Resend dashboard
   - Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Navigate to DNS settings
   - Add each TXT record exactly as shown in Resend
   - Save changes

   Note: DNS propagation can take up to 24 hours. You can check status using:
   - Resend dashboard (will show "Verified" when ready)
   - https://dns.email (Resend's DNS lookup tool)

4. GET YOUR RESEND API KEY
   - In Resend dashboard, go to "API Keys"
   - Click "Create API Key"
   - Give it a name (e.g., "Production Sending Key")
   - Permissions: Select "Sending access" for your verified domain
   - Copy the API key (you'll only see it once!)
   - Store it securely

5. PROVIDE YOUR CREDENTIALS
   Once your domain is verified and you have your API key, please provide:
   - Resend API Key: [paste here]
   - Sending Domain: [e.g., yourdomain.com]
   - From Email Address: [e.g., noreply@yourdomain.com]

Wait for me to provide these details before proceeding to Phase 2.

PHASE 2: EMAIL TEMPLATE IMPLEMENTATION

After I provide the credentials, you will:

1. REVIEW CODEBASE FOR EMAIL REQUIREMENTS
   - Search for all existing email usage in the codebase
   - Identify Supabase auth emails that need custom templates
   - Find any other email-sending functionality
   - Document all required email templates

2. UPDATE ENVIRONMENT VARIABLES
   - Add RESEND_API_KEY to .env.local
   - Add RESEND_FROM_EMAIL to .env.local
   - Update .env.example with placeholders

3. CREATE EMAIL TEMPLATES DIRECTORY STRUCTURE
   Create organized email templates in emails/ directory:
   - emails/auth/ (for Supabase auth emails)
   - emails/transactional/ (for app-specific transactional emails)

4. BUILD EMAIL TEMPLATES WITH THEME CLASSES
   For each required email template, create React Email components using the existing theme system:

   Theme Classes to Use (from styles/theme.css and styles/globals.css):
   - Backgrounds: theme-bg-card, theme-bg-muted, theme-bg-background
   - Text Colors: theme-text-foreground, theme-text-muted-foreground, theme-text-primary
   - Borders: theme-border-border
   - Spacing: theme-gap-4, theme-p-4, theme-px-4, theme-py-2, etc.
   - Border Radius: theme-radius
   - Box Shadow: theme-shadow
   - Fonts: theme-font, theme-font-serif, theme-font-mono
   - Letter Spacing: theme-tracking

   CSS Variables (from globals.css :root):
   - Colors: --background, --foreground, --card, --muted, --border, etc.
   - Radius: --radius
   - Other: Define as inline styles where theme classes aren't available

   Email Template Requirements:
   - Match the existing dark theme aesthetic (black/dark gray backgrounds)
   - Use proper semantic HTML for email compatibility
   - Include @react-email/components (Html, Head, Body, Container, Section, Text, Link, etc.)
   - Add appropriate Preview text for email clients
   - Keep layouts simple and email-client compatible
   - Test with common email clients in mind

5. IMPLEMENT SUPABASE AUTH EMAIL INTEGRATION
   - Configure Supabase to use custom SMTP (Resend)
   - Update Supabase dashboard settings with Resend SMTP details
   - Map Supabase auth email types to custom templates:
     * Confirmation email
     * Password reset email
     * Magic link email
     * Email change confirmation

6. CREATE EMAIL PREVIEW ROUTE (DEV ONLY)
   - Create app/api/preview-emails/route.tsx
   - Build an HTML page that lists all email templates
   - Add links to preview each template with sample data
   - Include query param routing (e.g., ?template=welcome)
   - Make it accessible only in development (check process.env.NODE_ENV)
   - Use realistic placeholder data for previews

7. CREATE SERVER ACTIONS FOR SENDING EMAILS
   - Update or create action files for email sending
   - Use Resend SDK to send emails
   - Implement proper error handling
   - Add TypeScript types for email data

8. UPDATE EXISTING EMAIL-SENDING CODE
   - Find all places where emails are currently sent
   - Update to use new Resend-based implementation
   - Ensure proper error handling and logging

9. TESTING & VALIDATION
   - Test email preview route in development
   - Verify all templates render correctly
   - Check mobile responsiveness of emails
   - Test actual email sending in development
   - Document any email sending limits or considerations

IMPORTANT IMPLEMENTATION NOTES:
- Follow the project's CLAUDE.md guidelines (no comments, proper error handling, etc.)
- Use existing project patterns for file organization
- All theme classes should match the current dark theme aesthetic
- Email templates must be compatible with major email clients
- Preview route should ONLY work in development environment
- Use the existing Resend package already installed in package.json
- Follow the existing email template patterns in emails/ directory

Please confirm you're ready to proceed once I provide the Resend credentials above.`;
};
