import type { IDEType } from "@/app/(components)/IDESelection.types";
import type { ThemeConfiguration } from "@/app/(components)/ThemeConfiguration.types";
import type { PrismaTable, RLSPolicy } from "@/app/(components)/DatabaseConfiguration.types";
import type {
  CodeFileNode,
  InitialConfigurationType,
} from "@/app/(editor)/layout.types";
import { componentFileContents } from "./component-files.generated";

export interface CodeFileRegistry {
  globals_css: (theme: ThemeConfiguration) => string;
  log_utils_ts: () => string;
  robots_file: () => string;
}

export const IDE_ROBOTS_FILES: Record<
  IDEType,
  { fileName: string; fileExtension: string }
> = {
  claudecode: { fileName: "CLAUDE", fileExtension: "md" },
  cursor: { fileName: ".cursorrules", fileExtension: "cursorrules" },
  windsurf: { fileName: ".windsurfrules", fileExtension: "windsurfrules" },
};

const generateThemeCSS = (theme: ThemeConfiguration): string => {
  const { colors, typography, other } = theme;

  const formatShadow = (shadow: typeof other.light.shadow) => {
    return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${shadow.color} / ${shadow.opacity}`;
  };

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: ${colors.light.primary};
    --primary-foreground: ${colors.light.primaryForeground};
    --secondary: ${colors.light.secondary};
    --secondary-foreground: ${colors.light.secondaryForeground};
    --accent: ${colors.light.accent};
    --accent-foreground: ${colors.light.accentForeground};
    --background: ${colors.light.background};
    --foreground: ${colors.light.foreground};
    --card: ${colors.light.card};
    --card-foreground: ${colors.light.cardForeground};
    --popover: ${colors.light.popover};
    --popover-foreground: ${colors.light.popoverForeground};
    --muted: ${colors.light.muted};
    --muted-foreground: ${colors.light.mutedForeground};
    --destructive: ${colors.light.destructive};
    --destructive-foreground: ${colors.light.destructiveForeground};
    --border: ${colors.light.border};
    --input: ${colors.light.input};
    --ring: ${colors.light.ring};
    --chart-1: ${colors.light.chart1};
    --chart-2: ${colors.light.chart2};
    --chart-3: ${colors.light.chart3};
    --chart-4: ${colors.light.chart4};
    --chart-5: ${colors.light.chart5};
    --sidebar: ${colors.light.sidebarBackground};
    --sidebar-foreground: ${colors.light.sidebarForeground};
    --sidebar-primary: ${colors.light.sidebarPrimary};
    --sidebar-primary-foreground: ${colors.light.sidebarPrimaryForeground};
    --sidebar-accent: ${colors.light.sidebarAccent};
    --sidebar-accent-foreground: ${colors.light.sidebarAccentForeground};
    --sidebar-border: ${colors.light.sidebarBorder};
    --sidebar-ring: ${colors.light.sidebarRing};

    --font-sans: ${typography.light.fontSans};
    --font-serif: ${typography.light.fontSerif};
    --font-mono: ${typography.light.fontMono};
    --letter-spacing: ${typography.light.letterSpacing}px;

    --radius: ${other.light.radius}rem;
    --spacing: ${other.light.spacing}rem;
    --shadow: ${formatShadow(other.light.shadow)};
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  }

  .dark {
    --primary: ${colors.dark.primary};
    --primary-foreground: ${colors.dark.primaryForeground};
    --secondary: ${colors.dark.secondary};
    --secondary-foreground: ${colors.dark.secondaryForeground};
    --accent: ${colors.dark.accent};
    --accent-foreground: ${colors.dark.accentForeground};
    --background: ${colors.dark.background};
    --foreground: ${colors.dark.foreground};
    --card: ${colors.dark.card};
    --card-foreground: ${colors.dark.cardForeground};
    --popover: ${colors.dark.popover};
    --popover-foreground: ${colors.dark.popoverForeground};
    --muted: ${colors.dark.muted};
    --muted-foreground: ${colors.dark.mutedForeground};
    --destructive: ${colors.dark.destructive};
    --destructive-foreground: ${colors.dark.destructiveForeground};
    --border: ${colors.dark.border};
    --input: ${colors.dark.input};
    --ring: ${colors.dark.ring};
    --chart-1: ${colors.dark.chart1};
    --chart-2: ${colors.dark.chart2};
    --chart-3: ${colors.dark.chart3};
    --chart-4: ${colors.dark.chart4};
    --chart-5: ${colors.dark.chart5};
    --sidebar: ${colors.dark.sidebarBackground};
    --sidebar-foreground: ${colors.dark.sidebarForeground};
    --sidebar-primary: ${colors.dark.sidebarPrimary};
    --sidebar-primary-foreground: ${colors.dark.sidebarPrimaryForeground};
    --sidebar-accent: ${colors.dark.sidebarAccent};
    --sidebar-accent-foreground: ${colors.dark.sidebarAccentForeground};
    --sidebar-border: ${colors.dark.sidebarBorder};
    --sidebar-ring: ${colors.dark.sidebarRing};

    --font-sans: ${typography.dark.fontSans};
    --font-serif: ${typography.dark.fontSerif};
    --font-mono: ${typography.dark.fontMono};
    --letter-spacing: ${typography.dark.letterSpacing}px;

    --radius: ${other.dark.radius}rem;
    --spacing: ${other.dark.spacing}rem;
    --shadow: ${formatShadow(other.dark.shadow)};
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    letter-spacing: var(--letter-spacing);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

.radius {
  border-radius: var(--radius);
}

.shadow {
  box-shadow: var(--shadow);
}

.tracking {
  letter-spacing: var(--letter-spacing);
}

.font-sans {
  font-family: var(--font-sans);
}

.font-serif {
  font-family: var(--font-serif);
}

.font-mono {
  font-family: var(--font-mono);
}

[data-state="checked"].data-checked-bg-primary {
  background-color: var(--primary);
}

[data-state="checked"].data-checked-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-state="unchecked"].data-unchecked-bg-input {
  background-color: var(--input);
}

.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
}

[data-selected-single="true"].data-selected-single-bg-primary {
  background-color: var(--primary);
}

[data-selected-single="true"].data-selected-single-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-start="true"].data-range-start-bg-primary {
  background-color: var(--primary);
}

[data-range-start="true"].data-range-start-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-end="true"].data-range-end-bg-primary {
  background-color: var(--primary);
}

[data-range-end="true"].data-range-end-text-primary-foreground {
  color: var(--primary-foreground);
}

[data-range-middle="true"].data-range-middle-bg-accent {
  background-color: var(--accent);
}

[data-range-middle="true"].data-range-middle-text-accent-foreground {
  color: var(--accent-foreground);
}

.focus-border-ring:focus-visible {
  border-color: var(--ring);
}

.focus-ring-color:focus-visible {
  --tw-ring-color: var(--ring);
}`;
};

const getPluginImportStatement = (pluginName: string): string => {
  return `import { ${pluginName} } from "better-auth/plugins";`;
};

const getPluginConfig = (pluginName: string): string => {
  return `${pluginName}()`;
};

const generateLogUtils = (): string => {
  return `export enum LOG_LABELS {
  GENERATE = "generate",
  API = "api",
  AUTH = "auth",
  DB = "db",
  FETCH = "fetch",
  RATE_LIMIT = "rate-limit",
  IMAGE = "image",
  WIDGET = "widget",
}

interface ConditionalLogOptions {
  maxStringLength?: number;
  label: LOG_LABELS | string;
}

export function conditionalLog(
  data: unknown,
  options: ConditionalLogOptions
): string | null {
  const { maxStringLength = 200, label } = options;

  const logLabels = process.env.NEXT_PUBLIC_LOG_LABELS;

  if (!logLabels || logLabels === "none") {
    return null;
  }

  if (logLabels !== "all") {
    const allowedLabels = logLabels.split(",").map((l) => l.trim());
    if (!allowedLabels.includes(label)) {
      return null;
    }
  }

  try {
    const processedData = deepStringify(data, maxStringLength, new WeakSet());
    const result = JSON.stringify(processedData);
    return result.replace(/\\s+/g, "");
  } catch (error) {
    return JSON.stringify({ error: "Failed to stringify data", label });
  }
}

function deepStringify(
  value: unknown,
  maxLength: number,
  seen: WeakSet<object>
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateString(value, maxLength);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncateString(value.message, maxLength),
      stack: value.stack ? truncateString(value.stack, maxLength) : undefined,
    };
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular Reference]";
    }

    seen.add(value);

    if (Array.isArray(value)) {
      const result = value.map((item) => deepStringify(item, maxLength, seen));
      seen.delete(value);
      return result;
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deepStringify(val, maxLength, seen);
    }
    seen.delete(value);
    return result;
  }

  return String(value);
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  const startLength = Math.floor((maxLength - 3) / 2);
  const endLength = maxLength - 3 - startLength;

  return str.slice(0, startLength) + "..." + str.slice(-endLength);
}`;
};

const generateRobotsFile = (): string => {
  return `# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Core Technologies

- **Vite 5** with React Router
- **TypeScript** for type safety
- **TailwindCSS & Shadcn** for styling
- **Jest & Playwright** for testing
- **Supabase** for database and authentication _(remote DB only)_

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatenate classes.
- Always use \\\`@/lib/env.utils\\\` for environment variables and browser APIs to ensure unit test compatibility.

# File Organization and Naming Conventions

- Types and store files alongside ancestor files
- Actions and hooks files alongside descendent files

\\\`\\\`\\\`txt
src/
├── components/
│   ├── Component.tsx
│   └── Component.types.ts
├── pages/
│   ├── Page.tsx
│   ├── Page.hooks.tsx
│   └── Page.types.ts
├── hooks/
│   └── useFeature.tsx
└── lib/
    ├── utils.ts
    └── log.utils.ts

    key:
    ◄─── = defined
    ───► = imported
\\\`\\\`\\\`

# Hook, action, store and type patterns

DB <-> Supabase Client <-> hook <-> store

- Supabase client queries are called directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store (if applicable).
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from \\\`@/integrations/supabase/types\\\`.

## Example of file patterns - [\\\`util.md\\\`](util.md)

Follow the examples outlined in [\\\`util.md\\\`](util.md) when working on hook, store or type files.

# Testing

All tests should be performed with Jest or Playwright and documented in the \\\`Tests.md\\\` document

## Test rules:

- The test should find elements in the DOM via data-attributes. Add corresponding data-attributes to the elements in the components. Import the data-attribute values from an enum exported from \\\`@/test.types.ts\\\`
- Do not use wait in the tests. Only use timeouts.

# Testing

All tests should be performed with Playwright and documented in the \\\`Tests.md\\\` document. For complete testing instructions, patterns, and documentation format, refer to [\\\`docs/Testing.md\\\`](docs/Testing.md).

# Environment Variables and Browser APIs

All environment variable access and browser API usage must use the centralized utilities from \\\`@/lib/env.utils\\\`:

\\\`\\\`\\\`typescript
import { ENV, getBrowserAPI } from "@/lib/env.utils";

const apiUrl = ENV.SUPABASE_URL;
const storage = getBrowserAPI(() => localStorage);
\\\`\\\`\\\`

This ensures universal compatibility between browser and Node.js test environments with zero performance overhead.

# Console.logging

All logging should be performed using the \\\`conditionalLog\\\` function exported from \\\`lib/log.utils.ts\\\`
The \\\`VITE_LOG_LABELS\\\` variable in \\\`.env.local\\\` stores a comma separated string of log labels. Logs are returned if \\\`VITE_LOG_LABELS="all"\\\`, or if \\\`VITE_LOG_LABELS\\\` includes the label arg in \\\`conditionalLog\\\`.
`;
};

export const codeFileGenerators: CodeFileRegistry = {
  globals_css: generateThemeCSS,
  log_utils_ts: generateLogUtils,
  robots_file: generateRobotsFile,
};

const createComponentFileNodes = (
  shouldShowCodeFiles: boolean
): CodeFileNode[] => {
  const nodes: CodeFileNode[] = [];

  Object.entries(componentFileContents).forEach(([componentName, content]) => {
    const fileName = `${componentName}.tsx`;

    nodes.push({
      id: `code-file-component-${componentName}`,
      name: fileName,
      displayName: fileName,
      type: "code-file",
      path: `ui.${componentName}`,
      urlPath: `/ui/${componentName}`,
      include: shouldShowCodeFiles,
      fileExtension: "tsx",
      language: "typescript",
      content: () => content,
      includeCondition: () => shouldShowCodeFiles,
      visibleAfterPage: "robots",
      parentPath: "components.ui",
      downloadPath: "components/ui",
      previewOnly: true,
    });
  });

  return nodes;
};

export const createCodeFileNodes = (
  initialConfig: InitialConfigurationType,
  theme: ThemeConfiguration,
  tables: PrismaTable[],
  rlsPolicies: RLSPolicy[],
  isPageVisited?: (path: string) => boolean
): CodeFileNode[] => {
  const { getSectionInclude } =
    require("@/app/(editor)/layout.stores").useEditorStore.getState();
  const { getCodeFiles } = require("./code-file-generator");

  const newSystemFiles = getCodeFiles(
    initialConfig,
    theme,
    tables,
    rlsPolicies,
    isPageVisited,
    getSectionInclude
  );

  const shouldShowCodeFiles = isPageVisited?.("readme") ?? false;
  const componentNodes = createComponentFileNodes(shouldShowCodeFiles);

  return [...newSystemFiles, ...componentNodes];
};
