"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { useApplyTheme } from "./ThemeConfiguration.hooks";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();
  useApplyTheme(darkMode);

  return (
    <div className="flex h-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <ThemeConfigurationSidebar />
      <ThemeConfigurationPreview />
    </div>
  );
};
