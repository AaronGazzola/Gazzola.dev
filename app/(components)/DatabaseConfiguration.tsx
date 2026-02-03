"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Switch } from "@/components/editor/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { applyAutomaticSectionFiltering } from "@/lib/section-filter.utils";
import {
  ArrowRight,
  Bot,
  CornerLeftUp,
  Database,
  HelpCircle,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiSupabase } from "react-icons/si";
import { toast } from "sonner";
import { useAppStructureStore } from "./AppStructure.stores";
import {
  generateId,
  generateTableDescriptionsPrompt,
  parseTableDescriptionsFromResponse,
} from "./DatabaseConfiguration.ai";
import { EnumsCollapsible } from "./DatabaseConfiguration.enums";
import { useDatabaseGeneration } from "./DatabaseConfiguration.generation-handlers";
import { SchemaCollapsible } from "./DatabaseConfiguration.schemas";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import {
  DatabaseTableDescription,
  useDatabaseTablesStore,
} from "./DatabaseConfiguration.tables.stores";
import { DatabaseTableDescriptionItem } from "./DatabaseConfiguration/DatabaseTableDescriptionItem";
import { useREADMEStore } from "./READMEComponent.stores";

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
    databaseGenerated,
    setDatabaseGenerated,
    readmeGenerated,
    appStructureGenerated,
    databaseHelpPopoverOpened,
    setDatabaseHelpPopoverOpened,
  } = useEditorStore();
  const readmeStore = useREADMEStore();
  const appStructureStore = useAppStructureStore();

  const {
    tableDescriptions,
    tablesGenerated,
    accordionValue,
    expandedTableId: expandedTableDescId,
    lastGeneratedTableDescriptions,
    setTableDescriptions,
    updateTableDescription,
    addTableDescription,
    deleteTableDescription,
    setTablesGenerated,
    setAccordionValue,
    setExpandedTableId: setExpandedTableDescId,
    setLastGeneratedTableDescriptions,
  } = useDatabaseTablesStore();

  const [expandedSchema, setExpandedSchema] = useState<string | null>("public");
  const [expandedTableId, setExpandedTableId] = useState<string | null>(null);
  const [expandedEnums, setExpandedEnums] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAddingSchema, setIsAddingSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [helpPopoverOpen, setHelpPopoverOpen] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const phase1ToastIdRef = useRef<string | number | undefined>();

  const readmeData = {
    title: readmeStore.title,
    description: readmeStore.description,
    pages: readmeStore.pages,
    authMethods: readmeStore.authMethods,
    pageAccess: readmeStore.pageAccess,
  };

  const appStructureData = {
    inferredFeatures: appStructureStore.inferredFeatures,
    parsedPages: appStructureStore.parsedPages,
  };

  const { mutate: generateTableDescriptions, isPending: isGeneratingTables } =
    useCodeGeneration((response) => {
      conditionalLog(
        {
          message: "AI response received for table descriptions",
          responseContent: response.content,
        },
        { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
      );

      const parsed = parseTableDescriptionsFromResponse(response.content);

      if (parsed && parsed.tables.length > 0) {
        setTableDescriptions(parsed.tables);
        setTablesGenerated(true);
        setAccordionValue("step-tables");
        setExpandedTableDescId(parsed.tables[0].id);
        toast.success(`Generated ${parsed.tables.length} table descriptions`);
      } else {
        const fallbackTables: DatabaseTableDescription[] = [
          { id: generateId(), name: "users", description: "" },
        ];
        setTableDescriptions(fallbackTables);
        setTablesGenerated(true);
        setAccordionValue("step-tables");
        setExpandedTableDescId(fallbackTables[0].id);
        toast.warning(
          "Could not generate tables automatically. Default table added.",
          {
            duration: 5000,
          }
        );
      }
    });

  const { generatePlan, isGeneratingPlan, isGeneratingSchema } =
    useDatabaseGeneration(
      tableDescriptions,
      readmeData,
      appStructureData,
      appStructure,
      setTablesFromAI,
      setEnumsFromAI,
      setRLSPoliciesFromAI,
      updateInitialConfiguration,
      setDatabaseGenerated,
      setShowSuccessView,
      phase1ToastIdRef
    );

  const handleGenerateTableDescriptions = useCallback(() => {
    if (
      !readmeData.title ||
      !readmeData.description ||
      readmeData.pages.length === 0
    ) {
      toast.error("No README data found. Please generate README first.");
      return;
    }

    if (
      !appStructureData.parsedPages ||
      appStructureData.parsedPages.length === 0
    ) {
      toast.error(
        "No app structure found. Please generate app structure first."
      );
      return;
    }

    const authMethodsList = Object.entries(readmeData.authMethods)
      .filter(([_, enabled]) => enabled)
      .map(([method]) => method)
      .join(", ");

    const pagesWithFeatures = appStructureData.parsedPages.map((page) => {
      const features = appStructureData.inferredFeatures[page.id] || [];
      const access = readmeData.pageAccess.find((pa) => pa.pageId === page.id);
      const accessLevels = access
        ? Object.entries(access)
            .filter(([key, value]) => key !== "pageId" && value)
            .map(([key]) => key)
            .join(", ")
        : "not specified";

      return {
        name: page.name,
        route: page.route,
        description: page.description,
        accessLevels,
        features: features.map((f) => ({
          title: f.title,
          description: f.description,
          operation: f.actionVerbs?.join(", ") || "not specified",
          databaseTable: f.databaseTables?.join(", ") || "not specified",
        })),
      };
    });

    const structuredData = {
      appTitle: readmeData.title,
      appDescription: readmeData.description,
      authMethods: authMethodsList || "none",
      pages: pagesWithFeatures,
    };

    const structuredDataString = JSON.stringify(structuredData, null, 2);

    const prompt = generateTableDescriptionsPrompt(
      structuredDataString,
      appStructure
    );

    conditionalLog(
      {
        message: "Sending prompt for table descriptions generation",
        prompt,
        structuredDataLength: structuredDataString.length,
        appStructureLength: appStructure.length,
      },
      { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
    );

    generateTableDescriptions({ prompt, maxTokens: 1500 });
  }, [readmeData, appStructureData, appStructure, generateTableDescriptions]);

  const hasTableDescriptionsChanged = useCallback(() => {
    if (!lastGeneratedTableDescriptions) return true;
    return (
      JSON.stringify(lastGeneratedTableDescriptions) !==
      JSON.stringify(tableDescriptions)
    );
  }, [lastGeneratedTableDescriptions, tableDescriptions]);

  const handleGenerateFullSchema = useCallback(() => {
    if (tableDescriptions.length === 0) {
      toast.error("No table descriptions found. Please add tables first.");
      return;
    }

    setLastGeneratedTableDescriptions(tableDescriptions);

    generatePlan();
  }, [tableDescriptions, generatePlan, setLastGeneratedTableDescriptions]);

  const handleAddTable = useCallback(() => {
    const newTable: DatabaseTableDescription = {
      id: generateId(),
      name: "",
      description: "",
    };
    addTableDescription(newTable);
    setExpandedTableDescId(newTable.id);
  }, [addTableDescription, setExpandedTableDescId]);

  const handleUpdateTable = useCallback(
    (id: string, updates: Partial<DatabaseTableDescription>) => {
      updateTableDescription(id, updates);
    },
    [updateTableDescription]
  );

  const handleDeleteTableDescription = useCallback(
    (id: string) => {
      if (tableDescriptions.length === 1) return;
      deleteTableDescription(id);
      if (expandedTableDescId === id) {
        setExpandedTableDescId(null);
      }
    },
    [
      tableDescriptions.length,
      deleteTableDescription,
      expandedTableDescId,
      setExpandedTableDescId,
    ]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (databaseGenerated && !showSuccessView) {
      setShowSuccessView(true);
    }
  }, [databaseGenerated]);

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

  useEffect(() => {
    const {
      tables: dbTables,
      enums,
      rlsPolicies,
      generateSupabaseMigration,
    } = useDatabaseStore.getState();

    console.log(
      "DATABASE CONFIGURATION STATE:",
      JSON.stringify(
        {
          databaseStore: {
            tables: dbTables,
            enums,
            rlsPolicies,
          },
          editorStore: {
            initialConfiguration,
            databaseGenerated,
            readmeGenerated,
            appStructureGenerated,
          },
          tablesStore: {
            tableDescriptions,
            tablesGenerated,
            accordionValue,
            expandedTableId: expandedTableDescId,
            lastGeneratedTableDescriptions,
          },
          localState: {
            expandedSchema,
            expandedTableId,
            expandedEnums,
            isAddingSchema,
            newSchemaName,
            showSuccessView,
          },
          generatedSQL: generateSupabaseMigration(),
        },
        null,
        2
      )
    );
  }, [
    tables,
    initialConfiguration,
    databaseGenerated,
    tableDescriptions,
    tablesGenerated,
    expandedSchema,
    expandedTableId,
  ]);

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

  const hasReadme =
    readmeGenerated && readmeData.title && readmeData.pages.length > 0;
  const hasAppStructure =
    appStructureGenerated && appStructureData.parsedPages.length > 0;
  const isPending =
    isGeneratingTables || isGeneratingPlan || isGeneratingSchema;

  const MIN_TABLE_NAME_LENGTH = 2;
  const MIN_TABLE_DESCRIPTION_LENGTH = 20;

  const canSubmitTables = tableDescriptions.every(
    (t) =>
      t.name.trim().length >= MIN_TABLE_NAME_LENGTH &&
      t.description.trim().length >= MIN_TABLE_DESCRIPTION_LENGTH
  );

  if (!databaseGenerated || (databaseGenerated && !showSuccessView)) {
    if (!hasReadme || !hasAppStructure) {
      const renderMessage = () => {
        if (!hasReadme && !hasAppStructure) {
          return (
            <>
              Generate a{" "}
              <Link
                href="/readme"
                className="theme-text-primary hover:underline"
              >
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
              <Link
                href="/readme"
                className="theme-text-primary hover:underline"
              >
                README
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
                href="/app-directory"
                className="theme-text-primary hover:underline"
              >
                App Directory
              </Link>{" "}
              first
            </>
          );
        }
        return null;
      };

      const message = renderMessage();

      return (
        <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto">
          <div className="flex flex-col theme-gap-2">
            <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
              <Database className="h-5 w-5 theme-text-primary" />
              Generate Database Configuration
            </h2>
            <p className="theme-text-foreground">{message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col theme-gap-3">
          <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
            <Database className="h-5 w-5 theme-text-primary" />
            Generate Database Configuration
          </h2>
          <p className="theme-text-foreground">
            Follow the steps below to define your database tables.
            <br />
            Start by generating table descriptions based on your app structure.
          </p>

          {!tablesGenerated && (
            <Button
              onClick={handleGenerateTableDescriptions}
              disabled={isPending}
              className="w-full theme-gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating tables...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Generate Tables
                </>
              )}
            </Button>
          )}
        </div>

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full"
        >
          <AccordionItem
            value="step-tables"
            className={`theme-border-border ${!tablesGenerated ? "opacity-50 pointer-events-none" : ""}`}
          >
            <AccordionTrigger
              className={`hover:theme-text-primary group ${!tablesGenerated ? "cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center theme-gap-2">
                <Sparkles className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  Database Tables
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col theme-gap-4 pt-4">
                <div className="flex flex-col theme-gap-2">
                  {tableDescriptions.map((table, index) => (
                    <DatabaseTableDescriptionItem
                      key={table.id}
                      table={table}
                      index={index}
                      totalTables={tableDescriptions.length}
                      isExpanded={expandedTableDescId === table.id}
                      onToggle={() =>
                        setExpandedTableDescId(
                          expandedTableDescId === table.id ? null : table.id
                        )
                      }
                      onUpdate={handleUpdateTable}
                      onDelete={handleDeleteTableDescription}
                      disabled={isPending}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleAddTable}
                  disabled={isPending}
                  className="w-full theme-gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Table
                </Button>

                {databaseGenerated ? (
                  <div className="flex flex-col sm:flex-row theme-gap-2">
                    <Button
                      onClick={handleGenerateFullSchema}
                      disabled={isPending || !hasTableDescriptionsChanged()}
                      className="flex-1 theme-gap-2"
                    >
                      {isGeneratingSchema ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4" />
                          Regenerate Database
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSuccessView(true);
                      }}
                      disabled={isPending}
                      variant="outline"
                      className="flex-1 theme-gap-2"
                    >
                      View Database
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateFullSchema}
                    disabled={isPending || !canSubmitTables}
                    className="w-full theme-gap-2"
                  >
                    {isGeneratingSchema ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating database...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Generate Database
                      </>
                    )}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font theme-tracking max-w-2xl mx-auto relative">
      <div className="absolute top-2 right-2 flex items-center theme-gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => {
            setShowSuccessView(false);
            setAccordionValue("step-tables");
          }}
        >
          <CornerLeftUp className="h-4 w-4" />
        </Button>
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
              className={`h-8 w-8 rounded-full ${!databaseHelpPopoverOpened ? "theme-bg-primary theme-text-primary-foreground hover:opacity-90" : ""}`}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="sm:w-96 theme-text-popover-foreground theme-shadow theme-font theme-tracking p-0 theme-radius max-h-[45vh] overflow-y-auto"
            style={{ borderColor: "var(--theme-primary)" }}
            align="end"
          >
            <div className="flex flex-col theme-gap-3 theme-bg-background p-4">
              <h4 className="font-semibold text-base theme-font theme-tracking">
                Database Configuration
              </h4>
              <div className="flex flex-col theme-gap-2 text-sm">
                <p className="theme-font theme-tracking">
                  Choose whether to use a <strong>Supabase database</strong> for
                  your application using the toggle.
                </p>
                <p className="theme-font theme-tracking">
                  Add and edit <strong>enums</strong>, <strong>schemas</strong>,{" "}
                  <strong>tables</strong>, and <strong>columns</strong> to
                  define your database structure.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col theme-gap-4">
        <div className="theme-bg-card border-2 theme-radius theme-shadow theme-p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center theme-gap-3">
              <SiSupabase className="w-10 h-10 theme-text-foreground" />
              <div>
                <h3 className="text-xl font-bold theme-text-foreground">
                  Supabase
                </h3>
                <p className="text-sm theme-text-muted-foreground font-semibold">
                  {initialConfiguration.technologies.supabase
                    ? "Enabled"
                    : "Disabled"}
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
        </div>
      </div>

      {!isNoDatabaseSelected && (
        <>
          <div className="theme-bg-card theme-radius theme-shadow overflow-auto border theme-border-border theme-p-4">
            <div className="flex flex-col theme-gap-2">
              <EnumsCollapsible
                isExpanded={expandedEnums}
                onToggle={() => setExpandedEnums(!expandedEnums)}
              />
              {getAvailableSchemasWithConfig(initialConfiguration)
                .filter(
                  (schema) => schema !== "auth" && schema !== "better_auth"
                )
                .map((schema) => {
                  const schemaTables = tables.filter(
                    (t) => t.schema === schema
                  );
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

          <div className="theme-bg-card theme-border-border border-2 theme-radius theme-shadow theme-p-6">
            {initialConfiguration.technologies.supabase ? (
              <div>
                <p className="text-base theme-text-foreground font-semibold theme-mb-3">
                  Why Supabase?
                </p>
                <ul className="space-y-2 theme-text-muted-foreground">
                  <li className="flex items-start theme-gap-2">
                    <span className="theme-text-primary font-bold mt-0.5">
                      •
                    </span>
                    <span className="font-semibold">
                      PostgreSQL database with real-time subscriptions
                    </span>
                  </li>
                  <li className="flex items-start theme-gap-2">
                    <span className="theme-text-primary font-bold mt-0.5">
                      •
                    </span>
                    <span className="font-semibold">
                      Built-in authentication and user management
                    </span>
                  </li>
                  <li className="flex items-start theme-gap-2">
                    <span className="theme-text-primary font-bold mt-0.5">
                      •
                    </span>
                    <span className="font-semibold">
                      Enterprise-ready authentication, verification and SOC2
                      compliance
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-base theme-text-muted-foreground theme-font theme-tracking font-semibold">
                  No database required, this app is front-end only
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
