"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import {
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FoldVertical,
  Layers,
  Plus,
  SquareStack,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const LAYOUT_COLORS = [
  {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-300 dark:border-green-700",
    icon: "text-green-500",
    text: "text-green-800 dark:text-green-200",
  },
  {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    icon: "text-purple-500",
    text: "text-purple-800 dark:text-purple-200",
  },
  {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-300 dark:border-orange-700",
    icon: "text-orange-500",
    text: "text-orange-800 dark:text-orange-200",
  },
  {
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    icon: "text-red-500",
    text: "text-red-800 dark:text-red-200",
  },
  {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    border: "border-indigo-300 dark:border-indigo-700",
    icon: "text-indigo-500",
    text: "text-indigo-800 dark:text-indigo-200",
  },
  {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    border: "border-cyan-300 dark:border-cyan-700",
    icon: "text-cyan-500",
    text: "text-cyan-800 dark:text-cyan-200",
  },
];

const PAGE_COLOR = {
  bg: "bg-slate-100 dark:bg-slate-900/30",
  border: "border-slate-300 dark:border-slate-700",
  icon: "text-slate-500",
  text: "text-slate-800 dark:text-slate-200",
};


const LayoutHierarchyPopover = ({
  pagePath,
  appStructure,
  darkMode,
  onOpenChange,
}: {
  pagePath: string;
  appStructure: FileSystemEntry[];
  darkMode: boolean;
  onOpenChange?: (open: boolean, pagePath: string, layouts: string[]) => void;
}) => {
  const layouts = findLayoutsForPagePath(appStructure, pagePath, "", true);

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open, pagePath, layouts);
    }
  };

  const renderNestedBoxes = () => {
    if (layouts.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No layout files found for this page
        </div>
      );
    }

    let content = (
      <div
        className={cn(
          PAGE_COLOR.bg,
          "border-2",
          PAGE_COLOR.border,
          "rounded p-3 text-center"
        )}
      >
        <div className={cn("text-sm font-mono font-semibold", PAGE_COLOR.text)}>
          {pagePath}
        </div>
        <div className={cn("text-xs mt-1", PAGE_COLOR.text)}>page.tsx</div>
      </div>
    );

    for (let i = layouts.length - 1; i >= 0; i--) {
      const layout = layouts[i];
      const layoutName = `app${layout}/layout.tsx`;
      const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];

      content = (
        <div
          className={cn(
            colorSet.bg,
            "border-2",
            colorSet.border,
            "rounded p-3"
          )}
        >
          <div
            className={cn("text-xs mb-2 text-center font-mono", colorSet.text)}
          >
            {layoutName}
          </div>
          {content}
        </div>
      );
    }

    return content;
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-2"
          title="Show layout hierarchy"
        >
          <Layers className="!w-4 !h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start" side="right">
        <div className="space-y-2">
          <h4
            className={cn(
              "font-semibold text-sm",
              darkMode ? "text-gray-200" : "text-gray-800"
            )}
          >
            Layout Hierarchy
          </h4>
          <p className="text-xs text-muted-foreground">
            Nested layouts that wrap this page according to Next.js App Router
          </p>
          <div className="mt-4">{renderNestedBoxes()}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const generateRoutesFromFileSystem = (
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

const findFileSystemEntryForPath = (
  entries: FileSystemEntry[],
  targetPath: string,
  currentPath: string = "",
  isRoot: boolean = false
): { entry: FileSystemEntry; segmentIndex: number } | null => {
  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          currentPath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (targetPath === newPath || targetPath.startsWith(newPath + "/")) {
        const currentSegments = newPath.split("/").filter(Boolean);

        if (targetPath === newPath) {
          return { entry, segmentIndex: currentSegments.length - 1 };
        }

        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          newPath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const updateFileSystemEntryName = (
  entries: FileSystemEntry[],
  targetEntry: FileSystemEntry,
  newName: string
): FileSystemEntry[] => {
  return entries.map((entry) => {
    if (entry.id === targetEntry.id) {
      return { ...entry, name: newName };
    }
    if (entry.children) {
      return {
        ...entry,
        children: updateFileSystemEntryName(
          entry.children,
          targetEntry,
          newName
        ),
      };
    }
    return entry;
  });
};

const isDirectoryEmpty = (entry: FileSystemEntry): boolean => {
  if (entry.type !== "directory" || !entry.children) {
    return false;
  }

  if (entry.children.length === 0) {
    return true;
  }

  return entry.children.every(
    (child) => child.type === "directory" && isDirectoryEmpty(child)
  );
};

const deleteRouteFromFileSystem = (
  entries: FileSystemEntry[],
  targetPath: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  return entries
    .map((entry) => {
      if (entry.name === "app" && isRoot) {
        if (entry.children) {
          if (targetPath === "/") {
            const updatedChildren = entry.children.filter(
              (child) => !(child.type === "file" && child.name === "page.tsx")
            );
            return { ...entry, children: updatedChildren };
          } else {
            const updatedChildren = deleteRouteFromFileSystem(
              entry.children,
              targetPath,
              "",
              false
            );
            return { ...entry, children: updatedChildren };
          }
        }
        return entry;
      }

      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        if (entry.children) {
          const updatedChildren = deleteRouteFromFileSystem(
            entry.children,
            targetPath,
            currentPath,
            false
          );
          return { ...entry, children: updatedChildren };
        }
        return entry;
      }

      if (entry.type === "directory" && entry.children) {
        const newPath = currentPath
          ? `${currentPath}/${entry.name}`
          : `/${entry.name}`;

        if (targetPath === newPath) {
          const updatedChildren = entry.children.filter(
            (child) => !(child.type === "file" && child.name === "page.tsx")
          );

          const updatedEntry = { ...entry, children: updatedChildren };

          if (isDirectoryEmpty(updatedEntry)) {
            return null;
          }

          return updatedEntry;
        }

        const updatedChildren = deleteRouteFromFileSystem(
          entry.children,
          targetPath,
          newPath,
          false
        );
        const updatedEntry = { ...entry, children: updatedChildren };

        if (isDirectoryEmpty(updatedEntry)) {
          return null;
        }

        return updatedEntry;
      }

      return entry;
    })
    .filter(Boolean) as FileSystemEntry[];
};

const addRouteSegment = (
  entries: FileSystemEntry[],
  parentPath: string,
  segmentName: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  return entries.map((entry) => {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        return {
          ...entry,
          children: addRouteSegment(
            entry.children,
            parentPath,
            segmentName,
            "",
            false
          ),
        };
      }
      return entry;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        return {
          ...entry,
          children: addRouteSegment(
            entry.children,
            parentPath,
            segmentName,
            currentPath,
            false
          ),
        };
      }
      return entry;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (parentPath === newPath) {
        const newSegment: FileSystemEntry = {
          id: generateId(),
          name: segmentName,
          type: "directory",
          isExpanded: true,
          children: [{ id: generateId(), name: "page.tsx", type: "file" }],
        };

        return {
          ...entry,
          children: [...(entry.children || []), newSegment],
          isExpanded: true,
        };
      }

      return {
        ...entry,
        children: addRouteSegment(
          entry.children,
          parentPath,
          segmentName,
          newPath,
          false
        ),
      };
    }

    return entry;
  });
};

