import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import { buildDatabasePlanPrompt, buildDatabaseSchemaFromPlanPrompt } from "./DatabaseConfiguration.prompts";
import React, { useRef } from "react";
import { parseDatabaseSchemaFromResponse, generateId } from "./DatabaseConfiguration.ai";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";

export const useDatabaseGeneration = (
  tableDescriptions: any[],
  readmeData: any,
  appStructureData: any,
  appStructure: any,
  setDatabasePlan: (plan: string | null) => void,
  setTablesFromAI: (tables: any[]) => void,
  setEnumsFromAI: (enums: any[]) => void,
  setRLSPoliciesFromAI: (policies: any[], tables: any[]) => void,
  updateInitialConfiguration: (config: Partial<InitialConfigurationType>) => void,
  setDatabaseGenerated: (generated: boolean) => void,
  setShowSuccessView: (show: boolean) => void,
  phase1ToastIdRef: React.MutableRefObject<string | number | undefined>
) => {
  const phase2LoadingToastIdRef = useRef<string | number | undefined>();

  const { mutate: generatePlan, isPending: isGeneratingPlan } =
    useCodeGeneration((response) => {
      conditionalLog(
        {
          message: "PHASE 1 - DATABASE PLAN GENERATION",
          content: response.content,
        },
        { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
      );

      const plan = response.content.trim();
      setDatabasePlan(plan);

      if (phase1ToastIdRef.current) {
        toast.dismiss(phase1ToastIdRef.current);
      }

      toast.success("Plan generated. Generating database schema...", {
        duration: 5000,
        description: "This may take up to 2-3 minutes for complex schemas..."
      });

      const authMethodsList = Object.entries(readmeData.authMethods)
        .filter(([_, enabled]) => enabled)
        .map(([method]) => method)
        .join(", ");

      const pagesWithFeatures = appStructureData.parsedPages.map((page: any) => {
        const features = appStructureData.inferredFeatures[page.id] || [];
        const access = readmeData.pageAccess.find((pa: any) => pa.pageId === page.id);
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
          features: features.map((f: any) => ({
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

      const prompt = buildDatabaseSchemaFromPlanPrompt(plan, tableDescriptions, structuredData);

      conditionalLog(
        {
          message: "PHASE 2 - SCHEMA GENERATION FROM PLAN",
          promptLength: prompt.length,
        },
        { label: LOG_LABELS.DATABASE }
      );

      phase2LoadingToastIdRef.current = toast.loading("Generating database schema from plan...", {
        description: `Processing ${tableDescriptions.length} tables`
      });

      generateSchemaFromPlan({ prompt, maxTokens: 8000 });
    });

  const { mutate: generateSchemaFromPlan, isPending: isGeneratingSchema } =
    useCodeGeneration((response) => {
      conditionalLog(
        {
          message: "PHASE 2 - SCHEMA GENERATION",
          content: response.content,
        },
        { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
      );

      try {
        const parsed = parseDatabaseSchemaFromResponse(response.content);

        if (!parsed) {
          if (phase2LoadingToastIdRef.current) {
            toast.dismiss(phase2LoadingToastIdRef.current);
          }
          toast.error("Invalid AI response format");
          return;
        }

        const { configuration, tables, enums, rlsPolicies } = parsed;

        const expectedRLSPolicyCount = tableDescriptions.length * 4;
        const warnings: string[] = [];

        if (tables.length !== tableDescriptions.length) {
          conditionalLog(
            {
              message: "Table count mismatch",
              expected: tableDescriptions.length,
              received: tables.length,
              diff: tableDescriptions.length - tables.length,
            },
            { label: LOG_LABELS.DATABASE }
          );
          warnings.push(`Tables: ${tables.length}/${tableDescriptions.length}`);
        }

        if (rlsPolicies.length < expectedRLSPolicyCount) {
          conditionalLog(
            {
              message: "RLS policy count insufficient",
              expected: expectedRLSPolicyCount,
              received: rlsPolicies.length,
              diff: expectedRLSPolicyCount - rlsPolicies.length,
              tablesWithoutFullPolicies: tableDescriptions.length - (rlsPolicies.length / 4),
            },
            { label: LOG_LABELS.DATABASE }
          );
          warnings.push(`RLS policies: ${rlsPolicies.length}/${expectedRLSPolicyCount}+`);
        }

        const enumsUsedAsText = tables.flatMap(table =>
          table.columns
            .filter((col: any) =>
              col.type === 'TEXT' &&
              (col.name.includes('type') || col.name.includes('status') || col.name.includes('role') || col.name === 'visibility')
            )
            .map((col: any) => `${table.name}.${col.name}`)
        );

        if (enumsUsedAsText.length > 0 && enums.length > 0) {
          conditionalLog(
            {
              message: "Potential enum type usage issue",
              columnsUsingText: enumsUsedAsText,
              availableEnums: enums.map((e: any) => e.name),
            },
            { label: LOG_LABELS.DATABASE }
          );
        }

        const tablesNeedingUserId = tables.filter((table: any) => {
          const hasUserId = table.columns.some((c: any) => c.name === 'user_id' || c.name === 'profile_id');
          const hasOwnPolicy = rlsPolicies.some((p: any) =>
            p.tableName === table.name &&
            p.rolePolicies.some((rp: any) => rp.accessType === 'own')
          );
          return hasOwnPolicy && !hasUserId;
        });

        if (tablesNeedingUserId.length > 0) {
          const injectedTableNames = tablesNeedingUserId.map((t: any) => t.name);

          tablesNeedingUserId.forEach((table: any) => {
            const idColumnIndex = table.columns.findIndex((c: any) => c.isId);
            const insertIndex = idColumnIndex >= 0 ? idColumnIndex + 1 : 0;

            table.columns.splice(insertIndex, 0, {
              id: generateId(),
              name: 'user_id',
              type: 'UUID',
              isId: false,
              isDefault: false,
              isEditable: true,
              isOptional: false,
              isUnique: false,
              isArray: false,
              relation: {
                table: 'auth.users',
                field: 'id',
                onDelete: 'Cascade',
                relationType: 'many-to-one'
              }
            });
          });

          conditionalLog(
            {
              message: "Auto-injected user_id columns for tables with 'own' RLS",
              tables: injectedTableNames,
              reason: "Tables with 'own' access require user_id for RLS policies"
            },
            { label: LOG_LABELS.DATABASE }
          );

          warnings.push(`Auto-fixed: ${injectedTableNames.join(', ')} (added user_id)`);
        }

        if (warnings.length > 0) {
          const hasAutoFix = warnings.some(w => w.startsWith('Auto-fixed:'));
          const toastMessage = hasAutoFix
            ? `Schema auto-corrected: ${warnings.join(', ')}`
            : `Schema incomplete: ${warnings.join(', ')}`;
          toast.warning(toastMessage);
        }

        const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};
        if (configuration.databaseProvider === "supabase") {
          techUpdates.supabase = true;
          techUpdates.postgresql = true;
        } else {
          techUpdates.supabase = false;
          techUpdates.postgresql = false;
        }

        updateInitialConfiguration({
          questions: {
            databaseProvider: configuration.databaseProvider,
          } as any,
          database: {
            hosting:
              configuration.databaseProvider === "supabase"
                ? "supabase"
                : "postgresql",
          } as any,
          technologies: techUpdates,
        });

        setTablesFromAI(tables);
        setEnumsFromAI(enums);
        if (rlsPolicies && rlsPolicies.length > 0) {
          setRLSPoliciesFromAI(rlsPolicies, tables);
        }
        setDatabaseGenerated(true);
        setShowSuccessView(true);

        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.success(`Database schema generated with ${tables.length} tables`);
      } catch (error) {
        conditionalLog(
          {
            message: "PHASE 2 ERROR",
            error: error instanceof Error ? error.message : String(error),
          },
          { label: LOG_LABELS.DATABASE }
        );
        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.error("Failed to generate schema. Please try again.");
      }
    });

  return {
    generatePlan,
    isGeneratingPlan,
    isGeneratingSchema
  };
};
