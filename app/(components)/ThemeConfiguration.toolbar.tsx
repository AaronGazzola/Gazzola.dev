"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/default/ui/button";
import { Label } from "@/components/default/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/default/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/default/ui/select";
import { Separator } from "@/components/default/ui/separator";
import { Slider } from "@/components/default/ui/slider";
import { Switch } from "@/components/default/ui/switch";
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

  const currentTheme = themeConfigState.themeMode === "light"
    ? themeConfigState.lightModeTheme
    : themeConfigState.darkModeTheme;

  const currentVariantStyles = themeConfigState.themeMode === "light"
    ? (themeConfigState.lightModeComponentStyles[themeConfigState.selectedComponentId || ""] || {})
    : (themeConfigState.darkModeComponentStyles[themeConfigState.selectedComponentId || ""] || {});

  const currentStyles = currentVariantStyles[themeConfigState.activeVariant] || {};

  const handleStyleChange = (key: string, value: any) => {
    if (themeConfigState.selectedComponentId) {
      updateComponentStyle(themeConfigState.selectedComponentId, themeConfigState.activeVariant, { [key]: value });
    }
  };

  const handleReset = () => {
    if (themeConfigState.selectedComponentId) {
      resetComponentStyle(themeConfigState.selectedComponentId, themeConfigState.activeVariant);
    }
  };

  return (
    <div
      className={cn(
        "border-b px-4 py-3 flex items-center justify-between gap-4",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {selectedComponent && (
          <>
            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Variant:</Label>
              <Select
                value={themeConfigState.activeVariant}
                onValueChange={setActiveVariant}
              >
                <SelectTrigger className="w-[180px]">
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
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Component Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  <h4 className="font-medium">Component Styles</h4>

                  {themeConfigState.selectedComponentId && (
                    <>
                      <StyleControls
                        componentId={themeConfigState.selectedComponentId}
                        variant={themeConfigState.activeVariant}
                        currentStyles={currentStyles}
                        onStyleChange={handleStyleChange}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="w-full mt-4"
                      >
                        Reset Variant Styles
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">Theme Mode:</Label>
        <Switch
          checked={themeConfigState.themeMode === "dark"}
          onCheckedChange={(checked) => setThemeMode(checked ? "dark" : "light")}
        />
        <span className="text-sm">{themeConfigState.themeMode === "dark" ? "Dark" : "Light"}</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Palette className="h-4 w-4 mr-2" />
            Global Theme
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Global Theme Settings ({themeConfigState.themeMode})</h4>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Preview Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: currentTheme.previewBackgroundColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={currentTheme.previewBackgroundColor}
                          onChange={(color) =>
                            updateGlobalTheme({ previewBackgroundColor: color })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      value={currentTheme.previewBackgroundColor}
                      onChange={(e) =>
                        updateGlobalTheme({ previewBackgroundColor: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: currentTheme.primaryColor }}
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
                    <input
                      type="text"
                      value={currentTheme.primaryColor}
                      onChange={(e) =>
                        updateGlobalTheme({ primaryColor: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: currentTheme.secondaryColor }}
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
                    <input
                      type="text"
                      value={currentTheme.secondaryColor}
                      onChange={(e) =>
                        updateGlobalTheme({ secondaryColor: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: currentTheme.accentColor }}
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
                    <input
                      type="text"
                      value={currentTheme.accentColor}
                      onChange={(e) =>
                        updateGlobalTheme({ accentColor: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Border Radius Preset</Label>
                  <Select
                    value={currentTheme.borderRadiusPreset}
                    onValueChange={(value: any) =>
                      updateGlobalTheme({ borderRadiusPreset: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
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
                  <Label className="text-xs">Shadow Intensity</Label>
                  <Select
                    value={currentTheme.shadowIntensity}
                    onValueChange={(value: any) =>
                      updateGlobalTheme({ shadowIntensity: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label className="text-xs">Font Size Scale</Label>
                  <Select
                    value={currentTheme.fontSizeScale}
                    onValueChange={(value: any) =>
                      updateGlobalTheme({ fontSizeScale: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
