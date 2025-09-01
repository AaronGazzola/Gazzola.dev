"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
];

export function ThemeToolbar() {
  return (
    <div className="flex justify-end p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="grid gap-1">
            <div className="text-sm font-medium">Theme</div>
            {themes.map((theme) => (
              <Button
                key={theme.value}
                variant="ghost"
                className="justify-start h-8"
              >
                <Check className="h-4 w-4 mr-2 opacity-0" />
                {theme.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}