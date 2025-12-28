import fs from "fs";
import path from "path";
import { CODE_FILE_CONFIGS, type FileConfig } from "../lib/code-file-config";
import { createConfigSnapshot, type ConfigSnapshot } from "../lib/config-snapshot";
import type { InitialConfigurationType } from "../app/(editor)/layout.types";
import type { ThemeConfiguration } from "../app/(components)/ThemeConfiguration.types";
import type { Plugin, PrismaTable, RLSPolicy, PrismaColumn } from "../app/(components)/DatabaseConfiguration.types";
import type { IDEType } from "../app/(editor)/layout.types";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "generated-variations");

const DEFAULT_THEME: ThemeConfiguration = {
  selectedTheme: 0,
  colors: {
    light: {
      primary: "0 0% 9%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 96%",
      secondaryForeground: "0 0% 9%",
      accent: "0 0% 96%",
      accentForeground: "0 0% 9%",
      background: "0 0% 100%",
      foreground: "0 0% 3.9%",
      card: "0 0% 100%",
      cardForeground: "0 0% 3.9%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 3.9%",
      muted: "0 0% 96.1%",
      mutedForeground: "0 0% 45.1%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 89.8%",
      input: "0 0% 89.8%",
      ring: "0 0% 3.9%",
      chart1: "12 76% 61%",
      chart2: "173 58% 39%",
      chart3: "197 37% 24%",
      chart4: "43 74% 66%",
      chart5: "27 87% 67%",
      sidebarBackground: "0 0% 98%",
      sidebarForeground: "0 0% 45%",
      sidebarPrimary: "0 0% 9%",
      sidebarPrimaryForeground: "0 0% 98%",
      sidebarAccent: "0 0% 96%",
      sidebarAccentForeground: "0 0% 9%",
      sidebarBorder: "0 0% 90%",
      sidebarRing: "0 0% 4%",
    },
    dark: {
      primary: "0 0% 98%",
      primaryForeground: "0 0% 9%",
      secondary: "0 0% 14.9%",
      secondaryForeground: "0 0% 98%",
      accent: "0 0% 14.9%",
      accentForeground: "0 0% 98%",
      background: "0 0% 3.9%",
      foreground: "0 0% 98%",
      card: "0 0% 3.9%",
      cardForeground: "0 0% 98%",
      popover: "0 0% 3.9%",
      popoverForeground: "0 0% 98%",
      muted: "0 0% 14.9%",
      mutedForeground: "0 0% 63.9%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 14.9%",
      input: "0 0% 14.9%",
      ring: "0 0% 83.1%",
      chart1: "220 70% 50%",
      chart2: "160 60% 45%",
      chart3: "30 80% 55%",
      chart4: "280 65% 60%",
      chart5: "340 75% 55%",
      sidebarBackground: "0 0% 3.9%",
      sidebarForeground: "0 0% 63.9%",
      sidebarPrimary: "0 0% 98%",
      sidebarPrimaryForeground: "0 0% 9%",
      sidebarAccent: "0 0% 14.9%",
      sidebarAccentForeground: "0 0% 98%",
      sidebarBorder: "0 0% 14.9%",
      sidebarRing: "0 0% 83.1%",
    },
  },
  typography: {
    light: { fontSans: "Inter, system-ui, sans-serif", fontSerif: "Georgia, serif", fontMono: "Fira Code, monospace", letterSpacing: 0 },
    dark: { fontSans: "Inter, system-ui, sans-serif", fontSerif: "Georgia, serif", fontMono: "Fira Code, monospace", letterSpacing: 0 },
  },
  other: {
    light: { hueShift: 0, saturationMultiplier: 1, lightnessMultiplier: 1, radius: 0.5, spacing: 1, shadow: { offsetX: 0, offsetY: 4, blurRadius: 6, spread: -1, color: "hsl(0, 0%, 0%)", opacity: 0.1 } },
    dark: { hueShift: 0, saturationMultiplier: 1, lightnessMultiplier: 1, radius: 0.5, spacing: 1, shadow: { offsetX: 0, offsetY: 4, blurRadius: 6, spread: -1, color: "hsl(0, 0%, 0%)", opacity: 0.3 } },
  },
};

