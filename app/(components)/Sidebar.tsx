"use client";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import type { CodeFileNode } from "@/app/(editor)/layout.types";
import { MarkdownNode, NavigationItem } from "@/app/(editor)/layout.types";
import { useThemeStore } from "@/app/layout.stores";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { conditionalLog } from "@/lib/log.util";
import { getDynamicRobotsFileName } from "@/lib/robots-file.utils";
import { cn } from "@/lib/utils";
import { DataCyAttributes } from "@/types/cypress.types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookText,
  Bot,
  Box,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  Footprints,
  ListTodo,
  Menu,
  Palette,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useHeaderStore } from "./Header.store";

const nextSteps = [
  { icon: ListTodo, title: "Design" },
  { icon: Bot, title: "Build" },
  { icon: Rocket, title: "Review" },
];

const FILE_ICON_MAP: Record<string, LucideIcon> = {
  readme: BookText,
  robots: Bot,
  claude: Sparkles,
  theme: Palette,
  "app-directory": FolderTree,
  database: Database,
  "next-steps": Footprints,
  "docs.deployment-instructions": Rocket,
  "docs.util": Code2,
  "app.globals": Palette,
  "lib.auth": Shield,
  "lib.auth-client": UserCircle,
  "lib.auth-util": ShieldCheck,
  "lib.log-utils": Code2,
  "lib.prisma-rls-client": Database,
  "prisma.schema": Database,
  "lib.prisma-rls": ShieldCheck,
  "supabase.migrations.rls-policies": FileCode,
};

const getFileIconByPath = (path: string): LucideIcon => {
  if (FILE_ICON_MAP[path]) {
    return FILE_ICON_MAP[path];
  }

  if (path.startsWith("components.ui.")) {
    return Box;
  }

  return FileText;
};

const generateNavigationFromMarkdownData = (
  nodes: MarkdownNode[],
  codeFiles: CodeFileNode[] = [],
  isRootCall: boolean = true
): NavigationItem[] => {
  const items: NavigationItem[] = [];

  conditionalLog(
    {
      message: "Generating navigation",
      nodeCount: nodes.length,
      codeFileCount: codeFiles.length,
      codeFilePaths: codeFiles.map((cf) => ({
        name: cf.name,
        path: cf.path,
        parentPath: cf.parentPath,
      })),
    },
    { label: "code-files" }
  );

  const existingDirectoryPaths = new Set<string>();
  for (const node of nodes) {
    if (node.type === "directory") {
      existingDirectoryPaths.add(node.path);
    }
  }

  const missingDirectories = new Map<string, CodeFileNode[]>();
  const allRequiredPaths = new Set<string>();

  for (const codeFile of codeFiles) {
    if (!codeFile.parentPath) continue;

    const parentPath = codeFile.parentPath;
    const pathExists =
      existingDirectoryPaths.has(parentPath) ||
      nodes.some(
        (node) => node.type === "directory" && node.path === parentPath
      );

    if (!pathExists) {
      if (!missingDirectories.has(parentPath)) {
        missingDirectories.set(parentPath, []);
      }
      missingDirectories.get(parentPath)?.push(codeFile);

      const pathParts = parentPath.split(".");
      for (let i = 1; i <= pathParts.length; i++) {
        const ancestorPath = pathParts.slice(0, i).join(".");
        if (!existingDirectoryPaths.has(ancestorPath)) {
          allRequiredPaths.add(ancestorPath);
        }
      }
    }
  }

  Array.from(allRequiredPaths).forEach((requiredPath) => {
    if (!missingDirectories.has(requiredPath)) {
      missingDirectories.set(requiredPath, []);
    }
  });

  for (const node of nodes) {
    if (node.type === "directory") {
      const directoryCodeFiles = codeFiles.filter(
        (cf) =>
          cf.parentPath === node.path ||
          (node.path === "" && cf.parentPath?.split(".")[0] === node.name)
      );

      conditionalLog(
        {
          message: "Processing directory",
          dirName: node.name,
          dirPath: node.path,
          matchedCodeFiles: directoryCodeFiles.length,
          directoryCodeFiles: directoryCodeFiles.map((cf) => cf.name),
        },
        { label: "code-files" }
      );

      const childCodeFileItems: NavigationItem[] = directoryCodeFiles.map(
        (cf) => ({
          name: cf.displayName,
          type: "page",
          order: cf.order,
          path: cf.path,
          include: cf.include,
          includeInSidebar: cf.includeInSidebar,
        })
      );

      items.push({
        name: node.displayName,
        type: "segment",
        order: node.order,
        path: node.path,
        include: node.include,
        includeInSidebar: node.includeInSidebar,
        children: [
          ...generateNavigationFromMarkdownData(
            node.children,
            codeFiles,
            false
          ),
          ...childCodeFileItems,
        ],
      });
    } else if (node.type === "file") {
      items.push({
        name: node.displayName,
        type: "page",
        order: node.order,
        path: node.path,
        include: node.include,
        includeInSidebar: node.includeInSidebar,
      });
    }
  }

  if (isRootCall) {
    const sortedMissingDirs = Array.from(missingDirectories.entries()).sort(
      (a, b) => {
        const aDepth = a[0].split(".").length;
        const bDepth = b[0].split(".").length;
        return aDepth - bDepth;
      }
    );

    const createdDirs = new Map<string, NavigationItem>();

    for (const [parentPath, dirCodeFiles] of sortedMissingDirs) {
      const pathParts = parentPath.split(".");
      const dirName = pathParts[pathParts.length - 1];
      const displayName = dirName.charAt(0).toUpperCase() + dirName.slice(1);

      const childCodeFileItems: NavigationItem[] = dirCodeFiles.map((cf) => ({
        name: cf.displayName,
        type: "page",
        order: cf.order || 999,
        path: cf.path,
        include: cf.include,
        includeInSidebar: cf.includeInSidebar,
      }));

      const dirItem: NavigationItem = {
        name: displayName,
        type: "segment",
        order: 999,
        path: parentPath,
        include: true,
        includeInSidebar: true,
        children: childCodeFileItems,
      };

      createdDirs.set(parentPath, dirItem);

      if (pathParts.length === 1) {
        items.push(dirItem);
      } else {
        const parentPathStr = pathParts.slice(0, -1).join(".");
        const parentDir =
          createdDirs.get(parentPathStr) ||
          items.find((item) => item.path === parentPathStr);
        if (parentDir) {
          if (!parentDir.children) {
            parentDir.children = [];
          }
          parentDir.children.push(dirItem);
        } else {
          items.push(dirItem);
        }
      }
    }
  }

  return items;
};

