import { getBrowserAPI } from "@/lib/env.utils";

interface Plugin {
  id: string;
  name: string;
  enabled: boolean;
  file: "auth" | "auth-client";
  questionId?: string;
  description?: string;
}

interface RLSPolicy {
  id: string;
  tableId: string;
  name: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";
  using: string;
  withCheck?: string;
  isEditing: boolean;
}

interface PrismaColumn {
  id: string;
  name: string;
  type: string;
  isOptional: boolean;
  isUnique: boolean;
  isId: boolean;
  isArray: boolean;
  defaultValue?: string;
  attributes: string[];
}

interface PrismaTable {
  id: string;
  name: string;
  schema: "auth" | "public";
  columns: PrismaColumn[];
  uniqueConstraints: string[][];
}

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

interface ThemeTypography {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: number;
}

interface ThemeShadow {
  color: string;
  opacity: number;
  blurRadius: number;
  spread: number;
  offsetX: number;
  offsetY: number;
}

interface ThemeOther {
  radius: number;
  spacing: number;
  shadow: ThemeShadow;
}

interface ThemeConfiguration {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: {
    light: ThemeTypography;
    dark: ThemeTypography;
  };
  other: {
    light: ThemeOther;
    dark: ThemeOther;
  };
}

interface InitialConfiguration {
  technologies: Record<string, boolean>;
  features: {
    authentication: {
      emailPassword: boolean;
    };
  };
  questions: {
    useSupabase: "none" | "no" | "withBetterAuth" | "authOnly";
  };
}

export interface ProcessedCodeFile {
  id: string;
  path: string;
  content: string;
  type: "theme" | "auth" | "prisma" | "supabase";
  technology?: string;
}

