# Plan: Update Documentation with Section-Based Configuration Options

## Overview

Update `docs/util.md` and `public/data/markdown/7-CLAUDE.md` to use the markdown section system to represent all possible configuration options from the interactive components. This will allow users to select different technology stacks and configurations dynamically.

## Context Analysis

### Current Components and Their Options

#### 1. InitialConfiguration.tsx
- **Database Options**: None, NeonDB, Supabase with Better-Auth, Supabase Only
- **Deployment Options**: Serverless (Vercel), Always-on (Railway)
- **Authentication Methods**: Magic Link, Email/Password, OTP, 2FA, Passkey, Anonymous, Google OAuth, GitHub OAuth, Apple Sign In, Password Only
- **Admin Roles**: Super Admins, Org Members, Org Admins
- **File Storage**: Yes/No
- **Payment Options**: PayPal payments, Stripe payments, Stripe subscriptions
- **AI Integration**: Image generation, Text generation/analysis
- **Notifications**: Email notifications, In-app notifications
- **Technologies**: Next.js, TailwindCSS, Shadcn, Zustand, React Query, Supabase, NeonDB, Prisma, Better Auth, PostgreSQL, Vercel, Railway, Cypress, Resend, Stripe, PayPal, OpenRouter

#### 2. AppStructure.tsx
- **Templates**: Blank, Auth (grouped routes), Nested layouts, Blog structure
- **File Types**: page.tsx, layout.tsx, stores, hooks, actions, types
- **Features**: Custom routes, dynamic segments, route groups

#### 3. DatabaseConfiguration.tsx
- **Schema Options**: auth schema, public schema
- **Column Types**: String, Int, Float, Boolean, DateTime, Json, BigInt, Decimal, Bytes
- **Attributes**: @id, @unique, optional (?), array ([])
- **Relations**: One-to-many, many-to-one
- **RLS Policies**: SELECT, INSERT, UPDATE, DELETE, ALL operations
- **Plugins**: Better-Auth plugins for auth.ts and auth-client.ts

#### 4. ThemeConfiguration.tsx
- **Theme Elements**: Colors, typography, spacing, shadows, borders
- **Color Schemes**: Light/dark mode support
- **CSS Variables**: Theme-specific styling

## Implementation Steps

### Step 1: Create Section Files for 7-CLAUDE.md

Create section files in `public/data/markdown/` directory:

**File: `7-CLAUDE.section-1.md`** (Core Technologies)
- Options for each technology stack combination
- Include: Next.js, TypeScript, TailwindCSS, Shadcn, Zustand, React Query

**File: `7-CLAUDE.section-2.md`** (Database & Authentication)
- Option 1: No database
- Option 2: NeonDB with Better-Auth + Prisma + PostgreSQL
- Option 3: Supabase with Better-Auth + Prisma + PostgreSQL
- Option 4: Supabase Only + Prisma + PostgreSQL

**File: `7-CLAUDE.section-3.md`** (Deployment)
- Option 1: Serverless with Vercel
- Option 2: Always-on with Railway

**File: `7-CLAUDE.section-4.md`** (Authentication Methods)
- Option 1: No authentication
- Option 2: Magic Link (requires Resend)
- Option 3: Email & Password (requires Resend)
- Option 4: OTP (requires Resend)
- Option 5: 2FA
- Option 6: Passkey
- Option 7: Anonymous Sessions
- Option 8: Google OAuth
- Option 9: GitHub OAuth
- Option 10: Apple Sign In
- Option 11: Password Only

**File: `7-CLAUDE.section-5.md`** (Additional Features)
- File Storage (Supabase only)
- Payments (PayPal, Stripe, Subscriptions)
- AI Integration (OpenRouter for images/text)
- Notifications (Email with Resend, In-app)

**File: `7-CLAUDE.section-6.md`** (Testing)
- Cypress for E2E testing

### Step 2: Update 7-CLAUDE.md Structure

Update `public/data/markdown/7-CLAUDE.md`:

```markdown
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
- Import "cn" from "@/lib/tailwind.utils" to concatinate classes.

# File Organization and Naming Conventions

[Rest of existing content...]
```

### Step 3: Create Section Files for util.md

Create section files in `public/data/markdown/` directory:

