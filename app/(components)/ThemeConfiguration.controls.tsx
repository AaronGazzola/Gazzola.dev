"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { Slider } from "@/components/default/ui/slider";
import { HexColorPicker } from "react-colorful";
import { COMPONENT_STYLE_SCHEMAS, StyleControl } from "./ThemeConfiguration.styles";

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
  switch (control.type) {
    case "color":
      return (
        <div>
          <Label className="text-xs">{control.label}</Label>
          <div className="flex gap-2 mt-1">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: value || control.defaultValue || "#000000" }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker
                  color={value || control.defaultValue || "#000000"}
                  onChange={onChange}
                />
              </PopoverContent>
            </Popover>
            <input
              type="text"
              value={value || control.defaultValue || ""}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
              placeholder={control.defaultValue}
            />
          </div>
        </div>
      );

    case "slider":
      const numValue = value ? parseInt(String(value).replace(/\D/g, "")) : parseInt(control.defaultValue || "0");
      return (
        <div>
          <Label className="text-xs">{control.label}</Label>
          <Slider
            value={[numValue]}
            onValueChange={(vals) => onChange(`${vals[0]}${control.unit || ""}`)}
            min={control.min || 0}
            max={control.max || 100}
            step={control.step || 1}
            className="mt-2"
          />
          <span className="text-xs text-muted-foreground">
            {value || `${control.defaultValue}${control.unit || ""}`}
          </span>
        </div>
      );

    case "text":
      return (
        <div>
          <Label className="text-xs">{control.label}</Label>
          <input
            type="text"
            value={value || control.defaultValue || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border rounded mt-1"
            placeholder={control.defaultValue}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <Label className="text-xs">{control.label}</Label>
          <Select value={value || control.defaultValue} onValueChange={onChange}>
            <SelectTrigger className="mt-1">
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
  const schema = COMPONENT_STYLE_SCHEMAS[componentId];

  if (!schema) {
    return (
      <div className="text-sm text-muted-foreground">
        No style controls available for this component.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schema.groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <h5 className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
            {group.label}
          </h5>
          <div className="space-y-3">
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
      ))}
    </div>
  );
};
