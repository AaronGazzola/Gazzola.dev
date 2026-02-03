"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/editor/ui/tabs";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Lock, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddColumnPopover, ColumnLine } from "./DatabaseConfiguration.columns";
import { TableRLSContent } from "./DatabaseConfiguration.rls";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type { DatabaseTable } from "./DatabaseConfiguration.types";

export const TableColumnsContent = ({ table }: { table: DatabaseTable }) => {
  const { addColumn, deleteColumn, updateColumn } = useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const isSupabaseAuth = table.schema === "auth";

  if (isSupabaseAuth) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-base font-semibold theme-font theme-tracking">
            The {table.schema} schema is managed by Supabase and cannot be
            edited directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col theme-gap-2">
      <div className="flex flex-col theme-p-2 theme-gap-2">
        {table.columns.map((column) => (
          <div
            key={column.id}
            className="w-full theme-bg-muted theme-radius theme-p-2 overflow-x-auto"
          >
            <div className="flex items-center min-w-fit">
              <div className="flex-grow-0 flex-shrink-0">
                <ColumnLine
                  table={table}
                  column={column}
                  onUpdate={updateColumn}
                  onDelete={deleteColumn}
                  viewMode="name"
                />
              </div>
              <div className="flex-grow flex-shrink-0">
                <ColumnLine
                  table={table}
                  column={column}
                  onUpdate={updateColumn}
                  onDelete={deleteColumn}
                  viewMode="full"
                />
              </div>
            </div>
          </div>
        ))}
        <AddColumnPopover table={table} onAddColumn={addColumn} />
      </div>
    </div>
  );
};

export const TableCollapsible = ({
  table,
  schema,
  isExpanded,
  onToggle,
  onUpdateName,
  onDelete,
}: {
  table: DatabaseTable;
  schema: string;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(table.name);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (tempName.trim() && tempName !== table.name) {
      onUpdateName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const isSystemSchema = schema === "auth" || schema === "better_auth";

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div
        className={cn(
          isExpanded && "border theme-border-chart-3 theme-radius theme-p-1"
        )}
      >
        <div
          className="theme-bg-background theme-radius theme-p-2 border theme-border-border cursor-pointer"
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
                    setTempName(table.name);
                    setIsEditingName(false);
                  }
                }}
                className="h-7 theme-px-2 text-base theme-shadow theme-font-mono flex-1"
              />
            ) : (
              <>
                <span
                  className={cn(
                    "text-base theme-font-mono theme-text-foreground",
                    table.isEditable &&
                      !isSystemSchema &&
                      "cursor-pointer hover:underline"
                  )}
                  onClick={(e) => {
                    if (table.isEditable && !isSystemSchema) {
                      e.stopPropagation();
                      setIsEditingName(true);
                    }
                  }}
                >
                  {table.name}
                </span>
                <span className="flex-1" />
              </>
            )}
            {table.isEditable && !isSystemSchema && (
              <Popover
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
              >
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
                <PopoverContent
                  className="w-64 theme-p-3 theme-shadow"
                  align="end"
                >
                  <div className="flex flex-col theme-gap-2">
                    <p className="text-lg font-semibold theme-text-foreground">
                      Delete table &quot;{table.name}&quot;?
                    </p>
                    <div className="flex theme-gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          onDelete();
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
          <div className="theme-mt-1 theme-p-2 theme-bg-background theme-radius">
            <Tabs defaultValue="columns" className="w-full">
              <TabsList className="w-full theme-p-1 h-auto">
                <div className="flex flex-1 theme-gap-1">
                  <TabsTrigger
                    value="columns"
                    className="flex-1 text-base font-semibold"
                  >
                    Columns
                  </TabsTrigger>
                  <TabsTrigger
                    value="rls"
                    className="flex-1 text-base font-semibold"
                  >
                    RLS
                  </TabsTrigger>
                </div>
              </TabsList>
              <TabsContent value="columns" className="theme-mt-0">
                <TableColumnsContent table={table} />
              </TabsContent>
              <TabsContent value="rls" className="theme-mt-0">
                <TableRLSContent table={table} />
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
