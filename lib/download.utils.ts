import JSZip from "jszip";
import { FileSystemEntry, MarkdownData, MarkdownNode } from "@/app/(editor)/layout.types";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

export const generateRoutesFromFileSystem = (
  entries: FileSystemEntry[],
  parentPath: string = "",
  isRoot: boolean = false
): RouteEntry[] => {
  const routes: RouteEntry[] = [];

  entries.forEach((entry) => {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        routes.push(...generateRoutesFromFileSystem(entry.children, "", false));
      }
      return;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, parentPath, false)
        );
      }
      return;
    }

    if (entry.type === "file" && entry.name === "page.tsx") {
      const route: RouteEntry = {
        path: parentPath || "/",
      };
      routes.push(route);
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = parentPath
        ? `${parentPath}/${entry.name}`
        : `/${entry.name}`;

      const hasPageFile = entry.children.some(
        (child) => child.type === "file" && child.name === "page.tsx"
      );

      if (hasPageFile) {
        const childRoutes = generateRoutesFromFileSystem(
          entry.children,
          newPath,
          false
        );
        if (childRoutes.length > 0) {
          const mainRoute = childRoutes.find((r) => r.path === newPath);
          if (mainRoute) {
            mainRoute.children = childRoutes.filter((r) => r.path !== newPath);
            routes.push(mainRoute);
          } else {
            routes.push({
              path: newPath,
              children: childRoutes,
            });
          }
        } else {
          routes.push({ path: newPath });
        }
      } else {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, newPath, false)
        );
      }
    }
  });

  return routes;
};

export const generateAppStructureAscii = (appStructure: FileSystemEntry[]): string => {
  const lines: string[] = ["```txt", "App Directory Structure:", ""];

  function renderTree(
    entries: FileSystemEntry[],
    parentPrefix = "",
    isLast = true
  ): void {
    entries.forEach((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const prefix = parentPrefix + (isLast ? "    " : "│   ");
      
      lines.push(
        parentPrefix +
          connector +
          entry.name +
          (entry.type === "directory" ? "/" : "")
      );

      if (entry.children && entry.children.length > 0) {
        renderTree(entry.children, prefix, isLastEntry);
      }
    });
  }

  if (appStructure.length > 0) {
    renderTree(appStructure);
  } else {
    lines.push("No app structure defined");
  }

  lines.push("", "```");
  return lines.join("\n");
};

export const generateRouteMapAscii = (appStructure: FileSystemEntry[]): string => {
  const lines: string[] = ["```txt", "Route Map (Generated from App Structure):", ""];
  
  const routes = generateRoutesFromFileSystem(appStructure, "", true);
  
  function renderRoutes(
    routes: RouteEntry[],
    parentPrefix = "",
    isLast = true
  ): void {
    routes.forEach((route, index) => {
      const isLastEntry = index === routes.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const prefix = parentPrefix + (isLast ? "    " : "│   ");
      
      lines.push(parentPrefix + connector + route.path);

      if (route.children && route.children.length > 0) {
        renderRoutes(route.children, prefix, isLastEntry);
      }
    });
  }

  if (routes.length > 0) {
    renderRoutes(routes);
  } else {
    lines.push("No routes defined");
  }

  lines.push("", "```");
  return lines.join("\n");
};

export const processContent = (
  content: string,
  sectionSelections: Record<string, string>,
  getSectionContent: (sectionId: string, optionId: string) => string,
  appStructure: FileSystemEntry[]
): string => {
  let processedContent = content;

  processedContent = processedContent.replace(/<!-- section-(\d+) -->/g, (match, sectionNum) => {
    const sectionId = `section${sectionNum}`;
    const selectedOption = sectionSelections[sectionId];
    
    if (selectedOption) {
      return getSectionContent(sectionId, selectedOption);
    }
    
    return "";
  });

  processedContent = processedContent.replace(/<!-- component-AppStructure -->/g, () => {
    return generateAppStructureAscii(appStructure) + "\n\n" + generateRouteMapAscii(appStructure);
  });

  processedContent = processedContent.replace(/<!-- component-(\w+) -->/g, (match, componentId) => {
    if (componentId === "FullStackOrFrontEnd") {
      return "";
    }
    return `[${componentId} Component]`;
  });

  return processedContent;
};

const processNode = (
  node: MarkdownNode,
  zip: JSZip,
  currentFolder: JSZip,
  sectionSelections: Record<string, string>,
  getSectionContent: (sectionId: string, optionId: string) => string,
  appStructure: FileSystemEntry[]
): void => {
  if (node.type === "directory") {
    const folder = currentFolder.folder(node.name);
    if (folder && node.children) {
      node.children.forEach(child => {
        processNode(child, zip, folder, sectionSelections, getSectionContent, appStructure);
      });
    }
  } else if (node.type === "file") {
    const processedContent = processContent(
      node.content,
      sectionSelections,
      getSectionContent,
      appStructure
    );
    
    const cleanContent = processedContent
      .replace(/\\`/g, '`')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');
    
    currentFolder.file(`${node.name}.md`, cleanContent);
  }
};

export const generateAndDownloadZip = async (
  markdownData: MarkdownData,
  sectionSelections: Record<string, string>,
  getSectionContent: (sectionId: string, optionId: string) => string,
  appStructure: FileSystemEntry[]
): Promise<void> => {
  const zip = new JSZip();

  if (markdownData.root && markdownData.root.children) {
    markdownData.root.children.forEach(child => {
      processNode(child, zip, zip, sectionSelections, getSectionContent, appStructure);
    });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "markdown-documentation.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};