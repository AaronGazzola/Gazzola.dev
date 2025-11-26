"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { cn } from "@/lib/utils";
import {
  Apple,
  BotMessageSquare,
  BotOff,
  Building2,
  Fingerprint,
  Github,
  KeyRound,
  Loader2,
  Mail,
  Plus,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiGoogle, SiSupabase } from "react-icons/si";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import { DATABASE_TEMPLATES } from "./DatabaseConfiguration.types";
import { BetterAuthIcon, technologies } from "./DatabaseConfiguration.icons";
import { EnumsCollapsible } from "./DatabaseConfiguration.enums";
import { SchemaCollapsible } from "./DatabaseConfiguration.schemas";
import {
  generateDatabaseSchemaPrompt,
  parseDatabaseSchemaFromResponse,
} from "./DatabaseConfiguration.ai";

const isDevelopment = process.env.NODE_ENV === "development";

export const DatabaseConfiguration = () => {
  const {
    tables,
    initializeFromConfig,
    addTable,
    updateTableName,
    updateTableSchema,
    deleteTable,
    deleteSchema,
    getAvailableSchemasWithConfig,
    setTablesFromAI,
    setEnumsFromAI,
  } = useDatabaseStore();
  const {
    initialConfiguration,
    setSectionInclude,
    updateInitialConfiguration,
    updateAdminOption,
    updateAuthenticationOption,
    appStructure,
    data,
    databaseGenerated,
    setDatabaseGenerated,
    readmeGenerated,
  } = useEditorStore();
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);
  const [expandedTableId, setExpandedTableId] = useState<string | null>(null);
  const [expandedEnums, setExpandedEnums] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [generatePopoverOpen, setGeneratePopoverOpen] = useState(false);
  const [isAddingSchema, setIsAddingSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");

  const readmeNode = data.flatIndex["readme"];
  const readmeContent = readmeNode?.type === "file" ? readmeNode.content : "";

  const { mutate: generateSchema, isPending: isGenerating } =
    useCodeGeneration((response) => {
      conditionalLog(
        {
          message: "AI response received for database schema generation",
          responseContent: response.content,
        },
        { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
      );

      const parsed = parseDatabaseSchemaFromResponse(response.content);

      conditionalLog(
        {
          message: "Parsed database schema response",
          parsed,
          parseSuccess: !!parsed,
        },
        { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
      );

      if (parsed) {
        const { configuration } = parsed;

        const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};
        if (configuration.databaseProvider === "supabase") {
          techUpdates.supabase = true;
          techUpdates.betterAuth = false;
          techUpdates.neondb = false;
          techUpdates.prisma = true;
          techUpdates.postgresql = true;
        } else if (configuration.databaseProvider === "neondb") {
          techUpdates.supabase = false;
          techUpdates.betterAuth = true;
          techUpdates.neondb = true;
          techUpdates.prisma = true;
          techUpdates.postgresql = true;
        } else if (configuration.databaseProvider === "both") {
          techUpdates.supabase = true;
          techUpdates.betterAuth = true;
          techUpdates.neondb = false;
          techUpdates.prisma = true;
          techUpdates.postgresql = true;
        } else {
          techUpdates.supabase = false;
          techUpdates.betterAuth = false;
          techUpdates.neondb = false;
          techUpdates.prisma = false;
          techUpdates.postgresql = false;
        }

        updateInitialConfiguration({
          questions: {
            ...initialConfiguration.questions,
            databaseProvider: configuration.databaseProvider,
          },
          database: {
            hosting:
              configuration.databaseProvider === "supabase" || configuration.databaseProvider === "both"
                ? "supabase"
                : configuration.databaseProvider === "neondb"
                  ? "neondb"
                  : "postgresql",
          },
          technologies: {
            ...initialConfiguration.technologies,
            ...techUpdates,
          },
        });

        Object.entries(configuration.roles).forEach(([roleId, enabled]) => {
          updateAdminOption(roleId, enabled as boolean);
        });

        Object.entries(configuration.authentication).forEach(([authId, enabled]) => {
          updateAuthenticationOption(authId, enabled as boolean);
        });

        setTablesFromAI(parsed.tables);
        setEnumsFromAI(parsed.enums);
        setDatabaseGenerated(true);
        setGeneratePopoverOpen(false);

        conditionalLog(
          {
            message: "Applied database configuration from AI",
            databaseProvider: configuration.databaseProvider,
            roles: configuration.roles,
            authentication: configuration.authentication,
            tableCount: parsed.tables.length,
            enumCount: parsed.enums.length,
          },
          { label: LOG_LABELS.DATABASE }
        );
      }
    });

  const handleGenerateFromReadme = () => {
    if (!readmeContent) return;

    const prompt = generateDatabaseSchemaPrompt(
      readmeContent,
      appStructure,
      DATABASE_TEMPLATES
    );

    conditionalLog(
      {
        message: "Sending prompt for database schema generation",
        prompt,
        readmeContentLength: readmeContent.length,
        appStructureLength: appStructure.length,
      },
      { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
    );

    generateSchema({ prompt, maxTokens: 4000 });
  };

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

  const handleSchemaToggle = (schema: string) => {
    if (expandedSchema === schema) {
      setExpandedSchema(null);
      setExpandedTableId(null);
    } else {
      setExpandedSchema(schema);
      setExpandedTableId(null);
    }
  };

  const handleTableToggle = (tableId: string) => {
    if (expandedTableId === tableId) {
      setExpandedTableId(null);
    } else {
      setExpandedTableId(tableId);
    }
  };

  const handleAddTableToSchema = (schema: string, tableName: string) => {
    const newTableId = addTable(tableName, schema);
    setExpandedSchema(schema);
    setExpandedTableId(newTableId);
  };

  const handleAddSchema = (schemaName: string) => {
    if (!schemaName.trim()) return;
    const trimmedName = schemaName.trim();
    const newTableId = addTable("new-table", trimmedName);
    setExpandedSchema(trimmedName);
    setExpandedTableId(newTableId);
  };

  const handleDeleteTable = (tableId: string) => {
    deleteTable(tableId);
    if (expandedTableId === tableId) {
      setExpandedTableId(null);
    }
  };

  const handleDeleteSchema = (schema: string) => {
    deleteSchema(schema);
    if (expandedSchema === schema) {
      setExpandedSchema(null);
      setExpandedTableId(null);
    }
  };

  const handleUpdateSchemaName = (oldSchema: string, newName: string) => {
    tables
      .filter((t) => t.schema === oldSchema)
      .forEach((t) => {
        updateTableSchema(t.id, newName);
      });
    if (expandedSchema === oldSchema) {
      setExpandedSchema(newName);
    }
  };

  if (!mounted) {
    return null;
  }

  const authMethods = [
    {
      id: "magicLink",
      label: "Magic Link",
      description: "Passwordless authentication via email links",
      icon: Mail,
    },
    {
      id: "emailPassword",
      label: "Email & Password",
      description: "Traditional email and password authentication",
      icon: Mail,
    },
    {
      id: "otp",
      label: "OTP (One-Time Password)",
      description: "Email-based one-time password authentication",
      icon: Smartphone,
    },
    {
      id: "twoFactor",
      label: "Two-Factor Authentication (2FA)",
      description: "TOTP/OTP two-factor authentication for enhanced security",
      icon: ShieldCheck,
    },
    {
      id: "passkey",
      label: "Passkey (WebAuthn)",
      description:
        "Passwordless authentication using biometrics or security keys",
      icon: Fingerprint,
    },
    {
      id: "anonymous",
      label: "Anonymous Sessions",
      description: "Allow users to use the app without authentication",
      icon: UserX,
    },
    {
      id: "googleAuth",
      label: "Google OAuth",
      description: "Sign in with Google accounts",
      icon: SiGoogle,
    },
    {
      id: "githubAuth",
      label: "GitHub OAuth",
      description: "Sign in with GitHub accounts",
      icon: Github,
    },
    {
      id: "appleAuth",
      label: "Apple Sign In",
      description: "Sign in with Apple ID",
      icon: Apple,
    },
    {
      id: "passwordOnly",
      label: "Password only",
      description: "Basic password authentication",
      icon: KeyRound,
    },
  ];

  const roleOptions = [
    { id: "admin", label: "Admin", icon: Shield },
    { id: "superAdmin", label: "Super Admin", icon: Users },
    {
      id: "organizations",
      label: "Organizations",
      disabled: !initialConfiguration.technologies.betterAuth,
      icon: Building2,
    },
  ];

  const roleDescriptions = {
    admin: "Regular admin users with elevated permissions",
    superAdmin:
      "Super admins have full access and can manage all users and content",
    organizations:
      "Enable organization-based access with org-admin and org-member roles",
  };

  const isGenerateDisabled = !isDevelopment && databaseGenerated;
  const hasReadme = readmeGenerated && readmeContent;

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto relative">
      <Popover open={generatePopoverOpen} onOpenChange={setGeneratePopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 z-10 rounded-full",
              !isGenerateDisabled && "theme-bg-primary theme-text-primary-foreground hover:opacity-90"
            )}
            disabled={isGenerateDisabled || isGenerating}
            title={isGenerateDisabled ? "Schema already generated" : "Generate from README"}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isGenerateDisabled ? (
              <BotOff className="h-4 w-4" />
            ) : (
              <BotMessageSquare className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
          <div className="flex flex-col theme-gap-2">
            {hasReadme ? (
              <>
                <p className="text-sm theme-text-foreground font-semibold">
                  Generate Database Configuration
                </p>
                <p className="text-xs theme-text-muted-foreground">
                  Analyzes your README to configure database provider, authentication methods, user roles, and generate tables/enums.
                </p>
                <Button
                  onClick={handleGenerateFromReadme}
                  disabled={isGenerating}
                  size="sm"
                  className="w-full theme-gap-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BotMessageSquare className="h-4 w-4" />
                      Generate Configuration
                    </>
                  )}
                </Button>
              </>
            ) : (
              <p className="text-xs theme-text-muted-foreground">
                Please generate a README first to use this feature.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col theme-gap-4">
        <div>
          <h3 className="text-lg font-semibold theme-mb-2">Do you need a database?</h3>
          <p className="text-sm theme-text-muted-foreground theme-mb-3 font-semibold">
            Choose your database and authentication provider.
          </p>
          <div className="flex flex-col xs:flex-row theme-gap-3">
            <div
              onClick={() => {
                const currentSupabase =
                  initialConfiguration.technologies.supabase;
                const techUpdates: Partial<
                  InitialConfigurationType["technologies"]
                > = {};

                techUpdates.supabase = !currentSupabase;
                techUpdates.prisma =
                  !currentSupabase ||
                  initialConfiguration.technologies.betterAuth;
                techUpdates.postgresql =
                  !currentSupabase ||
                  initialConfiguration.technologies.betterAuth;

                if (
                  !currentSupabase &&
                  !initialConfiguration.technologies.betterAuth
                ) {
                  techUpdates.neondb = false;
                }

                const newProvider = !currentSupabase
                  ? initialConfiguration.technologies.betterAuth
                    ? "both"
                    : "supabase"
                  : initialConfiguration.technologies.betterAuth
                    ? "neondb"
                    : "none";

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: !currentSupabase
                      ? "supabase"
                      : initialConfiguration.technologies.betterAuth
                        ? "neondb"
                        : "postgresql",
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
                <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking">
                  Supabase
                </h4>
              </div>
            </div>

            <div
              onClick={() => {
                const currentBetterAuth =
                  initialConfiguration.technologies.betterAuth;
                const techUpdates: Partial<
                  InitialConfigurationType["technologies"]
                > = {};

                techUpdates.betterAuth = !currentBetterAuth;
                techUpdates.neondb =
                  !currentBetterAuth &&
                  !initialConfiguration.technologies.supabase;
                techUpdates.prisma =
                  !currentBetterAuth ||
                  initialConfiguration.technologies.supabase;
                techUpdates.postgresql =
                  !currentBetterAuth ||
                  initialConfiguration.technologies.supabase;

                const newProvider = !currentBetterAuth
                  ? initialConfiguration.technologies.supabase
                    ? "both"
                    : "neondb"
                  : initialConfiguration.technologies.supabase
                    ? "supabase"
                    : "none";

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: !currentBetterAuth
                      ? initialConfiguration.technologies.supabase
                        ? "supabase"
                        : "neondb"
                      : initialConfiguration.technologies.supabase
                        ? "supabase"
                        : "postgresql",
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
                <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking">
                  Better Auth
                </h4>
              </div>
            </div>
          </div>

          {initialConfiguration.questions.databaseProvider !== "none" && (
            <div className="flex flex-col theme-gap-3 theme-mt-4">
              <div className="flex flex-wrap theme-gap-1">
                {(() => {
                  let techIds: string[] = [];
                  if (
                    initialConfiguration.questions.databaseProvider ===
                    "supabase"
                  ) {
                    techIds = ["supabase", "prisma", "postgresql"];
                  } else if (
                    initialConfiguration.questions.databaseProvider === "neondb"
                  ) {
                    techIds = ["neondb", "betterAuth", "prisma", "postgresql"];
                  } else if (
                    initialConfiguration.questions.databaseProvider === "both"
                  ) {
                    techIds = [
                      "supabase",
                      "betterAuth",
                      "prisma",
                      "postgresql",
                    ];
                  }
                  return techIds.map((techId) => {
                    const tech = technologies.find((t) => t.id === techId);
                    if (!tech) return null;
                    const Icon = tech.icon;
                    const isActive =
                      initialConfiguration.technologies[
                        techId as keyof InitialConfigurationType["technologies"]
                      ];
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
                {initialConfiguration.questions.databaseProvider ===
                  "supabase" &&
                  "Supabase for all backend logic and database functionality. Excellent for enterprise audit compliance"}
                {initialConfiguration.questions.databaseProvider === "neondb" &&
                  "Better-Auth with a NeonDB Postgres DB for low friction and high value development"}
                {initialConfiguration.questions.databaseProvider === "both" &&
                  "Supabase and Better-Auth for maximum flexibility and functionality"}
              </p>
            </div>
          )}
          {!initialConfiguration.technologies.supabase &&
            !initialConfiguration.technologies.betterAuth && (
              <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                No database required, this app is front-end only
              </p>
            )}
        </div>

        {!isNoDatabaseSelected && (
          <>
            <div>
              <h3 className="text-lg font-semibold theme-mb-2">
                Does your app use role access?
              </h3>
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
                    <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Admin:</span>{" "}
                      {roleDescriptions.admin}
                    </p>
                  )}
                  {initialConfiguration.features.admin.superAdmin && (
                    <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Super Admin:</span>{" "}
                      {roleDescriptions.superAdmin}
                    </p>
                  )}
                  {initialConfiguration.features.admin.organizations && (
                    <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                      <span className="font-bold">Organizations:</span>{" "}
                      {roleDescriptions.organizations}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold theme-mb-2">
                Can users sign in to your app?
              </h3>
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
                              <Icon className="w-5 h-5 theme-text-foreground shrink-0" />
                              <span className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking">
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
        <div className="theme-bg-card theme-radius theme-shadow overflow-auto border theme-border-border theme-p-4">
          <div className="flex flex-col theme-gap-2">
            <EnumsCollapsible
              isExpanded={expandedEnums}
              onToggle={() => setExpandedEnums(!expandedEnums)}
            />
            {getAvailableSchemasWithConfig(initialConfiguration).map(
              (schema) => {
                const schemaTables = tables.filter((t) => t.schema === schema);
                const isSystemSchema =
                  schema === "auth" || schema === "better_auth";
                const isEditable =
                  schema !== "auth" &&
                  schema !== "better_auth" &&
                  schema !== "public";

                return (
                  <SchemaCollapsible
                    key={schema}
                    schema={schema}
                    tables={schemaTables}
                    isExpanded={expandedSchema === schema}
                    onToggle={() => handleSchemaToggle(schema)}
                    expandedTableId={expandedTableId}
                    onTableToggle={handleTableToggle}
                    onAddTable={(tableName) =>
                      handleAddTableToSchema(schema, tableName)
                    }
                    onUpdateTableName={updateTableName}
                    onDeleteTable={handleDeleteTable}
                    onUpdateSchemaName={(name) =>
                      handleUpdateSchemaName(schema, name)
                    }
                    onDeleteSchema={() => handleDeleteSchema(schema)}
                    isEditable={isEditable}
                    isSystemSchema={isSystemSchema}
                  />
                );
              }
            )}
            {isAddingSchema ? (
              <div className="theme-bg-muted theme-radius theme-p-2">
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
                  className="h-7 theme-px-2 text-base theme-shadow theme-font-mono"
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSchema(true)}
                className="h-7 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm w-fit"
              >
                <Plus className="h-3 w-3" />
                Add schema
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
