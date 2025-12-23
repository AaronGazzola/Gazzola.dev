"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
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
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
import { cn } from "@/lib/utils";
import {
  Apple,
  BotMessageSquare,
  Building2,
  Fingerprint,
  Github,
  HelpCircle,
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
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiGoogle, SiSupabase } from "react-icons/si";
import {
  generateDatabaseSchemaPrompt,
  parseDatabaseSchemaFromResponse,
} from "./DatabaseConfiguration.ai";
import { EnumsCollapsible } from "./DatabaseConfiguration.enums";
import { BetterAuthIcon, technologies } from "./DatabaseConfiguration.icons";
import { SchemaCollapsible } from "./DatabaseConfiguration.schemas";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import { DATABASE_TEMPLATES } from "./DatabaseConfiguration.types";

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
    setRLSPoliciesFromAI,
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
    databaseHelpPopoverOpened,
    setDatabaseHelpPopoverOpened,
  } = useEditorStore();
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);
  const [expandedTableId, setExpandedTableId] = useState<string | null>(null);
  const [expandedEnums, setExpandedEnums] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAddingSchema, setIsAddingSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [helpPopoverOpen, setHelpPopoverOpen] = useState(false);

  const readmeNode = data.flatIndex["readme"];
  const readmeContent = readmeNode?.type === "file" ? readmeNode.content : "";

  const { mutate: generateSchema, isPending: isGenerating } = useCodeGeneration(
    (response) => {
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

        const techUpdates: Partial<InitialConfigurationType["technologies"]> =
          {};
        if (configuration.databaseProvider === "supabase") {
          techUpdates.supabase = true;
          techUpdates.postgresql = true;
        } else {
          techUpdates.supabase = false;
          techUpdates.postgresql = false;
        }

        updateInitialConfiguration({
          questions: {
            ...initialConfiguration.questions,
            databaseProvider: configuration.databaseProvider,
          },
          database: {
            hosting:
              configuration.databaseProvider === "supabase"
                ? "supabase"
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

        Object.entries(configuration.authentication).forEach(
          ([authId, enabled]) => {
            updateAuthenticationOption(authId, enabled as boolean);
          }
        );

        setTablesFromAI(parsed.tables);
        setEnumsFromAI(parsed.enums);
        if (parsed.rlsPolicies && parsed.rlsPolicies.length > 0) {
          setRLSPoliciesFromAI(parsed.rlsPolicies, parsed.tables);
        }
        setDatabaseGenerated(true);

        conditionalLog(
          {
            message: "Applied database configuration from AI",
            databaseProvider: configuration.databaseProvider,
            roles: configuration.roles,
            authentication: configuration.authentication,
            tableCount: parsed.tables.length,
            enumCount: parsed.enums.length,
            rlsPolicyCount: parsed.rlsPolicies?.length || 0,
          },
          { label: LOG_LABELS.DATABASE }
        );
      }
    }
  );

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
    initialConfiguration.features.authentication.enabled,
    initialConfiguration.features.admin.admin,
    initialConfiguration.features.admin.superAdmin,
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
  ];

  const roleDescriptions = {
    admin: "Regular admin users with elevated permissions",
    superAdmin:
      "Super admins have full access and can manage all users and content",
  };

  const isGenerateDisabled = !isDevelopment && databaseGenerated;
  const hasReadme = readmeGenerated && readmeContent;
  const hasAppStructure = appStructure.length > 0;
  const canGenerate = hasReadme && hasAppStructure;

  if (!databaseGenerated) {
    const renderMessage = () => {
      if (!hasReadme && !hasAppStructure) {
        return (
          <>
            Generate a{" "}
            <Link href="/readme" className="theme-text-primary hover:underline">
              README
            </Link>{" "}
            and{" "}
            <Link
              href="/app-structure"
              className="theme-text-primary hover:underline"
            >
              App Structure
            </Link>{" "}
            first
          </>
        );
      }
      if (!hasReadme) {
        return (
          <>
            Generate your{" "}
            <Link href="/readme" className="theme-text-primary hover:underline">
              README
            </Link>{" "}
            and{" "}
            <Link
              href="/app-structure"
              className="theme-text-primary hover:underline"
            >
              App Structure
            </Link>{" "}
            first
          </>
        );
      }
      if (!hasAppStructure) {
        return (
          <>
            Generate your{" "}
            <Link
              href="/app-structure"
              className="theme-text-primary hover:underline"
            >
              App Structure
            </Link>{" "}
            first
          </>
        );
      }
      return "Generate your database configuration";
    };

    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center theme-py-12 theme-gap-4">
          <p className="text-base font-semibold theme-text-muted-foreground text-center">
            {renderMessage()}
          </p>
          <Button
            onClick={handleGenerateFromReadme}
            disabled={isGenerateDisabled || isGenerating || !canGenerate}
            className="theme-gap-2"
            title={
              isGenerateDisabled
                ? "Schema already generated"
                : !hasReadme
                  ? "Generate README first"
                  : !hasAppStructure
                    ? "Generate App Structure first"
                    : "Generate Database"
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BotMessageSquare className="h-4 w-4" />
                Generate Database
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto relative">
      <Popover
        open={helpPopoverOpen}
        onOpenChange={(open) => {
          setHelpPopoverOpen(open);
          if (open && !databaseHelpPopoverOpened) {
            setDatabaseHelpPopoverOpened(true);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 z-10 rounded-full ${!databaseHelpPopoverOpened ? "theme-bg-primary theme-text-primary-foreground hover:opacity-90" : ""}`}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="sm:w-96 theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking p-0 theme-radius max-h-[45vh] overflow-y-auto"
          style={{ borderColor: "var(--theme-primary)" }}
          align="end"
        >
          <div className="flex flex-col theme-gap-3 theme-bg-background p-4">
            <h4 className="font-semibold text-base theme-font-sans theme-tracking">
              Database Configuration
            </h4>
            <div className="flex flex-col theme-gap-2 text-sm">
              <p className="theme-font-sans theme-tracking">
                Select your <strong>provider</strong>, <strong>roles</strong>,
                and <strong>authentication</strong> methods above.
              </p>
              <p className="theme-font-sans theme-tracking">
                Add and edit <strong>enums</strong>, <strong>schemas</strong>,{" "}
                <strong>tables</strong>, and <strong>columns</strong> below.
              </p>

              <a
                href="https://www.prisma.io/docs/orm/prisma-schema"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm theme-text-primary hover:underline theme-font-sans theme-tracking theme-pt-2"
              >
                Prisma Schema docs →
              </a>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col theme-gap-4">
        <div>
          <h3 className="text-lg font-semibold theme-mb-2">
            Do you need a database?
          </h3>
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
                techUpdates.postgresql = !currentSupabase;

                const newProvider = !currentSupabase ? "supabase" : "none";

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: !currentSupabase ? "supabase" : "postgresql",
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
          </div>

          {initialConfiguration.questions.databaseProvider !== "none" && (
            <div className="flex flex-col theme-gap-3 theme-mt-4">
              <div className="flex flex-wrap theme-gap-1">
                {["supabase", "postgresql"].map((techId) => {
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
                })}
              </div>
              <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                Supabase for all backend logic and database functionality. Excellent for enterprise audit compliance
              </p>
            </div>
          )}
          {!initialConfiguration.technologies.supabase && (
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
                        updateAdminOption(option.id, !isChecked);
                      }}
                      className={cn(
                        "theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-4 transition-all hover:theme-bg-accent flex-1",
                        isChecked && "border-white"
                      )}
                    >
                      <div className="flex md:flex-col items-center md:items-center theme-gap-3 md:theme-gap-2 md:text-center">
                        <Icon className="w-8 h-8 md:w-12 md:h-12 theme-text-foreground shrink-0" />
                        <h4 className="text-sm font-semibold theme-text-foreground theme-font-sans theme-tracking flex-1">
                          {option.label}
                        </h4>
                        <Checkbox
                          checked={isChecked}
                          className="size-6 border-2 border-white/30 dark:border-black/30 data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none shrink-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {(initialConfiguration.features.admin.admin ||
                initialConfiguration.features.admin.superAdmin) && (
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
