# Supabase Setup Guide

Quick reference for Supabase CLI, migrations, and type generation with Next.js 15.

## Supabase CLI Installation

The CLI is available through npx (no global install needed):

```bash
npx supabase --version
```

## Project Linking

Link your local project to your hosted Supabase project:

```bash
npx supabase link --project-ref <your-project-ref>
```

**Finding your project-ref**:

1. Go to your Supabase dashboard
2. The project-ref is in the URL: `https://supabase.com/dashboard/project/[project-ref]`
3. Or find it in Project Settings → General → Reference ID

## Database Migrations

### Create Migration

Create a new migration file:

```bash
npx supabase migration new initial_schema
```

This creates: `supabase/migrations/<timestamp>_initial_schema.sql`

### Add Schema

Copy your complete database schema (including RLS policies) from Database.md into the migration file. The schema should include:

- Table definitions
- Indexes
- RLS policies
- Enum types

### Push Migration

Apply migration to remote database:

```bash
npx supabase db push
```

This executes all pending migrations on your remote database.

## Type Generation

Generate TypeScript types from your database schema:

```bash
npx supabase gen types typescript --project-id <project-ref> > supabase/types.ts
```

Run this command after:

- Initial migration push
- Any schema changes
- Adding or modifying tables

The generated types file exports a `Database` type used throughout your application.

## Supabase Client Setup

### Server Client (Server Components & Actions)

```typescript
"use server";

import type { Database } from "@/supabase/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

Use in server actions for database queries with user authentication.

### Browser Client (Client Components)

```typescript
import { ENV, getBrowserAPI } from "@/lib/env.utils";
import type { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: getBrowserAPI(() => localStorage),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
```

Use in React Query hooks for auth operations and real-time subscriptions.

### Admin Client (Server-Only Admin Operations)

```typescript
"use server";

import type { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

Use only for admin operations that bypass RLS.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT_REF=your_project_ref
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
```

## Authentication Patterns

Authentication is handled through Supabase auth methods:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

await supabase.auth.signOut();
```

All database queries respect RLS policies defined in migrations.

## Type Usage

Import and use generated types:

```typescript
import type { Database } from "@/supabase/types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
```

## Remote Database CLI Commands

Commands for managing your remote Supabase database.

### Reset Remote Database

Reset your remote database to match local migrations:

```bash
npx supabase db reset --linked
```

This command will delete all data and reapply migrations from your `supabase/migrations` folder to the remote database.

### Pull Remote Schema

Pull the current remote schema as a new migration:

```bash
npx supabase db pull
```

Creates a new migration file with the current remote database schema.

### View Database Status

Check which migrations have been applied:

```bash
npx supabase migration list
```

### Repair Migration History

Fix migration history if it's out of sync:

```bash
npx supabase migration repair <timestamp> --status applied
```

## Database Seeding

Seed scripts populate your database with test data for development and testing.

### Create Seed Script

Create a TypeScript seed script at `supabase/seed.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seed() {
  console.log("Starting database seed...");

  const testUsers = [
    {
      email: "admin@example.com",
      password: "AdminPassword123!",
      role: "admin",
    },
    {
      email: "user1@example.com",
      password: "UserPassword123!",
      role: "user",
    },
    {
      email: "user2@example.com",
      password: "UserPassword123!",
      role: "user",
    },
  ];

  for (const userData of testUsers) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError);
      continue;
    }

    console.log(`Created user: ${userData.email}`);

    if (authData.user) {
      const { error: profileError } = await supabase
        .from("users")
        .update({ role: userData.role })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error(
          `Error updating profile for ${userData.email}:`,
          profileError
        );
      }
    }
  }

  console.log("Seed complete!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
```

### Run Seed Script

Add to `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx supabase/seed.ts",
    "db:reset-seed": "bash scripts/reset-seed.sh"
  }
}
```

Install `tsx` if needed:

```bash
npm install -D tsx
```

Run the seed:

```bash
npm run db:seed
```

### Reset and Seed

Create `scripts/reset-seed.sh`:

```bash
#!/bin/bash

echo "⚠️  WARNING: This will reset your database and delete ALL data!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "❌ Operation cancelled"
  exit 1
fi

echo ""
echo "🔄 Resetting database..."
npx supabase db reset --linked --yes

if [ $? -ne 0 ]; then
  echo "❌ Database reset failed"
  exit 1
fi

echo ""
echo "⏳ Waiting for PostgREST schema cache to refresh..."
sleep 3

echo ""
echo "🌱 Running seed script..."
tsx supabase/seed.ts

if [ $? -ne 0 ]; then
  echo "❌ Seed script failed"
  exit 1
fi

echo ""
echo "✅ Database reset and seed complete!"
```

Make the script executable:

```bash
chmod +x scripts/reset-seed.sh
```

Run reset and seed:

```bash
npm run db:reset-seed
```

This will prompt for confirmation, reset the remote database, wait for PostgREST cache refresh, and populate with test data.

### Seed Script Best Practices

1. Use service role key for bypassing RLS during seeding
2. Create users with `auth.admin.createUser()` with `email_confirm: true`
3. Never insert directly into `auth.users` table
4. Use meaningful test data that represents real scenarios
5. Include at least one admin user with a valid, accessible email
6. Log progress to track seeding status
7. Handle errors gracefully to identify issues

## References

- [Supabase CLI Docs](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Type Generation](https://supabase.com/docs/guides/api/rest/generating-types)
- [Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Seeding Documentation](https://supabase.com/docs/guides/local-development/seeding-your-database)
- Template clients: `/documentation/template_files/template.supabase-*.ts`
