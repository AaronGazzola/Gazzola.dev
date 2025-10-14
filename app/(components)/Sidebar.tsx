"use client";
import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalkthroughHelper } from "@/components/WalkthroughHelper";
import { generateAndDownloadZip } from "@/lib/download.utils";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import { ChevronDown, ChevronRight, Download, Info, Menu } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const generateNavigationFromMarkdownData = (
  nodes: MarkdownNode[]
): NavigationItem[] => {
  const items: NavigationItem[] = [];

  for (const node of nodes) {
    if (node.type === "directory") {
      items.push({
        name: node.displayName,
        type: "segment",
        order: node.order,
        path: node.path,
        include: node.include,
        children: generateNavigationFromMarkdownData(node.children),
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

  return items;
};

const hasPreviewOnlyDescendants = (
  item: NavigationItem,
  flatIndex: Record<string, MarkdownNode>
): boolean => {
  if (!item.children) return false;

  for (const child of item.children.filter((c) => c.include !== false)) {
    const childNode = flatIndex[child.path || ""];
    if (childNode && (childNode as any).previewOnly === true) {
      return true;
    }
    if (child.type === "segment" && hasPreviewOnlyDescendants(child, flatIndex)) {
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
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  expandedItems,
  onToggleExpansion,
  isPageVisited,
  currentPath,
  data,
}) => {
  const itemPath = item.path || item.name;
  const isOpen = expandedItems.has(itemPath);

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
    const node = data.flatIndex[itemPath];
    if (node && node.type === "file") {
      return node.urlPath;
    } else if (node && node.type === "directory") {
      return node.urlPath;
    }
    return "/";
  };

  if (item.type === "page") {
    const node = data.flatIndex[item.path || ""];

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

  const itemNode = data.flatIndex[itemPath];

  const hasRequiredPageVisit = itemNode?.type === "directory" && itemNode.visibleAfterPage
    ? isPageVisited(itemNode.visibleAfterPage)
    : false;

  if (itemNode?.type === "directory" && itemNode.visibleAfterPage && !hasRequiredPageVisit) {
    return null;
  }

  const hasVisitedChildren = item.children
    ?.filter((child) => child.include !== false)
    .some((child) => {
      if (child.type === "page" && child.path) {
        return isPageVisited(child.path);
      }
      return false;
    });

  const hasPreviewDescendants = hasPreviewOnlyDescendants(item, data.flatIndex);

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
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const {
    isPageVisited,
    data,
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

  const navigationData = useMemo(
    () => generateNavigationFromMarkdownData(data.root.children),
    [data]
  );

  const currentPath = useMemo((): string => {
    const segments = params.segments as string[] | undefined;

    const getFirstPagePath = () => {
      const pages = Object.values(data.flatIndex)
        .filter((node) => node.type === "file" && node.include !== false && !(node as any).previewOnly && !(node as any).visibleAfterPage)
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
              A platform for generating full-stack{" "}
              <span className="md:hidden block">
                Next.js + TypeScript + PostgreSQL
              </span>{" "}
              web app roadmaps
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
    <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0">
      <SidebarHeader className="border-b border-gray-700">
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
