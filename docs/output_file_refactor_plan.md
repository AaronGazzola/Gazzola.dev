# Output File Refactor Plan

## Overview

Refactor the code file generation system from scattered imperative logic to a declarative configuration registry with auto-generated documentation.

---

## Current State

### Stores Managing Configuration

1. **useEditorStore** (`@/app/(editor)/layout.stores`)
   - `initialConfiguration` - Technologies, features, database provider
   - `appStructure` - App directory structure
   - `features` - Page/layout features with linked util files
   - `darkMode` - Theme mode
   - Section methods: `getSectionInclude()`, `setSectionContent()`, etc.

2. **useThemeStore** (via `localStorage.getItem("theme-storage")`)
   - `theme.colors.{light|dark}` - Color tokens
   - `theme.typography.{light|dark}` - Fonts and spacing
   - `theme.other.{light|dark}` - Radius, spacing, shadow

3. **useDatabaseStore** (`@/app/(components)/DatabaseConfiguration.stores`)
   - `tables: PrismaTable[]` - Database schema
   - `rlsPolicies: RLSPolicy[]` - RLS policies

### Current Problems

- File generation logic scattered across `code-files.registry.ts` and `download.utils.ts`
- Hard to track which configurations produce which files/content
- Difficult for AI to understand dependencies
- Not easily editable or maintainable
- No clear mapping of config → output variations

---

## Target Architecture

### File Structure

```
lib/
├── config-snapshot.ts          # Type-safe config snapshot
├── code-file-config.ts         # Declarative file definitions
├── code-templates.ts           # Template functions
└── code-file-generator.ts      # Runtime generation logic

scripts/
└── generate-config-docs.ts     # Auto-generate docs

docs/code-files/
├── index.md                    # Overview of all files
├── auth.ts.md                  # All variations of lib/auth.ts
├── auth-client.ts.md           # All variations of lib/auth-client.ts
├── prisma-rls.ts.md            # All variations of lib/prisma-rls.ts
├── globals.css.md              # All variations of app/globals.css
└── robots-file.md              # All variations of IDE-specific files
```

### Core Concepts

**1. Configuration Snapshot**
Single type-safe interface representing all configuration state:

```typescript
export interface ConfigSnapshot {
  // Technologies
  betterAuth: boolean
  prisma: boolean
  supabase: boolean

  // Database
  databaseProvider: 'none' | 'supabase' | 'neondb' | 'both'
  tables: PrismaTable[]
  rlsPolicies: RLSPolicy[]

  // Features
  authEnabled: boolean
  authMethods: string[]
  adminRoles: string[]

  // Plugins
  authPlugins: Plugin[]

  // IDE & Theme
  selectedIDE: IDEType
  theme: ThemeConfiguration
}
```

**2. Declarative File Configuration**
Each code file defined with conditions, versioning, and generation logic:

```typescript
export interface FileConfig {
  id: string
  path: string
  conditions: {
    include: (config: ConfigSnapshot) => boolean
    version?: (config: ConfigSnapshot) => string
  }
  generator: (config: ConfigSnapshot) => string
  metadata: {
    description: string
    requiredTech: string[]
    requiredFeatures: string[]
  }
}
```

**3. Template Registry**
Organized template functions by file:

```typescript
export const TEMPLATES = {
  auth: {
    basic: string
    withPlugins: (plugins: Plugin[]) => string
  },
  prismaRLS: (policies: RLSPolicy[], tables: PrismaTable[]) => string,
  theme: (theme: ThemeConfiguration) => string
}
```

**4. Auto-Generated Documentation**
Per-file markdown showing all variations:

```markdown
# lib/auth.ts

## Inclusion Conditions
- Better Auth enabled
- Database provider NOT Supabase-only

## Variation 1: Basic
**Config:** `{ betterAuth: true, authPlugins: [] }`
**Code:** [full example]

## Variation 2: With Plugins
**Config:** `{ betterAuth: true, authPlugins: [...] }`
**Code:** [full example]
```

---

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Create `lib/config-snapshot.ts`
- [ ] Define `ConfigSnapshot` interface with all config properties
- [ ] Create `createConfigSnapshot()` function
- [ ] Extract data from useEditorStore, useDatabaseStore, useThemeStore
- [ ] Add helper methods for common checks (e.g., `hasDatabase()`, `hasAuth()`)

#### 1.2 Create `lib/code-templates.ts`
- [ ] Extract template functions from `code-files.registry.ts`
- [ ] Organize by file type (auth, prisma, theme, utils)
- [ ] Convert to pure functions accepting `ConfigSnapshot`
- [ ] Maintain existing template logic

