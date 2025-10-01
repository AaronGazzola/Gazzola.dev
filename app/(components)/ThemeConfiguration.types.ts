import { ThemeConfigComponent } from "@/app/(editor)/layout.types";

export interface PreviewProps {
  variant?: string;
  styleConfig?: Record<string, any>;
}

export const AVAILABLE_COMPONENTS: ThemeConfigComponent[] = [
  { id: "accordion", name: "Accordion", category: "data-display", variants: ["default"], defaultVariant: "default" },
  { id: "alert", name: "Alert", category: "feedback", variants: ["default", "destructive"], defaultVariant: "default" },
  { id: "alert-dialog", name: "Alert Dialog", category: "overlay", variants: ["default"], defaultVariant: "default" },
  { id: "avatar", name: "Avatar", category: "data-display", variants: ["default"], defaultVariant: "default" },
  { id: "badge", name: "Badge", category: "data-display", variants: ["default", "secondary", "destructive", "outline"], defaultVariant: "default" },
  { id: "button", name: "Button", category: "form", variants: ["default", "destructive", "outline", "secondary", "ghost", "link"], defaultVariant: "default" },
  { id: "calendar", name: "Calendar", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "card", name: "Card", category: "layout", variants: ["default"], defaultVariant: "default" },
  { id: "checkbox", name: "Checkbox", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "collapsible", name: "Collapsible", category: "data-display", variants: ["default"], defaultVariant: "default" },
  { id: "dialog", name: "Dialog", category: "overlay", variants: ["default"], defaultVariant: "default" },
  { id: "input", name: "Input", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "label", name: "Label", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "popover", name: "Popover", category: "overlay", variants: ["default"], defaultVariant: "default" },
  { id: "progress", name: "Progress", category: "feedback", variants: ["default"], defaultVariant: "default" },
  { id: "radio-group", name: "Radio Group", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "scroll-area", name: "Scroll Area", category: "layout", variants: ["default"], defaultVariant: "default" },
  { id: "select", name: "Select", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "separator", name: "Separator", category: "layout", variants: ["default"], defaultVariant: "default" },
  { id: "sheet", name: "Sheet", category: "overlay", variants: ["default", "top", "right", "bottom", "left"], defaultVariant: "default" },
  { id: "skeleton", name: "Skeleton", category: "feedback", variants: ["default"], defaultVariant: "default" },
  { id: "slider", name: "Slider", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "switch", name: "Switch", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "table", name: "Table", category: "data-display", variants: ["default"], defaultVariant: "default" },
  { id: "textarea", name: "Textarea", category: "form", variants: ["default"], defaultVariant: "default" },
  { id: "tooltip", name: "Tooltip", category: "overlay", variants: ["default"], defaultVariant: "default" },
];

export const COMPONENT_CATEGORIES = [
  { id: "form", name: "Form" },
  { id: "layout", name: "Layout" },
  { id: "feedback", name: "Feedback" },
  { id: "data-display", name: "Data Display" },
  { id: "navigation", name: "Navigation" },
  { id: "overlay", name: "Overlay" },
] as const;
