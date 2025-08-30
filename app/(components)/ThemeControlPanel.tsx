"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/tailwind.utils";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../layout.stores";

const ThemeControlPanel = () => {
  const {
    isDarkMode,
    setIsDarkMode,
    gradientEnabled,
    setGradientEnabled,
    starsEnabled,
    setStarsEnabled,
    singleColor,
    setSingleColor,
    gradientColors,
    setGradientColors,
    starColors,
    setStarColors,
    starSize,
    setStarSize,
    starNumber,
    setStarNumber,
  } = useThemeStore();

  const handleGradientColorChange = (index: number, color: string) => {
    const newColors = [...gradientColors];
    newColors[index] = color;
    setGradientColors(newColors);
  };

  const handleStarColorChange = (index: number, color: string) => {
    const newColors = [...starColors];
    newColors[index] = color;
    setStarColors(newColors);
  };

  return (
    <div className="w-80 p-4 space-y-6">
      <div className="flex items-center justify-around">
        <Sun className="w-5 h-5 text-yellow-500" />
        <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
        <Moon className="w-5 h-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Colors</h3>
          <Switch
            checked={gradientEnabled}
            onCheckedChange={setGradientEnabled}
          />
        </div>

        {!gradientEnabled ? (
          <Button
            variant="outline"
            className="w-full h-12 p-1"
            style={{ backgroundColor: singleColor }}
            onClick={() =>
              document.getElementById("single-color-picker")?.click()
            }
          >
            <Input
              id="single-color-picker"
              type="color"
              value={singleColor}
              onChange={(e) => setSingleColor(e.target.value)}
              className="opacity-0 w-0 h-0 absolute"
            />
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {gradientColors.map((color, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 w-full p-1"
                style={{ backgroundColor: color }}
                onClick={() =>
                  document.getElementById(`gradient-color-${index}`)?.click()
                }
              >
                <Input
                  id={`gradient-color-${index}`}
                  type="color"
                  value={color}
                  onChange={(e) =>
                    handleGradientColorChange(index, e.target.value)
                  }
                  className="opacity-0 w-0 h-0 absolute"
                />
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Stars</h3>
          <Switch checked={starsEnabled} onCheckedChange={setStarsEnabled} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {starColors.map((color, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "h-10 w-full p-1",
                !starsEnabled && "opacity-50 cursor-not-allowed"
              )}
              style={{ backgroundColor: color }}
              disabled={!starsEnabled}
              onClick={() =>
                starsEnabled &&
                document.getElementById(`star-color-${index}`)?.click()
              }
            >
              <Input
                id={`star-color-${index}`}
                type="color"
                value={color}
                onChange={(e) => handleStarColorChange(index, e.target.value)}
                className="opacity-0 w-0 h-0 absolute"
              />
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Size</label>
              <span className="text-sm text-muted-foreground">{starSize}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              value={[starSize]}
              onValueChange={(value) => setStarSize(value[0])}
              disabled={!starsEnabled}
              className={cn("w-full")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Number</label>
              <span className="text-sm text-muted-foreground">
                {starNumber}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              value={[starNumber]}
              onValueChange={(value) => setStarNumber(value[0])}
              disabled={!starsEnabled}
              className={cn("w-full")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeControlPanel;
