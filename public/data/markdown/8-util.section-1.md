<!-- option-1 -->
## Basic Types (No Database)

**When to use**: When no database is configured

**Example**:
```typescript
export interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface FormData {
  name: string;
  email: string;
}
```
<!-- /option-1 -->

<!-- option-2 -->
## Types with Prisma

**When to use**: When using NeonDB or Supabase with Prisma

**Import pattern**:
```typescript
import { User, Post } from "@prisma/client";
```

**Example**:
```typescript
import { User } from "@prisma/client";

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  tempEmail?: string;
  setTempEmail: (tempEmail: string) => void;
  reset: () => void;
}

export interface SignInData {
  email: string;
  password: string;
}
```
<!-- /option-2 -->

<!-- option-3 -->
## Types with Better-Auth Session

**When to use**: When using Better-Auth for authentication

**Import pattern**:
```typescript
import { Session } from "better-auth/types";
import { User } from "@prisma/client";
```

**Example**:
```typescript
import { User } from "@prisma/client";

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  reset: () => void;
}

export interface ExtendedUser extends User {
  profile?: {
    isOnboardingComplete: boolean;
  } | null;
}
```
<!-- /option-3 -->

<!-- option-4 -->
## Types with File Storage

**When to use**: When Supabase storage is enabled

**Example**:
```typescript
export interface FileUploadData {
  file: File;
  bucket: string;
  path: string;
}

export interface FileMetadata {
  url: string;
  path: string;
  size: number;
  mimeType: string;
}
```
<!-- /option-4 -->

<!-- option-5 -->
## Types with Payment Data

**When to use**: When Stripe or PayPal is enabled

**Example**:
```typescript
export interface PaymentIntentData {
  amount: number;
  currency: string;
  customerId?: string;
}

export interface SubscriptionData {
  priceId: string;
  customerId: string;
  trialDays?: number;
}
```
<!-- /option-5 -->

<!-- option-6 -->
## Types with AI Integration

**When to use**: When OpenRouter AI is enabled

**Example**:
```typescript
export interface ImageGenerationRequest {
  prompt: string;
  size: "1024x1024" | "1792x1024" | "1024x1792";
  model: string;
}

export interface ChatCompletionRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  model: string;
  stream?: boolean;
}
```
<!-- /option-6 -->
