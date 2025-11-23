# Markdown Data System

This document explains how to create and organize markdown content in the `data/markdown/` directory. The markdown files are parsed by `scripts/parse-markdown.ts` into a structured data format that powers the editor interface.

## Unified Configuration Control

The markdown section system is part of a larger configuration-driven architecture that controls all output content in the application:

```
ConfigSnapshot (single source of truth)
    ↓
Controls two output systems:
    ├─→ Code File Generation [lib/code-file-config.ts]
    │   └─→ Conditional file inclusion & dynamic content
    └─→ Markdown Section Filtering [lib/section-option-mappings.ts]
        └─→ Section option visibility (this document)
```

Both systems use the same `ConfigSnapshot` to determine what content appears. This ensures consistent behavior across generated code files and documentation sections. See [Code File Generation Guide](./code-file-generation-guide.md) for details on the unified architecture.

## File Structure and Organization

### Directory Layout

```
data/markdown/
├── 1-Getting Started/
│   ├── 1-Welcome.md
│   ├── 2-Setup.md
│   └── 3-Advanced.section-1.md
├── 2-Features/
│   ├── 1-Basic.md
│   └── 2-Advanced.md
└── *3-Hidden/
    └── 1-Secret.md
```

### File and Directory Naming

**Basic Names**: Files and directories can use any valid filename

- `welcome.md`
- `Getting Started/`

**Ordered Names**: Prepend numbers to control ordering

- `1-welcome.md` → Order: 1, Display: "welcome"
- `2-setup.md` → Order: 2, Display: "setup"
- `10-advanced.md` → Order: 10, Display: "advanced"

**Excluded Content**: Prepend asterisk (\*) to exclude from the editor

- `*1-hidden.md` → Excluded file
- `*Hidden/` → Excluded directory (and all children)

## URL Generation

Files are automatically converted to URLs based on their path:

- `data/markdown/1-Getting Started/2-Setup.md` → `/getting-started/setup`
- `data/markdown/Features/Basic.md` → `/features/basic`

The system:

- Removes numeric prefixes and file extensions
- Converts to lowercase
- Replaces spaces with hyphens
- Removes asterisks and special characters

## Sections System

### Adding Sections to Files

Use section markers in your markdown files:

```markdown
# Welcome

This is the main content.

<!-- section-1 -->

More content here.

<!-- section-2 -->

Final content.
```

### Creating Section Files

For each section marker, create a corresponding section file:

- Main file: `1-welcome.md`
- Section file: `1-welcome.section-1.md`
- Section file: `1-welcome.section-2.md`

### Section File Structure

Section files contain multiple options using option blocks:

```markdown
<!-- option-1 -->

This is the first option for this section.
It can contain **markdown** and multiple paragraphs.

<!-- /option-1 -->

<!-- option-2 -->

This is the second option.
Users can choose between different options.

<!-- /option-2 -->

<!-- option-3 -->

This is a third alternative.
Each option is independent.

<!-- /option-3 -->
```

### How Sections Work in the Editor

When the parser encounters:

1. `<!-- section-1 -->` in `welcome.md`
2. A corresponding `welcome.section-1.md` file

It creates a **SectionNode** in the editor with:

- A dropdown to select between options
- A nested editor for the selected option content
- All options available for switching

## Components System

### Adding Component References

Use component markers to embed React components:

```markdown
# App Structure

Here's an interactive diagram:

<!-- component-AppStructure -->

The component will be rendered here.
```

### Component Processing

The parser:

- Finds `<!-- component-AppStructure -->`
- Creates a **ComponentRef** with ID "AppStructure"
- The editor renders the actual React component

## Inclusion and Exclusion Rules

### File-Level Exclusion

```
*1-hidden.md          # File excluded
1-visible.md          # File included
```

### Directory-Level Exclusion

```
*Hidden/              # Directory and ALL children excluded
├── 1-secret.md       # Excluded (parent excluded)
├── 2-private.md      # Excluded (parent excluded)
└── Nested/           # Excluded (parent excluded)
    └── file.md       # Excluded (parent excluded)
```

### Inheritance Behavior

- Child nodes inherit the `include` status from their parents
- If a parent directory is excluded (\*), all children are excluded
- If a parent directory is included, children can still be individually excluded

## Complete Example

### File Structure

```
data/markdown/
├── 1-Tutorial/
│   ├── 1-basics.md
│   ├── 1-basics.section-1.md
│   ├── 2-advanced.md
│   └── *3-internal.md
└── 2-Reference/
    └── 1-api.md
```

### Main File: `1-Tutorial/1-basics.md`

```markdown
# Getting Started

Welcome to the tutorial!

## Basic Concepts

Let's start with the fundamentals.

<!-- section-1 -->

## Next Steps

Continue to the advanced section.

<!-- component-NextButton -->
```

### Section File: `1-Tutorial/1-basics.section-1.md`

```markdown
<!-- option-1 -->

**Beginner Path**: Start with the simple examples.
We'll walk through each step carefully.

<!-- /option-1 -->

<!-- option-2 -->

**Advanced Path**: Jump to complex examples.
This assumes you have prior experience.

<!-- /option-2 -->

<!-- option-3 -->

**Interactive Path**: Learn by doing.
Complete hands-on exercises as you go.

<!-- /option-3 -->
```

