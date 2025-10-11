"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/configuration/ui/button";
import { Input } from "@/components/configuration/ui/input";
import { Label } from "@/components/configuration/ui/label";
import { ScrollArea } from "@/components/configuration/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/configuration/ui/select";
import { Slider } from "@/components/configuration/ui/slider";
import { cn } from "@/lib/tailwind.utils";
import { ChevronLeft, ChevronRight, ChevronDown, Shuffle } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/configuration/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/configuration/ui/collapsible";

type TabType = "colors" | "typography" | "other";

const THEMES = [
  { name: "Default", colors: ["#09090b", "#fafafa", "#f4f4f5", "#18181b"] },
  { name: "Slate", colors: ["#0f172a", "#f8fafc", "#e2e8f0", "#1e293b"] },
  { name: "Stone", colors: ["#1c1917", "#fafaf9", "#e7e5e4", "#292524"] },
  { name: "Zinc", colors: ["#18181b", "#fafafa", "#e4e4e7", "#27272a"] },
  { name: "Neutral", colors: ["#171717", "#fafafa", "#e5e5e5", "#262626"] },
  { name: "Red", colors: ["#7f1d1d", "#fef2f2", "#fecaca", "#991b1b"] },
  { name: "Rose", colors: ["#881337", "#fff1f2", "#fecdd3", "#9f1239"] },
  { name: "Orange", colors: ["#7c2d12", "#fff7ed", "#fed7aa", "#9a3412"] },
  { name: "Green", colors: ["#14532d", "#f0fdf4", "#bbf7d0", "#166534"] },
  { name: "Blue", colors: ["#1e3a8a", "#eff6ff", "#bfdbfe", "#1e40af"] },
  { name: "Yellow", colors: ["#713f12", "#fefce8", "#fef08a", "#854d0e"] },
  { name: "Violet", colors: ["#4c1d95", "#f5f3ff", "#ddd6fe", "#5b21b6"] },
];

