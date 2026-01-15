"use client";

import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
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
import { Ellipsis, Link2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  POSTGRES_TYPES,
  PrismaColumn,
  PrismaTable,
} from "./DatabaseConfiguration.types";

export const POSTGRES_TYPE_OPTIONS: (typeof POSTGRES_TYPES)[number][] = [
  "TEXT",
  "INTEGER",
  "BIGINT",
  "BOOLEAN",
  "TIMESTAMP WITH TIME ZONE",
  "JSONB",
  "DECIMAL",
  "DOUBLE PRECISION",
  "BYTEA",
];

export const ColumnLine = ({
  table,
  column,
  onUpdate,
  onDelete,
  columnType,
}: {
  table: PrismaTable;
  column: PrismaColumn;
  onUpdate: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
  onDelete: (tableId: string, columnId: string) => void;
  columnType: "name" | "attributes";
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(column.name);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tables, getAllEnums } = useDatabaseStore();
  const allEnums = getAllEnums();

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onUpdate(table.id, column.id, { name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
    if (e.key === "Escape") {
      setTempName(column.name);
      setIsEditingName(false);
    }
  };

  const isRelation = column.relation !== undefined;
  const relationTables = tables.filter((t) => t.id !== table.id);

  if (columnType === "name") {
    return (
      <div className="group flex items-center theme-gap-1 theme-px-1 hover:theme-bg-accent theme-radius">
        {isEditingName ? (
          <Input
            ref={inputRef}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="h-7 theme-px-2 text-base w-fit theme-shadow theme-font-mono"
          />
        ) : (
          <span
            className="text-base theme-font-mono theme-text-foreground cursor-pointer hover:underline whitespace-nowrap"
            onClick={() => setIsEditingName(true)}
          >
            {column.name}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-center theme-gap-1 theme-px-1 hover:theme-bg-accent theme-radius">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 theme-px-2 theme-gap-1 theme-font-mono text-sm whitespace-nowrap"
          >
            {isRelation && <Link2 className="h-3 w-3 theme-text-chart-2" />}
            <span className="theme-text-muted-foreground whitespace-nowrap">
              {column.type}
              {column.isArray ? "[]" : ""}
              {column.isOptional ? "?" : ""}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 theme-p-3 theme-shadow" align="start">
          <div className="flex flex-col theme-gap-3">
            <div>
              <label className="text-base font-semibold theme-text-muted-foreground theme-mb-1 block">
                Type
              </label>
              {isRelation ? (
                <Select
                  value={column.relation?.table || ""}
                  onValueChange={(tableRef) => {
                    const targetTable = relationTables.find(
                      (t) => `${t.schema}.${t.name}` === tableRef || t.name === tableRef
                    );
                    if (targetTable) {
                      const tableReference = targetTable.schema !== "public"
                        ? `${targetTable.schema}.${targetTable.name}`
                        : targetTable.name;
                      onUpdate(table.id, column.id, {
                        type: tableReference,
                        relation: {
                          table: tableReference,
                          field: "id",
                          onDelete: column.relation?.onDelete || "Cascade",
                        },
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationTables.map((t) => {
                      const tableRef = t.schema !== "public"
                        ? `${t.schema}.${t.name}`
                        : t.name;
                      return (
                        <SelectItem key={t.id} value={tableRef}>
                          {t.schema}.{t.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={column.type}
                  onValueChange={(type) =>
                    onUpdate(table.id, column.id, { type })
                  }
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSTGRES_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                    {allEnums.length > 0 && (
                      <>
                        <div className="theme-px-2 theme-py-1 text-sm theme-text-muted-foreground font-semibold">
                          Enums
                        </div>
                        {allEnums.map((enumItem) => (
                          <SelectItem key={enumItem.name} value={enumItem.name}>
                            {enumItem.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex items-center theme-gap-2">
              <Checkbox
                id={`${column.id}-optional`}
                checked={column.isOptional}
                onCheckedChange={(checked) =>
                  onUpdate(table.id, column.id, {
                    isOptional: checked === true,
                  })
                }
              />
              <label
                htmlFor={`${column.id}-optional`}
                className="text-base font-semibold theme-text-foreground cursor-pointer"
              >
                Optional (?)
              </label>
            </div>

            <div className="flex items-center theme-gap-2">
              <Checkbox
                id={`${column.id}-array`}
                checked={column.isArray}
                onCheckedChange={(checked) =>
                  onUpdate(table.id, column.id, { isArray: checked === true })
                }
              />
              <label
                htmlFor={`${column.id}-array`}
                className="text-base font-semibold theme-text-foreground cursor-pointer"
              >
                Array ([])
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {column.attributes.length > 0 && (
        <div className="flex items-center theme-gap-1 flex-wrap">
          {column.attributes.map((attr, i) => (
            <span
              key={i}
              className="text-sm theme-font-mono theme-text-muted-foreground whitespace-nowrap"
            >
              {attr}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center theme-gap-1">
        <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-60 hover:opacity-100"
            >
              <Ellipsis className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 theme-p-3 theme-shadow relative"
            align="start"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 theme-text-foreground"
              onClick={() => {
                onDelete(table.id, column.id);
                setDeleteConfirmOpen(false);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div className="flex flex-col theme-gap-3">
              <div>
                <label className="text-base font-semibold theme-text-muted-foreground theme-mb-1 block">
                  Attributes
                </label>
                <div className="flex flex-col theme-gap-2">
                  <div className="flex items-center theme-gap-2">
                    <Checkbox
                      id={`${column.id}-id`}
                      checked={column.isId}
                      onCheckedChange={(checked) =>
                        onUpdate(table.id, column.id, {
                          isId: checked === true,
                        })
                      }
                    />
                    <label
                      htmlFor={`${column.id}-id`}
                      className="text-base font-semibold theme-text-foreground cursor-pointer theme-font-mono"
                    >
                      @id
                    </label>
                  </div>

                  <div className="flex items-center theme-gap-2">
                    <Checkbox
                      id={`${column.id}-unique`}
                      checked={column.isUnique}
                      onCheckedChange={(checked) =>
                        onUpdate(table.id, column.id, {
                          isUnique: checked === true,
                        })
                      }
                    />
                    <label
                      htmlFor={`${column.id}-unique`}
                      className="text-base font-semibold theme-text-foreground cursor-pointer theme-font-mono"
                    >
                      @unique
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-base font-semibold theme-text-muted-foreground theme-mb-1 block">
                  Default Value
                </label>
                <Input
                  value={column.defaultValue || ""}
                  onChange={(e) =>
                    onUpdate(table.id, column.id, {
                      defaultValue: e.target.value || undefined,
                    })
                  }
                  placeholder="e.g., cuid(), now()"
                  className="h-7 text-xs theme-shadow theme-font-mono"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export const AddColumnPopover = ({
  table,
  onAddColumn,
}: {
  table: PrismaTable;
  onAddColumn: (tableId: string, column: Omit<PrismaColumn, "id">) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<
    (typeof POSTGRES_TYPES)[number] | "Relation"
  >("TEXT");
  const [relatedTable, setRelatedTable] = useState<string>("");
  const [relationType, setRelationType] =
    useState<import("./DatabaseConfiguration.types").RelationType>(
      "many-to-one"
    );
  const [createInverse, setCreateInverse] = useState(true);
  const [inverseFieldName, setInverseFieldName] = useState("");
  const { tables, getAllEnums } = useDatabaseStore();

  const availableTables = tables.filter((t) => t.id !== table.id);
  const allEnums = getAllEnums();
  const isRelationType = columnType === "Relation";

  const selectedRelatedTable = availableTables.find(
    (t) => `${t.schema}.${t.name}` === relatedTable || t.name === relatedTable
  );
  const isRelatedTableEditable = selectedRelatedTable?.isEditable ?? true;

  const pluralize = (word: string): string => {
    if (
      word.endsWith("y") &&
      !["a", "e", "i", "o", "u"].includes(word[word.length - 2])
    ) {
      return word.slice(0, -1) + "ies";
    }
    if (
      word.endsWith("s") ||
      word.endsWith("x") ||
      word.endsWith("z") ||
      word.endsWith("ch") ||
      word.endsWith("sh")
    ) {
      return word + "es";
    }
    return word + "s";
  };

  const handleAdd = () => {
    if (!columnName.trim()) return;
    if (isRelationType && !relatedTable) return;

    if (isRelationType) {
      const targetTable = availableTables.find(
        (t) => `${t.schema}.${t.name}` === relatedTable || t.name === relatedTable
      );
      if (!targetTable) return;

      const tableReference = targetTable.schema !== "public"
        ? `${targetTable.schema}.${targetTable.name}`
        : targetTable.name;

      onAddColumn(table.id, {
        name: columnName.trim(),
        type: tableReference,
        isDefault: false,
        isEditable: true,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
        relation: {
          table: tableReference,
          field: "id",
          onDelete: "Cascade",
          relationType,
          inverseFieldName: createInverse ? inverseFieldName : undefined,
        },
      });
    } else {
      onAddColumn(table.id, {
        name: columnName.trim(),
        type: columnType,
        isDefault: false,
        isEditable: true,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      });
    }

    setColumnName("");
    setColumnType("TEXT");
    setRelatedTable("");
    setRelationType("many-to-one");
    setCreateInverse(true);
    setInverseFieldName("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 theme-ml-4 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm"
        >
          <Plus className="h-3 w-3 theme-mr-1" />
          Add column...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 theme-p-3 theme-shadow" align="start">
        <div className="flex flex-col theme-gap-2">
          <Input
            placeholder="Column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isRelationType) handleAdd();
              if (e.key === "Escape") setOpen(false);
            }}
            className="h-7 theme-shadow"
          />
          <Select
            value={columnType}
            onValueChange={(v) => {
              setColumnType(v as typeof columnType);
              if (v === "Relation" && availableTables.length > 0) {
                const firstTable = availableTables[0];
                const tableRef = firstTable.schema !== "public"
                  ? `${firstTable.schema}.${firstTable.name}`
                  : firstTable.name;
                setRelatedTable(tableRef);
                setInverseFieldName(pluralize(table.name));
                if (!firstTable.isEditable) {
                  setCreateInverse(false);
                }
              }
            }}
          >
            <SelectTrigger className="h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSTGRES_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              {allEnums.length > 0 && (
                <>
                  <div className="theme-px-2 theme-py-1 text-sm theme-text-muted-foreground font-semibold">
                    Enums
                  </div>
                  {allEnums.map((enumItem) => (
                    <SelectItem key={enumItem.name} value={enumItem.name}>
                      {enumItem.name}
                    </SelectItem>
                  ))}
                </>
              )}
              <SelectItem value="Relation">Relation</SelectItem>
            </SelectContent>
          </Select>
          {isRelationType && (
            <>
              <Select
                value={relatedTable}
                onValueChange={(v) => {
                  setRelatedTable(v);
                  setInverseFieldName(pluralize(table.name));
                  const selectedTable = availableTables.find(
                    (t) => `${t.schema}.${t.name}` === v || t.name === v
                  );
                  if (selectedTable) {
                    if (!selectedTable.isEditable) {
                      setCreateInverse(false);
                    } else {
                      setCreateInverse(true);
                    }
                  }
                }}
              >
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((t) => {
                    const tableRef = t.schema !== "public"
                      ? `${t.schema}.${t.name}`
                      : t.name;
                    return (
                      <SelectItem key={t.id} value={tableRef}>
                        {t.schema}.{t.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Select
                value={relationType}
                onValueChange={(v) => setRelationType(v as typeof relationType)}
              >
                <SelectTrigger className="h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="many-to-one">Many-to-One</SelectItem>
                  <SelectItem value="one-to-many">One-to-Many</SelectItem>
                  <SelectItem value="one-to-one">One-to-One</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-col theme-gap-2 theme-p-2 theme-bg-muted theme-radius">
                <div className="flex items-center theme-gap-2">
                  <Checkbox
                    id="create-inverse"
                    checked={createInverse}
                    disabled={!isRelatedTableEditable}
                    onCheckedChange={(checked) =>
                      setCreateInverse(checked === true)
                    }
                  />
                  <label
                    htmlFor="create-inverse"
                    className={`text-base font-semibold ${isRelatedTableEditable ? "theme-text-foreground cursor-pointer" : "theme-text-muted-foreground cursor-not-allowed"}`}
                  >
                    Create inverse field on {relatedTable || "related table"}
                    {!isRelatedTableEditable && " (read-only table)"}
                  </label>
                </div>
                {createInverse && isRelatedTableEditable && (
                  <Input
                    placeholder="Inverse field name"
                    value={inverseFieldName}
                    onChange={(e) => setInverseFieldName(e.target.value)}
                    className="h-7 theme-shadow text-xs"
                  />
                )}
              </div>
            </>
          )}
          <Button
            onClick={handleAdd}
            size="sm"
            disabled={
              isRelationType &&
              (!relatedTable || (createInverse && isRelatedTableEditable && !inverseFieldName.trim()))
            }
          >
            Add Column
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
