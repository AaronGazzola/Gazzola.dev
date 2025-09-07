import fs from "fs";
import path from "path";

const MARKDOWN_DIR = path.join(process.cwd(), "data", "markdown");
const DATA_FILE = path.join(process.cwd(), "app", "(editor)", "layout.data.ts");
const STORE_FILE = path.join(
  process.cwd(),
  "app",
  "(editor)",
  "layout.stores.ts"
);

interface DynamicComponent {
  id: string;
  type: "select";
  options: Record<string, string>;
  position: number;
}

interface FileInfo {
  path: string;
  content: string;
  displayName: string;
  order?: number;
  dynamicComponents?: DynamicComponent[];
}

function parseDynamicComponents(content: string): {
  content: string;
  components: DynamicComponent[];
} {
  const components: DynamicComponent[] = [];
  const commentRegex = /<!--\s*select:options:\s*(\{[^}]+\})\s*-->/g;
  let match;
  let componentId = 0;

  while ((match = commentRegex.exec(content)) !== null) {
    try {
      const optionsJson = match[1];
      const options = JSON.parse(optionsJson);

      components.push({
        id: `dynamic-${componentId++}`,
        type: "select",
        options,
        position: match.index,
      });
    } catch (error) {
      console.log(
        JSON.stringify(
          { warning: `Invalid JSON in dynamic component: ${match[1]}` },
          null,
          0
        )
      );
    }
  }

  return { content, components };
}

function escapeForJavaScript(content: string): string {
  return content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function sanitizeFileName(fileName: string): string {
  let name = fileName.replace(/\.md$/, "");

  const orderMatch = name.match(/^(\d+)-(.+)$/);
  if (orderMatch) {
    name = orderMatch[2];
  }

  return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function buildNestedStructure(): {
  structure: Record<string, any>;
  navigationData: any[];
  fileInfos: FileInfo[];
} {
  const structure: Record<string, any> = {};
  const fileInfos: FileInfo[] = [];

  function walkDirectory(dir: string, relativePath = ""): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const itemRelativePath = path.join(relativePath, item.name);

      if (item.isDirectory()) {
        walkDirectory(fullPath, itemRelativePath);
      } else if (item.isFile() && item.name.endsWith(".md")) {
        const pathParts = itemRelativePath.split(path.sep);
        const sanitizedFileName = sanitizeFileName(pathParts.pop()!);
        const fileName = item.name.replace(/\.md$/, "");
        const orderMatch = fileName.match(/^(\d+)-(.+)$/);
        const order = orderMatch ? parseInt(orderMatch[1], 10) : undefined;
        const displayName = orderMatch ? orderMatch[2] : fileName;

        let current = structure;
        for (const part of pathParts) {
          const dirName = sanitizeFileName(part);
          if (!current[dirName]) {
            current[dirName] = {};
          }
          current = current[dirName];
        }

        const rawContent = fs.readFileSync(fullPath, "utf8");
        const { content, components } = parseDynamicComponents(rawContent);
        current[sanitizedFileName] = escapeForJavaScript(content);

        fileInfos.push({
          path: itemRelativePath,
          content: content,
          displayName: displayName,
          order: order,
          dynamicComponents: components.length > 0 ? components : undefined,
        });

        console.log(
          `Loaded ${itemRelativePath} -> ${[...pathParts.map(sanitizeFileName), sanitizedFileName].join(".")}`
        );
      }
    }
  }

  walkDirectory(MARKDOWN_DIR);

  const navigationData = generateNavigationFromFiles(fileInfos);

  return { structure, navigationData, fileInfos };
}

function generateNavigationFromFiles(fileInfos: FileInfo[]): any[] {
  const navigationMap: Record<string, any> = {};

  for (const fileInfo of fileInfos) {
    const pathParts = fileInfo.path.split(path.sep);
    const fileName = pathParts.pop()!.replace(/\.md$/, "");

    if (pathParts.length === 0) {
      const item = {
        name: fileInfo.displayName,
        type: "page" as const,
        ...(fileInfo.order !== undefined && { order: fileInfo.order }),
      };
      navigationMap[sanitizeFileName(fileInfo.displayName)] = item;
    } else {
      const dirKey = sanitizeFileName(pathParts[0]);

      if (!navigationMap[dirKey]) {
        navigationMap[dirKey] = {
          name: pathParts[0],
          type: "segment",
          children: [],
        };
      }

      const childItem = {
        name: fileInfo.displayName,
        type: "page" as const,
        ...(fileInfo.order !== undefined && { order: fileInfo.order }),
      };
      navigationMap[dirKey].children.push(childItem);
    }
  }

  const navigationArray = Object.values(navigationMap);

  navigationArray.forEach((item) => {
    if (item.children) {
      item.children.sort((a: any, b: any) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return a.name.localeCompare(b.name);
      });
    }
  });

  navigationArray.sort((a: any, b: any) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });

  return navigationArray;
}

