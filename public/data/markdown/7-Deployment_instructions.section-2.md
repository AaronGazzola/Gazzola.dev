<!-- option-1 -->
### No Database Deployment

Your application is configured without a database backend. No additional database setup is required.

**Static Content:**
- All data is client-side only
- Consider using environment variables for configuration
- Perfect for static sites and applications without persistent data
<!-- /option-1 -->

<!-- option-2 -->
### NeonDB Deployment

**Prerequisites:**
- NeonDB account (sign up at [neon.tech](https://neon.tech))

**Steps:**

1. Create a new project in NeonDB dashboard
2. Copy your connection string from the dashboard
3. Set environment variable in your deployment platform:
   - `DATABASE_URL=your-neondb-connection-string`

**Database Schema Setup:**

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Push schema to database:
```bash
npx prisma db push
```

3. Or use migrations:
```bash
npx prisma migrate deploy
```

**Connection Pooling:**
NeonDB provides built-in connection pooling. Use the pooled connection string for serverless environments.

**Branching:**
NeonDB supports database branching:
- Create branches for preview deployments
- Automatically create database branches per pull request
- Configure in your CI/CD pipeline

**Monitoring:**
- Access database metrics in NeonDB dashboard
- Set up alerts for connection limits
- Monitor query performance
<!-- /option-2 -->

<!-- option-3 -->
### Supabase Deployment

**Prerequisites:**
- Supabase account (sign up at [supabase.com](https://supabase.com))

**Steps:**

1. Create a new project in Supabase dashboard
2. Note your project URL and anon key
3. Set environment variables in your deployment platform:
   - `VITE_SUPABASE_URL=your-project-url`
   - `VITE_SUPABASE_ANON_KEY=your-anon-key`
   - `DATABASE_URL=your-connection-string` (for Prisma)

**Database Schema Setup:**

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Push schema to database:
```bash
npx prisma db push
```

**Row Level Security (RLS):**
Enable RLS policies through Supabase dashboard:
1. Navigate to Authentication → Policies
2. Create policies for each table
3. Test policies using the SQL editor

**Storage Setup:**
If using Supabase Storage:
1. Create storage buckets in dashboard
2. Configure bucket policies
3. Set CORS policies if needed

**Realtime Setup:**
Enable realtime for tables:
1. Go to Database → Replication
2. Enable replication for tables
3. Configure realtime listeners in your application

**Edge Functions (Optional):**
Deploy edge functions for server-side logic:
```bash
supabase functions deploy function-name
```

**Monitoring:**
- Access logs in Supabase dashboard
- Monitor API usage and database performance
- Set up error tracking
<!-- /option-3 -->
