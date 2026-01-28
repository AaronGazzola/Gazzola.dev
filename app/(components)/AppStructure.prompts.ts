import { PatternDetectionResult, RoutePattern, InferredFeature, FeatureScope, FunctionAssignment } from "./AppStructure.types";
import { FileSystemEntry } from "@/app/(editor)/layout.types";

export interface PromptGenerationConfig {
  readmeContent: string;
  detectedPatterns: PatternDetectionResult;
  relevantPatterns: RoutePattern[];
}

interface ParsedPage {
  id: string;
  name: string;
  route: string;
  description: string;
}

const SCOPE_RULES = `
## Feature Scope Classification

Classify each feature based on where it's used:

**GLOBAL** - Used across entire app:
- Authentication (sign in, sign out, session checks)
- User profile data (get/update user)
- Theme management (dark mode, preferences)
- Global notifications and alerts
- App-wide settings and configuration
→ Utility files go in: /app/layout.*

**SECTION:(group)** - Used within a route group/section:
- Dashboard sidebar state (all /dashboard/* pages)
- Admin permissions (all /(admin)/* pages)
- Section navigation state
- Route group shared data
→ Utility files go in: /app/(group)/layout.* or /app/section/layout.*

**PAGE:/route** - Used only on a specific page:
- Contact form state (only /contact)
- Chart data (only /analytics)
- Page-specific filters and sorting
- Single-page form state
→ Utility files go in: /app/route/page.*
`;

const FUNCTION_NAMING_RULES = `
## Function Naming Conventions

For each feature, generate 4 function names:

1. **Hook**: useCamelCase()
   - Data fetching: useGetUserProfile, useSearchProducts
   - Mutations: useUpdateSettings, useCreatePost
   - State access: useAuthState, useThemePreference

2. **Action**: camelCaseAction()
   - Server actions: getUserProfileAction, updateSettingsAction
   - Database operations: createPostAction, deleteItemAction

3. **Store**: useCamelCaseStore()
   - Zustand stores: useAuthStore, useDashboardStore
   - Named for the domain: useCartStore, useNotificationStore

4. **Type**: PascalCase
   - Result types: UserProfile, SearchResult
   - Input types: UpdateSettingsInput, CreatePostData
   - State types: AuthState, CartItem
`;

const DIRECTORY_RULES = `
## Next.js App Router Directory Structure

### Route to File Mapping:
- / → app/page.tsx
- /dashboard → app/dashboard/page.tsx
- /users/alice → app/users/[username]/page.tsx
- /products/123 → app/products/[id]/page.tsx

### Route Groups (no URL impact):
- (auth) → groups auth pages, URL stays /login not /auth/login
- (admin) → groups admin pages, URL stays /users not /admin/users

### Dynamic Routes:
- [id] → single parameter
- [slug] → named parameter
- [...slug] → catch-all
- [[...slug]] → optional catch-all

### Utility File Placement:
- layout.stores.ts, layout.hooks.tsx, layout.actions.ts, layout.types.ts → shared by child routes
- page.stores.ts, page.hooks.tsx, page.actions.ts, page.types.ts → specific to that page

### Parent Directory Linking Rule:
Features can link to utility files in SAME or PARENT directories only:
✅ /app/dashboard/page.tsx → /app/layout.hooks.tsx (parent)
✅ /app/dashboard/page.tsx → /app/dashboard/page.hooks.tsx (same)
❌ /app/dashboard/page.tsx → /app/settings/page.hooks.tsx (sibling - NOT allowed)
`;

const PHASE_1_INSTRUCTIONS = `
# PHASE 1: Understand the App Architecture

Analyze the README to understand the ACTUAL app structure described, NOT generic patterns.

1. **What is the core user flow?**
   - How do users navigate the app?
   - What is the main content or resource?
   - Are there subdomain patterns, dynamic user pages, or specific URL structures mentioned?

2. **Identify the page hierarchy:**
   - What is the homepage (/) for?
   - What are the main sections (dashboard, profile, admin)?
   - Are there nested relationships? (e.g., categories → products → details)
   - Are there dynamic routes? (user pages, product IDs, slugs)

3. **Authentication & Access Levels:**
   - Public pages vs authenticated pages?
   - Different user types (visitor, user, admin)?
   - What pages require what access level?

4. **What functionality is SHARED vs PAGE-SPECIFIC?**
   - Shared: Authentication, theme, global navigation (goes in app/layout.*)
   - Section-wide: Dashboard sidebar, admin permissions (goes in section/layout.*)
   - Page-specific: Individual form state, specific data fetching (goes in page.*)

5. **Features per page:**
   - What does each page DO specifically?
   - Break down into multiple features per page (not one generic feature)
   - GOOD: "KPI Cards", "Recent Activity Feed", "Quick Action Buttons"
   - BAD: "Dashboard Display"

6. **Route & Feature Count Targets:**

   Based on README length and complexity, target:
   - Simple README (< 3000 chars) → 3-5 routes, 2-4 features per page
   - Medium README (3000-7000 chars) → 5-8 routes, 3-6 features per page
   - Complex README (> 7000 chars) → 8-15 routes, 4-10 features per page

   CRITICAL: Count the number of distinct user flows and pages mentioned in README:
   - Each user flow likely needs a route
   - Each page explicitly mentioned needs a page.tsx
   - Features should be NUMEROUS and SPECIFIC, not one vague feature per page

   Example: If README is 10,000 characters describing a social media platform,
   you should generate AT LEAST:
   - 8-12 routes (home, auth, profile, settings, content creation, moderation, etc.)
   - 40-80 total features across all pages (5-10 features per page)
   - ALL 4 utility file types (stores, hooks, actions, types) where applicable

CRITICAL: Understand the README's ACTUAL architecture before mapping to routes. Don't force generic admin/settings patterns if they don't fit the described app.
`;

