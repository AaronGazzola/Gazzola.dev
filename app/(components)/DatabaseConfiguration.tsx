"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Switch } from "@/components/editor/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
import {
  BotMessageSquare,
  HelpCircle,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiSupabase } from "react-icons/si";
import {
  generateDatabaseSchemaPrompt,
  parseDatabaseSchemaFromResponse,
} from "./DatabaseConfiguration.ai";
import { EnumsCollapsible } from "./DatabaseConfiguration.enums";
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
                Choose whether to use a <strong>Supabase database</strong> for your application using the toggle.
              </p>
              <p className="theme-font-sans theme-tracking">
                Add and edit <strong>enums</strong>, <strong>schemas</strong>,{" "}
                <strong>tables</strong>, and <strong>columns</strong> to define your database structure.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col theme-gap-4">
        <div className="theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-6">
          <div className="flex items-center justify-between theme-mb-4">
            <div className="flex items-center theme-gap-3">
              <SiSupabase className="w-10 h-10 theme-text-foreground" />
              <div>
                <h3 className="text-xl font-bold theme-text-foreground">
                  Database
                </h3>
                <p className="text-sm theme-text-muted-foreground font-semibold">
                  {initialConfiguration.technologies.supabase ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
            <Switch
              checked={initialConfiguration.technologies.supabase}
              onCheckedChange={(checked) => {
                const techUpdates: Partial<
                  InitialConfigurationType["technologies"]
                > = {};

                techUpdates.supabase = checked;
                techUpdates.postgresql = checked;

                const newProvider = checked ? "supabase" : "none";

                updateInitialConfiguration({
                  questions: {
                    ...initialConfiguration.questions,
                    databaseProvider: newProvider,
                  },
                  database: {
                    hosting: checked ? "supabase" : "postgresql",
                  },
                  technologies: {
                    ...initialConfiguration.technologies,
                    ...techUpdates,
                  },
                });
              }}
              size="lg"
            />
          </div>

          {initialConfiguration.technologies.supabase ? (
            <div className="theme-pt-4 border-t theme-border-border">
              <p className="text-base theme-text-foreground font-semibold theme-mb-3">
                Powered by Supabase
              </p>
              <ul className="space-y-2 text-sm theme-text-muted-foreground">
                <li className="flex items-start theme-gap-2">
                  <span className="theme-text-primary font-bold mt-0.5">•</span>
                  <span className="font-semibold">PostgreSQL database with real-time subscriptions</span>
                </li>
                <li className="flex items-start theme-gap-2">
                  <span className="theme-text-primary font-bold mt-0.5">•</span>
                  <span className="font-semibold">Built-in authentication and user management</span>
                </li>
                <li className="flex items-start theme-gap-2">
                  <span className="theme-text-primary font-bold mt-0.5">•</span>
                  <span className="font-semibold">Enterprise-ready authentication, verification and SOC2 compliance</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="theme-pt-4 border-t theme-border-border">
              <p className="text-base theme-text-muted-foreground theme-font-sans theme-tracking font-semibold">
                No database required, this app is front-end only
              </p>
            </div>
          )}
        </div>

      </div>

      {!isNoDatabaseSelected && (
        <div className="theme-bg-card theme-radius theme-shadow overflow-auto border theme-border-border theme-p-4">
          <div className="flex flex-col theme-gap-2">
            <EnumsCollapsible
              isExpanded={expandedEnums}
              onToggle={() => setExpandedEnums(!expandedEnums)}
            />
            {getAvailableSchemasWithConfig(initialConfiguration)
              .filter((schema) => schema !== "auth" && schema !== "better_auth")
              .map((schema) => {
                const schemaTables = tables.filter((t) => t.schema === schema);
                const isEditable = schema !== "public";

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
                    isSystemSchema={false}
                  />
                );
              })}
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
