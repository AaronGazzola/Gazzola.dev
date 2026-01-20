"use client";

import { Button } from "@/components/editor/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/editor/ui/collapsible";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Lock, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DatabaseTable } from "./DatabaseConfiguration.types";
import { TableCollapsible } from "./DatabaseConfiguration.tables";

export const SchemaCollapsible = ({
  schema,
  tables,
  isExpanded,
  onToggle,
  expandedTableId,
  onTableToggle,
  onAddTable,
  onUpdateTableName,
  onDeleteTable,
  onUpdateSchemaName,
  onDeleteSchema,
  isEditable,
  isSystemSchema,
}: {
  schema: string;
  tables: DatabaseTable[];
  isExpanded: boolean;
  onToggle: () => void;
  expandedTableId: string | null;
  onTableToggle: (tableId: string) => void;
  onAddTable: (tableName: string) => void;
  onUpdateTableName: (tableId: string, name: string) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateSchemaName: (name: string) => void;
  onDeleteSchema: () => void;
  isEditable: boolean;
  isSystemSchema: boolean;
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(schema);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const newTableInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isAddingTable && newTableInputRef.current) {
      newTableInputRef.current.focus();
    }
  }, [isAddingTable]);

  const handleNameSubmit = () => {
    if (tempName.trim() && tempName !== schema) {
      onUpdateSchemaName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleAddTable = () => {
    if (newTableName.trim()) {
      onAddTable(newTableName.trim());
      setNewTableName("");
    }
    setIsAddingTable(false);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div
        className="theme-bg-muted theme-radius theme-p-2 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center theme-gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {isSystemSchema && <Lock className="h-4 w-4 theme-text-muted-foreground shrink-0" />}
          {isEditingName ? (
            <Input
              ref={inputRef}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setTempName(schema);
                  setIsEditingName(false);
                }
              }}
              className="h-7 theme-px-2 text-base theme-shadow theme-font-mono flex-1"
            />
          ) : (
            <>
              <span
                className={cn(
                  "text-base font-semibold theme-font-mono theme-text-foreground",
                  isEditable && "cursor-pointer hover:underline"
                )}
                onClick={(e) => {
                  if (isEditable) {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }
                }}
              >
                {schema}
              </span>
              <span className="flex-1" />
            </>
          )}
          <span className="text-sm theme-text-muted-foreground">
            {tables.length} {tables.length === 1 ? "table" : "tables"}
          </span>
          {isEditable && (
            <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
                <div className="flex flex-col theme-gap-2">
                  <p className="text-lg font-semibold theme-text-foreground">
                    Delete schema &quot;{schema}&quot; and all its tables?
                  </p>
                  <div className="flex theme-gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onDeleteSchema();
                        setDeleteConfirmOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col theme-gap-2 theme-ml-4 theme-mt-2">
          {isSystemSchema && tables.length === 0 && (
            <div className="flex items-center theme-gap-2 theme-text-muted-foreground theme-p-4">
              <Lock className="h-4 w-4" />
              <p className="text-base font-semibold theme-font-sans theme-tracking">
                This schema is managed automatically.
              </p>
            </div>
          )}
          {tables.map((table) => (
            <TableCollapsible
              key={table.id}
              table={table}
              schema={schema}
              isExpanded={expandedTableId === table.id}
              onToggle={() => onTableToggle(table.id)}
              onUpdateName={(name) => onUpdateTableName(table.id, name)}
              onDelete={() => onDeleteTable(table.id)}
            />
          ))}
          {isAddingTable && (
            <div className="theme-bg-background theme-radius theme-p-2 border theme-border-border">
              <Input
                ref={newTableInputRef}
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                onBlur={handleAddTable}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTable();
                  if (e.key === "Escape") {
                    setIsAddingTable(false);
                    setNewTableName("");
                  }
                }}
                placeholder="Table name"
                className="h-7 theme-px-2 text-base theme-shadow theme-font-mono"
              />
            </div>
          )}
          {!isSystemSchema && !isAddingTable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingTable(true)}
              className="h-7 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm w-fit"
            >
              <Plus className="h-3 w-3" />
              Add table
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