function readMarkdownFiles(): {
  markdownContent: Record<string, any>;
  navigationData: any[];
  fileInfos: FileInfo[];
} {
  console.log("Building nested markdown structure...");
  const { structure, navigationData, fileInfos } = buildNestedStructure();
  return { markdownContent: structure, navigationData, fileInfos };
}

function generateEditorStateInterface(
  obj: Record<string, any>,
  indent = 2
): string {
  const spaces = " ".repeat(indent);
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === "string") {
      return `${spaces}${key}: string;`;
    } else if (typeof value === "object") {
      return `${spaces}${key}: {\n${generateEditorStateInterface(value, indent + 2)}\n${spaces}};`;
    }
    return `${spaces}${key}: string;`;
  });
  return entries.join("\n");
}

function generateContentPaths(obj: Record<string, any>, prefix = ""): string[] {
  const paths: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      paths.push(`"${currentPath}"`);
    } else if (typeof value === "object") {
      paths.push(...generateContentPaths(value, currentPath));
    }
  });

  return paths;
}

function generateDocumentKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const camelCaseKey = prefix
      ? `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`
      : key;

    if (typeof value === "string") {
      keys.push(`"${camelCaseKey}"`);
    } else if (typeof value === "object") {
      keys.push(...generateDocumentKeys(value, camelCaseKey));
    }
  });

  return keys;
}

function generateUrlMapping(fileInfos: FileInfo[]): Record<string, any> {
  const urlMapping: Record<string, any> = {};

  for (const fileInfo of fileInfos) {
    const pathParts = fileInfo.path.split(path.sep);
    const fileName = pathParts.pop()!.replace(/\.md$/, "");

    if (pathParts.length === 0) {
      const sanitizedName = sanitizeFileName(fileName);
      const cleanUrlKey = fileInfo.displayName.toLowerCase();
      urlMapping[cleanUrlKey] = sanitizedName;
    } else {
      const dirName = pathParts[0];
      const sanitizedDirName = sanitizeFileName(dirName);
      const sanitizedFileName = sanitizeFileName(fileName);
      const contentPath = `${sanitizedDirName}.${sanitizedFileName}`;
      const cleanUrlKey = fileInfo.displayName.toLowerCase();

      if (!urlMapping[dirName.toLowerCase()]) {
        urlMapping[dirName.toLowerCase()] = {};
      }

      urlMapping[dirName.toLowerCase()][cleanUrlKey] = contentPath;
    }
  }

  return urlMapping;
}

