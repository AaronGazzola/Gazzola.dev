import type { ConfigSnapshot } from "./config-snapshot";
import { TEMPLATES } from "./code-templates";
import { IDE_ROBOTS_FILES } from "./code-files.registry";

export interface FileConfig {
  id: string;
  path: string | ((config: ConfigSnapshot) => string);
  conditions: {
    include: (config: ConfigSnapshot) => boolean;
    version?: (config: ConfigSnapshot) => string;
  };
  generator: (config: ConfigSnapshot) => string;
  metadata: {
    description: string;
    requiredTech: string[];
    requiredFeatures: string[];
  };
}

export const CODE_FILE_CONFIGS: FileConfig[] = [
  {
    id: "globals.css",
    path: "app/globals.css",
    conditions: {
      include: () => true,
      version: (config) => `theme-v1`,
    },
    generator: (config) => TEMPLATES.globals_css(config),
    metadata: {
      description: "Global CSS styles with theme configuration",
      requiredTech: ["tailwindcss"],
      requiredFeatures: [],
    },
  },

  {
    id: "auth.ts",
    path: "lib/auth.ts",
    conditions: {
      include: (config) => config.betterAuth && config.databaseProvider !== "supabase",
      version: (config) => {
        const enabledPlugins = config.plugins
          .filter((p) => p.enabled && p.file === "auth")
          .map((p) => p.name)
          .sort()
          .join(",");
        return `betterAuth-${enabledPlugins || "basic"}`;
      },
    },
    generator: (config) => {
      const authPlugins = config.plugins.filter((p) => p.enabled && p.file === "auth");
      if (authPlugins.length === 0) {
        return TEMPLATES.auth.basic();
      }
      return TEMPLATES.auth.withPlugins(authPlugins);
    },
    metadata: {
      description: "Better Auth server configuration",
      requiredTech: ["betterAuth", "prisma"],
      requiredFeatures: ["authentication"],
    },
  },

  {
    id: "auth-client.ts",
    path: "lib/auth-client.ts",
    conditions: {
      include: (config) => config.betterAuth && config.databaseProvider !== "supabase",
      version: (config) => {
        const enabledPlugins = config.plugins
          .filter((p) => p.enabled && p.file === "auth-client")
          .map((p) => p.name)
          .sort()
          .join(",");
        return `betterAuth-client-${enabledPlugins || "basic"}`;
      },
    },
    generator: (config) => {
      const authClientPlugins = config.plugins.filter((p) => p.enabled && p.file === "auth-client");
      if (authClientPlugins.length === 0) {
        return TEMPLATES.authClient.basic();
      }
      return TEMPLATES.authClient.withPlugins(authClientPlugins);
    },
    metadata: {
      description: "Better Auth client-side configuration",
      requiredTech: ["betterAuth"],
      requiredFeatures: ["authentication"],
    },
  },

  {
    id: "auth.util.ts",
    path: "lib/auth.util.ts",
    conditions: {
      include: (config) => config.prisma && config.betterAuth,
      version: () => "v1",
    },
    generator: () => TEMPLATES.authUtil(),
    metadata: {
      description: "Authentication utility functions for RLS and JWT",
      requiredTech: ["prisma", "betterAuth"],
      requiredFeatures: ["authentication"],
    },
  },

  {
    id: "prisma-rls.ts",
    path: "lib/prisma-rls.ts",
    conditions: {
      include: (config) => config.prisma && config.rlsPolicies.length > 0,
      version: (config) => `rls-${config.rlsPolicies.length}-policies`,
    },
    generator: (config) => TEMPLATES.prismaRLS(config.rlsPolicies, config.tables),
    metadata: {
      description: "Prisma RLS policy definitions",
      requiredTech: ["prisma"],
      requiredFeatures: [],
    },
  },

  {
    id: "prisma-rls-client.ts",
    path: "lib/prisma-rls-client.ts",
    conditions: {
      include: (config) => config.prisma && config.rlsPolicies.length > 0,
      version: () => "v1",
    },
    generator: () => TEMPLATES.prismaRLSClient(),
    metadata: {
      description: "Prisma RLS client wrapper",
      requiredTech: ["prisma"],
      requiredFeatures: [],
    },
  },

  {
    id: "log.utils.ts",
    path: "lib/log.utils.ts",
    conditions: {
      include: () => true,
      version: () => "v1",
    },
    generator: () => TEMPLATES.logUtils(),
    metadata: {
      description: "Logging utilities with conditional output",
      requiredTech: [],
      requiredFeatures: [],
    },
  },

  {
    id: "robots-file",
    path: (config: ConfigSnapshot) => {
      const robotsConfig = IDE_ROBOTS_FILES[config.selectedIDE];
      return `${robotsConfig.fileName}`;
    },
    conditions: {
      include: () => true,
      version: (config) => `ide-${config.selectedIDE}`,
    },
    generator: () => TEMPLATES.robotsFile(),
    metadata: {
      description: "IDE-specific configuration file for AI coding assistants",
      requiredTech: [],
      requiredFeatures: [],
    },
  },
];
