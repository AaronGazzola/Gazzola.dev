"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { Separator } from "@/components/editor/ui/separator";
import { cn } from "@/lib/tailwind.utils";
import { HexColorPicker } from "react-colorful";

export const ThemeConfigurationGlobal = () => {
  const { darkMode, themeConfigState, updateGlobalTheme } = useEditorStore();

  const currentTheme =
    themeConfigState.themeMode === "light"
      ? themeConfigState.lightModeTheme
      : themeConfigState.darkModeTheme;

  return (
    <div
      className={cn(
        "w-[320px] border-r flex flex-col",
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="p-6 border-b border-gray-800">
        <h2
          className={cn(
            "text-base font-semibold tracking-tight",
            darkMode ? "text-gray-100" : "text-gray-900"
          )}
        >
          Global Theme
        </h2>
        <p
          className={cn(
            "text-xs mt-1",
            darkMode ? "text-gray-500" : "text-gray-500"
          )}
        >
          Configure theme-wide settings
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div>
            <h3
              className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-4",
                darkMode ? "text-gray-500" : "text-gray-500"
              )}
            >
              Colors
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  className={cn(
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Preview Background
                </Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
                          darkMode ? "border-gray-700" : "border-gray-300"
                        )}
                        style={{
                          backgroundColor: currentTheme.previewBackgroundColor,
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
                      "flex-1 font-mono text-xs h-9 px-3",
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
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Primary Color
                </Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
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
                      "flex-1 font-mono text-xs h-9 px-3",
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
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Secondary Color
                </Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
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
                      "flex-1 font-mono text-xs h-9 px-3",
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
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Accent Color
                </Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
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
                      "flex-1 font-mono text-xs h-9 px-3",
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
            <h3
              className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-4",
                darkMode ? "text-gray-500" : "text-gray-500"
              )}
            >
              Typography
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  className={cn(
                    "text-sm font-medium mb-2 block",
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
                      "h-9",
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
                    "text-sm font-medium mb-2 block",
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
                    "font-mono h-9 px-3",
                    darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  )}
                />
              </div>

              <div>
                <Label
                  className={cn(
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Font Color
                </Label>
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded border-2 transition-all hover:scale-105 shadow-sm flex-shrink-0",
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
                      "flex-1 font-mono text-xs h-9 px-3",
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
            <h3
              className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-4",
                darkMode ? "text-gray-500" : "text-gray-500"
              )}
            >
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  className={cn(
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Border Radius
                </Label>
                <Select
                  value={currentTheme.borderRadiusPreset}
                  onValueChange={(value: any) =>
                    updateGlobalTheme({ borderRadiusPreset: value })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "h-9",
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
                    "text-sm font-medium mb-2 block",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Shadow Intensity
                </Label>
                <Select
                  value={currentTheme.shadowIntensity}
                  onValueChange={(value: any) =>
                    updateGlobalTheme({ shadowIntensity: value })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "h-9",
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
      </ScrollArea>
    </div>
  );
};
