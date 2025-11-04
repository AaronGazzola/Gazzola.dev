# Parsing System & App Integration

## Overview

This application uses two distinct parsing systems:

1. **Build-Time Markdown Parsing** - Processes markdown files and components into a navigation tree
2. **Runtime Code Generation** - Generates infrastructure code files on-demand in the browser

Both systems integrate seamlessly with navigation, editing, preview, and download features.

---

## Table of Contents

- [Parsing Scripts](#parsing-scripts)
- [Data Structures](#data-structures)
- [Navigation Integration](#navigation-integration)
- [Editor Integration](#editor-integration)
- [Preview Mode](#preview-mode)
- [Download Integration](#download-integration)
- [Store Integration](#store-integration)
- [Version Control](#version-control)
- [Key Concepts](#key-concepts)

---

## Parsing Scripts

### Markdown Parser (`scripts/parse-markdown.ts`)

**Purpose**: Processes markdown files and component files into a unified navigation tree with fast lookup.

**Input Sources**:
- `public/data/markdown/` - Markdown roadmap files (committed to repo)
- `public/data/components/ui/` - React component files (TSX)

**Output**: `public/data/processed-markdown.json`

**Process**:
1. Scan markdown directory → Build tree from file structure
2. Parse each markdown file → Extract content, sections, components
3. Add component files → Inject TSX files with `fileExtension: "tsx"`
4. Build flat index → Create O(1) lookup map by path
5. Output JSON → Write navigation tree + flat index

**Key Features**:
- Preserves directory hierarchy
- Assigns order property for sequencing
- Marks files for progressive disclosure
- Creates both tree (for traversal) and flat index (for lookup)

**Output Structure**:
```json
{
  "root": {
    "id": "root",
    "type": "directory",
    "children": [
      {
        "id": "start-here",
        "name": "Start_here",
        "displayName": "Start Here",
        "type": "directory",
        "order": 1,
        "path": "start-here",
        "urlPath": "/start-here",
        "children": [
          {
            "id": "tech-stack",
            "name": "Tech_Stack",
            "displayName": "Tech Stack",
            "type": "file",
            "order": 1,
            "path": "start-here.tech-stack",
            "urlPath": "/start-here/tech-stack",
            "content": "# Tech Stack\n...",
            "sections": {},
            "components": []
          }
        ]
      }
    ]
  },
  "flatIndex": {
    "start-here.tech-stack": { /* file node */ },
    "start-here.theme": { /* file node */ }
  },
  "contentVersion": 36
}
```

### Code Generator (`lib/code-generation.utils.ts`)

**Purpose**: Generates infrastructure files on-demand in the browser.

**Input Sources** (localStorage):
- `theme-storage` - Theme colors, typography, spacing
- `db-storage` - Database tables, RLS policies, auth plugins
- `editor-storage` - Technology selections, features

**Output**: Array of `ProcessedCodeFile` objects

**Generated Files**:

| Condition                    | Files                                         |
| ---------------------------- | --------------------------------------------- |
| Theme exists                 | `app/globals.css`                             |
| `technologies.betterAuth`    | `lib/auth.ts`, `lib/auth-client.ts`           |
| `technologies.prisma`        | `prisma/schema.prisma`, `lib/prisma-rls.ts`   |
| `technologies.supabase`      | `supabase/migrations/00000000000000_init.sql` |

**Process**:
1. Read from localStorage (browser API)
2. Execute template functions
3. Return array of code files with path + content

---

## Data Structures

### MarkdownData

```typescript
interface MarkdownData {
  root: DirectoryNode;
  flatIndex: Record<string, MarkdownNode>;
  contentVersion: number;
}
```

### DirectoryNode

```typescript
interface DirectoryNode {
  id: string;
  name: string;
  displayName: string;
  type: "directory";
  order?: number;
  path: string;
  urlPath: string;
  include: boolean;
  visibleAfterPage?: string;
  previewOnly?: boolean;
  includeInToolbar?: boolean;
  children: MarkdownNode[];
}
```

### FileNode

```typescript
interface FileNode {
  id: string;
  name: string;
  displayName: string;
  type: "file";
  order?: number;
  path: string;
  urlPath: string;
  include: boolean;
  fileExtension?: "tsx" | "preview" | undefined;
  previewOnly?: boolean;
  includeInToolbar?: boolean;
  content: string;
  sections: Record<string, Record<string, SectionOption>>;
  components: ComponentRef[];
}
```

### Section Structure

```typescript
sections: {
  "section-1": {
    "option-a": {
      content: "Content for option A",
      include: true
    },
    "option-b": {
      content: "Content for option B",
      include: false
    }
  }
}
```

---

## Navigation Integration

### Data Loading Flow

**File**: `app/(editor)/layout.actions.ts`

**Server Actions**:
- `getMarkdownDataAction()` - Loads `processed-markdown.json` from filesystem or fetch
- `getContentVersionAction()` - Loads version for cache invalidation

**Flow**:
```
processed-markdown.json
  → getMarkdownDataAction() (server action)
  → useGetMarkdownData() (React Query hook)
  → setMarkdownData() (Zustand store)
  → Components access via useEditorStore()
```

### Sidebar Component

**File**: `app/(components)/Sidebar.tsx`

**Key Function**: `generateNavigationFromMarkdownData(nodes: MarkdownNode[])`

**Process**:
1. Reads `data.root.children` from store
2. Filters directories/files based on:
   - `include !== false`
   - Progressive disclosure rules
   - Preview-only status
3. Recursively builds hierarchical navigation tree
4. Sorts by `order` property
5. Returns `NavigationItem[]` for rendering

**Navigation Item Structure**:
```typescript
interface NavigationItem {
  name: string;
  type: "directory" | "file";
  order: number;
  path: string;
  include: boolean;
  children?: NavigationItem[];
}
```

### Progressive Disclosure

**Implementation** (lines 136-194 in Sidebar.tsx):

```typescript
const isPageVisited = (path: string) => {
  return visitedPages.includes(path);
};

// For directories
if (item.visibleAfterPage && !isPageVisited(item.visibleAfterPage)) {
  return null; // Hide directory
}

// For files
if (node.visibleAfterPage && !isPageVisited(node.visibleAfterPage)) {
  return null; // Hide file
}
```

**Logic**:
- Items with `visibleAfterPage` are hidden until that page is visited
- Visited pages are tracked in `visitedPages` array in store
- Example: `components/` directory has `visibleAfterPage: "start-here.theme"`
  - Hidden until user visits the Theme page
  - Once visited, becomes visible permanently

### Flat Index Usage

**Purpose**: O(1) lookup of any node by path

**Usage Examples**:
```typescript
// Check if page is preview-only
const node = data.flatIndex[itemPath];
if (node?.previewOnly) { /* ... */ }

// Check visibility requirement
if (node?.visibleAfterPage) { /* ... */ }

// Get node include status
if (node?.include === false) { /* skip */ }
```

**Performance Benefit**:
- Tree traversal: O(n) to find a node
- Flat index lookup: O(1) to find a node
- Critical for progressive disclosure checks on every render

---

## Editor Integration

### URL to Content Path Mapping

**File**: `app/(editor)/[...segments]/page.tsx` (lines 129-161)

**Process**:
```typescript
// URL: /start-here/tech-stack
// segments: ["start-here", "tech-stack"]

// Build urlPath
const urlPath = "/" + segments.join("/");  // "/start-here/tech-stack"

// Find node by urlPath
const node = Object.values(flatIndex).find(
  node => node.urlPath === urlPath
);

// Extract internal path
const contentPath = node?.path;  // "start-here.tech-stack"
```

### Rendering Mode Determination

**File**: `app/(editor)/[...segments]/page.tsx`

**Logic** (lines 183-195):
```typescript
const currentNode = flatIndex[contentPath];

const isTsxFile = currentNode?.type === "file" &&
  currentNode.fileExtension === "tsx";

const isCodePreviewFile = currentNode?.type === "file" &&
  currentNode.fileExtension === "preview";
```

### Rendering Components

**1. TSX Files** (lines 397-417):
```typescript
if (isTsxFile) {
  return (
    <CodeViewer
      code={currentContent}
      language="tsx"
      darkMode={darkMode}
    />
  );
}
```

**2. Code Preview Files** (lines 419-441):
```typescript
if (isCodePreviewFile) {
  const language = getCodeLanguage(fileName);
  return (
    <CodeViewer
      code={currentContent}
      language={language}
      darkMode={darkMode}
    />
  );
}
```

**3. Markdown Files**:
- **Preview Mode** (lines 446-459):
  ```typescript
  if (previewMode || currentNode?.previewOnly) {
    return <ReadOnlyLexicalEditor content={processedContent} />;
  }
  ```
- **Edit Mode** (lines 461-493):
  ```typescript
  return (
    <LexicalEditor
      content={currentContent}
      onContentChange={handleContentChange}
      darkMode={darkMode}
    />
  );
  ```

### Language Detection

**Function**: `getCodeLanguage(fileName: string)` (lines 197-211)

```typescript
function getCodeLanguage(fileName: string): string {
  if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) {
    return "typescript";
  }
  if (fileName.endsWith(".css")) {
    return "css";
  }
  if (fileName.endsWith(".sql")) {
    return "sql";
  }
  if (fileName.endsWith(".prisma")) {
    return "typescript";  // Prisma uses TS-like syntax
  }
  return "typescript";
}
```

---

## Preview Mode

### Activation

**Toggle**: Sidebar preview icon or previewOnly flag

**Store Property**: `previewMode: boolean`

**File Behavior**:
- `previewOnly: true` → Always renders in preview (readonly)
- `previewOnly: false` + `previewMode: true` → Renders in preview (toggleable)

### Preview vs Edit Differences

| Feature            | Edit Mode                | Preview Mode              |
| ------------------ | ------------------------ | ------------------------- |
| Content editable   | Yes                      | No                        |
| Sections           | Show all options         | Show only included        |
| Placeholders       | Show as-is               | Show replaced values      |
| Components         | Show placeholders        | Show rendered components  |
| Toolbar            | Full edit toolbar        | Minimal toolbar           |

### Content Processing in Preview

**Function**: `processContent()` in `lib/download.utils.ts`

**Transformations**:
1. **Placeholder Replacement**:
   ```typescript
   // Input: "Project: {{projectName:MyApp}}"
   // Output: "Project: MyApp" (or custom value from store)
   ```

2. **Section Rendering**:
   ```typescript
   // Input: "<!-- section-1 -->"
   // Output: Content from included section options
   ```

3. **Component Rendering**:
   - `<!-- component-AppStructure -->` → ASCII app tree
   - `<!-- component-ThemeConfiguration -->` → Generated CSS
   - `<!-- component-InitialConfiguration -->` → Tech explanations

---

## Download Integration

### Complete Flow

**Trigger**: Download button in Sidebar (line 344)

**Function**: `generateAndDownloadZip()` in `lib/download.utils.ts` (lines 896-969)

**Process**:
```
1. Create JSZip instance
2. Process markdown tree (processNode recursively)
   ├─ Filter by include !== false
   ├─ For directories: Create ZIP folder, recurse
   └─ For files: Process content → Add to ZIP
3. Generate code files (generateCodeFiles)
   ├─ Read localStorage (theme, db, editor)
   ├─ Generate theme CSS
   ├─ Generate auth files
   ├─ Generate Prisma/Supabase files
   └─ Add to ZIP at specified paths
4. Generate ZIP blob
5. Trigger browser download
```

### Markdown Processing

**Function**: `processNode()` (lines 821-894)

**Logic**:
```typescript
function processNode(
  node: MarkdownNode,
  zip: JSZip,
  currentFolder: JSZip,
  ...
) {
  if (node.include === false) return;  // Skip excluded nodes

  if (node.type === "directory") {
    const folder = currentFolder.folder(node.displayName);
    node.children.forEach(child =>
      processNode(child, zip, folder, ...)
    );
  }

  if (node.type === "file") {
    // TSX files: Direct content
    if (node.fileExtension === "tsx") {
      currentFolder.file(fileName, node.content);
      return;
    }

    // Markdown files: Process content
    const processed = processContent(
      node.content,
      node.path,
      ...
    );
    currentFolder.file(fileName, processed);
  }
}
```

### Content Processing

**Function**: `processContent()` (lines 726-819)

**Transformations**:

**1. Placeholder Replacement** (lines 749-755):
```typescript
content = content.replace(
  /\{\{([^:]+):([^}]+)\}\}/g,
  (match, key, defaultValue) => {
    return getPlaceholderValue(key.trim()) || defaultValue.trim();
  }
);
```

**2. Section Rendering** (lines 757-770):
```typescript
content = content.replace(
  /<!-- section-(\d+) -->/g,
  (match, sectionId) => {
    const options = getSectionOptions(filePath, sectionId);
    return options
      .filter(opt => opt.include)
      .map(opt => opt.content)
      .join("\n\n");
  }
);
```

**3. Component Rendering** (lines 772-819):
```typescript
// App Structure Component
if (content.includes("<!-- component-AppStructure -->")) {
  const ascii = generateAppStructureAscii(appStructure);
  const routes = generateRouteMapAscii(appStructure);
  content = content.replace(
    "<!-- component-AppStructure -->",
    ascii + "\n\n" + routes
  );
}

// Theme Configuration Component
if (content.includes("<!-- component-ThemeConfiguration -->")) {
  const css = generateThemeCSS(theme);
  content = content.replace(
    "<!-- component-ThemeConfiguration -->",
    "```css\n" + css + "\n```"
  );
}

// Other components → Placeholder text
content = content.replace(
  /<!-- component-(\w+) -->/g,
  (match, componentId) => `[${componentId} Component]`
);
```

### Code File Generation

**Function**: `generateCodeFiles()` in `lib/code-generation.utils.ts`

**Process**:
```typescript
export function generateCodeFiles(): ProcessedCodeFile[] {
  const files: ProcessedCodeFile[] = [];

  // Read from localStorage
  const storage = getBrowserAPI(() => localStorage);
  const themeStore = JSON.parse(storage.getItem("theme-storage") || "{}");
  const dbStore = JSON.parse(storage.getItem("db-storage") || "{}");
  const editorStore = JSON.parse(storage.getItem("editor-storage") || "{}");

  // Extract data
  const theme = themeStore?.state?.theme;
  const plugins = dbStore?.state?.plugins || [];
  const tables = dbStore?.state?.tables || [];
  const rlsPolicies = dbStore?.state?.rlsPolicies || [];
  const initialConfig = editorStore?.state?.initialConfiguration;

  // Generate theme CSS
  if (theme) {
    files.push({
      id: "theme-css",
      path: "app/globals.css",
      content: generateThemeCSS(theme),
      type: "theme"
    });
  }

  // Generate auth files
  if (initialConfig?.technologies?.betterAuth && plugins.length > 0) {
    files.push({
      id: "auth",
      path: "lib/auth.ts",
      content: generateAuthFile(plugins, initialConfig),
      type: "auth"
    });
    files.push({
      id: "auth-client",
      path: "lib/auth-client.ts",
      content: generateAuthClientFile(plugins),
      type: "auth"
    });
  }

  // Generate Prisma files
  if (initialConfig?.technologies?.prisma && tables.length > 0) {
    files.push({
      id: "prisma-schema",
      path: "prisma/schema.prisma",
      content: generatePrismaSchemaContent(tables),
      type: "prisma"
    });
    files.push({
      id: "prisma-rls",
      path: "lib/prisma-rls.ts",
      content: generatePrismaRLSFile(),
      type: "prisma"
    });
  }

  // Generate Supabase migration
  if (initialConfig?.technologies?.supabase) {
    files.push({
      id: "supabase-migration",
      path: "supabase/migrations/00000000000000_init.sql",
      content: generateSupabaseMigration(rlsPolicies, tables, initialConfig),
      type: "supabase"
    });
  }

  return files;
}
```

### ZIP Structure

**Output**:
```
roadmap.zip/
├── Roadmap/                      # From markdown processing
│   ├── Start_Here/
│   │   ├── Tech_Stack.md
│   │   ├── Theme.md
│   │   ├── Layout_and_Routes.md
│   │   ├── Database.md
│   │   └── Next_Steps.md
│   ├── CLAUDE.md
│   ├── Util.md
│   └── README.md
├── components/                   # TSX components (if included)
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── app/                          # From code generation
│   └── globals.css
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   └── prisma-rls.ts
├── prisma/
│   └── schema.prisma
└── supabase/
    └── migrations/
        └── 00000000000000_init.sql
```

---

## Store Integration

### Zustand Store Structure

**File**: `app/(editor)/layout.stores.ts`

**State**:
```typescript
interface EditorState {
  // Markdown data
  version: number;
  data: MarkdownData;
  storedContentVersion?: number;

  // UI state
  darkMode: boolean;
  previewMode: boolean;
  refreshKey: number;

  // Navigation
  visitedPages: string[];

  // User configuration
  appStructure: FileSystemEntry[];
  placeholderValues: Record<string, string>;
  initialConfiguration: InitialConfigurationType;
  wireframeState: WireframeState;

  // Features & testing
  features: Feature[];
  testSuites: TestSuite[];

  // Actions
  setMarkdownData: (data: MarkdownData) => void;
  updateContent: (path: string, content: string) => void;
  getSectionOptions: (filePath: string, sectionId: string) => SectionOption[];
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean;
  isPageVisited: (path: string) => boolean;
  getPlaceholderValue: (key: string) => string | undefined;
  // ... many more
}
```

### Key Methods

**setMarkdownData** (line 824):
```typescript
setMarkdownData: (data) => {
  set({
    data,
    version: data.contentVersion,
    storedContentVersion: data.contentVersion
  });
}
```

**updateContent** (line 312):
```typescript
updateContent: (path, content) => {
  set((state) => {
    const node = state.data.flatIndex[path];
    if (node?.type === "file") {
      node.content = content;
    }
    return { data: { ...state.data } };
  });
}
```

**getSectionOptions** (line 360):
```typescript
getSectionOptions: (filePath, sectionId) => {
  const node = get().data.flatIndex[filePath];
  if (node?.type !== "file") return [];

  const section = node.sections[sectionId];
  if (!section) return [];

  return Object.entries(section).map(([id, opt]) => ({
    id,
    content: opt.content,
    include: opt.include
  }));
}
```

**isPageVisited** (line 342):
```typescript
isPageVisited: (path) => {
  return get().visitedPages.includes(path);
}
```

---

## Version Control

### Cache Invalidation System

**File**: `app/(editor)/layout.hooks.ts`

**Hook**: `useContentVersionCheck()` (lines 95-199)

**Process**:
```typescript
export function useContentVersionCheck() {
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      // 1. Fetch current version from server
      const response = await fetch("/data/content-version.json");
      const { version } = await response.json();

      // 2. Compare with stored version
      const storedVersion = useEditorStore.getState().storedContentVersion;

      // 3. If mismatch, invalidate cache
      if (version !== storedVersion) {
        // Reset store to defaults
        useEditorStore.getState().reset();

        // Invalidate React Query cache
        queryClient.invalidateQueries({ queryKey: ["markdown-data"] });

        // Fetch fresh data
        const freshData = await getMarkdownDataAction();
        useEditorStore.getState().setMarkdownData(freshData);

        // Update refresh key to trigger re-renders
        useEditorStore.getState().setRefreshKey(Date.now());
      }

      setCheckComplete(true);
    };

    // Check on mount
    checkVersion();

    // Poll every 30 seconds
    const interval = setInterval(checkVersion, 30000);

    return () => clearInterval(interval);
  }, []);

  return checkComplete;
}
```

**Version File Format** (`public/data/content-version.json`):
```json
{
  "version": 36,
  "timestamp": "2025-01-04T12:00:00Z"
}
```

### Initial Data Loading

**Hook**: `useInitializeMarkdownData()` (lines 54-93)

**Process**:
```typescript
export function useInitializeMarkdownData() {
  const data = useEditorStore((state) => state.data);
  const setMarkdownData = useEditorStore((state) => state.setMarkdownData);
  const versionCheckComplete = useContentVersionCheck();

  const { data: fetchedData } = useGetMarkdownData({
    enabled: versionCheckComplete && !data.root.children.length
  });

  useEffect(() => {
    if (fetchedData && !data.root.children.length) {
      setMarkdownData(fetchedData);
    }
  }, [fetchedData, data, setMarkdownData]);
}
```

**Flow**:
```
1. Wait for version check to complete
2. Check if store has empty/default data
3. If empty: Fetch from server
4. Update store with fresh data
5. Trigger component re-renders
```

---

## Key Concepts

### 1. Dual Data Structure (Tree + Flat Index)

**Why Both?**
- **Tree** (`root.children`) - For hierarchical traversal (sidebar, download)
- **Flat Index** (`flatIndex[path]`) - For O(1) lookups (navigation, editor)

**Example**:
```typescript
// Sidebar: Traverse tree
const buildNav = (nodes: MarkdownNode[]) => {
  return nodes.map(node => {
    if (node.type === "directory") {
      return {
        ...node,
        children: buildNav(node.children)
      };
    }
    return node;
  });
};

// Editor: Lookup by path
const node = flatIndex["start-here.tech-stack"];  // O(1)
```

### 2. Progressive Disclosure

**Mechanism**:
- Pages are added to `visitedPages` array when navigated to
- Items with `visibleAfterPage` check if that page is in `visitedPages`
- If not visited → Item is hidden from navigation
- If visited → Item becomes visible permanently (persisted to localStorage)

**Use Cases**:
- Unlock advanced sections after completing basics
- Show component examples after theme configuration
- Reveal generated code after finishing setup

### 3. File Extension Rendering

**Mapping**:
| Extension   | Component             | Mode        |
| ----------- | --------------------- | ----------- |
| `undefined` | LexicalEditor         | Editable    |
| `"tsx"`     | CodeViewer            | Read-only   |
| `"preview"` | CodeViewer            | Read-only   |

**Purpose**:
- Markdown files are editable
- Component examples (TSX) are viewable but not editable
- Generated code files use "preview" for syntax highlighting

### 4. Preview-Only Pages

**Properties**:
- `previewOnly: true` → Always renders in preview mode
- `includeInToolbar: false` → Hidden from numbered page sequence
- Used for reference documentation that shouldn't be edited

**Example**: Component reference pages, generated code examples

### 5. Content Transformation Pipeline

**Stages**:
```
Raw markdown
  ↓ (Placeholder replacement)
Content with values
  ↓ (Section rendering)
Content with selected sections
  ↓ (Component rendering)
Final processed content
```

**Context**:
- **Editor**: No transformation (shows raw markdown)
- **Preview**: Full transformation (shows final output)
- **Download**: Full transformation (includes in ZIP)

### 6. Serverless-Compatible Architecture

**Design Decisions**:
- **Build time**: Parse markdown (static files)
- **Runtime**: Generate code (browser localStorage)
- **No server needed**: All dynamic generation client-side

**Benefits**:
- Works on Vercel/Netlify/CloudFlare Pages
- No database required
- No cold starts
- Always in sync with user config

---

## Build Process

### Development

```bash
# Parse markdown
npm run parse:markdown

# Start dev server
npm run dev
```

### Production

```bash
# Parse + build
npm run build
```

**Build Script** (`package.json`):
```json
{
  "scripts": {
    "build": "npm run parse && next build",
    "parse": "npm run parse:markdown",
    "parse:markdown": "npx tsx scripts/parse-markdown.ts"
  }
}
```

**What Happens**:
1. `parse-markdown.ts` runs → Generates `processed-markdown.json`
2. `next build` runs → Bundles app with parsed data
3. Code generation happens at runtime (not at build time)

---

## Troubleshooting

### Navigation Not Updating

**Check**:
1. Is `processed-markdown.json` present in `public/data/`?
2. Run `npm run parse:markdown` to regenerate
3. Check `contentVersion` in JSON matches store
4. Clear browser localStorage and refresh

### Code Files Not in Download

**Check**:
1. Is configuration in localStorage? (Open DevTools → Application → Local Storage)
2. Check browser console for generation errors
3. Verify `generateCodeFiles()` returns files (add console.log)
4. Unzip download and inspect contents

### Page Not Appearing in Sidebar

**Check**:
1. Is `include: false` in the node? (Check flatIndex)
2. Does it have `visibleAfterPage` set? Has that page been visited?
3. Is it marked `previewOnly`? (Won't appear in main nav)
4. Check `visitedPages` array in store

### Preview Mode Not Working

**Check**:
1. Is `previewMode: true` in store?
2. Does file have `previewOnly: true`?
3. Are sections configured with `include` flags?
4. Check `processContent()` for transformation errors

---

## Summary

The parsing system provides:

1. **Build-Time Parsing**: Markdown + components → Navigation tree + flat index
2. **Runtime Generation**: User config → Code files
3. **Dual Lookup**: Tree for traversal, flat index for O(1) access
4. **Progressive Disclosure**: Content unlocks as user progresses
5. **Flexible Rendering**: Markdown editor, code viewer, or preview mode
6. **Complete Download**: Processed markdown + generated code in ZIP
7. **Version Control**: Cache invalidation for content updates
8. **Serverless Ready**: Client-side generation, no backend needed

**Data Flow**:
```
Build: scripts/parse-markdown.ts → processed-markdown.json
Runtime: JSON → Store → Navigation/Editor/Preview/Download
Generation: localStorage → generateCodeFiles() → ZIP
```

This architecture enables a fully functional coding roadmap generator that works on any serverless platform with zero server-side dependencies.
