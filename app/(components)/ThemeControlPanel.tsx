"use client";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useThemeStore } from "../layout.stores";

const ThemeControlPanel = () => {
  const {
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
    reset,
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
      <div className="flex justify-end">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
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
          <ColorPicker
            value={singleColor}
            onChange={setSingleColor}
            className="w-full"
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {gradientColors.map((color, index) => (
              <ColorPicker
                key={index}
                value={color}
                onChange={(newColor) =>
                  handleGradientColorChange(index, newColor)
                }
              />
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
            <div key={index} className={cn(!starsEnabled && "opacity-50")}>
              <ColorPicker
                value={color}
                onChange={(newColor) =>
                  starsEnabled && handleStarColorChange(index, newColor)
                }
                className={cn(!starsEnabled && "pointer-events-none")}
              />
            </div>
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
