# Starter Kit Implementation Plan

Complete step-by-step guide for building a Next.js application using the starter kit configuration files.

## Overview

1. Setting up the app directory structure
2. Configuring Tailwind v4 and Shadcn/ui
3. Setting up Supabase CLI and database
4. Building the application page by page
5. Testing and deployment

**Approach**: Work systematically through each phase. Pause at testing checkpoints for user feedback. Fix any issues before proceeding.

---

## Phase 1: Setup App Structure

### Step 1.1: Read Configuration

Read `documentation/initial_configuration/App_Directory.md` to understand:

- Required routes and pages
- Features for each page
- Utility files (types, actions, hooks, stores)

### Step 1.2: Create Directory Structure

Create all directories and files specified in `documentation/initial_configuration/App_Directory.md`.

Example structure:

```
app/
├── layout.tsx
├── page.tsx
├── page.hooks.tsx
├── page.actions.ts
├── page.types.ts
├── [dynamic-route]/
│   ├── page.tsx
│   ├── page.hooks.tsx
│   ├── page.actions.ts
│   ├── page.stores.ts
│   └── page.types.ts
└── settings/
    └── page.tsx
```

---

## Phase 2: Configure Tailwind and Shadcn

### Step 2.1: Install Tailwind v4

Refer to `documentation/tailwind.guide.md`:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Create `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Step 2.2: Setup Global CSS

Replace the entire contents of `app/globals.css` with the complete CSS from `documentation/initial_configuration/Theme.md`:

1. Copy all content from Theme.md (including imports, CSS variables, @layer base, @theme inline, and utility classes)
2. Paste into `app/globals.css`, replacing all existing content
3. This CSS includes all theme variables for colors, typography, border radius, shadows, and spacing

### Step 2.3: Install Shadcn

Follow `documentation/shadcn.guide.md`:

```bash
npx shadcn@latest init -d
```

The `-d` flag accepts all default configuration.

### Step 2.4: Install All Components

```bash
npx shadcn@latest add --all
```

For npm with React 19, add `--legacy-peer-deps` if prompted.

### Step 2.5: Apply Custom Theme Classes to Components

Update ALL components in `components/ui/` to use the custom theme classes from `documentation/initial_configuration/Theme.md`. Work through each component file systematically:

**For all components:**

1. **Border Radius** - Replace Tailwind rounding classes:
   - Replace `rounded`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` → `radius`
   - Keep specific rounded classes like `rounded-full` unchanged

2. **Shadows** - Replace Tailwind shadow classes:
   - Replace `shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` → `shadow`
   - Remove `shadow-none` (default is no shadow)

3. **Borders** - Add border color class:
   - Find elements with `border` class
   - Add `border-border` class to use theme border color

4. **Focus States** - Replace focus ring classes:
   - Replace `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` → `focus-ring`
   - Replace `focus:border-ring` or `focus-visible:border-ring` → `focus-border-ring`
   - Replace `focus-visible:ring-ring` → `focus-ring-color`

**For specific component types:**

5. **Checkbox & Switch components** - Add data-attribute classes:
   - On checked state elements, add `data-checked-bg-primary` for background
   - On checked state elements, add `data-checked-text-primary-foreground` for text
   - On unchecked state elements, add `data-unchecked-bg-input` for background

6. **Calendar/Date Picker components** - Add data-attribute classes:
   - On single selected date elements, add `data-selected-single-bg-primary` for background
   - On single selected date elements, add `data-selected-single-text-primary-foreground` for text
   - On range start elements, add `data-range-start-bg-primary` and `data-range-start-text-primary-foreground`
   - On range end elements, add `data-range-end-bg-primary` and `data-range-end-text-primary-foreground`
   - On range middle elements, add `data-range-middle-bg-accent` and `data-range-middle-text-accent-foreground`

7. **Typography** - Add font classes where needed:
   - Elements that should use sans-serif: add `font-sans`
   - Elements that should use serif: add `font-serif`
   - Elements that should use monospace (code): add `font-mono`

## Phase 3: Setup Supabase

### Step 3.1: Link Project

Refer to `documentation/supabase.guide.md`:

```bash
npx supabase link --project-ref <project-ref>
```

### Step 3.2: Create Migration

```bash
npx supabase migration new initial_schema
```

### Step 3.3: Add Database Schema

Copy complete schema from `documentation/initial_configuration/Database.md` into the migration file at `supabase/migrations/<timestamp>_initial_schema.sql`.

The schema includes:

- Table definitions
- Indexes
- RLS policies
- Enum types

### Step 3.4: Push Migration

```bash
npx supabase db push
```

Verify success message. If errors occur, check schema syntax.

### Step 3.5: Generate Types

```bash
npx supabase gen types typescript --project-id <project-ref> > supabase/types.ts
```

Verify `supabase/types.ts` file is created and contains type definitions.

### Step 3.6: Create Client Files

Create three client files using patterns from `documentation/supabase.guide.md`:

- **supabase/server-client.ts**
- **supabase/browser-client.ts**
- **supabase/admin-client.ts**:

### Step 3.7: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 3.8: Verify Setup

Check:

