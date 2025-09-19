import fs from "fs";
import path from "path";
import {
  ComponentRef,
  DirectoryNode,
  FileNode,
  MarkdownData,
  MarkdownNode,
  SegmentNode,
} from "../app/(editor)/layout.types";

const MARKDOWN_DIR = path.join(process.cwd(), "data", "markdown");
const DATA_FILE = path.join(process.cwd(), "app", "(editor)", "layout.data.ts");

function escapeForJavaScript(content: string): string {
  return content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    const cleanPart = orderMatch ? orderMatch[2] : part;
    return slugify(cleanPart.replace(/\*/g, '').replace(/\.md$/, ''));
  });
  return "/" + cleanParts.join("/");
}

function extractSectionsAndComponents(
  content: string,
  filePath: string,
  include: boolean = true
): {
  segments: SegmentNode[];
  components: ComponentRef[];
  sections: Record<string, Record<string, { content: string; include: boolean }>>;
} {
  const segments: SegmentNode[] = [];
  const components: ComponentRef[] = [];
  const sections: Record<string, Record<string, { content: string; include: boolean }>> = {};

  const sectionRegex = /<!-- section-(\d+) -->/g;
  let sectionMatch;

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
    }
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
      include: include,
    });
  }

  return { segments, components, sections };
}

function extractOptionsFromSection(content: string): Record<string, { content: string; include: boolean }> {
  const options: Record<string, { content: string; include: boolean }> = {};
  const optionRegex = /<!-- (\*?)option-(\d+) -->([\s\S]*?)<!-- \/option-\2 -->/g;
  let match;

  while ((match = optionRegex.exec(content)) !== null) {
    const hasAsterisk = match[1] === '*';
    const optionNumber = match[2];
    const optionContent = match[3].trim();
    options[`option${optionNumber}`] = {
      content: optionContent,
      include: !hasAsterisk
    };
  }

  return options;
}

function parseMarkdownFile(filePath: string, relativePath: string, parentInclude: boolean = true): FileNode {
  const content = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);
  const orderMatch = fileName.match(/^(\d+)-(.+)\.md$/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : undefined;
  let displayName = orderMatch
    ? orderMatch[2]
    : fileName.replace(/\.md$/, "");
  displayName = displayName.replace(/\*/g, '');
  displayName = displayName.replace(/_/g, ' ');
  const sanitizedName = sanitizeFileName(fileName);

  const hasAsterisk = fileName.includes("*");
  const include = !hasAsterisk && parentInclude;

  const { components, sections } = extractSectionsAndComponents(
    content,
    filePath,
    include
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
    components: components,
    sections: sections,
    include: include,
  };
}

function buildMarkdownTree(
  dir: string,
  relativePath = "",
  parentPath = "",
  parentInclude: boolean = true
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
      let displayName = orderMatch ? orderMatch[2] : dirName;
      displayName = displayName.replace(/\*/g, '');
      displayName = displayName.replace(/_/g, ' ');
      const sanitizedName = sanitizeFileName(dirName);
      const nodePath = parentPath
        ? `${parentPath}.${sanitizedName}`
        : sanitizedName;

      const hasAsterisk = dirName.includes("*");
      const include = !hasAsterisk && parentInclude;

      const directoryNode: DirectoryNode = {
        id: nodePath,
        name: sanitizedName,
        displayName: displayName,
        type: "directory",
        order: order,
        path: nodePath,
        urlPath: generateUrlPath(itemRelativePath),
        include: include,
        children: buildMarkdownTree(fullPath, itemRelativePath, nodePath, include),
      };

      nodes.push(directoryNode);
    } else if (
      item.isFile() &&
      item.name.endsWith(".md") &&
      !item.name.includes(".section")
    ) {
      const fileNode = parseMarkdownFile(fullPath, itemRelativePath, parentInclude);
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
      for (const component of node.components) {
        index[component.path] = component;
      }
    }
  }

  return index;
}


function generateDataFile(data: MarkdownData): string {
  const serializedData = JSON.stringify(data, null, 2);

  return `import {
  MarkdownData,
} from "./layout.types";

export const markdownData: MarkdownData = ${serializedData};

export const getAllPagesInOrder = (): { path: string; url: string; title: string; order: number }[] => {
  const pages: { path: string; url: string; title: string; order: number }[] = [];

  const extractPages = (node: any, parentUrl = ""): void => {
    // Skip nodes with include: false
    if (node.include === false) {
      return;
    }

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

export const getFirstPagePath = (): string => {
  const pages = Object.values(markdownData.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].path : "";
};

export const getFirstPageUrl = (): string => {
  const pages = Object.values(markdownData.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].urlPath : "/";
};
`;
}


function main(): void {
  try {
    const children = buildMarkdownTree(MARKDOWN_DIR);

    const rootNode: DirectoryNode = {
      id: "root",
      name: "root",
      displayName: "Root",
      type: "directory",
      path: "",
      urlPath: "/",
      include: true,
      children: children,
    };

    const flatIndex = buildFlatIndex([rootNode]);

    const data: MarkdownData = {
      root: rootNode,
      flatIndex: flatIndex,
    };

    const dataFileContent = generateDataFile(data);
    fs.writeFileSync(DATA_FILE, dataFileContent, "utf8");
  } catch (error) {
    console.error("Error during markdown parsing:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
