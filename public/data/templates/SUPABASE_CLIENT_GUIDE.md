# Supabase Client Implementation Guide

## Key Types Overview

### Publishable Key (`sb_publishable_...`)
- **Use in**: Browser and server-side code
- **Replaces**: Legacy `anon` key
- **Security**: Safe to expose in browser if RLS is enabled
- **Access**: Respects Row Level Security (RLS) policies
- **User context**: Respects authenticated user sessions

### Secret Key (`sb_secret_...`)
- **Use in**: Server-side admin operations ONLY
- **Replaces**: Legacy `service_role` key
- **Security**: NEVER expose in browser, bypasses RLS
- **Access**: Full database access, elevated permissions
- **User context**: No user context, admin-level access

**IMPORTANT**: RLS behavior is determined by the KEY, not the client type!

## When to Use Each Client

### Browser Client (`template.supabase-browser-client.ts`)
**Uses: Publishable Key**

**Use for:**
- Client-side auth operations (login, signup, logout)
- Real-time subscriptions
- User-specific queries (protected by RLS)
- Direct database queries from React components via hooks

**Key characteristics:**
- Uses publishable key (respects RLS)
- Auto-refreshes auth tokens
- Persists session in localStorage
- Used in React Query hooks

**Example usage:**
```typescript
import { supabase } from "@/lib/supabase/browser";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });
};
```

### Server Client (`template.supabase-server-client.ts`)
**Uses: Publishable Key + SSR Cookie Management**

**Use for:**
- Server actions ("use server")
- User-scoped database queries (respects RLS)
- Operations that need authenticated user context
- Any server-side operation where RLS should be enforced

**Key characteristics:**
- Uses publishable key (respects RLS)
- Reads user session from cookies
- Must validate auth using `auth.getUser()` or `auth.getClaims()`
- Middleware handles cookie updates

**Example usage:**
```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserAction() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}
```

### Admin Client (`template.supabase-admin-client.ts`)
**Uses: Secret Key (Direct createClient, NOT SSR)**

**Use for:**
- Admin operations that bypass RLS
- Background jobs and scheduled tasks
- System-level operations (user management, bulk operations)
- Server-side operations requiring elevated permissions

**Key characteristics:**
- Uses secret key (bypasses RLS)
- NO user context (admin-level access)
- Must use direct `createClient`, NOT `createServerClient`
- Never expose this client to the browser

**CRITICAL**: Cannot use `createServerClient` with secret key because user sessions in cookies would override the key and enforce RLS.

**Example usage:**
```typescript
"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function deleteUserAdmin(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) throw error;
  return { success: true };
}
```

## Auth State Management

### How Auth State Flows

1. **Browser → Server (Cookie-based)**
   - User authenticates in browser client
   - Auth tokens stored in localStorage
   - Tokens sent to server via cookies
   - Server validates tokens using `auth.getUser()` or `auth.getClaims()`

2. **Token Refresh Flow**
   - Browser client auto-refreshes tokens
   - Middleware intercepts requests
   - Middleware updates cookies with new tokens
   - Server components read fresh tokens from cookies

3. **Middleware Role** (`template.supabase-middleware.ts`)
   - Refreshes auth tokens on each request
   - Updates cookies with new tokens
   - Protects routes (redirects unauthenticated users)
   - Ensures server and client have synchronized auth state

### Critical Security Rules

**1. RLS is Determined by KEY, Not Client Type**
- Publishable key: Respects RLS (both browser and server)
- Secret key: Bypasses RLS (server admin operations only)

**2. SSR Client Caveat**
- Even with secret key, `createServerClient` will enforce RLS if user session exists in cookies
- User session in Authorization header overrides the API key
- For RLS bypass: Use direct `createClient` with secret key, NOT `createServerClient`

**3. Server-Side Validation**
- ALWAYS use `auth.getUser()` or `auth.getClaims()` to validate auth
- NEVER trust `auth.getSession()` alone on the server
- `getClaims()` validates JWT signature every time
- `getSession()` returns cached data without validation

**Example - WRONG:**
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (session) {
}
```

**Example - CORRECT:**
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) throw new Error("Unauthorized");
```

## Implementation Patterns

### Pattern 1: User-Scoped Operations (Respects RLS)

**Browser (via hooks) → Server Action (with user context) → Database**

```typescript
import { useMutation } from "@tanstack/react-query";
import { updateUserAction } from "./page.actions";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUserAction,
    onSuccess: (data) => {
    },
  });
};
```

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUserAction(updates: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Pattern 2: Admin Operations (Bypasses RLS)

**Server Action (admin client) → Database**

```typescript
"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function bulkUpdateUsers(updates: any[]) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(updates);

  if (error) throw error;
  return data;
}
```

### Pattern 3: Auth Operations

**Browser client handles auth directly (no server actions needed)**

```typescript
import { supabase } from "@/lib/supabase/browser";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
  });
};
```

## Environment Variables

Update your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

Update `lib/env.utils.ts`:

```typescript
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || "",
};
```

## Migration from Legacy Keys

The new keys work as drop-in replacements:
- `anon` key → `publishable` key
- `service_role` key → `secret` key

You can use both during transition, but should migrate to new keys.

## Sources

- [Creating a Supabase client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Understanding API keys](https://supabase.com/docs/guides/api/api-keys)
- [Upcoming changes to Supabase API Keys](https://github.com/orgs/supabase/discussions/29260)
- [Server-side Auth Advanced Guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
- [Managing Supabase Auth State Across Server & Client Components](https://dev.to/jais_mukesh/managing-supabase-auth-state-across-server-client-components-in-nextjs-2h2b)
