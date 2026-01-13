# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Core Technologies

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Shadcn/ui** for UI components
- **Supabase** for database and authentication (Remote only, no local db)
- **Zustand** for state management
- **React Query** for data fetching

# General rules:

- Don't include any comments in any files.
- Don't use `console.log` in any app code unless requested, delete all logs after the related development is completed
- All errors should be thrown - no "fallback" functionality
- All errors should be logged with `console.error`
- Import "cn" from "@/lib/utils" to concatenate classes.

# File Organization and Naming Conventions

## Example App Structure

```txt
app/
├── layout.tsx
├── layout.stores.ts
├── layout.actions.ts
├── layout.types.ts
│
├── (auth)/
│   ├── layout.tsx
│   └── login/
│       ├── page.tsx
│       ├── page.hooks.tsx
│       └── page.types.ts
│
├── (dashboard)/
│   ├── layout.tsx
│   ├── layout.stores.ts
│   ├── page.tsx
│   ├── page.hooks.tsx
│   │
│   └── analytics/
│       ├── page.tsx
│       ├── page.stores.ts
│       └── page.hooks.tsx
│
└── [username]/
    ├── page.tsx
    ├── page.actions.ts
    ├── page.types.ts
    │
    └── edit/
        ├── page.tsx
        ├── page.stores.ts
        └── page.hooks.tsx
```

## Utility File Placement Strategy

**Shared functionality → Higher in tree:**

- Auth state → `app/layout.stores.ts` (used everywhere)
- User profile actions → `app/layout.actions.ts` (used in multiple places)
- Theme state → `app/layout.stores.ts` (global)

**Section-specific → Middle level:**

- Dashboard sidebar → `app/dashboard/layout.stores.ts` (all dashboard pages)
- Admin permissions → `app/(admin)/layout.stores.ts` (all admin pages)

**Page-specific → Same directory:**

- Chart data → `app/analytics/page.stores.ts` (only analytics page)
- Form state → `app/contact/page.stores.ts` (only contact page)

## Next.js Routing Patterns

**page.tsx creates routes:**

- `/dashboard` → `app/dashboard/page.tsx`
- `/` → `app/page.tsx`
- `/users/alice` → `app/users/[username]/page.tsx`

**Route Groups (parentheses) organize without affecting URL:**

- `app/(auth)/login/page.tsx` → URL: `/login` (NOT `/auth/login`)
- `app/(dashboard)/page.tsx` → URL: `/` (root page with both `app/layout.tsx` and `app/(dashboard)/layout.tsx` applied)
- Use for: grouping related pages that share a layout

**Dynamic Routes [brackets]:**

- `[id]`, `[slug]`, `[username]` for single parameter
- `[...slug]` for catch-all
- `[[...slug]]` for optional catch-all

**Layouts wrap child pages:**

- `app/layout.tsx` wraps entire app (REQUIRED)
- `app/dashboard/layout.tsx` wraps all `/dashboard/*` pages
- Use for: navigation, sidebars, auth checks

# Hook, action, store and type patterns

**Flow**: Browser → Hook → Action → Database

**Types** (`*.types.ts`)

- Export all types, constructed from generated Supabase types (`@/supabase/types`)
- **Shared types** → `layout.types.ts` (User, AuthState, global entities)
- **Page-specific types** → `page.types.ts` (form inputs, page-specific entities)

Organization examples:

- `/app/layout.types.ts` - User, AuthState, UserRole, Sticker (global)
- `/app/(auth)/login/page.types.ts` - LoginFormData (only login page)
- `/app/[username]/page.types.ts` - PageElement (shared within [username] section)

**Actions** (`*.actions.ts`)

- Use Supabase **server client** (publishable key) for database table queries (INSERT, DELETE, UPDATE, SELECT)
- Always validate auth with `auth.getUser()` before queries
- Called exclusively from React Query hooks
- Function naming: `featureNameAction` (e.g., `loginAction`, `getUserProfileAction`)

Create actions files when features include:

1. Database operations (fetch/query, insert, update, delete)
2. Authentication & authorization (login, logout, signup, password reset)
3. File operations (upload images, process files)
4. External API calls (third-party services)
5. Secure operations (payment processing, user bans, content moderation)

Organization by scope:

- **Shared actions** (multiple pages) → `app/layout.actions.ts` (loginAction, updateUserProfileAction)
- **Section actions** (multiple pages in section) → `section/layout.actions.ts` (banUserAction, moderateContentAction)
- **Page-specific actions** → `page.actions.ts` (processPaymentAction only for checkout)

**Hooks** (`*.hooks.tsx`)

- Use React Query (`useQuery`, `useMutation`) to call actions
- Use Supabase **browser client** (publishable key) for auth operations (`auth.signIn`, `auth.signOut`, etc.) and real-time subscriptions
- Update zustand stores in `onSuccess` callbacks when applicable
- Manage loading and error states (NOT the store)
- Function naming: `useFeatureName` (e.g., `useUserAuth`, `useProductList`)

**Stores** (`*.stores.ts`)

- Use Zustand for data requiring direct client management beyond React Query
- Never use `persist` for sensitive user data (email, etc.)
- Function naming: `useFeatureNameStore` (e.g., `useAuthStore`, `useSidebarStore`)
- File naming: **plural** `page.stores.ts` (NOT singular `page.store.ts`)

## Feature Organization Example

Multiple features on a single page share the same utility files:

```txt
/app/page.tsx (Homepage with 6 features)
  Features:
    1. "Search bar with autocomplete"
    2. "Popular pages grid sorted by sticker count"
    3. "Recently active section showing pages with recent stickers"
    4. "New pages section for fresh content"
    5. "Category filter tabs (Art, Music, Tech, etc.)"
    6. "Random page button for discovery"

  ALL 6 features link to:
    stores: /app/page.stores.ts (useCategoryFilterStore - selected category)
    hooks: /app/page.hooks.tsx (usePopularPages, useRecentPages, useNewPages, useSearch)
    actions: /app/page.actions.ts (getPopularPages, getRecentPages, searchPages)
    types: /app/page.types.ts (PageCard, SearchResult)
```

Key principle: Multiple features on one page share utility files. Don't create separate stores/hooks per feature.
