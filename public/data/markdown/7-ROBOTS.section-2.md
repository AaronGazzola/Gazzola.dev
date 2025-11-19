<!-- option-1 -->
# Authentication Patterns

## Using Supabase Authentication

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

## Using Supabase RLS

```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*');
```
<!-- /option-1 -->

<!-- option-2 -->
# Authentication Patterns

## Using Better-Auth with Prisma

```typescript
import { getAuthenticatedClient } from '@/lib/auth.util';

export async function getData() {
  const { db, session } = await getAuthenticatedClient();
  return await db.user.findMany();
}
```

## Client-side Authentication

```typescript
import { authClient } from '@/lib/auth-client';

const { data: session } = authClient.useSession();
```
<!-- /option-2 -->

<!-- option-3 -->
# Authentication Patterns

## Using Better-Auth with NeonDB

```typescript
import { getAuthenticatedClient } from '@/lib/auth.util';

export async function getData() {
  const { db, session } = await getAuthenticatedClient();
  return await db.user.findMany();
}
```

## Using Supabase for Real-time Features

```typescript
import { createClient } from '@/lib/supabase/client';
import { generateSupabaseJWT } from '@/lib/auth.util';

const supabase = createClient();
const jwt = generateSupabaseJWT(userId, userRole);
await supabase.auth.setSession({ access_token: jwt, refresh_token: '' });
```
<!-- /option-3 -->

<!-- option-4 -->
# Authentication Patterns

No authentication required - this is a public application without user accounts.
<!-- /option-4 -->