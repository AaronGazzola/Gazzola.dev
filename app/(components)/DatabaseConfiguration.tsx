"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { ChevronDown, Ellipsis, Lock, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiSupabase } from "react-icons/si";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  PRISMA_TYPES,
  PrismaColumn,
  PrismaTable,
} from "./DatabaseConfiguration.types";

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

    let useSupabaseValue: "none" | "no" | "withBetterAuth" | "authOnly" =
      "none";
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
      if (adminUpdates.organizations) {
        adminUpdates.organizations = false;
      }
      featureUpdates.admin = adminUpdates;
    }

    updateInitialConfiguration({
      questions: {
        ...initialConfiguration.questions,
        useSupabase: useSupabaseValue,
      },
      database: {
        hosting:
          useSupabaseValue === "none"
            ? "postgresql"
            : useSupabaseValue === "no"
              ? "neondb"
              : "supabase",
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
      description:
        "Fewer options for authentication and integration, but better for compliance and audit requirements",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-9 h-auto theme-gap-2 justify-start text-sm min-w-fit theme-py-1.5"
        >
          <span className="theme-text-muted-foreground">Database:</span>
          {getCurrentSelectionBadges()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[32rem] theme-p-4 theme-shadow"
        align="start"
      >
        <div className="flex flex-col theme-gap-3">
          <div>
            <h4 className="font-semibold theme-mb-1">
              Do you want to use a database?
            </h4>
            <p className="text-xs theme-text-muted-foreground">
              Choose your database and authentication provider.
            </p>
          </div>
          <div className="flex flex-col theme-gap-2">
            {options.map((option) => {
              const isChecked =
                (option.id === "noDatabase" &&
                  initialConfiguration.questions.useSupabase === "none") ||
                (option.id === "neondb" &&
                  initialConfiguration.questions.useSupabase === "no") ||
                (option.id === "supabaseWithBetter" &&
                  initialConfiguration.questions.useSupabase ===
                    "withBetterAuth") ||
                (option.id === "supabaseOnly" &&
                  initialConfiguration.questions.useSupabase === "authOnly");

              return (
                <label
                  key={option.id}
                  className="flex items-start theme-gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleOptionChange(option.id, checked === true)
                    }
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

const RoleAccessPopover = () => {
  const { initialConfiguration, updateAdminOption } = useEditorStore();
  const [open, setOpen] = useState(false);

  const isDisabled = initialConfiguration.questions.useSupabase === "none";

  const getCurrentSelectionBadges = () => {
    const admin = initialConfiguration.features.admin;
    const selectedRoles = [];

    if (admin.admin) selectedRoles.push("Admin");
    if (admin.superAdmin) selectedRoles.push("Super Admin");
    if (admin.organizations) selectedRoles.push("Organizations");

    if (selectedRoles.length === 0) {
      return <span className="theme-text-muted-foreground text-xs">None</span>;
    }

    return (
      <div className="flex items-center theme-gap-1 flex-wrap">
        {selectedRoles.map((role) => (
          <div
            key={role}
            className="theme-bg-secondary theme-text-secondary-foreground theme-border-border flex items-center theme-gap-1 theme-px-1.5 theme-py-0.5 rounded-full text-xs font-semibold border"
          >
            <span>{role}</span>
          </div>
        ))}
      </div>
    );
  };

  const options = [
    {
      id: "admin",
      label: "Admin",
      description: "Regular admin users with elevated permissions",
    },
    {
      id: "superAdmin",
      label: "Super Admin",
      description:
        "Super admins have full access and can manage all users and content",
    },
    {
      id: "organizations",
      label: "Organizations",
      description:
        "Enable organization-based access with org-admin and org-member roles",
      disabled: initialConfiguration.questions.useSupabase === "authOnly",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-9 h-auto theme-gap-2 justify-start text-sm min-w-fit theme-py-1.5"
          disabled={isDisabled}
        >
          <span className="theme-text-muted-foreground">Roles:</span>
          {getCurrentSelectionBadges()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[32rem] theme-p-4 theme-shadow"
        align="start"
      >
        <div className="flex flex-col theme-gap-3">
          <div>
            <h4 className="font-semibold theme-mb-1">
              Does your app use role access?
            </h4>
            <p className="text-xs theme-text-muted-foreground">
              Select the user roles you need for your application.
            </p>
          </div>
          <div className="flex flex-col theme-gap-2">
            {options.map((option) => {
              const isChecked =
                initialConfiguration.features.admin[
                  option.id as keyof typeof initialConfiguration.features.admin
                ] || false;

              return (
                <label
                  key={option.id}
                  className={`flex items-start theme-gap-2 ${
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    disabled={option.disabled}
                    onCheckedChange={(checked) => {
                      updateAdminOption(option.id, checked === true);
                      if (!checked) {
                        const adminFeatures =
                          initialConfiguration.features.admin;
                        const anyEnabled =
                          adminFeatures.admin ||
                          adminFeatures.superAdmin ||
                          adminFeatures.organizations;
                        if (!anyEnabled) {
                          setOpen(false);
                        }
                      }
                    }}
                    className="size-4 mt-0.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                  />
                  <div>
                    <span className="theme-text-foreground text-sm font-medium block">
                      {option.label}
                    </span>
                    <span className="theme-text-muted-foreground text-xs block theme-mt-0.5 font-medium">
                      {option.description}
                      {option.disabled && " (Requires Better-Auth)"}
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

  const isSupabaseAuthOnly =
    initialConfiguration.questions.useSupabase === "authOnly";
  const isAuthSchema = table.schema === "auth";

  if (isSupabaseAuthOnly && isAuthSchema) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-sm theme-font-sans theme-tracking">
            The Supabase auth schema is managed by Supabase and cannot be edited
            directly.
          </p>
        </div>
      </div>
    );
  }

  return (
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
  const { addOrUpdateRLSPolicy, getRLSPolicyForOperation, tables } =
    useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const authProvider =
    initialConfiguration.questions.useSupabase === "authOnly"
      ? "Supabase"
      : "Better Auth";
  const isAuthSchema = table.schema === "auth";

  const enabledRoles: import("./DatabaseConfiguration.types").UserRole[] = [];
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

  if (enabledRoles.length === 0) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
          No user roles configured. Configure roles in the initial configuration
          to define RLS policies.
        </p>
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
  } = useDatabaseStore();
  const { initialConfiguration, setSectionInclude } = useEditorStore();
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

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-3">
        <span className="text-sm font-medium theme-text-foreground">
          Database Configuration
        </span>
        <div className="flex items-center theme-gap-3 flex-wrap">
          <DatabaseChoicePopover />
          <RoleAccessPopover />
        </div>
      </div>

      {isNoDatabaseSelected ? (
        <div className="theme-bg-muted theme-radius theme-shadow overflow-auto theme-p-4">
          <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
            No database selected
          </p>
        </div>
      ) : (
        <div className="theme-bg-card theme-radius theme-shadow overflow-auto">
          <Tabs defaultValue="columns" className="w-full">
            <TabsList className="w-full theme-p-1 h-auto flex-col items-stretch theme-gap-2">
              <div className="flex flex-col md:flex-row theme-gap-2 md:theme-gap-0 theme-px-2 justify-center items-center theme-py-2">
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
                        ...getAvailableSchemas().map((schema) => ({
                          value: schema,
                          label:
                            schema === "auth" &&
                            initialConfiguration.questions.useSupabase ===
                              "authOnly" ? (
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
                        selectedSchema !== "better_auth"
                          ? () => {
                              const schemas = getAvailableSchemas().filter(
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
                        selectedSchema !== "better_auth"
                      }
                      showDelete={
                        selectedSchema !== "auth" &&
                        selectedSchema !== "better_auth"
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
                        ...(initialConfiguration.questions.useSupabase ===
                          "authOnly" && selectedSchema === "auth"
                          ? [
                              {
                                value: "locked",
                                label: (
                                  <div className="flex items-center theme-gap-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Locked</span>
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
                <TabsContent value="rls" className="theme-mt-0">
                  <TableRLSContent table={selectedTable} />
                </TabsContent>
              </>
            ) : (
              <div className="theme-p-8 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="theme-gap-2"
                  onClick={() => handleAddTable()}
                >
                  <Plus className="h-4 w-4" />
                  Add table
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};
