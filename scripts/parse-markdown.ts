import fs from "fs";
import path from "path";
import {
  ComponentRef,
  DirectoryNode,
  FileNode,
  MarkdownData,
  MarkdownNode,
  NavigationItem,
  SegmentNode,
} from "../app/(editor)/layout.types";

const MARKDOWN_DIR = path.join(process.cwd(), "data", "markdown");
const DATA_FILE = path.join(process.cwd(), "app", "(editor)", "layout.data.ts");
const STORE_FILE = path.join(
  process.cwd(),
  "app",
  "(editor)",
  "layout.stores.ts"
);

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

function generateUrlPath(relativePath: string): string {
  const parts = relativePath.split(path.sep);
  const cleanParts = parts.map((part) => {
    const orderMatch = part.match(/^(\d+)-(.+)$/);
    return orderMatch ? orderMatch[2].toLowerCase() : part.toLowerCase();
  });
  return "/" + cleanParts.join("/").replace(/\.md$/, "");
}

function extractSectionsAndComponents(
  content: string,
  filePath: string
): {
  segments: SegmentNode[];
  components: ComponentRef[];
  sections: Record<string, Record<string, string>>;
} {
  const segments: SegmentNode[] = [];
  const components: ComponentRef[] = [];
  const sections: Record<string, Record<string, string>> = {};

  const sectionRegex = /<!-- section-(\d+) -->/g;
  let sectionMatch;
  let sectionIndex = 0;

  while ((sectionMatch = sectionRegex.exec(content)) !== null) {
    const sectionId = `section${sectionMatch[1]}`;
    const sectionNumber = sectionMatch[1];

    const sectionFilePath = filePath.replace(
      /\.md$/,
      `.section-${sectionNumber}.md`
    );
    if (fs.existsSync(sectionFilePath)) {
      const sectionContent = fs.readFileSync(sectionFilePath, "utf8");
      const options = extractOptionsFromSection(sectionContent);

      sections[sectionId] = options;

      segments.push({
        id: `${sanitizeFileName(path.basename(filePath))}-${sectionId}`,
        name: sectionId,
        displayName: `Section ${sectionNumber}`,
        type: "segment",
        path: `${sanitizeFileName(path.basename(filePath))}.${sectionId}`,
        urlPath: "",
        content: sectionContent,
        sectionId: sectionId,
        options: options,
      });
    }
    sectionIndex++;
  }

  const componentRegex = /<!-- component-(\w+) -->/g;
  let componentMatch;

  while ((componentMatch = componentRegex.exec(content)) !== null) {
    const componentId = componentMatch[1];
    components.push({
      id: `component-${componentId}`,
      name: componentId,
      displayName: componentId,
      type: "component",
      path: `${sanitizeFileName(path.basename(filePath))}.component.${componentId}`,
      urlPath: "",
      componentId: componentId,
    });
  }

  return { segments, components, sections };
}

function extractOptionsFromSection(content: string): Record<string, string> {
  const options: Record<string, string> = {};
  const optionRegex = /<!-- option-(\d+) -->([\s\S]*?)<!-- \/option-\1 -->/g;
  let match;

  while ((match = optionRegex.exec(content)) !== null) {
    const optionNumber = match[1];
    const optionContent = match[2].trim();
    options[`option${optionNumber}`] = optionContent;
  }

  return options;
}

function parseMarkdownFile(filePath: string, relativePath: string): FileNode {
  const content = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);
  const orderMatch = fileName.match(/^(\d+)-(.+)\.md$/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : undefined;
  const displayName = orderMatch
    ? orderMatch[2]
    : fileName.replace(/\.md$/, "");
  const sanitizedName = sanitizeFileName(fileName);

  const { segments, components, sections } = extractSectionsAndComponents(
    content,
    filePath
  );

  return {
    id: sanitizedName,
    name: sanitizedName,
    displayName: displayName,
    type: "file",
    order: order,
    path: sanitizedName,
    urlPath: generateUrlPath(relativePath),
    content: escapeForJavaScript(content),
    segments: segments,
    components: components,
    sections: sections,
  };
}

function buildMarkdownTree(
  dir: string,
  relativePath = "",
  parentPath = ""
): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const itemRelativePath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
      const dirName = item.name;
      const orderMatch = dirName.match(/^(\d+)-(.+)$/);
      const order = orderMatch ? parseInt(orderMatch[1], 10) : undefined;
      const displayName = orderMatch ? orderMatch[2] : dirName;
      const sanitizedName = sanitizeFileName(dirName);
      const nodePath = parentPath
        ? `${parentPath}.${sanitizedName}`
        : sanitizedName;

      const directoryNode: DirectoryNode = {
        id: nodePath,
        name: sanitizedName,
        displayName: displayName,
        type: "directory",
        order: order,
        path: nodePath,
        urlPath: generateUrlPath(itemRelativePath),
        children: buildMarkdownTree(fullPath, itemRelativePath, nodePath),
      };

      nodes.push(directoryNode);
    } else if (
      item.isFile() &&
      item.name.endsWith(".md") &&
      !item.name.includes(".section")
    ) {
      const fileNode = parseMarkdownFile(fullPath, itemRelativePath);
      fileNode.path = parentPath
        ? `${parentPath}.${fileNode.name}`
        : fileNode.name;
      fileNode.id = fileNode.path;
      nodes.push(fileNode);
    }
  }

  nodes.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.displayName.localeCompare(b.displayName);
  });

  return nodes;
}