export const ThemeConfigurationSidebar = () => {
  const { darkMode } = useEditorStore();
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePrevTheme = () => {
    setSelectedTheme((prev) => (prev === 0 ? THEMES.length - 1 : prev - 1));
  };

  const handleNextTheme = () => {
    setSelectedTheme((prev) => (prev === THEMES.length - 1 ? 0 : prev + 1));
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    setSelectedTheme(randomIndex);
    setIsPopoverOpen(false);
  };

  const filteredThemes = THEMES.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "colors" as TabType, label: "Colors" },
    { id: "typography" as TabType, label: "Typography" },
    { id: "other" as TabType, label: "Other" },
  ];

  return (
    <div
      className={cn(
        "w-80 border-r flex flex-col",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div
        className={cn(
          "p-6 border-b",
          darkMode ? "border-gray-800" : "border-gray-200"
        )}
      >
        <Label
          className={cn(
            "text-xs font-medium mb-2 block",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          Theme
        </Label>
        <div className="flex items-center gap-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-1 h-9 px-3 rounded-md border flex items-center justify-between text-sm font-medium",
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
                    : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"
                )}
              >
                <span>{THEMES[selectedTheme].name}</span>
                <div className="flex items-center gap-1 ml-2">
                  {THEMES[selectedTheme].colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-sm border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "w-80 p-0",
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              )}
              align="start"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "h-8 text-xs flex-1",
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomTheme}
                    className={cn(
                      "h-8 w-8 p-0",
                      darkMode
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <Shuffle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-64">
                <div className="p-2 space-y-1">
                  {filteredThemes.map((theme, idx) => {
                    const themeIndex = THEMES.findIndex(t => t.name === theme.name);
                    const isSelected = selectedTheme === themeIndex;
                    return (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setSelectedTheme(themeIndex);
                          setIsPopoverOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                          isSelected
                            ? darkMode
                              ? "bg-gray-800 text-white"
                              : "bg-gray-100 text-black"
                            : darkMode
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span>{theme.name}</span>
                        <div className="flex items-center gap-1">
                          {theme.colors.map((color, colorIdx) => (
                            <div
                              key={colorIdx}
                              className="w-3 h-3 rounded-sm border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevTheme}
            className={cn(
              "h-9 w-9 p-0 shrink-0",
              darkMode
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextTheme}
            className={cn(
              "h-9 w-9 p-0 shrink-0",
              darkMode
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-b",
          darkMode ? "border-gray-800" : "border-gray-200"
        )}
      >
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-3 text-xs font-medium border-b-2 transition-colors",
                  isActive
                    ? darkMode
                      ? "text-gray-100 border-blue-500"
                      : "text-gray-900 border-blue-600"
                    : darkMode
                    ? "text-gray-500 border-transparent hover:text-gray-300"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {activeTab === "colors" && (
            <div className="space-y-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Primary Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Primary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 98%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Secondary Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Secondary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Secondary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Accent Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Accent
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Base Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Card Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Card Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Card Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Popover Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Popover Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Popover Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Muted Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Muted
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Muted Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="215.4 16.3% 46.9%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-500" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Destructive Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Destructive
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 84.2% 60.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-red-500" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Destructive Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 98%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Border & Input Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Border
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="214.3 31.8% 91.4%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Input
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="214.3 31.8% 91.4%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Chart Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num}>
                      <Label
                        className={cn(
                          "text-xs mb-1.5 block",
                          darkMode ? "text-gray-400" : "text-gray-600"
                        )}
                      >
                        Chart {num}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          defaultValue={`${num * 40} 70% 50%`}
                          className={cn(
                            "h-9 text-xs font-mono flex-1",
                            darkMode
                              ? "bg-gray-900 border-gray-700 text-gray-200"
                              : "bg-gray-50 border-gray-200"
                          )}
                        />
                        <div
                          className="w-9 h-9 rounded border"
                          style={{
                            background: `hsl(${num * 40} 70% 50%)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Sidebar Colors</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 98%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.3% 26.1%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-700" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Primary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.9% 10%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 98%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Accent
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 4.8% 95.9%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.9% 10%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Border
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="220 13% 91%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sidebar Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="217.2 91.2% 59.8%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-blue-500" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Font Family</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Sans-Serif Font
                    </Label>
                    <Input
                      defaultValue="Inter, system-ui, sans-serif"
                      className={cn(
                        "h-9 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Serif Font
                    </Label>
                    <Input
                      defaultValue="Georgia, serif"
                      className={cn(
                        "h-9 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Monospace Font
                    </Label>
                    <Input
                      defaultValue="Fira Code, monospace"
                      className={cn(
                        "h-9 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Letter Spacing</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className={cn(
                      "text-xs mb-1.5 block",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    Letter Spacing
                  </Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      defaultValue={[0]}
                      min={-2}
                      max={2}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      defaultValue="0"
                      type="number"
                      className={cn(
                        "h-9 w-16 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {activeTab === "other" && (
            <div className="space-y-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>HSL Adjustments</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Hue Shift</span>
                      <span className="text-[10px]">deg</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[0]}
                        min={-180}
                        max={180}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="0"
                        type="number"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Saturation Multiplier</span>
                      <span className="text-[10px]">x</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[1]}
                        min={0}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="1"
                        type="number"
                        step="0.1"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Lightness Multiplier</span>
                      <span className="text-[10px]">x</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[1]}
                        min={0}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="1"
                        type="number"
                        step="0.1"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Radius</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className={cn(
                      "text-xs mb-1.5 flex items-center justify-between",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    <span>Radius</span>
                    <span className="text-[10px]">rem</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      defaultValue={[0.5]}
                      min={0}
                      max={2}
                      step={0.05}
                      className="flex-1"
                    />
                    <Input
                      defaultValue="0.5"
                      type="number"
                      step="0.05"
                      className={cn(
                        "h-9 w-16 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Spacing</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className={cn(
                      "text-xs mb-1.5 flex items-center justify-between",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    <span>Spacing</span>
                    <span className="text-[10px]">rem</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      defaultValue={[1]}
                      min={0}
                      max={4}
                      step={0.25}
                      className="flex-1"
                    />
                    <Input
                      defaultValue="1"
                      type="number"
                      step="0.25"
                      className={cn(
                        "h-9 w-16 text-xs",
                        darkMode
                          ? "bg-gray-900 border-gray-700 text-gray-200"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className={cn(
                      "text-sm font-semibold mb-3 flex items-center justify-between group",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <span>Shadow</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform group-data-[state=open]:rotate-180", darkMode ? "text-gray-400" : "text-gray-600")} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Shadow Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 0%"
                        className={cn(
                          "h-9 text-xs font-mono flex-1",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                      <div className="w-9 h-9 rounded border bg-black" />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 block",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Shadow Opacity
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[0.1]}
                        min={0}
                        max={1}
                        step={0.05}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="0.1"
                        type="number"
                        step="0.05"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Blur Radius</span>
                      <span className="text-[10px]">px</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[10]}
                        min={0}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="10"
                        type="number"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Spread</span>
                      <span className="text-[10px]">px</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[0]}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="0"
                        type="number"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Offset X</span>
                      <span className="text-[10px]">px</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[0]}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="0"
                        type="number"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className={cn(
                        "text-xs mb-1.5 flex items-center justify-between",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      <span>Offset Y</span>
                      <span className="text-[10px]">px</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        defaultValue={[4]}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        defaultValue="4"
                        type="number"
                        className={cn(
                          "h-9 w-16 text-xs",
                          darkMode
                            ? "bg-gray-900 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
