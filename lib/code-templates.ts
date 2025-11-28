import type {
  PrismaTable,
  RLSPolicy,
  RLSRolePolicy,
} from "@/app/(components)/DatabaseConfiguration.types";
import {
  AUTH_PLUGIN_REGISTRY,
  getClientPlugins,
  getOAuthProviders,
  getPluginImports,
  getServerPlugins,
  hasEmailPasswordBase,
  needsAppName,
} from "./auth-plugin-mappings";
import type { ConfigSnapshot } from "./config-snapshot";

export const TEMPLATES = {
  globals_css: (config: ConfigSnapshot): string => {
    const { theme } = config;
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
  },

  auth: (config: ConfigSnapshot): string => {
    const serverPlugins = getServerPlugins(config);
    const pluginImportGroups = getPluginImports(serverPlugins, "server");
    const oauthProviders = getOAuthProviders(config);
    const hasEmailPassword = hasEmailPasswordBase(config);
    const requiresAppName = needsAppName(config);

    const hasAdminOrOrg = serverPlugins.some(
      (p) => p.name === "admin" || p.name === "organization"
    );
    const needsAccessControl = hasAdminOrOrg;

    const imports: string[] = ['import { betterAuth } from "better-auth";'];
    imports.push(
      'import { prismaAdapter } from "better-auth/adapters/prisma";'
    );
    imports.push('import { PrismaClient } from "@prisma/client";');

    pluginImportGroups.forEach(({ imports: pluginNames, importPath }) => {
      imports.push(
        `import { ${pluginNames.join(", ")} } from "${importPath}";`
      );
    });

    if (needsAccessControl) {
      imports.push(
        'import { createAccessControl } from "better-auth/plugins/access";'
      );
      imports.push(
        'import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";'
      );
    }

    const configLines: string[] = [];

    if (requiresAppName) {
      configLines.push('  appName: process.env.APP_NAME || "My App",');
    }

    configLines.push(`  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),`);

    if (hasEmailPassword) {
      const requiresVerification = config.authMethods.twoFactor;
      configLines.push(`  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,${requiresVerification ? "\n    requireEmailVerification: true," : ""}
  },`);
    }

    if (oauthProviders.length > 0) {
      const providerConfigs = oauthProviders
        .map((provider) => {
          const upperProvider = provider.toUpperCase();
          return `    ${provider}: {
      clientId: process.env.${upperProvider}_CLIENT_ID!,
      clientSecret: process.env.${upperProvider}_CLIENT_SECRET!,
    },`;
        })
        .join("\n");

      configLines.push(`  socialProviders: {
${providerConfigs}
  },`);
    }

    const pluginConfigs: string[] = [];

    serverPlugins.forEach((plugin) => {
      const info = AUTH_PLUGIN_REGISTRY[plugin.name];

      switch (plugin.name) {
        case "twoFactor":
          pluginConfigs.push("    twoFactor()");
          break;
        case "admin":
          if (needsAccessControl) {
            pluginConfigs.push(`    admin({
      ac,
      roles: { user, admin, superAdmin }
    })`);
          } else {
            pluginConfigs.push("    admin()");
          }
          break;
        case "organization":
          if (needsAccessControl) {
            pluginConfigs.push(`    organization({
      ac,
      roles: { owner: superAdmin, admin, member: user }
    })`);
          } else {
            pluginConfigs.push("    organization()");
          }
          break;
        case "passkey":
          pluginConfigs.push("    passkey()");
          break;
        case "magicLink":
          pluginConfigs.push(`    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(\`Magic link for \${email}: \${url}\`);
      }
    })`);
          break;
        case "emailOTP":
          pluginConfigs.push(`    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        console.log(\`OTP for \${email} (\${type}): \${otp}\`);
      }
    })`);
          break;
        case "anonymous":
          pluginConfigs.push(`    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log(\`Linking anonymous user \${anonymousUser.id} to \${newUser.id}\`);
      }
    })`);
          break;
        default:
          if (info) {
            pluginConfigs.push(`    ${info.serverPlugin}()`);
          }
      }
    });

    if (pluginConfigs.length > 0) {
      configLines.push(`  plugins: [\n${pluginConfigs.join(",\n")}\n  ],`);
    }

    let accessControlCode = "";
    if (needsAccessControl) {
      accessControlCode = `
const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({});

const admin = ac.newRole({
  ...adminAc.statements,
});

const superAdmin = ac.newRole({
  ...adminAc.statements,
});

`;
    }

    return `${imports.join("\n")}

const prisma = new PrismaClient();
${accessControlCode}
export const auth = betterAuth({
${configLines.join("\n")}
});

export type Session = typeof auth.$Infer.Session;`;
  },

  authClient: (config: ConfigSnapshot): string => {
    const clientPlugins = getClientPlugins(config);
    const pluginImportGroups = getPluginImports(clientPlugins, "client");

    const hasAdminOrOrg = clientPlugins.some(
      (p) => p.name === "admin" || p.name === "organization"
    );
    const needsAccessControl = hasAdminOrOrg;

    const imports: string[] = [
      'import { createAuthClient } from "better-auth/react";',
    ];

    pluginImportGroups.forEach(({ imports: pluginNames, importPath }) => {
      imports.push(
        `import { ${pluginNames.join(", ")} } from "${importPath}";`
      );
    });

    if (needsAccessControl) {
      imports.push(
        'import { createAccessControl } from "better-auth/plugins/access";'
      );
      imports.push(
        'import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";'
      );
    }

    const pluginConfigs: string[] = [];

    clientPlugins.forEach((plugin) => {
      const info = AUTH_PLUGIN_REGISTRY[plugin.name];

      switch (plugin.name) {
        case "twoFactor":
          pluginConfigs.push(`    twoFactorClient({
      twoFactorPage: "/two-factor"
    })`);
          break;
        case "admin":
          if (needsAccessControl) {
            pluginConfigs.push(`    adminClient({
      ac,
      roles: { user, admin, superAdmin }
    })`);
          } else {
            pluginConfigs.push("    adminClient()");
          }
          break;
        case "organization":
          if (needsAccessControl) {
            pluginConfigs.push(`    organizationClient({
      ac,
      roles: { owner: superAdmin, admin, member: user }
    })`);
          } else {
            pluginConfigs.push("    organizationClient()");
          }
          break;
        default:
          if (info) {
            pluginConfigs.push(`    ${info.clientPlugin}()`);
          }
      }
    });

    let accessControlCode = "";
    if (needsAccessControl) {
      accessControlCode = `
const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({});

const admin = ac.newRole({
  ...adminAc.statements,
});

const superAdmin = ac.newRole({
  ...adminAc.statements,
});

`;
    }

    const configLines: string[] = [
      "  baseURL: process.env.NEXT_PUBLIC_APP_URL,",
    ];

    if (pluginConfigs.length > 0) {
      configLines.push(`  plugins: [\n${pluginConfigs.join(",\n")}\n  ],`);
    }

    return `${imports.join("\n")}
${accessControlCode}
export const authClient = createAuthClient({
${configLines.join("\n")}
});`;
  },

  prismaSchema: (config: ConfigSnapshot): string => {
    const tables = config.tables;
    const shouldExcludeAuthSchema =
      config.databaseProvider === "supabase" && !config.betterAuth;

    const filteredTables = tables.filter((table) => {
      if (shouldExcludeAuthSchema && table.schema === "auth") {
        return false;
      }
      return true;
    });

    const schemas = Array.from(new Set(filteredTables.map((t) => t.schema)));
    const schemasStr = schemas.map((s) => `"${s}"`).join(", ");

    let schema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = [${schemasStr}]
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

`;

    filteredTables.forEach((table) => {
      schema += `model ${table.name} {\n`;

      table.columns.forEach((col) => {
        const typeStr = col.isArray ? `${col.type}[]` : col.type;
        const optionalStr = col.isOptional ? "?" : "";
        const namePadding = " ".repeat(Math.max(1, 20 - col.name.length));

        let line = `  ${col.name}${namePadding}${typeStr}${optionalStr}`;

        if (col.attributes.length > 0) {
          const typePadding = " ".repeat(
            Math.max(2, 25 - typeStr.length - optionalStr.length)
          );
          line += `${typePadding}${col.attributes.join(" ")}`;
        }

        if (col.relation) {
          const relationName = `${table.name}To${col.relation.table}`;
          const fields = `fields: [${col.name}]`;
          const references = `references: [${col.relation.field}]`;
          const onDelete = col.relation.onDelete
            ? `, onDelete: ${col.relation.onDelete}`
            : "";
          line += ` @relation("${relationName}", ${fields}, ${references}${onDelete})`;
        }

        schema += `${line}\n`;
      });

      if (table.uniqueConstraints.length > 0) {
        schema += "\n";
        table.uniqueConstraints.forEach((constraint) => {
          const fields = constraint.map((f) => `${f}`).join(", ");
          schema += `  @@unique([${fields}])\n`;
        });
      }

      schema += `\n  @@schema("${table.schema}")\n`;
      schema += `}\n\n`;
    });

    return schema.trim();
  },

  rlsMigration: (config: ConfigSnapshot): string => {
    const tables = config.tables;
    const rlsPolicies = config.rlsPolicies;

    const authProvider =
      config.databaseProvider === "supabase" && !config.betterAuth
        ? "supabase"
        : "better-auth";

    const lines: string[] = [];

    lines.push(`-- Enable Row Level Security on all tables`);
    lines.push(``);

    tables.forEach((table) => {
      if (table.schema === "auth" && authProvider === "supabase") {
        return;
      }

      if (table.schema === "better_auth") {
        return;
      }

      lines.push(
        `ALTER TABLE ${table.schema}.${table.name} ENABLE ROW LEVEL SECURITY;`
      );
    });

    lines.push(``);
    lines.push(`-- Create RLS Policies`);
    lines.push(``);

    type RLSAccessType = "global" | "own" | "organization" | "related";

    const getUSINGClause = (
      accessType: RLSAccessType,
      table: PrismaTable,
      relatedTable?: string
    ): string => {
      if (accessType === "global") {
        return "true";
      }

      const userIdColumn =
        table.columns.find((c) => c.name === "userId" || c.name === "user_id")
          ?.name || "user_id";

      if (accessType === "own") {
        if (authProvider === "supabase") {
          return `auth.uid() = ${userIdColumn}`;
        } else {
          return `(SELECT id FROM better_auth.user WHERE id = ${userIdColumn}) IS NOT NULL`;
        }
      }

      if (accessType === "organization") {
        const orgIdColumn =
          table.columns.find(
            (c) => c.name === "organizationId" || c.name === "organization_id"
          )?.name || "organization_id";

        if (authProvider === "supabase") {
          return `${orgIdColumn} IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = auth.uid()
    )`;
        } else {
          return `${orgIdColumn} IN (
      SELECT organization_id
      FROM public.user_organizations
      WHERE user_id = (SELECT id FROM better_auth.user LIMIT 1)
    )`;
        }
      }

      if (accessType === "related" && relatedTable) {
        const relatedColumn = table.columns.find(
          (c) => c.type === relatedTable || c.relation?.table === relatedTable
        );

        if (relatedColumn) {
          const columnName = relatedColumn.name;
          const relatedTableObj = tables.find((t) => t.name === relatedTable);
          const relatedUserColumn =
            relatedTableObj?.columns.find(
              (c) => c.name === "userId" || c.name === "user_id"
            )?.name || "user_id";

          if (authProvider === "supabase") {
            return `${columnName} IN (
      SELECT id
      FROM ${relatedTableObj?.schema || "public"}.${relatedTable}
      WHERE ${relatedUserColumn} = auth.uid()
    )`;
          } else {
            return `${columnName} IN (
      SELECT id
      FROM ${relatedTableObj?.schema || "public"}.${relatedTable}
      WHERE ${relatedUserColumn} = (SELECT id FROM better_auth.user LIMIT 1)
    )`;
          }
        }
      }

      return "false";
    };

    const groupedPolicies: Record<string, RLSPolicy[]> = {};
    rlsPolicies.forEach((policy) => {
      if (!groupedPolicies[policy.tableId]) {
        groupedPolicies[policy.tableId] = [];
      }
      groupedPolicies[policy.tableId].push(policy);
    });

    Object.entries(groupedPolicies).forEach(([tableId, policies]) => {
      const table = tables.find((t) => t.id === tableId);
      if (!table) return;

      if (table.schema === "auth" && authProvider === "supabase") {
        return;
      }

      if (table.schema === "better_auth") {
        return;
      }

      lines.push(`-- Policies for ${table.schema}.${table.name}`);

      policies.forEach((policy) => {
        policy.rolePolicies?.forEach((rolePolicy) => {
          const policyName = `${table.name}_${policy.operation.toLowerCase()}_${rolePolicy.role.replace("-", "_")}`;
          const usingClause = getUSINGClause(
            rolePolicy.accessType as RLSAccessType,
            table,
            rolePolicy.relatedTable
          );

          lines.push(`CREATE POLICY "${policyName}"`);
          lines.push(`  ON ${table.schema}.${table.name}`);
          lines.push(`  FOR ${policy.operation}`);
          lines.push(`  TO ${rolePolicy.role.replace("-", "_")}`);
          lines.push(`  USING (${usingClause});`);
          lines.push(``);
        });
      });
    });

    if (authProvider === "better-auth") {
      lines.push(`-- Create database roles for Better Auth`);
      lines.push(``);

      const roles = ["user", "admin", "super_admin"];
      if (config.adminRoles.organizations) {
        roles.push("org_admin", "org_member");
      }

      roles.forEach((role) => {
        lines.push(`CREATE ROLE ${role};`);
      });
      lines.push(``);
    }

    return lines.join("\n").trim();
  },

  prismaRLS: (rlsPolicies: RLSPolicy[], tables: PrismaTable[]): string => {
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
  },

  supabaseMigration: (
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
  },

  logUtils: (): string => {
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
  },

  prismaRLSClient: (): string => {
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
  },

  authUtil: (): string => {
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
  },

  robotsFile: (): string => {
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
  },
};