const validateSegmentName = (
  name: string
): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Segment name cannot be empty" };
  }

  const trimmedName = name.trim();

  if (!/^[a-zA-Z0-9-_]+$/.test(trimmedName)) {
    return {
      valid: false,
      error: "Only letters, numbers, hyphens, and underscores are allowed",
    };
  }

  if (trimmedName.length > 50) {
    return { valid: false, error: "Segment name cannot exceed 50 characters" };
  }

  return { valid: true };
};

const validateRoutePath = (
  path: string
): { valid: boolean; error?: string } => {
  if (!path || path.trim().length === 0) {
    return { valid: false, error: "Route path cannot be empty" };
  }

  const trimmedPath = path.trim();

  if (!trimmedPath.startsWith("/")) {
    return { valid: false, error: "Route path must start with /" };
  }

  if (trimmedPath !== "/" && trimmedPath.endsWith("/")) {
    const segments = trimmedPath.slice(1, -1).split("/");
    for (const segment of segments) {
      const validation = validateSegmentName(segment);
      if (!validation.valid) {
        return {
          valid: false,
          error: `Invalid segment "${segment}": ${validation.error}`,
        };
      }
    }
  } else if (trimmedPath !== "/") {
    const segments = trimmedPath.slice(1).split("/");
    for (const segment of segments) {
      const validation = validateSegmentName(segment);
      if (!validation.valid) {
        return {
          valid: false,
          error: `Invalid segment "${segment}": ${validation.error}`,
        };
      }
    }
  }

  return { valid: true };
};

