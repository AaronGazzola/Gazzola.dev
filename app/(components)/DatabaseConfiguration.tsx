"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/editor/ui/tabs";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Database, Ellipsis, Link2, Lock, Plus, Trash2, Shield, Users, Building2, Mail, KeyRound, Smartphone, ShieldCheck, Fingerprint, UserX, Chrome, Github, Apple } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiSupabase, SiPrisma, SiPostgresql, SiGoogle } from "react-icons/si";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/editor/ui/collapsible";
import { Badge } from "@/components/editor/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  PRISMA_TYPES,
  PrismaColumn,
  PrismaTable,
} from "./DatabaseConfiguration.types";
import { DATABASE_TEMPLATES } from "./DatabaseConfiguration.types";

const BetterAuthIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="69" y="121" width="86.9879" height="259" fill="currentColor" />
    <rect
      x="337.575"
      y="121"
      width="92.4247"
      height="259"
      fill="currentColor"
    />
    <rect
      x="427.282"
      y="121"
      width="83.4555"
      height="174.52"
      transform="rotate(90 427.282 121)"
      fill="currentColor"
    />
    <rect
      x="430"
      y="296.544"
      width="83.4555"
      height="177.238"
      transform="rotate(90 430 296.544)"
      fill="currentColor"
    />
    <rect
      x="252.762"
      y="204.455"
      width="92.0888"
      height="96.7741"
      transform="rotate(90 252.762 204.455)"
      fill="currentColor"
    />
  </svg>
);

const NeonDBIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.82l7 3.5v7.36l-7-3.5V9.82zm16 0v7.36l-7 3.5v-7.36l7-3.5z" />
  </svg>
);

interface Technology {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const technologies: Technology[] = [
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "neondb", name: "NeonDB", icon: NeonDBIcon },
  { id: "betterAuth", name: "Better Auth", icon: BetterAuthIcon },
  { id: "prisma", name: "Prisma", icon: SiPrisma },
  { id: "postgresql", name: "PostgreSQL", icon: SiPostgresql },
];

const PRISMA_TYPE_OPTIONS: (typeof PRISMA_TYPES)[number][] = [
  "String",
  "Int",
  "Float",
  "Boolean",
  "DateTime",
  "Json",
  "BigInt",
  "Decimal",
  "Bytes",
];