const hasPreviewOnlyDescendants = (
  item: NavigationItem,
  flatIndex: Record<string, MarkdownNode>,
  codeFiles: CodeFileNode[]
): boolean => {
  if (!item.children) return false;

  for (const child of item.children.filter((c) => c.include !== false)) {
    const childNode =
      flatIndex[child.path || ""] ||
      codeFiles.find((cf) => cf.path === (child.path || ""));
    if (childNode && (childNode as any).previewOnly === true) {
      return true;
    }
    if (
      child.type === "segment" &&
      hasPreviewOnlyDescendants(child, flatIndex, codeFiles)
    ) {
      return true;
    }
  }

  return false;
};

interface TreeItemProps {
  item: NavigationItem;
  level: number;
  expandedItems: Set<string>;
  onToggleExpansion: (itemPath: string) => void;
  parentPath?: string;
  isPageVisited: (path: string) => boolean;
  currentPath: string;
  data: any;
  codeFiles: CodeFileNode[];
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  expandedItems,
  onToggleExpansion,
  isPageVisited,
  currentPath,
  data,
  codeFiles,
}) => {
  const itemPath = item.path || item.name;
  const isOpen = expandedItems.has(itemPath);

  const getNode = (path: string) => {
    return data.flatIndex[path] || codeFiles.find((cf) => cf.path === path);
  };

  const { getSectionInclude } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

  const getDisplayName = (itemName: string, itemPath: string): string => {
    const node = getNode(itemPath);
    if (node && node.type === "file" && (node as any).isDynamicRobotsFile) {
      return getDynamicRobotsFileName(getSectionInclude);
    }
    return itemName;
  };

  const getBackgroundStyle = () => {
    if (gradientEnabled) {
      return {
        background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
      };
    }
    return {
      background: singleColor,
    };
  };

  const buildLinkPath = () => {
    const node = getNode(itemPath);
    if (node && (node.type === "file" || node.type === "code-file")) {
      return node.urlPath;
    } else if (node && node.type === "directory") {
      return node.urlPath;
    }
    return "/";
  };

  if (item.type === "page") {
    const node = getNode(item.path || "");

    if (!item.path) {
      return null;
    }

    if (node?.type === "file") {
      const isPageIncluded = node.include === true;
      const hasVisitedThisPage = isPageVisited(item.path);
      const hasVisitedRobots = isPageVisited("robots");
      const isReadme = item.path === "readme";

      if (!isPageIncluded || node.includeInSidebar === false) {
        return null;
      }

      if (node.visibleAfterPage) {
        if (!hasVisitedThisPage && !hasVisitedRobots) {
          return null;
        }
      } else if (!isReadme && !hasVisitedThisPage) {
        return null;
      }
    } else if (node?.type === "code-file" && node.visibleAfterPage) {
      const hasVisitedThisPage = isPageVisited(item.path);
      const hasVisitedRobots = isPageVisited("robots");
      if (!hasVisitedThisPage && !hasVisitedRobots) {
        return null;
      }
    }

    const isActive = currentPath === item.path;
    const FileIcon = getFileIconByPath(item.path || "");

    return (
      <Link href={buildLinkPath()}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start hover:bg-gray-800 h-8 px-2 relative gap-2",
            isActive
              ? "text-white font-bold text-base"
              : "text-white font-medium"
          )}
          style={{
            paddingLeft: `${(level + 1) * 12 + 8}px`,
          }}
        >
          <div
            className="absolute opacity-30 inset-0 rounded"
            style={isActive ? getBackgroundStyle() : undefined}
          ></div>
          <FileIcon
            className={cn("flex-shrink-0", isActive ? "h-5 w-5" : "h-4 w-4")}
          />
          <div className="flex items-center">
            {getDisplayName(item.name, item.path || "")}
          </div>
        </Button>
      </Link>
    );
  }

  const itemNode = getNode(itemPath);

  const hasRequiredPageVisit =
    itemNode?.type === "directory" && itemNode.visibleAfterPage
      ? isPageVisited(itemNode.visibleAfterPage)
      : false;

  if (
    itemNode?.type === "directory" &&
    itemNode.visibleAfterPage &&
    !hasRequiredPageVisit
  ) {
    return null;
  }

  const hasVisitedRobots = isPageVisited("robots");

  const childCodeFiles =
    item.children
      ?.filter((child) => child.include !== false && child.path)
      .map((child) => codeFiles.find((cf) => cf.path === child.path))
      .filter((cf): cf is CodeFileNode => cf !== undefined) || [];

  const hasCodeFilesWithVisibilityRequirement =
    childCodeFiles.length > 0 &&
    childCodeFiles.every((cf) => cf.visibleAfterPage);

  if (hasCodeFilesWithVisibilityRequirement && !hasVisitedRobots) {
    const hasAnyVisitedCodeFile = childCodeFiles.some((cf) =>
      isPageVisited(cf.path)
    );
    if (!hasAnyVisitedCodeFile) {
      return null;
    }
  }

  const hasVisibleChildren = item.children
    ?.filter((child) => child.include !== false)
    .some((child) => {
      if (child.type === "page" && child.path) {
        const childNode = getNode(child.path || "");

        if (isPageVisited(child.path)) {
          return true;
        }

        if (hasVisitedRobots && childNode?.visibleAfterPage) {
          return true;
        }
      }
      return false;
    });

  const hasPreviewDescendants = hasPreviewOnlyDescendants(
    item,
    data.flatIndex,
    codeFiles
  );

  if (
    !hasVisibleChildren &&
    !hasRequiredPageVisit &&
    !(hasPreviewDescendants && hasVisitedRobots)
  ) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggleExpansion(itemPath)}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between !text-white !font-medium hover:bg-gray-800 h-8 px-2 gap-2"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0" />
            )}
            {getDisplayName(item.name, itemPath)}
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {item.children
          ?.filter((child) => child.include !== false)
          .map((child, index) => (
            <TreeItem
              key={index}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              onToggleExpansion={onToggleExpansion}
              parentPath={itemPath}
              isPageVisited={isPageVisited}
              currentPath={currentPath}
              data={data}
              codeFiles={codeFiles}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface IconTreeItemProps {
  item: NavigationItem;
  level: number;
  expandedItems: Set<string>;
  onToggleExpansion: (itemPath: string) => void;
  isPageVisited: (path: string) => boolean;
  currentPath: string;
  data: any;
  codeFiles: CodeFileNode[];
}

const IconTreeItem: React.FC<IconTreeItemProps> = ({
  item,
  level,
  expandedItems,
  onToggleExpansion,
  isPageVisited,
  currentPath,
  data,
  codeFiles,
}) => {
  const itemPath = item.path || item.name;
  const isOpen = expandedItems.has(itemPath);

  const getNode = (path: string) => {
    return data.flatIndex[path] || codeFiles.find((cf) => cf.path === path);
  };

  const { getSectionInclude } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

  const getDisplayName = (itemName: string, itemPath: string): string => {
    const node = getNode(itemPath);
    if (node && node.type === "file" && (node as any).isDynamicRobotsFile) {
      return getDynamicRobotsFileName(getSectionInclude);
    }
    return itemName;
  };

  const getBackgroundStyle = () => {
    if (gradientEnabled) {
      return {
        background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
      };
    }
    return {
      background: singleColor,
    };
  };

  const buildLinkPath = () => {
    const node = getNode(itemPath);
    if (node && (node.type === "file" || node.type === "code-file")) {
      return node.urlPath;
    } else if (node && node.type === "directory") {
      return node.urlPath;
    }
    return "/";
  };

  if (item.type === "page") {
    const node = getNode(item.path || "");

    if (!item.path) {
      return null;
    }

    if (node?.type === "file") {
      const isPageIncluded = node.include === true;
      const hasVisitedThisPage = isPageVisited(item.path);
      const hasVisitedRobots = isPageVisited("robots");
      const isReadme = item.path === "readme";

      if (!isPageIncluded || node.includeInSidebar === false) {
        return null;
      }

      if (node.visibleAfterPage) {
        if (!hasVisitedThisPage && !hasVisitedRobots) {
          return null;
        }
      } else if (!isReadme && !hasVisitedThisPage) {
        return null;
      }
    } else if (node?.type === "code-file" && node.visibleAfterPage) {
      const hasVisitedThisPage = isPageVisited(item.path);
      const hasVisitedRobots = isPageVisited("robots");
      if (!hasVisitedThisPage && !hasVisitedRobots) {
        return null;
      }
    }

    const isActive = currentPath === item.path;
    const FileIcon = getFileIconByPath(item.path || "");

    const parentPath = item.path?.split(".").slice(0, -1).join(".");
    const isParentExpanded = parentPath && expandedItems.has(parentPath);

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={buildLinkPath()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full h-10 text-white hover:bg-gray-800 relative flex items-center justify-center transition-transform",
                  isParentExpanded && "translate-x-[-4px]"
                )}
              >
                <div
                  className="absolute opacity-30 inset-0 rounded"
                  style={isActive ? getBackgroundStyle() : undefined}
                ></div>
                <FileIcon
                  className={cn(
                    "h-5 w-5",
                    isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  )}
                />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-900 text-white border-gray-700"
          >
            {getDisplayName(item.name, itemPath)}
          </TooltipContent>
        </Tooltip>
        {item.children && item.children.length > 0 && isOpen && (
          <>
            {item.children
              ?.filter((child) => child.include !== false)
              .map((child, index) => (
                <IconTreeItem
                  key={index}
                  item={child}
                  level={level + 1}
                  expandedItems={expandedItems}
                  onToggleExpansion={onToggleExpansion}
                  isPageVisited={isPageVisited}
                  currentPath={currentPath}
                  data={data}
                  codeFiles={codeFiles}
                />
              ))}
          </>
        )}
      </>
    );
  }

  const itemNode = getNode(itemPath);

  const hasRequiredPageVisit =
    itemNode?.type === "directory" && itemNode.visibleAfterPage
      ? isPageVisited(itemNode.visibleAfterPage)
      : false;

  if (
    itemNode?.type === "directory" &&
    itemNode.visibleAfterPage &&
    !hasRequiredPageVisit
  ) {
    return null;
  }

  const hasVisitedRobots = isPageVisited("robots");

  const childCodeFiles =
    item.children
      ?.filter((child) => child.include !== false && child.path)
      .map((child) => codeFiles.find((cf) => cf.path === child.path))
      .filter((cf): cf is CodeFileNode => cf !== undefined) || [];

  const hasCodeFilesWithVisibilityRequirement =
    childCodeFiles.length > 0 &&
    childCodeFiles.every((cf) => cf.visibleAfterPage);

  if (hasCodeFilesWithVisibilityRequirement && !hasVisitedRobots) {
    const hasAnyVisitedCodeFile = childCodeFiles.some((cf) =>
      isPageVisited(cf.path)
    );
    if (!hasAnyVisitedCodeFile) {
      return null;
    }
  }

  const hasVisibleChildren = item.children
    ?.filter((child) => child.include !== false)
    .some((child) => {
      if (child.type === "page" && child.path) {
        const childNode = getNode(child.path || "");

        if (isPageVisited(child.path)) {
          return true;
        }

        if (hasVisitedRobots && childNode?.visibleAfterPage) {
          return true;
        }
      }
      return false;
    });

  const hasPreviewDescendants = hasPreviewOnlyDescendants(
    item,
    data.flatIndex,
    codeFiles
  );

  if (
    !hasVisibleChildren &&
    !hasRequiredPageVisit &&
    !(hasPreviewDescendants && hasVisitedRobots)
  ) {
    return null;
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-full h-10 text-white hover:bg-gray-800 flex items-center justify-center transition-transform",
              isOpen && "translate-x-[-4px]"
            )}
            onClick={() => onToggleExpansion(itemPath)}
          >
            {isOpen ? (
              <FolderOpen className="h-5 w-5" />
            ) : (
              <Folder className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-gray-900 text-white border-gray-700"
        >
          {getDisplayName(item.name, itemPath)}
        </TooltipContent>
      </Tooltip>
      {isOpen && (
        <div className="relative">
          <div className="absolute left-[10px] top-0 bottom-0 w-px bg-white z-10" />
          {item.children
            ?.filter((child) => child.include !== false)
            .map((child, index) => (
              <div key={index} className="translate-x-[8px] relative">
                <IconTreeItem
                  item={child}
                  level={level + 1}
                  expandedItems={expandedItems}
                  onToggleExpansion={onToggleExpansion}
                  isPageVisited={isPageVisited}
                  currentPath={currentPath}
                  data={data}
                  codeFiles={codeFiles}
                />
              </div>
            ))}
        </div>
      )}
    </>
  );
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const {
    isPageVisited,
    data,
    codeFiles,
    appStructure,
    getSectionContent,
    getSectionInclude,
    getSectionOptions,
    getPlaceholderValue,
    getInitialConfiguration,
  } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { setIsExpanded } = useHeaderStore();
  const [_dialogOpen, setDialogOpen] = useQueryState("codeReview");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationData = useMemo(() => {
    return generateNavigationFromMarkdownData(data.root.children, codeFiles);
  }, [data, codeFiles]);

  const currentPath = useMemo((): string => {
    const segments = params.segments as string[] | undefined;

    const getFirstPagePath = () => {
      const pages = Object.values(data.flatIndex)
        .filter(
          (node) =>
            node.type === "file" &&
            node.include !== false &&
            !(node as any).previewOnly &&
            !(node as any).visibleAfterPage
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return pages.length > 0 ? pages[0].path : "";
    };

    if (!segments || segments.length === 0) {
      return getFirstPagePath();
    }

    const urlPath = "/" + segments.join("/");

    for (const [path, node] of Object.entries(data.flatIndex)) {
      if (node.type === "file" && node.urlPath === urlPath) {
        return path;
      }
    }

    return getFirstPagePath();
  }, [params, data]);

  useEffect(() => {
    const expandParentSegments = () => {
      if (currentPath.includes(".")) {
        const parentSegment = currentPath.split(".")[0];
        setExpandedItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(parentSegment);
          return newSet;
        });
      }
    };

    expandParentSegments();
  }, [currentPath]);

  const handleToggleExpansion = (itemPath: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);

      if (prev.has(itemPath)) {
        newSet.delete(itemPath);
        const pathsToRemove = Array.from(prev).filter((path) =>
          path.startsWith(itemPath + ".")
        );
        pathsToRemove.forEach((path) => newSet.delete(path));
      } else {
        const pathParts = itemPath.split(".");
        const currentLevel = pathParts.length;

        const siblingsAtSameLevel = Array.from(prev).filter((path) => {
          const siblingParts = path.split(".");
          return (
            siblingParts.length === currentLevel &&
            siblingParts.slice(0, -1).join(".") ===
              pathParts.slice(0, -1).join(".")
          );
        });

        siblingsAtSameLevel.forEach((siblingPath) => {
          newSet.delete(siblingPath);
          const childPathsToRemove = Array.from(prev).filter((path) =>
            path.startsWith(siblingPath + ".")
          );
          childPathsToRemove.forEach((path) => newSet.delete(path));
        });

        for (let i = 1; i <= pathParts.length; i++) {
          const parentPath = pathParts.slice(0, i).join(".");
          newSet.add(parentPath);
        }
      }

      return newSet;
    });
  };

  const expandedContent = (
    <SidebarContent className="flex-grow bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0 flex flex-col">
      <SidebarHeader className="pl-6 pr-2 pt-6 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-white">Gazzola.dev</h1>
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 text-white hover:text-white hover:bg-gray-800"
                onClick={toggleSidebar}
                data-cy={DataCyAttributes.TOGGLE_SIDEBAR_BUTTON}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
            <div className="pr-3 -ml-2">
              <Button
                variant="highlight"
                className="border border-transparent text-white font-semibold flex items-center gap-2 w-full px-4 py-7 justify-between"
                onClick={() => {
                  setDialogOpen("yesPlease");
                  setIsExpanded(true);
                }}
              >
                {nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex flex-row items-center gap-2"
                  >
                    <div className="flex flex-col items-center relative z-10">
                      <step.icon className="w-5 h-5" />
                      <span className="text-xs font-bold text-center whitespace-nowrap">
                        {step.title}
                      </span>
                    </div>
                    {index < nextSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    )}
                  </div>
                ))}
              </Button>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 py-2">
        {navigationData
          .filter((item) => item.includeInSidebar !== false)
          .map((item, index) => (
            <TreeItem
              key={index}
              item={item}
              level={0}
              expandedItems={expandedItems}
              onToggleExpansion={handleToggleExpansion}
              isPageVisited={isPageVisited}
              currentPath={currentPath}
              data={data}
              codeFiles={codeFiles}
            />
          ))}
      </div>
      <div className="border-t border-gray-700 p-3"></div>
    </SidebarContent>
  );

  const collapsedContent = (
    <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0 flex flex-col">
      <SidebarHeader className="border-b border-gray-700 flex flex-col items-center gap-2 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-gray-800"
          onClick={toggleSidebar}
          data-cy={DataCyAttributes.TOGGLE_SIDEBAR_BUTTON}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="highlight"
              size="icon"
              className="border border-transparent text-white px-2 !py-0"
              onClick={() => {
                setDialogOpen("yesPlease");
                setIsExpanded(true);
              }}
            >
              <Rocket className="w-5 h-5" />
              <span className="sr-only">Design, Build, Review</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-900 text-white border-gray-700"
          >
            Design, Build, Review
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>
      <div className="flex-grow overflow-y-auto overflow-x-hidden py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navigationData
          .filter((item) => item.includeInSidebar !== false)
          .map((item, index) => (
            <IconTreeItem
              key={index}
              item={item}
              level={0}
              expandedItems={expandedItems}
              onToggleExpansion={handleToggleExpansion}
              isPageVisited={isPageVisited}
              currentPath={currentPath}
              data={data}
              codeFiles={codeFiles}
            />
          ))}
      </div>
      <div className="border-t border-gray-700 p-2"></div>
    </SidebarContent>
  );

  return (
    <TooltipProvider>
      <ShadcnSidebar
        collapsible="icon"
        className="border-r-gray-800 h-full"
        expandedContent={expandedContent}
        collapsedContent={collapsedContent}
      />
    </TooltipProvider>
  );
};

export default Sidebar;
