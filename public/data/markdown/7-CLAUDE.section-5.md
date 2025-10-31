<!-- option-1 -->
## File Storage (Supabase)

**When to use**: Selected when "File Storage" is enabled in InitialConfiguration (requires Supabase)

**Technologies**:
- **Supabase Storage**

**Import patterns**:
```typescript
import { createClient } from "@/lib/supabase/server";
```

**Server-side upload**:
```typescript
const supabase = createClient();
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file);
```

**Client-side upload**:
```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file);
```

**Get public URL**:
```typescript
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file');
```
<!-- /option-1 -->

<!-- option-2 -->
## PayPal Payments

**When to use**: Selected when "PayPal payments" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "@paypal/checkout-server-sdk": "latest"
  }
}
```

**Environment Variables**:
```env
PAYPAL_CLIENT_ID="your-client-id"
PAYPAL_CLIENT_SECRET="your-client-secret"
PAYPAL_MODE="sandbox"
```

**Server action example**:
```typescript
import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);
```
<!-- /option-2 -->

<!-- option-3 -->
## Stripe Payments

**When to use**: Selected when "Stripe payments" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "stripe": "latest",
    "@stripe/stripe-js": "latest"
  }
}
```

**Environment Variables**:
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Server-side setup**:
```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});
```

**Client-side setup**:
```typescript
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

**Create payment intent**:
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: "usd",
});
```
<!-- /option-3 -->

<!-- option-4 -->
## Stripe Subscriptions

**When to use**: Selected when "Stripe subscriptions" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "stripe": "latest",
    "@stripe/stripe-js": "latest"
  }
}
```

**Create subscription**:
```typescript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
});
```

**Webhook handling**:
```typescript
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "customer.subscription.updated") {
  }

  return new Response(JSON.stringify({ received: true }));
}
```
<!-- /option-4 -->

<!-- option-5 -->
## AI Image Generation (OpenRouter)

**When to use**: Selected when "Image generation" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "openai": "latest"
  }
}
```

**Environment Variables**:
```env
OPENROUTER_API_KEY="your-api-key"
```

**Server action example**:
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A beautiful landscape",
  n: 1,
  size: "1024x1024",
});
```
<!-- /option-5 -->

<!-- option-6 -->
## AI Text Generation/Analysis (OpenRouter)

**When to use**: Selected when "Text generation/analysis" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "openai": "latest"
  }
}
```

**Server action example**:
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [
    { role: "user", content: "Hello!" }
  ],
});
```

**Streaming response**:
```typescript
const stream = await openai.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [{ role: "user", content: "Tell me a story" }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}
```
<!-- /option-6 -->

<!-- option-7 -->
## Email Notifications (Resend)

**When to use**: Selected when "Email notifications" is enabled in InitialConfiguration

**Dependencies**:
```json
{
  "dependencies": {
    "resend": "latest"
  }
}
```

**Environment Variables**:
```env
RESEND_API_KEY="re_..."
```

**Server action example**:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "noreply@yourdomain.com",
  to: "user@example.com",
  subject: "Welcome",
  html: "<p>Welcome to our app!</p>",
});
```
<!-- /option-7 -->

<!-- option-8 -->
## In-App Notifications

**When to use**: Selected when "In-app notifications" is enabled in InitialConfiguration

**Database schema**:
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

**Create notification action**:
```typescript
const notification = await db.notification.create({
  data: {
    userId: userId,
    title: "New Message",
    message: "You have a new message",
  },
});
```

**Query notifications hook**:
```typescript
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await getNotificationsAction();
      return data;
    },
  });
};
```
<!-- /option-8 -->
