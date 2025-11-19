import type { CodeFileNode } from "@/app/(editor)/layout.types";
import { createConfigSnapshot } from "./config-snapshot";
import { CODE_FILE_CONFIGS } from "./code-file-config";
import { IDE_ROBOTS_FILES } from "./code-files.registry";
import { getSelectedIDE } from "./robots-file.utils";
import type { InitialConfigurationType } from "@/app/(editor)/layout.types";
import type { ThemeConfiguration } from "@/app/(components)/ThemeConfiguration.types";
import type { Plugin, PrismaTable, RLSPolicy } from "@/app/(components)/DatabaseConfiguration.types";

export const getCodeFiles = (
  initialConfiguration: InitialConfigurationType,
  theme: ThemeConfiguration,
  plugins: Plugin[],
  tables: PrismaTable[],
  rlsPolicies: RLSPolicy[],
  isPageVisited?: (path: string) => boolean,
  getSectionInclude?: (filePath: string, sectionId: string, optionId: string) => boolean
): CodeFileNode[] => {
  const shouldShowCodeFiles = isPageVisited?.("ide") ?? false;

  if (!shouldShowCodeFiles) {
    return [];
  }

  const selectedIDE = getSectionInclude
    ? getSelectedIDE(getSectionInclude)
    : "claudecode";

  const config = createConfigSnapshot(
    initialConfiguration,
    theme,
    plugins,
    tables,
    rlsPolicies,
    selectedIDE
  );

  const nodes: CodeFileNode[] = [];

  CODE_FILE_CONFIGS.forEach((fileConfig) => {
    if (!fileConfig.conditions.include(config)) {
      return;
    }

    const filePath = typeof fileConfig.path === "function"
      ? fileConfig.path(config)
      : fileConfig.path;

    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join(".");
    const downloadPath = pathParts.slice(0, -1).join("/");

    let fileExtension = "ts";
    if (fileName.endsWith(".css")) {
      fileExtension = "css";
    } else if (fileName.endsWith(".md")) {
      fileExtension = "md";
    } else if (fileName === ".cursorrules" || fileName === ".lovablerules" || fileName === ".replitai") {
      fileExtension = fileName.substring(1);
    } else if (fileName === "CLAUDE") {
      fileExtension = "md";
    }

    let language = "typescript";
    if (fileExtension === "css") {
      language = "css";
    } else if (fileExtension === "md") {
      language = "markdown";
    } else if (fileExtension === "cursorrules" || fileExtension === "lovablerules" || fileExtension === "replitai") {
      language = "text";
    }

    nodes.push({
      id: `code-file-${fileConfig.id}`,
      name: fileName,
      displayName: fileName,
      type: "code-file",
      path: filePath.replace(/\//g, "."),
      urlPath: `/${filePath}`,
      include: true,
      fileExtension,
      language,
      content: () => fileConfig.generator(config),
      includeCondition: () => fileConfig.conditions.include(config),
      visibleAfterPage: "ide",
      parentPath,
      downloadPath,
      previewOnly: true,
    });
  });

  return nodes;
};
