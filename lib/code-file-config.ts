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
    path: "styles/globals.css",
    conditions: {
      include: () => true,
      version: (config) => `theme-v2`,
    },
    generator: (config) => TEMPLATES.globals_css(config),
    metadata: {
      description: "Global CSS styles with theme configuration",
      requiredTech: ["tailwindcss"],
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
