"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import { ChevronDown } from "lucide-react";
import { COMPONENT_PREVIEWS } from "./ThemeConfiguration.previews";
import { AVAILABLE_COMPONENTS } from "./ThemeConfiguration.types";
import { mergeThemeStyles } from "./ThemeConfiguration.utils";

export const ThemeConfigurationGrid = () => {
  const { darkMode, themeConfigState, setGridComponentVariant } = useEditorStore();

  const currentTheme =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeTheme
      : themeConfigState.darkModeTheme;

  const componentsToDisplay = themeConfigState.selectedComponents.length > 0
    ? AVAILABLE_COMPONENTS.filter(c =>
        themeConfigState.selectedComponents.includes(c.id)
      )
    : AVAILABLE_COMPONENTS.slice(0, 12);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {componentsToDisplay.map((component) => {
        const PreviewComponent = COMPONENT_PREVIEWS[component.id];
        const selectedVariant = themeConfigState.gridComponentVariants[component.id] || component.defaultVariant;

        const currentVariantStyles =
          themeConfigState.themeMode === "light"
            ? themeConfigState.lightModeComponentStyles[component.id] || {}
            : themeConfigState.darkModeComponentStyles[component.id] || {};

        const mergedStyles = mergeThemeStyles(
          currentTheme,
          currentVariantStyles,
          selectedVariant
        );

        return (
          <div
            key={component.id}
            className={cn(
              "rounded-lg border p-6 flex flex-col gap-4 min-h-[200px] bg-transparent",
              darkMode ? "border-gray-800" : "border-gray-200"
            )}
          >
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-sm font-semibold",
                  darkMode ? "text-gray-200" : "text-gray-900"
                )}
              >
                {component.name}
              </h3>
              {component.variants.length > 1 ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer select-none",
                        darkMode
                          ? "bg-white text-black hover:opacity-80"
                          : "bg-black text-white hover:opacity-80"
                      )}
                    >
                      {selectedVariant}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1" align="end">
                    <div className="flex flex-col gap-0.5">
                      {component.variants.map((variant) => (
                        <Button
                          key={variant}
                          variant="ghost"
                          size="sm"
                          onClick={() => setGridComponentVariant(component.id, variant)}
                          className={cn(
                            "justify-start h-8 text-xs",
                            selectedVariant === variant &&
                              (darkMode
                                ? "bg-blue-600 text-white hover:bg-blue-600"
                                : "bg-blue-500 text-white hover:bg-blue-500")
                          )}
                        >
                          {variant}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full bg-transparent border cursor-default select-none",
                    darkMode
                      ? "border-gray-700 text-gray-400"
                      : "border-gray-300 text-gray-600"
                  )}
                >
                  {selectedVariant}
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              {PreviewComponent ? (
                <PreviewComponent
                  variant={selectedVariant}
                  styleConfig={mergedStyles}
                />
              ) : (
                <div
                  className={cn(
                    "text-xs",
                    darkMode ? "text-gray-500" : "text-gray-400"
                  )}
                >
                  No preview
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