const PHASE_2_INSTRUCTIONS = `
# PHASE 2: Feature Granularity Breakdown

For each page you identify, define SPECIFIC features with clear actions and data, NOT generic descriptions.

## Feature Granularity Examples:

### TOO GENERIC (❌ Avoid these):
- "User authentication"
- "Product management"
- "Dashboard display"
- "Content creation"
- "User settings"

### SPECIFIC (✅ Target this level):
- "Email/password login form with client-side validation, error messages, and forgot password link"
- "Product creation form with image upload (max 5MB), pricing input with currency selector, and inventory tracking"
- "Dashboard KPI cards showing total revenue (current month vs last month), active users count, and recent orders list"
- "Blog post editor with rich text formatting, draft save functionality, tag selection, and publish schedule"
- "Account settings page with email change (requires verification), password update form, and profile avatar upload"

## Feature Format:
For every page.tsx or layout.tsx file, create features that describe:

1. **What data** is displayed or managed
2. **What actions** users can take (buttons, forms, interactions)
3. **What validation** or business logic applies
4. **What user interactions** are supported (clicks, inputs, navigation)

### Example for /products/[id]/page.tsx:
Instead of one vague feature "Product details", create specific features:
- "Display product details including name, price, description, and image gallery"
- "Add to cart button with quantity selector (1-99) and stock availability check"
- "Related products carousel showing 4-8 similar items with image and price"
- "Customer reviews list with star rating filter (1-5 stars) and pagination (10 per page)"
- "Share product button with social media options (Facebook, Twitter, Email)"

### Example for /admin/users/page.tsx:
Instead of "User management", create specific features:
- "User list table with sorting by name, email, join date, and status"
- "Search users by email or name with real-time filtering"
- "Edit user role dropdown (Admin, Moderator, User) with permission check"
- "Ban user action with ban reason selection and duration picker"
- "Export users to CSV with selected fields configuration"

### Multiple Features Sharing Utility Files:

When a page has multiple features, they typically share the same utility files:

**Example 1: Homepage with 6 features**

/app/page.tsx
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

**Example 2: Page builder with 10 features**

/app/[username]/edit/page.tsx
  Features:
    1. "Element toolbar with add text/shape/video buttons"
    2. "Rich text editor with formatting controls"
    3. "Shape editor with color picker"
    4. "YouTube embed URL input"
    5. "Drag-to-reorder element list"
    6. "Element resize controls"
    7. "Element styling controls"
    8. "Responsive preview toggle"
    9. "Page settings panel"
    10. "Publish button with AI moderation"

  ALL 10 features link to:
    stores: /app/[username]/edit/page.stores.ts (usePageBuilderStore - elements array)
    hooks: /app/[username]/edit/page.hooks.tsx (useUpdateElements, useDeleteElement)
    actions: /app/[username]/edit/page.actions.ts (savePageElements, publishPage, moderateContent)
    types: /app/[username]/page.types.ts (PageElement - shared with view page)

**Key Principle**: Multiple features on one page share utility files. Don't create separate stores/hooks per feature.
`;

