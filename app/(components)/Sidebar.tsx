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
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavigationItem, navigationData } from "@/configuration";
import { DataCyAttributes } from "@/types/cypress.types";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TreeItemProps {
  item: NavigationItem;
  level: number;
  expandedItems: Set<string>;
  onToggleExpansion: (itemPath: string) => void;
  parentPath?: string;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  expandedItems,
  onToggleExpansion,
  parentPath = "",
}) => {
  const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
  const isOpen = expandedItems.has(itemPath);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const buildLinkPath = () => {
    const pathSegments = itemPath.split("/").map(generateSlug);
    return `/${pathSegments.join("/")}`;
  };

  if (item.type === "page") {
    return (
      <Link href={buildLinkPath()}>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800 h-8 px-2"
          style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
        >
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
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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
        <div className="flex-grow flex flex-col relative">
          <div className="absolute inset-0 overflow-auto px-3">
            <div className="space-y-1">
              {navigationData.map((item, index) => (
                <TreeItem
                  key={index}
                  item={item}
                  level={0}
                  expandedItems={expandedItems}
                  onToggleExpansion={handleToggleExpansion}
                />
              ))}
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
        className="border-r-gray-800"
        expandedContent={expandedContent}
        collapsedContent={collapsedContent}
      />
    </TooltipProvider>
  );
};

export default Sidebar;
