# ROBOTS.md

This file provides guidance to AI assistants when working with code in this repository.

### Tech stack

- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **TailwindCSS & Shadcn** for styling

<!-- section-1 -->

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatenate classes.

# File Organization and Naming Conventions

- Types and store files alongside ancestor files
- Actions and hooks files alongside descendent files

```

# Hook, action, store and type patterns

<!-- section-2 -->

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`.

```
