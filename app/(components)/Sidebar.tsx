"use client";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import type { CodeFileNode } from "@/app/(editor)/layout.types";
import { MarkdownNode, NavigationItem } from "@/app/(editor)/layout.types";
import { useThemeStore } from "@/app/layout.stores";
import { useSubdomainStore } from "@/app/layout.subdomain.store";
import { getDomainConfig } from "@/lib/domain.utils";
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
  Blocks,
  BookText,
  Bot,
  Box,
  Bug,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  ListTodo,
  Menu,
  MessageSquare,
  Package,
  Paintbrush,
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
import { FeedbackDialog } from "./FeedbackDialog";
import { useHeaderStore } from "./Header.store";
import { SidebarDataAttributes } from "./Sidebar.types";

const nextSteps = [
  { icon: ListTodo, title: "Design" },
  { icon: Bot, title: "Build" },
  { icon: Rocket, title: "Review" },
];

const FILE_ICON_MAP: Record<string, LucideIcon> = {
  readme: BookText,
  robots: Bot,
  claude: Sparkles,
  theme: Paintbrush,
  "app-directory": FolderTree,
  database: Database,
  "starter-kit": Package,
  extensions: Blocks,
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

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

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

  const { getSectionInclude, setPreviewMode } = useEditorStore();
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

    if (node?.type === "code-file") {
      return null;
    }

    if (node?.type === "file") {
      const isPageIncluded = node.include === true;

      if (!isPageIncluded || node.includeInSidebar === false) {
        return null;
      }
    }

    const isActive = currentPath === item.path;
    const FileIcon = getFileIconByPath(item.path || "");

    return (
      <Link href={buildLinkPath()} onClick={() => setPreviewMode(false)}>
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
          {isActive && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={getBackgroundStyle()}
            ></div>
          )}
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

  const hasNonCodeFileChildren = item.children?.some((child) => {
    if (child.include === false) return false;
    if (!child.path) return false;
    const childNode = getNode(child.path);
    return childNode?.type !== "code-file";
  });

  if (!hasNonCodeFileChildren) {
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

  const { getSectionInclude, setPreviewMode } = useEditorStore();
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

    if (node?.type === "code-file") {
      return null;
    }

    if (node?.type === "file") {
      const isPageIncluded = node.include === true;

      if (!isPageIncluded || node.includeInSidebar === false) {
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
            <Link href={buildLinkPath()} onClick={() => setPreviewMode(false)}>
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
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={getBackgroundStyle()}
                  ></div>
                )}
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

  const hasNonCodeFileChildren = item.children?.some((child) => {
    if (child.include === false) return false;
    if (!child.path) return false;
    const childNode = getNode(child.path);
    return childNode?.type !== "code-file";
  });

  if (!hasNonCodeFileChildren) {
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
  const { isAzVariant } = useSubdomainStore();
  const [_dialogOpen, setDialogOpen] = useQueryState("codeReview");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldHideFeedback = mounted && isAzVariant;

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
              <h1 className="text-xl font-bold text-white">
                {getDomainConfig(useSubdomainStore().brand).ui.sidebarTitle}
              </h1>
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
          .filter((item) => {
            if (item.includeInSidebar === false) return false;
            return item.order && item.order >= 1 && item.order <= 6;
          })
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
      {!shouldHideFeedback && (
        <div className="border-t border-gray-700 p-3 flex flex-col gap-2">
          <Link href="https://discord.gg/2tW8ceZF47" target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-800 h-8 px-2 gap-2 text-white font-medium"
            >
              <DiscordIcon className="h-4 w-4 flex-shrink-0" />
              Join the Discord!
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800 h-8 px-2 gap-2 text-white font-medium"
            onClick={() => setFeedbackDialogOpen(true)}
            data-cy={SidebarDataAttributes.FEEDBACK_BUTTON_EXPANDED}
          >
            <Bug className="h-4 w-4 flex-shrink-0" />
            Feedback
          </Button>
        </div>
      )}
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
          .filter((item) => {
            if (item.includeInSidebar === false) return false;
            return item.order && item.order >= 1 && item.order <= 6;
          })
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
      {!shouldHideFeedback && (
        <div className="border-t border-gray-700 p-2 flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="https://discord.gg/2tW8ceZF47" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-10 text-white hover:bg-gray-800"
                >
                  <DiscordIcon className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-gray-900 text-white border-gray-700"
            >
              Join the Discord!
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-10 text-white hover:bg-gray-800"
                onClick={() => setFeedbackDialogOpen(true)}
                data-cy={SidebarDataAttributes.FEEDBACK_BUTTON_COLLAPSED}
              >
                <Bug className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-gray-900 text-white border-gray-700"
            >
              Feedback
            </TooltipContent>
          </Tooltip>
        </div>
      )}
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
      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
      />
    </TooltipProvider>
  );
};

export default Sidebar;
