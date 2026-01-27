# Starter Kit Implementation Plan

IMPORTANT: Implement this complete plan. Do not skip, alter or simplify any steps. Do not change the implementation order. Do not implement the plan using multiple agents in parallel, complete each step in sequence. If you're not able to complete any of the required steps, or if you need additional information then stop and ask for clarification, don't just continue and "fill in the gaps".

This is a complete step-by-step guide for building a Next.js application using the starter kit configuration files.

---

## Phase 1: Configure Tailwind and Shadcn

### Step 1.1: Install Tailwind v4

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

### Step 1.2: Setup Global CSS

Replace the entire contents of `app/globals.css` with the complete CSS from `documentation/initial_configuration/Theme.md`:

1. Copy all content from Theme.md (including imports, CSS variables, @layer base, @theme inline, and utility classes)
2. Paste into `app/globals.css`, replacing all existing content
3. This CSS includes all theme variables for colors, typography, border radius, shadows, and spacing

### Step 1.3: Configure Custom Fonts

Update `app/layout.tsx` to import and configure the fonts as shown in `documentation/initial_configuration/Theme.md`

### Step 1.4: Install Shadcn

```bash
npx shadcn@latest init -d
```

The `-d` flag accepts all default configuration.

### Step 1.5: Install All Components

```bash
npx shadcn@latest add --all --yes
```

### Step 1.6: Apply Custom Theme Classes to Components

**Note:** This step is important and not optional. Complete the process for ALL of the shadcn components.

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

## Phase 2: Setup Supabase

A Supabase project has already been created. The connection variables are located in the `.env.local` file at the root of the project.

### Step 2.1: Link Project

```bash
npx supabase link --project-ref <project-ref>
```

### Step 2.2: Create Migration

```bash
npx supabase migration new initial_schema
```

### Step 2.3: Add Database Schema

Copy complete schema from `documentation/initial_configuration/Database.md` into the migration file at `supabase/migrations/<timestamp>_initial_schema.sql`.

The schema includes:

- Table definitions
- Indexes
- RLS policies
- Enum types

### Step 2.4: Push Migration

```bash
 echo "Y" | npx supabase db push
```

Verify success message. If errors occur, check schema syntax.

### Step 2.5: Generate Types

```bash
npx supabase gen types typescript --project-id <project-ref> > supabase/types.ts
```

Verify `supabase/types.ts` file is created and contains type definitions.

### Step 2.6: Create Client Files

Copy and rename the template client files into their corresponding locations:

- `documentation/template_files/server-client.ts` → `supabase/server-client.ts`
- `documentation/template_files/browser-client.ts` → `supabase/browser-client.ts`
- `documentation/template_files/admin-client.ts` → `supabase/admin-client.ts`

### Step 2.7: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 2.8: Database Seeding

Ask the user for an email address that will be used to seed the admin user, this should be a valid email address that the user has access to so they can verify their account if required. If not email is provided then fallback to a generic placeholder admin email address.

1. Install tsx: `npm install -D tsx`
2. Copy and rename the template seed files into their corresponding locations:

- `documentation/template_files/seed.template.ts` → `supabase/seed.ts`
- `documentation/template_files/reset-seed.ts` → `scipts/reset-seed.ts`

3. Replace `admin@example.com` in `scripts/seed.ts` file with the user's provided email
4. Add scripts to `package.json`:
   - `"db:seed": "tsx supabase/seed.ts"`
   - `"db:reset-seed": "bash scripts/reset-seed.sh"`
5. Run: `npm run db:seed`

---

## Phase 3: Build Application

Complete each of the steps in this phase for each page in each directory of `documentation/initial_configuration/App_Directory.md`.
Construct each page using the information provided in the `README.md` file.

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

### Step 3.1: Read Page Specification

From `documentation/initial_configuration/App_Directory.md`, identify:

- Page or layout path and route
- Required features
- Hooks, actions, stores, types needed

From `README.md`, identify:

- The purpose, structure and overall functionality of each page and related layout(s)

### Step 3.2: Create Types

In the corresponding `page.types.ts` or `layout.types.ts` file, define types using the types in `supabase/types.ts`, following the approach demonstrated in `documentation/template_files/template.types.ts`

### Step 3.3: Create Actions (if needed)

In the corresponding `page.actions.ts` or `layout.actions.ts` file, define server action(s) following the approach demonstrated in `documentation/template_files/template.actions.ts`

### Step 3.4: Create Stores

In the corresponding `page.stores.ts` or `layout.stores.ts` file, define Zustand store(s) following the approach demonstrated in `documentation/template_files/template.stores.ts`

### Step 3.5: Create Hooks

In the corresponding `page.hooks.ts` or `layout.hooks.ts` file, define React-Query hook(s) following the approach demonstrated in `documentation/template_files/template.hooks.ts`

### Step 3.6: Build Page Component

In `page.tsx` or `layout.tsx`, implement the UI.

All pages and components must be fully responsive down to 320px screen width. This ensures the application works on all mobile devices, including smaller smartphones.

**Implementation considerations:**

- Layouts may need to rearrange at lower screen widths (e.g., switching from horizontal to vertical layouts)
- Component scaling should adjust appropriately (e.g., reducing padding, font sizes, or element dimensions)
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, etc.) to handle breakpoints
- Ensure interactive elements remain accessible and usable at all screen sizes
- Horizontal scrolling should only occur when intentional (e.g., image carousels)

---

## Phase 4: Final Steps

### Step 4.1: Create Commit

```bash
git add .
git commit -m "Initialize application with starter kit

- Set up Next.js 15 with Tailwind v4 and Shadcn
- Configure Supabase with migrations and type generation
- Add all pages and features from App_Directory.md
- Apply theme configuration
- Test all functionality"
```

### Step 4.2: Push to Repository

```bash
git push
```

### Step 4.3: Inform User

IMPORTANT: Display this exact message at the end of the process:

> "Setup complete! Your application is initialized and ready to start development. The foundation is ready, including: database integration, authentication, application architecture, programming patterns, and themed components.
>
> Follow the steps below to test it out!
>
> 1. Open terminal in VS Code (Ctrl + \` or Cmd + \`)
> 2. Type `npm run dev` into the terminal and hit the `Enter` key
> 3. Type `http://localhost:3000` into your browser's URL bar
> 4. Explore your app! You can sign in with the admin email you provided and the password: `Password123!`
>
> Keep in mind that this is a first version - there will likely be bugs and some missing features. You can now chat with me to shape your app towards your vision.
>
> You can ask me to:
>
> - Add new features or pages
> - Modify existing functionality
> - Fix bugs or improve performance
>
> Where would you like to begin?"

---
