"use client";

import { Switch } from "@/components/editor/ui/switch";
import { Eye, Pencil } from "lucide-react";

interface EditModeSwitchProps {
  previewMode: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

export const EditModeSwitch = ({ previewMode, onToggle, disabled = false }: EditModeSwitchProps) => {
  return (
    <div className="relative flex items-center">
      <Switch checked={previewMode} onCheckedChange={onToggle} size="lg" disabled={disabled} />
      <div className="absolute inset-0 pointer-events-none flex items-center">
        {previewMode ? (
          <Eye className="w-5 h-5 absolute left-0.5 transition-all theme-text-primary-foreground" />
        ) : (
          <Pencil className="w-4 h-4 absolute right-0.5 transition-all theme-text-primary" />
        )}
      </div>
    </div>
  );
};
