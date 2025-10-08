"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Label } from "@/components/editor/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { Separator } from "@/components/editor/ui/separator";
import { Switch } from "@/components/editor/ui/switch";
import { cn } from "@/lib/tailwind.utils";
import { Palette, Settings } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { StyleControls } from "./ThemeConfiguration.controls";
import { AVAILABLE_COMPONENTS } from "./ThemeConfiguration.types";

export const ThemeConfigurationToolbar = () => {
  const {
    darkMode,
    themeConfigState,
    setActiveVariant,
    setThemeMode,
    updateGlobalTheme,
    updateComponentStyle,
    resetComponentStyle,
  } = useEditorStore();

  const selectedComponent = AVAILABLE_COMPONENTS.find(
    (c) => c.id === themeConfigState.selectedComponentId
  );

  const currentTheme =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeTheme
      : themeConfigState.darkModeTheme;

  const currentVariantStyles =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {}
      : themeConfigState.darkModeComponentStyles[
          themeConfigState.selectedComponentId || ""
        ] || {};

  const currentStyles =
    currentVariantStyles[themeConfigState.activeVariant] || {};

  const handleStyleChange = (key: string, value: any) => {
    if (themeConfigState.selectedComponentId) {
      updateComponentStyle(
        themeConfigState.selectedComponentId,
        themeConfigState.activeVariant,
        { [key]: value }
      );
    }
  };

  const handleReset = () => {
    if (themeConfigState.selectedComponentId) {
      resetComponentStyle(
        themeConfigState.selectedComponentId,
        themeConfigState.activeVariant
      );
    }
  };

  return (
    <div
      className={cn(
        "border-b px-6 py-4 flex items-center justify-between gap-6",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {selectedComponent && (
          <>
            <div className="flex items-center gap-3">
              <Label
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Variant:
              </Label>
              <Select
                value={themeConfigState.activeVariant}
                onValueChange={setActiveVariant}
              >
                <SelectTrigger
                  className={cn(
                    "w-[180px] h-9",
                    darkMode
                      ? "bg-gray-900 border-gray-700 text-gray-100"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedComponent.variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9",
                    darkMode
                      ? "bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Component Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[560px] p-0"
                align="end"
                side="top"
                sideOffset={8}
              >
                <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
                  <div
                    className={cn(
                      "sticky top-0 z-10 px-3 py-2 border-b backdrop-blur-sm",
                      darkMode
                        ? "bg-gray-900/95 border-gray-800"
                        : "bg-white/95 border-gray-200"
                    )}
                  >
                    <h4
                      className={cn(
                        "font-semibold text-xs",
                        darkMode ? "text-gray-100" : "text-gray-900"
                      )}
                    >
                      Component Styles
                    </h4>
                    <p
                      className={cn(
                        "text-[10px] mt-0.5",
                        darkMode ? "text-gray-500" : "text-gray-500"
                      )}
                    >
                      {selectedComponent?.name} -{" "}
                      {themeConfigState.activeVariant} variant
                    </p>
                  </div>

                  <div className="px-3 py-2.5">
                    {themeConfigState.selectedComponentId && (
                      <>
                        <StyleControls
                          componentId={themeConfigState.selectedComponentId}
                          variant={themeConfigState.activeVariant}
                          currentStyles={currentStyles}
                          onStyleChange={handleStyleChange}
                        />

                        <Separator className="my-2.5" />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReset}
                          className={cn(
                            "w-full h-7 text-[11px]",
                            darkMode
                              ? "hover:bg-gray-800 hover:text-gray-100"
                              : "hover:bg-gray-50"
                          )}
                        >
                          Reset Variant Styles
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Label
          className={cn(
            "text-sm font-medium whitespace-nowrap",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}
        >
          Theme Mode:
        </Label>
        <Switch
          checked={themeConfigState.themeMode === "dark"}
          onCheckedChange={(checked) =>
            setThemeMode(checked ? "dark" : "light")
          }
        />
        <span
          className={cn(
            "text-sm font-medium",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          {themeConfigState.themeMode === "dark" ? "Dark" : "Light"}
        </span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9",
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            )}
          >
            <Palette className="h-4 w-4 mr-2" />
            Global Theme
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[680px] p-0" align="end" side="top" sideOffset={8}>
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            <div
              className={cn(
                "sticky top-0 z-10 px-3 py-2 border-b backdrop-blur-sm",
                darkMode
                  ? "bg-gray-900/95 border-gray-800"
                  : "bg-white/95 border-gray-200"
              )}
            >
              <h4
                className={cn(
                  "font-semibold text-xs",
                  darkMode ? "text-gray-100" : "text-gray-900"
                )}
              >
                Global Theme Settings
              </h4>
              <p
                className={cn(
                  "text-[10px] mt-0.5",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                {themeConfigState.themeMode === "dark" ? "Dark" : "Light"} mode
              </p>
            </div>

            <div className="px-3 py-2.5 space-y-3">
              <div>
                <h5
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider mb-2",
                    darkMode ? "text-gray-500" : "text-gray-500"
                  )}
                >
                  Colors
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Preview Bg
                    </Label>
                    <div className="flex gap-1.5 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                              darkMode ? "border-gray-700" : "border-gray-300"
                            )}
                            style={{
                              backgroundColor:
                                currentTheme.previewBackgroundColor,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={currentTheme.previewBackgroundColor}
                            onChange={(color) =>
                              updateGlobalTheme({
                                previewBackgroundColor: color,
                              })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentTheme.previewBackgroundColor}
                        onChange={(e) =>
                          updateGlobalTheme({
                            previewBackgroundColor: e.target.value,
                          })
                        }
                        className={cn(
                          "flex-1 font-mono text-[11px] h-7 px-2",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Primary
                    </Label>
                    <div className="flex gap-1.5 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                              darkMode ? "border-gray-700" : "border-gray-300"
                            )}
                            style={{
                              backgroundColor: currentTheme.primaryColor,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={currentTheme.primaryColor}
                            onChange={(color) =>
                              updateGlobalTheme({ primaryColor: color })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentTheme.primaryColor}
                        onChange={(e) =>
                          updateGlobalTheme({ primaryColor: e.target.value })
                        }
                        className={cn(
                          "flex-1 font-mono text-[11px] h-7 px-2",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Secondary
                    </Label>
                    <div className="flex gap-1.5 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                              darkMode ? "border-gray-700" : "border-gray-300"
                            )}
                            style={{
                              backgroundColor: currentTheme.secondaryColor,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={currentTheme.secondaryColor}
                            onChange={(color) =>
                              updateGlobalTheme({ secondaryColor: color })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentTheme.secondaryColor}
                        onChange={(e) =>
                          updateGlobalTheme({ secondaryColor: e.target.value })
                        }
                        className={cn(
                          "flex-1 font-mono text-[11px] h-7 px-2",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Accent
                    </Label>
                    <div className="flex gap-1.5 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                              darkMode ? "border-gray-700" : "border-gray-300"
                            )}
                            style={{
                              backgroundColor: currentTheme.accentColor,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={currentTheme.accentColor}
                            onChange={(color) =>
                              updateGlobalTheme({ accentColor: color })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentTheme.accentColor}
                        onChange={(e) =>
                          updateGlobalTheme({ accentColor: e.target.value })
                        }
                        className={cn(
                          "flex-1 font-mono text-[11px] h-7 px-2",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h5
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider mb-2",
                    darkMode ? "text-gray-500" : "text-gray-500"
                  )}
                >
                  Typography
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Font Size
                    </Label>
                    <Input
                      value={currentTheme.fontSize}
                      onChange={(e) =>
                        updateGlobalTheme({ fontSize: e.target.value })
                      }
                      placeholder="16px"
                      className={cn(
                        "font-mono text-[11px] h-7 px-2",
                        darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      )}
                    />
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Font Family
                    </Label>
                    <Select
                      value={currentTheme.defaultFontFamily}
                      onValueChange={(value: any) =>
                        updateGlobalTheme({ defaultFontFamily: value })
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "h-7 text-[11px]",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <div className={cn("px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider", darkMode ? "text-gray-500" : "text-gray-500")}>Sans Serif</div>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="open-sans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="source-sans">Source Sans 3</SelectItem>
                        <SelectItem value="raleway">Raleway</SelectItem>
                        <div className={cn("px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider mt-1", darkMode ? "text-gray-500" : "text-gray-500")}>Serif</div>
                        <SelectItem value="merriweather">Merriweather</SelectItem>
                        <SelectItem value="playfair">Playfair Display</SelectItem>
                        <SelectItem value="lora">Lora</SelectItem>
                        <SelectItem value="pt-serif">PT Serif</SelectItem>
                        <SelectItem value="crimson">Crimson Text</SelectItem>
                        <div className={cn("px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider mt-1", darkMode ? "text-gray-500" : "text-gray-500")}>Monospace</div>
                        <SelectItem value="source-code">Source Code Pro</SelectItem>
                        <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                        <SelectItem value="fira-code">Fira Code</SelectItem>
                        <SelectItem value="ibm-plex">IBM Plex Mono</SelectItem>
                        <SelectItem value="space-mono">Space Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Font Color
                    </Label>
                    <div className="flex gap-1.5 items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                              darkMode ? "border-gray-700" : "border-gray-300"
                            )}
                            style={{
                              backgroundColor: currentTheme.defaultFontColor,
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <HexColorPicker
                            color={currentTheme.defaultFontColor}
                            onChange={(color) =>
                              updateGlobalTheme({
                                defaultFontColor: color,
                              })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentTheme.defaultFontColor}
                        onChange={(e) =>
                          updateGlobalTheme({
                            defaultFontColor: e.target.value,
                          })
                        }
                        className={cn(
                          "flex-1 font-mono text-[11px] h-7 px-2",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h5
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider mb-2",
                    darkMode ? "text-gray-500" : "text-gray-500"
                  )}
                >
                  Appearance
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Radius
                    </Label>
                    <Select
                      value={currentTheme.borderRadiusPreset}
                      onValueChange={(value: any) =>
                        updateGlobalTheme({ borderRadiusPreset: value })
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "h-7 text-[11px]",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      className={cn(
                        "text-xs font-medium mb-1 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Shadow
                    </Label>
                    <Select
                      value={currentTheme.shadowIntensity}
                      onValueChange={(value: any) =>
                        updateGlobalTheme({ shadowIntensity: value })
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "h-7 text-[11px]",
                          darkMode
                            ? "bg-gray-900 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
