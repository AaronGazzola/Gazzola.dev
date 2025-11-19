# Code File Generation Guide

This guide explains how to modify output file content based on configuration using the declarative code file generation system.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Modifying File Content](#modifying-file-content)
- [Adding Conditional Logic](#adding-conditional-logic)
- [Creating New Files](#creating-new-files)
- [Configuration Reference](#configuration-reference)
- [Best Practices](#best-practices)

---

## Overview

The code file generation system is part of a unified configuration control architecture that determines all output content in the application.

### Core Components

1. **`lib/config-snapshot.ts`** - Type-safe configuration interface (single source of truth)
2. **`lib/code-templates.ts`** - Template functions that generate file content
3. **`lib/code-file-config.ts`** - Declarative file definitions with conditions
4. **`lib/section-option-mappings.ts`** - Controls markdown section visibility based on configuration
5. **`lib/section-filter.utils.ts`** - Automatic section filtering system

### Unified Configuration Architecture

```
User Configuration (InitialConfigurationType + Theme + Plugins + Tables)
    ↓
ConfigSnapshot (lib/config-snapshot.ts)
    ↓
Controls two output systems:
    ├─→ Code File Generation (lib/code-file-config.ts)
    │   └─→ Conditional file inclusion
    │       └─→ Dynamic content generation
    └─→ Markdown Section Filtering (lib/section-option-mappings.ts)
        └─→ Section option visibility
            └─→ Static content selection
```

Both systems use ConfigSnapshot as the single source of truth for determining what content appears in the output.

## Configuration-Driven Content

### Code Files vs Markdown Sections

The system controls two types of content:

| Aspect | Code Files | Markdown Sections |
|--------|-----------|-------------------|
| **Purpose** | Generated source code | Documentation content |
| **Content** | Dynamic (templates) | Static (markdown files) |
| **Control** | Conditional inclusion | Visibility filtering |
| **Location** | `lib/code-file-config.ts` | `lib/section-option-mappings.ts` |
| **Example** | `lib/auth.ts`, `lib/prisma-rls.ts` | Types examples, hooks examples |

### How Section Filtering Works

Markdown files (e.g., `docs/util.md`) contain multiple section options for different tech stacks:

1. **Section Definition**: Markdown file contains `<!-- section-1 -->` markers
2. **Option Files**: Corresponding `.section-1.md` files contain multiple options
3. **Mapping Configuration**: `section-option-mappings.ts` links each option to a config path
4. **Automatic Filtering**: System shows/hides options based on user's configuration
5. **User Sees**: Only relevant options for their tech stack

**Example**: The `docs/util.md` file shows different code examples:
- Client-side only: Shows simple useState examples
- Prisma + Better-Auth: Shows auth utilities with RLS
- Supabase: Shows Supabase client examples

All controlled automatically via `SECTION_OPTION_MAPPINGS`.

## Quick Start

### Step 1: Modify Content

Edit templates in `lib/code-templates.ts`:

```typescript
export const TEMPLATES = {
  auth: {
    basic: (): string => {
      return `import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Your configuration here
});`;
    },
  },
};
```

### Step 2: Add Conditional Logic

Edit file configs in `lib/code-file-config.ts`:

```typescript
{
  id: "auth.ts",
  path: "lib/auth.ts",
  conditions: {
    include: (config) => config.betterAuth && config.prisma,
    version: (config) => `v2-${config.plugins.length}`,
  },
  generator: (config) => {
    if (config.plugins.length > 0) {
      return TEMPLATES.auth.withPlugins(config.plugins);
    }
    return TEMPLATES.auth.basic();
  },
  metadata: {
    description: "Better Auth server configuration",
    requiredTech: ["betterAuth", "prisma"],
    requiredFeatures: ["authentication"],
  },
}
```

### Step 3: Regenerate Documentation

```bash
npm run docs:generate
```

This updates `docs/code-files/` with all file variations.

---

## Modifying File Content

### 1. Edit Template Functions

Templates are pure functions in `lib/code-templates.ts` that return strings:

```typescript
export const TEMPLATES = {
  myFile: {
    // Simple template
    basic: (): string => {
      return `export const config = { basic: true };`;
    },

    // Template with parameters
    withFeatures: (features: string[]): string => {
      const featureList = features.map(f => `"${f}"`).join(", ");
      return `export const config = {
  features: [${featureList}]
};`;
    },

    // Template using config
    dynamic: (config: ConfigSnapshot): string => {
      const imports = config.betterAuth
        ? 'import { betterAuth } from "better-auth";'
        : '';

      return `${imports}

export const myConfig = {
  hasAuth: ${config.betterAuth},
  database: "${config.databaseProvider}"
};`;
    },
  },
};
```

### 2. Update Generator Logic

In `lib/code-file-config.ts`, modify the `generator` function:

```typescript
{
  id: "my-file.ts",
  path: "lib/my-file.ts",
  generator: (config) => {
    // Simple conditional
    if (config.authEnabled) {
      return TEMPLATES.myFile.withAuth();
    }

    // Multiple conditions
    if (config.plugins.length > 0) {
      return TEMPLATES.myFile.withPlugins(config.plugins);
    }

    // Complex logic
    const features = [];
    if (config.authMethods.magicLink) features.push("magicLink");
    if (config.authMethods.otp) features.push("otp");

    if (features.length > 0) {
      return TEMPLATES.myFile.withFeatures(features);
    }

    return TEMPLATES.myFile.basic();
  },
}
```

---

## Adding Conditional Logic

### Include Conditions

Control when a file is generated:

```typescript
conditions: {
  // File only included when Better Auth is enabled
  include: (config) => config.betterAuth,

  // Multiple conditions
  include: (config) =>
    config.betterAuth && config.databaseProvider !== "supabase",

  // Check for specific features
  include: (config) =>
    config.authEnabled && config.authMethods.emailPassword,

  // Check database configuration
  include: (config) =>
    config.prisma && config.rlsPolicies.length > 0,

  // Check plugins
  include: (config) =>
    config.plugins.some(p => p.name === "organization" && p.enabled),
}
```

### Version Strings

Generate unique version identifiers for documentation:

```typescript
conditions: {
  include: (config) => config.betterAuth,

  // Simple version
  version: (config) => "v1",

  // Dynamic version based on config
  version: (config) => {
    const pluginNames = config.plugins
      .filter(p => p.enabled)
      .map(p => p.name)
      .sort()
      .join(",");
    return `betterAuth-${pluginNames || "basic"}`;
  },

  // Version based on feature count
  version: (config) =>
    `rls-${config.rlsPolicies.length}-policies`,
}
```

### Dynamic File Paths

Use a function for dynamic paths:

```typescript
{
  id: "robots-file",
  // Dynamic path based on IDE selection
  path: (config: ConfigSnapshot) => {
    const fileNames = {
      lovable: ".lovablerules",
      cursor: ".cursorrules",
      claudecode: "CLAUDE.md",
      replit: ".replit",
    };
    return fileNames[config.selectedIDE];
  },
  conditions: {
    include: () => true,
    version: (config) => `ide-${config.selectedIDE}`,
  },
  generator: (config) => TEMPLATES.robotsFile(),
}
```

---

## Creating New Files

### Full Example: New Configuration File

**Step 1:** Add template to `lib/code-templates.ts`:

```typescript
export const TEMPLATES = {
  // ... existing templates

  customConfig: (config: ConfigSnapshot): string => {
    const features = [];

    if (config.authEnabled) {
      features.push(`auth: {
      enabled: true,
      methods: [${Object.entries(config.authMethods)
        .filter(([_, enabled]) => enabled)
        .map(([method]) => `"${method}"`)
        .join(", ")}]
    }`);
    }

    if (config.paymentsEnabled) {
      features.push(`payments: {
      enabled: true,
      providers: [${config.payments.stripePayments ? '"stripe"' : ''}]
    }`);
    }

    return `export const appConfig = {
  ${features.join(",\n  ")}
};`;
  },
};
```

**Step 2:** Add file config to `lib/code-file-config.ts`:

```typescript
export const CODE_FILE_CONFIGS: FileConfig[] = [
  // ... existing configs

  {
    id: "app-config.ts",
    path: "lib/app-config.ts",
    conditions: {
      include: (config) => config.authEnabled || config.paymentsEnabled,
      version: (config) => {
        const parts = [];
        if (config.authEnabled) parts.push("auth");
        if (config.paymentsEnabled) parts.push("payments");
        return parts.join("-");
      },
    },
    generator: (config) => TEMPLATES.customConfig(config),
    metadata: {
      description: "Application configuration with enabled features",
      requiredTech: [],
      requiredFeatures: ["authentication or payments"],
    },
  },
];
```

**Step 3:** Regenerate docs:

```bash
npm run docs:generate
```

---

## Configuration Reference

Inside `generator: (config) => {}`, you have access to:

### Technologies

```typescript
config.betterAuth      // boolean
config.prisma          // boolean
config.supabase        // boolean
config.nextjs          // boolean
config.tailwindcss     // boolean
config.shadcn          // boolean
// ... etc
```

### Questions/Settings

```typescript
config.databaseProvider  // 'none' | 'supabase' | 'neondb' | 'both'
config.alwaysOnServer    // boolean
config.selectedIDE       // 'lovable' | 'cursor' | 'claudecode' | 'replit'
```

### Features

```typescript
config.authEnabled       // boolean
config.authMethods       // { magicLink: boolean, emailPassword: boolean, ... }
config.adminEnabled      // boolean
config.adminRoles        // { admin: boolean, superAdmin: boolean, ... }
config.paymentsEnabled   // boolean
config.payments          // { stripePayments: boolean, ... }
```

### Database

```typescript
config.tables            // PrismaTable[]
config.rlsPolicies       // RLSPolicy[]
config.plugins           // Plugin[]
```

### Theme

```typescript
config.theme             // ThemeConfiguration
config.theme.colors.light.primary
config.theme.typography.light.fontSans
config.theme.other.light.radius
```

See `lib/config-snapshot.ts` for the complete `ConfigSnapshot` interface.

---

## Best Practices

### 1. Keep Templates Pure

Templates should be pure functions with no side effects:

```typescript
// ✅ Good
const myTemplate = (config: ConfigSnapshot): string => {
  return `export const value = "${config.databaseProvider}";`;
};

// ❌ Bad (side effects)
const myTemplate = (config: ConfigSnapshot): string => {
  console.log("Generating..."); // Side effect
  localStorage.setItem("config", JSON.stringify(config)); // Side effect
  return `export const value = "test";`;
};
```

### 2. Use Helper Functions

Extract complex logic into helper functions:

```typescript
const getEnabledPlugins = (config: ConfigSnapshot) => {
  return config.plugins
    .filter(p => p.enabled && p.file === "auth")
    .map(p => p.name)
    .sort();
};

export const TEMPLATES = {
  auth: {
    withPlugins: (config: ConfigSnapshot): string => {
      const plugins = getEnabledPlugins(config);
      const imports = plugins.map(p =>
        `import { ${p} } from "better-auth/plugins";`
      ).join("\n");

      return `${imports}

export const auth = betterAuth({
  plugins: [${plugins.map(p => `${p}()`).join(", ")}]
});`;
    },
  },
};
```

### 3. Test Different Configurations

After changes, test with different configs:

```bash
# Regenerate docs to see all variations
npm run docs:generate

# Check the generated files in docs/code-files/
```

### 4. Keep Metadata Accurate

Update metadata when changing requirements:

```typescript
{
  metadata: {
    description: "Clear, concise description",
    requiredTech: ["betterAuth", "prisma"], // All required technologies
    requiredFeatures: ["authentication"],   // All required features
  },
}
```

### 5. Use Consistent Naming

Follow conventions:
- Template IDs: `snake_case` (e.g., `auth_ts`, `prisma_rls_ts`)
- File IDs: `kebab-case` with extension (e.g., `auth.ts`, `auth-client.ts`)
- Template groups: `camelCase` (e.g., `auth`, `prismaRLS`)

---

## Examples

### Example 1: Add Environment Variable Template

```typescript
// lib/code-templates.ts
export const TEMPLATES = {
  // ... existing templates

  envExample: (config: ConfigSnapshot): string => {
    const lines = ["# Database"];

    if (config.databaseProvider === "supabase") {
      lines.push("DATABASE_URL=postgresql://...");
      lines.push("SUPABASE_URL=https://...");
      lines.push("SUPABASE_ANON_KEY=...");
    } else if (config.databaseProvider === "neondb") {
      lines.push("DATABASE_URL=postgresql://...");
    }

    lines.push("");
    lines.push("# Authentication");

    if (config.betterAuth) {
      lines.push("BETTER_AUTH_SECRET=...");
      if (config.authMethods.googleAuth) {
        lines.push("GOOGLE_CLIENT_ID=...");
        lines.push("GOOGLE_CLIENT_SECRET=...");
      }
    }

    return lines.join("\n");
  },
};
```

```typescript
// lib/code-file-config.ts
{
  id: ".env.example",
  path: ".env.example",
  conditions: {
    include: () => true,
    version: (config) => `db-${config.databaseProvider}`,
  },
  generator: (config) => TEMPLATES.envExample(config),
  metadata: {
    description: "Environment variables template",
    requiredTech: [],
    requiredFeatures: [],
  },
}
```

### Example 2: Conditional Database Client

```typescript
// lib/code-templates.ts
export const TEMPLATES = {
  dbClient: (config: ConfigSnapshot): string => {
    if (config.databaseProvider === "supabase") {
      return `import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);`;
    }

    if (config.prisma) {
      const hasRLS = config.rlsPolicies.length > 0;

      if (hasRLS) {
        return `import { PrismaClient } from "@prisma/client";
import { createRLSClient } from "./prisma-rls-client";

const prisma = new PrismaClient();

export { prisma, createRLSClient };`;
      }

      return `import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();`;
    }

    return `// No database client configured`;
  },
};
```

### Example 3: Multiple File Variations

```typescript
// lib/code-file-config.ts
{
  id: "middleware.ts",
  path: "middleware.ts",
  conditions: {
    include: (config) => config.authEnabled,
    version: (config) => {
      const parts = [];
      if (config.authEnabled) parts.push("auth");
      if (config.adminRoles.admin) parts.push("admin");
      if (config.adminRoles.organizations) parts.push("org");
      return parts.join("-");
    },
  },
  generator: (config) => {
    const middlewares: string[] = [];

    if (config.authEnabled) {
      middlewares.push("authMiddleware");
    }

    if (config.adminRoles.admin) {
      middlewares.push("adminMiddleware");
    }

    if (config.adminRoles.organizations) {
      middlewares.push("organizationMiddleware");
    }

    return `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

${middlewares.map(m => `// TODO: Implement ${m}`).join("\n")}

export function middleware(request: NextRequest) {
  // Middleware chain
  ${middlewares.map(m => `${m}(request);`).join("\n  ")}

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};`;
  },
  metadata: {
    description: "Next.js middleware with authentication",
    requiredTech: ["nextjs"],
    requiredFeatures: ["authentication"],
  },
}
```

---

## Troubleshooting

### File Not Generating

Check the `include` condition:

```typescript
conditions: {
  include: (config) => {
    console.log("Config:", config); // Debug output
    return config.someFeature;
  },
}
```

### Wrong Content Generated

Verify the generator logic:

```typescript
generator: (config) => {
  console.log("Generating with config:", config);
  const result = TEMPLATES.myFile(config);
  console.log("Generated:", result);
  return result;
}
```

### TypeScript Errors

Run type checking:

```bash
npm run typecheck
```

Common issues:
- Missing properties in `ConfigSnapshot`
- Incorrect return type from template functions
- Type mismatches in `path` (use `string | ((config) => string)`)

---

## Controlling Markdown Section Visibility

While code files have dynamic content generation, markdown sections use static content with visibility control.

### Adding Section Mappings

To control which markdown section options appear based on configuration:

**Step 1**: Identify the section option in your markdown file structure:
- File: `public/data/markdown/docs/10-util.md`
- Section marker: `<!-- section-3 -->`
- Option file: `public/data/markdown/docs/10-util.section-3.md`
- Option: `<!-- option-2 -->`

**Step 2**: Add mapping to `lib/section-option-mappings.ts`:

```typescript
export const SECTION_OPTION_MAPPINGS: SectionOptionMapping[] = [
  // ... existing mappings

  {
    filePath: "docs.util",  // Path uses dots instead of slashes
    sectionId: "section3",   // section-3 becomes section3
    optionId: "option2",     // option-2 becomes option2
    configPath: "technologies.betterAuth"  // Show when Better Auth is enabled
  },

  {
    filePath: "docs.util",
    sectionId: "section3",
    optionId: "option3",
    configPath: "questions.databaseProvider",
    matchValue: "both"  // Only show when databaseProvider === "both"
  },
];
```

**Step 3**: Test your configuration:
- Change configuration values in the UI
- Section options should automatically show/hide
- Check download includes correct options

### Section Mapping Patterns

**Always Include** (user choice):
```typescript
{ filePath: "ide", sectionId: "section1", optionId: "option1", configPath: null }
```

**Boolean Check**:
```typescript
{ filePath: "docs.util", sectionId: "section2", optionId: "option1", configPath: "technologies.prisma" }
```

**Value Match**:
```typescript
{ filePath: "docs.util", sectionId: "section3", optionId: "option4",
  configPath: "questions.databaseProvider", matchValue: "supabase" }
```

### Section vs Code File Decision

**Use Section Options when**:
- Content is documentation/examples
- Multiple valid variations exist (all equally correct)
- Content is static markdown
- User might want to see multiple options

**Use Code Files when**:
- Content is actual source code to be generated
- Only one version should exist per configuration
- Content is dynamically generated from config
- File should appear in downloads automatically

## Related Documentation

- [Code Files Reference](./code-files/index.md) - Auto-generated documentation of all files
- [Markdown Data System](./markdown-data.md) - Markdown file structure and sections
- `lib/config-snapshot.ts` - Complete configuration interface
- `lib/code-templates.ts` - All template functions
- `lib/code-file-config.ts` - All file definitions
- `lib/section-option-mappings.ts` - All section visibility mappings
- `lib/section-filter.utils.ts` - Automatic filtering implementation

---

## Questions?

For more complex scenarios or questions, refer to existing configurations:
- Code file patterns: `lib/code-file-config.ts`
- Section mapping patterns: `lib/section-option-mappings.ts`