function buildFlatIndex(
  nodes: MarkdownNode[],
  index: Record<string, MarkdownNode> = {}
): Record<string, MarkdownNode> {
  for (const node of nodes) {
    index[node.path] = node;

    if (node.type === "directory") {
      buildFlatIndex(node.children, index);
    } else if (node.type === "file") {
      for (const segment of node.segments) {
        index[segment.path] = segment;
      }
      for (const component of node.components) {
        index[component.path] = component;
      }
    }
  }

  return index;
}

function generateNavigationFromTree(nodes: MarkdownNode[]): NavigationItem[] {
  const items: NavigationItem[] = [];

  for (const node of nodes) {
    if (node.type === "directory") {
      items.push({
        name: node.displayName,
        type: "segment",
        order: node.order,
        path: node.path,
        children: generateNavigationFromTree(node.children),
      });
    } else if (node.type === "file") {
      items.push({
        name: node.displayName,
        type: "page",
        order: node.order,
        path: node.path,
      });
    }
  }

  return items;
}

function generateDataFile(
  data: MarkdownData,
  navigation: NavigationItem[]
): string {
  const serializedData = JSON.stringify(data, null, 2);
  const serializedNavigation = JSON.stringify(navigation, null, 2);

  return `import {
  MarkdownData,
  NavigationItem,
} from "./layout.types";

export const markdownData: MarkdownData = ${serializedData};

export const navigationData: NavigationItem[] = ${serializedNavigation};

export const getAllPagesInOrder = (): { path: string; url: string; title: string; order: number }[] => {
  const pages: { path: string; url: string; title: string; order: number }[] = [];
  
  const extractPages = (node: any, parentUrl = ""): void => {
    if (node.type === "file") {
      pages.push({
        path: node.path,
        url: node.urlPath,
        title: node.displayName,
        order: node.order || 0,
      });
    } else if (node.type === "directory" && node.children) {
      for (const child of node.children) {
        extractPages(child, node.urlPath);
      }
    }
  };
  
  if (markdownData.root && markdownData.root.children) {
    for (const child of markdownData.root.children) {
      extractPages(child);
    }
  }
  
  return pages.sort((a, b) => a.order - b.order);
};
`;
}

function updateStoreFile(): void {
  const storeContent = fs.readFileSync(STORE_FILE, "utf8");

  let updatedContent = storeContent;

  updatedContent = updatedContent.replace(
    /import \{[^}]+\} from "\.\/layout\.types";/,
    'import { EditorState, MarkdownData } from "./layout.types";'
  );

  updatedContent = updatedContent.replace(
    /import \{[^}]+\} from "\.\/layout\.data";/g,
    'import { markdownData } from "./layout.data";'
  );

  const initialStateRegex = /const initialState[^;]+;/;
  if (initialStateRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(
      initialStateRegex,
      `const initialState = {
  data: markdownData,
  darkMode: false,
  refreshKey: 0,
  visitedPages: ["welcome"],
  sectionSelections: {},
};`
    );
  }

  const createStoreRegex =
    /export const useEditorStore = create[^(]+\([^)]+\)[^{]+\{[\s\S]*?\}\)/;
  if (createStoreRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(
      createStoreRegex,
      `export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateContent: (path: string, content: string) => {
        set((state) => {
          const node = state.data.flatIndex[path];
          if (node && node.type === "file") {
            node.content = content;
          }
          return { data: { ...state.data } };
        });
      },
      getNode: (path: string) => {
        const state = get();
        return state.data.flatIndex[path] || null;
      },
      setDarkMode: (darkMode) => set({ darkMode }),
      markPageVisited: (path) =>
        set((state) => ({
          visitedPages: state.visitedPages.includes(path)
            ? state.visitedPages
            : [...state.visitedPages, path],
        })),
      isPageVisited: (path) => {
        const state = get();
        return state.visitedPages.includes(path);
      },
      getNextUnvisitedPage: (currentPath) => {
        const state = get();
        const pages = Object.values(state.data.flatIndex)
          .filter((node) => node.type === "file")
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const currentIndex = pages.findIndex((p) => p.path === currentPath);
        for (let i = currentIndex + 1; i < pages.length; i++) {
          if (!state.visitedPages.includes(pages[i].path)) {
            return pages[i].path;
          }
        }
        return null;
      },
      reset: () => set(initialState),
      forceRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
    }),
    {
      name: "editor-storage",
      partialize: (state) => ({
        data: state.data,
        darkMode: state.darkMode,
        visitedPages: state.visitedPages,
      }),
    }
  )`
    );
  }

  fs.writeFileSync(STORE_FILE, updatedContent, "utf8");
  console.log("Successfully updated layout.stores.ts");
}

function main(): void {
  console.log("Parsing markdown files with unified structure...");

  try {
    const children = buildMarkdownTree(MARKDOWN_DIR);

    const rootNode: DirectoryNode = {
      id: "root",
      name: "root",
      displayName: "Root",
      type: "directory",
      path: "",
      urlPath: "/",
      children: children,
    };

    const flatIndex = buildFlatIndex([rootNode]);

    const data: MarkdownData = {
      root: rootNode,
      flatIndex: flatIndex,
    };

    const navigation = generateNavigationFromTree(children);

    const dataFileContent = generateDataFile(data, navigation);
    fs.writeFileSync(DATA_FILE, dataFileContent, "utf8");
    console.log("Successfully created layout.data.ts with unified structure");

    updateStoreFile();

    console.log("Markdown parsing completed successfully!");
    console.log("Generated nodes:", Object.keys(flatIndex).length);
    console.log("Generated navigation items:", navigation.length);
  } catch (error) {
    console.error("Error during markdown parsing:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
