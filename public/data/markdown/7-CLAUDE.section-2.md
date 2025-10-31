<!-- option-1 -->
## No Database

**When to use**: Selected when "No database" is chosen in InitialConfiguration

**Technologies**:
- Next.js 15
- TypeScript
- Client-side only state management

**Example state**:
```typescript
export interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}
```
<!-- /option-1 -->

<!-- option-2 -->
## NeonDB with Better-Auth

**When to use**: Selected when "NeonDB" database is chosen in InitialConfiguration

**Technologies**:
- **NeonDB** (serverless PostgreSQL)
- **Prisma** ORM
- **Better-Auth** for authentication
- **PostgreSQL** database

**Dependencies**:
```json
{
  "dependencies": {
    "@prisma/client": "latest",
    "better-auth": "latest",
    "postgres": "latest"
  }
}
```

**Environment Variables**:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

**Import patterns**:
```typescript
import { User } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
```

**Example usage**:
```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});

const { db } = await getAuthenticatedClient();
const user = await db.user.findUnique({
  where: { id: session.user.id },
});
```
<!-- /option-2 -->

<!-- option-3 -->
## Supabase with Better-Auth

**When to use**: Selected when "Supabase with Better-Auth" is chosen in InitialConfiguration

**Technologies**:
- **Supabase** (PostgreSQL + additional services)
- **Prisma** ORM
- **Better-Auth** for authentication
- **PostgreSQL** database with RLS support

**Dependencies**:
```json
{
  "dependencies": {
    "@prisma/client": "latest",
    "better-auth": "latest",
    "@supabase/supabase-js": "latest"
  }
}
```

**Environment Variables**:
```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_JWT_SECRET="your-jwt-secret"
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

**Import patterns**:
```typescript
import { User } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
import { createClient } from "@/lib/supabase/server";
```

**Example with RLS**:
```typescript
const { db } = await getAuthenticatedClient();
const data = await db.post.findMany({
  where: { published: true },
});
```
<!-- /option-3 -->

<!-- option-4 -->
## Supabase Only

**When to use**: Selected when "Supabase Only" is chosen in InitialConfiguration

**Technologies**:
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Prisma** ORM (optional)
- **PostgreSQL** database

**Dependencies**:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest"
  }
}
```

**Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**Import patterns**:
```typescript
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
```

**Example usage**:
```typescript
const supabase = createClient();
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```
<!-- /option-4 -->
