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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/editor/ui/accordion";
import {
  Bell,
  ChevronDown,
  Copy,
  CreditCard,
  Database,
  Lock,
  Plus,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  PRISMA_TYPES,
  PrismaColumn,
  PrismaTable,
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
  const typeStr = column.isArray ? `${column.type}[]` : column.type;
  const optionalStr = column.isOptional ? "?" : "";

  return (
    <div className="group flex items-center hover:theme-bg-accent theme-px-2 theme-py-0.5 theme-radius theme-font-mono text-sm">
      <span className="theme-text-muted-foreground theme-mr-2"> </span>
      <EditableText
        value={column.name}
        onChange={(name) => onUpdate(table.id, column.id, { name })}
        disabled={column.isDefault}
        className="theme-text-foreground min-w-[120px]"
      />
      <span className="theme-text-muted-foreground theme-mx-2">{"  "}</span>
      {column.isDefault ? (
        <span className="theme-text-chart-3">{typeStr}</span>
      ) : (
        <Select
          value={column.type}
          onValueChange={(type) => onUpdate(table.id, column.id, { type })}
        >
          <SelectTrigger className="h-5 w-auto theme-px-1 border-none shadow-none theme-bg-transparent theme-text-chart-3 theme-font-mono text-sm">
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
      <span className="theme-text-chart-3">{optionalStr}</span>
      <span className="theme-text-muted-foreground theme-mx-2">{"  "}</span>
      {column.attributes.map((attr, i) => (
        <span key={i} className="theme-text-chart-4 theme-mr-1">
          {attr}
        </span>
      ))}
      {!column.isDefault && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 opacity-0 group-hover:opacity-100 theme-ml-auto"
          onClick={() => onDelete(table.id, column.id)}
        >
          <X className="h-3 w-3 theme-text-destructive" />
        </Button>
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

const ModelBlock = ({
  table,
  onUpdateTableName,
  onDeleteTable,
  onUpdateColumn,
  onDeleteColumn,
  onAddColumn,
}: {
  table: PrismaTable;
  onUpdateTableName: (tableId: string, name: string) => void;
  onDeleteTable: (tableId: string) => void;
  onUpdateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
  onDeleteColumn: (tableId: string, columnId: string) => void;
  onAddColumn: (tableId: string, column: Omit<PrismaColumn, "id">) => void;
}) => {
  return (
    <div className="theme-mb-4">
      <div className="group flex items-center theme-px-2 theme-py-1 hover:theme-bg-accent theme-radius theme-font-mono text-sm">
        <span className="theme-text-keyword font-bold">model</span>
        <span className="theme-mx-2"></span>
        {table.isDefault && (
          <Lock className="w-3 h-3 theme-text-muted-foreground theme-mr-1" />
        )}
        <EditableText
          value={table.name}
          onChange={(name) => onUpdateTableName(table.id, name)}
          disabled={table.isDefault}
          className="theme-text-foreground font-semibold"
        />
        <span className="theme-mx-2 theme-text-foreground">{" {"}</span>
        {!table.isDefault && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 opacity-0 group-hover:opacity-100 theme-ml-auto"
            onClick={() => onDeleteTable(table.id)}
          >
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          </Button>
        )}
      </div>

      {table.columns.map((column) => (
        <ColumnLine
          key={column.id}
          table={table}
          column={column}
          onUpdate={onUpdateColumn}
          onDelete={onDeleteColumn}
        />
      ))}

      {!table.isDefault && (
        <div className="theme-pl-2">
          <AddColumnPopover table={table} onAddColumn={onAddColumn} />
        </div>
      )}

      {table.uniqueConstraints.length > 0 && (
        <>
          <div className="theme-px-2 theme-py-0.5 theme-font-mono text-sm">
            <span className="theme-text-muted-foreground"> </span>
          </div>
          {table.uniqueConstraints.map((constraint, i) => (
            <div
              key={i}
              className="theme-px-2 theme-py-0.5 theme-font-mono text-sm"
            >
              <span className="theme-text-muted-foreground"> </span>
              <span className="theme-text-chart-4">
                @@unique([{constraint.join(", ")}])
              </span>
            </div>
          ))}
        </>
      )}

      <div className="theme-px-2 theme-py-0.5 theme-font-mono text-sm">
        <span className="theme-text-muted-foreground"> </span>
      </div>
      <div className="theme-px-2 theme-py-0.5 theme-font-mono text-sm">
        <span className="theme-text-muted-foreground"> </span>
        <span className="theme-text-chart-4">
          @@schema(&quot;{table.schema}&quot;)
        </span>
      </div>
      <div className="theme-px-2 theme-py-1 theme-font-mono text-sm">
        <span className="theme-text-foreground">{"}"}</span>
      </div>
    </div>
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
    },
    {
      id: "payments",
      question: "Does your app process payments?",
      icon: CreditCard,
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
        initialConfiguration.features.realTimeNotifications.emailNotifications ||
        initialConfiguration.features.realTimeNotifications.inAppNotifications
      );
    }

    return false;
  };

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

          return (
            <AccordionItem
              key={question.id}
              value={question.id}
              className="transition-all duration-200 border-none relative"
            >
              <AccordionTrigger
                className={cn(
                  "flex items-center w-full theme-py-1 theme-px-2 theme-pr-10 hover:no-underline [&>svg]:hidden [&[data-state=open]_.chevron]:rotate-180"
                )}
              >
                <div className="flex items-center theme-gap-2 flex-1 min-w-0">
                  <Icon className="theme-text-foreground w-5 h-5 transition-colors duration-200 shrink-0" />
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
                  disabled={question.subOptions && question.subOptions.length > 0}
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
                                        : question.id === "realTimeNotifications"
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
    addColumn,
    deleteColumn,
    updateColumn,
  } = useDatabaseStore();

  return (
    <div className="theme-font-mono text-sm theme-bg-muted theme-p-4 theme-radius overflow-auto theme-shadow">
      <div className="theme-mb-4">
        <div className="theme-text-keyword font-bold">datasource</div>
        <div className="theme-pl-2">
          <div className="theme-text-foreground">db {"{"}</div>
          <div className="theme-pl-2">
            <span className="theme-text-chart-3">provider</span>
            <span className="theme-text-muted-foreground"> = </span>
            <span className="theme-text-chart-1">&quot;postgresql&quot;</span>
          </div>
          <div className="theme-pl-2">
            <span className="theme-text-chart-3">url</span>
            <span className="theme-text-muted-foreground"> = </span>
            <span className="theme-text-chart-4">env(</span>
            <span className="theme-text-chart-1">&quot;DATABASE_URL&quot;</span>
            <span className="theme-text-chart-4">)</span>
          </div>
          <div className="theme-pl-2">
            <span className="theme-text-chart-3">schemas</span>
            <span className="theme-text-muted-foreground"> = </span>
            <span className="theme-text-foreground">[</span>
            <span className="theme-text-chart-1">&quot;auth&quot;</span>
            <span className="theme-text-foreground">, </span>
            <span className="theme-text-chart-1">&quot;public&quot;</span>
            <span className="theme-text-foreground">]</span>
          </div>
          <div className="theme-text-foreground">{"}"}</div>
        </div>
      </div>

      <div className="theme-mb-6">
        <div className="theme-text-keyword font-bold">generator</div>
        <div className="theme-pl-2">
          <div className="theme-text-foreground">client {"{"}</div>
          <div className="theme-pl-2">
            <span className="theme-text-chart-3">provider</span>
            <span className="theme-text-muted-foreground"> = </span>
            <span className="theme-text-chart-1">
              &quot;prisma-client-js&quot;
            </span>
          </div>
          <div className="theme-text-foreground">{"}"}</div>
        </div>
      </div>

      {tables.map((table) => (
        <ModelBlock
          key={table.id}
          table={table}
          onUpdateTableName={updateTableName}
          onDeleteTable={deleteTable}
          onUpdateColumn={updateColumn}
          onDeleteColumn={deleteColumn}
          onAddColumn={addColumn}
        />
      ))}

      <AddTablePopover onAddTable={addTable} />
    </div>
  );
};

const CodeTab = ({ code, title }: { code: string; title: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative theme-bg-muted theme-radius overflow-auto theme-shadow">
      <div className="theme-bg-info theme-text-info-foreground theme-px-4 theme-py-2 text-sm theme-font-sans theme-tracking">
        ✨ Auto-generated from your configuration
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 theme-shadow"
        onClick={handleCopy}
      >
        <Copy className="h-3 w-3" />
      </Button>
      {copied && (
        <span className="absolute top-2 right-10 text-xs theme-text-success theme-font-sans theme-tracking">
          Copied!
        </span>
      )}
      <pre className="theme-p-4 theme-font-mono text-sm overflow-x-auto theme-text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const RLSTab = () => {
  const { rlsPolicies, tables, addRLSPolicy, deleteRLSPolicy } =
    useDatabaseStore();
  const [selectedTable, setSelectedTable] = useState<string>("");

  const handleAddPolicy = () => {
    if (!selectedTable) return;

    addRLSPolicy({
      tableId: selectedTable,
      name: "New policy",
      operation: "SELECT",
      using: "true",
    });
  };

  return (
    <div className="theme-font-mono text-sm theme-bg-muted theme-p-4 theme-radius overflow-auto theme-shadow">
      <div className="theme-mb-4 theme-font-sans theme-tracking theme-text-muted-foreground text-xs">
        Row Level Security policies for your Prisma tables
      </div>

      {rlsPolicies.map((policy) => {
        const table = tables.find((t) => t.id === policy.tableId);
        if (!table) return null;

        return (
          <div
            key={policy.id}
            className="group theme-mb-4 hover:theme-bg-accent theme-p-2 theme-radius"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="theme-text-keyword">CREATE POLICY </span>
                <span className="theme-text-chart-1">
                  &quot;{policy.name}&quot;
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-0 group-hover:opacity-100"
                onClick={() => deleteRLSPolicy(policy.id)}
              >
                <Trash2 className="h-3 w-3 theme-text-destructive" />
              </Button>
            </div>
            <div className="theme-pl-2">
              <div>
                <span className="theme-text-keyword">ON </span>
                <span className="theme-text-chart-3">
                  {table.schema}.{table.name}
                </span>
              </div>
              <div>
                <span className="theme-text-keyword">FOR </span>
                <span className="theme-text-chart-3">{policy.operation}</span>
              </div>
              <div>
                <span className="theme-text-keyword">USING </span>
                <span className="theme-text-foreground">({policy.using})</span>
              </div>
              {policy.withCheck && (
                <div>
                  <span className="theme-text-keyword">WITH CHECK </span>
                  <span className="theme-text-foreground">
                    ({policy.withCheck})
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="theme-text-muted-foreground hover:theme-text-foreground"
          >
            <Plus className="h-3 w-3 theme-mr-1" />
            Add policy...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 theme-p-3 theme-shadow" align="start">
          <div className="flex flex-col theme-gap-2">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="h-7">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.schema}.{table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddPolicy}
              size="sm"
              disabled={!selectedTable}
            >
              Add Policy
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const DatabaseConfiguration = () => {
  const {
    activeTab,
    setActiveTab,
    generatePrismaSchema,
    generateAuthConfig,
    generateAuthClientConfig,
    generateRLSPolicies,
    initializeFromConfig,
  } = useDatabaseStore();
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
            <TabsTrigger value="schema">Prisma Schema</TabsTrigger>
            <TabsTrigger
              value="auth"
              disabled={!isBetterAuthEnabled || isSupabaseOnly}
            >
              auth.ts
            </TabsTrigger>
            <TabsTrigger
              value="auth-client"
              disabled={!isBetterAuthEnabled || isSupabaseOnly}
            >
              auth-client.ts
            </TabsTrigger>
            <TabsTrigger value="rls">RLS_Policies.SQL</TabsTrigger>
          </TabsList>

          <TabsContent value="schema">
            <SchemaTab />
          </TabsContent>

          <TabsContent value="auth">
            <CodeTab
              code={generateAuthConfig(initialConfiguration)}
              title="lib/auth.ts"
            />
          </TabsContent>

          <TabsContent value="auth-client">
            <CodeTab
              code={generateAuthClientConfig(initialConfiguration)}
              title="lib/auth-client.ts"
            />
          </TabsContent>

          <TabsContent value="rls">
            <RLSTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
