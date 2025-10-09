"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import { cn } from "@/lib/tailwind.utils";
import { Grid3x3, Maximize2, RotateCcw, Square } from "lucide-react";
import { COMPONENT_PREVIEWS } from "./ThemeConfiguration.previews";
import { ThemeConfigurationGrid } from "./ThemeConfiguration.grid";
import { AVAILABLE_COMPONENTS } from "./ThemeConfiguration.types";
import { mergeThemeStyles } from "./ThemeConfiguration.utils";

export const ThemeConfigurationPreview = () => {
  const {
    darkMode,
    themeConfigState,
    setThemePreviewMode,
    resetComponentStyle,
  } = useEditorStore();

  const currentTheme =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeTheme
      : themeConfigState.darkModeTheme;

  const selectedComponent = AVAILABLE_COMPONENTS.find(
    (c) => c.id === themeConfigState.selectedComponentId
  );

  const PreviewComponent = selectedComponent
    ? COMPONENT_PREVIEWS[selectedComponent.id]
    : null;

  const currentVariantStyles =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {}
      : themeConfigState.darkModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {};

  const mergedStyles = mergeThemeStyles(
    currentTheme,
    currentVariantStyles,
    themeConfigState.activeVariant
  );

  const showGrid =
    themeConfigState.previewMode === "grid" ||
    (themeConfigState.activeTab === "global" && !selectedComponent);

  return (
    <div className="flex-1 flex flex-col">
      <div
        className={cn(
          "border-b px-6 py-3 flex items-center justify-between",
          darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            variant={themeConfigState.previewMode === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setThemePreviewMode("single")}
            className="h-8"
            disabled={!selectedComponent}
          >
            <Square className="h-3.5 w-3.5 mr-1.5" />
            Single
          </Button>
          <Button
            variant={themeConfigState.previewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setThemePreviewMode("grid")}
            className="h-8"
          >
            <Grid3x3 className="h-3.5 w-3.5 mr-1.5" />
            Grid
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {selectedComponent && themeConfigState.previewMode === "single" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                resetComponentStyle(
                  themeConfigState.selectedComponentId!,
                  themeConfigState.activeVariant
                )
              }
              className="h-8"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-auto"
        style={{
          backgroundColor: currentTheme.previewBackgroundColor,
        }}
      >
        {showGrid ? (
          <ThemeConfigurationGrid />
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            {PreviewComponent && themeConfigState.previewMode === "single" ? (
              <div
                style={{
                  color: currentTheme.defaultFontColor,
                  fontFamily: `var(--font-${currentTheme.defaultFontFamily})`,
                  fontSize: currentTheme.fontSize,
                }}
              >
                <PreviewComponent
                  variant={themeConfigState.activeVariant}
                  styleConfig={mergedStyles}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "text-center",
                  darkMode ? "text-gray-500" : "text-gray-400"
                )}
              >
                <p className="text-lg font-medium mb-2">No Component Selected</p>
                <p className="text-sm">
                  Select a component from the sidebar to preview and configure it
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
