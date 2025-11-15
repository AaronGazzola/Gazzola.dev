"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
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
import {
  Lock,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  PRISMA_TYPES,
  PrismaColumn,
  PrismaTable,
  RLSPolicy,
} from "./DatabaseConfiguration.types";
import { SiSupabase } from "react-icons/si";

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
  const { tables } = useDatabaseStore();

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
            <span className="theme-text-chart-3 whitespace-nowrap">
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
              className="text-xs theme-font-mono theme-text-chart-4 whitespace-nowrap"
            >
              {attr}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center theme-gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-60 hover:opacity-100"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 theme-p-3 theme-shadow" align="start">
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

        <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-60 hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
            <div className="flex flex-col theme-gap-2">
              <p className="text-sm theme-text-foreground">
                Delete column {column.name}?
              </p>
              <div className="flex theme-gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onDelete(table.id, column.id);
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
    useState<(typeof PRISMA_TYPES)[number]>("String");

  const handleAdd = () => {
    if (!columnName.trim()) return;

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

    setColumnName("");
    setColumnType("String");
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
      <PopoverContent className="w-64 theme-p-3 theme-shadow" align="start">
        <div className="flex flex-col theme-gap-2">
          <Input
            placeholder="Column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setOpen(false);
            }}
            className="h-7 theme-shadow"
          />
          <Select
            value={columnType}
            onValueChange={(v) => setColumnType(v as typeof columnType)}
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
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} size="sm">
            Add Column
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DatabaseChoicePopover = () => {
  const { initialConfiguration, updateInitialConfiguration } = useEditorStore();
  const [open, setOpen] = useState(false);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (!checked) return;

    let useSupabaseValue: "none" | "no" | "withBetterAuth" | "authOnly" = "none";
    const techUpdates: Partial<typeof initialConfiguration.technologies> = {};
    const featureUpdates: Partial<typeof initialConfiguration.features> = {};

    if (optionId === "noDatabase") {
      useSupabaseValue = "none";
      techUpdates.supabase = false;
      techUpdates.neondb = false;
      techUpdates.betterAuth = false;
      techUpdates.prisma = false;
      techUpdates.postgresql = false;
      featureUpdates.authentication = {
        ...initialConfiguration.features.authentication,
        enabled: false,
      };
      featureUpdates.admin = {
        ...initialConfiguration.features.admin,
        enabled: false,
      };
      featureUpdates.fileStorage = false;
      featureUpdates.realTimeNotifications = {
        ...initialConfiguration.features.realTimeNotifications,
        enabled: false,
      };
    } else if (optionId === "neondb") {
      useSupabaseValue = "no";
      techUpdates.neondb = true;
      techUpdates.betterAuth = true;
      techUpdates.prisma = true;
      techUpdates.postgresql = true;
      techUpdates.supabase = false;
      featureUpdates.fileStorage = false;
      featureUpdates.realTimeNotifications = {
        ...initialConfiguration.features.realTimeNotifications,
        enabled: false,
      };
    } else if (optionId === "supabaseWithBetter") {
      useSupabaseValue = "withBetterAuth";
      techUpdates.supabase = true;
      techUpdates.betterAuth = true;
      techUpdates.prisma = true;
      techUpdates.postgresql = true;
      techUpdates.neondb = false;
    } else if (optionId === "supabaseOnly") {
      useSupabaseValue = "authOnly";
      techUpdates.supabase = true;
      techUpdates.prisma = true;
      techUpdates.postgresql = true;
      techUpdates.betterAuth = false;
      techUpdates.neondb = false;
      const adminUpdates = { ...initialConfiguration.features.admin };
      if (adminUpdates.orgAdmins || adminUpdates.orgMembers) {
        adminUpdates.orgAdmins = false;
        adminUpdates.orgMembers = false;
      }
      featureUpdates.admin = adminUpdates;
    }

    updateInitialConfiguration({
      questions: {
        ...initialConfiguration.questions,
        useSupabase: useSupabaseValue,
      },
      database: {
        hosting: useSupabaseValue === "none" ? "postgresql" : useSupabaseValue === "no" ? "neondb" : "supabase",
      },
      technologies: {
        ...initialConfiguration.technologies,
        ...techUpdates,
      },
      features: {
        ...initialConfiguration.features,
        ...featureUpdates,
      },
    });

    setOpen(false);
  };

  const getCurrentSelectionBadges = () => {
    const useSupabase = initialConfiguration.questions.useSupabase;

    if (useSupabase === "none") {
      return <span className="theme-text-muted-foreground text-xs">None</span>;
    }

    if (useSupabase === "no") {
      return (
        <div className="theme-bg-secondary theme-text-secondary-foreground theme-border-border flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 rounded-full text-xs font-semibold border">
          <BetterAuthIcon className="w-3 h-3" />
          <span>Better Auth</span>
        </div>
      );
    }

    if (useSupabase === "withBetterAuth") {
      return (
        <div className="flex items-center theme-gap-1">
          <div className="theme-bg-secondary theme-text-secondary-foreground theme-border-border flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 rounded-full text-xs font-semibold border">
            <SiSupabase className="w-3 h-3" />
            <span>Supabase</span>
          </div>
          <span className="text-xs">+</span>
          <div className="theme-bg-secondary theme-text-secondary-foreground theme-border-border flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 rounded-full text-xs font-semibold border">
            <BetterAuthIcon className="w-3 h-3" />
            <span>Better Auth</span>
          </div>
        </div>
      );
    }

    return (
      <div className="theme-bg-secondary theme-text-secondary-foreground theme-border-border flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 rounded-full text-xs font-semibold border">
        <SiSupabase className="w-3 h-3" />
        <span>Supabase</span>
      </div>
    );
  };

  const options = [
    {
      id: "noDatabase",
      label: "No, I don't need any custom backend logic",
      description: "No database or authentication functionality",
    },
    {
      id: "neondb",
      label: "Yes, I want to use NeonDB with Better-auth for authentication",
      description: "Cheaper, more restrictive",
    },
    {
      id: "supabaseWithBetter",
      label: "Yes, I want to use Supabase with Better-Auth for authentication",
      description: "More options for authentication and integration",
    },
    {
      id: "supabaseOnly",
      label: "Yes, use only Supabase for authentication",
      description: "Fewer options for authentication and integration, but better for compliance and audit requirements",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 theme-gap-2 justify-start text-sm min-w-fit"
        >
          <span className="theme-text-muted-foreground">Database:</span>
          {getCurrentSelectionBadges()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[32rem] theme-p-4 theme-shadow" align="start">
        <div className="flex flex-col theme-gap-3">
          <div>
            <h4 className="font-semibold theme-mb-1">Do you want to use a database?</h4>
            <p className="text-xs theme-text-muted-foreground">
              Choose your database and authentication provider.
            </p>
          </div>
          <div className="flex flex-col theme-gap-2">
            {options.map((option) => {
              const isChecked =
                (option.id === "noDatabase" && initialConfiguration.questions.useSupabase === "none") ||
                (option.id === "neondb" && initialConfiguration.questions.useSupabase === "no") ||
                (option.id === "supabaseWithBetter" && initialConfiguration.questions.useSupabase === "withBetterAuth") ||
                (option.id === "supabaseOnly" && initialConfiguration.questions.useSupabase === "authOnly");

              return (
                <label
                  key={option.id}
                  className="flex items-start theme-gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleOptionChange(option.id, checked === true)}
                    className="size-4 mt-0.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                  />
                  <div>
                    <span className="theme-text-foreground text-sm font-medium block">
                      {option.label}
                    </span>
                    <span className="theme-text-muted-foreground text-xs block theme-mt-0.5 font-medium">
                      {option.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const TableColumnsContent = ({ table }: { table: PrismaTable }) => {
  const { addColumn, deleteColumn, updateColumn } = useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const isSupabaseAuthOnly = initialConfiguration.questions.useSupabase === "authOnly";
  const isAuthSchema = table.schema === "auth";

  if (isSupabaseAuthOnly && isAuthSchema) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-sm theme-font-sans theme-tracking">
            The Supabase auth schema is managed by Supabase and cannot be edited directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col theme-p-2 overflow-x-auto">
      {table.columns.map((column) => (
        <div key={column.id} className="w-full relative min-h-[2rem]">
          <div className="absolute inset-0 flex min-w-full">
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
      <AddColumnPopover table={table} onAddColumn={addColumn} />
    </div>
  );
};

const TableRLSContent = ({ table }: { table: PrismaTable }) => {
  const { rlsPolicies, addRLSPolicy, deleteRLSPolicy, updateRLSPolicy } =
    useDatabaseStore();
  const { initialConfiguration } = useEditorStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const tablePolicies = rlsPolicies.filter((p) => p.tableId === table.id);

  const authProvider = initialConfiguration.questions.useSupabase === "authOnly"
    ? "Supabase"
    : "Better Auth";
  const isAuthSchema = table.schema === "auth";

  return (
    <div className="flex flex-col theme-gap-2 theme-p-4">
      {tablePolicies.length === 0 ? (
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
          No RLS policies defined for this table
        </p>
      ) : (
        tablePolicies.map((policy) => {
          const handleSave = () => {
            if (policy.name.trim() && policy.using.trim()) {
              updateRLSPolicy(policy.id, { isEditing: false });
            }
          };

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              handleSave();
            }
          };

          if (!policy.isEditing) {
            return (
              <div
                key={policy.id}
                className="theme-bg-muted theme-radius theme-p-3 cursor-pointer hover:theme-bg-accent transition-colors"
                onClick={() => updateRLSPolicy(policy.id, { isEditing: true })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center theme-gap-2 theme-mb-1">
                      <span className="text-sm font-medium theme-text-foreground">
                        {policy.name}
                      </span>
                      <span className="text-xs theme-font-mono theme-text-chart-3">
                        {policy.operation}
                      </span>
                    </div>
                    <div className="text-xs theme-text-muted-foreground theme-font-mono theme-truncate">
                      USING: {policy.using}
                      {policy.withCheck && ` | WITH CHECK: ${policy.withCheck}`}
                    </div>
                  </div>
                  <Popover
                    open={deleteConfirmId === policy.id}
                    onOpenChange={(open) =>
                      setDeleteConfirmId(open ? policy.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 theme-ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 theme-text-destructive" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 theme-p-3 theme-shadow"
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col theme-gap-2">
                        <p className="text-sm theme-text-foreground">
                          Delete policy {policy.name}?
                        </p>
                        <div className="flex theme-gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              deleteRLSPolicy(policy.id);
                              setDeleteConfirmId(null);
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          }

          return (
            <div
              key={policy.id}
              className="theme-bg-muted theme-radius theme-p-3 relative"
            >
              <div className="flex items-center justify-between theme-mb-2">
                <Input
                  value={policy.name}
                  onChange={(e) =>
                    updateRLSPolicy(policy.id, {
                      name: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDown}
                  className="h-7 text-sm font-medium theme-shadow"
                  placeholder="Policy name"
                />
                <Popover
                  open={deleteConfirmId === policy.id}
                  onOpenChange={(open) =>
                    setDeleteConfirmId(open ? policy.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 theme-ml-2"
                    >
                      <Trash2 className="h-4 w-4 theme-text-destructive" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 theme-p-3 theme-shadow"
                    align="end"
                  >
                    <div className="flex flex-col theme-gap-2">
                      <p className="text-sm theme-text-foreground">
                        Delete policy {policy.name}?
                      </p>
                      <div className="flex theme-gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            deleteRLSPolicy(policy.id);
                            setDeleteConfirmId(null);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col theme-gap-2">
                <div>
                  <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                    Operation
                  </label>
                  <Select
                    value={policy.operation}
                    onValueChange={(operation) =>
                      updateRLSPolicy(policy.id, {
                        operation: operation as RLSPolicy["operation"],
                      })
                    }
                  >
                    <SelectTrigger className="h-7 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SELECT">SELECT</SelectItem>
                      <SelectItem value="INSERT">INSERT</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="ALL">ALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                    USING clause
                  </label>
                  <Input
                    value={policy.using}
                    onChange={(e) =>
                      updateRLSPolicy(policy.id, {
                        using: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    className="h-7 text-sm theme-font-mono theme-shadow"
                    placeholder="true"
                  />
                </div>

                {(policy.operation === "INSERT" ||
                  policy.operation === "UPDATE" ||
                  policy.operation === "ALL") && (
                  <div>
                    <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                      WITH CHECK clause (optional)
                    </label>
                    <Input
                      value={policy.withCheck || ""}
                      onChange={(e) =>
                        updateRLSPolicy(policy.id, {
                          withCheck: e.target.value || undefined,
                        })
                      }
                      onKeyDown={handleKeyDown}
                      className="h-7 text-sm theme-font-mono theme-shadow"
                      placeholder="Leave empty to use USING clause"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end theme-mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={!policy.name.trim() || !policy.using.trim()}
                  className="h-7 theme-gap-1"
                >
                  <Save className="h-3 w-3" />
                  Save
                </Button>
              </div>
            </div>
          );
        })
      )}

      {isAuthSchema ? (
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking theme-mt-2">
          All auth schema security is handled by {authProvider}
        </p>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="theme-mt-2"
          onClick={() =>
            addRLSPolicy({
              tableId: table.id,
              name: "New policy",
              operation: "SELECT",
              using: "true",
              isEditing: false,
            })
          }
        >
          <Plus className="h-3 w-3 theme-mr-1" />
          Add policy
        </Button>
      )}
    </div>
  );
};

export const DatabaseConfiguration = () => {
  const { tables, initializeFromConfig } = useDatabaseStore();
  const { initialConfiguration, setSectionInclude } = useEditorStore();
  const [selectedSchema, setSelectedSchema] = useState<"auth" | "public">("public");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    initializeFromConfig(initialConfiguration);
  }, [
    initialConfiguration.technologies.betterAuth,
    initialConfiguration.features.authentication.enabled,
    initialConfiguration.features.admin.orgAdmins,
    initialConfiguration.features.admin.orgMembers,
    initialConfiguration.questions.useSupabase,
    initializeFromConfig,
    initialConfiguration,
  ]);

  useEffect(() => {
    applyAutomaticSectionFiltering(initialConfiguration, setSectionInclude);
  }, [initialConfiguration, setSectionInclude]);

  const isNoDatabaseSelected =
    initialConfiguration.questions.useSupabase === "none";

  const filteredTables = tables.filter((t) => t.schema === selectedSchema);

  const selectedTable = selectedTableId
    ? tables.find((t) => t.id === selectedTableId)
    : null;

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

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-3xl mx-auto">
      <div className="flex flex-col theme-gap-3">
        <span className="text-sm font-medium theme-text-foreground">
          Database Configuration
        </span>
        <div className="flex items-center theme-gap-3 flex-wrap">
          <DatabaseChoicePopover />
          {!isNoDatabaseSelected && (
            <div className="flex items-center theme-gap-3">
              <Select
                value={selectedSchema}
                onValueChange={(v) => setSelectedSchema(v as "auth" | "public")}
              >
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auth">
                    <div className="flex items-center theme-gap-1">
                      {initialConfiguration.questions.useSupabase === "authOnly" && (
                        <Lock className="h-3 w-3" />
                      )}
                      <span>{initialConfiguration.questions.useSupabase === "authOnly" ? "auth" : "better_auth"}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="public">public</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedTableId || ""}
                onValueChange={(v) => setSelectedTableId(v)}
              >
                <SelectTrigger className="h-9 w-48">
                  {initialConfiguration.questions.useSupabase === "authOnly" && selectedSchema === "auth" ? (
                    <div className="flex items-center theme-gap-1">
                      <Lock className="h-3 w-3" />
                    </div>
                  ) : (
                    <SelectValue placeholder="Select table" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {initialConfiguration.questions.useSupabase === "authOnly" && selectedSchema === "auth" ? (
                    <SelectItem value="locked" disabled>
                      <div className="flex items-center theme-gap-1">
                        <Lock className="h-3 w-3" />
                      </div>
                    </SelectItem>
                  ) : (
                    filteredTables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {isNoDatabaseSelected ? (
        <div className="theme-bg-muted theme-radius theme-shadow overflow-auto theme-p-4">
          <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
            No database selected
          </p>
        </div>
      ) : selectedTable ? (
        <div className="theme-bg-muted theme-radius theme-shadow overflow-auto">
          <Tabs defaultValue="columns" className="w-full">
            <TabsList className="w-full theme-p-1 h-12 theme-bg-muted">
              <TabsTrigger
                value="columns"
                className="flex-1 text-base font-semibold data-[state=active]:theme-bg-card data-[state=active]:theme-text-foreground data-[state=active]:theme-shadow"
              >
                Columns
              </TabsTrigger>
              <TabsTrigger
                value="rls"
                className="flex-1 text-base font-semibold data-[state=active]:theme-bg-card data-[state=active]:theme-text-foreground data-[state=active]:theme-shadow"
              >
                RLS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="columns">
              <TableColumnsContent table={selectedTable} />
            </TabsContent>
            <TabsContent value="rls">
              <TableRLSContent table={selectedTable} />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
};
