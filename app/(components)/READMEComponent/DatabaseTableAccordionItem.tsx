import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { DatabaseTable } from "../READMEComponent.types";

interface DatabaseTableAccordionItemProps {
  table: DatabaseTable;
  index: number;
  totalTables: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Partial<DatabaseTable>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const MIN_TABLE_NAME_LENGTH = 2;
const MIN_TABLE_DESCRIPTION_LENGTH = 20;

export const DatabaseTableAccordionItem = ({
  table,
  index,
  totalTables,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  disabled = false,
}: DatabaseTableAccordionItemProps) => {
  const isNameValid = table.name.trim().length >= MIN_TABLE_NAME_LENGTH || !table.name.trim();
  const isDescriptionValid =
    table.description.trim().length >= MIN_TABLE_DESCRIPTION_LENGTH ||
    !table.description.trim();

  return (
    <div className={`flex flex-col theme-gap-2 theme-p-2 theme-bg-muted theme-radius ${isExpanded ? 'theme-border-primary' : ''}`}>
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
          <span className="text-sm font-semibold theme-text-foreground">
            {table.name || `Table ${index + 1}`}
          </span>
        </button>
        {totalTables > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(table.id)}
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
              Table Name
            </label>
            <Input
              value={table.name}
              onChange={(e) => onUpdate(table.id, { name: e.target.value })}
              placeholder="users"
              disabled={disabled}
              className={`theme-shadow ${!isNameValid ? "border-destructive" : ""}`}
            />
            {!isNameValid && (
              <p className="text-xs theme-text-destructive">
                Must be at least {MIN_TABLE_NAME_LENGTH} characters
              </p>
            )}
          </div>

          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Description
            </label>
            <Textarea
              value={table.description}
              onChange={(e) => onUpdate(table.id, { description: e.target.value })}
              placeholder="Describe what data this table stores..."
              disabled={disabled}
              className={`theme-shadow min-h-[80px] ${!isDescriptionValid ? "border-destructive" : ""}`}
            />
            <p
              className={`text-xs ${isDescriptionValid ? "theme-text-muted-foreground" : "theme-text-destructive"} font-semibold`}
            >
              Minimum {MIN_TABLE_DESCRIPTION_LENGTH} characters
              {table.description.length > 0 &&
                ` (${table.description.trim().length}/${MIN_TABLE_DESCRIPTION_LENGTH})`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
