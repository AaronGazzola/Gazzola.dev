"use client";

import { cn } from "@/lib/tailwind.utils";
import { useEditorStore } from "@/app/(editor)/layout.stores";

export const AppStructure = () => {
  const { darkMode } = useEditorStore();

  return (
    <div
      className={cn(
        "p-6 rounded-lg",
        darkMode ? "bg-gray-800" : "bg-gray-50"
      )}
    >
      <div
        className={cn(
          "text-center text-sm",
          darkMode ? "text-gray-400" : "text-gray-600"
        )}
      >
        App Structure component placeholder
      </div>
    </div>
  );
};