const PHASE_3_INSTRUCTIONS = `
# PHASE 3: Next.js Route Mapping & File Organization

## Next.js App Router Patterns:

1. **page.tsx creates routes**
   - /dashboard → app/dashboard/page.tsx
   - / → app/page.tsx
   - /users/alice → app/users/[username]/page.tsx

2. **Route Groups (parentheses) organize without affecting URL**
   - app/(auth)/login/page.tsx → /login (NOT /auth/login)
   - Use for: grouping related pages that share a layout

3. **Dynamic Routes [brackets]**
   - [id], [slug], [username] for single parameter
   - [...slug] for catch-all
   - [[...slug]] for optional catch-all

   **Dynamic Routes & Utility Files:**

   Dynamic routes determine utility file organization by semantic scope:

   Example 1: /products/[id]/page.tsx (product detail view)
     - View product → needs getProductByIdAction
     - Action used ONLY here → create /app/products/[id]/page.actions.ts
     - OR if also used by /products → put in /app/products/page.actions.ts (parent)

   Example 2: /users/[username]/page.tsx (user profile view)
     - View profile → needs getUserByUsernameAction
     - Types: User type is global → /app/layout.types.ts
     - Actions: Profile viewing is section-specific → /app/users/[username]/page.actions.ts

   Example 3: /users/[username]/edit/page.tsx (edit own profile)
     - Save profile → needs updateUserAction
     - Action shared across app → /app/layout.actions.ts (grandparent)
     - Types: User type is global → /app/layout.types.ts (grandparent)
     - Stores: Edit form state local → /app/users/[username]/edit/page.stores.ts (same)

   Rule: Choose CLOSEST parent directory where the utility is semantically reused.

4. **Layouts wrap child pages**
   - app/layout.tsx wraps entire app (REQUIRED)
   - app/dashboard/layout.tsx wraps all /dashboard/* pages
   - Use for: navigation, sidebars, auth checks

5. **CRITICAL: No duplicate root routes**
   - ❌ NEVER both app/page.tsx AND app/(group)/page.tsx
   - ✅ Choose ONE location for "/"

## Utility File Organization (CRITICAL):

### File Types:
- **page.stores.ts** / **layout.stores.ts** - Zustand state
- **page.hooks.tsx** / **layout.hooks.tsx** - React Query hooks, custom hooks
- **page.actions.ts** / **layout.actions.ts** - Server actions (DB queries)
- **page.types.ts** / **layout.types.ts** - TypeScript types

### Parent Directory Linking Rule (ALL utility files):
Features can link to utility files in ANY PARENT directory, NOT siblings.

\`\`\`
app/
├── layout.stores.ts          ← Global auth, theme (used everywhere)
├── layout.actions.ts         ← loginAction, updateProfileAction
│
└── dashboard/
    ├── layout.stores.ts      ← Dashboard sidebar state (used by all dashboard pages)
    ├── page.tsx              ✅ Can link to: /app/layout.stores.ts (parent)
    │                         ✅ Can link to: /app/dashboard/layout.stores.ts (parent)
    │                         ❌ Cannot link to: /app/settings/page.stores.ts (sibling)
    │
    └── analytics/
        ├── page.tsx          ✅ Can link to: /app/layout.stores.ts (grandparent)
        │                     ✅ Can link to: /app/dashboard/layout.stores.ts (parent)
        │                     ✅ Can link to: /app/dashboard/analytics/page.stores.ts (same dir)
        ├── page.stores.ts    ← Chart-specific state (only for analytics)
        └── page.hooks.tsx    ← useChartData
\`\`\`

**This rule applies to ALL utility file types:**
- ✅ Stores (.stores.ts)
- ✅ Hooks (.hooks.tsx)
- ✅ Actions (.actions.ts)
- ✅ Types (.types.ts)

Example of ALL file types:
/app/[username]/edit/page.tsx
  Features:
    - "Page builder with save" → links to:
        stores: /app/[username]/edit/page.stores.ts (same - element state)
        hooks: /app/[username]/edit/page.hooks.tsx (same - useUpdateElements)
        actions: /app/layout.actions.ts (parent - savePageAction used elsewhere)
        types: /app/[username]/page.types.ts (parent - PageElement shared with view)

### Organization Strategy:

**Shared functionality → Higher in tree:**
- Auth state → app/layout.stores.ts (used everywhere)
- User profile actions → app/layout.actions.ts (used in multiple places)
- Theme state → app/layout.stores.ts (global)

**Section-specific → Middle level:**
- Dashboard sidebar → app/dashboard/layout.stores.ts (all dashboard pages)
- Admin permissions → app/(admin)/layout.stores.ts (all admin pages)

**Page-specific → Same directory:**
- Chart data → app/analytics/page.stores.ts (only analytics page)
- Form state → app/contact/page.stores.ts (only contact page)

### Example Structure:

\`\`\`
app/
├── layout.tsx
├── layout.stores.ts          ← useAuthStore (global)
├── layout.actions.ts         ← loginAction, logoutAction
├── page.tsx
│   Features:
│     - "Navigation Header" → links to /app/layout.stores.ts (auth state)
│
├── (auth)/
│   ├── layout.tsx
│   └── login/
│       └── page.tsx
│           Features:
│             - "Login Form" → links to:
│                 stores: /app/layout.stores.ts (parent - auth)
│                 hooks: /app/(auth)/login/page.hooks.tsx (same)
│                 actions: /app/layout.actions.ts (parent - loginAction)
│
└── [username]/
    ├── layout.stores.ts      ← usePageMetaStore (shared by view & edit)
    ├── page.tsx
    │   Features:
    │     - "User Bio Display" → links to:
    │         stores: /app/[username]/layout.stores.ts (parent)
    │         hooks: /app/[username]/page.hooks.tsx (same)
    │
    ├── page.hooks.tsx        ← useUserBio
    │
    └── edit/
        └── page.tsx
            Features:
              - "Bio Editor" → links to:
                  stores: /app/[username]/layout.stores.ts (grandparent - reuse!)
                  hooks: /app/[username]/edit/page.hooks.tsx (same)
                  actions: /app/layout.actions.ts (root - updateProfileAction)
\`\`\`

### When to Create .actions.ts Files (CRITICAL):

Actions files contain server-side logic for database operations and secure processing.

**Create page.actions.ts or layout.actions.ts when features include:**

1. **Database Operations**:
   - Fetch/query data from database
   - Insert, update, or delete records
   - Examples: "Display user profile data", "Save blog post", "Delete account"

2. **Authentication & Authorization**:
   - Login, logout, signup flows
   - Password reset, email verification
   - Examples: "Login form with email/password", "Send magic link"

3. **File Operations**:
   - Upload images, documents, or media
   - Process or transform files server-side
   - Examples: "Avatar upload with crop", "CSV import"

4. **External API Calls**:
   - Call third-party APIs from server
   - Fetch data from external services
   - Examples: "Fetch weather data", "Process payment via Stripe"

5. **Secure Operations**:
   - Payment processing
   - User bans or account deletion
   - Content moderation
   - Examples: "Approve payment", "Ban user", "Moderate content"

**Organization by Scope**:
- **Shared actions** (multiple pages) → app/layout.actions.ts
  - loginAction, logoutAction, updateUserProfileAction
- **Section actions** (multiple pages in section) → section/layout.actions.ts
  - app/(admin)/layout.actions.ts → banUserAction, moderateContentAction
- **Page-specific actions** → page.actions.ts
  - app/checkout/page.actions.ts → processPaymentAction (only checkout)

**Linking Rules**:
Features link to actions in PARENT directories only (same rule as stores/hooks):
- ✅ /app/dashboard/page.tsx → /app/layout.actions.ts (parent)
- ✅ /app/dashboard/page.tsx → /app/dashboard/page.actions.ts (same dir)
- ❌ /app/dashboard/page.tsx → /app/settings/page.actions.ts (sibling)

**Examples**:

/app/page.tsx (Homepage with search and popular pages)
  Features:
    - "Search bar with autocomplete" → needs fetchSearchResultsAction
    - "Popular pages grid sorted by sticker count" → needs getPopularPagesAction
  Creates: /app/page.actions.ts

/app/(auth)/login/page.tsx (Login form)
  Features:
    - "Email input form with validation and send magic link"
  Links to: /app/layout.actions.ts (parent - loginAction is used by multiple pages)

/app/settings/page.tsx (Settings with sticker customization)
  Features:
    - "Beep sticker editor with save button" → needs updateStickerConfigAction
  Creates: /app/settings/page.actions.ts

/app/[username]/page.tsx (View user page with sticker placement)
  Features:
    - "Sticker placement interaction" → needs placeSticker, removeSticker
    - "Page content display" → needs getPageByUsername
  Creates: /app/[username]/page.actions.ts

### When to Create .types.ts Files (CRITICAL):

Types files define TypeScript interfaces and types for data structures.

**Create layout.types.ts for SHARED types** (used by multiple pages):

1. **User & Authentication Types**:
   - User profile structure
   - Authentication state
   - User roles and permissions
   - Example: User, AuthState, UserRole enum

2. **Global Entity Types**:
   - Entities used across the app
   - API response formats used everywhere
   - Example: Sticker, StickerConfig, PageCard

3. **Enums & Constants**:
   - Status values (PENDING, APPROVED, REJECTED)
   - Category options (Art, Music, Tech)
   - Example: ContentStatus, PageCategory

**Create page.types.ts for PAGE-SPECIFIC types**:

1. **Form Input Types**:
   - Form field structures
   - Validation schemas
   - Example: LoginFormData, ProductFormInput

2. **Page-Specific Entities**:
   - Data structures only used on this page
   - Feature-specific state shapes
   - Example: PageElement (only for page builder), ChartData (only for analytics)

3. **Component Props**:
   - Props interfaces for page-specific components
   - Example: ElementToolbarProps (only page builder)

**Organization Examples**:

/app/layout.types.ts (Global types)
  - User, AuthState, UserRole
  - Sticker, StickerConfig
  - PageCard (used on homepage and search results)

/app/(auth)/login/page.types.ts (Page-specific)
  - LoginFormData (only login page)
  - MagicLinkResponse (only login page)

/app/[username]/page.types.ts (Shared within [username] section)
  - PageElement, TextBlock, Shape, YouTubeEmbed
  - Used by both [username]/page.tsx AND [username]/edit/page.tsx

/app/settings/page.types.ts (Page-specific)
  - SettingsFormData (only settings)
  - StickerPreviewState (only settings)

**Linking Rules**:
Features link to types in PARENT or SAME directory:
- ✅ /app/[username]/edit/page.tsx → /app/[username]/page.types.ts (parent - PageElement)
- ✅ /app/dashboard/page.tsx → /app/layout.types.ts (parent - User)
- ❌ /app/dashboard/page.tsx → /app/settings/page.types.ts (sibling)

## Key Principles:

1. **Analyze what's shared vs specific** before creating files
2. **Shared state/actions go up the tree** to parent directories
3. **Page-specific logic stays in same directory**
4. **Each page/layout can have multiple features** linking to same utility files
5. **Features link to parent directories**, never siblings
6. **Create utility files only where needed** - don't duplicate

**CRITICAL INSTRUCTION**:
When you create features that reference types, you MUST also create the corresponding types file in the FileSystemEntry structure.

Example:
If feature links to: types: /app/layout.types.ts
Then structure MUST include:
{
  "id": "layout-types-id",
  "name": "layout.types.ts",
  "type": "file"
}

DO NOT create feature type links without creating the actual file in the structure!
`;

