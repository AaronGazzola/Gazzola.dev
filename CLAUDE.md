# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Core Technologies

- **Vite 5** with React Router
- **TypeScript** for type safety
- **TailwindCSS & Shadcn** for styling
- **Jest & Playwright** for testing
- **Supabase** for database and authentication _(remote DB only)_

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

## Example of file patterns - [`util.md`](util.md)

Follow the examples outlined in [`util.md`](util.md) when working on hook, store or type files.

# Testing

All tests should be performed with Jest or Playwright and documented in the `Tests.md` document

## Test rules:

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from `@/test.types.ts`
- Do not use wait in the tests. Only use timeouts.

# Testing

All tests should be performed with Playwright and documented in the `Tests.md` document. For complete testing instructions, patterns, and documentation format, refer to [`docs/Testing.md`](docs/Testing.md).

# Environment Variables and Browser APIs

All environment variable access and browser API usage must use the centralized utilities from `@/lib/env.utils`:

```typescript
import { ENV, getBrowserAPI } from "@/lib/env.utils";

const apiUrl = ENV.SUPABASE_URL;
const storage = getBrowserAPI(() => localStorage);
```

This ensures universal compatibility between browser and Node.js test environments with zero performance overhead.

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `VITE_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `VITE_LOG_LABELS="all"`, or if `VITE_LOG_LABELS` includes the label arg in `conditionalLog`.

# Code File Generation

This project uses a declarative configuration system for generating code files. The system is documented in:

- **[Code Files Documentation](docs/code-files/index.md)** - Overview of all generated files and their variations
- **Configuration System** - Located in `lib/code-file-config.ts`
- **Templates** - Located in `lib/code-templates.ts`

To regenerate documentation after making changes to the configuration system:

```bash
npm run docs:generate
```

This will create/update markdown files in `docs/code-files/` showing:

- All file variations based on configuration
- Inclusion conditions for each file
- Required technologies and features
- Generated code examples