const findExistingRouteInStructure = (
  entries: FileSystemEntry[],
  targetRoutePath: string,
  currentRoutePath: string = "",
  isRoot: boolean = false
): { entry: FileSystemEntry; segments: string[] } | null => {
  const normalizedTarget =
    targetRoutePath.endsWith("/") && targetRoutePath !== "/"
      ? targetRoutePath.slice(0, -1)
      : targetRoutePath;

  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          currentRoutePath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const routePath = currentRoutePath
        ? `${currentRoutePath}/${entry.name}`
        : `/${entry.name}`;

      if (normalizedTarget === routePath) {
        const routeSegments =
          routePath === "/" ? [] : routePath.slice(1).split("/");
        return { entry, segments: routeSegments };
      }

      if (normalizedTarget.startsWith(routePath + "/")) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          routePath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const findBestParentForRoute = (
  entries: FileSystemEntry[],
  targetRoutePath: string,
  currentRoutePath: string = "",
  isRoot: boolean = false
): { parentEntry: FileSystemEntry; remainingSegments: string[] } | null => {
  const normalizedTarget =
    targetRoutePath.endsWith("/") && targetRoutePath !== "/"
      ? targetRoutePath.slice(0, -1)
      : targetRoutePath;

  const targetSegments =
    normalizedTarget === "/" ? [] : normalizedTarget.slice(1).split("/");

  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          currentRoutePath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const routePath = currentRoutePath
        ? `${currentRoutePath}/${entry.name}`
        : `/${entry.name}`;

      const currentSegments =
        routePath === "/" ? [] : routePath.slice(1).split("/");

      if (targetSegments.length > currentSegments.length) {
        let matches = true;
        for (let i = 0; i < currentSegments.length; i++) {
          if (currentSegments[i] !== targetSegments[i]) {
            matches = false;
            break;
          }
        }

        if (matches) {
          const hasPageFile = entry.children.some(
            (child) => child.type === "file" && child.name === "page.tsx"
          );

          if (hasPageFile) {
            const remainingSegments = targetSegments.slice(
              currentSegments.length
            );
            if (remainingSegments.length > 0) {
              const deeperResult = findBestParentForRoute(
                entry.children,
                normalizedTarget,
                routePath,
                false
              );

              if (deeperResult) {
                return deeperResult;
              } else {
                return {
                  parentEntry: entry,
                  remainingSegments: remainingSegments,
                };
              }
            }
          }
        }
      }

      if (normalizedTarget.startsWith(routePath + "/")) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          routePath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const createRouteFromPath = (
  entries: FileSystemEntry[],
  routePath: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  const normalizedPath =
    routePath.endsWith("/") && routePath !== "/"
      ? routePath.slice(0, -1)
      : routePath;

  const pathSegments =
    normalizedPath === "/" ? [] : normalizedPath.slice(1).split("/");

  const addPageToExistingEntry = (
    targetEntry: FileSystemEntry,
    entryList: FileSystemEntry[]
  ): FileSystemEntry[] => {
    return entryList.map((entry) => {
      if (entry.id === targetEntry.id) {
        const hasPageFile = entry.children?.some(
          (child) => child.type === "file" && child.name === "page.tsx"
        );

        if (!hasPageFile) {
          const updatedChildren = [
            ...(entry.children || []),
            {
              id: generateId(),
              name: "page.tsx",
              type: "file" as const,
            },
          ];
          return { ...entry, children: updatedChildren, isExpanded: true };
        }
        return entry;
      }

      if (entry.children) {
        return {
          ...entry,
          children: addPageToExistingEntry(targetEntry, entry.children),
        };
      }

      return entry;
    });
  };

  const createMissingStructure = (
    currentEntries: FileSystemEntry[],
    segments: string[],
    segmentIndex: number = 0
  ): FileSystemEntry[] => {
    if (segmentIndex >= segments.length) {
      return currentEntries;
    }

    const segment = segments[segmentIndex];
    const existingEntry = currentEntries.find(
      (entry) => entry.type === "directory" && entry.name === segment
    );

    if (existingEntry) {
      const finalChildren = createMissingStructure(
        existingEntry.children || [],
        segments,
        segmentIndex + 1
      );

      let updatedChildren = finalChildren;

      if (segmentIndex === segments.length - 1) {
        const hasPageFile = finalChildren.some(
          (child) => child.type === "file" && child.name === "page.tsx"
        );

        if (!hasPageFile) {
          updatedChildren = [
            ...finalChildren,
            {
              id: generateId(),
              name: "page.tsx",
              type: "file" as const,
            },
          ];
        }
      }

      return currentEntries.map((entry) =>
        entry.id === existingEntry.id
          ? { ...entry, children: updatedChildren, isExpanded: true }
          : entry
      );
    } else {
      const newSegment: FileSystemEntry = {
        id: generateId(),
        name: segment,
        type: "directory" as const,
        isExpanded: true,
        children: [],
      };

      if (segmentIndex === segments.length - 1) {
        newSegment.children = [
          {
            id: generateId(),
            name: "page.tsx",
            type: "file" as const,
          },
        ];
      } else {
        newSegment.children = createMissingStructure(
          [],
          segments,
          segmentIndex + 1
        );
      }

      return [...currentEntries, newSegment];
    }
  };

  if (isRoot) {
    const existingRoute = findExistingRouteInStructure(
      entries,
      normalizedPath,
      "",
      true
    );

    if (existingRoute) {
      return addPageToExistingEntry(existingRoute.entry, entries);
    }

    const bestParent = findBestParentForRoute(
      entries,
      normalizedPath,
      "",
      true
    );

    if (bestParent) {
      const addSegmentsToParent = (
        targetEntry: FileSystemEntry,
        entryList: FileSystemEntry[],
        segments: string[]
      ): FileSystemEntry[] => {
        return entryList.map((entry) => {
          if (entry.id === targetEntry.id) {
            let updatedChildren = [...(entry.children || [])];

            for (let i = 0; i < segments.length; i++) {
              const segment = segments[i];
              let targetContainer = updatedChildren;

              for (let j = 0; j < i; j++) {
                const previousSegment = segments[j];
                const parentDir = targetContainer.find(
                  (child) =>
                    child.type === "directory" && child.name === previousSegment
                );
                if (parentDir?.children) {
                  targetContainer = parentDir.children;
                }
              }

              const existingSegment = targetContainer.find(
                (child) => child.type === "directory" && child.name === segment
              );

              if (!existingSegment) {
                const newSegment: FileSystemEntry = {
                  id: generateId(),
                  name: segment,
                  type: "directory",
                  isExpanded: true,
                  children:
                    i === segments.length - 1
                      ? [{ id: generateId(), name: "page.tsx", type: "file" }]
                      : [],
                };

                targetContainer.push(newSegment);
              } else if (i === segments.length - 1) {
                const hasPageFile = existingSegment.children?.some(
                  (child) => child.type === "file" && child.name === "page.tsx"
                );
                if (!hasPageFile && existingSegment.children) {
                  existingSegment.children.push({
                    id: generateId(),
                    name: "page.tsx",
                    type: "file",
                  });
                }
              }
            }

            return { ...entry, children: updatedChildren, isExpanded: true };
          }

          if (entry.children) {
            return {
              ...entry,
              children: addSegmentsToParent(
                targetEntry,
                entry.children,
                segments
              ),
            };
          }

          return entry;
        });
      };

      return addSegmentsToParent(
        bestParent.parentEntry,
        entries,
        bestParent.remainingSegments
      );
    }

    if (normalizedPath === "/" || pathSegments.length === 0) {
      return entries.map((entry) => {
        if (entry.name === "app") {
          const hasRootPage = entry.children?.some(
            (child) => child.type === "file" && child.name === "page.tsx"
          );

          if (!hasRootPage && entry.children) {
            return {
              ...entry,
              children: [
                ...entry.children,
                {
                  id: generateId(),
                  name: "page.tsx",
                  type: "file" as const,
                },
              ],
              isExpanded: true,
            };
          }
        }
        return entry;
      });
    }

    return entries.map((entry) => {
      if (entry.name === "app" && entry.children) {
        return {
          ...entry,
          children: createMissingStructure(entry.children, pathSegments),
          isExpanded: true,
        };
      }
      return entry;
    });
  }

  return entries.map((entry) => {
    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        return {
          ...entry,
          children: createRouteFromPath(
            entry.children,
            routePath,
            currentPath,
            false
          ),
        };
      }
      return entry;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;
      return {
        ...entry,
        children: createRouteFromPath(
          entry.children,
          routePath,
          newPath,
          false
        ),
      };
    }

    return entry;
  });
};