const VALIDATION_CHECKLIST = `
# Validation Checklist

Before returning JSON, verify:

- [ ] **Structure matches README's actual architecture** (not generic patterns)
- [ ] Every route has a page.tsx file
- [ ] No duplicate root routes (not both app/page.tsx AND app/(group)/page.tsx)
- [ ] Route groups use (parentheses) syntax correctly
- [ ] Root layout (app/layout.tsx) and root page (app/page.tsx OR app/(group)/page.tsx) exist
- [ ] Dynamic routes use correct syntax ([id], [slug], [...slug]) based on README

- [ ] **Utility files organized by scope:**
  - Shared functionality → app/layout.* files
  - Section functionality → section/layout.* files
  - Page-specific → page.* files in same directory

- [ ] **Features link to parent directories only** (never siblings)
  - Example: app/dashboard/analytics/page.tsx can link to:
    - ✅ app/layout.stores.ts (grandparent)
    - ✅ app/dashboard/layout.stores.ts (parent)
    - ✅ app/dashboard/analytics/page.stores.ts (same)
    - ❌ app/settings/page.stores.ts (sibling)

- [ ] **Multiple features per page** where appropriate (not one vague feature)
  - ✅ "KPI Cards", "Activity Feed", "Quick Actions"
  - ❌ "Dashboard Display"

- [ ] Every FileSystemEntry has unique alphanumeric ID
- [ ] Features object keys match page.tsx or layout.tsx file IDs
- [ ] Each feature has linkedFiles pointing to parent or same directory
- [ ] Feature descriptions are specific and detailed (20+ chars)

- [ ] **Utility files created when needed:**
  - Actions files for features with DB operations, file uploads, or secure processing
  - Types files for shared types (layout.types.ts) or page-specific types (page.types.ts)
  - Hooks files for data fetching and custom logic
  - Stores files for client-side state management

- [ ] **Types files exist in structure:**
  - Every types file path in feature linkedFiles MUST exist in structure
  - If feature links to /app/layout.types.ts, verify {name: "layout.types.ts"} exists in structure
  - No broken type references

- [ ] **Features avoid generic terminology:**
  - No titles like "Dashboard Display", "User Management", "Settings View"
  - Each feature describes WHAT data is shown AND WHAT actions users can take
  - Features include specifics: field names, interaction types, validation rules

- [ ] **README-mentioned routes are included:**
  - Search README for action verbs + entities (edit profile, view dashboard, delete account)
  - Verify each mentioned capability has a corresponding route
  - No missing major features from README

- [ ] **Actions files follow parent linking rule:**
  - Shared actions → app/layout.actions.ts
  - Section actions → section/layout.actions.ts
  - Page-specific → page.actions.ts
  - Features link to parent directories only, never siblings
`;

const JSON_STRUCTURE_DEFINITION = `
# JSON Structure Format

Return EXACTLY this structure:

{
  "structure": [
    {
      "id": "unique-alphanumeric-id",
      "name": "app",
      "type": "directory",
      "isExpanded": true,
      "children": [
        {
          "id": "layout-unique-id",
          "name": "layout.tsx",
          "type": "file"
        },
        {
          "id": "page-unique-id",
          "name": "page.tsx",
          "type": "file"
        },
        {
          "id": "stores-unique-id",
          "name": "page.stores.ts",
          "type": "file"
        },
        {
          "id": "hooks-unique-id",
          "name": "page.hooks.tsx",
          "type": "file"
        }
      ]
    }
  ],
  "features": {
    "page-unique-id": [
      {
        "id": "feature-unique-id",
        "title": "Specific Feature Title (3+ words)",
        "description": "Detailed description of what this feature does, what data it shows, what actions users can take",
        "linkedFiles": {
          "stores": "/app/page.stores.ts",
          "hooks": "/app/page.hooks.tsx"
        },
        "functionNames": {},
        "isEditing": false
      }
    ]
  }
}
`;

const generateConditionalPatternsSection = (patterns: RoutePattern[]): string => {
  if (patterns.length === 0) return "";

  return `
# Relevant Route Patterns (Detected from README)

Based on keyword analysis, the following patterns were detected in your README.
Use these as GUIDANCE and INSPIRATION, not rigid templates. Adapt them to your specific requirements.

${patterns
  .map(
    (pattern) => `
## ${pattern.name}

**Description**: ${pattern.description}

**Route Structure Example**:
\`${pattern.routeStructure}\`

**Typical Features** (adapt to your specific needs):
${pattern.typicalFeatures.map((f) => `  - ${f}`).join("\n")}
`
  )
  .join("\n")}

**IMPORTANT**: These are patterns, NOT templates. Your implementation should match the specific requirements described in the README, not blindly copy these examples.
`;
};

export const COMPREHENSION_VALIDATION_PROMPT = `You are validating a generated app structure against a README to identify missing routes and features.

Your task is to:
1. Read and comprehend the README to identify ALL routes, pages, and user flows described
2. Compare these against the generated routes
3. Identify what's missing with specific evidence from the README

CRITICAL RULES:
- Focus on EXPLICIT mentions of pages, routes, or user flows in the README
- Look for phrases like "when you visit", "navigate to", "page for", "at the URL", etc.
- Identify dynamic routes from context (e.g., "view someone's page" = dynamic [username] route)
- Consider the app's core functionality and required pages
- Ignore generic patterns if not actually described in README

For each missing route, provide:
1. The route that should exist (using Next.js conventions: /login, /[username], etc.)
2. A direct quote from the README describing this page/flow
3. Your reasoning for why this route is required
4. Whether it's critical to core functionality

Return ONLY valid JSON in this exact format:
{
  "missingRoutes": [
    {
      "route": "/example",
      "readmeQuote": "exact quote from README",
      "reasoning": "explanation of why this route is needed",
      "critical": true
    }
  ],
  "missingFeatures": [
    {
      "page": "/example",
      "featureDescription": "what feature is missing from this page",
      "readmeQuote": "exact quote from README",
      "reasoning": "why this feature is important"
    }
  ],
  "insufficientComplexity": {
    "readmeLength": 9958,
    "expectedRoutes": "8-15",
    "actualRoutes": 2,
    "expectedFeatures": "40-80",
    "actualFeatures": 3,
    "assessment": "explanation of complexity mismatch"
  }
}`;

export const generateMultiPhasePrompt = (config: PromptGenerationConfig): string => {
  const patternsSection = generateConditionalPatternsSection(config.relevantPatterns);

  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { and end with }

README Content:
${config.readmeContent}

${patternsSection}

${PHASE_1_INSTRUCTIONS}

${PHASE_2_INSTRUCTIONS}

${PHASE_3_INSTRUCTIONS}

${VALIDATION_CHECKLIST}

${JSON_STRUCTURE_DEFINITION}
`;
};

