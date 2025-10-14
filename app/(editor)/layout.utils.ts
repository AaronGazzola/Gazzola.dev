import { FileSystemEntry } from "./layout.types";

const stripGroupSegments = (path: string): string => {
  let stripped = path.replace(/\/\([^)]+\)/g, "");
  if (!stripped.startsWith("/")) {
    stripped = "/" + stripped;
  }
  if (stripped === "//" || stripped === "") {
    stripped = "/";
  }
  return stripped;
};

export const findLayoutsForPagePath = (
  entries: FileSystemEntry[],
  pagePath: string,
  currentPath: string = "",
  isRoot: boolean = false
): string[] => {
  const layoutsSet = new Set<string>();

  const normalizedPagePath =
    pagePath.endsWith("/") && pagePath !== "/"
      ? pagePath.slice(0, -1)
      : pagePath;

  const pathExistsInSubtree = (
    nodes: FileSystemEntry[],
    targetPath: string,
    currentDir: string
  ): boolean => {
    const currentDirNormalized = currentDir || "/";
    if (targetPath === currentDirNormalized) {
      const hasPageFile = nodes.some(
        (child) => child.type === "file" && child.name === "page.tsx"
      );
      if (hasPageFile) return true;
    }

    for (const entry of nodes) {
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        if (entry.children) {
          if (pathExistsInSubtree(entry.children, targetPath, currentDir)) {
            return true;
          }
        }
        continue;
      }

      if (entry.type === "directory" && entry.children) {
        const newPath = currentDir
          ? `${currentDir}/${entry.name}`
          : `/${entry.name}`;

        if (targetPath === newPath) {
          const hasPageFile = entry.children.some(
            (child) => child.type === "file" && child.name === "page.tsx"
          );
          if (hasPageFile) return true;
        }

        if (targetPath.startsWith(newPath + "/")) {
          if (pathExistsInSubtree(entry.children, targetPath, newPath)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const findLayoutsRecursive = (
    nodes: FileSystemEntry[],
    currentDir: string,
    targetPath: string
  ): void => {
    for (const entry of nodes) {
      if (entry.name === "app" && isRoot) {
        if (entry.children) {
          const hasRootLayout = entry.children.some(
            (child) => child.type === "file" && child.name === "layout.tsx"
          );
          if (hasRootLayout) {
            layoutsSet.add("/");
          }
          findLayoutsRecursive(entry.children, "", targetPath);
        }
        continue;
      }

      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        if (entry.children) {
          const hasLayout = entry.children.some(
            (child) => child.type === "file" && child.name === "layout.tsx"
          );

          const routeGroupPath = currentDir
            ? `${currentDir}/${entry.name}`
            : `/${entry.name}`;
          const targetPathExistsInGroup = pathExistsInSubtree(
            entry.children,
            targetPath,
            currentDir
          );

          if (hasLayout && targetPathExistsInGroup) {
            layoutsSet.add(routeGroupPath);
          }

          findLayoutsRecursive(entry.children, routeGroupPath, targetPath);
        }
        continue;
      }

      if (entry.type === "directory" && entry.children) {
        const newPath = currentDir
          ? `${currentDir}/${entry.name}`
          : `/${entry.name}`;
        const newPathUrl = stripGroupSegments(newPath);

        if (targetPath === newPathUrl || targetPath.startsWith(newPathUrl + "/")) {
          const hasLayout = entry.children.some(
            (child) => child.type === "file" && child.name === "layout.tsx"
          );

          if (hasLayout) {
            layoutsSet.add(newPath);
          }

          findLayoutsRecursive(entry.children, newPath, targetPath);
        }
      }
    }
  };

  findLayoutsRecursive(entries, currentPath, normalizedPagePath);

  const layouts = Array.from(layoutsSet);
  return layouts.sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;

    const getEffectiveDepth = (path: string): number => {
      if (path === "/") return 0;
      const withoutGroups = path.replace(/\/\([^)]+\)/g, "");
      return withoutGroups === "" ? 1 : withoutGroups.split("/").length;
    };

    const aDepth = getEffectiveDepth(a);
    const bDepth = getEffectiveDepth(b);

    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }

    const aIsGroup = a.includes("(") && a.includes(")");
    const bIsGroup = b.includes("(") && b.includes(")");

    if (aIsGroup && !bIsGroup) return -1;
    if (!aIsGroup && bIsGroup) return 1;

    return a.localeCompare(b);
  });
};