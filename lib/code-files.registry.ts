import type {
  Plugin,
  PrismaTable,
  RLSPolicy,
  RLSRolePolicy,
} from "@/app/(components)/DatabaseConfiguration.types";
import type { ThemeConfiguration } from "@/app/(components)/ThemeConfiguration.types";
import type {
  CodeFileNode,
  InitialConfigurationType,
} from "@/app/(editor)/layout.types";
import { componentFileContents } from "./component-files.generated";

export interface CodeFileRegistry {
  globals_css: (theme: ThemeConfiguration) => string;
  auth_ts: (plugins: Plugin[]) => string;
  auth_client_ts: (plugins: Plugin[]) => string;
  prisma_schema: (tables: PrismaTable[]) => string;
  prisma_rls_ts: (rlsPolicies: RLSPolicy[], tables: PrismaTable[]) => string;
  supabase_migration_sql: (
    rlsPolicies: RLSPolicy[],
    tables: PrismaTable[]
  ) => string;
  log_utils_ts: () => string;
  prisma_rls_client_ts: () => string;
  auth_util_ts: () => string;
}

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

const generateAuthFile = (plugins: Plugin[]): string => {
  const enabledPlugins = plugins.filter((p) => p.enabled && p.file === "auth");

  if (enabledPlugins.length === 0) {
    return `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});`;
  }

  const pluginImports = enabledPlugins
    .map((p) => getPluginImportStatement(p.name))
    .join("\n");
  const pluginConfigs = enabledPlugins
    .map((p) => getPluginConfig(p.name))
    .join(",\n    ");

  return `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
${pluginImports}

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    ${pluginConfigs}
  ],
});`;
};

const generateAuthClientFile = (plugins: Plugin[]): string => {
  const enabledPlugins = plugins.filter(
    (p) => p.enabled && p.file === "auth-client"
  );

  if (enabledPlugins.length === 0) {
    return `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});`;
  }

  const pluginImports = enabledPlugins
    .map((p) => getPluginImportStatement(p.name))
    .join("\n");
  const pluginConfigs = enabledPlugins
    .map((p) => getPluginConfig(p.name))
    .join(",\n    ");

  return `import { createAuthClient } from "better-auth/react";
${pluginImports}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    ${pluginConfigs}
  ],
});`;
};

const generatePrismaSchema = (tables: PrismaTable[]): string => {
  const generateColumn = (col: (typeof tables)[0]["columns"][0]) => {
    const parts: string[] = [col.name, col.type];
    if (col.isArray) parts[1] += "[]";
    if (col.isOptional) parts[1] += "?";
    if (col.attributes.length > 0)
      parts.push(...col.attributes.map((a) => `@${a}`));
    return `  ${parts.join(" ")}`;
  };

  const generateTable = (table: PrismaTable) => {
    const columns = table.columns.map(generateColumn).join("\n");
    const uniqueConstraints = table.uniqueConstraints
      .map((uc) => `  @@unique([${uc.join(", ")}])`)
      .join("\n");

    return `model ${table.name} {
${columns}${uniqueConstraints ? "\n" + uniqueConstraints : ""}
  @@schema("${table.schema}")
}`;
  };

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "public"]
}

${tables.map(generateTable).join("\n\n")}`;
};

const generatePrismaRLSFile = (
  rlsPolicies: RLSPolicy[],
  tables: PrismaTable[]
): string => {
  const policyGroups = rlsPolicies.reduce(
    (acc, policy) => {
      const table = tables.find((t) => t.id === policy.tableId);
      if (!table) return acc;

      if (!acc[table.name]) {
        acc[table.name] = [];
      }
      acc[table.name].push(policy);
      return acc;
    },
    {} as Record<string, RLSPolicy[]>
  );

  const generateUsingClause = (
    rolePolicy: RLSRolePolicy,
    tableName: string
  ): string => {
    switch (rolePolicy.accessType) {
      case "global":
        return "true";
      case "own":
        return "auth.uid() = user_id";
      case "organization":
        return "organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())";
      case "related":
        if (rolePolicy.relatedTable) {
          return `id IN (SELECT ${tableName}_id FROM ${rolePolicy.relatedTable} WHERE user_id = auth.uid())`;
        }
        return "true";
      default:
        return "true";
    }
  };

  const policyFunctions = Object.entries(policyGroups)
    .map(([tableName, policies]) => {
      const policyChecks = policies
        .flatMap((p) =>
          p.rolePolicies.map((rolePolicy) => {
            const usingClause = generateUsingClause(rolePolicy, tableName);
            return `    {
      operation: "${p.operation}",
      role: "${rolePolicy.role}",
      using: \`${usingClause}\`
    }`;
          })
        )
        .join(",\n");

      return `export const ${tableName}RLS = {
  policies: [
${policyChecks}
  ],
};`;
    })
    .join("\n\n");

  return `export type RLSOperation = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";

export interface RLSPolicy {
  operation: RLSOperation;
  role: string;
  using: string;
}

${policyFunctions}`;
};

