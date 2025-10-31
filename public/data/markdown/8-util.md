# Utility File Patterns

## Types File Examples

<!-- section-1 -->

## Stores File Examples

<!-- section-2 -->

## Actions File Examples

<!-- section-3 -->

## Hooks File Examples

<!-- section-4 -->

## Utility Files

<!-- section-5 -->

# Toast Component Example

```typescript
import { toast } from "sonner";
import { Toast } from "@/app/(components)/Toast";
import { TestDataAttributes } from "@/test.types";

toast.custom(() => (
  <Toast
    variant="success"
    title="Success"
    message="Operation completed successfully"
    data-cy={TestDataAttributes.TOAST_SUCCESS}
  />
));

toast.custom(() => (
  <Toast
    variant="error"
    title="Error"
    message="An error occurred while processing your request"
    data-cy={TestDataAttributes.TOAST_ERROR}
  />
));

toast.custom(() => (
  <Toast
    variant="info"
    title="Information"
    message="Please review the details before proceeding"
    data-cy={TestDataAttributes.TOAST_INFO}
  />
));
```

# Better Auth Organization & Role Management

This section provides comprehensive examples for implementing organization and role management with Better-Auth.

## Database Schema - `schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "public"]
}

model user {
  id               String       @id @default(cuid())
  email            String       @unique
  name             String?
  role             String       @default("user")
  banned           Boolean      @default(false)
  banReason        String?
  banExpires       DateTime?
  emailVerified    Boolean?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  image            String?
  MagicLink        MagicLink[]
  account          account[]
  invitation       invitation[]
  member           member[]
  session          session[]

  @@schema("auth")
}

model session {
  id                   String   @id @default(cuid())
  userId               String
  expiresAt            DateTime
  token                String   @unique
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  ipAddress            String?
  userAgent            String?
  impersonatedBy       String?
  activeOrganizationId String?
  user                 user     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@schema("auth")
}

model account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  user      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@schema("auth")
}

model verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
  @@schema("auth")
}

model MagicLink {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  email     String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      user     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@schema("auth")
}

model organization {
  id         String       @id @default(cuid())
  name       String
  slug       String       @unique
  logo       String?
  metadata   Json?
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  invitation invitation[]
  member     member[]

  @@schema("auth")
}

model member {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           String       @default("member")
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  organization   organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           user         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@schema("auth")
}

model invitation {
  id             String       @id @default(cuid())
  organizationId String
  email          String
  role           String       @default("member")
  inviterId      String
  token          String?      @unique
  status         String       @default("pending")
  expiresAt      DateTime
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  user           user         @relation(fields: [inviterId], references: [id], onDelete: Cascade)
  organization   organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([email, organizationId])
  @@schema("auth")
}
```

## Console Logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`

The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`.