export const buildStructurePlanPrompt = (
  parsedPages: ParsedPage[],
  inferredFeatures: Record<string, InferredFeature[]>
): string => {
  const featureCount = Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0);
  const pageIds = Object.keys(inferredFeatures);
  const pagesJson = JSON.stringify(parsedPages, null, 2);
  const featuresJson = JSON.stringify(inferredFeatures, null, 2);

  return `🚨 CRITICAL ANTI-TRUNCATION REQUIREMENTS 🚨

You MUST list function assignments for ALL ${featureCount} features individually. Do NOT use shortcuts like:
❌ "[Continue with similar assignments...]"
❌ "[And so on for remaining features...]"
❌ "[Similar pattern for other pages...]"
❌ Summarizing multiple features into one line

✅ REQUIRED: Explicitly list EVERY feature ID (${featureCount} total) with its 4 function assignments

Example of CORRECT format for each feature:
/app/page.hooks.tsx:
- useSearch() ← Search pages (302z4uspz)
- useFilter() ← Filter by category (owlimx50c)
- useRandomPage() ← Get random page (cu8zfy4dj)
- useFeaturedPages() ← Get featured pages (fyefsenoc)

You must write ${featureCount} feature assignments like the above example. Count them to verify.

This is an automated process - there is no human to answer questions or ask you to continue. Complete the ENTIRE plan in ONE response.

Generate a plain text plan for Next.js App Router structure with smart utility file placement.

INPUT PAGES:
${pagesJson}

INPUT FEATURES:
${featuresJson}

# CORE RULES

## 1. Feature Scope Analysis

For EACH feature, determine scope by analyzing where it's used:

**GLOBAL** (used across entire app):
- Authentication (sign in, sign out, session checks)
- User profile (get, update user data)
- Theme management (dark mode, preferences)
- Global notifications
- App-wide settings
→ Functions go in: /app/layout.* files

**SECTION** (used within route group/section):
- Dashboard sidebar state (all /dashboard/* pages)
- Admin permissions (all /(admin)/* pages)
- Section navigation state
- Route group shared data
→ Functions go in: /app/section/layout.* or /app/(group)/layout.* files

**PAGE** (used only on specific page):
- Contact form state (only /contact)
- Chart data (only /analytics)
- Page-specific filters
- Single-page features
→ Functions go in: /app/path/page.* files

## 2. Function Generation (Each Feature → 4 Functions)

For each feature, generate 4 function names and assign to appropriate files:

Example - "Sign out user" (GLOBAL scope):
- Hook: useSignOut() → /app/layout.hooks.tsx
- Action: signOutAction() → /app/layout.actions.ts
- Store: useAuthStore() → /app/layout.stores.ts
- Type: SignOutResult → /app/layout.types.ts

Example - "Get dashboard stats" (PAGE scope):
- Hook: useDashboardStats() → /app/dashboard/page.hooks.tsx
- Action: getDashboardStatsAction() → /app/dashboard/page.actions.ts
- Store: useDashboardStore() → /app/dashboard/page.stores.ts
- Type: DashboardStats → /app/dashboard/page.types.ts

## 3. File Consolidation

Multiple features at same scope level → consolidate into shared files:

Example:
- "Sign out" (global) → useSignOut() in /app/layout.hooks.tsx
- "Update profile" (global) → useProfile() in /app/layout.hooks.tsx
(Both functions in SAME file)

Example:
- "Export report" (dashboard page) → exportReport() in /app/dashboard/page.actions.ts
- "Get stats" (dashboard page) → getStats() in /app/dashboard/page.actions.ts
(Both functions in SAME file)

## 4. Handling Duplicate Features

When MULTIPLE features have identical titles and descriptions but different IDs (e.g., "Sign out user" appears in both Main Layout and Admin Layout):

**CRITICAL RULE**: Preserve ALL feature IDs in the output, but map identical features to the SAME utility files and functions.

Example - Two layouts both have "Sign out user":
- Feature 0rm99xumz: "Sign out user" (Main Layout)
- Feature tl8a5xrk4: "Sign out user" (Admin Layout)

Both features should:
✅ Be preserved as separate features in the output (keep both IDs)
✅ Reference the SAME utility files: /app/layout.hooks.tsx
✅ Reference the SAME functions: useSignOut(), signOutAction(), etc.

Do NOT:
❌ Drop duplicate features (all ${featureCount} features must be in the plan)
❌ Create separate functions for identical features (reuse the same function)

## 5. Smart File Creation

ONLY create files with ≥1 function assigned. Do NOT create empty files.

If no features need page-level stores:
❌ Do NOT create /app/dashboard/page.stores.ts

If 2 features need global actions:
✅ Create /app/layout.actions.ts with both functions

## 6. Next.js Routing Patterns

- / → app/page.tsx
- /dashboard → app/dashboard/page.tsx
- /[username] → app/[username]/page.tsx
- (auth) → route group (URL stays /login, not /auth/login)

## 7. Parent Directory Linking Rule

Features link to files in SAME or PARENT directories only:
✅ /app/dashboard/page.tsx can use /app/layout.hooks.tsx (parent)
✅ /app/dashboard/page.tsx can use /app/dashboard/page.hooks.tsx (same)
❌ /app/dashboard/page.tsx CANNOT use /app/settings/page.hooks.tsx (sibling)

# OUTPUT FORMAT (PLAIN TEXT)

Write a detailed plain text plan describing:

1. **Directory Structure**: List all directories and files
2. **Scope Analysis**: For each feature, state its scope (GLOBAL/SECTION/PAGE)
3. **Function Assignments**: For each feature, list the 4 functions and where they go
4. **File Consolidation**: Which features share which files

Example format:

## Directory Structure

app/
├── layout.tsx
├── layout.hooks.tsx (GLOBAL)
├── layout.actions.ts (GLOBAL)
├── layout.stores.ts (GLOBAL)
├── layout.types.ts (GLOBAL)
├── page.tsx
└── dashboard/
    ├── page.tsx
    ├── page.hooks.tsx (PAGE-SPECIFIC)
    ├── page.actions.ts (PAGE-SPECIFIC)
    ├── page.stores.ts (PAGE-SPECIFIC)
    └── page.types.ts (PAGE-SPECIFIC)

## Feature Scope Analysis

Feature: "Sign out user" (ID: feat-1)
- Scope: GLOBAL (used across entire app)
- Functions go in: /app/layout.*

Feature: "Get dashboard stats" (ID: feat-2)
- Scope: PAGE (only /dashboard)
- Functions go in: /app/dashboard/page.*

## Function Assignments

🚨 YOU MUST LIST ALL ${featureCount} FEATURES BELOW - DO NOT SKIP ANY 🚨

### /app/layout.hooks.tsx
- useSignOut() ← from "Sign out user" (feat-1)

### /app/layout.actions.ts
- signOutAction() ← from "Sign out user" (feat-1)

### /app/layout.stores.ts
- useAuthStore() ← from "Sign out user" (feat-1)

### /app/layout.types.ts
- SignOutResult ← from "Sign out user" (feat-1)

### /app/dashboard/page.hooks.tsx
- useDashboardStats() ← from "Get dashboard stats" (feat-2)

### /app/dashboard/page.actions.ts
- getDashboardStatsAction() ← from "Get dashboard stats" (feat-2)

### /app/dashboard/page.stores.ts
- useDashboardStore() ← from "Get dashboard stats" (feat-2)

### /app/dashboard/page.types.ts
- DashboardStats ← from "Get dashboard stats" (feat-2)

[Continue this pattern for EVERY remaining feature with its actual feature ID. List all ${featureCount} features explicitly.]

## Page-to-File Mapping

Input Page ID → Structure File
- "dash-page-id" → /app/dashboard/page.tsx

Feature Assignments:
- feat-1 (Sign out user) → /app/dashboard/page.tsx (uses GLOBAL files)
- feat-2 (Get dashboard stats) → /app/dashboard/page.tsx (uses PAGE-SPECIFIC files)

# REQUIREMENTS

1. Each feature → 4 functions (hook, action, store, type)
2. Analyze scope: global vs section vs page
3. Multiple features → consolidate into shared files
4. Duplicate features (same title/description) → SAME utility files and functions, but PRESERVE ALL feature IDs
5. Only create files with ≥1 function assigned
6. No empty utility files
7. Parent directory linking only (no siblings)
8. Preserve ALL ${featureCount} input feature IDs in your mappings
9. Map input page IDs to file paths clearly

# FINAL VERIFICATION (REQUIRED)

You MUST end your plan with this verification section:

## Feature Count Verification

Total input features: ${featureCount}

All Feature IDs that MUST appear in Function Assignments section above:
${Object.entries(inferredFeatures).map(([pageId, features]) => {
    return features.map(f => `  - ${f.id}: "${f.title}"`).join('\n');
  }).join('\n')}

Features assigned in this plan:
${pageIds.map(id => {
    const page = parsedPages.find(p => p.id === id);
    const count = inferredFeatures[id].length;
    return `  - Page: ${page?.name || id} (${page?.route || ''}) - ${count} features assigned`;
  }).join('\n')}

Total features in plan: ${featureCount}
Status: ✅ COMPLETE

🚨 VERIFY: Scroll up and confirm that EVERY feature ID listed above appears in your Function Assignments section. If any are missing, your plan is INVALID and Phase 2 will fail.

Return your analysis as plain text following the format above.`;
};

