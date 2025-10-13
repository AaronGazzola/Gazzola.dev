"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/editor/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/editor/ui/collapsible";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { Slider } from "@/components/editor/ui/slider";
import { fontOptions } from "@/styles/fonts";
import { ChevronDown, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadThemesAction } from "./ThemeConfiguration.actions";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { ParsedTheme } from "./ThemeConfiguration.types";
import { verifyThemeApplication } from "./ThemeConfiguration.verify";

type TabType = "colors" | "typography" | "other";

interface ThemeConfigurationSidebarProps {
  darkMode: boolean;
}

export const ThemeConfigurationSidebar = ({
  darkMode,
}: ThemeConfigurationSidebarProps) => {
  const mode = darkMode ? "dark" : "light";
  const setDarkMode = useEditorStore((state) => state.setDarkMode);

  const selectedTheme = useThemeStore((state) => state.theme.selectedTheme);
  const lightColors = useThemeStore((state) => state.theme.colors.light);
  const darkColors = useThemeStore((state) => state.theme.colors.dark);
  const lightTypography = useThemeStore(
    (state) => state.theme.typography.light
  );
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
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadThemesAction().then((loadedThemes) => {
        setThemes(loadedThemes);
        if (loadedThemes[selectedTheme]) {
          applyThemePreset(selectedTheme, loadedThemes[selectedTheme]);
        }
      });
    }
  }, [selectedTheme, applyThemePreset]);

  useEffect(() => {
    console.log(
      JSON.stringify({
        action: "currentColors_changed",
        mode: mode,
        primary: currentColors?.primary,
        allColors: currentColors,
      })
    );
  }, [currentColors, mode]);

  const fullTheme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (themes.length > 0 && themes[selectedTheme]) {
      const result = verifyThemeApplication(
        fullTheme,
        themes[selectedTheme],
        selectedTheme
      );
      console.log(
        JSON.stringify({
          action: "theme_verification",
          isComplete: result.isComplete,
          missingCount: result.missingFields.length,
          mismatchCount: result.mismatchedFields.length,
          missingFields: result.missingFields,
          mismatchedFields: result.mismatchedFields,
        })
      );
    }
  }, [fullTheme, themes, selectedTheme]);

  const handlePrevTheme = () => {
    const newIndex =
      selectedTheme === 0 ? themes.length - 1 : selectedTheme - 1;
    applyThemePreset(newIndex, themes[newIndex]);
  };

  const handleNextTheme = () => {
    const newIndex =
      selectedTheme === themes.length - 1 ? 0 : selectedTheme + 1;
    applyThemePreset(newIndex, themes[newIndex]);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    applyThemePreset(randomIndex, themes[randomIndex]);
    setIsPopoverOpen(false);
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
    <div
      className="flex flex-col theme-bg-background theme-border-border theme-radius theme-shadow sticky top-0"
      style={{
        width: "440px",
        borderRightWidth: "1px",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      <div
        className="theme-border-border theme-p-4"
        style={{ borderBottomWidth: "1px" }}
      >
        <div className="flex items-center theme-gap-3">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 min-w-0 h-9 flex items-center justify-between text-sm font-medium theme-text-foreground bg-transparent">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                  {themes[selectedTheme]?.name || "Loading..."}
                </span>
                <div className="flex items-center theme-gap-2 flex-shrink-0 theme-ml-4">
                  {themes[selectedTheme]?.previewColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="theme-radius theme-border-border"
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "calc(var(--theme-radius) * 0.5)",
                        borderWidth: "1px",
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div
                className="theme-border-border theme-p-2"
                style={{ borderBottomWidth: "1px" }}
              >
                <div className="flex items-center theme-gap-3 theme-mb-3">
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
                <div className="flex flex-col theme-gap-2 theme-p-2">
                  {filteredThemes.map((themeItem) => {
                    const themeIndex = themes.findIndex(
                      (t) => t.name === themeItem.name
                    );
                    const isSelected = selectedTheme === themeIndex;
                    return (
                      <button
                        key={themeItem.name}
                        onClick={() => {
                          console.log(
                            JSON.stringify({
                              action: "clicking_theme",
                              themeName: themeItem.name,
                              themeIndex: themeIndex,
                              lightPrimary: themeItem.light.colors.primary,
                              darkPrimary: themeItem.dark.colors.primary,
                            })
                          );
                          applyThemePreset(themeIndex, themeItem);
                          setIsPopoverOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between text-sm theme-radius theme-p-6 ${isSelected ? "theme-bg-accent theme-text-accent-foreground" : "bg-transparent theme-text-foreground"}`}
                      >
                        <span>{themeItem.name}</span>
                        <div className="flex items-center theme-gap-2">
                          {themeItem.previewColors.map((color, colorIdx) => (
                            <div
                              key={colorIdx}
                              className="theme-radius theme-border-border"
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "calc(var(--theme-radius) * 0.5)",
                                borderWidth: "1px",
                                backgroundColor: color,
                              }}
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

      <div className="theme-border-border" style={{ borderBottomWidth: "1px" }}>
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-xs font-medium py-6 ${isActive ? "theme-border-primary theme-text-foreground" : "theme-text-muted-foreground"}`}
                style={{
                  borderBottom: isActive
                    ? "2px solid"
                    : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="theme-p-4">
          {activeTab === "colors" && (
            <div className="flex flex-col theme-gap-4">
              <div
                className="flex items-center justify-center theme-gap-3 theme-border-border theme-pb-4"
                style={{ borderBottomWidth: "1px" }}
              >
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              </div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer">
                    <span>Primary Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Primary
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.primary}
                          onChange={(e) => {
                            console.log(
                              JSON.stringify({
                                action: "input_change",
                                newValue: e.target.value,
                              })
                            );
                            updateColor(
                              darkMode ? "dark" : "light",
                              "primary",
                              e.target.value
                            );
                          }}
                          onFocus={() =>
                            console.log(
                              JSON.stringify({
                                action: "input_focus",
                                currentValue: currentColors.primary,
                              })
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.primary,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Primary Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.primaryForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "primaryForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.primaryForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer">
                    <span>Secondary Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Secondary
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.secondary}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "secondary",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.secondary,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Secondary Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.secondaryForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "secondaryForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.secondaryForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer">
                    <span>Accent Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Accent
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.accent}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "accent",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.accent,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Accent Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.accentForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "accentForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.accentForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Base Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Background
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.background}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "background",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.background,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.foreground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "foreground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.foreground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Card Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Card Background
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.card}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "card",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.card,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Card Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.cardForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "cardForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.cardForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Popover Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Popover Background
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.popover}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "popover",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.popover,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Popover Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.popoverForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "popoverForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.popoverForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Muted Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Muted
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.muted}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "muted",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.muted,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Muted Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.mutedForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "mutedForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.mutedForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Destructive Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Destructive
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.destructive}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "destructive",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.destructive,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Destructive Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.destructiveForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "destructiveForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor:
                              currentColors.destructiveForeground,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Border & Input Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Border
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.border}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "border",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.border,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Input
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.input}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "input",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.input,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Ring
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.ring}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "ring",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.ring,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Chart Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    {([1, 2, 3, 4, 5] as const).map((num) => {
                      const chartKey =
                        `chart${num}` as keyof typeof currentColors;
                      return (
                        <div key={num}>
                          <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                            Chart {num}
                          </Label>
                          <div className="flex theme-gap-3">
                            <Input
                              value={currentColors[chartKey]}
                              onChange={(e) =>
                                updateColor(
                                  darkMode ? "dark" : "light",
                                  chartKey,
                                  e.target.value
                                )
                              }
                              className="h-9 text-xs font-mono flex-1"
                            />
                            <div
                              className="theme-radius theme-border-border"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderWidth: "1px",
                                backgroundColor: currentColors[chartKey],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Sidebar Colors</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Background
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarBackground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarBackground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarBackground,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarForeground,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Primary
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarPrimary}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarPrimary",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarPrimary,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Primary Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarPrimaryForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarPrimaryForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor:
                              currentColors.sidebarPrimaryForeground,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Accent
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarAccent}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarAccent",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarAccent,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Accent Foreground
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarAccentForeground}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarAccentForeground",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor:
                              currentColors.sidebarAccentForeground,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Border
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarBorder}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarBorder",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarBorder,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sidebar Ring
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentColors.sidebarRing}
                          onChange={(e) =>
                            updateColor(
                              darkMode ? "dark" : "light",
                              "sidebarRing",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentColors.sidebarRing,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="flex flex-col theme-gap-4">
              <div
                className="flex items-center justify-center theme-gap-3 theme-border-border theme-pb-4"
                style={{ borderBottomWidth: "1px" }}
              >
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              </div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Font Family</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Sans-Serif Font
                      </Label>
                      <Select
                        value={currentTypography.fontSans}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontSans: value })
                        }
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
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Serif Font
                      </Label>
                      <Select
                        value={currentTypography.fontSerif}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontSerif: value })
                        }
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
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Monospace Font
                      </Label>
                      <Select
                        value={currentTypography.fontMono}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontMono: value })
                        }
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
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Letter Spacing</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-xs block theme-text-muted-foreground theme-mb-0-5">
                      Letter Spacing
                    </Label>
                    <div className="flex items-center theme-gap-4">
                      <Slider
                        value={[currentTypography.letterSpacing]}
                        onValueChange={([value]) =>
                          updateTypography(mode, { letterSpacing: value })
                        }
                        min={-2}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        value={currentTypography.letterSpacing}
                        onChange={(e) =>
                          updateTypography(mode, {
                            letterSpacing: parseFloat(e.target.value) || 0,
                          })
                        }
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
            <div className="flex flex-col theme-gap-4">
              <div
                className="flex items-center justify-center theme-gap-3 theme-border-border theme-pb-4"
                style={{ borderBottomWidth: "1px" }}
              >
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              </div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>HSL Adjustments</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Hue Shift</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          deg
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.hueShift]}
                          onValueChange={([value]) =>
                            updateOther(mode, { hueShift: value })
                          }
                          min={-180}
                          max={180}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.hueShift}
                          onChange={(e) =>
                            updateOther(mode, {
                              hueShift: parseInt(e.target.value) || 0,
                            })
                          }
                          type="number"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Saturation Multiplier</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          x
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.saturationMultiplier]}
                          onValueChange={([value]) =>
                            updateOther(mode, { saturationMultiplier: value })
                          }
                          min={0}
                          max={2}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.saturationMultiplier}
                          onChange={(e) =>
                            updateOther(mode, {
                              saturationMultiplier:
                                parseFloat(e.target.value) || 1,
                            })
                          }
                          type="number"
                          step="0.1"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Lightness Multiplier</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          x
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.lightnessMultiplier]}
                          onValueChange={([value]) =>
                            updateOther(mode, { lightnessMultiplier: value })
                          }
                          min={0}
                          max={2}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.lightnessMultiplier}
                          onChange={(e) =>
                            updateOther(mode, {
                              lightnessMultiplier:
                                parseFloat(e.target.value) || 1,
                            })
                          }
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
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Radius</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-xs flex items-center justify-between theme-text-muted-foreground mb-2">
                      <span>Radius</span>
                      <span style={{ fontSize: "10px" }}>rem</span>
                    </Label>
                    <div className="flex items-center theme-gap-4">
                      <Slider
                        value={[currentOther.radius]}
                        onValueChange={([value]) =>
                          updateOther(mode, { radius: value })
                        }
                        min={0}
                        max={2}
                        step={0.05}
                        className="flex-1"
                      />
                      <Input
                        value={currentOther.radius}
                        onChange={(e) =>
                          updateOther(mode, {
                            radius: parseFloat(e.target.value) || 0.5,
                          })
                        }
                        type="number"
                        step="0.05"
                        className="h-9 w-16 text-xs"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Spacing</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-xs flex items-center justify-between theme-text-muted-foreground mb-2">
                      <span>Spacing</span>
                      <span style={{ fontSize: "10px" }}>rem</span>
                    </Label>
                    <div className="flex items-center theme-gap-4">
                      <Slider
                        value={[currentOther.spacing]}
                        onValueChange={([value]) =>
                          updateOther(mode, { spacing: value })
                        }
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
                <CollapsibleTrigger asChild>
                  <button className="w-full text-sm font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer">
                    <span>Shadow</span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Shadow Color
                      </Label>
                      <div className="flex theme-gap-3">
                        <Input
                          value={currentOther.shadow.color}
                          onChange={(e) =>
                            updateShadow(mode, "color", e.target.value)
                          }
                          className="h-9 text-xs font-mono flex-1"
                        />
                        <div
                          className="theme-radius theme-border-border"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderWidth: "1px",
                            backgroundColor: currentOther.shadow.color,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs block theme-text-muted-foreground theme-mb-2">
                        Shadow Opacity
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.shadow.opacity]}
                          onValueChange={([value]) =>
                            updateShadow(mode, "opacity", value)
                          }
                          min={0}
                          max={1}
                          step={0.05}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.shadow.opacity}
                          onChange={(e) =>
                            updateShadow(
                              mode,
                              "opacity",
                              parseFloat(e.target.value) || 0.1
                            )
                          }
                          type="number"
                          step="0.05"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Blur Radius</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          px
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.shadow.blurRadius]}
                          onValueChange={([value]) =>
                            updateShadow(mode, "blurRadius", value)
                          }
                          min={0}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.shadow.blurRadius}
                          onChange={(e) =>
                            updateShadow(
                              mode,
                              "blurRadius",
                              parseInt(e.target.value) || 10
                            )
                          }
                          type="number"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Spread</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          px
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.shadow.spread]}
                          onValueChange={([value]) =>
                            updateShadow(mode, "spread", value)
                          }
                          min={-20}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.shadow.spread}
                          onChange={(e) =>
                            updateShadow(
                              mode,
                              "spread",
                              parseInt(e.target.value) || 0
                            )
                          }
                          type="number"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Offset X</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          px
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.shadow.offsetX]}
                          onValueChange={([value]) =>
                            updateShadow(mode, "offsetX", value)
                          }
                          min={-20}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.shadow.offsetX}
                          onChange={(e) =>
                            updateShadow(
                              mode,
                              "offsetX",
                              parseInt(e.target.value) || 0
                            )
                          }
                          type="number"
                          className="h-9 w-16 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs flex items-center justify-between theme-text-muted-foreground theme-mb-6">
                        <span>Offset Y</span>
                        <span className="text-[10px] theme-text-muted-foreground">
                          px
                        </span>
                      </Label>
                      <div className="flex items-center theme-gap-3">
                        <Slider
                          value={[currentOther.shadow.offsetY]}
                          onValueChange={([value]) =>
                            updateShadow(mode, "offsetY", value)
                          }
                          min={-20}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          value={currentOther.shadow.offsetY}
                          onChange={(e) =>
                            updateShadow(
                              mode,
                              "offsetY",
                              parseInt(e.target.value) || 4
                            )
                          }
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
