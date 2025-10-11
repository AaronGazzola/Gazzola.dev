"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";

export const ThemeConfiguration = () => {
  const { darkMode } = useEditorStore();

  return (
    <div
      className={cn(
        "flex h-full",
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      )}
    >
      <ThemeConfigurationSidebar />
      <ThemeConfigurationPreview />
    </div>
  );
};
