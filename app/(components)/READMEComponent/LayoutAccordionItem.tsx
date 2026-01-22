import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
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
const MIN_LAYOUT_DESCRIPTION_LENGTH = 20;

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
  const isDescriptionValid =
    layout.description.trim().length >= MIN_LAYOUT_DESCRIPTION_LENGTH ||
    !layout.description.trim();

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

          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Description
            </label>
            <Textarea
              value={layout.description}
              onChange={(e) =>
                onUpdate(layout.id, { description: e.target.value })
              }
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Describe the structure and purpose of this layout..."
              disabled={disabled}
              className={`theme-shadow min-h-[80px] ${!isDescriptionValid ? "border-destructive" : ""}`}
            />
            <p
              className={`text-xs ${isDescriptionValid ? "theme-text-muted-foreground" : "theme-text-destructive"} font-semibold`}
            >
              Minimum {MIN_LAYOUT_DESCRIPTION_LENGTH} characters
              {layout.description.length > 0 &&
                ` (${layout.description.trim().length}/${MIN_LAYOUT_DESCRIPTION_LENGTH})`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