export const buildStructureFromPlanPrompt = (
  plan: string,
  parsedPages: ParsedPage[],
  inferredFeatures: Record<string, InferredFeature[]>
): string => {
  const featureCount = Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0);
  const pageIds = Object.keys(inferredFeatures);

  const pageMappingList = pageIds.map(id => {
    const page = parsedPages.find(p => p.id === id);
    const count = inferredFeatures[id].length;
    return `   - Input ID: "${id}" → Route: "${page?.route || ''}" (${count} features)`;
  }).join('\n');

  return `Convert the plain text plan into a JSON structure.

PLAIN TEXT PLAN:
${plan}

INPUT PAGE MAPPINGS:
${pageMappingList}

YOUR TASK: Generate JSON structure with ALL ${featureCount} features from the plan above.

# JSON Format

Return this exact structure:

{
  "structure": [
    {
      "id": "app-root",
      "name": "app",
      "type": "directory",
      "children": [
        { "id": "layout-tsx", "name": "layout.tsx", "type": "file" },
        { "id": "layout-hooks", "name": "layout.hooks.tsx", "type": "file" },
        { "id": "layout-actions", "name": "layout.actions.ts", "type": "file" },
        { "id": "layout-stores", "name": "layout.stores.ts", "type": "file" },
        { "id": "layout-types", "name": "layout.types.ts", "type": "file" },
        {
          "id": "dashboard-dir",
          "name": "dashboard",
          "type": "directory",
          "children": [
            { "id": "dash-page", "name": "page.tsx", "type": "file" },
            { "id": "dash-hooks", "name": "page.hooks.tsx", "type": "file" },
            { "id": "dash-actions", "name": "page.actions.ts", "type": "file" }
          ]
        }
      ]
    }
  ],
  "features": {
    "dash-page": [
      {
        "id": "feat-1",
        "title": "Sign out user",
        "description": "Clear session and redirect to login",
        "linkedFiles": {
          "hooks": "/app/layout.hooks.tsx",
          "actions": "/app/layout.actions.ts",
          "stores": "/app/layout.stores.ts",
          "types": "/app/layout.types.ts"
        },
        "functionNames": {
          "hooks": "useSignOut",
          "actions": "signOutAction",
          "stores": "useAuthStore",
          "types": "SignOutResult"
        }
      }
    ]
  }
}

# Critical Requirements

1. Map each input page ID to a structure file ID in the features object
2. Preserve ALL ${featureCount} feature IDs from the plan (including duplicates with same title/description)
3. Duplicate features (same title/description but different IDs) should reference the SAME linkedFiles and functionNames
4. Include linkedFiles and functionNames based on the plan's function assignments
5. Generate unique alphanumeric IDs for all FileSystemEntry items
6. Use the directory structure from the plan

Example of duplicate handling:
If the plan shows:
- Feature 0rm99xumz: "Sign out user" → useSignOut() in /app/layout.hooks.tsx
- Feature tl8a5xrk4: "Sign out user" → useSignOut() in /app/layout.hooks.tsx

Both features should appear in your output with:
- Different IDs (0rm99xumz and tl8a5xrk4)
- Same linkedFiles: { "hooks": "/app/layout.hooks.tsx", ... }
- Same functionNames: { "hooks": "useSignOut", ... }

# Validation

Before returning, verify:
- features object has ${pageIds.length} keys (one per input page)
- Total features across all pages = ${featureCount} (count every feature ID, including duplicates)
- ALL ${featureCount} feature IDs from plan are preserved (do not drop any)
- Duplicate features reference the same utility files and functions

Return ONLY valid JSON. No markdown blocks, no explanations. Start with { and end with }.`;
};

