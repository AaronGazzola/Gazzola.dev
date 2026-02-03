"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useThemeCSSVariables } from "./ThemeConfiguration.cssVariables";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  useThemeCSSVariables();

  return (
    <div className="flex flex-col theme-bg-background theme-text-foreground theme-font">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px-48px-120px)]">
        <ThemeConfigurationSidebar darkMode={darkMode} />
        <ThemeConfigurationPreview />
      </div>
    </div>
  );
};
