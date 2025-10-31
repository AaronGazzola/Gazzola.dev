<!-- option-1 -->
## Basic Server Actions (No Auth)

**When to use**: Simple server actions without authentication

**Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";

export const getDataAction = async (): Promise<ActionResponse<string[]>> => {
  try {
    const data = ["item1", "item2", "item3"];
    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-1 -->

<!-- option-2 -->
## Actions with Better-Auth

**When to use**: When using Better-Auth for authentication

**Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { User } from "@prisma/client";
import { headers } from "next/headers";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return getActionResponse();

    return getActionResponse({ data: session.user as User });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-2 -->

<!-- option-3 -->
## Actions with Prisma + RLS

**When to use**: When using Prisma with Row Level Security

**Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
import { User } from "@prisma/client";
import { headers } from "next/headers";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return getActionResponse();

    const { db } = await getAuthenticatedClient();

    const prismaUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    return getActionResponse({ data: prismaUser });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-3 -->

<!-- option-4 -->
## Actions with File Upload (Supabase)

**When to use**: When Supabase storage is enabled

**Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { createClient } from "@/lib/supabase/server";

export const uploadFileAction = async (
  formData: FormData
): Promise<ActionResponse<{ url: string }>> => {
  try {
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const path = formData.get("path") as string;

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return getActionResponse({ data: { url: urlData.publicUrl } });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-4 -->

<!-- option-5 -->
## Actions with Payments (Stripe/PayPal)

**When to use**: When Stripe or PayPal is enabled

**Stripe Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export const createPaymentIntentAction = async (
  amount: number
): Promise<ActionResponse<{ clientSecret: string }>> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    return getActionResponse({
      data: { clientSecret: paymentIntent.client_secret! },
    });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-5 -->

<!-- option-6 -->
## Actions with AI Integration (OpenRouter)

**When to use**: When OpenRouter AI is enabled

**Example**:
```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateTextAction = async (
  prompt: string
): Promise<ActionResponse<{ text: string }>> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content || "";

    return getActionResponse({ data: { text } });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```
<!-- /option-6 -->
