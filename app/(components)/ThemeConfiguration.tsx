"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { useEffect } from "react";
import { COMPONENT_PREVIEWS } from "./ThemeConfiguration.previews";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationToolbar } from "./ThemeConfiguration.toolbar";
import { AVAILABLE_COMPONENTS } from "./ThemeConfiguration.types";
import { mergeThemeStyles } from "./ThemeConfiguration.utils";

export const ThemeConfiguration = () => {
  const { darkMode, themeConfigState, initializeAvailableComponents } =
    useEditorStore();

  useEffect(() => {
    initializeAvailableComponents();
  }, [initializeAvailableComponents]);

  const selectedComponent = AVAILABLE_COMPONENTS.find(
    (c) => c.id === themeConfigState.selectedComponentId
  );

  const PreviewComponent = selectedComponent
    ? COMPONENT_PREVIEWS[selectedComponent.id]
    : null;

  const currentTheme =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeTheme
      : themeConfigState.darkModeTheme;

  const currentVariantStyles =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {}
      : themeConfigState.darkModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {};

  const mergedStyles = mergeThemeStyles(currentTheme, currentVariantStyles, themeConfigState.activeVariant);

  return (
    <div
      className={cn(
        "flex h-full max-h-[calc(100vh-150px)]",
        darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900"
      )}
    >
      <ThemeConfigurationSidebar />

      <div className="flex-1 flex flex-col">
        <ThemeConfigurationToolbar />

        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ backgroundColor: currentTheme.previewBackgroundColor }}
        >
          {PreviewComponent ? (
            <PreviewComponent
              variant={themeConfigState.activeVariant}
              styleConfig={mergedStyles}
            />
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
      </div>
    </div>
  );
};
