"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import { useEffect } from "react";
import { ThemeConfigurationPreview } from "./ThemeConfiguration.preview";
import { ThemeConfigurationSidebar } from "./ThemeConfiguration.sidebar";
import { ThemeConfigurationTabs } from "./ThemeConfiguration.tabs";

export const ThemeConfiguration = () => {
  const { darkMode, initializeAvailableComponents } = useEditorStore();

  useEffect(() => {
    initializeAvailableComponents();
  }, [initializeAvailableComponents]);

  return (
    <div
      className={cn(
        "flex flex-col h-full max-h-[calc(100vh-150px)]",
        darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900"
      )}
    >
      <ThemeConfigurationTabs />

      <div className="flex flex-1 overflow-hidden">
        <ThemeConfigurationSidebar />
        <ThemeConfigurationPreview />
      </div>
    </div>
  );
};
