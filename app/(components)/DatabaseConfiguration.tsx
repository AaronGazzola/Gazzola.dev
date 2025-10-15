"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/editor/ui/accordion";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  CreditCard,
  Database,
  Lock,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NetworkVisualization } from "./DatabaseConfiguration.network";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  PRISMA_TYPES,
  PrismaColumn,
  PrismaTable,
  RLSPolicy,
} from "./DatabaseConfiguration.types";

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

const EditableText = ({
  value,
  onChange,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (tempValue.trim()) {
      onChange(tempValue.trim());
    }
    setIsEditing(false);
  };

  if (disabled) {
    return (
      <span className={cn("theme-text-foreground", className)}>{value}</span>
    );
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") setIsEditing(false);
        }}
        className={cn(
          "h-5 theme-px-1 theme-py-0 text-sm w-auto inline-block theme-shadow",
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "cursor-pointer hover:theme-bg-accent theme-px-1 theme-radius theme-text-foreground",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      {value}
    </span>
  );
};

const ColumnLine = ({
  table,
  column,
  onUpdate,
  onDelete,
}: {
  table: PrismaTable;
  column: PrismaColumn;
  onUpdate: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
  onDelete: (tableId: string, columnId: string) => void;
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

  return (
    <div className="group flex items-center theme-gap-2 theme-px-3 theme-py-1 hover:theme-bg-accent theme-radius">
      <div className="flex-1 flex items-center theme-gap-2">
        {isEditingName ? (
          <Input
            ref={inputRef}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="h-7 theme-px-2 text-sm w-32 theme-shadow theme-font-mono"
          />
        ) : (
          <span
            className="text-sm theme-font-mono theme-text-foreground min-w-[8rem] cursor-pointer hover:underline"
            onClick={() => setIsEditingName(true)}
          >
            {column.name}
          </span>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 theme-px-2 theme-gap-1 theme-font-mono text-xs"
            >
              <span className="theme-text-chart-3">
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
          <div className="flex items-center theme-gap-1">
            {column.attributes.map((attr, i) => (
              <span
                key={i}
                className="text-xs theme-font-mono theme-text-chart-4"
              >
                {attr}
              </span>
            ))}
          </div>
        )}

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
      </div>

      <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-3 w-3 theme-text-destructive" />
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

const AddTablePopover = ({
  onAddTable,
}: {
  onAddTable: (name: string, schema: "auth" | "public") => void;
}) => {
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [schema, setSchema] = useState<"auth" | "public">("public");

  const handleAdd = () => {
    if (!tableName.trim()) return;
    onAddTable(tableName.trim(), schema);
    setTableName("");
    setSchema("public");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm"
        >
          <Plus className="h-3 w-3 theme-mr-1" />
          Add table...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 theme-p-3 theme-shadow" align="start">
        <div className="flex flex-col theme-gap-2">
          <Input
            placeholder="Table name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setOpen(false);
            }}
            className="h-7 theme-shadow"
          />
          <Select
            value={schema}
            onValueChange={(v) => setSchema(v as "auth" | "public")}
          >
            <SelectTrigger className="h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auth">auth</SelectItem>
              <SelectItem value="public">public</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} size="sm">
            Add Table
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ConfigurationSummary = () => {
  const {
    initialConfiguration,
    updateAuthenticationOption,
    updatePaymentOption,
    updateRealTimeNotificationsOption,
    updateInitialConfiguration,
  } = useEditorStore();

  interface QuestionConfig {
    id: string;
    question: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    subOptions?: {
      id: string;
      label: string;
      disabledWhen?: (config: InitialConfigurationType) => boolean;
    }[];
  }

  const questionConfigs: QuestionConfig[] = [
    {
      id: "databaseChoice",
      question: "Do you want to use a database?",
      icon: Database,
      iconColor: "theme-text-chart-1",
      subOptions: [
        {
          id: "noDatabase",
          label: "No database",
        },
        {
          id: "neondb",
          label: "NeonDB with Better-auth",
        },
        {
          id: "supabaseWithBetter",
          label: "Supabase with Better-Auth",
        },
        {
          id: "supabaseOnly",
          label: "Supabase authentication only",
        },
      ],
    },
    {
      id: "authentication",
      question: "Can users sign in to your app?",
      icon: Users,
      iconColor: "theme-text-chart-2",
      subOptions: [
        {
          id: "magicLink",
          label: "Magic Link",
        },
        {
          id: "emailPassword",
          label: "Email & Password",
        },
        {
          id: "otp",
          label: "OTP",
        },
        {
          id: "twoFactor",
          label: "Two-Factor (2FA)",
        },
        {
          id: "passkey",
          label: "Passkey",
        },
        {
          id: "anonymous",
          label: "Anonymous Sessions",
        },
        {
          id: "googleAuth",
          label: "Google OAuth",
        },
        {
          id: "githubAuth",
          label: "GitHub OAuth",
        },
        {
          id: "appleAuth",
          label: "Apple Sign In",
        },
        {
          id: "passwordOnly",
          label: "Password only",
        },
      ],
    },
    {
      id: "fileStorage",
      question: "Can users upload files?",
      icon: Upload,
      iconColor: "theme-text-chart-3",
    },
    {
      id: "payments",
      question: "Does your app process payments?",
      icon: CreditCard,
      iconColor: "theme-text-chart-4",
      subOptions: [
        {
          id: "paypalPayments",
          label: "PayPal payments",
        },
        {
          id: "stripePayments",
          label: "Stripe payments",
        },
        {
          id: "stripeSubscriptions",
          label: "Stripe subscriptions",
          disabledWhen: (config) =>
            (config.questions.useSupabase !== "withBetterAuth" &&
              config.questions.useSupabase !== "no") ||
            !config.features.authentication.enabled,
        },
      ],
    },
    {
      id: "realTimeNotifications",
      question: "Do you need realtime notifications?",
      icon: Bell,
      iconColor: "theme-text-chart-5",
      subOptions: [
        {
          id: "emailNotifications",
          label: "Email notifications",
          disabledWhen: (config) => !config.features.authentication.enabled,
        },
        {
          id: "inAppNotifications",
          label: "In-app notifications",
        },
      ],
    },
  ];

  const hasAnyChildrenSelected = (questionId: string): boolean => {
    const question = questionConfigs.find((q) => q.id === questionId);
    if (!question) return false;

    if (questionId === "databaseChoice") {
      return true;
    } else if (questionId === "payments") {
      return (
        initialConfiguration.features.payments.paypalPayments ||
        initialConfiguration.features.payments.stripePayments ||
        initialConfiguration.features.payments.stripeSubscriptions
      );
    } else if (questionId === "authentication") {
      return (
        initialConfiguration.features.authentication.magicLink ||
        initialConfiguration.features.authentication.emailPassword ||
        initialConfiguration.features.authentication.otp ||
        initialConfiguration.features.authentication.googleAuth ||
        initialConfiguration.features.authentication.githubAuth ||
        initialConfiguration.features.authentication.appleAuth ||
        initialConfiguration.features.authentication.passwordOnly
      );
    } else if (questionId === "realTimeNotifications") {
      return (
        initialConfiguration.features.realTimeNotifications
          .emailNotifications ||
        initialConfiguration.features.realTimeNotifications.inAppNotifications
      );
    }

    return false;
  };

  const isNoDatabaseSelected =
    initialConfiguration.questions.useSupabase === "none";

  return (
    <TooltipProvider>
      <Accordion
        type="single"
        collapsible
        className="flex flex-col theme-gap-1"
      >
        {questionConfigs.map((question) => {
          const Icon = question.icon;
          const isEnabled =
            question.subOptions && question.subOptions.length > 0
              ? hasAnyChildrenSelected(question.id)
              : (initialConfiguration.features[
                  question.id as keyof typeof initialConfiguration.features
                ] as boolean);

          const isQuestionDisabled =
            isNoDatabaseSelected && question.id !== "databaseChoice";

          return (
            <AccordionItem
              key={question.id}
              value={question.id}
              className={cn(
                "transition-all duration-200 border-none relative",
                isQuestionDisabled && "opacity-50 pointer-events-none"
              )}
            >
              <AccordionTrigger
                className={cn(
                  "flex items-center w-full theme-py-1 theme-px-2 theme-pr-10 hover:no-underline [&>svg]:hidden [&[data-state=open]_.chevron]:rotate-180"
                )}
                disabled={isQuestionDisabled}
              >
                <div className="flex items-center theme-gap-2 flex-1 min-w-0">
                  <Icon
                    className={cn(
                      question.iconColor,
                      "w-5 h-5 transition-colors duration-200 shrink-0"
                    )}
                  />
                  <span className="theme-text-foreground text-sm font-medium theme-font-sans theme-tracking">
                    {question.question}
                  </span>
                </div>

                <div className="flex items-center theme-gap-2 shrink-0">
                  <ChevronDown className="chevron h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </AccordionTrigger>

              <div className="absolute right-2 top-0 theme-pt-5 z-10">
                <Checkbox
                  checked={isEnabled}
                  disabled={
                    question.subOptions && question.subOptions.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (question.subOptions && question.subOptions.length > 0) {
                      return;
                    }

                    const isChecking = checked === true;
                    if (question.id === "fileStorage") {
                      updateInitialConfiguration({
                        features: {
                          ...initialConfiguration.features,
                          fileStorage: isChecking,
                        },
                      });
                    }
                  }}
                  className={cn(
                    "size-4 border border-gray-500 select-none",
                    question.subOptions && question.subOptions.length > 0
                      ? "data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-600 data-[state=checked]:text-white cursor-not-allowed opacity-50"
                      : "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                  )}
                />
              </div>

              <AccordionContent>
                <div className="theme-px-2 theme-pb-2 theme-pt-0">
                  {question.subOptions && question.subOptions.length > 0 ? (
                    <div className="flex flex-col theme-gap-1">
                      {question.subOptions.map((option) => {
                        const isSubOptionDisabled =
                          option.disabledWhen?.(initialConfiguration) ?? false;

                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex items-start theme-gap-2",
                              isSubOptionDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            )}
                          >
                            {isSubOptionDisabled ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Checkbox
                                    checked={
                                      question.id === "databaseChoice"
                                        ? (option.id === "noDatabase" &&
                                            initialConfiguration.questions
                                              .useSupabase === "none") ||
                                          (option.id === "neondb" &&
                                            initialConfiguration.questions
                                              .useSupabase === "no") ||
                                          (option.id === "supabaseWithBetter" &&
                                            initialConfiguration.questions
                                              .useSupabase ===
                                              "withBetterAuth") ||
                                          (option.id === "supabaseOnly" &&
                                            initialConfiguration.questions
                                              .useSupabase === "authOnly")
                                        : question.id === "payments"
                                          ? initialConfiguration.features
                                              .payments[
                                              option.id as keyof typeof initialConfiguration.features.payments
                                            ] || false
                                          : question.id === "authentication"
                                            ? initialConfiguration.features
                                                .authentication[
                                                option.id as keyof typeof initialConfiguration.features.authentication
                                              ] || false
                                            : question.id ===
                                                "realTimeNotifications"
                                              ? initialConfiguration.features
                                                  .realTimeNotifications[
                                                  option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                                ] || false
                                              : false
                                    }
                                    disabled={true}
                                    className="size-4 theme-mt-0.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="theme-font-sans theme-tracking">
                                  <p>Option not available</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Checkbox
                                checked={
                                  question.id === "databaseChoice"
                                    ? (option.id === "noDatabase" &&
                                        initialConfiguration.questions
                                          .useSupabase === "none") ||
                                      (option.id === "neondb" &&
                                        initialConfiguration.questions
                                          .useSupabase === "no") ||
                                      (option.id === "supabaseWithBetter" &&
                                        initialConfiguration.questions
                                          .useSupabase === "withBetterAuth") ||
                                      (option.id === "supabaseOnly" &&
                                        initialConfiguration.questions
                                          .useSupabase === "authOnly")
                                    : question.id === "payments"
                                      ? initialConfiguration.features.payments[
                                          option.id as keyof typeof initialConfiguration.features.payments
                                        ] || false
                                      : question.id === "authentication"
                                        ? initialConfiguration.features
                                            .authentication[
                                            option.id as keyof typeof initialConfiguration.features.authentication
                                          ] || false
                                        : question.id ===
                                            "realTimeNotifications"
                                          ? initialConfiguration.features
                                              .realTimeNotifications[
                                              option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                            ] || false
                                          : false
                                }
                                onCheckedChange={(checked) => {
                                  if (checked && isSubOptionDisabled) {
                                    return;
                                  }

                                  if (
                                    question.id === "databaseChoice" &&
                                    checked
                                  ) {
                                    let useSupabaseValue:
                                      | "none"
                                      | "no"
                                      | "withBetterAuth"
                                      | "authOnly" = "none";
                                    const techUpdates: Partial<
                                      InitialConfigurationType["technologies"]
                                    > = {};
                                    const featureUpdates: Partial<
                                      InitialConfigurationType["features"]
                                    > = {};

                                    if (option.id === "noDatabase") {
                                      useSupabaseValue = "none";
                                      techUpdates.supabase = false;
                                      techUpdates.neondb = false;
                                      techUpdates.betterAuth = false;
                                      techUpdates.prisma = false;
                                      techUpdates.postgresql = false;
                                      featureUpdates.authentication = {
                                        ...initialConfiguration.features
                                          .authentication,
                                        enabled: false,
                                      };
                                      featureUpdates.admin = {
                                        ...initialConfiguration.features.admin,
                                        enabled: false,
                                      };
                                      featureUpdates.fileStorage = false;
                                      featureUpdates.realTimeNotifications = {
                                        ...initialConfiguration.features
                                          .realTimeNotifications,
                                        enabled: false,
                                      };
                                    } else if (option.id === "neondb") {
                                      useSupabaseValue = "no";
                                      techUpdates.neondb = true;
                                      techUpdates.betterAuth = true;
                                      techUpdates.prisma = true;
                                      techUpdates.postgresql = true;
                                      techUpdates.supabase = false;
                                      featureUpdates.fileStorage = false;
                                      featureUpdates.realTimeNotifications = {
                                        ...initialConfiguration.features
                                          .realTimeNotifications,
                                        enabled: false,
                                      };
                                    } else if (
                                      option.id === "supabaseWithBetter"
                                    ) {
                                      useSupabaseValue = "withBetterAuth";
                                      techUpdates.supabase = true;
                                      techUpdates.betterAuth = true;
                                      techUpdates.prisma = true;
                                      techUpdates.postgresql = true;
                                      techUpdates.neondb = false;
                                    } else if (option.id === "supabaseOnly") {
                                      useSupabaseValue = "authOnly";
                                      techUpdates.supabase = true;
                                      techUpdates.prisma = true;
                                      techUpdates.postgresql = true;
                                      techUpdates.betterAuth = false;
                                      techUpdates.neondb = false;
                                      const adminUpdates = {
                                        ...initialConfiguration.features.admin,
                                      };
                                      if (
                                        adminUpdates.orgAdmins ||
                                        adminUpdates.orgMembers
                                      ) {
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
                                  } else if (question.id === "payments") {
                                    updatePaymentOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (question.id === "authentication") {
                                    updateAuthenticationOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (
                                    question.id === "realTimeNotifications"
                                  ) {
                                    updateRealTimeNotificationsOption(
                                      option.id,
                                      checked === true
                                    );
                                  }
                                }}
                                className="size-4 mt-0.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                              />
                            )}
                            <span className="theme-text-foreground text-sm theme-font-sans theme-tracking">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </TooltipProvider>
  );
};

const SchemaTab = () => {
  const {
    tables,
    addTable,
    deleteTable,
    updateTableName,
    updateTableSchema,
    addColumn,
    deleteColumn,
    updateColumn,
  } = useDatabaseStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getQuestionColor = (questionId?: string): string => {
    if (!questionId) return "";
    const colorMap: Record<string, string> = {
      databaseChoice: "theme-border-l-chart-1 border-l-4",
      authentication: "theme-border-l-chart-2 border-l-4",
      fileStorage: "theme-border-l-chart-3 border-l-4",
      payments: "theme-border-l-chart-4 border-l-4",
      realTimeNotifications: "theme-border-l-chart-5 border-l-4",
    };
    return colorMap[questionId] || "";
  };

  return (
    <div className="theme-bg-muted theme-radius overflow-auto theme-shadow theme-p-4">
      <Accordion type="multiple" className="flex flex-col theme-gap-2">
        {tables.map((table) => (
          <AccordionItem
            key={table.id}
            value={table.id}
            className={cn(
              "theme-bg-card theme-border-border theme-radius theme-shadow",
              getQuestionColor(table.questionId)
            )}
          >
            <AccordionTrigger className="hover:no-underline theme-px-4 theme-py-2">
              <div className="flex items-center theme-gap-2 w-full">
                {table.isDefault && (
                  <Lock className="w-4 h-4 theme-text-muted-foreground" />
                )}
                <span className="theme-text-foreground font-semibold">
                  {table.schema}.{table.name}
                </span>
                {!table.isDefault && (
                  <Popover
                    open={deleteConfirmId === table.id}
                    onOpenChange={(open) =>
                      setDeleteConfirmId(open ? table.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 theme-ml-auto"
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
                          Delete table {table.name}?
                        </p>
                        <div className="flex theme-gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              deleteTable(table.id);
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
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="theme-px-4 theme-pb-4">
              <div className="flex flex-col theme-gap-1">
                {table.columns.map((column) => (
                  <ColumnLine
                    key={column.id}
                    table={table}
                    column={column}
                    onUpdate={updateColumn}
                    onDelete={deleteColumn}
                  />
                ))}
                <AddColumnPopover table={table} onAddColumn={addColumn} />
                <div className="theme-mt-2 theme-pt-2 border-t theme-border-border">
                  <div className="flex items-center theme-gap-2">
                    <span className="text-xs theme-text-muted-foreground">
                      Schema:
                    </span>
                    <Select
                      value={table.schema}
                      onValueChange={(schema) =>
                        updateTableSchema(table.id, schema as "auth" | "public")
                      }
                    >
                      <SelectTrigger className="h-6 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auth">auth</SelectItem>
                        <SelectItem value="public">public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="theme-mt-4">
        <AddTablePopover onAddTable={addTable} />
      </div>
    </div>
  );
};

const PluginsTab = () => {
  const { plugins } = useDatabaseStore();

  const getQuestionColor = (questionId?: string): string => {
    if (!questionId) return "";
    const colorMap: Record<string, string> = {
      databaseChoice: "theme-border-l-chart-1 border-l-4",
      authentication: "theme-border-l-chart-2 border-l-4",
      fileStorage: "theme-border-l-chart-3 border-l-4",
      payments: "theme-border-l-chart-4 border-l-4",
      realTimeNotifications: "theme-border-l-chart-5 border-l-4",
    };
    return colorMap[questionId] || "";
  };

  const authPlugins = plugins.filter((p) => p.file === "auth" && p.enabled);
  const authClientPlugins = plugins.filter((p) => p.file === "auth-client" && p.enabled);

  const renderPluginCard = (plugin: typeof plugins[0]) => {
    return (
      <div
        key={plugin.id}
        className={cn(
          "flex items-center theme-px-3 theme-py-2 theme-bg-muted theme-radius theme-gap-2",
          getQuestionColor(plugin.questionId)
        )}
      >
        <div className="flex-1">
          <div className="font-medium text-sm theme-text-foreground">
            {plugin.name}
          </div>
          {plugin.description && (
            <div className="text-xs theme-text-muted-foreground theme-font-sans theme-tracking">
              {plugin.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="theme-bg-muted theme-radius overflow-auto theme-shadow theme-p-4 flex flex-col theme-gap-4">
      <div className="theme-bg-card theme-border-border theme-radius theme-shadow">
        <div className="theme-bg-foreground-muted theme-px-4 theme-py-3 theme-font-mono font-semibold text-sm border-b theme-border-border">
          lib/auth.ts
        </div>
        <div className="theme-p-4 flex flex-col theme-gap-2">
          {authPlugins.length === 0 ? (
            <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
              No plugins configured
            </p>
          ) : (
            <>
              <div className="theme-mb-2">
                <p className="text-xs theme-text-muted-foreground theme-font-sans theme-tracking">
                  {authPlugins.length} plugin{authPlugins.length !== 1 ? 's' : ''} configured
                </p>
              </div>
              {authPlugins.map(renderPluginCard)}
            </>
          )}
        </div>
      </div>

      <div className="theme-bg-card theme-border-border theme-radius theme-shadow">
        <div className="theme-bg-foreground-muted theme-px-4 theme-py-3 theme-font-mono font-semibold text-sm border-b theme-border-border">
          lib/auth-client.ts
        </div>
        <div className="theme-p-4 flex flex-col theme-gap-2">
          {authClientPlugins.length === 0 ? (
            <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
              No plugins configured
            </p>
          ) : (
            <>
              <div className="theme-mb-2">
                <p className="text-xs theme-text-muted-foreground theme-font-sans theme-tracking">
                  {authClientPlugins.length} plugin{authClientPlugins.length !== 1 ? 's' : ''} configured
                </p>
              </div>
              {authClientPlugins.map(renderPluginCard)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const RLSTab = () => {
  const {
    rlsPolicies,
    tables,
    addRLSPolicy,
    deleteRLSPolicy,
    updateRLSPolicy,
  } = useDatabaseStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const publicTables = tables.filter((t) => t.schema === "public");

  return (
    <div className="theme-bg-muted theme-radius overflow-auto theme-shadow theme-p-4">
      <div className="theme-mb-4">
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
          Row Level Security policies for public schema tables
        </p>
      </div>

      <Accordion type="multiple" className="flex flex-col theme-gap-2">
        {publicTables.map((table) => {
          const tablePolicies = rlsPolicies.filter(
            (p) => p.tableId === table.id
          );

          return (
            <AccordionItem
              key={table.id}
              value={table.id}
              className="theme-bg-card theme-border-border theme-radius theme-shadow"
            >
              <AccordionTrigger className="hover:no-underline theme-px-4 theme-py-2">
                <div className="flex items-center theme-gap-2 w-full">
                  <span className="theme-text-foreground font-semibold">
                    {table.schema}.{table.name}
                  </span>
                  <span className="theme-text-muted-foreground text-xs theme-font-sans theme-tracking">
                    ({tablePolicies.length} policies)
                  </span>
                  {tablePolicies.length === 0 && (
                    <Popover>
                      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 theme-ml-1"
                        >
                          <AlertTriangle className="h-4 w-4 theme-text-warning" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 theme-p-3 theme-shadow"
                        align="start"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col theme-gap-2">
                          <div className="flex items-start theme-gap-2">
                            <AlertTriangle className="h-4 w-4 theme-text-warning theme-mt-0.5 shrink-0" />
                            <div className="flex flex-col theme-gap-1">
                              <p className="text-sm font-semibold theme-text-foreground">
                                No RLS Policies
                              </p>
                              <p className="text-xs theme-text-muted-foreground">
                                All public schema tables should have Row Level Security (RLS) policies applied to protect data access. Without RLS policies, this table may be accessible to unauthorized users.
                              </p>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="theme-px-4 theme-pb-4">
                <div className="flex flex-col theme-gap-2">
                  {tablePolicies.length === 0 ? (
                    <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
                      No policies defined
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
                                    operation:
                                      operation as RLSPolicy["operation"],
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
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {publicTables.length === 0 && (
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
          No public schema tables found. Add tables in the Schema tab.
        </p>
      )}
    </div>
  );
};

export const DatabaseConfiguration = () => {
  const { activeTab, setActiveTab, initializeFromConfig } = useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

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

  const isBetterAuthEnabled = initialConfiguration.technologies.betterAuth;
  const isSupabaseOnly =
    initialConfiguration.questions.useSupabase === "authOnly";
  const isNoDatabaseSelected =
    initialConfiguration.questions.useSupabase === "none";

  return (
    <div className="flex theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking">
      <div className="w-80 shrink-0 theme-bg-muted theme-radius theme-p-4 theme-shadow overflow-auto">
        <ConfigurationSummary />
      </div>

      <div className="flex-1 min-w-0">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="theme-mb-4">
            <TabsTrigger value="network" disabled={isNoDatabaseSelected}>
              Network
            </TabsTrigger>
            <TabsTrigger value="schema" disabled={isNoDatabaseSelected}>
              Schema
            </TabsTrigger>
            <TabsTrigger
              value="plugins"
              disabled={
                !isBetterAuthEnabled || isSupabaseOnly || isNoDatabaseSelected
              }
            >
              Plugins
            </TabsTrigger>
            <TabsTrigger value="rls" disabled={isNoDatabaseSelected}>
              RLS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network">
            {isNoDatabaseSelected ? null : <NetworkVisualization />}
          </TabsContent>

          <TabsContent value="schema">
            {isNoDatabaseSelected ? null : <SchemaTab />}
          </TabsContent>

          <TabsContent value="plugins">
            {isNoDatabaseSelected ? null : <PluginsTab />}
          </TabsContent>

          <TabsContent value="rls">
            {isNoDatabaseSelected ? null : <RLSTab />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
