"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { Separator } from "@/components/editor/ui/separator";
import { cn } from "@/lib/tailwind.utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { AVAILABLE_COMPONENTS, COMPONENT_CATEGORIES } from "./ThemeConfiguration.types";

export const ThemeConfigurationSidebar = () => {
  const { darkMode, themeConfigState, setSelectedComponent } = useEditorStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = AVAILABLE_COMPONENTS.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const componentsByCategory = COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    components: filteredComponents.filter((c) => c.category === category.id),
  })).filter((category) => category.components.length > 0);

  return (
    <div
      className={cn(
        "w-[280px] border-r flex flex-col",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="p-6">
        <h2
          className={cn(
            "text-base font-semibold mb-4 tracking-tight",
            darkMode ? "text-gray-100" : "text-gray-900"
          )}
        >
          Components
        </h2>
        <div className="relative">
          <Search
            className={cn(
              "absolute left-3 top-2.5 h-4 w-4",
              darkMode ? "text-gray-500" : "text-gray-400"
            )}
          />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-9 h-9",
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
                : "bg-gray-50 border-gray-200"
            )}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 pb-6 space-y-6">
          {componentsByCategory.map((category) => (
            <div key={category.id}>
              <h3
                className={cn(
                  "text-xs font-medium uppercase tracking-wider mb-3",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                {category.name}
              </h3>
              <div className="space-y-0.5">
                {category.components.map((component) => {
                  const isSelected =
                    themeConfigState.selectedComponentId === component.id;
                  return (
                    <Button
                      key={component.id}
                      variant="ghost"
                      onClick={() => setSelectedComponent(component.id)}
                      className={cn(
                        "w-full justify-start px-3 py-2 text-sm font-medium transition-all",
                        isSelected
                          ? darkMode
                            ? "bg-blue-600/90 text-white hover:bg-blue-600 shadow-sm"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                          : darkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {component.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredComponents.length === 0 && (
            <div
              className={cn(
                "text-center py-12 text-sm font-medium",
                darkMode ? "text-gray-600" : "text-gray-400"
              )}
            >
              No components found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