- Migration pushed successfully
- Types file generated
- Client files created
- Environment variables set in `.env.local`

---

## Phase 4: Build Application Page by Page

Complete each of the steps in this phase for each page in each directory of `documentation/initial_configuration/App_Directory.md`.

### Build Order Strategy

Work from the root outward, completing all pages at each directory nesting level before proceeding deeper. Build layouts with their first page or before.

**Example build order:**

```txt
app/
├── 1. layout.tsx (+ layout.stores.ts, layout.actions.ts, layout.types.ts)
├── 2. page.tsx (+ page.hooks.tsx, page.types.ts, etc.)
│
├── (auth)/
│   ├── 3. layout.tsx
│   └── login/
│       └── 3. page.tsx (+ page.hooks.tsx, page.types.ts)
│
├── (dashboard)/
│   ├── 4. layout.tsx (+ layout.stores.ts)
│   ├── 4. page.tsx (+ page.hooks.tsx)
│   │
│   └── analytics/
│       └── 6. page.tsx (+ page.stores.ts, page.hooks.tsx)
│
└── [username]/
    ├── 5. page.tsx (+ page.actions.ts, page.types.ts)
    │
    └── edit/
        └── 7. page.tsx (+ page.stores.ts, page.hooks.tsx)
```

**Order explanation:**

1. Root layout (wraps entire app)
2. Root page (first level)
3. First-level directories: `(auth)/login` and `(dashboard)/` root
4. Continue first-level: `(dashboard)/` root and `[username]/`
5. Second-level: `(dashboard)/analytics/` and `[username]/edit/`

When building each page, ensure its parent layouts are already built.

### Step 4.1: Read Page Specification

From App_Directory.md, identify:

- Page and/or layout path and route
- Required features
- Hooks, actions, stores, types needed

### Step 4.2: Create Types

In the corresponding `page.types.ts` and/or `layout.types.ts` file, define types using generated Supabase types following the approach demonstrated in `documentation/template_files/template.types.ts`

### Step 4.3: Create Actions (if needed)

In the corresponding `page.actions.ts` and/or `layout.actions.ts` file, define server action(s) following the approach demonstrated in `documentation/template_files/template.actions.ts`

### Step 4.4: Create Stores (if needed)

In the corresponding `page.stores.ts` and/or `layout.stores.ts` file, define Zustand store(s) following the approach demonstrated in `documentation/template_files/template.stores.ts`

### Step 4.5: Create Hooks

In the corresponding `page.hooks.ts` and/or `layout.hooks.ts` file, define React-Query hook(s) following the approach demonstrated in `documentation/template_files/template.hooks.ts`

### Step 4.6: Build Page Component

In `page.tsx` and/or `layout.tsx`, implement the UI

### Step 4.7: Test Page

After completing the page:

Instruct user:

> "I've completed the [page name] page. Please test it:
>
> 1. Open terminal in VS Code (`Ctrl+` or `Cmd+`)
> 2. Run: npm run dev
> 3. Open http://localhost:3000/[page route] in your browser
> 4. Test all functionality on the page
>
> Please report any errors or issues you see. When everything works correctly, reply 'continue' to build the next page."

**Wait for user feedback**. If errors reported:

1. Read error messages
2. Check browser console
3. Fix issues
4. Ask user to retest
5. Only proceed when user confirms page works

### Step 4.8: Repeat for Each Page

Continue this process for all pages in App_Directory.md, maintaining order.

---

## Phase 5: Final Steps

### Step 5.1: End-to-End Testing

Prompt user to test complete application.

1. Navigate between all pages
2. Test data creation, updates, deletes
3. Verify auth flows work
4. Check responsive design
5. Test dark mode (if implemented)

### Step 5.2: Fix Remaining Issues

Address any final bugs or issues reported by user.

### Step 5.3: Create Commit

```bash
git add .
git commit -m "Complete application setup with starter kit

- Set up Next.js 15 with Tailwind v4 and Shadcn
- Configure Supabase with migrations and type generation
- Implement all pages and features from App_Directory.md
- Apply theme configuration
- Test all functionality"
```

### Step 5.4: Push to Repository

```bash
git push
```

### Step 5.5: Inform User

> "Setup complete! Your application is fully built and working. You can now ask me to:
>
> - Add new features or pages
> - Modify existing functionality
> - Fix bugs or improve performance
> - Add tests or documentation
> - Deploy to production
>
> What would you like to work on next?"

---

## Reference Documents

**Initial Configuration:**

- **documentation/initial_configuration/App_Directory.md** - Application structure, pages, and features
- **documentation/initial_configuration/Theme.md** - Complete theme configuration and CSS variables
- **documentation/initial_configuration/Database.md** - Complete database schema with RLS policies

**Setup Guides:**

- **documentation/shadcn.guide.md** - Shadcn component installation and usage
- **documentation/tailwind.guide.md** - Tailwind v4 setup and configuration
- **documentation/supabase.guide.md** - Supabase CLI commands and patterns
- **documentation/react-query.guide.md** - TanStack Query patterns and usage

**Code Patterns:**

- **documentation/template_files/** - Code patterns and examples for all file types
- **CLAUDE.md** - General development guidelines and patterns