const ColumnLine = ({
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
  const { tables, getEnumsBySchema } = useDatabaseStore();
  const schemaEnums = getEnumsBySchema(table.schema);

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
            className="h-7 theme-px-2 text-sm w-fit theme-shadow theme-font-mono"
          />
        ) : (
          <span
            className="text-sm theme-font-mono theme-text-foreground cursor-pointer hover:underline whitespace-nowrap"
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
            className="h-7 theme-px-2 theme-gap-1 theme-font-mono text-xs whitespace-nowrap"
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
              <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                Type
              </label>
              {isRelation ? (
                <Select
                  value={column.relation?.table || ""}
                  onValueChange={(tableName) => {
                    const targetTable = relationTables.find(
                      (t) => t.name === tableName
                    );
                    if (targetTable) {
                      onUpdate(table.id, column.id, {
                        type: targetTable.name,
                        relation: {
                          table: targetTable.name,
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
                    {relationTables.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.schema}.{t.name}
                      </SelectItem>
                    ))}
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
                    {PRISMA_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                    {schemaEnums.length > 0 && (
                      <>
                        <div className="theme-px-2 theme-py-1 text-xs theme-text-muted-foreground font-semibold">
                          Enums
                        </div>
                        {schemaEnums.map((enumItem) => (
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
                className="text-xs theme-text-foreground cursor-pointer"
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
                className="text-xs theme-text-foreground cursor-pointer"
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
              className="text-xs theme-font-mono theme-text-muted-foreground whitespace-nowrap"
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
                <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
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
                      className="text-xs theme-text-foreground cursor-pointer theme-font-mono"
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
                      className="text-xs theme-text-foreground cursor-pointer theme-font-mono"
                    >
                      @unique
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
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

const EditableSelect = ({
  value,
  options,
  onValueChange,
  onNameChange,
  onDelete,
  placeholder,
  isEditable = true,
  showDelete = false,
  className,
}: {
  value: string;
  options: {
    value: string;
    label: string | React.ReactNode;
    disabled?: boolean;
  }[];
  onValueChange: (value: string) => void;
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
  placeholder?: string;
  isEditable?: boolean;
  showDelete?: boolean;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempName(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameSubmit = () => {
    if (tempName.trim() && onNameChange) {
      onNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
    if (e.key === "Escape") {
      setTempName(value);
      setIsEditing(false);
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={handleKeyDown}
          className="h-9 theme-px-2 text-sm theme-shadow theme-font-mono"
        />
      ) : (
        <div className="flex items-center theme-gap-1">
          <div className="flex items-center border theme-border-border rounded overflow-hidden theme-bg-background">
            <span
              className="text-sm theme-font-mono theme-text-foreground cursor-pointer hover:underline theme-px-2 theme-py-1.5"
              onClick={() => isEditable && setIsEditing(true)}
            >
              {selectedOption?.label || value || placeholder}
            </span>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none border-l theme-border-border"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 theme-p-2 theme-shadow"
                align="start"
              >
                <div className="flex flex-col theme-gap-1">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      size="sm"
                      disabled={option.disabled}
                      className="justify-start text-sm"
                      onClick={() => {
                        onValueChange(option.value);
                        setIsOpen(false);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {showDelete && onDelete && (
            <Popover
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 theme-p-3 theme-shadow"
                align="end"
              >
                <div className="flex flex-col theme-gap-2">
                  <p className="text-sm theme-text-foreground">
                    {placeholder?.includes("schema")
                      ? `Delete schema "${value}" and all its tables?`
                      : `Delete table "${selectedOption?.label || value}"?`}
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
      )}
    </div>
  );
};

const AddColumnPopover = ({
  table,
  onAddColumn,
}: {
  table: PrismaTable;
  onAddColumn: (tableId: string, column: Omit<PrismaColumn, "id">) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] =
    useState<(typeof PRISMA_TYPES)[number] | "Relation">("String");
  const [relatedTable, setRelatedTable] = useState<string>("");
  const [relationType, setRelationType] = useState<import("./DatabaseConfiguration.types").RelationType>("many-to-one");
  const [createInverse, setCreateInverse] = useState(true);
  const [inverseFieldName, setInverseFieldName] = useState("");
  const { tables, getEnumsBySchema } = useDatabaseStore();

  const availableTables = tables.filter((t) => t.id !== table.id);
  const schemaEnums = getEnumsBySchema(table.schema);
  const isRelationType = columnType === "Relation";

  const pluralize = (word: string): string => {
    if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2])) {
      return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
      return word + 'es';
    }
    return word + 's';
  };

  const handleAdd = () => {
    if (!columnName.trim()) return;
    if (isRelationType && !relatedTable) return;

    if (isRelationType) {
      const targetTable = availableTables.find((t) => t.name === relatedTable);
      if (!targetTable) return;

      onAddColumn(table.id, {
        name: columnName.trim(),
        type: targetTable.name,
        isDefault: false,
        isEditable: true,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
        relation: {
          table: targetTable.name,
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
    setColumnType("String");
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
          className="h-5 theme-ml-4 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-xs"
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
                setRelatedTable(availableTables[0].name);
                setInverseFieldName(pluralize(table.name));
              }
            }}
          >
            <SelectTrigger className="h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRISMA_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              {schemaEnums.length > 0 && (
                <>
                  <div className="theme-px-2 theme-py-1 text-xs theme-text-muted-foreground font-semibold">
                    Enums
                  </div>
                  {schemaEnums.map((enumItem) => (
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
                }}
              >
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.schema}.{t.name}
                    </SelectItem>
                  ))}
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
                    onCheckedChange={(checked) => setCreateInverse(checked === true)}
                  />
                  <label htmlFor="create-inverse" className="text-xs theme-text-foreground cursor-pointer">
                    Create inverse field on {relatedTable || "related table"}
                  </label>
                </div>
                {createInverse && (
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
          <Button onClick={handleAdd} size="sm" disabled={isRelationType && (!relatedTable || (createInverse && !inverseFieldName.trim()))}>
            Add Column
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};


const TableColumnsContent = ({ table }: { table: PrismaTable }) => {
  const { addColumn, deleteColumn, updateColumn } = useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const isSupabaseAuth = table.schema === "auth" && !initialConfiguration.technologies.betterAuth;
  const isBetterAuth = table.schema === "better_auth";

  if (isSupabaseAuth) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-sm theme-font-sans theme-tracking">
            The {table.schema} schema is managed by Supabase and cannot be edited directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col theme-gap-2">
      {isBetterAuth && (
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground theme-p-4 theme-bg-muted/50">
          <Lock className="h-6 w-6" />
          <p className="text-sm theme-font-sans theme-tracking">
            The better_auth schema is managed by Better Auth and cannot be edited directly.
          </p>
        </div>
      )}
      <div className={cn("flex flex-col theme-p-2 theme-gap-2", isBetterAuth && "opacity-60 pointer-events-none")}>
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
                  columnType="name"
                />
              </div>
              <div className="flex-grow flex-shrink-0">
                <ColumnLine
                  table={table}
                  column={column}
                  onUpdate={updateColumn}
                  onDelete={deleteColumn}
                  columnType="attributes"
                />
              </div>
            </div>
          </div>
        ))}
        {!isBetterAuth && <AddColumnPopover table={table} onAddColumn={addColumn} />}
      </div>
    </div>
  );
};

const EnumsContent = ({ schema }: { schema: string }) => {
  const { addEnum, deleteEnum, updateEnumName, addEnumValue, deleteEnumValue, updateEnumValue, getEnumsBySchema } = useDatabaseStore();
  const enums = getEnumsBySchema(schema);
  const [isAddingEnum, setIsAddingEnum] = useState(false);
  const [newEnumName, setNewEnumName] = useState("");

  const handleAddEnum = () => {
    if (newEnumName.trim()) {
      addEnum(newEnumName.trim(), schema);
      setNewEnumName("");
    }
    setIsAddingEnum(false);
  };

  return (
    <div className="flex flex-col theme-gap-2 theme-p-4">
      {enums.length === 0 && !isAddingEnum ? (
        <div className="flex flex-col items-center theme-gap-4 theme-text-muted-foreground theme-py-8">
          <p className="text-sm theme-font-sans theme-tracking">No enums defined for this schema</p>
        </div>
      ) : (
        <div className="flex flex-col theme-gap-2">
          {enums.map((enumItem) => (
            <EnumItem key={enumItem.id} enumItem={enumItem} />
          ))}
        </div>
      )}
      {isAddingEnum ? (
        <Input
          autoFocus
          value={newEnumName}
          onChange={(e) => setNewEnumName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddEnum();
            if (e.key === "Escape") {
              setIsAddingEnum(false);
              setNewEnumName("");
            }
          }}
          onBlur={handleAddEnum}
          placeholder="Enum name"
          className="h-7 theme-px-2 text-xs theme-shadow theme-font-mono"
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingEnum(true)}
          className="h-7 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-xs w-fit"
        >
          <Plus className="h-3 w-3" />
          Add enum
        </Button>
      )}
    </div>
  );
};

const EnumItem = ({ enumItem }: { enumItem: import("./DatabaseConfiguration.types").PrismaEnum }) => {
  const { deleteEnum, updateEnumName, addEnumValue, deleteEnumValue, updateEnumValue } = useDatabaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(enumItem.name);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      updateEnumName(enumItem.id, tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      addEnumValue(enumItem.id, newValue.trim());
      setNewValue("");
    }
    setIsAddingValue(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="theme-bg-muted theme-radius theme-p-2">
        <div className="flex items-center theme-gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          {isEditingName ? (
            <Input
              ref={nameInputRef}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setTempName(enumItem.name);
                  setIsEditingName(false);
                }
              }}
              className="h-7 theme-px-2 text-sm w-fit theme-shadow theme-font-mono flex-1"
            />
          ) : (
            <span
              className="text-sm theme-font-mono theme-text-foreground cursor-pointer hover:underline flex-1"
              onClick={() => setIsEditingName(true)}
            >
              {enumItem.name}
            </span>
          )}
          <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Trash2 className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
              <div className="flex flex-col theme-gap-2">
                <p className="text-sm theme-text-foreground">
                  Delete enum &quot;{enumItem.name}&quot;?
                </p>
                <div className="flex theme-gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteEnum(enumItem.id);
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
        </div>
        <CollapsibleContent>
          <div className="flex flex-col theme-gap-1 theme-mt-2 theme-ml-8">
            {enumItem.values.map((value) => (
              <EnumValueItem
                key={value.id}
                enumId={enumItem.id}
                value={value}
              />
            ))}
            {isAddingValue ? (
              <Input
                autoFocus
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddValue();
                  if (e.key === "Escape") {
                    setIsAddingValue(false);
                    setNewValue("");
                  }
                }}
                onBlur={handleAddValue}
                placeholder="Value"
                className="h-7 theme-px-2 text-xs theme-shadow theme-font-mono"
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingValue(true)}
                className="h-6 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-xs w-fit"
              >
                <Plus className="h-3 w-3" />
                Add value
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const EnumValueItem = ({
  enumId,
  value
}: {
  enumId: string;
  value: import("./DatabaseConfiguration.types").PrismaEnumValue;
}) => {
  const { deleteEnumValue, updateEnumValue } = useDatabaseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.value);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (tempValue.trim()) {
      updateEnumValue(enumId, value.id, tempValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center theme-gap-2 theme-bg-background theme-radius theme-px-2 theme-py-1">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") {
              setTempValue(value.value);
              setIsEditing(false);
            }
          }}
          className="h-6 theme-px-2 text-xs theme-shadow theme-font-mono flex-1"
        />
      ) : (
        <span
          className="text-xs theme-font-mono theme-text-foreground cursor-pointer hover:underline flex-1"
          onClick={() => setIsEditing(true)}
        >
          {value.value}
        </span>
      )}
      <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Trash2 className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
          <div className="flex flex-col theme-gap-2">
            <p className="text-sm theme-text-foreground">
              Delete value &quot;{value.value}&quot;?
            </p>
            <div className="flex theme-gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteEnumValue(enumId, value.id);
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
    </div>
  );
};

const TableRLSContent = ({ table }: { table: PrismaTable }) => {
  const { addOrUpdateRLSPolicy, getRLSPolicyForOperation, tables } =
    useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const authProvider =
    !initialConfiguration.technologies.betterAuth
      ? "Supabase"
      : "Better Auth";
  const isAuthSchema = table.schema === "auth" || table.schema === "better_auth";

  const enabledRoles: import("./DatabaseConfiguration.types").UserRole[] = ["user"];
  if (initialConfiguration.features.admin.admin) enabledRoles.push("admin");
  if (initialConfiguration.features.admin.superAdmin)
    enabledRoles.push("super-admin");
  if (initialConfiguration.features.admin.organizations) {
    enabledRoles.push("org-admin", "org-member");
  }

  const operations: import("./DatabaseConfiguration.types").RLSPolicy["operation"][] =
    ["INSERT", "SELECT", "UPDATE", "DELETE"];

  const availableTables = tables.filter((t) => t.id !== table.id);

  if (isAuthSchema) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-sm theme-font-sans theme-tracking">
            All auth schema security is handled by {authProvider}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-stretch theme-gap-3 theme-p-4">
      {operations.map((operation) => {
        const policy = getRLSPolicyForOperation(table.id, operation);

        return (
          <div
            key={operation}
            className="theme-bg-muted theme-radius theme-p-3"
          >
            <h4 className="text-sm font-semibold theme-text-foreground theme-mb-2 theme-font-sans theme-tracking">
              {operation}
            </h4>
            <div className="flex flex-col items-stretch theme-gap-2">
              {enabledRoles.map((role) => {
                const rolePolicy = policy?.rolePolicies?.find(
                  (rp) => rp.role === role
                );
                const accessType = rolePolicy?.accessType || "global";
                const relatedTable = rolePolicy?.relatedTable;

                return (
                  <div key={role} className="flex flex-col theme-gap-2">
                    <div className="flex items-center theme-gap-2">
                      <span className="text-xs theme-text-foreground theme-font-mono min-w-[6rem]">
                        {role}
                      </span>
                      <Select
                        value={accessType}
                        onValueChange={(value) => {
                          if (
                            value === "global" ||
                            value === "own" ||
                            value === "organization"
                          ) {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              value as import("./DatabaseConfiguration.types").RLSAccessType
                            );
                          } else if (value === "related") {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              "related",
                              availableTables[0]?.name
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="own">Own data</SelectItem>
                          {initialConfiguration.features.admin
                            .organizations && (
                            <SelectItem value="organization">
                              Organization
                            </SelectItem>
                          )}
                          <SelectItem value="related">Related</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {accessType === "related" && (
                      <div className="flex items-center theme-gap-2">
                        <span className="text-xs theme-text-muted-foreground theme-font-mono min-w-[6rem]">
                          Related to:
                        </span>
                        <Select
                          value={relatedTable || ""}
                          onValueChange={(tableName) => {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              "related",
                              tableName
                            );
                          }}
                        >
                          <SelectTrigger className="h-7 text-xs flex-1">
                            <SelectValue placeholder="Select table" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTables.map((t) => (
                              <SelectItem key={t.id} value={t.name}>
                                {t.schema}.{t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DatabaseConfiguration = () => {
  const {
    tables,
    initializeFromConfig,
    addTable,
    updateTableName,
    updateTableSchema,
    deleteTable,
    deleteSchema,
    getAvailableSchemas,
    getAvailableSchemasWithConfig,
    applyTemplate,
  } = useDatabaseStore();
  const {
    initialConfiguration,
    setSectionInclude,
    updateInitialConfiguration,
    updateAdminOption,
    updateAuthenticationOption,
  } = useEditorStore();
  const [selectedSchema, setSelectedSchema] = useState<string>("public");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAddingSchema, setIsAddingSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    initializeFromConfig(initialConfiguration);
  }, [
    initialConfiguration.technologies.betterAuth,
    initialConfiguration.features.authentication.enabled,
    initialConfiguration.features.admin.admin,
    initialConfiguration.features.admin.superAdmin,
    initialConfiguration.features.admin.organizations,
    initialConfiguration.questions.databaseProvider,
    initializeFromConfig,
    initialConfiguration,
  ]);

  useEffect(() => {
    applyAutomaticSectionFiltering(initialConfiguration, setSectionInclude);
  }, [initialConfiguration, setSectionInclude]);

  const isNoDatabaseSelected =
    initialConfiguration.questions.databaseProvider === "none";

  const filteredTables = tables.filter((t) => t.schema === selectedSchema);
  const isSupabaseAuthSchema = selectedSchema === "auth" && initialConfiguration.technologies.supabase && !initialConfiguration.technologies.betterAuth;
  const isBetterAuthSchema = selectedSchema === "better_auth" && initialConfiguration.technologies.betterAuth;

  const selectedTable = selectedTableId
    ? tables.find((t) => t.id === selectedTableId)
    : null;

  const handleAddTable = (tableName?: string) => {
    if (!tableName) {
      setIsAddingTable(true);
      return;
    }

    if (!tableName.trim()) return;

    const newTableId = addTable(tableName.trim(), selectedSchema);
    setSelectedTableId(newTableId);
    setIsAddingTable(false);
    setNewTableName("");
  };

  const handleAddSchema = (schemaName: string) => {
    if (!schemaName.trim()) return;
    const trimmedName = schemaName.trim();
    const newTableId = addTable("new-table", trimmedName);
    setSelectedSchema(trimmedName);
    setSelectedTableId(newTableId);
  };

  useEffect(() => {
    if (filteredTables.length > 0 && !selectedTableId) {
      setSelectedTableId(filteredTables[0].id);
    } else if (
      filteredTables.length > 0 &&
      selectedTableId &&
      !filteredTables.find((t) => t.id === selectedTableId)
    ) {
      setSelectedTableId(filteredTables[0].id);
    }
  }, [filteredTables, selectedTableId]);

  if (!mounted) {
    return null;
  }

  const authMethods = [
    { id: "magicLink", label: "Magic Link", description: "Passwordless authentication via email links", icon: Mail },
    { id: "emailPassword", label: "Email & Password", description: "Traditional email and password authentication", icon: Mail },
    { id: "otp", label: "OTP (One-Time Password)", description: "Email-based one-time password authentication", icon: Smartphone },
    { id: "twoFactor", label: "Two-Factor Authentication (2FA)", description: "TOTP/OTP two-factor authentication for enhanced security", icon: ShieldCheck },
    { id: "passkey", label: "Passkey (WebAuthn)", description: "Passwordless authentication using biometrics or security keys", icon: Fingerprint },
    { id: "anonymous", label: "Anonymous Sessions", description: "Allow users to use the app without authentication", icon: UserX },
    { id: "googleAuth", label: "Google OAuth", description: "Sign in with Google accounts", icon: SiGoogle },
    { id: "githubAuth", label: "GitHub OAuth", description: "Sign in with GitHub accounts", icon: Github },
    { id: "appleAuth", label: "Apple Sign In", description: "Sign in with Apple ID", icon: Apple },
    { id: "passwordOnly", label: "Password only", description: "Basic password authentication", icon: KeyRound },
  ];

  const roleOptions = [
    { id: "admin", label: "Admin", icon: Shield },
    { id: "superAdmin", label: "Super Admin", icon: Users },
    { id: "organizations", label: "Organizations", disabled: !initialConfiguration.technologies.betterAuth, icon: Building2 },
  ];

  const roleDescriptions = {
    admin: "Regular admin users with elevated permissions",
    superAdmin: "Super admins have full access and can manage all users and content",
    organizations: "Enable organization-based access with org-admin and org-member roles",
  };

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-4">
        <div>
          <h4 className="font-semibold theme-mb-2">
            Do you need a database?
          </h4>
          <p className="text-sm theme-text-muted-foreground theme-mb-3 font-semibold">
            Choose your database and authentication provider.
          </p>
          <div className="flex flex-col xs:flex-row theme-gap-3">
            <div
              onClick={() => {
                const currentSupabase = initialConfiguration.technologies.supabase;
                const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};

                techUpdates.supabase = !currentSupabase;
                techUpdates.prisma = !currentSupabase || initialConfiguration.technologies.betterAuth;
                techUpdates.postgresql = !currentSupabase || initialConfiguration.technologies.betterAuth;

                if (!currentSupabase && !initialConfiguration.technologies.betterAuth) {
                  techUpdates.neondb = false;
                }

                const newProvider = !currentSupabase
                  ? (initialConfiguration.technologies.betterAuth ? "both" : "supabase")
                  : (initialConfiguration.technologies.betterAuth ? "neondb" : "none");

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: !currentSupabase ? "supabase" : (initialConfiguration.technologies.betterAuth ? "neondb" : "postgresql"),
                  },
                  technologies: {
                    ...initialConfiguration.technologies,
                    ...techUpdates,
                  },
                });
              }}
              className={cn(
                "theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-4 cursor-pointer transition-all hover:theme-bg-accent flex-1 relative",
                initialConfiguration.technologies.supabase && "border-white"
              )}
            >
              <Checkbox
                checked={initialConfiguration.technologies.supabase}
                className="size-6 border-2 border-white/30 dark:border-black/30 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none absolute top-2 right-2"
              />
              <div className="flex flex-col items-center theme-gap-2 text-center">
                <SiSupabase className="w-12 h-12 theme-text-foreground" />
                <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking">Supabase</h4>
              </div>
            </div>

            <div
              onClick={() => {
                const currentBetterAuth = initialConfiguration.technologies.betterAuth;
                const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};

                techUpdates.betterAuth = !currentBetterAuth;
                techUpdates.neondb = !currentBetterAuth && !initialConfiguration.technologies.supabase;
                techUpdates.prisma = !currentBetterAuth || initialConfiguration.technologies.supabase;
                techUpdates.postgresql = !currentBetterAuth || initialConfiguration.technologies.supabase;

                const newProvider = !currentBetterAuth
                  ? (initialConfiguration.technologies.supabase ? "both" : "neondb")
                  : (initialConfiguration.technologies.supabase ? "supabase" : "none");

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: !currentBetterAuth
                      ? (initialConfiguration.technologies.supabase ? "supabase" : "neondb")
                      : (initialConfiguration.technologies.supabase ? "supabase" : "postgresql"),
                  },
                  technologies: {
                    ...initialConfiguration.technologies,
                    ...techUpdates,
                  },
                });
              }}
              className={cn(
                "theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-4 cursor-pointer transition-all hover:theme-bg-accent flex-1 relative",
                initialConfiguration.technologies.betterAuth && "border-white"
              )}
            >
              <Checkbox
                checked={initialConfiguration.technologies.betterAuth}
                className="size-6 border-2 border-white/30 dark:border-black/30 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none absolute top-2 right-2"
              />
              <div className="flex flex-col items-center theme-gap-2 text-center">
                <BetterAuthIcon className="w-12 h-12 theme-text-foreground" />
                <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking">Better Auth</h4>
              </div>
            </div>
          </div>

          {initialConfiguration.questions.databaseProvider !== "none" && (
            <div className="flex flex-col theme-gap-3 theme-mt-4">
              <div className="flex flex-wrap theme-gap-1">
                {(() => {
                  let techIds: string[] = [];
                  if (initialConfiguration.questions.databaseProvider === "supabase") {
                    techIds = ["supabase", "prisma", "postgresql"];
                  } else if (initialConfiguration.questions.databaseProvider === "neondb") {
                    techIds = ["neondb", "betterAuth", "prisma", "postgresql"];
                  } else if (initialConfiguration.questions.databaseProvider === "both") {
                    techIds = ["supabase", "betterAuth", "prisma", "postgresql"];
                  }
                  return techIds.map((techId) => {
                    const tech = technologies.find((t) => t.id === techId);
                    if (!tech) return null;
                    const Icon = tech.icon;
                    const isActive = initialConfiguration.technologies[techId as keyof InitialConfigurationType["technologies"]];
                    return (
                      <div
                        key={techId}
                        className={cn(
                          "theme-radius theme-shadow flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 text-xs font-medium border theme-font-sans theme-tracking",
                          isActive
                            ? "theme-bg-primary theme-text-primary-foreground theme-border-primary"
                            : "theme-bg-secondary theme-text-secondary-foreground theme-border-border"
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tech.name}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                {initialConfiguration.questions.databaseProvider === "supabase" &&
                  "Supabase for all backend logic and database functionality. Excellent for enterprise audit compliance"}
                {initialConfiguration.questions.databaseProvider === "neondb" &&
                  "Better-Auth with a NeonDB Postgres DB for low friction and high value development"}
                {initialConfiguration.questions.databaseProvider === "both" &&
                  "Supabase and Better-Auth for maximum flexibility and functionality"}
              </p>
            </div>
          )}
          {!initialConfiguration.technologies.supabase && !initialConfiguration.technologies.betterAuth && (
            <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
              No database required, this app is front-end only
            </p>
          )}
        </div>

        {!isNoDatabaseSelected && (
          <>
            <div>
              <h4 className="font-semibold theme-mb-2">
                Does your app use role access?
              </h4>
              <p className="text-sm theme-text-muted-foreground theme-mb-3 font-semibold">
                Select the user roles you need for your application.
              </p>
              <div className="flex flex-col md:flex-row theme-gap-3">
                {roleOptions.map((option) => {
                  const isChecked =
                    initialConfiguration.features.admin[
                      option.id as keyof typeof initialConfiguration.features.admin
                    ] || false;
                  const Icon = option.icon;

                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        if (!option.disabled) {
                          updateAdminOption(option.id, !isChecked);
                        }
                      }}
                      className={cn(
                        "theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-4 transition-all hover:theme-bg-accent flex-1",
                        isChecked && "border-white",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex md:flex-col items-center md:items-center theme-gap-3 md:theme-gap-2 md:text-center">
                        <Icon className="w-8 h-8 md:w-12 md:h-12 theme-text-foreground shrink-0" />
                        <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking flex-1">
                          {option.label}
                        </h4>
                        <Checkbox
                          checked={isChecked}
                          disabled={option.disabled}
                          className="size-6 border-2 border-white/30 dark:border-black/30 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none shrink-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {(initialConfiguration.features.admin.admin ||
                initialConfiguration.features.admin.superAdmin ||
                initialConfiguration.features.admin.organizations) && (
                <div className="flex flex-col theme-gap-2 theme-mt-4">
                  {initialConfiguration.features.admin.admin && (
                    <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Admin:</span> {roleDescriptions.admin}
                    </p>
                  )}
                  {initialConfiguration.features.admin.superAdmin && (
                    <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Super Admin:</span> {roleDescriptions.superAdmin}
                    </p>
                  )}
                  {initialConfiguration.features.admin.organizations && (
                    <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Organizations:</span> {roleDescriptions.organizations}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold theme-mb-2">
                Can users sign in to your app?
              </h4>
              <p className="text-sm theme-text-muted-foreground theme-mb-3 font-semibold">
                Enable user authentication and session management.
              </p>
              <TooltipProvider>
                <div className="flex flex-wrap theme-gap-2 justify-center">
                  {authMethods.map((method) => {
                    const isChecked =
                      initialConfiguration.features.authentication[
                        method.id as keyof typeof initialConfiguration.features.authentication
                      ] || false;
                    const Icon = method.icon;

                    return (
                      <Tooltip key={method.id}>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => {
                              updateAuthenticationOption(method.id, !isChecked);
                            }}
                            className={cn(
                              "theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-2 transition-all hover:theme-bg-accent cursor-pointer",
                              isChecked && "border-white"
                            )}
                          >
                            <div className="flex items-center theme-gap-2">
                              <Icon className="w-4 h-4 theme-text-foreground shrink-0" />
                              <span className="text-xs font-semibold theme-text-foreground theme-font-sans theme-tracking">
                                {method.label}
                              </span>
                              <Checkbox
                                checked={isChecked}
                                className="size-4 border-2 border-white/30 dark:border-black/30 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none shrink-0"
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{method.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>

      {isNoDatabaseSelected ? (
        <div className="theme-bg-muted theme-radius theme-shadow overflow-auto theme-p-4 border theme-border-border">
          <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
            No database selected
          </p>
        </div>
      ) : (
        <div className="theme-bg-card theme-radius theme-shadow overflow-auto border theme-border-border">
          <Tabs defaultValue="columns" className="w-full">
            <TabsList className="w-full theme-p-1 h-auto flex-col items-stretch theme-gap-2">
              <div className="flex flex-col md:flex-row theme-gap-2 md:theme-gap-0 theme-px-2 justify-center items-center theme-py-2 relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedSchema === "auth" || selectedSchema === "better_auth"}
                      className="absolute left-2 top-2 h-7 theme-px-2 theme-gap-1 text-xs"
                    >
                      <Database className="h-3 w-3" />
                      Templates
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 theme-p-3 theme-shadow" align="start">
                    <div className="flex flex-col theme-gap-2">
                      <h4 className="text-sm font-semibold theme-text-foreground theme-mb-1">Database Templates</h4>
                      <p className="text-xs theme-text-muted-foreground theme-mb-2">
                        Select a template to replace existing tables in the current schema
                      </p>
                      {DATABASE_TEMPLATES.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto theme-p-3 flex-col items-start theme-gap-1"
                          onClick={() => {
                            const firstTableId = applyTemplate(template, selectedSchema);
                            setSelectedTableId(firstTableId);
                          }}
                        >
                          <div className="flex items-center theme-gap-2 w-full">
                            <Database className="h-4 w-4 shrink-0" />
                            <span className="font-semibold text-sm">{template.name}</span>
                          </div>
                          <p className="text-xs theme-text-muted-foreground text-left">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap theme-gap-1 theme-mt-1">
                            {template.tables.map((table, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs theme-font-mono">
                                {table.name}
                              </Badge>
                            ))}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center theme-gap-2">
                  <span className="text-xs theme-text-muted-foreground whitespace-nowrap">
                    Schema:
                  </span>
                  {isAddingSchema ? (
                    <Input
                      autoFocus
                      value={newSchemaName}
                      onChange={(e) => setNewSchemaName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddSchema(newSchemaName);
                          setIsAddingSchema(false);
                          setNewSchemaName("");
                        }
                        if (e.key === "Escape") {
                          setIsAddingSchema(false);
                          setNewSchemaName("");
                        }
                      }}
                      onBlur={() => {
                        if (newSchemaName.trim()) {
                          handleAddSchema(newSchemaName);
                        }
                        setIsAddingSchema(false);
                        setNewSchemaName("");
                      }}
                      placeholder="Schema name"
                      className="h-7 theme-px-2 text-xs theme-shadow theme-font-mono w-28"
                    />
                  ) : (
                    <EditableSelect
                      value={selectedSchema}
                      options={[
                        ...getAvailableSchemasWithConfig(initialConfiguration).map((schema) => ({
                          value: schema,
                          label:
                            schema === "auth" &&
                            !initialConfiguration.technologies.betterAuth ? (
                              <div className="flex items-center theme-gap-1">
                                <Lock className="h-3 w-3" />
                                <span>{schema}</span>
                              </div>
                            ) : (
                              schema
                            ),
                        })),
                        {
                          value: "__add_new__",
                          label: (
                            <div className="flex items-center theme-gap-1">
                              <Plus className="h-3 w-3" />
                              <span>Add new schema...</span>
                            </div>
                          ),
                        },
                      ]}
                      onValueChange={(v) => {
                        if (v === "__add_new__") {
                          setIsAddingSchema(true);
                        } else {
                          setSelectedSchema(v);
                        }
                      }}
                      onNameChange={(name) => {
                        const oldSchema = selectedSchema;
                        tables
                          .filter((t) => t.schema === oldSchema)
                          .forEach((t) => {
                            updateTableSchema(t.id, name);
                          });
                        setSelectedSchema(name);
                      }}
                      onDelete={
                        selectedSchema !== "auth" &&
                        selectedSchema !== "better_auth" &&
                        selectedSchema !== "public"
                          ? () => {
                              const schemas = getAvailableSchemasWithConfig(initialConfiguration).filter(
                                (s) => s !== selectedSchema
                              );
                              deleteSchema(selectedSchema);
                              setSelectedSchema(schemas[0] || "public");
                              setSelectedTableId(null);
                            }
                          : undefined
                      }
                      isEditable={
                        selectedSchema !== "auth" &&
                        selectedSchema !== "better_auth" &&
                        selectedSchema !== "public"
                      }
                      showDelete={
                        selectedSchema !== "auth" &&
                        selectedSchema !== "better_auth" &&
                        selectedSchema !== "public"
                      }
                      placeholder="Select schema"
                      className="min-w-0"
                    />
                  )}
                </div>
                <div className="flex items-center theme-gap-2">
                  <span className="text-xs theme-text-muted-foreground whitespace-nowrap">
                    Table:
                  </span>
                  {isAddingTable ? (
                    <Input
                      autoFocus
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTable(newTableName);
                        }
                        if (e.key === "Escape") {
                          setIsAddingTable(false);
                          setNewTableName("");
                        }
                      }}
                      onBlur={() => {
                        if (newTableName.trim()) {
                          handleAddTable(newTableName);
                        } else {
                          setIsAddingTable(false);
                          setNewTableName("");
                        }
                      }}
                      placeholder="Table name"
                      className="h-7 theme-px-2 text-xs theme-shadow theme-font-mono w-28"
                    />
                  ) : (
                    <EditableSelect
                      value={selectedTableId || ""}
                      options={[
                        ...(isSupabaseAuthSchema || isBetterAuthSchema
                          ? filteredTables.length > 0
                            ? filteredTables.map((table) => ({
                                value: table.id,
                                label: table.name,
                              }))
                            : [
                                {
                                  value: "locked",
                                  label: (
                                    <div className="flex items-center theme-gap-1">
                                      <Lock className="h-3 w-3" />
                                      <span>No tables</span>
                                    </div>
                                  ),
                                  disabled: true,
                                },
                              ]
                          : [
                              ...filteredTables.map((table) => ({
                                value: table.id,
                                label: table.name,
                              })),
                              {
                                value: "__add_new__",
                                label: (
                                  <div className="flex items-center theme-gap-1">
                                    <Plus className="h-3 w-3" />
                                    <span>Add new table...</span>
                                  </div>
                                ),
                              },
                            ]),
                      ]}
                      onValueChange={(v) => {
                        if (v === "__add_new__") {
                          handleAddTable();
                        } else if (v !== "locked") {
                          setSelectedTableId(v);
                        }
                      }}
                      onNameChange={(name) => {
                        if (selectedTable) {
                          updateTableName(selectedTable.id, name);
                        }
                      }}
                      onDelete={
                        selectedTable && selectedTable.isEditable
                          ? () => {
                              deleteTable(selectedTable.id);
                              const remainingTables = filteredTables.filter(
                                (t) => t.id !== selectedTable.id
                              );
                              setSelectedTableId(
                                remainingTables[0]?.id || null
                              );
                            }
                          : undefined
                      }
                      placeholder="Select table"
                      isEditable={selectedTable?.isEditable}
                      showDelete={selectedTable?.isEditable}
                      className="min-w-0"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-1 theme-gap-1">
                <TabsTrigger
                  value="columns"
                  className="flex-1 text-sm font-semibold"
                >
                  Columns
                </TabsTrigger>
                <TabsTrigger
                  value="enums"
                  className="flex-1 text-sm font-semibold"
                >
                  Enums
                </TabsTrigger>
                <TabsTrigger
                  value="rls"
                  className="flex-1 text-sm font-semibold"
                >
                  RLS
                </TabsTrigger>
              </div>
            </TabsList>
            {selectedTable ? (
              <>
                <TabsContent value="columns" className="theme-mt-0">
                  <TableColumnsContent table={selectedTable} />
                </TabsContent>
                <TabsContent value="enums" className="theme-mt-0">
                  <EnumsContent schema={selectedSchema} />
                </TabsContent>
                <TabsContent value="rls" className="theme-mt-0">
                  <TableRLSContent table={selectedTable} />
                </TabsContent>
              </>
            ) : (
              <div className="theme-p-8 flex items-center justify-center">
                {isSupabaseAuthSchema ? (
                  <div className="flex flex-col items-center theme-gap-4 theme-text-muted-foreground max-w-md text-center">
                    <Lock className="h-12 w-12 theme-mt-4" />
                    <div className="flex flex-col theme-gap-2 theme-mb-4">
                      <p className="text-sm theme-font-sans theme-tracking font-semibold">
                        The auth schema is managed by Supabase
                      </p>
                      <p className="text-xs theme-font-sans theme-tracking">
                        Supabase handles all authentication tables and schema management automatically. You cannot add or modify tables in this schema.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="theme-gap-2"
                    onClick={() => handleAddTable()}
                  >
                    <Plus className="h-4 w-4" />
                    Add table
                  </Button>
                )}
              </div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};
