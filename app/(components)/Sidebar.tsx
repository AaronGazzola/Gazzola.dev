"use client";
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
import configuration, { NavigationItem, navigationData } from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Map,
  Menu,
  Monitor,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


interface TreeItemProps {
  item: NavigationItem;
  level: number;
  expandedItems: Set<string>;
  onToggleExpansion: (itemPath: string) => void;
  parentPath?: string;
  basePath?: string;
  rootIcon?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  expandedItems,
  onToggleExpansion,
  parentPath = "",
  basePath = "",
  rootIcon: RootIcon,
}) => {
  const pathname = usePathname();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
  const isOpen = expandedItems.has(itemPath);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const buildLinkPath = () => {
    if (!basePath) return "#";
    const pathSegments = itemPath.split("/").map(generateSlug);
    return `${basePath}/${pathSegments.join("/")}`;
  };

  const isItemActive =
    pathname === buildLinkPath() || pathname.startsWith(buildLinkPath() + "/");
  const gradientId = `gradient-sidebar-${itemPath.replace(/[^a-zA-Z0-9]/g, "-")}`;

  if (item.type === "page") {
    return (
      <Link href={buildLinkPath()}>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800 h-8 px-2"
          style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
        >
          {isItemActive && RootIcon && (
            <div className="relative">
              <svg
                className="absolute inset-0 h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id={gradientId}
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
              </svg>
              <RootIcon
                className="h-4 w-4"
                style={{
                  stroke: `url(#${gradientId})`,
                  fill: "none",
                  strokeWidth: 2,
                }}
              />
            </div>
          )}
          <div className="flex items-center">{item.name}</div>
        </Button>
      </Link>
    );
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
        {item.children?.map((child, index) => (
          <TreeItem
            key={index}
            item={child}
            level={level + 1}
            expandedItems={expandedItems}
            onToggleExpansion={onToggleExpansion}
            parentPath={itemPath}
            basePath={basePath}
            rootIcon={RootIcon}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleToggleExpansion = (itemPath: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);

      if (prev.has(itemPath)) {
        newSet.delete(itemPath);
        const pathsToRemove = Array.from(prev).filter((path) =>
          path.startsWith(itemPath + "/")
        );
        pathsToRemove.forEach((path) => newSet.delete(path));
      } else {
        const pathParts = itemPath.split("/");
        const currentLevel = pathParts.length;

        const siblingsAtSameLevel = Array.from(prev).filter((path) => {
          const siblingParts = path.split("/");
          return (
            siblingParts.length === currentLevel &&
            siblingParts.slice(0, -1).join("/") ===
              pathParts.slice(0, -1).join("/")
          );
        });

        siblingsAtSameLevel.forEach((siblingPath) => {
          newSet.delete(siblingPath);
          const childPathsToRemove = Array.from(prev).filter((path) =>
            path.startsWith(siblingPath + "/")
          );
          childPathsToRemove.forEach((path) => newSet.delete(path));
        });

        for (let i = 1; i <= pathParts.length; i++) {
          const parentPath = pathParts.slice(0, i).join("/");
          newSet.add(parentPath);
        }
      }

      return newSet;
    });
  };

  const expandedContent = (
    <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0 flex flex-col">
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
              A platform for generating full-stack web app roadmaps
            </p>
          </div>
        </div>
      </SidebarHeader>
      <div className="p-0 space-y-4 flex-grow flex flex-col">
        <div className="w-full p-3 pb-0 flex flex-col gap-3">
          <Link href={configuration.paths.roadmap}>
            <Button
              variant="outline"
              className={cn(
                "w-full text-white",
                !isActive(configuration.paths.roadmap) && "hover:bg-gray-800"
              )}
              isActive={isActive(configuration.paths.roadmap)}
            >
              <Map className="h-4 w-4 mr-2" />
              Roadmap
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={configuration.paths.UI} className="flex-1">
              <Button
                variant="outline"
                className={cn(
                  "w-full text-white border-gray-600 gap-1.5 px-3",
                  !isActive(configuration.paths.UI) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                isActive={isActive(configuration.paths.UI)}
              >
                <Monitor className="h-4 w-4" />
                UI
              </Button>
            </Link>
            <Link href={configuration.paths.UX} className="flex-1">
              <Button
                variant="outline"
                className={cn(
                  "w-full text-white border-gray-600 gap-1.5 px-3",
                  !isActive(configuration.paths.UX) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                isActive={isActive(configuration.paths.UX)}
              >
                <Users className="h-4 w-4" />
                UX
              </Button>
            </Link>
            <Link href={configuration.paths.DB} className="flex-1">
              <Button
                variant="outline"
                className={cn(
                  "w-full text-white border-gray-600 gap-1.5 px-3",
                  !isActive(configuration.paths.DB) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                isActive={isActive(configuration.paths.DB)}
              >
                <Database className="h-4 w-4" />
                DB
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-grow flex flex-col relative">
          <div className="absolute inset-0 overflow-auto px-3">
            {Object.entries(navigationData).map(([basePath, data]) => {
              const shouldShowNavigation =
                pathname === basePath || pathname.startsWith(basePath + "/");
              if (!shouldShowNavigation) return null;

              const getRootIcon = (path: string) => {
                switch (path) {
                  case "/roadmap":
                    return Map;
                  case "/ui":
                    return Monitor;
                  case "/ux":
                    return Users;
                  case "/db":
                    return Database;
                  default:
                    return undefined;
                }
              };

              return (
                <div key={basePath} className="space-y-1">
                  {data.map((item, index) => (
                    <TreeItem
                      key={index}
                      item={item}
                      level={0}
                      expandedItems={expandedItems}
                      onToggleExpansion={handleToggleExpansion}
                      basePath={basePath}
                      rootIcon={getRootIcon(basePath)}
                    />
                  ))}
                </div>
              );
            })}
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
      <div className="p-2 space-y-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={configuration.paths.roadmap}>
              <Button
                className={cn(
                  "w-full text-white border-gray-600",
                  !isActive(configuration.paths.roadmap) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                size="icon"
                variant="ghost"
                isActive={isActive(configuration.paths.roadmap)}
              >
                <Map className="h-4 w-4" />
                <span className="sr-only">Roadmap</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Roadmap</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={configuration.paths.UI}>
              <Button
                className={cn(
                  "w-full text-white border-gray-600",
                  !isActive(configuration.paths.UI) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                size="icon"
                variant="ghost"
                isActive={isActive(configuration.paths.UI)}
              >
                <Monitor className="h-4 w-4" />
                <span className="sr-only">UI</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>UI</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={configuration.paths.UX}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full text-white border-gray-600",
                  !isActive(configuration.paths.UX) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                isActive={isActive(configuration.paths.UX)}
              >
                <Users className="h-4 w-4" />
                <span className="sr-only">UX</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>UX</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={configuration.paths.DB}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full text-white border-gray-600",
                  !isActive(configuration.paths.DB) &&
                    "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                )}
                isActive={isActive(configuration.paths.DB)}
              >
                <Database className="h-4 w-4" />
                <span className="sr-only">DB</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>DB</p>
          </TooltipContent>
        </Tooltip>
        {Object.keys(navigationData).some(
          (basePath) =>
            pathname === basePath || pathname.startsWith(basePath + "/")
        ) && (
          <div className="border-t border-gray-700 pt-2">
            <div className="w-full h-2 bg-gray-800 rounded-full mx-2">
              <div className="h-full w-3/4 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </SidebarContent>
  );

  return (
    <TooltipProvider>
      <ShadcnSidebar
        collapsible="icon"
        className="border-r-gray-800"
        expandedContent={expandedContent}
        collapsedContent={collapsedContent}
      />
    </TooltipProvider>
  );
};

export default Sidebar;
