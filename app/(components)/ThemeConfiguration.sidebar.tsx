"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { Separator } from "@/components/editor/ui/separator";
import { cn } from "@/lib/tailwind.utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { StyleControls } from "./ThemeConfiguration.controls";
import { ThemeConfigurationGlobal } from "./ThemeConfiguration.global";
import { AVAILABLE_COMPONENTS, COMPONENT_CATEGORIES } from "./ThemeConfiguration.types";

export const ThemeConfigurationSidebar = () => {
  const {
    darkMode,
    themeConfigState,
    setSelectedComponent,
    setActiveVariant,
    updateComponentStyle,
    resetComponentStyle,
  } = useEditorStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (themeConfigState.activeTab === "global") {
    return <ThemeConfigurationGlobal />;
  }

  const filteredComponents = AVAILABLE_COMPONENTS.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const componentsByCategory = COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    components: filteredComponents.filter((c) => c.category === category.id),
  })).filter((category) => category.components.length > 0);

  const selectedComponent = AVAILABLE_COMPONENTS.find(
    (c) => c.id === themeConfigState.selectedComponentId
  );

  const currentVariantStyles =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {}
      : themeConfigState.darkModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {};

  const currentStyles =
    currentVariantStyles[themeConfigState.activeVariant] || {};

  const handleStyleChange = (key: string, value: any) => {
    if (themeConfigState.selectedComponentId) {
      updateComponentStyle(
        themeConfigState.selectedComponentId,
        themeConfigState.activeVariant,
        { [key]: value }
      );
    }
  };

  const handleReset = () => {
    if (themeConfigState.selectedComponentId) {
      resetComponentStyle(
        themeConfigState.selectedComponentId,
        themeConfigState.activeVariant
      );
    }
  };

  return (
    <div
      className={cn(
        "w-[320px] border-r flex flex-col",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      {!selectedComponent ? (
        <>
          <div className="p-6 border-b border-gray-800">
            <h2
              className={cn(
                "text-base font-semibold tracking-tight",
                darkMode ? "text-gray-100" : "text-gray-900"
              )}
            >
              Components
            </h2>
            <div className="relative mt-4">
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
            <div className="p-6 space-y-6">
              {componentsByCategory.map((category) => (
                <div key={category.id}>
                  <h3
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider mb-3",
                      darkMode ? "text-gray-500" : "text-gray-500"
                    )}
                  >
                    {category.name}
                  </h3>
                  <div className="space-y-1">
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
                    "text-center py-12 text-sm",
                    darkMode ? "text-gray-600" : "text-gray-400"
                  )}
                >
                  No components found
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <>
          <div className="p-6 border-b border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedComponent(null)}
              className={cn(
                "mb-4 -ml-2",
                darkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              ← Back to Components
            </Button>
            <h2
              className={cn(
                "text-base font-semibold tracking-tight",
                darkMode ? "text-gray-100" : "text-gray-900"
              )}
            >
              {selectedComponent.name}
            </h2>
            <p
              className={cn(
                "text-xs mt-1",
                darkMode ? "text-gray-500" : "text-gray-500"
              )}
            >
              Configure component styles
            </p>

            {selectedComponent.variants.length > 1 && (
              <div className="mt-4">
                <Label
                  className={cn(
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Variant
                </Label>
                <Select
                  value={themeConfigState.activeVariant}
                  onValueChange={setActiveVariant}
                >
                  <SelectTrigger
                    className={cn(
                      "h-9",
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-100"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedComponent.variants.map((variant) => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {themeConfigState.selectedComponentId && (
                <>
                  <StyleControls
                    componentId={themeConfigState.selectedComponentId}
                    variant={themeConfigState.activeVariant}
                    currentStyles={currentStyles}
                    onStyleChange={handleStyleChange}
                  />

                  <Separator className="my-4" />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full"
                  >
                    Reset Styles
                  </Button>
                </>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
