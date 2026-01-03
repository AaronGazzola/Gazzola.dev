import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { DatabaseTableDescription } from "../DatabaseConfiguration.tables.stores";

interface DatabaseTableDescriptionItemProps {
  table: DatabaseTableDescription;
  index: number;
  totalTables: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Partial<DatabaseTableDescription>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const MIN_TABLE_NAME_LENGTH = 2;
const MIN_TABLE_DESCRIPTION_LENGTH = 20;

export const DatabaseTableDescriptionItem = ({
  table,
  index,
  totalTables,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  disabled = false,
}: DatabaseTableDescriptionItemProps) => {
  const isNameValid =
    table.name.trim().length >= MIN_TABLE_NAME_LENGTH || !table.name.trim();
  const isDescriptionValid =
    table.description.trim().length >= MIN_TABLE_DESCRIPTION_LENGTH ||
    !table.description.trim();

  return (
    <div className="border theme-border-accent theme-radius theme-bg-background">
      <div className="flex items-center justify-between theme-p-2">
        <button
          onClick={onToggle}
          disabled={disabled}
          className="flex-1 flex items-center theme-gap-2 hover:theme-bg-muted/50 theme-radius transition-colors disabled:opacity-50"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 theme-text-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 theme-text-foreground" />
          )}
          <span className="font-semibold theme-text-foreground">
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
        <div className="flex flex-col theme-gap-3 theme-p-3 theme-pt-1">
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
              onChange={(e) =>
                onUpdate(table.id, { description: e.target.value })
              }
              placeholder="Describe what data this table stores..."
              disabled={disabled}
              className={`theme-shadow min-h-[80px] ${!isDescriptionValid ? "border-destructive" : ""}`}
            />
            <p
              className={`text-xs ${
                isDescriptionValid
                  ? "theme-text-muted-foreground"
                  : "theme-text-destructive"
              } font-semibold`}
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
