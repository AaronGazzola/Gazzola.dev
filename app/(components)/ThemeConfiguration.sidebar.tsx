"use client";

import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { Slider } from "@/components/editor/ui/slider";
import { cn } from "@/lib/tailwind.utils";
import { ChevronLeft, ChevronRight, ChevronDown, Shuffle } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/editor/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/editor/ui/collapsible";

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

import { useThemeStore } from "./ThemeConfiguration.stores";

export const ThemeConfigurationSidebar = () => {
  const { theme, setThemePreset } = useThemeStore();

  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePrevTheme = () => {
    const newIndex = theme.selectedTheme === 0 ? THEMES.length - 1 : theme.selectedTheme - 1;
    setThemePreset(newIndex);
  };

  const handleNextTheme = () => {
    const newIndex = theme.selectedTheme === THEMES.length - 1 ? 0 : theme.selectedTheme + 1;
    setThemePreset(newIndex);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    setThemePreset(randomIndex);
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
    <div className="w-80 border-r flex flex-col bg-[hsl(var(--background))] border-[hsl(var(--border))]">
      <div className="p-6 border-b border-[hsl(var(--border))]">
        <Label className="text-xs font-medium mb-2 block text-[hsl(var(--muted-foreground))]">
          Theme
        </Label>
        <div className="flex items-center gap-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 h-9 px-3 rounded-md border flex items-center justify-between text-sm font-medium bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]">
                <span>{THEMES[theme.selectedTheme].name}</span>
                <div className="flex items-center gap-1 ml-2">
                  {THEMES[theme.selectedTheme].colors.map((color, idx) => (
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
              className="w-80 p-0"
              align="start"
            >
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomTheme}
                    className="h-8 w-8 p-0"
                  >
                    <Shuffle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-64">
                <div className="p-2 space-y-1">
                  {filteredThemes.map((themeItem) => {
                    const themeIndex = THEMES.findIndex(t => t.name === themeItem.name);
                    const isSelected = theme.selectedTheme === themeIndex;
                    return (
                      <button
                        key={themeItem.name}
                        onClick={() => {
                          setThemePreset(themeIndex);
                          setIsPopoverOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <span>{themeItem.name}</span>
                        <div className="flex items-center gap-1">
                          {themeItem.colors.map((color, colorIdx) => (
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
            className="h-9 w-9 p-0 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextTheme}
            className="h-9 w-9 p-0 shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b">
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
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
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
                  <h3 className="text-sm font-semibold mb-3 flex items-center justify-between group text-foreground">
                    <span>Primary Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 text-muted-foreground" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Primary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 98%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3 className="text-sm font-semibold mb-3 flex items-center justify-between group text-foreground">
                    <span>Secondary Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 text-muted-foreground" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Secondary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Secondary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group text-foreground"
                  >
                    <span>Accent Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 text-muted-foreground" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Accent
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Base Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Card Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Card Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Card Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Popover Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Popover Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 100%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Popover Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Muted Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Muted
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 96.1%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Muted Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="215.4 16.3% 46.9%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Destructive Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Destructive
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 84.2% 60.2%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-red-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Destructive Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="210 40% 98%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Border & Input Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Border
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="214.3 31.8% 91.4%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Input
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="214.3 31.8% 91.4%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="222.2 47.4% 11.2%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Chart Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num}>
                      <Label
                        className="text-xs mb-1.5 block"
                      >
                        Chart {num}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          defaultValue={`${num * 40} 70% 50%`}
                          className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Sidebar Colors</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 98%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.3% 26.1%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-700" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Primary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.9% 10%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 98%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Accent
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 4.8% 95.9%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="240 5.9% 10%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-900" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Border
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="220 13% 91%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="217.2 91.2% 59.8%"
                        className="h-9 text-xs font-mono flex-1"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Font Family</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sans-Serif Font
                    </Label>
                    <Input
                      defaultValue="Inter, system-ui, sans-serif"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Serif Font
                    </Label>
                    <Input
                      defaultValue="Georgia, serif"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Monospace Font
                    </Label>
                    <Input
                      defaultValue="Fira Code, monospace"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Letter Spacing</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className="text-xs mb-1.5 block"
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
                      className="h-9 w-16 text-xs"
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
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>HSL Adjustments</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Radius</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className="text-xs mb-1.5 flex items-center justify-between"
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
                      className="h-9 w-16 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Spacing</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    className="text-xs mb-1.5 flex items-center justify-between"
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
                      className="h-9 w-16 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <h3
                    className="text-sm font-semibold mb-3 flex items-center justify-between group"
                  >
                    <span>Shadow</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Shadow Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="0 0% 0%"
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div className="w-9 h-9 rounded border bg-black" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      className="text-xs mb-1.5 flex items-center justify-between"
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
                        className="h-9 w-16 text-xs"
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