export const buildScopeClassificationPrompt = (
  parsedPages: ParsedPage[],
  inferredFeatures: Record<string, InferredFeature[]>
): string => {
  const allFeatures: Array<{ id: string; pageId: string; title: string; description: string; route: string }> = [];

  Object.entries(inferredFeatures).forEach(([pageId, features]) => {
    const page = parsedPages.find(p => p.id === pageId);
    features.forEach(f => {
      allFeatures.push({
        id: f.id,
        pageId,
        title: f.title,
        description: f.description,
        route: page?.route || "/"
      });
    });
  });

  const routeGroups = new Map<string, string[]>();
  parsedPages.forEach(page => {
    const match = page.route.match(/^\(([^)]+)\)/);
    if (match) {
      const group = match[1];
      if (!routeGroups.has(group)) {
        routeGroups.set(group, []);
      }
      routeGroups.get(group)!.push(page.route);
    }
  });

  return `Classify each feature's scope. Return ONLY valid JSON.

${SCOPE_RULES}

## Input Features (${allFeatures.length} total)

${allFeatures.map(f => `- ID: ${f.id}
  Page: ${f.route}
  Title: "${f.title}"
  Description: "${f.description}"`).join('\n\n')}

## Route Groups Detected

${routeGroups.size > 0
  ? Array.from(routeGroups.entries()).map(([group, routes]) =>
      `- (${group}): ${routes.join(', ')}`
    ).join('\n')
  : 'No route groups detected'}

## Output Format

Return a JSON object mapping feature ID to scope:

{
  "scopeMap": {
    "feat-id-1": "GLOBAL",
    "feat-id-2": "PAGE:/dashboard",
    "feat-id-3": "SECTION:(admin)"
  }
}

Scope values:
- "GLOBAL" - for auth, user profile, theme, notifications
- "PAGE:/route" - for page-specific features (use the actual route)
- "SECTION:(group)" - for route group shared features

Return ONLY the JSON object. No explanations.`;
};

export const buildDirectoryStructurePrompt = (
  parsedPages: ParsedPage[],
  scopeMap: Record<string, string>
): string => {
  const globalFeatureCount = Object.values(scopeMap).filter(s => s === "GLOBAL").length;
  const sectionScopes = [...new Set(Object.values(scopeMap).filter(s => s.startsWith("SECTION:")))];

  return `Generate Next.js App Router directory structure. Return ONLY valid JSON.

${DIRECTORY_RULES}

## Input Pages (${parsedPages.length} total)

${parsedPages.map(p => `- Route: ${p.route}
  Name: ${p.name}
  Description: ${p.description}`).join('\n\n')}

## Scope Analysis Summary

- Global features: ${globalFeatureCount} (need layout.* files at /app/)
- Section scopes: ${sectionScopes.length > 0 ? sectionScopes.join(', ') : 'None'}
- Page-specific features: ${Object.values(scopeMap).filter(s => s.startsWith("PAGE:")).length}

## Requirements

1. Create app/ directory with layout.tsx and page.tsx
2. Create subdirectories for each route
3. Include utility files based on scope:
   - If global features exist → add layout.hooks.tsx, layout.actions.ts, layout.stores.ts, layout.types.ts at /app/
   - For section scopes → add layout.* files at section directory
   - For page features → add page.* files at page directory
4. Use route groups for (auth), (admin) etc if present in routes
5. Use dynamic routes [id], [slug] as appropriate

## Output Format

Return a JSON object with structure array:

{
  "structure": [
    {
      "id": "app-root",
      "name": "app",
      "type": "directory",
      "isExpanded": true,
      "children": [
        { "id": "layout-tsx", "name": "layout.tsx", "type": "file" },
        { "id": "layout-hooks", "name": "layout.hooks.tsx", "type": "file" },
        { "id": "page-tsx", "name": "page.tsx", "type": "file" },
        {
          "id": "dashboard-dir",
          "name": "dashboard",
          "type": "directory",
          "children": [
            { "id": "dash-page", "name": "page.tsx", "type": "file" },
            { "id": "dash-hooks", "name": "page.hooks.tsx", "type": "file" }
          ]
        }
      ]
    }
  ],
  "filePaths": [
    "/app/layout.tsx",
    "/app/layout.hooks.tsx",
    "/app/page.tsx",
    "/app/dashboard/page.tsx",
    "/app/dashboard/page.hooks.tsx"
  ]
}

IMPORTANT:
- Generate unique alphanumeric IDs (e.g., "app-root", "dash-page-tsx")
- Include filePaths array listing all file paths for reference
- Only create utility files where features need them

Return ONLY the JSON object. No explanations.`;
};

export const buildFunctionAssignmentPrompt = (
  featureBatch: Array<{ id: string; pageId: string; title: string; description: string; route: string }>,
  scopeMap: Record<string, string>,
  filePaths: string[],
  previousAssignments: FunctionAssignment[],
  batchIndex: number,
  totalBatches: number
): string => {
  const existingFunctions = new Set<string>();
  previousAssignments.forEach(a => {
    if (a.functionNames.hooks) existingFunctions.add(a.functionNames.hooks);
    if (a.functionNames.actions) existingFunctions.add(a.functionNames.actions);
    if (a.functionNames.stores) existingFunctions.add(a.functionNames.stores);
    if (a.functionNames.types) existingFunctions.add(a.functionNames.types);
  });

  return `Generate function assignments for feature batch ${batchIndex + 1}/${totalBatches}. Return ONLY valid JSON.

${FUNCTION_NAMING_RULES}

## Available File Paths

${filePaths.join('\n')}

## Previously Assigned Functions (avoid duplicates)

${existingFunctions.size > 0
  ? Array.from(existingFunctions).join(', ')
  : 'None yet'}

## Features to Assign (${featureBatch.length} in this batch)

${featureBatch.map(f => {
  const scope = scopeMap[f.id] || "PAGE:" + f.route;
  return `- ID: ${f.id}
  Page ID: ${f.pageId}
  Route: ${f.route}
  Scope: ${scope}
  Title: "${f.title}"
  Description: "${f.description}"`;
}).join('\n\n')}

## Assignment Rules

1. Based on scope, choose the appropriate utility file paths:
   - GLOBAL → /app/layout.hooks.tsx, /app/layout.actions.ts, etc.
   - SECTION:(group) → /app/(group)/layout.hooks.tsx, etc.
   - PAGE:/route → /app/route/page.hooks.tsx, etc.

2. Generate unique function names following naming conventions
3. Reuse existing functions for duplicate features (same title)
4. Only link to files that exist in the Available File Paths list

## Output Format

{
  "assignments": [
    {
      "featureId": "feat-id-1",
      "pageId": "page-id-1",
      "title": "Feature Title",
      "description": "Feature description",
      "linkedFiles": {
        "hooks": "/app/layout.hooks.tsx",
        "actions": "/app/layout.actions.ts",
        "stores": "/app/layout.stores.ts",
        "types": "/app/layout.types.ts"
      },
      "functionNames": {
        "hooks": "useFeatureName",
        "actions": "featureNameAction",
        "stores": "useFeatureStore",
        "types": "FeatureResult"
      }
    }
  ]
}

IMPORTANT:
- Provide assignments for ALL ${featureBatch.length} features in this batch
- Each feature needs all 4 utility file types (hooks, actions, stores, types)
- Function names must be unique (except for duplicate features)

Return ONLY the JSON object. No explanations.`;
};

