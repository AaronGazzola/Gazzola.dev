"use client";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import type { CodeFileNode } from "@/app/(editor)/layout.types";
import { MarkdownNode, NavigationItem } from "@/app/(editor)/layout.types";
import { useThemeStore } from "@/app/layout.stores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { generateAndDownloadZip } from "@/lib/download.utils";
import { conditionalLog } from "@/lib/log.util";
import { getDynamicRobotsFileName } from "@/lib/robots-file.utils";
import { cn } from "@/lib/utils";
import { DataCyAttributes } from "@/types/cypress.types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  Box,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  Download,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  Info,
  ListTodo,
  Menu,
  MessagesSquare,
  Palette,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const nextSteps = [
  { icon: ListTodo, title: "Design" },
  { icon: Bot, title: "Build" },
  { icon: Rocket, title: "Review" },
];

const FILE_ICON_MAP: Record<string, LucideIcon> = {
  readme: MessagesSquare,
  robots: Bot,
  claude: Sparkles,
  theme: Palette,
  "app-structure": FolderTree,
  database: Database,
  "ai-integration": MessagesSquare,
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
        })
      );

      items.push({
        name: node.displayName,
        type: "segment",
        order: node.order,
        path: node.path,
        include: node.include,
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
      }));

      const dirItem: NavigationItem = {
        name: displayName,
        type: "segment",
        order: 999,
        path: parentPath,
        include: true,
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

    if (node?.type === "file" && node.visibleAfterPage) {
      const hasVisitedRequiredPage = isPageVisited(node.visibleAfterPage);
      const isPageIncluded = node.include === true;
      if (!hasVisitedRequiredPage || !isPageIncluded) {
        return null;
      }
    } else if (node?.type === "file" && !node.previewOnly) {
      if (!isPageVisited(item.path)) {
        return null;
      }
    } else if (node?.type === "code-file" && node.visibleAfterPage) {
      if (!isPageVisited(node.visibleAfterPage)) {
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
            "w-full justify-start text-white hover:bg-gray-800 h-8 px-2 relative gap-2"
          )}
          style={{
            paddingLeft: `${(level + 1) * 12 + 8}px`,
          }}
        >
          <div
            className="absolute opacity-30 inset-0 rounded"
            style={isActive ? getBackgroundStyle() : undefined}
          ></div>
          <FileIcon className="h-4 w-4 flex-shrink-0 opacity-70" />
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

  const childCodeFiles =
    item.children
      ?.filter((child) => child.include !== false && child.path)
      .map((child) => codeFiles.find((cf) => cf.path === child.path))
      .filter((cf): cf is CodeFileNode => cf !== undefined) || [];

  const hasCodeFilesWithVisibilityRequirement =
    childCodeFiles.length > 0 &&
    childCodeFiles.every((cf) => cf.visibleAfterPage);

  if (hasCodeFilesWithVisibilityRequirement) {
    const requiredPage = childCodeFiles[0]?.visibleAfterPage;
    if (requiredPage && !isPageVisited(requiredPage)) {
      return null;
    }
  }

  const hasVisitedChildren = item.children
    ?.filter((child) => child.include !== false)
    .some((child) => {
      if (child.type === "page" && child.path) {
        const childNode = getNode(child.path || "");
        const childCodeFile = codeFiles.find((cf) => cf.path === child.path);

        if (isPageVisited(child.path)) {
          return true;
        }

        if (childNode?.type === "file" && (childNode as any).visibleAfterPage) {
          return isPageVisited((childNode as any).visibleAfterPage);
        }

        if (childCodeFile?.visibleAfterPage) {
          return isPageVisited(childCodeFile.visibleAfterPage);
        }

        if (
          childNode?.type === "code-file" &&
          (childNode as any).visibleAfterPage
        ) {
          return isPageVisited((childNode as any).visibleAfterPage);
        }
      }
      return false;
    });

  const hasPreviewDescendants = hasPreviewOnlyDescendants(
    item,
    data.flatIndex,
    codeFiles
  );

  if (!hasVisitedChildren && !hasRequiredPageVisit && !hasPreviewDescendants) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggleExpansion(itemPath)}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-white hover:bg-gray-800 h-8 px-2 gap-2"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 opacity-70" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 opacity-70" />
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

    if (node?.type === "file" && node.visibleAfterPage) {
      const hasVisitedRequiredPage = isPageVisited(node.visibleAfterPage);
      const isPageIncluded = node.include === true;
      if (!hasVisitedRequiredPage || !isPageIncluded) {
        return null;
      }
    } else if (node?.type === "file" && !node.previewOnly) {
      if (!isPageVisited(item.path)) {
        return null;
      }
    } else if (node?.type === "code-file" && node.visibleAfterPage) {
      if (!isPageVisited(node.visibleAfterPage)) {
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
                    isActive
                      ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      : "opacity-70"
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

  const childCodeFiles =
    item.children
      ?.filter((child) => child.include !== false && child.path)
      .map((child) => codeFiles.find((cf) => cf.path === child.path))
      .filter((cf): cf is CodeFileNode => cf !== undefined) || [];

  const hasCodeFilesWithVisibilityRequirement =
    childCodeFiles.length > 0 &&
    childCodeFiles.every((cf) => cf.visibleAfterPage);

  if (hasCodeFilesWithVisibilityRequirement) {
    const requiredPage = childCodeFiles[0]?.visibleAfterPage;
    if (requiredPage && !isPageVisited(requiredPage)) {
      return null;
    }
  }

  const hasVisitedChildren = item.children
    ?.filter((child) => child.include !== false)
    .some((child) => {
      if (child.type === "page" && child.path) {
        const childNode = getNode(child.path || "");
        const childCodeFile = codeFiles.find((cf) => cf.path === child.path);

        if (isPageVisited(child.path)) {
          return true;
        }

        if (childNode?.type === "file" && (childNode as any).visibleAfterPage) {
          return isPageVisited((childNode as any).visibleAfterPage);
        }

        if (childCodeFile?.visibleAfterPage) {
          return isPageVisited(childCodeFile.visibleAfterPage);
        }

        if (
          childNode?.type === "code-file" &&
          (childNode as any).visibleAfterPage
        ) {
          return isPageVisited((childNode as any).visibleAfterPage);
        }
      }
      return false;
    });

  const hasPreviewDescendants = hasPreviewOnlyDescendants(
    item,
    data.flatIndex,
    codeFiles
  );

  if (!hasVisitedChildren && !hasRequiredPageVisit && !hasPreviewDescendants) {
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
              <Folder className="h-5 w-5 opacity-70" />
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const params = useParams();

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

  const handleDownload = async () => {
    try {
      await generateAndDownloadZip(
        data,
        codeFiles,
        getSectionInclude,
        getSectionContent,
        getSectionOptions,
        appStructure,
        getPlaceholderValue,
        getInitialConfiguration
      );
    } catch (error) {
      console.error("Error generating download:", error);
    }
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
            <div className="flex flex-row items-center justify-center relative gap-2">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-row items-center gap-2"
                >
                  <div className="flex flex-col items-center relative z-10">
                    <div className="relative w-6 h-6">
                      <svg
                        className="w-6 h-6 absolute inset-0 z-0"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <step.icon
                          className="w-6 h-6 stroke-2"
                          style={{ color: gradientColors[index % gradientColors.length] }}
                          fill="none"
                        />
                      </svg>
                      <svg
                        className="w-6 h-6 relative z-10"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id={`gradient-sidebar-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            {gradientEnabled ? (
                              gradientColors.map((color, colorIndex) => (
                                <stop
                                  key={colorIndex}
                                  offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                  stopColor={color}
                                />
                              ))
                            ) : (
                              <stop offset="0%" stopColor={singleColor} />
                            )}
                          </linearGradient>
                        </defs>
                        <step.icon
                          className="w-6 h-6 stroke-1"
                          stroke={`url(#gradient-sidebar-${index})`}
                          fill="none"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-center whitespace-nowrap text-white opacity-70">
                      {step.title}
                    </span>
                  </div>
                  {index < nextSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 shrink-0 drop-shadow-[0_0_4px_rgba(147,51,234,0.5)] text-white opacity-70" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 py-2">
        {navigationData
          .filter((item) => item.include !== false)
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
      <div className="border-t border-gray-700 p-3 space-y-3">
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="w-full justify-center cursor-pointer text-white border-gray-600 hover:bg-gray-800 hover:border-orange-500 rounded-full relative py-1.5"
            >
              <Info className="h-4 w-4 text-orange-500 absolute left-3" />
              Work in Progress
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black border-orange-500 text-white rounded-xl">
            <div className="space-y-2">
              <h4 className="font-semibold">Work in Progress</h4>
              <p className="text-sm text-gray-300">
                This app is a work in progress and will likely change often.
              </p>
              <p className="text-sm text-gray-300 font-medium">
                Some of the functionality may be incomplete or error prone.
              </p>
            </div>
          </PopoverContent>
        </Popover>
        <div className="relative w-full">
          <Button
            variant="outline"
            className=" text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500 z-10"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </SidebarContent>
  );

  const collapsedContent = (
    <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0 flex flex-col">
      <SidebarHeader className="border-b border-gray-700 flex items-center justify-center p-2">
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
      </SidebarHeader>
      <div className="flex-grow overflow-y-auto overflow-x-hidden py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navigationData
          .filter((item) => item.include !== false)
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
      <div className="border-t border-gray-700 p-2 space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-orange-500 hover:text-orange-400 hover:bg-gray-800"
                >
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Work in Progress Info</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                className="w-80 bg-black border-orange-500 text-white rounded-xl"
              >
                <div className="space-y-2">
                  <h4 className="font-semibold">Work in Progress</h4>
                  <p className="text-sm text-gray-300">
                    This app is a work in progress and will likely change often.
                  </p>
                  <p className="text-sm text-gray-300 font-medium">
                    Some of the functionality may be incomplete or error prone.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-900 text-white border-gray-700"
          >
            Work in Progress
          </TooltipContent>
        </Tooltip>
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-white hover:bg-gray-800"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">Download Roadmap</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-gray-900 text-white border-gray-700"
            >
              Download Roadmap
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
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
