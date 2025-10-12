"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { useTheme } from "./ThemeConfiguration.hooks";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  const theme = useTheme();

  return (
    <div
      className="flex h-full"
      style={{
        backgroundColor: theme.hsl(theme.colors.background),
        color: theme.hsl(theme.colors.foreground)
      }}
    >
      <ThemeConfigurationSidebar darkMode={darkMode} />
      <ThemeConfigurationPreview />
    </div>
  );
};
