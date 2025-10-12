"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { useThemeCSSVariables } from "./ThemeConfiguration.cssVariables";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  useThemeCSSVariables();

  return (
    <div
      className="flex h-full"
      style={{
        backgroundColor: "var(--theme-background)",
        color: "var(--theme-foreground)",
        fontFamily: "var(--theme-font-sans)"
      }}
    >
      <ThemeConfigurationSidebar darkMode={darkMode} />
      <ThemeConfigurationPreview />
    </div>
  );
};
