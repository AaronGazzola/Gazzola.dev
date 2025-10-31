# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Technologies

<!-- section-1 -->

## Database & Authentication

<!-- section-2 -->

## Deployment Platform

<!-- section-3 -->

## Authentication Methods

<!-- section-4 -->

## Additional Features

<!-- section-5 -->

## Testing Framework

<!-- section-6 -->

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatenate classes.
- Always use `@/lib/env.utils` for environment variables and browser APIs to ensure unit test compatibility.

# File Organization and Naming Conventions

- Types and store files alongside ancestor files
- Actions and hooks files alongside descendent files

```txt
src/
├── components/
│   ├── Component.tsx
│   └── Component.types.ts
├── pages/
│   ├── Page.tsx
│   ├── Page.hooks.tsx
│   └── Page.types.ts
├── hooks/
│   └── useFeature.tsx
└── lib/
    ├── utils.ts
    └── log.utils.ts

    key:
    ◄─── = defined
    ───► = imported
```

# Hook, action, store and type patterns

DB <-> Supabase Client <-> hook <-> store

- Supabase client queries are called directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store (if applicable).
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `@/integrations/supabase/types`.

## Example of file patterns - [`docs/util.md`](docs/util.md)

Follow the examples outlined in [`docs/util.md`](docs/util.md) when working on hook, store or type files.

# Testing

All tests should be performed with Jest or Playwright and documented in the `Tests.md` document

## Test rules:

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.

## Tests.md

The test document should list all tests in the repo, with each test case listed in a single line with an indented line below with the pass condition.
Test document should begin with an index and number each test as demonstrated below:

# Tests.md file example:

```md
# Tests Documentation

## Run All Tests

**Command:** `npm run test`
✓ Runs the complete test suite across all test files

## Test Index

1. [Name](#1-name-tests) - `npm run test:name`

## 1. Name Tests

**File:** `__tests__/name.test.ts`
**Command:** `npm run test:name`

### Name Test

- should do something
  ✓ Validates expected results

- should do something else
  ✓ Validates expected results
```

# Environment Variables and Browser APIs

All environment variable access and browser API usage must use the centralized utilities from `@/lib/env.utils`:

```typescript
import { ENV, getBrowserAPI } from "@/lib/env.utils";

const apiUrl = ENV.SUPABASE_URL;
const storage = getBrowserAPI(() => localStorage);
```

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `VITE_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `VITE_LOG_LABELS="all"`, or if `VITE_LOG_LABELS` includes the label arg in `conditionalLog`.
