"use client";
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
import configuration from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import {
  ChevronDown,
  ChevronRight,
  Database,
  File,
  Map,
  Menu,
  Monitor,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavigationItem {
  name: string;
  type: "file" | "directory";
  children?: NavigationItem[];
}

const navigationData: Record<string, NavigationItem[]> = {
  "/": [
    {
      name: "planning",
      type: "directory",
      children: [
        {
          name: "requirements.md",
          type: "directory",
          children: [
            {
              name: "test.md",
              type: "file",
            },
          ],
        },
        {
          name: "something",
          type: "directory",
          children: [
            {
              name: "test.md",
              type: "file",
            },
          ],
        },
        { name: "user-stories.md", type: "file" },
        { name: "timeline.md", type: "file" },
      ],
    },
    {
      name: "architecture",
      type: "directory",
      children: [
        { name: "system-design.md", type: "file" },
        { name: "tech-stack.md", type: "file" },
        { name: "api-design.md", type: "file" },
      ],
    },
    {
      name: "resources",
      type: "directory",
      children: [
        { name: "templates.md", type: "file" },
        { name: "best-practices.md", type: "file" },
      ],
    },
  ],
  "/ui": [
    {
      name: "navigation",
      type: "directory",
      children: [
        { name: "Breadcrumb", type: "file" },
        { name: "Command", type: "file" },
        { name: "Context Menu", type: "file" },
        { name: "Dropdown Menu", type: "file" },
        { name: "Menubar", type: "file" },
        { name: "Navigation Menu", type: "file" },
        { name: "Pagination", type: "file" },
        { name: "Sidebar", type: "file" },
        { name: "Tabs", type: "file" },
      ],
    },
    {
      name: "form",
      type: "directory",
      children: [
        { name: "Button", type: "file" },
        { name: "Calendar", type: "file" },
        { name: "Checkbox", type: "file" },
        { name: "Combobox", type: "file" },
        { name: "Date Picker", type: "file" },
        { name: "Input", type: "file" },
        { name: "Input OTP", type: "file" },
        { name: "Label", type: "file" },
        { name: "Radio Group", type: "file" },
        { name: "React Hook Form", type: "file" },
        { name: "Select", type: "file" },
        { name: "Slider", type: "file" },
        { name: "Switch", type: "file" },
        { name: "Textarea", type: "file" },
        { name: "Toggle", type: "file" },
        { name: "Toggle Group", type: "file" },
      ],
    },
    {
      name: "data-display",
      type: "directory",
      children: [
        { name: "Aspect Ratio", type: "file" },
        { name: "Avatar", type: "file" },
        { name: "Badge", type: "file" },
        { name: "Card", type: "file" },
        { name: "Carousel", type: "file" },
        { name: "Chart", type: "file" },
        { name: "Data Table", type: "file" },
        { name: "Separator", type: "file" },
        { name: "Table", type: "file" },
        { name: "Typography", type: "file" },
      ],
    },
    {
      name: "feedback",
      type: "directory",
      children: [
        { name: "Alert", type: "file" },
        { name: "Progress", type: "file" },
        { name: "Skeleton", type: "file" },
        { name: "Sonner", type: "file" },
        { name: "Toast", type: "file" },
      ],
    },
    {
      name: "layout",
      type: "directory",
      children: [
        { name: "Accordion", type: "file" },
        { name: "Collapsible", type: "file" },
        { name: "Resizable", type: "file" },
        { name: "Scroll-area", type: "file" },
      ],
    },
    {
      name: "overlay",
      type: "directory",
      children: [
        { name: "Alert Dialog", type: "file" },
        { name: "Dialog", type: "file" },
        { name: "Drawer", type: "file" },
        { name: "Hover Card", type: "file" },
        { name: "Popover", type: "file" },
        { name: "Sheet", type: "file" },
        { name: "Tooltip", type: "file" },
      ],
    },
  ],
  "/ux": [
    {
      name: "research",
      type: "directory",
      children: [
        { name: "user-interviews.md", type: "file" },
        { name: "surveys.md", type: "file" },
        { name: "analytics.md", type: "file" },
      ],
    },
    {
      name: "design",
      type: "directory",
      children: [
        {
          name: "wireframes",
          type: "directory",
          children: [
            { name: "desktop.fig", type: "file" },
            { name: "mobile.fig", type: "file" },
          ],
        },
        {
          name: "prototypes",
          type: "directory",
          children: [
            { name: "interactive.fig", type: "file" },
            { name: "user-flow.fig", type: "file" },
          ],
        },
      ],
    },
    {
      name: "testing",
      type: "directory",
      children: [
        { name: "usability-tests.md", type: "file" },
        { name: "a-b-tests.md", type: "file" },
      ],
    },
  ],
  "/db": [
    {
      name: "schema",
      type: "directory",
      children: [
        { name: "models.prisma", type: "file" },
        { name: "migrations", type: "directory", children: [] },
        { name: "seeds.ts", type: "file" },
      ],
    },
    {
      name: "queries",
      type: "directory",
      children: [
        { name: "users.sql", type: "file" },
        { name: "products.sql", type: "file" },
        { name: "analytics.sql", type: "file" },
      ],
    },
    {
      name: "optimization",
      type: "directory",
      children: [
        { name: "indexes.sql", type: "file" },
        { name: "performance.md", type: "file" },
      ],
    },
  ],
};

interface TreeItemProps {
  item: NavigationItem;
  level: number;
  showFileIcons?: boolean;
  expandedItems: Set<string>;
  onToggleExpansion: (itemPath: string) => void;
  parentPath?: string;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  showFileIcons,
  expandedItems,
  onToggleExpansion,
  parentPath = "",
}) => {
  const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
  const isOpen = expandedItems.has(itemPath);

  if (item.type === "file") {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-gray-800 h-8 px-2"
        style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
      >
        {showFileIcons && <File className="h-3 w-3 mr-2" />}
        {item.name}
      </Button>
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
            showFileIcons={showFileIcons}
            expandedItems={expandedItems}
            onToggleExpansion={onToggleExpansion}
            parentPath={itemPath}
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
    return pathname === href;
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
      <SidebarHeader className="pt-8 p-6 border-b border-gray-700">
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
      <div className="p-4 space-y-4 flex-grow flex flex-col">
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
        <div className="pb-4 flex-grow flex flex-col relative">
          <div className=" border-gray-700 pt-4 border-t absolute inset-0 overflow-auto">
            {navigationData[pathname] && (
              <div className="space-y-1">
                {navigationData[pathname].map((item, index) => (
                  <TreeItem
                    key={index}
                    item={item}
                    level={0}
                    showFileIcons={pathname === "/"}
                    expandedItems={expandedItems}
                    onToggleExpansion={handleToggleExpansion}
                  />
                ))}
              </div>
            )}
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
        {navigationData[pathname] && (
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
