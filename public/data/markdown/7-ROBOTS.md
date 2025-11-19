# ROBOTS.md

This file provides guidance to AI assistants when working with code in this repository.

### Core Technologies

- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **TailwindCSS & Shadcn** for styling

<!-- section-1 -->

<!-- section-2 -->

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatenate classes.

# File Organization and Naming Conventions

- Types and store files alongside ancestor files
- Actions and hooks files alongside descendent files

```txt
app/
├── layout.tsx
├── layout.providers.tsx
├── layout.types.ts
├── layout.stores.ts ◄─── useAppStore
└── (dashboard)/
    ├── layout.tsx
    ├── layout.types.tsx
    ├── layout.stores.tsx ◄─── useDashboardStore
    ├── page.tsx              ─┐
    ├── page.hooks.tsx         ├────► useAppStore
    ├── Component.tsx          ├────► useDashboardStore
    ├── Component.hooks.tsx   ─┘
    ├── page.actions.ts
    └── Component.actions.ts

    key:
    ◄─── = defined
    ───► = imported
```

# Hook, action, store and type patterns

<!-- section-3 -->

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`.

<!-- section-4 -->
