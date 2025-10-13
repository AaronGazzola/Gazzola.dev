"use client";

import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onFocus?: () => void;
}

export const ColorPicker = ({ value, onChange, onFocus }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex theme-gap-3">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="h-9 text-xs font-mono flex-1"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="theme-radius theme-border-border"
            style={{
              width: "36px",
              height: "36px",
              borderWidth: "1px",
              backgroundColor: value,
              cursor: "pointer",
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
