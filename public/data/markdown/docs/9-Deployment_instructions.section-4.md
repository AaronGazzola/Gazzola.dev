<!-- option-1 -->
### Authentication Setup (Better Auth)

**Database Schema:**
Better Auth creates necessary tables automatically on first run. Ensure your database is accessible.

**Email Provider Setup:**
Configure Resend for email authentication:
1. Verify your domain in Resend dashboard
2. Add SPF and DKIM records to your DNS
3. Test email delivery

**Magic Link Setup:**
Magic links are automatically configured if enabled. Ensure:
- `BETTER_AUTH_URL` is set to your production domain
- Email provider is configured correctly

**Two-Factor Authentication:**
2FA tables are created automatically. Users can enable in their account settings.

**Session Management:**
- Sessions are stored in database
- Default expiration: 30 days
- Refresh tokens enabled by default

**Passkey Setup:**
Passkeys require HTTPS:
- Ensure your domain has valid SSL certificate
- Passkeys stored securely in database
- Works with biometric authentication
<!-- /option-1 -->

<!-- option-2 -->
### Authentication Setup (Supabase Auth)

**Email Templates:**
Customize email templates in Supabase dashboard:
1. Navigate to Authentication → Email Templates
2. Customize confirmation, magic link, and password reset emails
3. Add your branding and domain

**OAuth Providers:**
Configure in Supabase dashboard under Authentication → Providers:
- Add client IDs and secrets
- Set redirect URLs
- Enable providers

**Email Confirmation:**
Configure email confirmation settings:
- Require email confirmation for new signups
- Set confirmation token expiration
- Configure redirect URLs

**Password Requirements:**
Set password policies:
- Minimum length
- Require special characters
- Password history

**Session Management:**
- Sessions managed by Supabase
- Configure JWT expiry
- Set up refresh token rotation
<!-- /option-2 -->

<!-- option-3 -->
### Organization Setup (Better Auth)

**Super Admin Creation:**
Create your first super admin using the CLI:

```bash
npm run create-super-admin
```

Or manually insert into database:
```sql
INSERT INTO users (email, role)
VALUES ('admin@yourdomain.com', 'super_admin');
```

**Organization Creation:**
Super admins can create organizations through the admin panel or API.

**Role Assignment:**
- Super admins: Full system access
- Org admins: Manage their organization and members
- Org members: Read access to organization data

**RLS Policies:**
Ensure Row Level Security policies are enabled for organization tables:
- Users can only see their organization data
- Org admins can manage org members
- Super admins have full access
<!-- /option-3 -->
