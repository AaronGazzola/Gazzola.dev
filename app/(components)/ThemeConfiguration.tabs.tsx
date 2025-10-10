"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Switch } from "@/components/editor/ui/switch";
import { cn } from "@/lib/tailwind.utils";
import { Palette, Settings } from "lucide-react";
import { ThemeTab } from "./ThemeConfiguration.types";

export const ThemeConfigurationTabs = () => {
  const { darkMode, themeConfigState, setActiveTab, setThemeMode } = useEditorStore();

  const tabs: { id: ThemeTab; label: string; icon: React.ElementType }[] = [
    { id: "global", label: "Global Theme", icon: Palette },
    { id: "components", label: "Components", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "border-b px-6 flex items-center justify-between",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = themeConfigState.activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px",
                isActive
                  ? darkMode
                    ? "text-blue-400 border-blue-400"
                    : "text-blue-600 border-blue-600"
                  : darkMode
                  ? "text-gray-400 border-transparent hover:text-gray-200"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 py-3">
        <span
          className={cn(
            "text-sm font-medium",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          {themeConfigState.themeMode === "dark" ? "Dark" : "Light"}
        </span>
        <Switch
          checked={themeConfigState.themeMode === "dark"}
          onCheckedChange={(checked) =>
            setThemeMode(checked ? "dark" : "light")
          }
        />
      </div>
    </div>
  );
};