#### 1.3 Create `lib/code-file-config.ts`
- [ ] Define `FileConfig` interface
- [ ] Create `CODE_FILE_CONFIGS` array
- [ ] Migrate existing files:
  - [ ] `lib/auth.ts`
  - [ ] `lib/auth-client.ts`
  - [ ] `lib/auth.util.ts`
  - [ ] `lib/prisma-rls.ts`
  - [ ] `lib/prisma-rls-client.ts`
  - [ ] `lib/log.utils.ts`
  - [ ] `app/globals.css`
  - [ ] robots files (.cursorrules, CLAUDE.md, etc.)
  - [ ] UI component files

### Phase 2: Documentation Generator

#### 2.1 Create `scripts/generate-config-docs.ts`
- [ ] Script entry point with CLI
- [ ] Function to generate per-file documentation
- [ ] Function to generate index.md
- [ ] Template for per-file markdown structure
- [ ] Logic to discover all variations:
  - [ ] Test with minimal config
  - [ ] Test with each plugin/feature individually
  - [ ] Test with common combinations

#### 2.2 Documentation Templates
- [ ] Per-file template with sections:
  - [ ] Title and path
  - [ ] Description and metadata
  - [ ] Inclusion conditions (code block)
  - [ ] Each variation with config + output
  - [ ] Related files
- [ ] Index template with:
  - [ ] Overview table
  - [ ] Files grouped by technology
  - [ ] Quick reference examples

#### 2.3 Add npm Script
- [ ] Add `"docs:generate": "tsx scripts/generate-config-docs.ts"`
- [ ] Add to package.json scripts
- [ ] Document when to run (after config changes)

### Phase 3: Integration

#### 3.1 Create `lib/code-file-generator.ts`
- [ ] New `getCodeFiles()` function using new config system
- [ ] Filter files by `include()` condition
- [ ] Generate content via `generator()` function
- [ ] Map to existing `CodeFileNode` interface
- [ ] Maintain backward compatibility

#### 3.2 Update Existing Files
- [ ] Update `lib/download.utils.ts` to use new generator
- [ ] Update `lib/code-files.registry.ts`:
  - [ ] Keep `CodeFileRegistry` interface for compatibility
  - [ ] Delegate to new system
  - [ ] Mark as deprecated with migration notes
- [ ] Update `createCodeFileNodes()` call sites

#### 3.3 Update CLAUDE.md
- [ ] Add section about code files documentation
- [ ] Link to `docs/code-files/index.md`
- [ ] Brief explanation of the system
- [ ] When/how to regenerate docs

### Phase 4: Testing & Validation

#### 4.1 Create Test Fixtures
- [ ] `fixtures/configs/minimal.ts` - Bare minimum config
- [ ] `fixtures/configs/basic-auth.ts` - Simple auth setup
- [ ] `fixtures/configs/advanced-auth.ts` - Auth with plugins
- [ ] `fixtures/configs/full-stack.ts` - All features enabled
- [ ] `fixtures/configs/frontend-only.ts` - No database

#### 4.2 Validation Tests
- [ ] Test each file config generates valid code
- [ ] Test include conditions work correctly
- [ ] Test version strings are unique
- [ ] Test documentation generation completes
- [ ] Verify documented variations match actual output

#### 4.3 Generate Initial Documentation
- [ ] Run `npm run docs:generate`
- [ ] Review each generated file for accuracy
- [ ] Verify index.md links work
- [ ] Check code examples are readable
- [ ] Ensure all variations are documented

---

## Example Declarations

### auth.ts Configuration

```typescript
{
  id: 'auth.ts',
  path: 'lib/auth.ts',
  conditions: {
    include: (c) => c.betterAuth && c.databaseProvider !== 'supabase',
    version: (c) => {
      const plugins = c.authPlugins.filter(p => p.enabled).map(p => p.name).join(',')
      return `betterAuth-${plugins || 'basic'}`
    }
  },
  generator: (c) => {
    if (c.authPlugins.length === 0) return TEMPLATES.auth.basic
    return TEMPLATES.auth.withPlugins(c.authPlugins)
  },
  metadata: {
    description: 'Better Auth server configuration',
    requiredTech: ['betterAuth', 'prisma'],
    requiredFeatures: ['authentication']
  }
}
```

### prisma-rls.ts Configuration