export function generateThemeCSS(theme: ThemeConfiguration): string {
  const lightColors = theme.colors.light;
  const darkColors = theme.colors.dark;
  const lightTypography = theme.typography.light;
  const darkTypography = theme.typography.dark;
  const lightOther = theme.other.light;
  const darkOther = theme.other.dark;

  const colorKeys = [
    { key: "background", css: "--background" },
    { key: "foreground", css: "--foreground" },
    { key: "card", css: "--card" },
    { key: "cardForeground", css: "--card-foreground" },
    { key: "popover", css: "--popover" },
    { key: "popoverForeground", css: "--popover-foreground" },
    { key: "primary", css: "--primary" },
    { key: "primaryForeground", css: "--primary-foreground" },
    { key: "secondary", css: "--secondary" },
    { key: "secondaryForeground", css: "--secondary-foreground" },
    { key: "muted", css: "--muted" },
    { key: "mutedForeground", css: "--muted-foreground" },
    { key: "accent", css: "--accent" },
    { key: "accentForeground", css: "--accent-foreground" },
    { key: "destructive", css: "--destructive" },
    { key: "destructiveForeground", css: "--destructive-foreground" },
    { key: "border", css: "--border" },
    { key: "input", css: "--input" },
    { key: "ring", css: "--ring" },
    { key: "chart1", css: "--chart-1" },
    { key: "chart2", css: "--chart-2" },
    { key: "chart3", css: "--chart-3" },
    { key: "chart4", css: "--chart-4" },
    { key: "chart5", css: "--chart-5" },
    { key: "sidebarBackground", css: "--sidebar" },
    { key: "sidebarForeground", css: "--sidebar-foreground" },
    { key: "sidebarPrimary", css: "--sidebar-primary" },
    { key: "sidebarPrimaryForeground", css: "--sidebar-primary-foreground" },
    { key: "sidebarAccent", css: "--sidebar-accent" },
    { key: "sidebarAccentForeground", css: "--sidebar-accent-foreground" },
    { key: "sidebarBorder", css: "--sidebar-border" },
    { key: "sidebarRing", css: "--sidebar-ring" },
  ];

  const lines: string[] = [":root {"];

  colorKeys.forEach(({ key, css }) => {
    const color = (lightColors as any)[key];
    if (color) {
      lines.push(`  ${css}: ${color};`);
    }
  });

  lines.push(`  --font-sans: ${lightTypography.fontSans};`);
  lines.push(`  --font-serif: ${lightTypography.fontSerif};`);
  lines.push(`  --font-mono: ${lightTypography.fontMono};`);
  lines.push(`  --radius: ${lightOther.radius}rem;`);
  lines.push(`  --shadow-x: ${lightOther.shadow.offsetX};`);
  lines.push(`  --shadow-y: ${lightOther.shadow.offsetY}px;`);
  lines.push(`  --shadow-blur: ${lightOther.shadow.blurRadius}px;`);
  lines.push(`  --shadow-spread: ${lightOther.shadow.spread}px;`);
  lines.push(`  --shadow-opacity: ${lightOther.shadow.opacity};`);
  lines.push(`  --shadow-color: ${lightOther.shadow.color};`);
  lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
  lines.push(`  --tracking-normal: ${lightTypography.letterSpacing}em;`);
  lines.push(`  --spacing: ${lightOther.spacing}rem;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.dark {`);

  colorKeys.forEach(({ key, css }) => {
    const color = (darkColors as any)[key];
    if (color) {
      lines.push(`  ${css}: ${color};`);
    }
  });

  lines.push(`  --font-sans: ${darkTypography.fontSans};`);
  lines.push(`  --font-serif: ${darkTypography.fontSerif};`);
  lines.push(`  --font-mono: ${darkTypography.fontMono};`);
  lines.push(`  --radius: ${darkOther.radius}rem;`);
  lines.push(`  --shadow-x: ${darkOther.shadow.offsetX};`);
  lines.push(`  --shadow-y: ${darkOther.shadow.offsetY}px;`);
  lines.push(`  --shadow-blur: ${darkOther.shadow.blurRadius}px;`);
  lines.push(`  --shadow-spread: ${darkOther.shadow.spread}px;`);
  lines.push(`  --shadow-opacity: ${darkOther.shadow.opacity};`);
  lines.push(`  --shadow-color: ${darkOther.shadow.color};`);
  lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
  lines.push(`  --tracking-normal: ${darkTypography.letterSpacing}em;`);
  lines.push(`  --spacing: ${darkOther.spacing}rem;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`@theme inline {`);
  lines.push(`  --color-background: var(--background);`);
  lines.push(`  --color-foreground: var(--foreground);`);
  lines.push(`  --color-card: var(--card);`);
  lines.push(`  --color-card-foreground: var(--card-foreground);`);
  lines.push(`  --color-popover: var(--popover);`);
  lines.push(`  --color-popover-foreground: var(--popover-foreground);`);
  lines.push(`  --color-primary: var(--primary);`);
  lines.push(`  --color-primary-foreground: var(--primary-foreground);`);
  lines.push(`  --color-secondary: var(--secondary);`);
  lines.push(`  --color-secondary-foreground: var(--secondary-foreground);`);
  lines.push(`  --color-muted: var(--muted);`);
  lines.push(`  --color-muted-foreground: var(--muted-foreground);`);
  lines.push(`  --color-accent: var(--accent);`);
  lines.push(`  --color-accent-foreground: var(--accent-foreground);`);
  lines.push(`  --color-destructive: var(--destructive);`);
  lines.push(`  --color-destructive-foreground: var(--destructive-foreground);`);
  lines.push(`  --color-border: var(--border);`);
  lines.push(`  --color-input: var(--input);`);
  lines.push(`  --color-ring: var(--ring);`);
  lines.push(`  --color-chart-1: var(--chart-1);`);
  lines.push(`  --color-chart-2: var(--chart-2);`);
  lines.push(`  --color-chart-3: var(--chart-3);`);
  lines.push(`  --color-chart-4: var(--chart-4);`);
  lines.push(`  --color-chart-5: var(--chart-5);`);
  lines.push(`  --color-sidebar: var(--sidebar);`);
  lines.push(`  --color-sidebar-foreground: var(--sidebar-foreground);`);
  lines.push(`  --color-sidebar-primary: var(--sidebar-primary);`);
  lines.push(`  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);`);
  lines.push(`  --color-sidebar-accent: var(--sidebar-accent);`);
  lines.push(`  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);`);
  lines.push(`  --color-sidebar-border: var(--sidebar-border);`);
  lines.push(`  --color-sidebar-ring: var(--sidebar-ring);`);
  lines.push(``);
  lines.push(`  --font-sans: var(--font-sans);`);
  lines.push(`  --font-mono: var(--font-mono);`);
  lines.push(`  --font-serif: var(--font-serif);`);
  lines.push(``);
  lines.push(`  --radius-sm: calc(var(--radius) - 4px);`);
  lines.push(`  --radius-md: calc(var(--radius) - 2px);`);
  lines.push(`  --radius-lg: var(--radius);`);
  lines.push(`  --radius-xl: calc(var(--radius) + 4px);`);
  lines.push(``);
  lines.push(`  --shadow-2xs: var(--shadow-2xs);`);
  lines.push(`  --shadow-xs: var(--shadow-xs);`);
  lines.push(`  --shadow-sm: var(--shadow-sm);`);
  lines.push(`  --shadow: var(--shadow);`);
  lines.push(`  --shadow-md: var(--shadow-md);`);
  lines.push(`  --shadow-lg: var(--shadow-lg);`);
  lines.push(`  --shadow-xl: var(--shadow-xl);`);
  lines.push(`  --shadow-2xl: var(--shadow-2xl);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-radius {`);
  lines.push(`  border-radius: var(--radius);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-shadow {`);
  lines.push(`  box-shadow: var(--shadow);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="checked"].theme-data-checked-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="checked"].theme-data-checked-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="unchecked"].theme-data-unchecked-bg-input {`);
  lines.push(`  background-color: var(--input);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-ring:focus-visible {`);
  lines.push(`  outline: none;`);
  lines.push(`  box-shadow: 0 0 0 2px var(--ring);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-selected-single="true"].theme-data-selected-single-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-selected-single="true"].theme-data-selected-single-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-start="true"].theme-data-range-start-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-start="true"].theme-data-range-start-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-end="true"].theme-data-range-end-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-end="true"].theme-data-range-end-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-middle="true"].theme-data-range-middle-bg-accent {`);
  lines.push(`  background-color: var(--accent);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-middle="true"].theme-data-range-middle-text-accent-foreground {`);
  lines.push(`  color: var(--accent-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-border-ring:focus-visible {`);
  lines.push(`  border-color: var(--ring);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-ring-color:focus-visible {`);
  lines.push(`  --tw-ring-color: var(--ring);`);
  lines.push(`}`);

  return lines.join("\n");
}

export function generateAuthFile(plugins: Plugin[], config: InitialConfiguration): string {
  const imports: string[] = [
    'import { betterAuth } from "better-auth"',
    'import { prismaAdapter } from "better-auth/adapters/prisma"',
    'import { PrismaClient } from "@prisma/client"'
  ];

  const pluginImports: string[] = [];
  const pluginInits: string[] = [];

  const authPlugins = plugins.filter(p => p.file === "auth" && p.enabled);

  authPlugins.forEach(plugin => {
    switch (plugin.name) {
      case "magicLink":
        pluginImports.push("magicLink");
        pluginInits.push("magicLink()");
        break;
      case "emailOTP":
        pluginImports.push("emailOTP");
        pluginInits.push("emailOTP()");
        break;
      case "organization":
        pluginImports.push("organization");
        pluginInits.push("organization()");
        break;
      case "admin":
        pluginImports.push("admin");
        pluginInits.push("admin()");
        break;
      case "emailAndPassword":
        break;
      case "username":
        pluginImports.push("username");
        pluginInits.push("username()");
        break;
      case "google":
        break;
      case "github":
        break;
      case "apple":
        break;
      case "stripe":
        break;
      case "emailVerification":
        break;
      case "supabaseStorage":
        break;
      case "twoFactor":
        pluginImports.push("twoFactor");
        pluginInits.push("twoFactor()");
        break;
      case "passkey":
        pluginImports.push("passkey");
        pluginInits.push("passkey()");
        break;
      case "anonymous":
        pluginImports.push("anonymous");
        pluginInits.push("anonymous()");
        break;
      case "multiSession":
        pluginImports.push("multiSession");
        pluginInits.push("multiSession()");
        break;
    }
  });

  if (pluginImports.length > 0) {
    imports.push(`import { ${pluginImports.join(", ")} } from "better-auth/plugins"`);
  }

  const hasGoogle = authPlugins.some(p => p.name === "google");
  const hasGithub = authPlugins.some(p => p.name === "github");
  const hasApple = authPlugins.some(p => p.name === "apple");

  const socialProviders: string[] = [];
  if (hasGoogle) {
    socialProviders.push(`    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }`);
  }
  if (hasGithub) {
    socialProviders.push(`    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }`);
  }
  if (hasApple) {
    socialProviders.push(`    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!
    }`);
  }

  const lines: string[] = [];
  lines.push(imports.join("\n"));
  lines.push(``);
  lines.push(`const prisma = new PrismaClient()`);
  lines.push(``);
  lines.push(`export const auth = betterAuth({`);
  lines.push(`  database: prismaAdapter(prisma, { provider: "postgresql" }),`);

  if (config.features.authentication.emailPassword) {
    lines.push(`  emailAndPassword: {`);
    lines.push(`    enabled: true`);
    lines.push(`  },`);
  }

  if (socialProviders.length > 0) {
    lines.push(`  socialProviders: {`);
    lines.push(socialProviders.join(",\n"));
    lines.push(`  },`);
  }

  if (pluginInits.length > 0) {
    lines.push(`  plugins: [`);
    pluginInits.forEach((init, index) => {
      const comma = index < pluginInits.length - 1 ? "," : "";
      lines.push(`    ${init}${comma}`);
    });
    lines.push(`  ]`);
  }

  lines.push(`})`);

  return lines.join("\n");
}

export function generateAuthClientFile(plugins: Plugin[]): string {
  const imports: string[] = [
    'import { createAuthClient } from "better-auth/react"'
  ];

  const pluginImports: string[] = [];
  const pluginInits: string[] = [];

  const clientPlugins = plugins.filter(p => p.file === "auth-client" && p.enabled);

  clientPlugins.forEach(plugin => {
    switch (plugin.name) {
      case "magicLinkClient":
        pluginImports.push("magicLinkClient");
        pluginInits.push("magicLinkClient()");
        break;
      case "emailOTPClient":
        pluginImports.push("emailOTPClient");
        pluginInits.push("emailOTPClient()");
        break;
      case "organizationClient":
        pluginImports.push("organizationClient");
        pluginInits.push("organizationClient()");
        break;
      case "adminClient":
        pluginImports.push("adminClient");
        pluginInits.push("adminClient()");
        break;
      case "stripeClient":
        pluginImports.push("stripeClient");
        pluginInits.push("stripeClient()");
        break;
      case "twoFactorClient":
        pluginImports.push("twoFactorClient");
        pluginInits.push("twoFactorClient()");
        break;
      case "passkeyClient":
        pluginImports.push("passkeyClient");
        pluginInits.push("passkeyClient()");
        break;
      case "anonymousClient":
        pluginImports.push("anonymousClient");
        pluginInits.push("anonymousClient()");
        break;
      case "multiSessionClient":
        pluginImports.push("multiSessionClient");
        pluginInits.push("multiSessionClient()");
        break;
    }
  });

  if (pluginImports.length > 0) {
    imports.push(`import { ${pluginImports.join(", ")} } from "better-auth/client/plugins"`);
  }

  const lines: string[] = [];
  lines.push(imports.join("\n"));
  lines.push(``);
  lines.push(`export const authClient = createAuthClient({`);
  lines.push(`  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",`);

  if (pluginInits.length > 0) {
    lines.push(`  plugins: [`);
    pluginInits.forEach((init, index) => {
      const comma = index < pluginInits.length - 1 ? "," : "";
      lines.push(`    ${init}${comma}`);
    });
    lines.push(`  ]`);
  }

  lines.push(`})`);

  return lines.join("\n");
}

export function generatePrismaRLSFile(): string {
  return `import { PrismaClient } from "@prisma/client"
import { auth } from "./auth"

export async function getAuthenticatedClient() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const prisma = new PrismaClient()

  await prisma.$executeRaw\`SET LOCAL app.current_user_id = \${session.user.id}\`

  return prisma
}
`;
}

export function generatePrismaSchemaContent(tables: PrismaTable[]): string {
  let schema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "public"]
}

