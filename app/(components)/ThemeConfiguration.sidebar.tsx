"use client";

import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { Slider } from "@/components/editor/ui/slider";
import { Switch } from "@/components/editor/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/editor/ui/select";
import { ChevronLeft, ChevronRight, ChevronDown, Shuffle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/editor/ui/popover";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/editor/ui/collapsible";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import { loadThemesAction } from "./ThemeConfiguration.actions";
import { ParsedTheme } from "./ThemeConfiguration.types";
import { verifyThemeApplication } from "./ThemeConfiguration.verify";
import { fontOptions } from "@/styles/fonts";

type TabType = "colors" | "typography" | "other";

interface ThemeConfigurationSidebarProps {
  darkMode: boolean;
}

export const ThemeConfigurationSidebar = ({ darkMode }: ThemeConfigurationSidebarProps) => {
  const mode = darkMode ? "dark" : "light";
  const setDarkMode = useEditorStore((state) => state.setDarkMode);

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
    <div style={{ width: "440px", borderRight: "1px solid var(--theme-border)", display: "flex", flexDirection: "column", backgroundColor: "var(--theme-card)", maxHeight: "calc(100vh - 200px)", position: "sticky", top: 0 }}>
      <div style={{ padding: "calc(var(--theme-spacing) * 3)", borderBottom: "1px solid var(--theme-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)" }}>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button style={{ flex: "1", minWidth: "0", height: "36px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: "500", color: "var(--theme-foreground)", backgroundColor: "transparent" }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: "0" }}>{themes[selectedTheme]?.name || "Loading..."}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)", marginLeft: "calc(var(--theme-spacing) * 4)", flexShrink: "0" }}>
                  {themes[selectedTheme]?.previewColors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{ width: "12px", height: "12px", borderRadius: "calc(var(--theme-radius) * 0.5)", border: "1px solid var(--theme-border)", backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              align="start"
            >
              <div style={{ padding: "calc(var(--theme-spacing) * 1.5)", borderBottom: "1px solid var(--theme-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)", marginBottom: "calc(var(--theme-spacing) * 4)" }}>
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
                <div style={{ padding: "calc(var(--theme-spacing) * 4)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
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
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "calc(var(--theme-spacing) * 1.5) calc(var(--theme-spacing) * 1.5)",
                          borderRadius: "var(--theme-radius)",
                          fontSize: "0.875rem",
                          backgroundColor: isSelected ? "var(--theme-accent)" : "transparent",
                          color: isSelected ? "var(--theme-accent-foreground)" : "var(--theme-foreground)"
                        }}
                      >
                        <span>{themeItem.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)" }}>
                          {themeItem.previewColors.map((color, colorIdx) => (
                            <div
                              key={colorIdx}
                              style={{ width: "12px", height: "12px", borderRadius: "calc(var(--theme-radius) * 0.5)", border: "1px solid var(--theme-border)", backgroundColor: color }}
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

      <div style={{ borderBottom: "1px solid var(--theme-border)" }}>
        <div style={{ display: "flex" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: "1",
                  padding: "calc(var(--theme-spacing) * 1.5) 0",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  borderBottom: isActive ? "2px solid var(--theme-primary)" : "2px solid transparent",
                  color: isActive ? "var(--theme-foreground)" : "var(--theme-muted-foreground)"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div style={{ padding: "calc(var(--theme-spacing) * 3)" }}>
          {activeTab === "colors" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(var(--theme-spacing) * 1.5)", paddingBottom: "calc(var(--theme-spacing) * 4)", borderBottom: "1px solid var(--theme-border)" }}>
                <Sun style={{ width: "16px", height: "16px", color: !darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon style={{ width: "16px", height: "16px", color: darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
              </div>
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}>
                    <span>Primary Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 4)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Primary
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
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
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.primary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Primary Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.primaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "primaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.primaryForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}>
                    <span>Secondary Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Secondary
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.secondary}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "secondary", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.secondary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Secondary Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.secondaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "secondaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.secondaryForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}>
                    <span>Accent Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Accent
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.accent}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "accent", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.accent) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Accent Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.accentForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "accentForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.accentForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Base Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Background
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.background}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "background", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.background) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.foreground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "foreground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.foreground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Card Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Card Background
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.card}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "card", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.card) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Card Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.cardForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "cardForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.cardForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Popover Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Popover Background
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.popover}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "popover", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.popover) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Popover Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.popoverForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "popoverForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.popoverForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Muted Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Muted
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.muted}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "muted", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.muted) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Muted Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.mutedForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "mutedForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.mutedForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Destructive Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Destructive
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.destructive}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "destructive", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.destructive) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Destructive Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.destructiveForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "destructiveForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.destructiveForeground) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Border & Input Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Border
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.border}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "border", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.border) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Input
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.input}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "input", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.input) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Ring
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.ring}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "ring", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.ring) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Chart Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  {([1, 2, 3, 4, 5] as const).map((num) => {
                    const chartKey = `chart${num}` as keyof typeof currentColors;
                    return (
                      <div key={num}>
                        <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                          Chart {num}
                        </Label>
                        <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                          <Input
                            value={currentColors[chartKey]}
                            onChange={(e) => updateColor(darkMode ? "dark" : "light", chartKey, e.target.value)}
                            className="h-9 text-xs font-mono flex-1"
                          />
                          <div
                            style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors[chartKey]) }}
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
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Sidebar Colors</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Background
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarBackground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarBackground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarBackground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Primary
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarPrimary}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarPrimary", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarPrimary) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Primary Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarPrimaryForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarPrimaryForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarPrimaryForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Accent
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarAccent}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarAccent", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarAccent) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Accent Foreground
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarAccentForeground}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarAccentForeground", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarAccentForeground) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Border
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarBorder}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarBorder", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarBorder) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sidebar Ring
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentColors.sidebarRing}
                        onChange={(e) => updateColor(darkMode ? "dark" : "light", "sidebarRing", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentColors.sidebarRing) }}
                      />
                    </div>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {activeTab === "typography" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(var(--theme-spacing) * 1.5)", paddingBottom: "calc(var(--theme-spacing) * 2)", borderBottom: "1px solid var(--theme-border)" }}>
                <Sun style={{ width: "16px", height: "16px", color: !darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon style={{ width: "16px", height: "16px", color: darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
              </div>
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Font Family</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Sans-Serif Font
                    </Label>
                    <Select
                      value={currentTypography.fontSans}
                      onValueChange={(value) => updateTypography(mode, { fontSans: value })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.sans.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Serif Font
                    </Label>
                    <Select
                      value={currentTypography.fontSerif}
                      onValueChange={(value) => updateTypography(mode, { fontSerif: value })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.serif.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Monospace Font
                    </Label>
                    <Select
                      value={currentTypography.fontMono}
                      onValueChange={(value) => updateTypography(mode, { fontMono: value })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.mono.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Letter Spacing</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}
                  >
                    Letter Spacing
                  </Label>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(var(--theme-spacing) * 1.5)", paddingBottom: "calc(var(--theme-spacing) * 2)", borderBottom: "1px solid var(--theme-border)" }}>
                <Sun style={{ width: "16px", height: "16px", color: !darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon style={{ width: "16px", height: "16px", color: darkMode ? "var(--theme-foreground)" : "var(--theme-muted-foreground)" }} />
              </div>
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>HSL Adjustments</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Hue Shift</span>
                      <span style={{ fontSize: "10px" }}>deg</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Saturation Multiplier</span>
                      <span style={{ fontSize: "10px" }}>x</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Lightness Multiplier</span>
                      <span style={{ fontSize: "10px" }}>x</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Radius</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span>Radius</span>
                    <span style={{ fontSize: "10px" }}>rem</span>
                  </Label>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Spacing</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div>
                  <Label
                    style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span>Spacing</span>
                    <span style={{ fontSize: "10px" }}>rem</span>
                  </Label>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                    <Slider
                      value={[currentOther.spacing]}
                      onValueChange={([value]) => updateOther(mode, { spacing: value })}
                      min={0}
                      max={0.35}
                      step={0.01}
                      className="flex-1"
                    />
                    <Input
                      value={Number(currentOther.spacing).toFixed(2)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          updateOther(mode, { spacing: val });
                        }
                      }}
                      type="text"
                      inputMode="decimal"
                      className="h-9 w-16 text-xs text-center"
                    />
                  </div>
                </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <h3
                    style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--theme-foreground)" }}
                  >
                    <span>Shadow</span>
                    <ChevronDown style={{ width: "16px", height: "16px", color: "var(--theme-muted-foreground)" }} />
                  </h3>
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Shadow Color
                    </Label>
                    <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 4)" }}>
                      <Input
                        value={currentOther.shadow.color}
                        onChange={(e) => updateShadow(mode, "color", e.target.value)}
                        className="h-9 text-xs font-mono flex-1"
                      />
                      <div
                        style={{ width: "36px", height: "36px", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", backgroundColor: hslToHex(currentOther.shadow.color) }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "block", color: "var(--theme-muted-foreground)" }}>
                      Shadow Opacity
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Blur Radius</span>
                      <span style={{ fontSize: "10px" }}>px</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Spread</span>
                      <span style={{ fontSize: "10px" }}>px</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Offset X</span>
                      <span style={{ fontSize: "10px" }}>px</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
                      style={{ fontSize: "0.75rem", marginBottom: "calc(var(--theme-spacing) * 1.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <span>Offset Y</span>
                      <span style={{ fontSize: "10px" }}>px</span>
                    </Label>
                    <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)" }}>
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
