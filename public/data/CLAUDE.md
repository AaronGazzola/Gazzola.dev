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
- Don't use middleware - route protection and feature gating should be handled by database queries implemented in react-query hooks.

# Documentation

Refer to the files ending in `.guide.md` in the `documents` directory in the project root for instructions on implementing supabase features/functions and cli commands, shadcn components and styling, enhanced react-query features, and other technology specific features.

# Loading skeletons

- Full page UI should be loaded initially, with data-dependent content replaced with loading skeletons while fetching
- Loading skeletons should only replace the content that requires data and should match the sillhouette of the component
  - Example: if a username is loading then only the username text content should be replaced with an inline loading skeleton.
- If stale data is available from the zustand store then this should be displayed while fetching rather than showing the skeleton.

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

**Template files:** Refer to the template files in "documentation/template_files" for examples demonstrating each of the utility file types described below.

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
- Update zustand stores (if appropriate) in `onSuccess` callbacks of useMutation hooks, or in the queryFn of useQuery hooks.
- Manage loading and error states via react-query hooks (NOT the store)
- Function naming: `useFeatureName` (e.g., `useUserAuth`, `useProductList`)

**Stores** (`*.stores.ts`)

- Use Zustand for data requiring direct client management beyond React Query
- Never use `persist` for sensitive user data (email, etc.)
- Function naming: `useFeatureNameStore` (e.g., `useAuthStore`, `useSidebarStore`)
- File naming: **plural** `page.stores.ts` (NOT singular `page.store.ts`)
