<!-- option-1 -->
### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run database migrations if using Supabase for database operations
<!-- /option-1 -->

<!-- option-2 -->
### NeonDB Setup

1. Create a database at [neon.tech](https://neon.tech)
2. Copy your connection string from the dashboard
3. Add to `.env.local`:
   ```
   DATABASE_URL=your_connection_string
   ```
4. Run Prisma migrations: `npx prisma migrate dev`
<!-- /option-2 -->

<!-- option-3 -->
### Prisma Setup

1. Ensure your database connection string is set in `.env.local`
2. Generate Prisma client: `npx prisma generate`
3. Run migrations: `npx prisma migrate dev`
4. (Optional) Seed database: `npx prisma db seed`
<!-- /option-3 -->

<!-- option-4 -->
### Better Auth Setup

1. Generate a secret key: `openssl rand -base64 32`
2. Add to `.env.local`:
   ```
   BETTER_AUTH_SECRET=your_generated_secret
   BETTER_AUTH_URL=http://localhost:3000
   ```
3. Configure authentication providers in `lib/auth.ts`
4. Run database migrations to create auth tables
<!-- /option-4 -->

<!-- option-5 -->
### Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard > Developers > API keys
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```
4. Set up webhooks for payment events
<!-- /option-5 -->

<!-- option-6 -->
### PayPal Setup

1. Create a developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a REST API app and get your credentials
3. Add to `.env.local`:
   ```
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   ```
4. Configure webhook endpoints for payment notifications
<!-- /option-6 -->

<!-- option-7 -->
### Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from Settings > API Keys
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key
   ```
4. Verify your sending domain in the Resend dashboard
<!-- /option-7 -->

<!-- option-8 -->
### OpenRouter Setup

1. Create an account at [openrouter.ai](https://openrouter.ai)
2. Get your API key from Settings > API Keys
3. Add to `.env.local`:
   ```
   OPENROUTER_API_KEY=your_api_key
   ```
4. Configure your preferred AI models in the application
<!-- /option-8 -->
