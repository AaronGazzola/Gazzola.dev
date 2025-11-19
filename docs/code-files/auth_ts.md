# lib/auth.ts

**Description:** Better Auth server configuration with plugins based on selected auth methods and roles

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
});

export type Session = typeof auth.$Infer.Session;
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
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const prisma = new PrismaClient();

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({});

const admin = ac.newRole({
  ...adminAc.statements,
});

const superAdmin = ac.newRole({
  ...adminAc.statements,
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    organization({
      ac,
      roles: { owner: superAdmin, admin, member: user }
    })
  ],
});

export type Session = typeof auth.$Infer.Session;
```

---
