//-| File path: app/(components)/Sidebar.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ChevronDown, ChevronRight, Database, Map, Menu, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const uiShowcaseData = {
  form: {
    name: "Form",
    items: [
      "Email Input",
      "Password Input",
      "Textarea",
      "Select",
      "Checkbox",
      "Switch",
      "Button",
    ],
  },
  sidebar: {
    name: "Sidebar",
    items: ["Navigation", "Collapsible", "Responsive Layout"],
  },
  footer: {
    name: "Footer",
    items: ["Simple Footer", "Social Links", "Copyright"],
  },
  hero: {
    name: "Hero",
    items: ["Landing Hero", "Feature Showcase", "Call-to-Action"],
  },
  navigation: {
    name: "Navigation",
    items: ["Navbar", "Breadcrumbs", "Pagination"],
  },
  layout: {
    name: "Layout",
    items: ["Grid", "Cards", "Containers"],
  },
  "data-display": {
    name: "Data Display",
    items: ["Tables", "Lists", "Badges", "Alerts"],
  },
};

const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isUIRoute = pathname.startsWith("/ui");

  const toggleCheckbox = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const shouldShowCheckboxes = (section: string) => {
    return pathname.startsWith(`/ui/${section}`);
  };

  const renderUIShowcaseContent = () => (
    <div className="space-y-4">
      {renderDefaultContent()}
      <div className="p-4 space-y-2">
        {Object.entries(uiShowcaseData).map(([key, section]) => (
          <div key={key}>
            <Link href={`/ui/${key}`}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-white justify-between",
                  !isActive(`/ui/${key}`) && "hover:bg-gray-800"
                )}
                isActive={isActive(`/ui/${key}`)}
              >
                <span>{section.name}</span>
                {shouldShowCheckboxes(key) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </Link>
            {shouldShowCheckboxes(key) && (
              <div className="ml-6 mt-2 space-y-2">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${key}-${item}`}
                      checked={checkedItems.includes(item)}
                      onCheckedChange={() => toggleCheckbox(item)}
                      className="border-gray-500"
                    />
                    <label
                      htmlFor={`${key}-${item}`}
                      className="text-sm text-white cursor-pointer"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDefaultContent = () => (
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
  );

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
              A platform for generating full-stack web app roadmaps{" "}
            </p>
          </div>
        </div>
      </SidebarHeader>
      {isUIRoute ? renderUIShowcaseContent() : renderDefaultContent()}
    </SidebarContent>
  );

  const renderCollapsedUIContent = () => (
    <div className="space-y-2">
      {renderCollapsedDefaultContent()}
      <div className="p-2 space-y-2">
        {Object.entries(uiShowcaseData).map(([key, section]) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Link href={`/ui/${key}`}>
                <Button
                  className={cn(
                    "w-full text-white border-gray-600",
                    !isActive(`/ui/${key}`) &&
                      "hover:bg-gray-800 hover:text-white hover:border-gray-500"
                  )}
                  size="icon"
                  variant="ghost"
                  isActive={isActive(`/ui/${key}`)}
                >
                  <Monitor className="h-4 w-4" />
                  <span className="sr-only">{section.name}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{section.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  const renderCollapsedDefaultContent = () => (
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
      {isUIRoute ? renderCollapsedUIContent() : renderCollapsedDefaultContent()}
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
