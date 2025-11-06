<!-- option-1 -->
## Configuration

### Environment Variables

Create a file named `.env.local` in the root of your project. This file stores sensitive configuration data:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
<!-- /option-1 -->

<!-- option-2 -->
Add your NeonDB connection string:

```env
DATABASE_URL="your-neondb-connection-string"
```

Get your connection string from your NeonDB dashboard at [neon.tech](https://neon.tech).
<!-- /option-2 -->

<!-- option-3 -->
Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in your Supabase project's API settings.
<!-- /option-3 -->

<!-- option-4 -->
Add your Better Auth configuration:

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

Generate a secure secret key by running:

```bash
openssl rand -base64 32
```
<!-- /option-4 -->

<!-- option-5 -->
Add your Stripe keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
STRIPE_SECRET_KEY=your-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

Get these from your Stripe Dashboard at [stripe.com/dashboard](https://dashboard.stripe.com).
<!-- /option-5 -->

<!-- option-6 -->
Add your PayPal credentials:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
```

Get these from your PayPal Developer Dashboard at [developer.paypal.com](https://developer.paypal.com).
<!-- /option-6 -->

<!-- option-7 -->
Add your Resend API key:

```env
RESEND_API_KEY=your-resend-api-key
```

Get your API key from [resend.com/api-keys](https://resend.com/api-keys).
<!-- /option-7 -->

<!-- option-8 -->
Add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your-openrouter-api-key
```

Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys).
<!-- /option-8 -->