const SiteMapNode = ({
  route,
  depth = 0,
  isLast = false,
  darkMode,
  appStructure,
  onUpdateAppStructure,
  onDeleteRoute,
  onAddSegment,
}: {
  route: RouteEntry;
  depth?: number;
  isLast?: boolean;
  darkMode: boolean;
  appStructure: FileSystemEntry[];
  onUpdateAppStructure: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDeleteRoute: (routePath: string) => void;
  onAddSegment: (parentPath: string) => void;
}) => {
  const [editingSegmentIndex, setEditingSegmentIndex] = useState<number | null>(
    null
  );
  const [tempValue, setTempValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSegmentIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSegmentIndex]);

  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push("│   ");
    }
    return lines.join("");
  };

  const pathSegments =
    route.path === "/" ? ["/"] : route.path.split("/").filter(Boolean);

  const handleSegmentClick = (segmentIndex: number) => {
    if (route.path === "/") return;

    setEditingSegmentIndex(segmentIndex);
    setTempValue(pathSegments[segmentIndex]);
  };

  const handleSegmentSubmit = () => {
    if (editingSegmentIndex === null) {
      setEditingSegmentIndex(null);
      return;
    }

    const validation = validateSegmentName(tempValue);
    if (!validation.valid) {
      console.error("Invalid segment name:", validation.error);
      setEditingSegmentIndex(null);
      return;
    }

    const targetPath =
      "/" + pathSegments.slice(0, editingSegmentIndex + 1).join("/");
    const result = findFileSystemEntryForPath(
      appStructure,
      targetPath,
      "",
      true
    );

    if (result) {
      onUpdateAppStructure(result.entry.id, { name: tempValue.trim() });
    } else {
      console.error("Could not find filesystem entry for path:", targetPath);
    }

    setEditingSegmentIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSegmentSubmit();
    }
    if (e.key === "Escape") {
      setEditingSegmentIndex(null);
    }
  };

  const renderPathSegments = () => {
    if (route.path === "/") {
      return <span className="text-sm font-mono">/</span>;
    }

    return (
      <div className="flex items-center">
        <span className="text-sm font-mono text-gray-500">/</span>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center">
            {editingSegmentIndex === index ? (
              <Input
                ref={inputRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSegmentSubmit}
                onKeyDown={handleKeyDown}
                className="h-6 px-2 py-0 text-sm w-20 min-w-fit"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-sm font-mono cursor-pointer hover:bg-accent/50 px-1 py-0.5 rounded"
                onClick={() => handleSegmentClick(index)}
              >
                {segment}
              </span>
            )}
            {index < pathSegments.length - 1 && (
              <span className="text-sm font-mono text-gray-500">/</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleDeleteRoute = () => {
    onDeleteRoute(route.path);
  };

  const handleAddSegment = () => {
    onAddSegment(route.path);
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center justify-between gap-1 hover:bg-accent/50 rounded px-1 py-0.5",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-mono text-sm select-none",
              darkMode ? "text-gray-500" : "text-gray-400"
            )}
          >
            {getLinePrefix()}
            {getTreeChar()}
            {depth > 0 && "─ "}
          </span>
          {renderPathSegments()}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleAddSegment}
            title="Add segment"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDeleteRoute}
            title="Delete route"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
      {route.children && route.children.length > 0 && (
        <>
          {route.children.map((child, index) => (
            <SiteMapNode
              key={child.path}
              route={child}
              depth={depth + 1}
              isLast={index === route.children!.length - 1}
              darkMode={darkMode}
              appStructure={appStructure}
              onUpdateAppStructure={onUpdateAppStructure}
              onDeleteRoute={onDeleteRoute}
              onAddSegment={onAddSegment}
            />
          ))}
        </>
      )}
    </>
  );
};

