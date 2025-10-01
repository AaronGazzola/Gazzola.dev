"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="p-4">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          Components
        </h2>
        <div className="relative">
          <Search
            className={cn(
              "absolute left-2 top-2.5 h-4 w-4",
              darkMode ? "text-gray-500" : "text-gray-400"
            )}
          />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-4 space-y-4">
          {componentsByCategory.map((category) => (
            <div key={category.id}>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-2",
                  darkMode ? "text-gray-400" : "text-gray-600"
                )}
              >
                {category.name}
              </h3>
              <div className="space-y-1">
                {category.components.map((component) => {
                  const isSelected =
                    themeConfigState.selectedComponentId === component.id;
                  return (
                    <button
                      key={component.id}
                      onClick={() => setSelectedComponent(component.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        isSelected
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {component.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredComponents.length === 0 && (
            <div
              className={cn(
                "text-center py-8 text-sm",
                darkMode ? "text-gray-500" : "text-gray-400"
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