export const assembleStructure = (
  directoryStructure: FileSystemEntry[],
  parsedPages: ParsedPage[],
  allAssignments: FunctionAssignment[]
): { structure: FileSystemEntry[]; features: Record<string, import("@/app/(editor)/layout.types").Feature[]> } => {
  const pageIdToFileId = new Map<string, string>();
  const allPageFiles: Array<{ id: string; path: string; name: string }> = [];
  const allLayoutFiles: Array<{ id: string; path: string; name: string }> = [];

  const collectFiles = (entries: FileSystemEntry[], path: string = "") => {
    entries.forEach(entry => {
      const entryPath = path + "/" + entry.name;
      if (entry.type === "file") {
        if (entry.name === "page.tsx") {
          allPageFiles.push({ id: entry.id, path: entryPath, name: entry.name });
        } else if (entry.name === "layout.tsx") {
          allLayoutFiles.push({ id: entry.id, path: entryPath, name: entry.name });
        }
      }
      if (entry.children) {
        collectFiles(entry.children, entryPath);
      }
    });
  };

  collectFiles(directoryStructure);

  console.log("========================================");
  console.log("PHASE 4 - ASSEMBLY DEBUG");
  console.log("========================================");
  console.log("📁 Page files collected:");
  allPageFiles.forEach(f => console.log(`  ID: "${f.id}" | Name: "${f.name}" | Path: "${f.path}"`));
  console.log("📁 Layout files collected:");
  allLayoutFiles.forEach(f => console.log(`  ID: "${f.id}" | Name: "${f.name}" | Path: "${f.path}"`));

  const stripRouteGroups = (path: string): string => {
    return path.replace(/\/\([^)]+\)/g, "");
  };

  const getRouteFromPath = (filePath: string): string => {
    const stripped = stripRouteGroups(filePath);
    const route = stripped
      .replace("/app", "")
      .replace("/page.tsx", "")
      .replace("/layout.tsx", "");
    return route || "/";
  };

  console.log("🗺️ PAGE ID → FILE ID MAPPING:");
  parsedPages.forEach(page => {
    if (page.route === "" || page.id.startsWith("layout-")) {
      const rootLayout = allLayoutFiles.find(f => f.path === "/app/layout.tsx");
      if (rootLayout) {
        pageIdToFileId.set(page.id, rootLayout.id);
        console.log(`  ✅ LAYOUT: "${page.id}" → "${rootLayout.id}" (route: "")`);
      } else {
        console.log(`  ❌ LAYOUT: "${page.id}" → NO LAYOUT FILE FOUND`);
      }
      return;
    }

    const normalizedRoute = page.route === "/" ? "/" : page.route;

    let matchedFile = allPageFiles.find(f => {
      const fileRoute = getRouteFromPath(f.path);
      return fileRoute === normalizedRoute;
    });

    if (!matchedFile) {
      const routeSegments = normalizedRoute.split("/").filter(Boolean);
      matchedFile = allPageFiles.find(f => {
        const fileRoute = getRouteFromPath(f.path);
        const fileSegments = fileRoute.split("/").filter(Boolean);

        if (routeSegments.length !== fileSegments.length) return false;

        return routeSegments.every((seg, i) => {
          const fileSeg = fileSegments[i];
          if (seg.startsWith("[") && fileSeg.startsWith("[")) return true;
          return seg === fileSeg;
        });
      });
    }

    if (matchedFile) {
      pageIdToFileId.set(page.id, matchedFile.id);
      console.log(`  ✅ PAGE: "${page.id}" → "${matchedFile.id}" (route: "${normalizedRoute}")`);
    } else {
      console.log(`  ❌ PAGE: "${page.id}" → NO MATCH (route: "${normalizedRoute}")`);
      console.log(`     Available routes:`, allPageFiles.map(f => getRouteFromPath(f.path)));
    }
  });

  const features: Record<string, import("@/app/(editor)/layout.types").Feature[]> = {};
  const unmappedAssignments: FunctionAssignment[] = [];

  console.log("🔗 FEATURE ASSIGNMENT:");
  allAssignments.forEach(assignment => {
    let fileId = pageIdToFileId.get(assignment.pageId);
    const originalFileId = fileId;

    if (!fileId) {
      unmappedAssignments.push(assignment);
      const rootPage = allPageFiles.find(f => f.path === "/app/page.tsx");
      if (rootPage) {
        fileId = rootPage.id;
        console.log(`  ⚠️ "${assignment.featureId}" (${assignment.title}) → FALLBACK to "${fileId}" (pageId "${assignment.pageId}" not found)`);
      } else {
        console.log(`  ❌ "${assignment.featureId}" (${assignment.title}) → DROPPED (no mapping, no fallback)`);
      }
    }

    if (fileId) {
      if (!features[fileId]) {
        features[fileId] = [];
      }

      features[fileId].push({
        id: assignment.featureId,
        title: assignment.title,
        description: assignment.description,
        linkedFiles: assignment.linkedFiles,
        functionNames: assignment.functionNames,
        isEditing: false
      });
    }
  });

  if (unmappedAssignments.length > 0) {
    console.warn(`⚠️ ${unmappedAssignments.length} assignments used fallback mapping:`,
      unmappedAssignments.map(a => ({ id: a.featureId, pageId: a.pageId, title: a.title })));
  }

  console.log("📊 FINAL FEATURE COUNTS BY FILE:");
  Object.entries(features).forEach(([fileId, featureList]) => {
    const file = allPageFiles.find(f => f.id === fileId) || allLayoutFiles.find(f => f.id === fileId);
    console.log(`  "${fileId}" (${file?.name || "unknown"} at ${file?.path || "unknown"}): ${featureList.length} features`);
  });

  const totalOutput = Object.values(features).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`📈 TOTAL: ${allAssignments.length} input → ${totalOutput} output`);
  console.log("========================================");

  return { structure: directoryStructure, features };
};
