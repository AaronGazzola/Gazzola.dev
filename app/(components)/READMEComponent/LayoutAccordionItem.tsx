import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { LayoutInput } from "../READMEComponent.types";

interface LayoutAccordionItemProps {
  layout: LayoutInput;
  index: number;
  totalLayouts: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Partial<LayoutInput>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const MIN_LAYOUT_NAME_LENGTH = 2;

export const LayoutAccordionItem = ({
  layout,
  index,
  totalLayouts,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  disabled = false,
}: LayoutAccordionItemProps) => {
  const isNameValid =
    layout.name.trim().length >= MIN_LAYOUT_NAME_LENGTH || !layout.name.trim();

  const updateOption = <T extends keyof LayoutInput["options"]>(
    section: T,
    key: keyof LayoutInput["options"][T],
    value: boolean
  ) => {
    const updatedOptions = {
      ...layout.options,
      [section]: {
        ...layout.options[section],
        [key]: value,
      },
    };

    if (section !== "header" && section !== "leftSidebar" && section !== "rightSidebar" && section !== "footer") {
      return;
    }

    if (key === "enabled" && !value) {
      const sectionObj = updatedOptions[section];
      Object.keys(sectionObj).forEach((k) => {
        if (k !== "enabled") {
          (sectionObj as any)[k] = false;
        }
      });
    }

    if (section === "header" && key === "enabled" && !value) {
      updatedOptions.header.sidebarToggleButton = false;
    }

    if (section === "leftSidebar" && key === "enabled" && !value) {
      updatedOptions.header.sidebarToggleButton = false;
    }

    if (section === "header" && key === "sidebarToggleButton" && value && !updatedOptions.leftSidebar.enabled) {
      return;
    }

    onUpdate(layout.id, { options: updatedOptions });
  };

  const CheckboxOption = ({
    label,
    subtitle,
    checked,
    onChange,
    disabled: optionDisabled,
    indent = false,
  }: {
    label: string;
    subtitle?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    indent?: boolean;
  }) => (
    <div className={`flex items-start theme-gap-3 ${indent ? "theme-pl-6" : ""}`}>
      <Checkbox
        id={`${layout.id}-${label}`}
        checked={checked}
        onCheckedChange={(value) => onChange(value as boolean)}
        disabled={disabled || optionDisabled}
      />
      <div
        className="flex flex-col theme-gap-1 flex-1 cursor-pointer"
        onClick={() => !disabled && !optionDisabled && onChange(!checked)}
      >
        <label
          htmlFor={`${layout.id}-${label}`}
          className="text-sm font-semibold cursor-pointer"
        >
          {label}
        </label>
        {subtitle && (
          <p className="text-xs theme-text-foreground cursor-pointer">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col theme-gap-2 theme-p-2 theme-bg-muted theme-radius border theme-border-border`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          disabled={disabled}
          className="flex items-center theme-gap-2 flex-1 text-left theme-p-1 hover:theme-bg-muted-foreground/10 theme-radius disabled:opacity-50"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 theme-text-primary shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 theme-text-primary shrink-0" />
          )}
          <div className="flex items-center theme-gap-2">
            <span className="text-sm font-semibold theme-text-foreground">
              {layout.name || `Layout ${index + 1}`}
            </span>
          </div>
        </button>
        {totalLayouts > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(layout.id)}
            disabled={disabled}
            className="h-6 px-2 theme-text-destructive hover:theme-text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col theme-gap-3 theme-pl-6 theme-pt-2">
          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Layout Name
            </label>
            <Input
              value={layout.name}
              onChange={(e) => onUpdate(layout.id, { name: e.target.value })}
              placeholder="Main Layout"
              disabled={disabled}
              className={`theme-shadow ${!isNameValid ? "border-destructive" : ""}`}
            />
            {!isNameValid && (
              <p className="text-xs theme-text-destructive">
                Must be at least {MIN_LAYOUT_NAME_LENGTH} characters
              </p>
            )}
          </div>

          <div className="flex flex-col theme-gap-3 theme-pt-2">
            <h4 className="text-sm font-bold theme-text-foreground">
              Layout Components
            </h4>

            <div className="flex flex-col theme-gap-2">
              <CheckboxOption
                label="Header"
                checked={layout.options.header.enabled}
                onChange={(value) => updateOption("header", "enabled", value)}
              />
              {layout.options.header.enabled && (
                <div className="flex flex-col theme-gap-2 theme-pl-6">
                  <CheckboxOption
                    label="Title"
                    subtitle="Links to home page"
                    checked={layout.options.header.title}
                    onChange={(value) => updateOption("header", "title", value)}
                    disabled={!layout.options.header.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Navigation items"
                    subtitle="Shown on large screens"
                    checked={layout.options.header.navigationItems}
                    onChange={(value) =>
                      updateOption("header", "navigationItems", value)
                    }
                    disabled={!layout.options.header.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Profile avatar popover menu"
                    subtitle="Includes a profile link and a sign out button, is replaced with a sign in button when not authenticated"
                    checked={layout.options.header.profileAvatarPopover}
                    onChange={(value) =>
                      updateOption("header", "profileAvatarPopover", value)
                    }
                    disabled={!layout.options.header.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Theme toggle"
                    subtitle="Light/dark mode switch"
                    checked={layout.options.header.themeToggle}
                    onChange={(value) =>
                      updateOption("header", "themeToggle", value)
                    }
                    disabled={!layout.options.header.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Sticky"
                    subtitle="Stays at top on scroll"
                    checked={layout.options.header.sticky}
                    onChange={(value) => updateOption("header", "sticky", value)}
                    disabled={!layout.options.header.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Sidebar toggle button"
                    checked={layout.options.header.sidebarToggleButton}
                    onChange={(value) =>
                      updateOption("header", "sidebarToggleButton", value)
                    }
                    disabled={
                      !layout.options.header.enabled ||
                      !layout.options.leftSidebar.enabled
                    }
                    indent
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col theme-gap-2">
              <CheckboxOption
                label="Left Sidebar"
                checked={layout.options.leftSidebar.enabled}
                onChange={(value) => updateOption("leftSidebar", "enabled", value)}
              />
              {layout.options.leftSidebar.enabled && (
                <div className="flex flex-col theme-gap-2 theme-pl-6">
                  <CheckboxOption
                    label="Title"
                    subtitle="Links to home page"
                    checked={layout.options.leftSidebar.title}
                    onChange={(value) =>
                      updateOption("leftSidebar", "title", value)
                    }
                    disabled={!layout.options.leftSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Navigation items"
                    checked={layout.options.leftSidebar.navigationItems}
                    onChange={(value) =>
                      updateOption("leftSidebar", "navigationItems", value)
                    }
                    disabled={!layout.options.leftSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Profile avatar popover menu"
                    subtitle="Includes a profile link and a sign out button, is replaced with a sign in button when not authenticated"
                    checked={layout.options.leftSidebar.profileAvatarPopover}
                    onChange={(value) =>
                      updateOption("leftSidebar", "profileAvatarPopover", value)
                    }
                    disabled={!layout.options.leftSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Theme toggle"
                    subtitle="Light/dark mode switch"
                    checked={layout.options.leftSidebar.themeToggle}
                    onChange={(value) =>
                      updateOption("leftSidebar", "themeToggle", value)
                    }
                    disabled={!layout.options.leftSidebar.enabled}
                    indent
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col theme-gap-2">
              <CheckboxOption
                label="Right Sidebar"
                checked={layout.options.rightSidebar.enabled}
                onChange={(value) =>
                  updateOption("rightSidebar", "enabled", value)
                }
              />
              {layout.options.rightSidebar.enabled && (
                <div className="flex flex-col theme-gap-2 theme-pl-6">
                  <CheckboxOption
                    label="Title"
                    subtitle="Links to home page"
                    checked={layout.options.rightSidebar.title}
                    onChange={(value) =>
                      updateOption("rightSidebar", "title", value)
                    }
                    disabled={!layout.options.rightSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Navigation items"
                    checked={layout.options.rightSidebar.navigationItems}
                    onChange={(value) =>
                      updateOption("rightSidebar", "navigationItems", value)
                    }
                    disabled={!layout.options.rightSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Profile avatar popover menu"
                    subtitle="Includes a profile link and a sign out button, is replaced with a sign in button when not authenticated"
                    checked={layout.options.rightSidebar.profileAvatarPopover}
                    onChange={(value) =>
                      updateOption("rightSidebar", "profileAvatarPopover", value)
                    }
                    disabled={!layout.options.rightSidebar.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Theme toggle"
                    subtitle="Light/dark mode switch"
                    checked={layout.options.rightSidebar.themeToggle}
                    onChange={(value) =>
                      updateOption("rightSidebar", "themeToggle", value)
                    }
                    disabled={!layout.options.rightSidebar.enabled}
                    indent
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col theme-gap-2">
              <CheckboxOption
                label="Footer"
                checked={layout.options.footer.enabled}
                onChange={(value) => updateOption("footer", "enabled", value)}
              />
              {layout.options.footer.enabled && (
                <div className="flex flex-col theme-gap-2 theme-pl-6">
                  <CheckboxOption
                    label="Title"
                    subtitle="Links to home page"
                    checked={layout.options.footer.title}
                    onChange={(value) => updateOption("footer", "title", value)}
                    disabled={!layout.options.footer.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="All navigation items"
                    checked={layout.options.footer.allNavItems}
                    onChange={(value) =>
                      updateOption("footer", "allNavItems", value)
                    }
                    disabled={!layout.options.footer.enabled}
                    indent
                  />
                  <CheckboxOption
                    label="Legal navigation items"
                    subtitle="Terms, privacy, contact, about"
                    checked={layout.options.footer.legalNavItems}
                    onChange={(value) =>
                      updateOption("footer", "legalNavItems", value)
                    }
                    disabled={!layout.options.footer.enabled}
                    indent
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