const generateSupabaseMigration = (
  rlsPolicies: RLSPolicy[],
  tables: PrismaTable[]
): string => {
  const timestamp = Date.now();
  const policyGroups = rlsPolicies.reduce(
    (acc, policy) => {
      const table = tables.find((t) => t.id === policy.tableId);
      if (!table) return acc;

      if (!acc[table.name]) {
        acc[table.name] = [];
      }
      acc[table.name].push(policy);
      return acc;
    },
    {} as Record<string, RLSPolicy[]>
  );

  const generateUsingClause = (
    rolePolicy: RLSRolePolicy,
    tableName: string
  ): string => {
    switch (rolePolicy.accessType) {
      case "global":
        return "true";
      case "own":
        return "auth.uid() = user_id";
      case "organization":
        return "organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())";
      case "related":
        if (rolePolicy.relatedTable) {
          return `id IN (SELECT ${tableName}_id FROM ${rolePolicy.relatedTable} WHERE user_id = auth.uid())`;
        }
        return "true";
      default:
        return "true";
    }
  };

  const enableRLS = Object.keys(policyGroups)
    .map(
      (tableName) =>
        `ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY;`
    )
    .join("\n");

  const createPolicies = Object.entries(policyGroups)
    .flatMap(([tableName, policies]) =>
      policies.flatMap((policy) =>
        policy.rolePolicies.map((rolePolicy) => {
          const policyName = `${tableName}_${policy.operation.toLowerCase()}_${rolePolicy.role}`;
          const usingClause = generateUsingClause(rolePolicy, tableName);
          return `CREATE POLICY "${policyName}" ON public."${tableName}"
  FOR ${policy.operation}
  TO ${rolePolicy.role}
  USING (${usingClause});`;
        })
      )
    )
    .join("\n\n");

  return `-- Migration: ${timestamp}_rls_policies.sql
-- Enable RLS on tables
${enableRLS}

-- Create RLS policies
${createPolicies}`;
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

const generatePrismaRLSClient = (): string => {
  return `import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

function forUser(userId: string, tenantId?: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            if (tenantId) {
              const [, , result] = await prisma.$transaction([
                prisma.$executeRaw\\\`SELECT set_config('app.current_user_id', \${userId}, TRUE)\\\`,
                prisma.$executeRaw\\\`SELECT set_config('app.current_tenant_id', \${tenantId}, TRUE)\\\`,
                query(args),
              ]);
              return result;
            } else {
              const [, result] = await prisma.$transaction([
                prisma.$executeRaw\\\`SELECT set_config('app.current_user_id', \${userId}, TRUE)\\\`,
                query(args),
              ]);
              return result;
            }
          },
        },
      },
    })
  );
}

export function createRLSClient(userId: string, tenantId?: string) {
  return prisma.$extends(forUser(userId, tenantId));
}`;
};

const generateAuthUtil = (): string => {
  return `import { User } from "better-auth";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { auth, Session } from "./auth";
import { createRLSClient } from "./prisma-rls";

export async function getAuthenticatedClient(user?: User): Promise<{
  db: ReturnType<typeof createRLSClient>;
  session: Session | null;
}> {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userId = user?.id || session?.user.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = createRLSClient(userId);

  return { db, session };
}

export function generateSupabaseJWT(userId: string, userRole: string): string {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is required for JWT generation");
  }

  const payload = {
    aud: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    sub: userId,
    email: \\\`\${userId}@better-auth.local\\\`,
    role: "authenticated",
    user_metadata: {
      better_auth_user_id: userId,
      better_auth_role: userRole,
    },
    app_metadata: {
      provider: "better-auth",
      providers: ["better-auth"],
    },
  };

  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
  });
}`;
};

export const codeFileGenerators: CodeFileRegistry = {
  globals_css: generateThemeCSS,
  auth_ts: generateAuthFile,
  auth_client_ts: generateAuthClientFile,
  prisma_schema: generatePrismaSchema,
  prisma_rls_ts: generatePrismaRLSFile,
  supabase_migration_sql: generateSupabaseMigration,
  log_utils_ts: generateLogUtils,
  prisma_rls_client_ts: generatePrismaRLSClient,
  auth_util_ts: generateAuthUtil,
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
      visibleAfterPage: "next-steps",
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
  plugins: Plugin[],
  tables: PrismaTable[],
  rlsPolicies: RLSPolicy[],
  isPageVisited?: (path: string) => boolean
): CodeFileNode[] => {
  const nodes: CodeFileNode[] = [];
  const shouldShowCodeFiles = isPageVisited?.("next-steps") ?? false;

  const isBetterAuthEnabled = initialConfig.technologies.betterAuth;
  const isSupabaseOnly =
    initialConfig.questions.databaseProvider === "supabase";

  if (isBetterAuthEnabled && !isSupabaseOnly) {
    nodes.push({
      id: "code-file-auth-ts",
      name: "auth.ts",
      displayName: "auth.ts",
      type: "code-file",
      path: "lib.auth",
      urlPath: "/lib/auth",
      include:
        shouldShowCodeFiles &&
        initialConfig.technologies.betterAuth &&
        initialConfig.questions.databaseProvider !== "supabase",
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.auth_ts(plugins),
      includeCondition: () =>
        shouldShowCodeFiles &&
        initialConfig.technologies.betterAuth &&
        initialConfig.questions.databaseProvider !== "supabase",
      visibleAfterPage: "next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });

    nodes.push({
      id: "code-file-auth-client-ts",
      name: "auth-client.ts",
      displayName: "auth-client.ts",
      type: "code-file",
      path: "lib.auth-client",
      urlPath: "/lib/auth-client",
      include:
        shouldShowCodeFiles &&
        initialConfig.technologies.betterAuth &&
        initialConfig.questions.databaseProvider !== "supabase",
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.auth_client_ts(plugins),
      includeCondition: () =>
        shouldShowCodeFiles &&
        initialConfig.technologies.betterAuth &&
        initialConfig.questions.databaseProvider !== "supabase",
      visibleAfterPage: "next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });
  }

  nodes.push({
    id: "code-file-log-utils-ts",
    name: "log.utils.ts",
    displayName: "log.utils.ts",
    type: "code-file",
    path: "lib.log-utils",
    urlPath: "/lib/log-utils",
    include: shouldShowCodeFiles,
    fileExtension: "ts",
    language: "typescript",
    content: () => codeFileGenerators.log_utils_ts(),
    includeCondition: () => shouldShowCodeFiles,
    visibleAfterPage: "start-here.next-steps",
    parentPath: "lib",
    downloadPath: "lib",
    previewOnly: true,
  });

  const hasPrisma = initialConfig.technologies.prisma;

  const hasRLS = rlsPolicies.length > 0;
  if (hasPrisma && !isSupabaseOnly) {
    nodes.push({
      id: "code-file-prisma-rls-ts",
      name: "prisma-rls.ts",
      displayName: "prisma-rls.ts",
      type: "code-file",
      path: "lib.prisma-rls",
      urlPath: "/lib/prisma-rls",
      include:
        shouldShowCodeFiles &&
        initialConfig.technologies.prisma &&
        rlsPolicies.length > 0,
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.prisma_rls_ts(rlsPolicies, tables),
      includeCondition: () =>
        shouldShowCodeFiles &&
        initialConfig.technologies.prisma &&
        rlsPolicies.length > 0,
      visibleAfterPage: "next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });
  }

  if (hasPrisma && isBetterAuthEnabled) {
    nodes.push({
      id: "code-file-auth-util-ts",
      name: "auth.util.ts",
      displayName: "auth.util.ts",
      type: "code-file",
      path: "lib.auth-util",
      urlPath: "/lib/auth-util",
      include:
        shouldShowCodeFiles &&
        initialConfig.technologies.prisma &&
        initialConfig.technologies.betterAuth,
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.auth_util_ts(),
      includeCondition: () =>
        shouldShowCodeFiles &&
        initialConfig.technologies.prisma &&
        initialConfig.technologies.betterAuth,
      visibleAfterPage: "next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });
  }

  const componentNodes = createComponentFileNodes(shouldShowCodeFiles);

  return [
    ...nodes.filter((node) => node.includeCondition()),
    ...componentNodes,
  ];
};
