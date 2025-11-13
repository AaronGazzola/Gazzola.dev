"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { useThemeCSSVariables } from "./ThemeConfiguration.cssVariables";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  useThemeCSSVariables();

  return (
    <div className="flex flex-col lg:flex-row theme-bg-background theme-text-foreground theme-font-sans lg:h-[calc(100vh-100px-48px)]">
      <ThemeConfigurationSidebar darkMode={darkMode} />
      <ThemeConfigurationPreview />
    </div>
  );
};