const createBaseConfig = (): InitialConfigurationType => ({
  technologies: {
    nextjs: true,
    typescript: true,
    tailwindcss: true,
    shadcn: true,
    zustand: false,
    reactQuery: false,
    supabase: false,
    postgresql: false,
    vercel: true,
    railway: false,
    playwright: false,
    cypress: false,
    resend: false,
    stripe: false,
    paypal: false,
    openrouter: false,
  },
  questions: {
    databaseProvider: "none",
    alwaysOnServer: false,
  },
  features: {
    authentication: {
      enabled: false,
      magicLink: false,
      emailPassword: false,
      otp: false,
      phoneAuth: false,
      googleAuth: false,
      githubAuth: false,
      appleAuth: false,
      emailVerification: false,
      mfa: false,
    },
    admin: {
      enabled: false,
      admin: false,
      superAdmin: false,
    },
    payments: {
      enabled: false,
      paypalPayments: false,
      stripePayments: false,
      stripeSubscriptions: false,
    },
    aiIntegration: {
      enabled: false,
      imageGeneration: false,
      textGeneration: false,
    },
    realTimeNotifications: {
      enabled: false,
      emailNotifications: false,
      inAppNotifications: false,
    },
    fileStorage: false,
  },
  database: { hosting: "neondb" },
  deployment: { platform: "vercel" },
});

interface ConfigVariation {
  name: string;
  description: string;
  config: InitialConfigurationType;
  tables: PrismaTable[];
  rlsPolicies: RLSPolicy[];
  plugins: Plugin[];
}

const AUTH_METHOD_COMBINATIONS: Array<{
  name: string;
  methods: Partial<InitialConfigurationType["features"]["authentication"]>;
}> = [
  { name: "none", methods: {} },
  { name: "emailPassword", methods: { emailPassword: true, enabled: true } },
  { name: "magicLink", methods: { magicLink: true, enabled: true } },
  { name: "otp", methods: { otp: true, enabled: true } },
  { name: "googleAuth", methods: { googleAuth: true, enabled: true } },
  { name: "githubAuth", methods: { githubAuth: true, enabled: true } },
  { name: "appleAuth", methods: { appleAuth: true, enabled: true } },
  { name: "allOAuth", methods: { googleAuth: true, githubAuth: true, appleAuth: true, enabled: true } },
  { name: "emailPassword+OAuth", methods: { emailPassword: true, googleAuth: true, githubAuth: true, enabled: true } },
  { name: "full", methods: { emailPassword: true, magicLink: true, otp: true, googleAuth: true, githubAuth: true, appleAuth: true, enabled: true } },
];

const ROLE_COMBINATIONS: Array<{
  name: string;
  roles: Partial<InitialConfigurationType["features"]["admin"]>;
}> = [
  { name: "none", roles: {} },
  { name: "admin", roles: { admin: true, enabled: true } },
  { name: "superAdmin", roles: { superAdmin: true, enabled: true } },
  { name: "full", roles: { admin: true, superAdmin: true, enabled: true } },
];

const DATABASE_PROVIDERS: Array<"none" | "supabase"> = [
  "none",
  "supabase",
];

const SAMPLE_TABLE: PrismaTable = {
  id: "table-1",
  name: "Post",
  schema: "public",
  isDefault: false,
  isEditable: true,
  columns: [
    { id: "col-1", name: "id", type: "String", isOptional: false, isArray: false, attributes: ["id", "default(cuid())"] },
    { id: "col-2", name: "title", type: "String", isOptional: false, isArray: false, attributes: [] },
    { id: "col-3", name: "content", type: "String", isOptional: true, isArray: false, attributes: [] },
    { id: "col-4", name: "userId", type: "String", isOptional: false, isArray: false, attributes: [] },
    { id: "col-5", name: "createdAt", type: "DateTime", isOptional: false, isArray: false, attributes: ["default(now())"] },
  ] as PrismaColumn[],
  uniqueConstraints: [],
};

const SAMPLE_RLS_POLICY: RLSPolicy = {
  id: "policy-1",
  tableId: "table-1",
  operation: "SELECT",
  rolePolicies: [
    { role: "user", accessType: "own" },
    { role: "admin", accessType: "global" },
  ],
};

function generateVariations(): ConfigVariation[] {
  const variations: ConfigVariation[] = [];

  for (const provider of DATABASE_PROVIDERS) {
    if (provider === "none") {
      const config = createBaseConfig();
      config.questions.databaseProvider = "none";
      variations.push({
        name: `provider-none`,
        description: "No database provider selected",
        config,
        tables: [],
        rlsPolicies: [],
        plugins: [],
      });
      continue;
    }

    const relevantAuthCombos = provider === "supabase"
      ? AUTH_METHOD_COMBINATIONS.filter(a => a.name === "none" || a.name === "emailPassword")
      : AUTH_METHOD_COMBINATIONS;

    const relevantRoleCombos = provider === "supabase"
      ? ROLE_COMBINATIONS.filter(r => r.name === "none" || r.name === "admin")
      : ROLE_COMBINATIONS;

    for (const authCombo of relevantAuthCombos) {
      for (const roleCombo of relevantRoleCombos) {
        const config = createBaseConfig();
        config.questions.databaseProvider = provider;

        if (provider === "supabase") {
          config.technologies.supabase = true;
          config.technologies.postgresql = true;
        }

        config.features.authentication = {
          ...config.features.authentication,
          ...authCombo.methods,
        };

        config.features.admin = {
          ...config.features.admin,
          ...roleCombo.roles,
        };

        const variationName = `${provider}-auth_${authCombo.name}-roles_${roleCombo.name}`;

        variations.push({
          name: variationName,
          description: `Provider: ${provider}, Auth: ${authCombo.name}, Roles: ${roleCombo.name}`,
          config,
          tables: [SAMPLE_TABLE],
          rlsPolicies: [],
          plugins: [],
        });

        if (provider !== "supabase") {
          variations.push({
            name: `${variationName}-withRLS`,
            description: `Provider: ${provider}, Auth: ${authCombo.name}, Roles: ${roleCombo.name}, with RLS`,
            config: { ...config },
            tables: [SAMPLE_TABLE],
            rlsPolicies: [SAMPLE_RLS_POLICY],
            plugins: [],
          });
        }
      }
    }
  }

  return variations;
}

