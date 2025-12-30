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
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { fontOptions } from "@/styles/fonts";
import { ChevronDown, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";
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
  const setHasInteracted = useThemeStore((state) => state.setHasInteracted);

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
      });
    }
  }, []);

  useEffect(() => {
    conditionalLog(
      {
        action: "currentColors_changed",
        mode: mode,
        primary: currentColors?.primary,
        allColors: currentColors,
      },
      { label: LOG_LABELS.THEME }
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
      conditionalLog(
        {
          action: "theme_verification",
          isComplete: result.isComplete,
          missingCount: result.missingFields.length,
          mismatchCount: result.mismatchedFields.length,
          missingFields: result.missingFields,
          mismatchedFields: result.mismatchedFields,
        },
        { label: LOG_LABELS.THEME }
      );
    }
  }, [fullTheme, themes, selectedTheme]);

  const handlePrevTheme = () => {
    const newIndex =
      selectedTheme === 0 ? themes.length - 1 : selectedTheme - 1;
    applyThemePreset(newIndex, themes[newIndex]);
    setHasInteracted(true);
  };

  const handleNextTheme = () => {
    const newIndex =
      selectedTheme === themes.length - 1 ? 0 : selectedTheme + 1;
    applyThemePreset(newIndex, themes[newIndex]);
    setHasInteracted(true);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    applyThemePreset(randomIndex, themes[randomIndex]);
    setHasInteracted(true);
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
      className="flex flex-col theme-bg-background theme-border-primary theme-radius theme-shadow lg:sticky lg:top-0 w-full lg:w-[360px] lg:h-full"
      style={{
        borderWidth: "2px",
        borderStyle: "solid",
      }}
    >
      <div
        className="theme-border-border theme-p-2 md:theme-p-4"
        style={{ borderBottomWidth: "1px" }}
      >
        <div className="flex items-center theme-gap-2">
          <button
            onClick={handlePrevTheme}
            className="h-10 w-10 p-0 shrink-0 theme-bg-muted theme-border-primary theme-radius inline-flex items-center justify-center hover:theme-bg-accent transition-colors"
            style={{ borderWidth: "2px", borderStyle: "solid" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => {
              setIsPopoverOpen(open);
              if (open) {
                setHasInteracted(true);
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
                className="flex-1 min-w-0 h-10 flex items-center justify-between text-md font-semibold theme-text-foreground theme-bg-muted theme-border-primary theme-radius px-3 hover:theme-bg-accent transition-colors theme-font-sans theme-tracking"
                style={{ borderWidth: "2px", borderStyle: "solid" }}
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0 theme-font-sans theme-tracking">
                  {themes[selectedTheme]?.name || "Loading..."}
                </span>
                <div className="flex items-center theme-gap-2 flex-shrink-0 theme-ml-4">
                  {themes[selectedTheme]?.previewColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="theme-radius theme-border-border"
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "calc(var(--theme-radius) * 0.5)",
                        borderWidth: "1px",
                        backgroundColor: color,
                      }}
                    />
                  ))}
                  <ChevronDown className="h-4 w-4 theme-text-muted-foreground ml-1" />
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
                    className="h-8 text-md flex-1 theme-font-sans theme-tracking"
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
                          conditionalLog(
                            {
                              action: "clicking_theme",
                              themeName: themeItem.name,
                              themeIndex: themeIndex,
                              lightPrimary: themeItem.light.colors.primary,
                              darkPrimary: themeItem.dark.colors.primary,
                            },
                            { label: LOG_LABELS.THEME }
                          );
                          applyThemePreset(themeIndex, themeItem);
                          setHasInteracted(true);
                          setIsPopoverOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between text-md theme-radius theme-p-6 theme-font-sans theme-tracking ${isSelected ? "theme-bg-accent theme-text-accent-foreground" : "bg-transparent theme-text-foreground"}`}
                      >
                        <span className="theme-font-sans theme-tracking">
                          {themeItem.name}
                        </span>
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
          <button
            onClick={handleNextTheme}
            className="h-10 w-10 p-0 shrink-0 theme-bg-muted theme-border-primary theme-radius inline-flex items-center justify-center hover:theme-bg-accent transition-colors"
            style={{ borderWidth: "2px", borderStyle: "solid" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
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
                className={`flex-1 text-md font-medium py-6 theme-font-sans theme-tracking ${isActive ? "theme-border-primary theme-text-foreground" : "theme-text-muted-foreground"}`}
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

      <ScrollArea className="flex-1 theme-p-4 md:theme-p-6">
        <div className="theme-p-2 md:theme-p-4">
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
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Primary Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Primary
                      </Label>
                      <ColorPicker
                        value={currentColors.primary}
                        onChange={(value) => {
                          conditionalLog(
                            {
                              action: "input_change",
                              newValue: value,
                            },
                            { label: LOG_LABELS.THEME }
                          );
                          updateColor(
                            darkMode ? "dark" : "light",
                            "primary",
                            value
                          );
                        }}
                        onFocus={() =>
                          conditionalLog(
                            {
                              action: "input_focus",
                              currentValue: currentColors.primary,
                            },
                            { label: LOG_LABELS.THEME }
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Primary Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.primaryForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "primaryForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Secondary Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Secondary
                      </Label>
                      <ColorPicker
                        value={currentColors.secondary}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "secondary",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Secondary Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.secondaryForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "secondaryForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-3 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Accent Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Accent
                      </Label>
                      <ColorPicker
                        value={currentColors.accent}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "accent",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Accent Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.accentForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "accentForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Base Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Background
                      </Label>
                      <ColorPicker
                        value={currentColors.background}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "background",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.foreground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "foreground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Card Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Card Background
                      </Label>
                      <ColorPicker
                        value={currentColors.card}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "card",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Card Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.cardForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "cardForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Popover Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Popover Background
                      </Label>
                      <ColorPicker
                        value={currentColors.popover}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "popover",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Popover Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.popoverForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "popoverForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Muted Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Muted
                      </Label>
                      <ColorPicker
                        value={currentColors.muted}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "muted",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Muted Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.mutedForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "mutedForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Destructive Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Destructive
                      </Label>
                      <ColorPicker
                        value={currentColors.destructive}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "destructive",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Destructive Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.destructiveForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "destructiveForeground",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Border & Input Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Border
                      </Label>
                      <ColorPicker
                        value={currentColors.border}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "border",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Input
                      </Label>
                      <ColorPicker
                        value={currentColors.input}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "input",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Ring
                      </Label>
                      <ColorPicker
                        value={currentColors.ring}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "ring",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Chart Colors
                    </span>
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
                          <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                            Chart {num}
                          </Label>
                          <ColorPicker
                            value={currentColors[chartKey]}
                            onChange={(value) =>
                              updateColor(
                                darkMode ? "dark" : "light",
                                chartKey,
                                value
                              )
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Sidebar Colors
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Background
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarBackground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarBackground",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarForeground",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Primary
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarPrimary}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarPrimary",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Primary Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarPrimaryForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarPrimaryForeground",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Accent
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarAccent}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarAccent",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Accent Foreground
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarAccentForeground}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarAccentForeground",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Border
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarBorder}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarBorder",
                            value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sidebar Ring
                      </Label>
                      <ColorPicker
                        value={currentColors.sidebarRing}
                        onChange={(value) =>
                          updateColor(
                            darkMode ? "dark" : "light",
                            "sidebarRing",
                            value
                          )
                        }
                      />
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
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Font Family
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Sans-Serif Font
                      </Label>
                      <Select
                        value={currentTypography.fontSans}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontSans: value })
                        }
                      >
                        <SelectTrigger className="h-9 text-md theme-font-sans theme-tracking">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.sans.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className="theme-font-sans theme-tracking"
                            >
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Serif Font
                      </Label>
                      <Select
                        value={currentTypography.fontSerif}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontSerif: value })
                        }
                      >
                        <SelectTrigger className="h-9 text-md theme-font-sans theme-tracking">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.serif.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className="theme-font-sans theme-tracking"
                            >
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Monospace Font
                      </Label>
                      <Select
                        value={currentTypography.fontMono}
                        onValueChange={(value) =>
                          updateTypography(mode, { fontMono: value })
                        }
                      >
                        <SelectTrigger className="h-9 text-md theme-font-sans theme-tracking">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.mono.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className="theme-font-sans theme-tracking"
                            >
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
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Letter Spacing
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-sm block theme-text-muted-foreground theme-mb-0-5 theme-font-sans theme-tracking">
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
                        className="h-9 w-16 text-md theme-font-sans theme-tracking"
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
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      HSL Adjustments
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Hue Shift
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Saturation Multiplier
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Lightness Multiplier
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Radius
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-sm flex items-center justify-between theme-text-muted-foreground mb-2 theme-font-sans theme-tracking">
                      <span className="theme-font-sans theme-tracking">
                        Radius
                      </span>
                      <span
                        style={{ fontSize: "10px" }}
                        className="theme-font-sans theme-tracking"
                      >
                        rem
                      </span>
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
                        className="h-9 w-16 text-md theme-font-sans theme-tracking"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Spacing
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>
                    <Label className="text-sm flex items-center justify-between theme-text-muted-foreground mb-2 theme-font-sans theme-tracking">
                      <span className="theme-font-sans theme-tracking">
                        Spacing
                      </span>
                      <span
                        style={{ fontSize: "10px" }}
                        className="theme-font-sans theme-tracking"
                      >
                        rem
                      </span>
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
                        className="h-9 w-16 text-md text-center theme-font-sans theme-tracking"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <button className="w-full text-md font-semibold flex items-center justify-between theme-text-foreground theme-mb-6 bg-transparent border-none cursor-pointer theme-font-sans theme-tracking">
                    <span className="theme-font-sans theme-tracking">
                      Shadow
                    </span>
                    <ChevronDown className="w-4 h-4 theme-text-muted-foreground" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col theme-gap-3">
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
                        Shadow Color
                      </Label>
                      <ColorPicker
                        value={currentOther.shadow.color}
                        onChange={(value) => updateShadow(mode, "color", value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm block theme-text-muted-foreground theme-mb-2 theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Blur Radius
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Spread
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Offset X
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm flex items-center justify-between theme-text-muted-foreground theme-mb-6 theme-font-sans theme-tracking">
                        <span className="theme-font-sans theme-tracking">
                          Offset Y
                        </span>
                        <span className="text-[10px] theme-text-muted-foreground theme-font-sans theme-tracking">
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
                          className="h-9 w-16 text-md theme-font-sans theme-tracking"
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
