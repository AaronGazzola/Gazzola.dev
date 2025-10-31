<!-- option-1 -->
## prisma-rls.ts (Row Level Security)

**When to use**: When using Supabase with Prisma and RLS enabled

**File**: `lib/prisma-rls.ts`

```typescript
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

function forUser(userId: string, tenantId?: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            if (tenantId) {
              const [, , result] = await prisma.$transaction([
                prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`,
                prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)`,
                query(args),
              ]);
              return result;
            } else {
              const [, result] = await prisma.$transaction([
                prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`,
                query(args),
              ]);
              return result;
            }
          },
        },
      },
    })
  );
}

export function createRLSClient(userId: string, tenantId?: string) {
  return prisma.$extends(forUser(userId, tenantId));
}
```
<!-- /option-1 -->

<!-- option-2 -->
## auth.utils.ts (Better-Auth Utilities)

**When to use**: When using Better-Auth for authentication

**File**: `lib/auth.utils.ts`

```typescript
import { User } from "better-auth";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { auth, Session } from "./auth";
import { createRLSClient } from "./prisma-rls";

export async function getAuthenticatedClient(user?: User): Promise<{
  db: ReturnType<typeof createRLSClient>;
  session: Session | null;
}> {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userId = user?.id || session?.user.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = createRLSClient(userId);

  return { db, session };
}

export function generateSupabaseJWT(userId: string, userRole: string): string {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is required for JWT generation");
  }

  const payload = {
    aud: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    sub: userId,
    email: `${userId}@better-auth.local`,
    role: "authenticated",
    user_metadata: {
      better_auth_user_id: userId,
      better_auth_role: userRole,
    },
    app_metadata: {
      provider: "better-auth",
      providers: ["better-auth"],
    },
  };

  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
  });
}
```
<!-- /option-2 -->

<!-- option-3 -->
## storage.utils.ts (Supabase Storage)

**When to use**: When Supabase storage is enabled

**File**: `lib/storage.utils.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}

export async function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}
```
<!-- /option-3 -->

<!-- option-4 -->
## payment.utils.ts (Stripe/PayPal)

**When to use**: When Stripe or PayPal is enabled

**File**: `lib/payment.utils.ts`

**Stripe utilities**:
```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  customerId?: string
) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
  });
}

export async function createSubscription(
  customerId: string,
  priceId: string
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}
```
<!-- /option-4 -->

<!-- option-5 -->
## ai.utils.ts (OpenRouter Integration)

**When to use**: When OpenRouter AI is enabled

**File**: `lib/ai.utils.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateText(
  prompt: string,
  model: string = "anthropic/claude-3.5-sonnet"
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0]?.message?.content || "";
}

export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024"
): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size,
    n: 1,
  });

  return response.data[0]?.url || "";
}

export async function streamText(
  prompt: string,
  model: string = "anthropic/claude-3.5-sonnet",
  onChunk: (chunk: string) => void
): Promise<void> {
  const stream = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      onChunk(content);
    }
  }
}
```
<!-- /option-5 -->

<!-- option-6 -->
## log.utils.ts (Logging Utility)

**When to use**: All projects

**File**: `lib/log.utils.ts`

```typescript
export enum LOG_LABELS {
  GENERATE = "generate",
  API = "api",
  AUTH = "auth",
  DB = "db",
  FETCH = "fetch",
  RATE_LIMIT = "rate-limit",
  IMAGE = "image",
  WIDGET = "widget",
}

interface ConditionalLogOptions {
  maxStringLength?: number;
  label: LOG_LABELS | string;
}

export function conditionalLog(
  data: unknown,
  options: ConditionalLogOptions
): string | null {
  const { maxStringLength = 200, label } = options;

  const logLabels = process.env.NEXT_PUBLIC_LOG_LABELS;

  if (!logLabels || logLabels === "none") {
    return null;
  }

  if (logLabels !== "all") {
    const allowedLabels = logLabels.split(",").map((l) => l.trim());
    if (!allowedLabels.includes(label)) {
      return null;
    }
  }

  try {
    const processedData = deepStringify(data, maxStringLength, new WeakSet());
    const result = JSON.stringify(processedData);
    return result.replace(/\s+/g, "");
  } catch (error) {
    return JSON.stringify({ error: "Failed to stringify data", label });
  }
}

function deepStringify(
  value: unknown,
  maxLength: number,
  seen: WeakSet<object>
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateString(value, maxLength);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncateString(value.message, maxLength),
      stack: value.stack ? truncateString(value.stack, maxLength) : undefined,
    };
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular Reference]";
    }

    seen.add(value);

    if (Array.isArray(value)) {
      const result = value.map((item) => deepStringify(item, maxLength, seen));
      seen.delete(value);
      return result;
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deepStringify(val, maxLength, seen);
    }
    seen.delete(value);
    return result;
  }

  return String(value);
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  const startLength = Math.floor((maxLength - 3) / 2);
  const endLength = maxLength - 3 - startLength;

  return str.slice(0, startLength) + "..." + str.slice(-endLength);
}
```
<!-- /option-6 -->

<!-- option-7 -->
## action.utils.ts (Server Action Response Helper)

**When to use**: All projects with server actions

**File**: `lib/action.utils.ts`

```typescript
export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
}

export function getActionResponse<T = unknown>({
  data,
  error,
}: {
  data?: T;
  error?: unknown;
} = {}): ActionResponse<T> {
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return { error: errorMessage };
  }

  return { data };
}
```
<!-- /option-7 -->
