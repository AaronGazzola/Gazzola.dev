"use client";

import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { Slider } from "@/components/editor/ui/slider";
import { Switch } from "@/components/editor/ui/switch";
import { cn } from "@/lib/tailwind.utils";
import { ChevronLeft, ChevronRight, ChevronDown, Shuffle, CheckCircle2, AlertCircle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/editor/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/editor/ui/collapsible";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { loadThemesAction } from "./ThemeConfiguration.actions";
import { ParsedTheme } from "./ThemeConfiguration.types";
import { verifyThemeApplication, VerificationResult } from "./ThemeConfiguration.verify";

type TabType = "colors" | "typography" | "other";

export const ThemeConfigurationSidebar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const mode = darkMode ? "dark" : "light";

  const selectedTheme = useThemeStore((state) => state.theme.selectedTheme);
  const lightColors = useThemeStore((state) => state.theme.colors.light);
  const darkColors = useThemeStore((state) => state.theme.colors.dark);
  const lightTypography = useThemeStore((state) => state.theme.typography.light);
  const darkTypography = useThemeStore((state) => state.theme.typography.dark);
  const lightOther = useThemeStore((state) => state.theme.other.light);
  const darkOther = useThemeStore((state) => state.theme.other.dark);

  const currentColors = mode === "light" ? lightColors : darkColors;
  const currentTypography = mode === "light" ? lightTypography : darkTypography;
  const currentOther = mode === "light" ? lightOther : darkOther;

  const applyThemePreset = useThemeStore((state) => state.applyThemePreset);
  const updateColor = useThemeStore((state) => state.updateColor);
  const updateTypography = useThemeStore((state) => state.updateTypography);
  const updateOther = useThemeStore((state) => state.updateOther);
  const updateShadow = useThemeStore((state) => state.updateShadow);

  const [themes, setThemes] = useState<ParsedTheme[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);

  useEffect(() => {
    loadThemesAction().then(setThemes);
  }, []);

  useEffect(() => {
    console.log(JSON.stringify({
      action: "currentColors_changed",
      mode: mode,
      primary: currentColors?.primary,
      allColors: currentColors
    }));
  }, [currentColors, mode]);

  const fullTheme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (themes.length > 0 && themes[selectedTheme]) {
      const result = verifyThemeApplication(fullTheme, themes[selectedTheme], selectedTheme);
      setVerification(result);
      console.log(JSON.stringify({
        action: "theme_verification",
        isComplete: result.isComplete,
        missingCount: result.missingFields.length,
        mismatchCount: result.mismatchedFields.length,
        missingFields: result.missingFields,
        mismatchedFields: result.mismatchedFields
      }));
    }
  }, [fullTheme, themes, selectedTheme]);

  const handlePrevTheme = () => {
    const newIndex = selectedTheme === 0 ? themes.length - 1 : selectedTheme - 1;
    applyThemePreset(newIndex, themes[newIndex]);
  };

  const handleNextTheme = () => {
    const newIndex = selectedTheme === themes.length - 1 ? 0 : selectedTheme + 1;
    applyThemePreset(newIndex, themes[newIndex]);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    applyThemePreset(randomIndex, themes[randomIndex]);
    setIsPopoverOpen(false);
  };

  const hslToHex = (hsl: string): string => {
    const parts = hsl.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return "#000000";

    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;

    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hueToRgb(p, q, h) * 255);
    const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "colors" as TabType, label: "Colors" },
    { id: "typography" as TabType, label: "Typography" },
    { id: "other" as TabType, label: "Other" },
  ];

  return (
    <div className="w-80 border-r flex flex-col bg-[hsl(var(--background))] border-[hsl(var(--border))] max-h-[calc(100vh-200px)] sticky top-0">
      <div className="p-3 border-b border-[hsl(var(--border))] space-y-2">
        {verification && !verification.isComplete && (
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-start gap-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/15 transition-colors">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1 flex-1 text-left">
                  <div className="font-medium text-yellow-900 dark:text-yellow-100">Theme Verification Failed</div>
                  {verification.mismatchedFields.length > 0 && (
                    <div className="text-yellow-800 dark:text-yellow-200">
                      {verification.mismatchedFields.length} field{verification.mismatchedFields.length !== 1 ? "s" : ""} mismatch
                    </div>
                  )}
                  {verification.missingFields.length > 0 && (
                    <div className="text-yellow-800 dark:text-yellow-200">
                      {verification.missingFields.length} field{verification.missingFields.length !== 1 ? "s" : ""} missing
                    </div>
                  )}
                </div>
                <ChevronDown className="h-3 w-3 text-yellow-600 mt-0.5 transition-transform group-data-[state=open]:rotate-180" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-2 rounded-md bg-yellow-500/5 border border-yellow-500/20 text-xs space-y-2 max-h-60 overflow-y-auto">
                {verification.mismatchedFields.length > 0 && (
                  <div>
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Mismatched Fields:</div>
                    {verification.mismatchedFields.map((mismatch, idx) => (
                      <div key={idx} className="mb-2 pb-2 border-b border-yellow-500/20 last:border-0">
                        <div className="font-medium text-yellow-800 dark:text-yellow-200">
                          {mismatch.field} ({mismatch.mode})
                        </div>
                        <div className="text-yellow-700 dark:text-yellow-300 font-mono text-[10px] mt-1">
                          Store: {JSON.stringify(mismatch.storeValue)}
                        </div>
                        <div className="text-yellow-700 dark:text-yellow-300 font-mono text-[10px]">
                          Theme: {JSON.stringify(mismatch.themeValue)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {verification.missingFields.length > 0 && (
                  <div>
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Missing Fields:</div>
                    <div className="text-yellow-800 dark:text-yellow-200">
                      {verification.missingFields.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        <div className="flex items-center gap-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 h-9 px-3 rounded-md border flex items-center justify-between text-sm font-medium border-[hsl(var(--border))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]">
                <span>{themes[selectedTheme]?.name || "Loading..."}</span>
                <div className="flex items-center gap-1 ml-2">
                  {themes[selectedTheme]?.previewColors.map((color, idx) => (
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
                    const themeIndex = themes.findIndex(t => t.name === themeItem.name);
                    const isSelected = selectedTheme === themeIndex;
                    return (
                      <button
                        key={themeItem.name}
                        onClick={() => {
                          console.log(JSON.stringify({
                            action: "clicking_theme",
                            themeName: themeItem.name,
                            themeIndex: themeIndex,
                            lightPrimary: themeItem.light.colors.primary,
                            darkPrimary: themeItem.dark.colors.primary
                          }));
                          applyThemePreset(themeIndex, themeItem);
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
                          {themeItem.previewColors.map((color, colorIdx) => (
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
              <div className="flex items-center justify-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
                <Sun className={cn("h-4 w-4 transition-colors", !darkMode ? "text-foreground" : "text-muted-foreground")} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className={cn("h-4 w-4 transition-colors", darkMode ? "text-foreground" : "text-muted-foreground")} />
              </div>
              <Collapsible>
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
                        value={currentColors.primary}
                        onChange={(e) => {
                          console.log(JSON.stringify({action:"input_change",newValue:e.target.value}));
                          updateColor(darkMode ? "dark" : "light", "primary", e.target.value);
                        }}
                        onFocus={() => console.log(JSON.stringify({action:"input_focus",currentValue:currentColors.primary}))}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.primary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.primaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "primaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.primaryForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.secondary}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "secondary", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.secondary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Secondary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.secondaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "secondaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.secondaryForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.accent}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "accent", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.accent) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.accentForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "accentForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.accentForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.background}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "background", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.background) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.foreground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "foreground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.foreground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.card}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "card", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.card) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Card Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.cardForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "cardForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.cardForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.popover}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "popover", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.popover) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Popover Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.popoverForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "popoverForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.popoverForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.muted}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "muted", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.muted) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Muted Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.mutedForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "mutedForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.mutedForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.destructive}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "destructive", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.destructive) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Destructive Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.destructiveForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "destructiveForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.destructiveForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.border}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "border", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.border) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Input
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.input}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "input", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.input) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.ring}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "ring", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.ring) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                  {([1, 2, 3, 4, 5] as const).map((num) => {
                    const chartKey = `chart${num}` as keyof typeof currentColors;
                    return (
                      <div key={num}>
                        <Label className="text-xs mb-1.5 block text-muted-foreground">
                          Chart {num}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={currentColors[chartKey]}
                            onChange={(e) => updateColor(darkMode ? "dark" : "light", chartKey, e.target.value)}
                            className="h-9 text-xs font-mono flex-1"
                          />
                          <div
                            className="w-9 h-9 rounded border"
                            style={{ backgroundColor: hslToHex(currentColors[chartKey]) }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentColors.sidebarBackground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarBackground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarBackground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Primary
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarPrimary}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarPrimary", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarPrimary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Primary Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarPrimaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarPrimaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarPrimaryForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Accent
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarAccent}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarAccent", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarAccent) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Accent Foreground
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarAccentForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarAccentForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarAccentForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Border
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarBorder}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarBorder", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarBorder) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Sidebar Ring
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentColors.sidebarRing}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarRing", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentColors.sidebarRing) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
                <Sun className={cn("h-4 w-4 transition-colors", !darkMode ? "text-foreground" : "text-muted-foreground")} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className={cn("h-4 w-4 transition-colors", darkMode ? "text-foreground" : "text-muted-foreground")} />
              </div>
              <Collapsible>
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
                      value={currentTypography.fontSans}
                      onChange={(e) => updateTypography(mode, { fontSans: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Serif Font
                    </Label>
                    <Input
                      value={currentTypography.fontSerif}
                      onChange={(e) => updateTypography(mode, { fontSerif: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Monospace Font
                    </Label>
                    <Input
                      value={currentTypography.fontMono}
                      onChange={(e) => updateTypography(mode, { fontMono: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                      value={[currentTypography.letterSpacing]}
                      onValueChange={([value]) => updateTypography(mode, { letterSpacing: value })}
                      min={-2}
                      max={2}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      value={currentTypography.letterSpacing}
                      onChange={(e) => updateTypography(mode, { letterSpacing: parseFloat(e.target.value) || 0 })}
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
              <div className="flex items-center justify-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
                <Sun className={cn("h-4 w-4 transition-colors", !darkMode ? "text-foreground" : "text-muted-foreground")} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className={cn("h-4 w-4 transition-colors", darkMode ? "text-foreground" : "text-muted-foreground")} />
              </div>
              <Collapsible>
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
                        value={[currentOther.hueShift]}
                        onValueChange={([value]) => updateOther(mode, { hueShift: value })}
                        min={-180}
                        max={180}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.hueShift}
                        onChange={(e) => updateOther(mode, { hueShift: parseInt(e.target.value) || 0 })}
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
                        value={[currentOther.saturationMultiplier]}
                        onValueChange={([value]) => updateOther(mode, { saturationMultiplier: value })}
                        min={0}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.saturationMultiplier}
                        onChange={(e) => updateOther(mode, { saturationMultiplier: parseFloat(e.target.value) || 1 })}
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
                        value={[currentOther.lightnessMultiplier]}
                        onValueChange={([value]) => updateOther(mode, { lightnessMultiplier: value })}
                        min={0}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.lightnessMultiplier}
                        onChange={(e) => updateOther(mode, { lightnessMultiplier: parseFloat(e.target.value) || 1 })}
                        type="number"
                        step="0.1"
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                      value={[currentOther.radius]}
                      onValueChange={([value]) => updateOther(mode, { radius: value })}
                      min={0}
                      max={2}
                      step={0.05}
                      className="flex-1"
                    />
                    <Input
                      value={currentOther.radius}
                      onChange={(e) => updateOther(mode, { radius: parseFloat(e.target.value) || 0.5 })}
                      type="number"
                      step="0.05"
                      className="h-9 w-16 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                      value={[currentOther.spacing]}
                      onValueChange={([value]) => updateOther(mode, { spacing: value })}
                      min={0}
                      max={4}
                      step={0.25}
                      className="flex-1"
                    />
                    <Input
                      value={currentOther.spacing}
                      onChange={(e) => updateOther(mode, { spacing: parseFloat(e.target.value) || 1 })}
                      type="number"
                      step="0.25"
                      className="h-9 w-16 text-xs"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
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
                        value={currentOther.shadow.color}
                        onChange={(e) => updateShadow(mode, "color", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        className="w-9 h-9 rounded border"
                        style={{ backgroundColor: hslToHex(currentOther.shadow.color) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block text-muted-foreground">
                      Shadow Opacity
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[currentOther.shadow.opacity]}
                        onValueChange={([value]) => updateShadow(mode, "opacity", value)}
                        min={0}
                        max={1}
                        step={0.05}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.shadow.opacity}
                        onChange={(e) => updateShadow(mode, "opacity", parseFloat(e.target.value) || 0.1)}
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
                        value={[currentOther.shadow.blurRadius]}
                        onValueChange={([value]) => updateShadow(mode, "blurRadius", value)}
                        min={0}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.shadow.blurRadius}
                        onChange={(e) => updateShadow(mode, "blurRadius", parseInt(e.target.value) || 10)}
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
                        value={[currentOther.shadow.spread]}
                        onValueChange={([value]) => updateShadow(mode, "spread", value)}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.shadow.spread}
                        onChange={(e) => updateShadow(mode, "spread", parseInt(e.target.value) || 0)}
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
                        value={[currentOther.shadow.offsetX]}
                        onValueChange={([value]) => updateShadow(mode, "offsetX", value)}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.shadow.offsetX}
                        onChange={(e) => updateShadow(mode, "offsetX", parseInt(e.target.value) || 0)}
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
                        value={[currentOther.shadow.offsetY]}
                        onValueChange={([value]) => updateShadow(mode, "offsetY", value)}
                        min={-20}
                        max={20}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.shadow.offsetY}
                        onChange={(e) => updateShadow(mode, "offsetY", parseInt(e.target.value) || 4)}
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
