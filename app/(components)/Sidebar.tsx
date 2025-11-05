"use client";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import type { CodeFileNode } from "@/app/(editor)/layout.types";
import { MarkdownNode, NavigationItem } from "@/app/(editor)/layout.types";
import { useWalkthroughStore } from "@/app/(editor)/layout.walkthrough.stores";
import { WalkthroughStep } from "@/app/(editor)/layout.walkthrough.types";
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
import { WalkthroughHelper } from "@/components/WalkthroughHelper";
import { generateAndDownloadZip } from "@/lib/download.utils";
import { conditionalLog } from "@/lib/log.util";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Box,
  Boxes,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  Download,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Info,
  LayoutGrid,
  ListChecks,
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
import { useEffect, useMemo, useState } from "react";

const FILE_ICON_MAP: Record<string, LucideIcon> = {
  readme: BookOpen,
  robots: Bot,
  claude: Sparkles,
  "start-here.tech-stack": Boxes,
  "start-here.theme": Palette,
  "start-here.layout-routes": LayoutGrid,
  "start-here.database": Database,
  "start-here.next-steps": ListChecks,
  "docs.deployment-instructions": Rocket,
  "docs.util": Code2,
  "app.globals": Palette,
  "lib.auth": Shield,
  "lib.auth-client": UserCircle,
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

  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

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
    } else if (node?.type === "code-file") {
      if (node.visibleAfterPage && !isPageVisited(node.visibleAfterPage)) {
        return null;
      }
    }

    const isActive = currentPath === item.path;

    return (
      <Link href={buildLinkPath()}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-white hover:bg-gray-800 h-8 px-2 relative"
          )}
          style={{
            paddingLeft: `${(level + 1) * 12 + 8}px`,
          }}
        >
          <div
            className="absolute opacity-30 inset-0 rounded"
            style={isActive ? getBackgroundStyle() : undefined}
          ></div>
          <div className="flex items-center">{item.name}</div>
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
        return isPageVisited(child.path);
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
          className="w-full justify-between text-white hover:bg-gray-800 h-8 px-2"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {item.name}
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

  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

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
    } else if (node?.type === "code-file") {
      if (node.visibleAfterPage && !isPageVisited(node.visibleAfterPage)) {
        return null;
      }
    }

    const isActive = currentPath === item.path;
    const FileIcon = getFileIconByPath(item.path || "");

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={buildLinkPath()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full h-10 text-white hover:bg-gray-800 relative flex items-center justify-center"
                )}
              >
                <div
                  className="absolute opacity-30 inset-0 rounded"
                  style={isActive ? getBackgroundStyle() : undefined}
                ></div>
                <FileIcon className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-900 text-white border-gray-700"
          >
            {item.name}
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
        return isPageVisited(child.path);
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
            className="w-full h-10 text-white hover:bg-gray-800 flex items-center justify-center"
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
          {item.name}
        </TooltipContent>
      </Tooltip>
      {isOpen && (
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
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const {
    isPageVisited,
    visitedPages,
    data,
    codeFiles,
    appStructure,
    getSectionContent,
    getSectionInclude,
    getSectionOptions,
    getPlaceholderValue,
    getInitialConfiguration,
  } = useEditorStore();
  const { shouldShowStep, markStepComplete, isStepOpen, setStepOpen } =
    useWalkthroughStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [downloadHelpOpen, setDownloadHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showDownloadHelp = mounted && shouldShowStep(WalkthroughStep.DOWNLOAD);

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
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Gazzola.dev</h1>
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
            </div>
            <p className="text-sm text-white font-medium mt-1">
              Design, Build, Review.
            </p>
          </div>
        </div>
      </SidebarHeader>
      <div className="p-0 space-y-4 flex-grow flex flex-col">
        <div className="flex-grow flex flex-col relative ">
          <div className="absolute inset-0 overflow-auto px-3 flex flex-col justify-between">
            <div className="space-y-1">
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
            <div className="p-3  mt-auto space-y-3">
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
                      This app is a work in progress and will likely change
                      often. When the source material changes, the editor
                      content will be reset.
                    </p>
                    <p className="text-sm text-gray-300 font-medium">
                      Please download your roadmap frequently to avoid losing
                      your progress.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="relative w-full">
                {showDownloadHelp && (
                  <div className="absolute -top-2 -right-2 z-30">
                    <WalkthroughHelper
                      isOpen={downloadHelpOpen}
                      onOpenChange={(open) => {
                        setDownloadHelpOpen(open);
                        if (!open && isStepOpen(WalkthroughStep.DOWNLOAD)) {
                          markStepComplete(WalkthroughStep.DOWNLOAD);
                        } else if (
                          open &&
                          !isStepOpen(WalkthroughStep.DOWNLOAD)
                        ) {
                          setStepOpen(WalkthroughStep.DOWNLOAD, true);
                        }
                      }}
                      showAnimation={!isStepOpen(WalkthroughStep.DOWNLOAD)}
                      title="Download Your Roadmap"
                      description="Click here to download all your customized roadmap documents as a ZIP file. You can download at any time to save your progress."
                      iconSize="sm"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500 z-10"
                  onClick={() => {
                    handleDownload();
                    if (showDownloadHelp) {
                      markStepComplete(WalkthroughStep.DOWNLOAD);
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
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
      <div className="flex-grow overflow-auto py-2">
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
