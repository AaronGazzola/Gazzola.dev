"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { conditionalLog } from "@/lib/log.util";
import fs from "fs";
import path from "path";
import { MarkdownData } from "./layout.types";

interface ComponentRef {
  id: string;
  name: string;
  displayName: string;
  type: "component";
  path: string;
  urlPath: string;
  componentId: string;
  include: boolean;
}

interface SegmentNode {
  id: string;
  name: string;
  displayName: string;
  type: "segment";
  path: string;
  urlPath: string;
  sectionId: string;
  optionId: string;
  content: string;
  options?: Record<string, { content: string; include: boolean }>;
  include: boolean;
}

interface FileNode {
  id: string;
  name: string;
  displayName: string;
  type: "file";
  order?: number;
  path: string;
  urlPath: string;
  content: string;
  components: ComponentRef[];
  sections: Record<string, Record<string, { content: string; include: boolean }>>;
  include: boolean;
}

interface DirectoryNode {
  id: string;
  name: string;
  displayName: string;
  type: "directory";
  order?: number;
  path: string;
  urlPath: string;
  include: boolean;
  children: MarkdownNode[];
}

type MarkdownNode = FileNode | DirectoryNode | ComponentRef | SegmentNode;

const MARKDOWN_DIR = path.join(process.cwd(), "public", "data", "markdown");
const OUTPUT_FILE = path.join(process.cwd(), "public", "data", "processed-markdown.json");
const VERSION_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "content-version.json"
);

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
    const aOrder = (a.type === "file" || a.type === "directory") ? a.order : undefined;
    const bOrder = (b.type === "file" || b.type === "directory") ? b.order : undefined;

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;
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

function processMarkdownData(): MarkdownData {
  console.log(conditionalLog("processMarkdownData: Starting markdown processing", { label: "markdown-parse" }));

  let contentVersion = 1;
  if (fs.existsSync(VERSION_FILE)) {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
    contentVersion = versionData.version || 1;
  }

  console.log(conditionalLog({ contentVersion, versionFile: VERSION_FILE }, { label: "markdown-parse" }));

  const children = fs.existsSync(MARKDOWN_DIR) ? buildMarkdownTree(MARKDOWN_DIR) : [];
  console.log(conditionalLog({ childrenCount: children.length }, { label: "markdown-parse" }));

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
  console.log(conditionalLog({ flatIndexCount: Object.keys(flatIndex).length }, { label: "markdown-parse" }));

  const data: MarkdownData = {
    root: rootNode,
    flatIndex: flatIndex,
    contentVersion: contentVersion,
  };

  return data;
}

export const getContentVersionAction = async (): Promise<
  ActionResponse<number>
> => {
  try {
    console.log(conditionalLog("getContentVersionAction: Starting", { label: "markdown-parse" }));

    if (!fs.existsSync(VERSION_FILE)) {
      console.log(conditionalLog("getContentVersionAction: Version file not found, returning 1", { label: "markdown-parse" }));
      return getActionResponse({ data: 1 });
    }

    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
    const version = versionData.version || 1;

    console.log(conditionalLog({ version, versionFile: VERSION_FILE }, { label: "markdown-parse" }));

    return getActionResponse({ data: version });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const parseMarkdownAction = async (): Promise<ActionResponse<MarkdownData>> => {
  try {
    console.log(conditionalLog("parseMarkdownAction: Starting", { label: "markdown-parse" }));

    const markdownData = processMarkdownData();

    console.log(conditionalLog({
      nodeCount: Object.keys(markdownData.flatIndex).length,
      contentVersion: markdownData.contentVersion
    }, { label: "markdown-parse" }));

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(markdownData, null, 2), "utf8");

    console.log(conditionalLog({ message: "File written", outputFile: OUTPUT_FILE }, { label: "markdown-parse" }));

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const parseAndGetMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(conditionalLog("parseAndGetMarkdownDataAction: Starting", { label: "markdown-parse" }));

    const markdownData = processMarkdownData();

    console.log(conditionalLog({
      nodeCount: Object.keys(markdownData.flatIndex).length,
      contentVersion: markdownData.contentVersion
    }, { label: "markdown-parse" }));

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(markdownData, null, 2), "utf8");

    console.log(conditionalLog({ message: "File written and returning data", outputFile: OUTPUT_FILE }, { label: "markdown-parse" }));

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};

export const getMarkdownDataAction = async (): Promise<
  ActionResponse<MarkdownData>
> => {
  try {
    console.log(conditionalLog("getMarkdownDataAction: Starting", { label: "markdown-parse" }));

    if (fs.existsSync(OUTPUT_FILE)) {
      console.log(conditionalLog({ message: "Reading from file", outputFile: OUTPUT_FILE }, { label: "markdown-parse" }));

      const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
      const data: MarkdownData = JSON.parse(fileContent);

      console.log(conditionalLog({
        nodeCount: Object.keys(data.flatIndex).length,
        contentVersion: data.contentVersion
      }, { label: "markdown-parse" }));

      return getActionResponse({ data });
    }

    console.log(conditionalLog({ message: "File not found, generating data", outputFile: OUTPUT_FILE }, { label: "markdown-parse" }));

    const markdownData = processMarkdownData();

    console.log(conditionalLog({
      nodeCount: Object.keys(markdownData.flatIndex).length,
      contentVersion: markdownData.contentVersion
    }, { label: "markdown-parse" }));

    return getActionResponse({ data: markdownData });
  } catch (error) {
    console.log(conditionalLog({ error: String(error) }, { label: "markdown-parse" }));
    return getActionResponse({ error });
  }
};