generator client {
  provider = "prisma-client-js"
}

`;

  tables.forEach((table) => {
    schema += `model ${table.name} {\n`;
    table.columns.forEach((col: PrismaColumn) => {
      const typeStr = col.isArray ? `${col.type}[]` : col.type;
      const optionalStr = col.isOptional ? "?" : "";
      const padding = " ".repeat(Math.max(2, 20 - col.name.length - typeStr.length));
      const attrs = col.attributes.join(" ");
      schema += `  ${col.name}${" ".repeat(Math.max(1, 20 - col.name.length))}${typeStr}${optionalStr}${padding}${attrs}\n`;
    });

    if (table.uniqueConstraints && table.uniqueConstraints.length > 0) {
      schema += "\n";
      table.uniqueConstraints.forEach((constraint: string[]) => {
        schema += `  @@unique([${constraint.join(", ")}])\n`;
      });
    }

    schema += `\n  @@schema("${table.schema}")\n`;
    schema += `}\n\n`;
  });

  return schema;
}

function generateSupabaseTableSQL(table: PrismaTable): string {
  const lines: string[] = [];

  lines.push(`CREATE TABLE ${table.schema}.${table.name} (`);

  const columnDefs: string[] = [];
  table.columns.forEach((col) => {
    if (col.type.charAt(0) === col.type.charAt(0).toUpperCase() && col.type !== "String" && col.type !== "Int" && col.type !== "Float" && col.type !== "Boolean" && col.type !== "DateTime" && col.type !== "Json" && col.type !== "BigInt" && col.type !== "Decimal" && col.type !== "Bytes") {
      return;
    }

    let sqlType = "TEXT";
    switch (col.type) {
      case "String":
        sqlType = "TEXT";
        break;
      case "Int":
        sqlType = "INTEGER";
        break;
      case "Float":
        sqlType = "DOUBLE PRECISION";
        break;
      case "Boolean":
        sqlType = "BOOLEAN";
        break;
      case "DateTime":
        sqlType = "TIMESTAMP WITH TIME ZONE";
        break;
      case "Json":
        sqlType = "JSONB";
        break;
      case "BigInt":
        sqlType = "BIGINT";
        break;
      case "Decimal":
        sqlType = "DECIMAL";
        break;
      case "Bytes":
        sqlType = "BYTEA";
        break;
    }

    if (col.isArray) {
      sqlType += "[]";
    }

    let def = `  ${col.name} ${sqlType}`;

    if (!col.isOptional) {
      def += " NOT NULL";
    }

    if (col.defaultValue) {
      let defaultVal = col.defaultValue;
      if (defaultVal === "cuid()") {
        defaultVal = "gen_random_uuid()";
      } else if (defaultVal === "now()") {
        defaultVal = "now()";
      }
      def += ` DEFAULT ${defaultVal}`;
    }

    if (col.isId) {
      def += " PRIMARY KEY";
    } else if (col.isUnique) {
      def += " UNIQUE";
    }

    columnDefs.push(def);
  });

  lines.push(columnDefs.join(",\n"));
  lines.push(`);`);
  lines.push(``);

  return lines.join("\n");
}

export function generateSupabaseMigration(
  rlsPolicies: RLSPolicy[],
  tables: PrismaTable[],
  config: InitialConfiguration
): string {
  const lines: string[] = [];

  if (!config.technologies.prisma && config.questions.useSupabase !== "authOnly") {
    lines.push("-- Create schemas");
    lines.push("CREATE SCHEMA IF NOT EXISTS auth;");
    lines.push("CREATE SCHEMA IF NOT EXISTS public;");
    lines.push("");
    lines.push("-- Create tables");
    lines.push("");

    tables.forEach(table => {
      lines.push(generateSupabaseTableSQL(table));
    });
  }

  lines.push("-- Enable Row Level Security");
  lines.push("");

  const processedTables = new Set<string>();

  rlsPolicies.forEach((policy) => {
    const table = tables.find((t) => t.id === policy.tableId);
    if (!table) return;

    const tableKey = `${table.schema}.${table.name}`;

    if (!processedTables.has(tableKey)) {
      lines.push(`ALTER TABLE ${tableKey} ENABLE ROW LEVEL SECURITY;`);
      lines.push(``);
      processedTables.add(tableKey);
    }

    lines.push(`CREATE POLICY "${policy.name}"`);
    lines.push(`  ON ${tableKey}`);
    lines.push(`  FOR ${policy.operation}`);
    lines.push(`  USING (${policy.using})`);
    if (policy.withCheck) {
      lines.push(`  WITH CHECK (${policy.withCheck})`);
    }
    lines.push(`;`);
    lines.push(``);
  });

  return lines.join("\n");
}

export function generateCodeFiles(): ProcessedCodeFile[] {
  const files: ProcessedCodeFile[] = [];

  const storage = getBrowserAPI(() => localStorage);
  if (!storage) {
    return files;
  }

  const themeStore = JSON.parse(storage.getItem("theme-storage") || "{}");
  const dbStore = JSON.parse(storage.getItem("db-storage") || "{}");
  const editorStore = JSON.parse(storage.getItem("editor-storage") || "{}");

  const theme = themeStore?.state?.theme;
  const plugins = dbStore?.state?.plugins || [];
  const tables = dbStore?.state?.tables || [];
  const rlsPolicies = dbStore?.state?.rlsPolicies || [];
  const initialConfig = editorStore?.state?.initialConfiguration;

  if (theme) {
    const themeCSS = generateThemeCSS(theme);
    files.push({
      id: "theme-css",
      path: "app/globals.css",
      content: themeCSS,
      type: "theme"
    });
  }

  if (initialConfig?.technologies?.betterAuth && plugins.length > 0) {
    const authFile = generateAuthFile(plugins, initialConfig);
    files.push({
      id: "auth",
      path: "lib/auth.ts",
      content: authFile,
      type: "auth",
      technology: "betterAuth"
    });

    const authClientFile = generateAuthClientFile(plugins);
    files.push({
      id: "auth-client",
      path: "lib/auth-client.ts",
      content: authClientFile,
      type: "auth",
      technology: "betterAuth"
    });
  }

  if (initialConfig?.technologies?.prisma && tables.length > 0) {
    const prismaSchema = generatePrismaSchemaContent(tables);
    files.push({
      id: "prisma-schema",
      path: "prisma/schema.prisma",
      content: prismaSchema,
      type: "prisma",
      technology: "prisma"
    });

    const prismaRLS = generatePrismaRLSFile();
    files.push({
      id: "prisma-rls",
      path: "lib/prisma-rls.ts",
      content: prismaRLS,
      type: "prisma",
      technology: "prisma"
    });
  }

  if (initialConfig?.technologies?.supabase && (rlsPolicies.length > 0 || tables.length > 0)) {
    const migration = generateSupabaseMigration(rlsPolicies, tables, initialConfig);
    files.push({
      id: "supabase-migration",
      path: "supabase/migrations/00000000000000_init.sql",
      content: migration,
      type: "supabase",
      technology: "supabase"
    });
  }

  return files;
}