**File: `8-util.section-1.md`** (Types File Patterns)
- Option 1: Basic types (no database)
- Option 2: Types with Prisma imports
- Option 3: Types with Better-Auth session types
- Option 4: Types with file storage
- Option 5: Types with payment data
- Option 6: Types with AI integration

**File: `8-util.section-2.md`** (Stores File Patterns)
- Option 1: Basic Zustand store
- Option 2: Persisted store
- Option 3: Store with authentication state
- Option 4: Store with multi-tenant support

**File: `8-util.section-3.md`** (Actions File Patterns)
- Option 1: Basic server actions
- Option 2: Actions with Better-Auth
- Option 3: Actions with Prisma + RLS
- Option 4: Actions with file upload (Supabase)
- Option 5: Actions with payments (Stripe/PayPal)
- Option 6: Actions with AI integration (OpenRouter)

**File: `8-util.section-4.md`** (Hooks File Patterns)
- Option 1: Basic React Query hooks
- Option 2: Hooks with Better-Auth client
- Option 3: Hooks with optimistic updates
- Option 4: Hooks with file upload
- Option 5: Hooks with real-time subscriptions (Supabase)

**File: `8-util.section-5.md`** (Utility Files)
- Option 1: Basic utilities (no database)
- Option 2: prisma-rls.ts (with RLS support)
- Option 3: auth.utils.ts (Better-Auth utilities)
- Option 4: storage.utils.ts (Supabase storage)
- Option 5: payment.utils.ts (Stripe/PayPal)
- Option 6: ai.utils.ts (OpenRouter integration)

### Step 4: Update util.md Structure

Rename `docs/util.md` to `public/data/markdown/8-util.md` and update:

```markdown
# Utility File Patterns

## Types File Examples

<!-- section-1 -->

## Stores File Examples

<!-- section-2 -->

## Actions File Examples

<!-- section-3 -->

## Hooks File Examples

<!-- section-4 -->

## Utility Files

<!-- section-5 -->

# Console Logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.util.ts`

[Rest of logging documentation...]
```

### Step 5: Content Guidelines for Each Option

Each option block should include:

1. **Technology dependencies** clearly listed
2. **Import statements** relevant to that option
3. **Code examples** showing the pattern
4. **Comments explaining** when to use this option
5. **Related configuration** from InitialConfiguration

Example structure for an option:

```markdown
<!-- option-1 -->
## No Database Configuration

**When to use**: Selected when "No database" is chosen in InitialConfiguration

**Technologies**:
- Next.js
- TypeScript
- TailwindCSS

**Example**:
```typescript
export interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}
```
<!-- /option-1 -->
```

### Step 6: Mapping Component Options to Sections

Create a reference document showing how InitialConfiguration options map to documentation sections:

| Configuration | 7-CLAUDE.md Section | util.md Section |
|--------------|---------------------|-----------------|
| Database Choice | section-2 | section-3, section-5 |
| Authentication | section-4 | section-3, section-4 |
| Deployment | section-3 | N/A |
| File Storage | section-5 | section-3, section-5 |
| Payments | section-5 | section-3, section-5 |
| AI Integration | section-5 | section-3, section-5 |
| Notifications | section-5 | section-3, section-4 |

### Step 7: Update Parser Configuration

Ensure `scripts/parse-markdown.ts` correctly handles:
- Section markers in both files
- Multiple options per section
- Proper file naming (7-CLAUDE.section-X.md, 8-util.section-X.md)

### Step 8: Validation

After implementation:
1. Run `npm run parse-markdown`
2. Verify all sections appear in processed output
3. Test section selection in editor interface
4. Verify no broken references
5. Check that all technology combinations are represented

## Success Criteria

- [ ] All technology options from InitialConfiguration have corresponding documentation options
- [ ] Each option block includes complete, working code examples
- [ ] Section markers correctly placed in both files
- [ ] All section files created with proper naming convention
- [ ] Parser successfully processes all sections
- [ ] Editor displays all options correctly
- [ ] No duplicate or missing content
- [ ] Clear mapping between UI selections and documentation options

## Notes

- Keep existing "General rules" and "File Organization" sections intact
- Ensure backward compatibility with any existing references
- Consider adding a "Configuration Guide" section explaining how to use the sections
- Each option should be self-contained and not reference other options
- Include technology badges/indicators in options to show dependencies