const TreeNode = ({
  node,
  depth = 0,
  isLast = false,
  parentPath = "",
  onUpdate,
  onDelete,
  onAddFile,
  onAddDirectory,
  appStructure,
  activeLayoutPopover,
  onLayoutPopoverChange,
}: {
  node: FileSystemEntry;
  depth?: number;
  isLast?: boolean;
  parentPath?: string;
  onUpdate: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDelete: (id: string) => void;
  onAddFile: (parentId: string) => void;
  onAddDirectory: (parentId: string) => void;
  appStructure: FileSystemEntry[];
  activeLayoutPopover?: { pagePath: string; layouts: string[] } | null;
  onLayoutPopoverChange?: (
    open: boolean,
    pagePath: string,
    layouts: string[]
  ) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { darkMode } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);

  const getPagePath = (): string => {
    if (node.name !== "page.tsx" || node.type !== "file") return "";

    let cleanPath = parentPath;

    if (cleanPath.startsWith("/app")) {
      cleanPath = cleanPath.replace(/^\/app/, "");
    }

    // Don't remove route groups for layout hierarchy - we need the full path
    // cleanPath = cleanPath.replace(/\/\([^)]+\)/g, "");

    if (!cleanPath || cleanPath === "") {
      return "/";
    }

    return cleanPath;
  };

  const isPageFile = node.type === "file" && node.name === "page.tsx";
  const pagePath = getPagePath();

  const getFileIconColor = (): string => {
    if (!activeLayoutPopover) {
      return "text-gray-500";
    }

    if (node.type === "file" && node.name === "layout.tsx") {
      // Construct the full file path as it would appear in the popover
      const fullFilePath = parentPath + "/" + node.name;

      // Check if this specific layout file is one of the layouts in the active popover
      for (let i = 0; i < activeLayoutPopover.layouts.length; i++) {
        const layout = activeLayoutPopover.layouts[i];
        const expectedLayoutFile =
          layout === "/" ? "app/layout.tsx" : `app${layout}/layout.tsx`;

        // Remove leading slash from fullFilePath for comparison
        const normalizedFullPath = fullFilePath.startsWith("/")
          ? fullFilePath.substring(1)
          : fullFilePath;

        if (normalizedFullPath === expectedLayoutFile) {
          const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];
          return colorSet.icon;
        }
      }
    }

    if (isPageFile) {
      return PAGE_COLOR.icon;
    }

    return "text-gray-500";
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameSubmit = (newName: string) => {
    if (newName.trim()) {
      onUpdate(node.id, { name: newName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit(e.currentTarget.value);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const toggleExpand = () => {
    if (node.type === "directory") {
      onUpdate(node.id, { isExpanded: !node.isExpanded });
    }
  };

  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push("│   ");
    }
    return lines.join("");
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 hover:bg-accent/50 rounded px-1 py-0.5",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        <span
          className={cn(
            "font-mono text-sm select-none",
            darkMode ? "text-gray-500" : "text-gray-400"
          )}
        >
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>

        <button
          onClick={toggleExpand}
          className="flex items-center gap-1 flex-1 min-w-0"
        >
          {node.type === "directory" ? (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            <File className={cn("h-4 w-4 flex-shrink-0", getFileIconColor())} />
          )}

          {isEditing ? (
            <Input
              ref={inputRef}
              defaultValue={node.name}
              onBlur={(e) => handleNameSubmit(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-6 px-2 py-0 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-sm truncate cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {node.name}
            </span>
          )}

          {isPageFile && (
            <LayoutHierarchyPopover
              pagePath={pagePath}
              appStructure={appStructure}
              darkMode={darkMode}
              onOpenChange={onLayoutPopoverChange}
            />
          )}
        </button>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddFile(node.id)}
            title="Add file"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddDirectory(node.id)}
            title="Add directory"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onDelete(node.id)}
            title="Delete"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>

      {node.type === "directory" && node.isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              parentPath={`${parentPath}/${node.name}`}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddFile={onAddFile}
              onAddDirectory={onAddDirectory}
              appStructure={appStructure}
              activeLayoutPopover={activeLayoutPopover}
              onLayoutPopoverChange={onLayoutPopoverChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppStructure = () => {
  const {
    darkMode,
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [activeLayoutPopover, setActiveLayoutPopover] = useState<{
    pagePath: string;
    layouts: string[];
  } | null>(null);

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: false,
    };
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = "new-segment";
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const collapseAll = (nodes: FileSystemEntry[]): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.type === "directory") {
        return {
          ...node,
          isExpanded: false,
          children: node.children ? collapseAll(node.children) : [],
        };
      }
      return node;
    });
  };

  const expandAll = (nodes: FileSystemEntry[]): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.type === "directory") {
        return {
          ...node,
          isExpanded: true,
          children: node.children ? expandAll(node.children) : [],
        };
      }
      return node;
    });
  };

  const hasExpandedDirectories = (nodes: FileSystemEntry[]): boolean => {
    return nodes.some((node) => {
      if (node.type === "directory") {
        if (node.isExpanded) return true;
        if (node.children) return hasExpandedDirectories(node.children);
      }
      return false;
    });
  };

  const handleLayoutPopoverChange = (
    open: boolean,
    pagePath: string,
    layouts: string[]
  ) => {
    if (open) {
      setActiveLayoutPopover({ pagePath, layouts });
    } else {
      setActiveLayoutPopover(null);
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          App Directory Structure
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const isExpanded = hasExpandedDirectories(appStructure);
            if (isExpanded) {
              setAppStructure(collapseAll(appStructure));
            } else {
              setAppStructure(expandAll(appStructure));
            }
          }}
          title={
            hasExpandedDirectories(appStructure) ? "Collapse all" : "Expand all"
          }
        >
          {hasExpandedDirectories(appStructure) ? (
            <FoldVertical className="h-4 w-4" />
          ) : (
            <SquareStack className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          "font-mono text-sm",
          darkMode ? "bg-gray-950" : "bg-gray-50",
          "p-3 rounded overflow-x-auto"
        )}
      >
        {appStructure.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            isLast={index === appStructure.length - 1}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddFile={handleAddFile}
            onAddDirectory={handleAddDirectory}
            appStructure={appStructure}
            activeLayoutPopover={activeLayoutPopover}
            onLayoutPopoverChange={handleLayoutPopoverChange}
          />
        ))}
        {appStructure.length === 0 && (
          <div
            className={cn(
              "text-center py-8",
              darkMode ? "text-gray-500" : "text-gray-400"
            )}
          >
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h3
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-gray-200" : "text-gray-800"
              )}
            >
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div
            className={cn(
              "font-mono text-sm",
              darkMode ? "bg-gray-950" : "bg-gray-50",
              "p-3 rounded overflow-x-auto"
            )}
          >
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                darkMode={darkMode}
                appStructure={appStructure}
                onUpdateAppStructure={handleUpdate}
                onDeleteRoute={handleDeleteRoute}
                onAddSegment={handleAddSegment}
              />
            ))}

            <div className="mt-2 flex items-center gap-2 rounded dark:border-gray-700 ">
              <Input
                ref={routeInputRef}
                value={routeInputValue}
                onChange={(e) => setRouteInputValue(e.target.value)}
                onKeyDown={handleRouteKeyDown}
                onBlur={handleRouteSubmit}
                placeholder="Enter route path (e.g., /register/)"
                className="h-6 px-2 py-0 text-sm flex-1 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
