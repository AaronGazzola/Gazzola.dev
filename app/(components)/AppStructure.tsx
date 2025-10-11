"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import {
  ChevronDown,
  ChevronUp,
  File,
  Folder,
  FolderOpen,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const PAGE_FILE_ICON = "text-blue-500";

const LAYOUT_COLORS = [
  {
    border: "border-green-300 dark:border-green-700",
    icon: "text-green-500",
  },
  {
    border: "border-purple-300 dark:border-purple-700",
    icon: "text-purple-500",
  },
  {
    border: "border-orange-300 dark:border-orange-700",
    icon: "text-orange-500",
  },
  {
    border: "border-red-300 dark:border-red-700",
    icon: "text-red-500",
  },
];

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
  appStructure,
  onUpdateAppStructure,
  onDeleteRoute,
  onAddSegment,
  ancestorIsLast = [],
}: {
  route: RouteEntry;
  depth?: number;
  isLast?: boolean;
  appStructure: FileSystemEntry[];
  onUpdateAppStructure: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDeleteRoute: (routePath: string) => void;
  onAddSegment: (parentPath: string) => void;
  ancestorIsLast?: boolean[];
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
      lines.push(ancestorIsLast[i] ? "    " : "│   ");
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
      <div className="group flex items-center justify-between gap-1 hover:bg-accent/50 rounded px-1 text-[hsl(var(--foreground))]">
        <div className="flex items-center gap-1">
          <span className="font-mono text-base select-none text-[hsl(var(--muted-foreground))]">
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
              appStructure={appStructure}
              onUpdateAppStructure={onUpdateAppStructure}
              onDeleteRoute={onDeleteRoute}
              onAddSegment={onAddSegment}
              ancestorIsLast={[...ancestorIsLast, isLast]}
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
  ancestorIsLast = [],
  onAddSpecificFile,
  newNodeId,
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
  ancestorIsLast?: boolean[];
  onAddSpecificFile?: (parentId: string, fileName: string) => void;
  newNodeId?: string | null;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { wireframeState, setWireframeCurrentPage } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);

  const isPageFile = node.type === "file" && node.name === "page.tsx";
  const isLayoutFile = node.type === "file" && node.name === "layout.tsx";

  const getFileIconColor = (): string => {
    if (isPageFile) {
      return PAGE_FILE_ICON;
    }
    if (isLayoutFile) {
      const fullPath = parentPath + "/" + node.name;
      const normalizedPath = fullPath.startsWith("/")
        ? fullPath.substring(1)
        : fullPath;
      const layoutPath = normalizedPath.replace("/layout.tsx", "").replace("app", "") || "/";
      const layouts = findLayoutsForPagePath(appStructure, layoutPath, "", true);
      const layoutIndex = layouts.findIndex(l => {
        const expectedFile = l === "/" ? "app/layout.tsx" : `app${l}/layout.tsx`;
        return normalizedPath === expectedFile;
      });
      if (layoutIndex !== -1) {
        return LAYOUT_COLORS[layoutIndex % LAYOUT_COLORS.length].icon;
      }
    }
    return "";
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (newNodeId && node.id === newNodeId) {
      setIsEditing(true);
    }
  }, [newNodeId, node.id]);

  const handleNameSubmit = (newName: string) => {
    if (newName.trim()) {
      onUpdate(node.id, { name: newName.trim() });
      setIsEditing(false);
    } else {
      onDelete(node.id);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit(e.currentTarget.value);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
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
      lines.push(ancestorIsLast[i] ? "    " : "│   ");
    }
    return lines.join("");
  };

  const getPagePath = () => {
    const fullPath = parentPath + "/" + node.name;
    const normalizedPath = fullPath.startsWith("/")
      ? fullPath.substring(1)
      : fullPath;
    let pagePath = normalizedPath.replace("/page.tsx", "").replace(/^app/, "");
    pagePath = pagePath.replace(/\/\([^)]+\)/g, "");
    if (!pagePath.startsWith("/")) {
      pagePath = "/" + pagePath;
    }
    if (pagePath === "//" || pagePath === "") {
      pagePath = "/";
    }
    return pagePath;
  };

  const handlePageFileClick = () => {
    if (!isPageFile) return;
    const pagePath = getPagePath();
    console.log(JSON.stringify({pagePath,availablePages:wireframeState.availablePages}));
    const pageIndex = wireframeState.availablePages.indexOf(pagePath);
    console.log(JSON.stringify({pageIndex}));
    if (pageIndex !== -1) {
      setWireframeCurrentPage(pageIndex);
      console.log(JSON.stringify({setPageIndexTo:pageIndex}));
    }
  };

  const isCurrentPage = isPageFile && wireframeState.availablePages[wireframeState.currentPageIndex] === getPagePath();

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded px-1 text-[hsl(var(--foreground))]",
          isPageFile && "cursor-pointer hover:bg-primary/15",
          !isPageFile && "hover:bg-accent/50",
          isCurrentPage && "border border-gray-300 dark:border-gray-600"
        )}
        onClick={(e) => {
          if (isPageFile) {
            e.stopPropagation();
            handlePageFileClick();
          }
        }}
      >
        <span className="font-mono text-base select-none text-[hsl(var(--muted-foreground))]">
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>

        <div className="flex items-center gap-1 flex-1 min-w-0 px-2">
          {node.type === "directory" ? (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            <File
              className={cn("h-4 w-4 flex-shrink-0 text-gray-500", getFileIconColor(), isPageFile && "cursor-pointer hover:opacity-70")}
              onClick={(e) => {
                if (isPageFile) {
                  e.stopPropagation();
                  handlePageFileClick();
                }
              }}
            />
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
        </div>

        <div className={cn("flex items-center gap-0.5 transition-opacity", isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Save"
            >
              <Save className="h-3 w-3 text-gray-500" />
            </Button>
          )}
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
              isLast={false}
              parentPath={`${parentPath}/${node.name}`}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddFile={onAddFile}
              onAddDirectory={onAddDirectory}
              appStructure={appStructure}
              ancestorIsLast={[...ancestorIsLast, false]}
              onAddSpecificFile={onAddSpecificFile}
              newNodeId={newNodeId}
            />
          ))}

          <div className="flex items-center gap-1 rounded px-1 text-[hsl(var(--foreground))]">
            <span className="font-mono text-base select-none text-[hsl(var(--muted-foreground))]">
              {(() => {
                const lines = [];
                for (let i = 0; i < depth - 1; i++) {
                  lines.push(ancestorIsLast[i] ? "    " : "│   ");
                }
                if (depth > 0) {
                  lines.push("│   ");
                }
                return lines.join("");
              })()}
              └─{" "}
            </span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 gap-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-sm">Add...</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="start">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => {
                      if (onAddSpecificFile) {
                        onAddSpecificFile(node.id, "page.tsx");
                      }
                    }}
                    disabled={node.children?.some(child => child.name === "page.tsx")}
                  >
                    <File className="h-4 w-4 text-blue-500" />
                    <span>page.tsx</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => {
                      if (onAddSpecificFile) {
                        onAddSpecificFile(node.id, "layout.tsx");
                      }
                    }}
                    disabled={node.children?.some(child => child.name === "layout.tsx")}
                  >
                    <File className="h-4 w-4 text-green-500" />
                    <span>layout.tsx</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                    onClick={() => onAddDirectory(node.id)}
                  >
                    <Folder className="h-4 w-4 text-blue-500" />
                    <span>directory</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export const LayoutAndStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    wireframeState,
    initializeWireframePages,
    setWireframeCurrentPage,
  } = useEditorStore();

  useEffect(() => {
    initializeWireframePages();
  }, [appStructure, initializeWireframePages]);

  const { currentPageIndex, availablePages } = wireframeState;
  const currentPage = availablePages[currentPageIndex] || null;

  const layouts = currentPage
    ? findLayoutsForPagePath(appStructure, currentPage, "", true)
    : [];

  console.log(JSON.stringify({wireframe:{currentPageIndex,availablePages,currentPage,layoutsCount:layouts.length,layouts}}));

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);

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
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
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

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  const renderNestedBoxes = () => {
    if (!currentPage) {
      return (
        <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
          No pages available
        </div>
      );
    }

    if (layouts.length === 0) {
      return (
        <div
          className={cn(
            "border-2 border-dashed",
            PAGE_FILE_ICON.replace("text-", "border-"),
            "rounded p-3 h-full flex flex-col"
          )}
        />
      );
    }

    let content: JSX.Element | null = null;

    for (let i = layouts.length - 1; i >= 0; i--) {
      const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];
      content = (
        <div
          className={cn(
            "border-2 border-dashed",
            colorSet.border,
            "rounded p-3 h-full flex flex-col"
          )}
        >
          {content}
        </div>
      );
    }

    return content;
  };

  return (
    <div className="p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:min-h-[400px]">
        <div className="flex flex-col order-2 lg:order-1">
          <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--card-foreground))]">
            App Directory Structure
          </h3>

          <div className="font-mono text-base bg-[hsl(var(--muted))] p-3 rounded overflow-x-auto min-h-[400px] lg:min-h-0 flex-1 lg:overflow-y-auto">
            {appStructure.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                isLast={false}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAddFile={handleAddFile}
                onAddDirectory={handleAddDirectory}
                appStructure={appStructure}
                onAddSpecificFile={handleAddSpecificFile}
                newNodeId={newNodeId}
              />
            ))}

            {appStructure.length === 0 && (
              <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                Click the buttons above to start building your app structure
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col order-1 lg:order-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Layout Wireframe {currentPage && `- ${currentPage}`}
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  if (currentPageIndex > 0) {
                    setWireframeCurrentPage(currentPageIndex - 1);
                  }
                }}
                disabled={currentPageIndex === 0}
                title="Previous page"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  if (currentPageIndex < availablePages.length - 1) {
                    setWireframeCurrentPage(currentPageIndex + 1);
                  }
                }}
                disabled={currentPageIndex === availablePages.length - 1}
                title="Next page"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 rounded bg-[hsl(var(--muted))] min-h-[400px] lg:min-h-0 flex-1">
            {renderNestedBoxes()}
          </div>
        </div>
      </div>

      {routes.length > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div className="font-mono text-base bg-[hsl(var(--muted))] p-3 rounded overflow-x-auto">
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                appStructure={appStructure}
                onUpdateAppStructure={handleUpdate}
                onDeleteRoute={handleDeleteRoute}
                onAddSegment={handleAddSegment}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const WireFrame = () => {
  const {
    appStructure,
    wireframeState,
    initializeWireframePages,
    setWireframeCurrentPage,
  } = useEditorStore();

  useEffect(() => {
    initializeWireframePages();
  }, [appStructure, initializeWireframePages]);

  const { currentPageIndex, availablePages } = wireframeState;
  const currentPage = availablePages[currentPageIndex] || null;

  const layouts = currentPage
    ? findLayoutsForPagePath(appStructure, currentPage, "", true)
    : [];

  console.log(JSON.stringify({wireframe:{currentPageIndex,availablePages,currentPage,layoutsCount:layouts.length,layouts}}));

  const renderNestedBoxes = () => {
    if (!currentPage) {
      return (
        <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
          No pages available
        </div>
      );
    }

    if (layouts.length === 0) {
      return (
        <div
          className={cn(
            "border-2 border-dashed",
            PAGE_FILE_ICON.replace("text-", "border-"),
            "rounded p-3 min-h-[200px] flex flex-col"
          )}
        />
      );
    }

    let content: JSX.Element | null = null;

    for (let i = layouts.length - 1; i >= 0; i--) {
      const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];
      content = (
        <div
          className={cn(
            "border-2 border-dashed",
            colorSet.border,
            "rounded p-3 min-h-[200px] flex flex-col"
          )}
        >
          {content}
        </div>
      );
    }

    return content;
  };

  return (
    <div className="p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
          Layout Wireframe {currentPage && `- ${currentPage}`}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              if (currentPageIndex > 0) {
                setWireframeCurrentPage(currentPageIndex - 1);
              }
            }}
            disabled={currentPageIndex === 0}
            title="Previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              if (currentPageIndex < availablePages.length - 1) {
                setWireframeCurrentPage(currentPageIndex + 1);
              }
            }}
            disabled={currentPageIndex === availablePages.length - 1}
            title="Next page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 rounded bg-[hsl(var(--muted))] flex-1">
        {renderNestedBoxes()}
      </div>
    </div>
  );
};

export const AppStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);

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
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
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

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  return (
    <div className="p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--card-foreground))]">
        App Directory Structure
      </h3>

      <div className="font-mono text-base bg-[hsl(var(--muted))] p-3 rounded overflow-x-auto">
        {appStructure.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            isLast={false}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddFile={handleAddFile}
            onAddDirectory={handleAddDirectory}
            appStructure={appStructure}
            onAddSpecificFile={handleAddSpecificFile}
            newNodeId={newNodeId}
          />
        ))}

        {appStructure.length === 0 && (
          <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div className="font-mono text-base bg-[hsl(var(--muted))] p-3 rounded overflow-x-auto">
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
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
