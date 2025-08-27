//-| File path: app/(components)/Sidebar.tsx
"use client";
import { Button } from "@/components/ui/button";
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
import { Database, Map, Menu, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const expandedContent = (
    <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0">
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
      <div className="p-4 space-y-4">
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
