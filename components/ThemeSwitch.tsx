"use client";

import { Switch } from "@/components/editor/ui/switch";
import { CloudSun, Moon } from "lucide-react";

interface ThemeSwitchProps {
  darkMode: boolean;
  onToggle: (checked: boolean) => void;
}

export const ThemeSwitch = ({ darkMode, onToggle }: ThemeSwitchProps) => {
  return (
    <div className="relative flex items-center">
      <Switch checked={darkMode} onCheckedChange={onToggle} size="lg" />
      <div className="absolute inset-0 pointer-events-none flex items-center">
        {darkMode ? (
          <Moon className="w-5 h-5 absolute left-0.5 transition-all theme-text-primary-foreground" />
        ) : (
          <CloudSun className="w-5 h-5 absolute right-0.5 transition-all theme-text-primary" />
        )}
      </div>
    </div>
  );
};