function generateFileForVariation(
  fileConfig: FileConfig,
  variation: ConfigVariation
): { included: boolean; code: string | null; version: string | null } {
  const snapshot = createConfigSnapshot(
    variation.config,
    DEFAULT_THEME,
    variation.tables,
    [],
    variation.rlsPolicies,
    "claudecode" as IDEType
  );

  const included = fileConfig.conditions.include(snapshot);

  if (!included) {
    return { included: false, code: null, version: null };
  }

  const code = fileConfig.generator(snapshot);
  const version = fileConfig.conditions.version?.(snapshot) ?? "v1";

  return { included: true, code, version };
}

function generateReport(): void {
  const variations = generateVariations();
  console.log(`Generated ${variations.length} configuration variations\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const summaryLines: string[] = [
    "# Configuration Variations Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Total Variations: ${variations.length}`,
    "",
    "## Summary by File",
    "",
  ];

  for (const fileConfig of CODE_FILE_CONFIGS) {
    const fileDir = path.join(OUTPUT_DIR, fileConfig.id.replace(/\./g, "_"));
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    const versionMap = new Map<string, { code: string; variations: string[] }>();
    let includedCount = 0;
    let excludedCount = 0;

    for (const variation of variations) {
      const result = generateFileForVariation(fileConfig, variation);

      if (!result.included) {
        excludedCount++;
        continue;
      }

      includedCount++;
      const key = result.version!;

      if (!versionMap.has(key)) {
        versionMap.set(key, { code: result.code!, variations: [] });
      }
      versionMap.get(key)!.variations.push(variation.name);
    }

    summaryLines.push(`### ${fileConfig.id}`);
    summaryLines.push("");
    summaryLines.push(`- **Included in**: ${includedCount} variations`);
    summaryLines.push(`- **Excluded from**: ${excludedCount} variations`);
    summaryLines.push(`- **Unique versions**: ${versionMap.size}`);
    summaryLines.push("");

    if (versionMap.size > 0) {
      summaryLines.push("| Version | Variation Count | Sample Variation |");
      summaryLines.push("|---------|-----------------|------------------|");

      for (const [version, data] of Array.from(versionMap.entries())) {
        summaryLines.push(`| ${version} | ${data.variations.length} | ${data.variations[0]} |`);

        const safeVersion = version.replace(/[^a-zA-Z0-9-_]/g, "_");
        let ext = "ts";
        if (fileConfig.id.includes(".css")) ext = "css";
        else if (fileConfig.id.includes(".md")) ext = "md";
        else if (fileConfig.id.includes(".prisma")) ext = "prisma";
        else if (fileConfig.id.includes(".sql")) ext = "sql";
        const codeFilePath = path.join(fileDir, `${safeVersion}.${ext}`);
        fs.writeFileSync(codeFilePath, data.code);

        const metaFilePath = path.join(fileDir, `${safeVersion}.meta.json`);
        fs.writeFileSync(metaFilePath, JSON.stringify({
          version,
          variationCount: data.variations.length,
          variations: data.variations,
        }, null, 2));
      }

      summaryLines.push("");
    }
  }

  const indexFilePath = path.join(OUTPUT_DIR, "README.md");
  fs.writeFileSync(indexFilePath, summaryLines.join("\n"));

  console.log("Generated files:");
  console.log(`  - Summary: ${indexFilePath}`);
  for (const fileConfig of CODE_FILE_CONFIGS) {
    const fileDir = path.join(OUTPUT_DIR, fileConfig.id.replace(/\./g, "_"));
    const files = fs.existsSync(fileDir) ? fs.readdirSync(fileDir) : [];
    console.log(`  - ${fileConfig.id}: ${files.length} files`);
  }
}

function main(): void {
  console.log("Generating all configuration variations...\n");
  generateReport();
  console.log("\n✅ Generation complete!");
  console.log(`📁 Output location: ${OUTPUT_DIR}`);
}

main();