### Resulting Structure

The parser creates:

1. **FileNode** for `basics.md` with:
   - Content: Full markdown with section markers
   - Section: `section1` with 3 options
   - Component: `NextButton` reference

2. **SectionNode** in editor with:
   - Dropdown: ["Beginner Path", "Advanced Path", "Interactive Path"]
   - Nested editor for selected option content

3. **ComponentRef** for embedding the NextButton component

## Running the Parser

The parser runs automatically, but you can manually trigger it:

```bash
npm run parse-markdown
```

This processes all files in `data/markdown/` and generates `app/(editor)/layout.data.ts` with the structured data.

## Best Practices

1. **Use consistent numbering**: `1-`, `2-`, `3-` for clear ordering
2. **Logical grouping**: Group related content in directories
3. **Meaningful names**: Use descriptive names after the number prefix
4. **Section planning**: Plan sections before writing to avoid reorganization
5. **Option clarity**: Make option differences clear to users
6. **Component integration**: Use components for interactive content

## Data Storage and Loading

### Processed Data Storage

The parser generates structured data that's stored in:

- `public/data/processed-markdown.json` - Complete parsed markdown structure
- `public/data/content-version.json` - Content version tracking

### Data Loading via Server Actions

The editor loads markdown data through server actions:

```typescript
// app/(editor)/layout.actions.ts
export const getMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  // Fetches processed-markdown.json via HTTP request
  const response = await fetch(`${baseUrl}/data/processed-markdown.json`);
  const data: MarkdownData = await response.json();
  return getActionResponse({ data });
};

export const getContentVersionAction = async (): Promise<
  ActionResponse<number>
> => {
  // Reads content-version.json to check for updates
  const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
  return getActionResponse({ data: versionData.version });
};
```

### Content Versioning

The system tracks content changes using version numbers:

- Parser increments version on each run
- Editor store checks for version mismatches
- Automatic refresh when new content is available

## Editor Store Architecture

### Store Structure

The editor uses Zustand for state management with persistence:

```typescript
interface EditorState {
  version: number;
  data: MarkdownData; // Complete parsed markdown tree
  darkMode: boolean;
  previewMode: boolean;
  refreshKey: number;
  visitedPages: string[]; // Navigation tracking
  placeholderValues: Record<string, string>; // {{key:value}} replacements
  initialConfiguration: InitialConfigurationType;
  storedContentVersion?: number;
  // ... methods for data manipulation
}
```

### Flat Index for Performance

The store maintains a `flatIndex` for O(1) node lookups:

```typescript
interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>; // path -> node mapping
  contentVersion: number;
}

// Fast node retrieval
const node = store.data.flatIndex[path];
```

### Store Persistence and Migrations

The store persists to localStorage with version-based migrations:

```typescript
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      /* store implementation */
    }),
    {
      name: "editor-storage",
      version: STORE_VERSION,
      migrate: (persistedState: any, version: number) => {
        // Handle data structure changes between versions
        if (version < 2) {
          return migrateSections(persistedState);
        }
        return persistedState;
      },
    }
  )
);
```

## Advanced Section Features

### Section Inclusion System

Each section option has an `include` boolean flag:

```typescript
interface SectionOption {
  content: string;
  include: boolean; // Controls whether option appears in editor
}
```

### Configuration-Based Section Filtering

Section options are automatically shown/hidden based on user configuration. This system ensures users only see relevant content for their tech stack.

#### How It Works

```
User Configuration (technologies, questions, features)
    ↓
applyAutomaticSectionFiltering() [lib/section-filter.utils.ts]
    ↓
Reads SECTION_OPTION_MAPPINGS [lib/section-option-mappings.ts]
    ↓
For each mapping:
  - Get config value (e.g., technologies.prisma)
  - Determine if option should be included
  - Call setSectionInclude() to update store
    ↓
Editor displays only included options
```

#### Section Option Mappings

Mappings connect section options to configuration paths:

```typescript
// lib/section-option-mappings.ts
export const SECTION_OPTION_MAPPINGS: SectionOptionMapping[] = [
  // Show Prisma types when Prisma is enabled
  {
    filePath: "docs.util",
    sectionId: "section1",
    optionId: "option2",
    configPath: "technologies.prisma",
  },

  // Show Supabase actions when database is Supabase
  {
    filePath: "docs.util",
    sectionId: "section3",
    optionId: "option4",
    configPath: "questions.databaseProvider",
    matchValue: "supabase",
  },

  // Always include (user choice)
  {
    filePath: "ide",
    sectionId: "section1",
    optionId: "option1",
    configPath: null,
  },
];
```

#### Mapping Types

**Boolean Configuration Check**:

- `configPath`: Points to boolean config value
- `matchValue`: Omitted
- Result: Option included if config value is `true`

**Value Match Check**:

- `configPath`: Points to any config value
- `matchValue`: Specific value to match
- Result: Option included if config value equals matchValue

**Always Include**:

