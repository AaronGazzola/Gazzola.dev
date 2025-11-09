<!-- option-1 -->
### Core Environment Variables

Required for all deployments:

```env
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
```
<!-- /option-1 -->

<!-- option-2 -->
### Database Environment Variables

**For NeonDB:**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname
```

**For Supabase:**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```
<!-- /option-2 -->

<!-- option-3 -->
### Better Auth Environment Variables

```env
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=https://your-domain.com
```

Generate a secure secret:
```bash
openssl rand -base64 32
```
<!-- /option-3 -->

<!-- option-4 -->
### Email Service (Resend)

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
VITE_FROM_EMAIL=noreply@yourdomain.com
```

Get your API key from [resend.com/api-keys](https://resend.com/api-keys)
<!-- /option-4 -->

<!-- option-5 -->
### Stripe Payment Variables

```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

**Setup:**
1. Get keys from Stripe Dashboard
2. Set up webhook endpoint at `/api/webhooks/stripe`
3. Configure webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
<!-- /option-5 -->

<!-- option-6 -->
### PayPal Payment Variables

```env
PAYPAL_CLIENT_ID=xxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxx
PAYPAL_MODE=live
```

**Setup:**
1. Create app in PayPal Developer Dashboard
2. Get credentials from app settings
3. Use `sandbox` mode for testing, `live` for production
<!-- /option-6 -->

<!-- option-7 -->
### OpenRouter AI Variables

```env
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
```

Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys)
<!-- /option-7 -->

<!-- option-8 -->
### OAuth Provider Variables (Google)

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxx
```

**Setup:**
1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
<!-- /option-8 -->

<!-- option-9 -->
### OAuth Provider Variables (GitHub)

```env
GITHUB_CLIENT_ID=xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxx
```

**Setup:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `https://your-domain.com/api/auth/callback/github`
<!-- /option-9 -->

<!-- option-10 -->
### OAuth Provider Variables (Apple)

```env
APPLE_CLIENT_ID=com.yourapp.service
APPLE_TEAM_ID=xxxxxxxxxxxx
APPLE_KEY_ID=xxxxxxxxxxxx
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**Setup:**
1. Create Service ID in Apple Developer Account
2. Configure Sign in with Apple
3. Generate private key
4. Set return URL: `https://your-domain.com/api/auth/callback/apple`
<!-- /option-10 -->
