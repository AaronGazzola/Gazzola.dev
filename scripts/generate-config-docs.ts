import fs from "fs";
import path from "path";
import { CODE_FILE_CONFIGS, type FileConfig } from "../lib/code-file-config";
import { createConfigSnapshot, type ConfigSnapshot } from "../lib/config-snapshot";
import type { InitialConfigurationType } from "../app/(editor)/layout.types";
import type { ThemeConfiguration } from "../app/(components)/ThemeConfiguration.types";
import type { Plugin, PrismaTable, RLSPolicy } from "../app/(components)/DatabaseConfiguration.types";
import type { IDEType } from "../app/(editor)/layout.types";

const DOCS_DIR = path.join(process.cwd(), "docs", "code-files");

const createMinimalConfig = (): ConfigSnapshot => {
  const minimalInitialConfig: InitialConfigurationType = {
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
        emailPassword: false,
        magicLink: false,
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
    database: {
      hosting: "neondb",
    },
    deployment: {
      platform: "vercel",
    },
  };

  const minimalTheme: ThemeConfiguration = {
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
      light: {
        fontSans: "Inter, system-ui, sans-serif",
        fontSerif: "Georgia, serif",
        fontMono: "Fira Code, monospace",
        letterSpacing: 0,
      },
      dark: {
        fontSans: "Inter, system-ui, sans-serif",
        fontSerif: "Georgia, serif",
        fontMono: "Fira Code, monospace",
        letterSpacing: 0,
      },
    },
    other: {
      light: {
        hueShift: 0,
        saturationMultiplier: 1,
        lightnessMultiplier: 1,
        radius: 0.5,
        spacing: 1,
        shadow: {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 6,
          spread: -1,
          color: "hsl(0, 0%, 0%)",
          opacity: 0.1,
        },
      },
      dark: {
        hueShift: 0,
        saturationMultiplier: 1,
        lightnessMultiplier: 1,
        radius: 0.5,
        spacing: 1,
        shadow: {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 6,
          spread: -1,
          color: "hsl(0, 0%, 0%)",
          opacity: 0.3,
        },
      },
    },
  };

  return createConfigSnapshot(
    minimalInitialConfig,
    minimalTheme,
    [],
    [],
    [],
    "claudecode"
  );
};

const generateFileDocumentation = (fileConfig: FileConfig): string => {
  const lines: string[] = [];

  const filePath = typeof fileConfig.path === "function"
    ? fileConfig.path(createMinimalConfig())
    : fileConfig.path;

  lines.push(`# ${filePath}`);
  lines.push("");
  lines.push(`**Description:** ${fileConfig.metadata.description}`);
  lines.push("");

  if (fileConfig.metadata.requiredTech.length > 0) {
    lines.push(`**Required Technologies:** ${fileConfig.metadata.requiredTech.join(", ")}`);
    lines.push("");
  }

  if (fileConfig.metadata.requiredFeatures.length > 0) {
    lines.push(`**Required Features:** ${fileConfig.metadata.requiredFeatures.join(", ")}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## Inclusion Conditions");
  lines.push("");
  lines.push("```typescript");
  lines.push(fileConfig.conditions.include.toString());
  lines.push("```");
  lines.push("");

  const minimalConfig = createMinimalConfig();
  const isIncluded = fileConfig.conditions.include(minimalConfig);

  lines.push("**Excluded When:**");
  lines.push("- File is conditionally included based on configuration");
  lines.push("");

  lines.push("---");
  lines.push("");

  const variations = generateVariations(fileConfig);

  variations.forEach((variation, index) => {
    lines.push(`## Variation ${index + 1}: ${variation.name}`);
    lines.push("");
    lines.push("**Config Requirements:**");
    Object.entries(variation.config).forEach(([key, value]) => {
      lines.push(`- \`${key}: ${JSON.stringify(value)}\``);
    });
    lines.push("");
    lines.push("**Generated Code:**");
    lines.push("```typescript");
    lines.push(variation.code);
    lines.push("```");
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
};

const generateVariations = (fileConfig: FileConfig): Array<{ name: string; config: Record<string, unknown>; code: string }> => {
  const variations: Array<{ name: string; config: Record<string, unknown>; code: string }> = [];

  const baseConfig = createMinimalConfig();

  if (fileConfig.id === "globals.css") {
    variations.push({
      name: "Default Theme",
      config: { theme: "default" },
      code: fileConfig.generator(baseConfig).substring(0, 500) + "\n... (truncated for brevity)",
    });
  } else {
    if (fileConfig.conditions.include(baseConfig)) {
      variations.push({
        name: "Default",
        config: {},
        code: fileConfig.generator(baseConfig),
      });
    }
  }

  return variations;
};

const generateIndexDocumentation = (): string => {
  const lines: string[] = [];

  lines.push("# Code Files Configuration Reference");
  lines.push("");
  lines.push("Auto-generated documentation for all code files based on configuration.");
  lines.push("");
  lines.push("## Files Overview");
  lines.push("");
  lines.push("| File | Path | Always Included | Technologies | Features |");
  lines.push("|------|------|-----------------|--------------|----------|");

  CODE_FILE_CONFIGS.forEach((config) => {
    const minimalConfig = createMinimalConfig();
    const filePath = typeof config.path === "function"
      ? config.path(minimalConfig)
      : config.path;
    const alwaysIncluded = config.conditions.include(minimalConfig) ? "Yes" : "No";
    const tech = config.metadata.requiredTech.join(", ") || "-";
    const features = config.metadata.requiredFeatures.join(", ") || "-";

    lines.push(`| [${config.id}](./${config.id.replace(/\./g, "_")}.md) | \`${filePath}\` | ${alwaysIncluded} | ${tech} | ${features} |`);
  });

  lines.push("");
  lines.push("## Files by Technology");
  lines.push("");

  const techGroups: Record<string, FileConfig[]> = {};
  CODE_FILE_CONFIGS.forEach((config) => {
    config.metadata.requiredTech.forEach((tech) => {
      if (!techGroups[tech]) {
        techGroups[tech] = [];
      }
      techGroups[tech].push(config);
    });
  });

  Object.entries(techGroups).forEach(([tech, configs]) => {
    lines.push(`### ${tech}`);
    configs.forEach((config) => {
      lines.push(`- [${config.id}](./${config.id.replace(/\./g, "_")}.md)`);
    });
    lines.push("");
  });

  lines.push("## Always Included");
  CODE_FILE_CONFIGS.filter((c) => c.conditions.include(createMinimalConfig())).forEach((config) => {
    lines.push(`- [${config.id}](./${config.id.replace(/\./g, "_")}.md)`);
  });
  lines.push("");

  return lines.join("\n");
};

const main = () => {
  console.log("Generating code files documentation...");

  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const indexContent = generateIndexDocumentation();
  fs.writeFileSync(path.join(DOCS_DIR, "index.md"), indexContent);
  console.log("✓ Generated index.md");

  CODE_FILE_CONFIGS.forEach((config) => {
    const docContent = generateFileDocumentation(config);
    const filename = `${config.id.replace(/\./g, "_")}.md`;
    fs.writeFileSync(path.join(DOCS_DIR, filename), docContent);
    console.log(`✓ Generated ${filename}`);
  });

  console.log("\n✅ Documentation generation complete!");
  console.log(`📁 Documentation location: ${DOCS_DIR}`);
};

main();
