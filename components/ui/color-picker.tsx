"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const presetColors = [
  "#3b82f6", "#1d4ed8", "#2563eb", "#1e40af",
  "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6",
  "#10b981", "#059669", "#047857", "#065f46",
  "#ef4444", "#dc2626", "#b91c1c", "#991b1b",
  "#f59e0b", "#d97706", "#b45309", "#92400e",
  "#6b7280", "#4b5563", "#374151", "#1f2937",
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setInputValue(color);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      onChange(newValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-12 w-full p-1", className)}
          style={{ backgroundColor: value }}
        >
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" side="bottom" align="start">
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <Button
                key={color}
                variant="outline"
                className="h-8 w-8 p-0 border-2"
                style={{ backgroundColor: color }}
                onClick={() => handlePresetClick(color)}
              >
                <span className="sr-only">{color}</span>
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color</label>
            <div className="flex gap-2">
              <div
                className="h-8 w-8 border-2 border-border rounded"
                style={{ backgroundColor: inputValue }}
              />
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}