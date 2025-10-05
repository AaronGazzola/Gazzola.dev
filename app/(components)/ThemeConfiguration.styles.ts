export interface StyleControl {
  type: "color" | "slider" | "text" | "select";
  label: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export interface ComponentStyleSchema {
  groups: {
    label: string;
    controls: StyleControl[];
  }[];
}

export const COMPONENT_STYLE_SCHEMAS: Record<string, ComponentStyleSchema> = {
  button: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Hover Background", key: "hoverBackgroundColor", defaultValue: "#2563eb" },
          { type: "color", label: "Hover Text", key: "hoverColor", defaultValue: "#ffffff" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding X", key: "paddingX", min: 0, max: 48, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Padding Y", key: "paddingY", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "6" },
          { type: "slider", label: "Border Width", key: "borderWidth", min: 0, max: 4, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
      {
        label: "Typography",
        controls: [
          { type: "slider", label: "Font Size", key: "fontSize", min: 10, max: 24, step: 1, unit: "px", defaultValue: "14" },
          { type: "select", label: "Font Weight", key: "fontWeight", options: [
            { value: "400", label: "Normal" },
            { value: "500", label: "Medium" },
            { value: "600", label: "Semibold" },
            { value: "700", label: "Bold" },
          ], defaultValue: "500" },
        ],
      },
    ],
  },
  progress: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Track Background", key: "backgroundColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Indicator Color", key: "foregroundColor", defaultValue: "#3b82f6" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Height", key: "height", min: 4, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "9999" },
        ],
      },
    ],
  },
  input: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#000000" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Focus Border", key: "focusBorderColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Placeholder", key: "placeholderColor", defaultValue: "#9ca3af" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding X", key: "paddingX", min: 0, max: 24, step: 1, unit: "px", defaultValue: "12" },
          { type: "slider", label: "Padding Y", key: "paddingY", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "6" },
          { type: "slider", label: "Border Width", key: "borderWidth", min: 0, max: 4, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
      {
        label: "Typography",
        controls: [
          { type: "slider", label: "Font Size", key: "fontSize", min: 10, max: 20, step: 1, unit: "px", defaultValue: "14" },
        ],
      },
    ],
  },
  badge: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#ffffff" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding X", key: "paddingX", min: 0, max: 16, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Padding Y", key: "paddingY", min: 0, max: 12, step: 1, unit: "px", defaultValue: "2" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "9999" },
        ],
      },
      {
        label: "Typography",
        controls: [
          { type: "slider", label: "Font Size", key: "fontSize", min: 10, max: 16, step: 1, unit: "px", defaultValue: "12" },
        ],
      },
    ],
  },
  alert: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#f3f4f6" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#1f2937" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Icon Color", key: "iconColor", defaultValue: "#3b82f6" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Width", key: "borderWidth", min: 0, max: 4, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
    ],
  },
  card: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Header Color", key: "headerColor", defaultValue: "#1f2937" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 48, step: 1, unit: "px", defaultValue: "24" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Width", key: "borderWidth", min: 0, max: 4, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
      {
        label: "Effects",
        controls: [
          { type: "select", label: "Shadow", key: "boxShadow", options: [
            { value: "none", label: "None" },
            { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Small" },
            { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", label: "Medium" },
            { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", label: "Large" },
          ], defaultValue: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
        ],
      },
    ],
  },
  checkbox: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Checked Color", key: "checkedColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Checkmark Color", key: "checkmarkColor", defaultValue: "#ffffff" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Size", key: "size", min: 12, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 8, step: 1, unit: "px", defaultValue: "3" },
          { type: "slider", label: "Border Width", key: "borderWidth", min: 1, max: 3, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
    ],
  },
  switch: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Track Off", key: "trackOffColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Track On", key: "trackOnColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Thumb Color", key: "thumbColor", defaultValue: "#ffffff" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Width", key: "width", min: 28, max: 64, step: 1, unit: "px", defaultValue: "44" },
          { type: "slider", label: "Height", key: "height", min: 16, max: 32, step: 1, unit: "px", defaultValue: "24" },
          { type: "slider", label: "Thumb Size", key: "thumbSize", min: 14, max: 28, step: 1, unit: "px", defaultValue: "20" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "9999" },
        ],
      },
    ],
  },
  slider: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Track Color", key: "trackColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Active Track", key: "activeTrackColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Thumb Color", key: "thumbColor", defaultValue: "#ffffff" },
          { type: "color", label: "Thumb Border", key: "thumbBorderColor", defaultValue: "#3b82f6" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Track Height", key: "trackHeight", min: 2, max: 12, step: 1, unit: "px", defaultValue: "4" },
          { type: "slider", label: "Thumb Size", key: "thumbSize", min: 12, max: 24, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "9999" },
        ],
      },
    ],
  },
  separator: {
    groups: [
      {
        label: "Appearance",
        controls: [
          { type: "color", label: "Color", key: "backgroundColor", defaultValue: "#e5e7eb" },
          { type: "slider", label: "Thickness", key: "thickness", min: 1, max: 4, step: 1, unit: "px", defaultValue: "1" },
        ],
      },
    ],
  },
  skeleton: {
    groups: [
      {
        label: "Appearance",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Shimmer Color", key: "shimmerColor", defaultValue: "#f3f4f6" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "4" },
        ],
      },
    ],
  },
  table: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Header Background", key: "headerBackgroundColor", defaultValue: "#f9fafb" },
          { type: "color", label: "Row Background", key: "rowBackgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Hover Row", key: "hoverRowColor", defaultValue: "#f3f4f6" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Cell Padding X", key: "cellPaddingX", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Cell Padding Y", key: "cellPaddingY", min: 0, max: 24, step: 1, unit: "px", defaultValue: "12" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  accordion: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Trigger Color", key: "triggerColor", defaultValue: "#1f2937" },
          { type: "color", label: "Content Color", key: "contentColor", defaultValue: "#6b7280" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  avatar: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#1f2937" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Size", key: "size", min: 24, max: 128, step: 1, unit: "px", defaultValue: "40" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 128, step: 1, unit: "px", defaultValue: "9999" },
        ],
      },
    ],
  },
  textarea: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#000000" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Focus Border", key: "focusBorderColor", defaultValue: "#3b82f6" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 24, step: 1, unit: "px", defaultValue: "12" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "6" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Min Height", key: "minHeight", min: 60, max: 300, step: 10, unit: "px", defaultValue: "80" },
        ],
      },
    ],
  },
  label: {
    groups: [
      {
        label: "Typography",
        controls: [
          { type: "color", label: "Text Color", key: "color", defaultValue: "#1f2937" },
          { type: "slider", label: "Font Size", key: "fontSize", min: 10, max: 20, step: 1, unit: "px", defaultValue: "14" },
          { type: "select", label: "Font Weight", key: "fontWeight", options: [
            { value: "400", label: "Normal" },
            { value: "500", label: "Medium" },
            { value: "600", label: "Semibold" },
            { value: "700", label: "Bold" },
          ], defaultValue: "500" },
        ],
      },
    ],
  },
  select: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#000000" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Focus Border", key: "focusBorderColor", defaultValue: "#3b82f6" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding X", key: "paddingX", min: 0, max: 24, step: 1, unit: "px", defaultValue: "12" },
          { type: "slider", label: "Padding Y", key: "paddingY", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "6" },
        ],
      },
    ],
  },
  "radio-group": {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Checked Color", key: "checkedColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Size", key: "size", min: 12, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Dot Size", key: "dotSize", min: 6, max: 16, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  "scroll-area": {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Scrollbar Track", key: "scrollbarTrackColor", defaultValue: "#f3f4f6" },
          { type: "color", label: "Scrollbar Thumb", key: "scrollbarThumbColor", defaultValue: "#d1d5db" },
        ],
      },
      {
        label: "Dimensions",
        controls: [
          { type: "slider", label: "Scrollbar Width", key: "scrollbarWidth", min: 4, max: 16, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  collapsible: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  calendar: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Selected Color", key: "selectedColor", defaultValue: "#3b82f6" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#1f2937" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  dialog: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Overlay Color", key: "overlayColor", defaultValue: "rgba(0, 0, 0, 0.5)" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 48, step: 1, unit: "px", defaultValue: "24" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  "alert-dialog": {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Overlay Color", key: "overlayColor", defaultValue: "rgba(0, 0, 0, 0.5)" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 48, step: 1, unit: "px", defaultValue: "24" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
    ],
  },
  popover: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 32, step: 1, unit: "px", defaultValue: "16" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 24, step: 1, unit: "px", defaultValue: "8" },
        ],
      },
      {
        label: "Effects",
        controls: [
          { type: "select", label: "Shadow", key: "boxShadow", options: [
            { value: "none", label: "None" },
            { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Small" },
            { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", label: "Medium" },
            { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", label: "Large" },
          ], defaultValue: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
        ],
      },
    ],
  },
  sheet: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#ffffff" },
          { type: "color", label: "Border Color", key: "borderColor", defaultValue: "#e5e7eb" },
          { type: "color", label: "Overlay Color", key: "overlayColor", defaultValue: "rgba(0, 0, 0, 0.5)" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding", key: "padding", min: 0, max: 48, step: 1, unit: "px", defaultValue: "24" },
        ],
      },
    ],
  },
  tooltip: {
    groups: [
      {
        label: "Colors",
        controls: [
          { type: "color", label: "Background", key: "backgroundColor", defaultValue: "#1f2937" },
          { type: "color", label: "Text Color", key: "color", defaultValue: "#ffffff" },
        ],
      },
      {
        label: "Spacing",
        controls: [
          { type: "slider", label: "Padding X", key: "paddingX", min: 0, max: 16, step: 1, unit: "px", defaultValue: "12" },
          { type: "slider", label: "Padding Y", key: "paddingY", min: 0, max: 12, step: 1, unit: "px", defaultValue: "6" },
          { type: "slider", label: "Border Radius", key: "borderRadius", min: 0, max: 12, step: 1, unit: "px", defaultValue: "6" },
        ],
      },
      {
        label: "Typography",
        controls: [
          { type: "slider", label: "Font Size", key: "fontSize", min: 10, max: 16, step: 1, unit: "px", defaultValue: "12" },
        ],
      },
    ],
  },
};