function generateDataFile(
  markdownContent: Record<string, any>,
  navigationData: any[],
  urlMapping: Record<string, any>,
  fileInfos: FileInfo[]
): string {
  function serializeObject(obj: any, indent = 2): string {
    const spaces = " ".repeat(indent);
    const entries = Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string") {
        return `${spaces}${key}: \`${value}\``;
      } else if (typeof value === "object") {
        return `${spaces}${key}: {\n${serializeObject(value, indent + 2)}\n${spaces}}`;
      }
      return `${spaces}${key}: ${value}`;
    });
    return entries.join(",\n");
  }

  const componentsMapping: Record<string, DynamicComponent[]> = {};
  fileInfos.forEach((fileInfo) => {
    if (fileInfo.dynamicComponents) {
      const pathParts = fileInfo.path.split(path.sep);
      const fileName = pathParts.pop()!.replace(/\.md$/, "");

      if (pathParts.length === 0) {
        const sanitizedName = sanitizeFileName(fileName);
        componentsMapping[sanitizedName] = fileInfo.dynamicComponents;
      } else {
        const dirName = pathParts[0];
        const sanitizedDirName = sanitizeFileName(dirName);
        const sanitizedFileName = sanitizeFileName(fileName);
        const contentPath = `${sanitizedDirName}.${sanitizedFileName}`;
        componentsMapping[contentPath] = fileInfo.dynamicComponents;
      }
    }
  });

  const serializedContent = serializeObject(markdownContent);
  const serializedNavigation = JSON.stringify(navigationData, null, 2);
  const serializedUrlMapping = JSON.stringify(urlMapping, null, 2);
  const serializedComponents = JSON.stringify(componentsMapping, null, 2);

  const editorStateInterface = generateEditorStateInterface(markdownContent);
  const contentPaths = generateContentPaths(markdownContent);
  const documentKeys = generateDocumentKeys(markdownContent);

  return `import { NavigationItem } from "@/configuration";

export interface DynamicComponent {
  id: string;
  type: 'select';
  options: Record<string, string>;
  position: number;
}

export const markdownContent = {
${serializedContent}
};

export const navigationData: NavigationItem[] = ${serializedNavigation};

export const urlToContentPathMapping = ${serializedUrlMapping};

export const dynamicComponents: Record<string, DynamicComponent[]> = ${serializedComponents};

export interface EditorState {
${editorStateInterface}
  darkMode: boolean;
  refreshKey: number;
  visitedPages: ContentPath[];
  setContent: (path: ContentPath, content: string) => void;
  getContent: (path: ContentPath) => string;
  setDarkMode: (darkMode: boolean) => void;
  markPageVisited: (path: ContentPath) => void;
  isPageVisited: (path: ContentPath) => boolean;
  getNextUnvisitedPage: (currentPath: ContentPath) => ContentPath | null;
  reset: () => void;
  forceRefresh: () => void;
}

export type ContentPath =
  | ${contentPaths.join("\n  | ")};

export type DocumentKey =
  | ${documentKeys.join("\n  | ")};

export const getAllPagesInOrder = (): { path: ContentPath; url: string; title: string; order: number }[] => {
  const pages: { path: ContentPath; url: string; title: string; order: number }[] = [];

  const flattenNavigation = (items: NavigationItem[]) => {
    items.forEach((item) => {
      if (item.type === "page") {
        pages.push({
          path: item.name as ContentPath,
          url: \`/\${item.name}\`,
          title: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          order: item.order || 0
        });
      } else if (item.type === "segment" && item.children) {
        item.children.forEach((child) => {
          if (child.type === "page") {
            const childNameLower = child.name.toLowerCase();
            const pathSuffix = childNameLower === "next.js" ? "nextjs" : childNameLower;
            const path = \`\${item.name}.\${pathSuffix}\` as ContentPath;
            const url = \`/\${item.name}/\${childNameLower}\`;
            pages.push({
              path,
              url,
              title: child.name,
              order: child.order || 0
            });
          }
        });
      }
    });
  };

  flattenNavigation(navigationData);
  return pages.sort((a, b) => a.order - b.order);
};
`;
}

function createDataFile(dataFileContent: string): void {
  fs.writeFileSync(DATA_FILE, dataFileContent, "utf8");
  console.log(
    "Successfully created layout.data.ts with markdown content and navigation data"
  );
}

function updateStoreFile(): void {
  const storeContent = fs.readFileSync(STORE_FILE, "utf8");

  let updatedContent = storeContent;

  if (!updatedContent.includes("import { markdownContent }")) {
    updatedContent = updatedContent.replace(
      'import { EditorState } from "./layout.types";',
      'import { EditorState } from "./layout.types";\nimport { markdownContent } from "./layout.data";'
    );
  }

  if (!updatedContent.includes("const initialState = markdownContent;")) {
    const initialStateRegex = /const initialState = \{[\s\S]*?\};/;

    if (initialStateRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        initialStateRegex,
        "const initialState = markdownContent;"
      );
    } else if (
      updatedContent.includes("const initialState = markdownContent;")
    ) {
      console.log("Store file already uses markdownContent");
    } else {
      throw new Error("Could not find initialState in store file");
    }
  }

  fs.writeFileSync(STORE_FILE, updatedContent, "utf8");

  console.log("Successfully updated layout.stores.ts to use layout.data.ts");
}

function main(): void {
  console.log("Compiling markdown files to store initial state...");

  try {
    const { markdownContent, navigationData, fileInfos } = readMarkdownFiles();
    const urlMapping = generateUrlMapping(fileInfos);
    const dataFileContent = generateDataFile(
      markdownContent,
      navigationData,
      urlMapping,
      fileInfos
    );
    createDataFile(dataFileContent);
    updateStoreFile();

    console.log("Markdown compilation completed successfully!");
    console.log(
      "Generated nested structure with top-level keys:",
      Object.keys(markdownContent)
    );
    console.log("Generated navigation items:", navigationData.length);
    console.log("Generated URL mappings:", Object.keys(urlMapping));
  } catch (error) {
    console.error("Error during markdown compilation:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
