import type { CodeFileNode, InitialConfigurationType } from "@/app/(editor)/layout.types";
import type { ThemeConfiguration } from "@/app/(components)/ThemeConfiguration.types";
import type { PrismaTable, RLSPolicy, Plugin } from "@/app/(components)/DatabaseConfiguration.types";
import { componentFileContents } from "./component-files.generated";

export interface CodeFileRegistry {
  globals_css: (theme: ThemeConfiguration) => string;
  auth_ts: (plugins: Plugin[]) => string;
  auth_client_ts: (plugins: Plugin[]) => string;
  prisma_schema: (tables: PrismaTable[]) => string;
  prisma_rls_ts: (rlsPolicies: RLSPolicy[], tables: PrismaTable[]) => string;
  supabase_migration_sql: (rlsPolicies: RLSPolicy[], tables: PrismaTable[]) => string;
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
    --sidebar-background: ${colors.light.sidebarBackground};
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
    --sidebar-background: ${colors.dark.sidebarBackground};
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
}`;
};

const getPluginImportStatement = (pluginName: string): string => {
  return `import { ${pluginName} } from "better-auth/plugins";`;
};

const getPluginConfig = (pluginName: string): string => {
  return `${pluginName}()`;
};

const generateAuthFile = (plugins: Plugin[]): string => {
  const enabledPlugins = plugins.filter(p => p.enabled && p.file === "auth");

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

  const pluginImports = enabledPlugins.map(p => getPluginImportStatement(p.name)).join('\n');
  const pluginConfigs = enabledPlugins.map(p => getPluginConfig(p.name)).join(',\n    ');

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
  const enabledPlugins = plugins.filter(p => p.enabled && p.file === "auth-client");

  if (enabledPlugins.length === 0) {
    return `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});`;
  }

  const pluginImports = enabledPlugins.map(p => getPluginImportStatement(p.name)).join('\n');
  const pluginConfigs = enabledPlugins.map(p => getPluginConfig(p.name)).join(',\n    ');

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
  const generateColumn = (col: typeof tables[0]["columns"][0]) => {
    const parts: string[] = [col.name, col.type];
    if (col.isArray) parts[1] += "[]";
    if (col.isOptional) parts[1] += "?";
    if (col.attributes.length > 0) parts.push(...col.attributes.map(a => `@${a}`));
    return `  ${parts.join(" ")}`;
  };

  const generateTable = (table: PrismaTable) => {
    const columns = table.columns.map(generateColumn).join('\n');
    const uniqueConstraints = table.uniqueConstraints.map(
      uc => `  @@unique([${uc.join(", ")}])`
    ).join('\n');

    return `model ${table.name} {
${columns}${uniqueConstraints ? '\n' + uniqueConstraints : ''}
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

${tables.map(generateTable).join('\n\n')}`;
};

const generatePrismaRLSFile = (rlsPolicies: RLSPolicy[], tables: PrismaTable[]): string => {
  const policyGroups = rlsPolicies.reduce((acc, policy) => {
    const table = tables.find(t => t.id === policy.tableId);
    if (!table) return acc;

    if (!acc[table.name]) {
      acc[table.name] = [];
    }
    acc[table.name].push(policy);
    return acc;
  }, {} as Record<string, RLSPolicy[]>);

  const policyFunctions = Object.entries(policyGroups).map(([tableName, policies]) => {
    const policyChecks = policies.map(p => {
      const check = p.withCheck ? `checkCondition: \`${p.withCheck}\`` : '';
      return `    {
      operation: "${p.operation}",
      using: \`${p.using}\`,${check ? '\n      ' + check : ''}
    }`;
    }).join(',\n');

    return `export const ${tableName}RLS = {
  policies: [
${policyChecks}
  ],
};`;
  }).join('\n\n');

  return `export type RLSOperation = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";

export interface RLSPolicy {
  operation: RLSOperation;
  using: string;
  checkCondition?: string;
}

${policyFunctions}`;
};

const generateSupabaseMigration = (rlsPolicies: RLSPolicy[], tables: PrismaTable[]): string => {
  const timestamp = Date.now();
  const policyGroups = rlsPolicies.reduce((acc, policy) => {
    const table = tables.find(t => t.id === policy.tableId);
    if (!table) return acc;

    if (!acc[table.name]) {
      acc[table.name] = [];
    }
    acc[table.name].push(policy);
    return acc;
  }, {} as Record<string, RLSPolicy[]>);

  const enableRLS = Object.keys(policyGroups).map(tableName =>
    `ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY;`
  ).join('\n');

  const createPolicies = Object.entries(policyGroups).flatMap(([tableName, policies]) =>
    policies.map(policy => {
      const withCheck = policy.withCheck ? `\n  WITH CHECK (${policy.withCheck})` : '';
      return `CREATE POLICY "${policy.name}" ON public."${tableName}"
  FOR ${policy.operation}
  USING (${policy.using})${withCheck};`;
    })
  ).join('\n\n');

  return `-- Migration: ${timestamp}_rls_policies.sql
-- Enable RLS on tables
${enableRLS}

-- Create RLS policies
${createPolicies}`;
};

export const codeFileGenerators: CodeFileRegistry = {
  globals_css: generateThemeCSS,
  auth_ts: generateAuthFile,
  auth_client_ts: generateAuthClientFile,
  prisma_schema: generatePrismaSchema,
  prisma_rls_ts: generatePrismaRLSFile,
  supabase_migration_sql: generateSupabaseMigration,
};