```typescript
{
  id: 'prisma-rls.ts',
  path: 'lib/prisma-rls.ts',
  conditions: {
    include: (c) => c.prisma && c.rlsPolicies.length > 0,
    version: (c) => `rls-${c.rlsPolicies.length}-policies`
  },
  generator: (c) => TEMPLATES.prismaRLS(c.rlsPolicies, c.tables),
  metadata: {
    description: 'Prisma RLS client wrapper',
    requiredTech: ['prisma'],
    requiredFeatures: []
  }
}
```

---

## Example Documentation Output

### docs/code-files/auth.ts.md

```markdown
# lib/auth.ts

**Description:** Better Auth server configuration

**Required Technologies:** betterAuth, prisma

**Required Features:** authentication enabled

---

## Inclusion Conditions

```typescript
include: (config) =>
  config.betterAuth === true &&
  config.databaseProvider !== 'supabase'
```

**Excluded When:**
- Better Auth is disabled
- Database provider is Supabase-only (uses Supabase Auth instead)

---

## Variation 1: Basic (No Plugins)

**Config Requirements:**
- `betterAuth: true`
- `databaseProvider: 'neondb' | 'both'`
- `authPlugins: []` (empty)

**Generated Code:**
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
});
```

---

## Variation 2: With Organization Plugin

**Config Requirements:**
- `betterAuth: true`
- `databaseProvider: 'neondb' | 'both'`
- `authPlugins: [{ name: 'organization', enabled: true }]`

**Generated Code:**
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    organization()
  ],
});
```

---

## Related Files
- `lib/auth-client.ts` - Client-side companion
- `lib/auth.util.ts` - Authentication utilities
- `prisma/schema.prisma` - Database schema with auth tables
```

### docs/code-files/index.md

```markdown
# Code Files Configuration Reference

Auto-generated documentation for all code files based on configuration.

## Files Overview

| File | Path | Always Included | Technologies | Features |
|------|------|-----------------|--------------|----------|
| [auth.ts](./auth.ts.md) | `lib/auth.ts` | No | betterAuth, prisma | authentication |
| [auth-client.ts](./auth-client.ts.md) | `lib/auth-client.ts` | No | betterAuth | authentication |
| [prisma-rls.ts](./prisma-rls.ts.md) | `lib/prisma-rls.ts` | No | prisma | RLS enabled |
| [globals.css](./globals.css.md) | `app/globals.css` | Yes | tailwindcss | - |
| [robots-file](./robots-file.md) | `.{cursorrules\|lovablerules\|...}` | Yes | - | IDE selected |

## Files by Technology

### Better Auth
- [auth.ts](./auth.ts.md)
- [auth-client.ts](./auth-client.ts.md)
- [auth.util.ts](./auth.util.ts.md)

### Prisma
- [prisma-rls.ts](./prisma-rls.ts.md)
- [prisma-rls-client.ts](./prisma-rls-client.ts.md)

### Always Included
- [globals.css](./globals.css.md)
- [log.utils.ts](./log.utils.ts.md)
- [robots-file](./robots-file.md)

## Quick Reference

**To include auth.ts:**
```json
{
  "technologies": { "betterAuth": true },
  "questions": { "databaseProvider": "neondb" }
}
```

**To include prisma-rls.ts:**
```json
{
  "technologies": { "prisma": true },
  "rlsPolicies": [/* at least one policy */]
}
```
```

---

## Benefits

### For Developers
- **Single Source of Truth** - All file generation logic in one declarative config
- **Easy to Edit** - Change conditions/templates in one place
- **Type-Safe** - ConfigSnapshot ensures correctness
- **Testable** - Easy to test config combinations

### For AI Development
- **Clear Reference** - One file per output file showing all variations
- **Discoverable** - Index shows what files exist and when
- **Context-Aware** - Can reference specific file variations
- **Self-Documenting** - Docs always match implementation

### For Maintenance
- **Version Tracking** - See what config produces what code
- **Dependency Mapping** - Clear tech/feature requirements
- **Auto-Updated** - Regenerate docs after config changes
- **Backward Compatible** - Maintains existing interfaces

---

## Migration Strategy

1. **Build New System Alongside** - Don't break existing functionality
2. **Migrate File by File** - Move one code file at a time to new config
3. **Generate Documentation** - Run doc generator after each migration
4. **Validate Output** - Ensure new system produces identical output
5. **Deprecate Old System** - Mark old code with migration notes
6. **Remove Old Code** - Clean up after all files migrated

---

## Success Criteria

- [ ] All code files defined in declarative config
- [ ] Documentation generated for all files and variations
- [ ] Existing tests pass with new system
- [ ] New system produces identical output to old system
- [ ] CLAUDE.md updated with reference to new docs
- [ ] AI can answer "What files exist when X is enabled?"
- [ ] AI can show "What does Y look like with config Z?"
