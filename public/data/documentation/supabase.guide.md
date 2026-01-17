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

## References

- [Supabase CLI Docs](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Type Generation](https://supabase.com/docs/guides/api/rest/generating-types)
- [Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- Template clients: `/documentation/template_files/template.supabase-*.ts`
