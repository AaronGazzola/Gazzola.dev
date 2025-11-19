# lib/auth.ts

**Description:** Better Auth server configuration

**Required Technologies:** betterAuth, prisma

**Required Features:** authentication

---

## Inclusion Conditions

```typescript
config=>config.betterAuth&&config.databaseProvider!=="supabase"
```

**Excluded When:**
- File is conditionally included based on configuration

---

## Variation 1: Basic (No Plugins)

**Config Requirements:**
- `betterAuth: true`
- `databaseProvider: "neondb"`
- `plugins: []`

**Generated Code:**
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

---

## Variation 2: With Organization Plugin

**Config Requirements:**
- `betterAuth: true`
- `databaseProvider: "neondb"`
- `plugins: ["organization"]`

**Generated Code:**
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    organization()
  ],
});
```

---
