"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { useThemeCSSVariables } from "./ThemeConfiguration.cssVariables";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  useThemeCSSVariables();

  return (
    <div className="flex flex-col lg:flex-row h-full theme-bg-background theme-text-foreground theme-font-sans">
      <ThemeConfigurationSidebar darkMode={darkMode} />
      <ThemeConfigurationPreview />
    </div>
  );
};
