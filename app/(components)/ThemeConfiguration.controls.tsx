"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { Slider } from "@/components/editor/ui/slider";
import { cn } from "@/lib/tailwind.utils";
import { HexColorPicker } from "react-colorful";
import {
  COMPONENT_STYLE_SCHEMAS,
  StyleControl,
} from "./ThemeConfiguration.styles";

interface StyleControlsProps {
  componentId: string;
  variant: string;
  currentStyles: Record<string, any>;
  onStyleChange: (key: string, value: any) => void;
}

const StyleControlRenderer = ({
  control,
  value,
  onChange,
}: {
  control: StyleControl;
  value: any;
  onChange: (value: any) => void;
}) => {
  const { darkMode } = useEditorStore();

  switch (control.type) {
    case "color":
      return (
        <div>
          <Label
            className={cn(
              "text-xs font-medium mb-1 block",
              darkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            {control.label}
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
                    backgroundColor: value || control.defaultValue || "#000000",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker
                  color={value || control.defaultValue || "#000000"}
                  onChange={onChange}
                />
              </PopoverContent>
            </Popover>
            <Input
              value={value || control.defaultValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "flex-1 font-mono text-[11px] h-7 px-2",
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              )}
              placeholder={control.defaultValue}
            />
          </div>
        </div>
      );

    case "slider":
      const numValue = value
        ? parseInt(String(value).replace(/\D/g, ""))
        : parseInt(control.defaultValue || "0");
      return (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label
              className={cn(
                "text-xs font-medium",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              {control.label}
            </Label>
            <span
              className={cn(
                "text-[11px] font-mono tabular-nums",
                darkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              {value || `${control.defaultValue}${control.unit || ""}`}
            </span>
          </div>
          <Slider
            value={[numValue]}
            onValueChange={(vals) =>
              onChange(`${vals[0]}${control.unit || ""}`)
            }
            min={control.min || 0}
            max={control.max || 100}
            step={control.step || 1}
            className="w-full"
          />
        </div>
      );

    case "text":
      return (
        <div>
          <Label
            className={cn(
              "text-xs font-medium mb-1 block",
              darkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            {control.label}
          </Label>
          <Input
            value={value || control.defaultValue || ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full h-7 text-[11px] px-2",
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-50 border-gray-200"
            )}
            placeholder={control.defaultValue}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <Label
            className={cn(
              "text-xs font-medium mb-1 block",
              darkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            {control.label}
          </Label>
          <Select
            value={value || control.defaultValue}
            onValueChange={onChange}
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
              {control.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    default:
      return null;
  }
};

export const StyleControls = ({
  componentId,
  variant,
  currentStyles,
  onStyleChange,
}: StyleControlsProps) => {
  const { darkMode } = useEditorStore();
  const schema = COMPONENT_STYLE_SCHEMAS[componentId];

  if (!schema) {
    return (
      <div
        className={cn("text-sm", darkMode ? "text-gray-500" : "text-gray-500")}
      >
        No style controls available for this component.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {schema.groups.map((group, groupIndex) => {
        const isColorGroup = group.controls.every(control => control.type === "color");

        return (
          <div key={groupIndex}>
            <h5
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider mb-2",
                darkMode ? "text-gray-500" : "text-gray-500"
              )}
            >
              {group.label}
            </h5>
            <div className={cn(
              isColorGroup ? "grid grid-cols-2 gap-2" : "space-y-2.5"
            )}>
              {group.controls.map((control) => (
                <StyleControlRenderer
                  key={control.key}
                  control={control}
                  value={currentStyles[control.key]}
                  onChange={(value) => onStyleChange(control.key, value)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
