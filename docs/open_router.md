# OpenRouter Integration

## Overview

OpenRouter API integration for code generation with device fingerprint-based rate limiting (10 requests/minute).

## Architecture

```
Client                          Server
──────                          ──────
FingerprintJS ──► fingerprint
                      │
useCodeGeneration ────┼──► POST /api/openrouter
                      │         │
                      │    Rate Limiter (in-memory)
                      │         │
                      │    OpenRouter API
                      │         │
                      ◄─────────┘
```

## Files

| File | Purpose |
|------|---------|
| `lib/openrouter.types.ts` | Shared types for request/response |
| `lib/rate-limiter.ts` | Sliding window rate limiter |
| `lib/fingerprint.utils.ts` | Client-side device fingerprinting |
| `app/api/openrouter/route.ts` | API route with rate limiting |
| `app/(editor)/openrouter.hooks.tsx` | React Query mutation hook |
| `app/(editor)/openrouter.types.ts` | Editor types and data attributes |

## Usage

### Basic Implementation

```tsx
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";

function CodeGenerator() {
  const { mutate, isPending, error } = useCodeGeneration((response) => {
    console.log(response.content);
  });

  const handleGenerate = () => {
    mutate({
      prompt: "Create a React button component with hover state",
      context: "TypeScript, TailwindCSS, shadcn/ui",
      maxTokens: 2048,
    });
  };

  return (
    <button onClick={handleGenerate} disabled={isPending}>
      {isPending ? "Generating..." : "Generate Code"}
    </button>
  );
}
```

### Input Parameters

```typescript
interface CodeGenerationInput {
  prompt: string;      // Required: The generation prompt
  context?: string;    // Optional: System context for the model
  maxTokens?: number;  // Optional: Max tokens (default: 4096)
}
```

### Response

```typescript
interface OpenRouterResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

## Rate Limiting

- **Limit:** 10 requests per minute per device
- **Algorithm:** Sliding window
- **Storage:** In-memory (resets on server restart)
- **Response:** 429 status with `Retry-After` header when exceeded

### Rate Limit Headers

Successful responses include:
- `X-RateLimit-Remaining`: Requests left in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets

## Error Handling

The hook automatically handles errors with toast notifications:

```typescript
// Rate limit error
{ message: "Rate limit exceeded. Try again in 45 seconds.", retryAfter: 45 }

// API error
{ message: "OpenRouter request failed" }
```

## Testing

Use data attributes from `OpenRouterDataAttributes`:

```typescript
import { OpenRouterDataAttributes } from "@/app/(editor)/openrouter.types";

<button data-testid={OpenRouterDataAttributes.GENERATE_BUTTON}>
  Generate
</button>
```

## Environment Variables

```env
OPENROUTER_API_KEY=sk-or-v1-xxx
```

Accessed via `ENV.OPENROUTER_API_KEY` from `@/lib/env.utils`.
