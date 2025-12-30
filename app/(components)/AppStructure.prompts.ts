import { PatternDetectionResult, RoutePattern } from "./AppStructure.types";

export interface PromptGenerationConfig {
  readmeContent: string;
  detectedPatterns: PatternDetectionResult;
  relevantPatterns: RoutePattern[];
}

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