const createComponentFileNodes = (shouldShowCodeFiles: boolean): CodeFileNode[] => {
  const nodes: CodeFileNode[] = [];

  Object.entries(componentFileContents).forEach(([componentName, content]) => {
    const fileName = `${componentName}.tsx`;

    nodes.push({
      id: `code-file-component-${componentName}`,
      name: fileName,
      displayName: fileName,
      type: "code-file",
      path: `components.ui.${componentName}`,
      urlPath: `/components/ui/${componentName}`,
      include: shouldShowCodeFiles,
      fileExtension: "tsx",
      language: "typescript",
      content: () => content,
      includeCondition: () => shouldShowCodeFiles,
      visibleAfterPage: "start-here.next-steps",
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
  const shouldShowCodeFiles = isPageVisited?.("start-here.next-steps") ?? false;

  nodes.push({
    id: "code-file-globals-css",
    name: "globals.css",
    displayName: "globals.css",
    type: "code-file",
    path: "app.globals",
    urlPath: "/app/globals",
    include: shouldShowCodeFiles,
    fileExtension: "css",
    language: "css",
    content: () => codeFileGenerators.globals_css(theme),
    includeCondition: () => shouldShowCodeFiles,
    visibleAfterPage: "start-here.next-steps",
    parentPath: "app",
    downloadPath: "app",
    previewOnly: true,
  });

  const isBetterAuthEnabled = initialConfig.technologies.betterAuth;
  const isSupabaseOnly = initialConfig.questions.useSupabase === "authOnly";

  if (isBetterAuthEnabled && !isSupabaseOnly) {
    nodes.push({
      id: "code-file-auth-ts",
      name: "auth.ts",
      displayName: "auth.ts",
      type: "code-file",
      path: "lib.auth",
      urlPath: "/lib/auth",
      include: shouldShowCodeFiles && initialConfig.technologies.betterAuth && initialConfig.questions.useSupabase !== "authOnly",
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.auth_ts(plugins),
      includeCondition: () => shouldShowCodeFiles && initialConfig.technologies.betterAuth && initialConfig.questions.useSupabase !== "authOnly",
      visibleAfterPage: "start-here.next-steps",
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
      include: shouldShowCodeFiles && initialConfig.technologies.betterAuth && initialConfig.questions.useSupabase !== "authOnly",
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.auth_client_ts(plugins),
      includeCondition: () => shouldShowCodeFiles && initialConfig.technologies.betterAuth && initialConfig.questions.useSupabase !== "authOnly",
      visibleAfterPage: "start-here.next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });
  }

  const hasPrisma = initialConfig.technologies.prisma;
  if (hasPrisma) {
    nodes.push({
      id: "code-file-prisma-schema",
      name: "schema.prisma",
      displayName: "schema.prisma",
      type: "code-file",
      path: "prisma.schema",
      urlPath: "/prisma/schema",
      include: shouldShowCodeFiles && initialConfig.technologies.prisma,
      fileExtension: "prisma",
      language: "prisma",
      content: () => codeFileGenerators.prisma_schema(tables),
      includeCondition: () => shouldShowCodeFiles && initialConfig.technologies.prisma,
      visibleAfterPage: "start-here.next-steps",
      parentPath: "prisma",
      downloadPath: "prisma",
      previewOnly: true,
    });
  }

  const hasRLS = rlsPolicies.length > 0;
  if (hasPrisma && hasRLS) {
    nodes.push({
      id: "code-file-prisma-rls-ts",
      name: "prisma-rls.ts",
      displayName: "prisma-rls.ts",
      type: "code-file",
      path: "lib.prisma-rls",
      urlPath: "/lib/prisma-rls",
      include: shouldShowCodeFiles && initialConfig.technologies.prisma && rlsPolicies.length > 0,
      fileExtension: "ts",
      language: "typescript",
      content: () => codeFileGenerators.prisma_rls_ts(rlsPolicies, tables),
      includeCondition: () => shouldShowCodeFiles && initialConfig.technologies.prisma && rlsPolicies.length > 0,
      visibleAfterPage: "start-here.next-steps",
      parentPath: "lib",
      downloadPath: "lib",
      previewOnly: true,
    });
  }

  const isSupabase = initialConfig.questions.useSupabase === "withBetterAuth" ||
                     initialConfig.questions.useSupabase === "authOnly";
  if (isSupabase && hasRLS) {
    nodes.push({
      id: "code-file-supabase-migration",
      name: "rls_policies.sql",
      displayName: "rls_policies.sql",
      type: "code-file",
      path: "supabase.migrations.rls-policies",
      urlPath: "/supabase/migrations/rls-policies",
      include: shouldShowCodeFiles &&
        (initialConfig.questions.useSupabase === "withBetterAuth" ||
         initialConfig.questions.useSupabase === "authOnly") &&
        rlsPolicies.length > 0,
      fileExtension: "sql",
      language: "sql",
      content: () => codeFileGenerators.supabase_migration_sql(rlsPolicies, tables),
      includeCondition: () =>
        shouldShowCodeFiles &&
        (initialConfig.questions.useSupabase === "withBetterAuth" ||
         initialConfig.questions.useSupabase === "authOnly") &&
        rlsPolicies.length > 0,
      visibleAfterPage: "start-here.next-steps",
      parentPath: "supabase.migrations",
      downloadPath: "supabase/migrations",
      previewOnly: true,
    });
  }

  const componentNodes = createComponentFileNodes(shouldShowCodeFiles);

  return [...nodes.filter(node => node.includeCondition()), ...componentNodes];
};