- `configPath`: `null`
- Result: Option always included (user chooses manually)

#### Example: util.md File

The `util.md` file demonstrates configuration-based filtering:

**Section 1 (Types)**:

- Option 1: Client-side types → shown when `databaseProvider === "none"`
- Option 2: Prisma types → shown when `technologies.prisma === true`

**Section 3 (Actions)**:

- Option 1: No actions → shown when `databaseProvider === "none"`
- Option 2: Better-Auth actions → shown when `technologies.betterAuth === true`
- Option 3: Supabase + Better-Auth → shown when `databaseProvider === "both"`
- Option 4: Supabase only → shown when `databaseProvider === "supabase"`

Users automatically see only the examples relevant to their stack.

### Section Content Management

The store provides methods for dynamic section manipulation:

```typescript
// Get section options for a file
getSectionOptions: (filePath: string, sectionId: string) => Record<string, SectionOption>

// Update section content
setSectionContent: (filePath: string, sectionId: string, optionId: string, content: string) => void

// Toggle section inclusion
setSectionInclude: (filePath: string, sectionId: string, optionId: string, include: boolean) => void
```

### Section Option Exclusion

Exclude options from the editor by prefixing with asterisk:

```markdown
<!-- option-1 -->

This option will be included.

<!-- /option-1 -->

<!-- *option-2 -->

This option will be excluded from the editor.

<!-- /*option-2 -->
```

## Placeholder System

### Placeholder Values

Use dynamic placeholders in markdown content:

```markdown
# {{appName:Your app name}} development roadmap

Welcome to {{projectType:your project}}!
```

### Placeholder Management

The store manages placeholder values:

```typescript
// Get placeholder value
getPlaceholderValue: (key: string) => string | null

// Set placeholder value
setPlaceholderValue: (key: string, value: string) => void

// Access in store
placeholderValues: Record<string, string>
```

## Component Reference System

### Embedding React Components

Use component markers to embed interactive components:

```markdown
<!-- component-InitialConfiguration -->
```

This creates a ComponentRef node:

```typescript
interface ComponentRef extends BaseNode {
  type: "component";
  componentId: string; // "InitialConfiguration"
}
```

### Component Processing

Components are:

- Detected during parsing
- Stored in file nodes' `components` array
- Added to flatIndex for lookup
- Rendered by the editor interface

## Navigation and URL Generation

### URL Generation Algorithm

URLs are generated from file paths:

1. Remove numeric prefixes (`1-Getting Started` → `Getting Started`)
2. Convert to lowercase
3. Replace spaces with hyphens
4. Remove special characters
5. Join path segments with `/`

```typescript
function generateUrlPath(relativePath: string): string {
  const parts = relativePath.split(path.sep);
  const cleanParts = parts.map((part) => {
    const orderMatch = part.match(/^(\d+)-(.+)$/);
    const cleanPart = orderMatch ? orderMatch[2] : part;
    return slugify(cleanPart.replace(/\*/g, "").replace(/\.md$/, ""));
  });
  return "/" + cleanParts.join("/");
}
```

### Page Navigation Tracking

The store tracks visited pages:

```typescript
// Mark page as visited
markPageVisited: (path: string) => void

// Check if page was visited
isPageVisited: (path: string) => boolean

// Get next unvisited page
getNextUnvisitedPage: (currentPath: string) => string | null
```

## Content Refresh and Synchronization

### Refresh Mechanisms

The editor provides multiple refresh methods:

```typescript
// Refresh markdown data from server
refreshMarkdownData: () => void

// Force complete refresh
forceRefresh: () => void

// Reset to latest data
resetToLatestData: () => void
```

### Version Synchronization

The store compares versions to detect updates:

```typescript
// Current store version vs. server version
if (state.storedContentVersion !== serverContentVersion) {
  // Trigger refresh
  refreshMarkdownData();
}
```

## Troubleshooting

**Section not showing**: Ensure the section file exists and follows naming convention
**Wrong order**: Check numeric prefixes are correct
**Content not updating**: Re-run the parser after changes
**File excluded**: Check for asterisk (\*) prefix in filename or parent directory
**Store data missing**: Check browser localStorage for `editor-storage` key
**Version mismatch**: Clear localStorage or run parser to update content version
**Component not rendering**: Verify component ID matches the registered components
**Placeholder not working**: Check placeholder syntax `{{key:defaultValue}}`
**Store migration failing**: Check store version and migration logic in layout.stores.ts
**Section option not filtering**: Check `lib/section-option-mappings.ts` for correct mapping
**Option always hidden**: Verify config value is correctly set in user configuration
**Filtering not automatic**: Check that `applyAutomaticSectionFiltering()` is called in InitialConfiguration component

## Related Documentation

- [Code File Generation Guide](./code-file-generation-guide.md) - Unified configuration architecture
- `lib/section-option-mappings.ts` - All section visibility mappings
- `lib/section-filter.utils.ts` - Automatic filtering implementation
- `lib/config-snapshot.ts` - Configuration snapshot interface
- `scripts/parse-markdown.ts` - Markdown parser implementation
- `app/(editor)/layout.stores.ts` - Store implementation with section methods
