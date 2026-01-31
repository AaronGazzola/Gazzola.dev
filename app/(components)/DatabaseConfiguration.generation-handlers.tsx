import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import { buildDatabasePlanPrompt } from "./DatabaseConfiguration.prompts";
import React, { useRef, useCallback, useState } from "react";
import { generateId, AIRLSPolicy } from "./DatabaseConfiguration.ai";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { DatabaseTable, DatabaseEnum } from "./DatabaseConfiguration.types";

const BATCH_SIZE = 4;

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

interface TableBatch {
  name: string;
  description: string;
  planExcerpt: string;
}

export const useDatabaseGeneration = (
  tableDescriptions: any[],
  readmeData: any,
  appStructureData: any,
  appStructure: any,
  setTablesFromAI: (tables: any[]) => void,
  setEnumsFromAI: (enums: any[]) => void,
  setRLSPoliciesFromAI: (policies: any[], tables: any[]) => void,
  updateInitialConfiguration: (config: Partial<InitialConfigurationType>) => void,
  setDatabaseGenerated: (generated: boolean) => void,
  setShowSuccessView: (show: boolean) => void,
  phase1ToastIdRef: React.MutableRefObject<string | number | undefined>
) => {
  const loadingToastIdRef = useRef<string | number | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const planRef = useRef<string>("");
  const enumsRef = useRef<DatabaseEnum[]>([]);
  const allTablesRef = useRef<DatabaseTable[]>([]);
  const allRLSPoliciesRef = useRef<AIRLSPolicy[]>([]);
  const tableBatchesRef = useRef<TableBatch[][]>([]);
  const currentBatchIndexRef = useRef(0);

  const { mutate: generatePlan } = useCodeGeneration((response) => {
    conditionalLog(
      {
        message: "PHASE 1 - DATABASE PLAN GENERATION",
        content: response.content,
      },
      { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
    );

    const plan = response.content.trim();
    planRef.current = plan;

    if (phase1ToastIdRef.current) {
      toast.dismiss(phase1ToastIdRef.current);
    }

    conditionalLog(
      {
        message: "Phase 1 Complete: Plan generated",
        planLength: plan.length
      },
      { label: LOG_LABELS.DATABASE }
    );

    toast.dismiss(loadingToastIdRef.current);
    loadingToastIdRef.current = toast.loading("Phase 2: Extracting enums from plan...");

    const enumPrompt = buildExtractEnumsPrompt(plan);
    generateEnums({ prompt: enumPrompt, maxTokens: 1500 });
  });

  const { mutate: generateEnums } = useCodeGeneration((response) => {
    conditionalLog(
      {
        message: "PHASE 2 - ENUM EXTRACTION",
        content: response.content,
      },
      { label: LOG_LABELS.DATABASE }
    );

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.enums || !Array.isArray(parsed.enums)) {
        toast.error("Phase 2 failed: Invalid enum format");
        setIsGenerating(false);
        return;
      }

      enumsRef.current = parsed.enums.map((e: any) => ({
        ...e,
        id: e.id || generateId(),
        isDefault: false,
        isEditable: true
      }));

      conditionalLog(
        {
          message: "Phase 2 Complete: Enums extracted",
          enumCount: enumsRef.current.length
        },
        { label: LOG_LABELS.DATABASE }
      );

      const tableBatches = prepareBatchesFromPlan(planRef.current, tableDescriptions);
      tableBatchesRef.current = chunkArray(tableBatches, BATCH_SIZE);
      currentBatchIndexRef.current = 0;
      allTablesRef.current = [];

      const totalBatches = tableBatchesRef.current.length;
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = toast.loading(`Phase 3: Generating table schemas (batch 1/${totalBatches})...`, {
        description: `${tableDescriptions.length} tables in ${totalBatches} batches`
      });

      processNextTableBatch();
    } catch (error) {
      conditionalLog(
        {
          message: "Phase 2 Error",
          error: error instanceof Error ? error.message : String(error),
        },
        { label: LOG_LABELS.DATABASE }
      );
      toast.dismiss(loadingToastIdRef.current);
      toast.error("Phase 2 failed: Could not extract enums");
      setIsGenerating(false);
    }
  });

  const { mutate: generateTableBatch } = useCodeGeneration((response) => {
    const batchIndex = currentBatchIndexRef.current;
    const totalBatches = tableBatchesRef.current.length;

    conditionalLog(
      {
        message: `PHASE 3 - TABLE BATCH ${batchIndex + 1}/${totalBatches}`,
        content: response.content,
      },
      { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
    );

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.tables || !Array.isArray(parsed.tables)) {
        toast.error(`Phase 3 batch ${batchIndex + 1} failed: Invalid table format`);
        setIsGenerating(false);
        return;
      }

      const normalizedTables = parsed.tables.map((table: any) => ({
        ...table,
        id: table.id || generateId(),
        schema: table.schema || "public",
        isDefault: false,
        isEditable: true,
        uniqueConstraints: Array.isArray(table.uniqueConstraints)
          ? table.uniqueConstraints.filter((c: any) => Array.isArray(c))
          : [],
        checkConstraints: (table.checkConstraints || []).map((cc: any) => ({
          id: cc.id || generateId(),
          name: cc.name || `check_${table.name}_${generateId().substring(0, 8)}`,
          expression: cc.expression
        })),
        columns: (table.columns || []).map((col: any) => ({
          ...col,
          id: col.id || generateId(),
          isDefault: false,
          isEditable: true,
        })),
      }));

      allTablesRef.current = [...allTablesRef.current, ...normalizedTables];

      conditionalLog(
        {
          message: `Batch ${batchIndex + 1} Complete`,
          tablesInBatch: normalizedTables.length,
          totalTablesSoFar: allTablesRef.current.length
        },
        { label: LOG_LABELS.DATABASE }
      );

      currentBatchIndexRef.current = batchIndex + 1;

      if (currentBatchIndexRef.current < totalBatches) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = toast.loading(`Phase 3: Generating table schemas (batch ${currentBatchIndexRef.current + 1}/${totalBatches})...`, {
          description: `${allTablesRef.current.length} tables generated so far`
        });
        processNextTableBatch();
      } else {
        startRLSGeneration();
      }
    } catch (error) {
      conditionalLog(
        {
          message: `Phase 3 Batch ${batchIndex + 1} Error`,
          error: error instanceof Error ? error.message : String(error),
        },
        { label: LOG_LABELS.DATABASE }
      );
      toast.dismiss(loadingToastIdRef.current);
      toast.error(`Phase 3 batch ${batchIndex + 1} failed: Could not parse table schemas`);
      setIsGenerating(false);
    }
  });

  const { mutate: generateRLSBatch } = useCodeGeneration((response) => {
    const batchIndex = currentBatchIndexRef.current;
    const totalBatches = tableBatchesRef.current.length;

    conditionalLog(
      {
        message: `PHASE 4 - RLS BATCH ${batchIndex + 1}/${totalBatches}`,
        content: response.content,
      },
      { label: LOG_LABELS.DATABASE, maxStringLength: 50000 }
    );

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.rlsPolicies || !Array.isArray(parsed.rlsPolicies)) {
        toast.error(`Phase 4 batch ${batchIndex + 1} failed: Invalid RLS format`);
        setIsGenerating(false);
        return;
      }

      allRLSPoliciesRef.current = [...allRLSPoliciesRef.current, ...parsed.rlsPolicies];

      conditionalLog(
        {
          message: `Batch ${batchIndex + 1} Complete`,
          policiesInBatch: parsed.rlsPolicies.length,
          totalPoliciesSoFar: allRLSPoliciesRef.current.length
        },
        { label: LOG_LABELS.DATABASE }
      );

      currentBatchIndexRef.current = batchIndex + 1;

      if (currentBatchIndexRef.current < totalBatches) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = toast.loading(`Phase 4: Generating RLS policies (batch ${currentBatchIndexRef.current + 1}/${totalBatches})...`, {
          description: `${allRLSPoliciesRef.current.length} policies generated so far`
        });
        processNextRLSBatch();
      } else {
        completeGeneration();
      }
    } catch (error) {
      conditionalLog(
        {
          message: `Phase 4 Batch ${batchIndex + 1} Error`,
          error: error instanceof Error ? error.message : String(error),
        },
        { label: LOG_LABELS.DATABASE }
      );
      toast.dismiss(loadingToastIdRef.current);
      toast.error(`Phase 4 batch ${batchIndex + 1} failed: Could not parse RLS policies`);
      setIsGenerating(false);
    }
  });

  const processNextTableBatch = useCallback(() => {
    const batchIndex = currentBatchIndexRef.current;
    const batch = tableBatchesRef.current[batchIndex];
    const totalBatches = tableBatchesRef.current.length;

    const prompt = buildTableBatchPrompt(
      batch,
      planRef.current,
      enumsRef.current,
      batchIndex,
      totalBatches
    );

    conditionalLog(
      {
        message: `PHASE 3 - BATCH ${batchIndex + 1}/${totalBatches} PROMPT`,
        tableCount: batch.length
      },
      { label: LOG_LABELS.DATABASE }
    );

    generateTableBatch({ prompt, maxTokens: 3500 });
  }, [generateTableBatch]);

  const startRLSGeneration = useCallback(() => {
    currentBatchIndexRef.current = 0;
    allRLSPoliciesRef.current = [];

    const totalBatches = tableBatchesRef.current.length;
    toast.dismiss(loadingToastIdRef.current);
    loadingToastIdRef.current = toast.loading(`Phase 4: Generating RLS policies (batch 1/${totalBatches})...`, {
      description: `${allTablesRef.current.length} tables to secure`
    });

    processNextRLSBatch();
  }, []);

  const processNextRLSBatch = useCallback(() => {
    const batchIndex = currentBatchIndexRef.current;
    const batch = tableBatchesRef.current[batchIndex];
    const totalBatches = tableBatchesRef.current.length;

    const tablesInBatch = allTablesRef.current.filter(t =>
      batch.some(b => b.name === t.name)
    );

    const prompt = buildRLSBatchPrompt(
      tablesInBatch,
      planRef.current,
      batchIndex,
      totalBatches
    );

    conditionalLog(
      {
        message: `PHASE 4 - BATCH ${batchIndex + 1}/${totalBatches} PROMPT`,
        tableCount: tablesInBatch.length
      },
      { label: LOG_LABELS.DATABASE }
    );

    generateRLSBatch({ prompt, maxTokens: 2500 });
  }, [generateRLSBatch]);

  const completeGeneration = useCallback(() => {
    conditionalLog(
      {
        message: "PHASE 5 - CLIENT-SIDE ASSEMBLY",
      },
      { label: LOG_LABELS.DATABASE }
    );

    toast.dismiss(loadingToastIdRef.current);
    loadingToastIdRef.current = toast.loading("Phase 5: Assembling final schema...");

    try {
      const hasProfilesTable = allTablesRef.current.some(
        (t: DatabaseTable) => t.name.toLowerCase() === 'profiles' && t.schema === 'public'
      );

      if (!hasProfilesTable) {
        const profilesTable: DatabaseTable = {
          id: generateId(),
          name: 'profiles',
          schema: 'public',
          isDefault: false,
          isEditable: true,
          columns: [
            {
              id: generateId(),
              name: 'id',
              type: 'UUID',
              isId: true,
              isDefault: false,
              isEditable: true,
              isOptional: false,
              isUnique: false,
              isArray: false,
              defaultValue: 'gen_random_uuid()',
            },
            {
              id: generateId(),
              name: 'user_id',
              type: 'UUID',
              isId: false,
              isDefault: false,
              isEditable: true,
              isOptional: false,
              isUnique: true,
              isArray: false,
              relation: {
                table: 'auth.users',
                field: 'id',
                onDelete: 'Cascade',
                relationType: 'many-to-one'
              }
            },
            {
              id: generateId(),
              name: 'role',
              type: 'user_role',
              isDefault: false,
              isEditable: true,
              isOptional: false,
              isUnique: false,
              isId: false,
              isArray: false,
              defaultValue: "'user'",
            },
            {
              id: generateId(),
              name: 'created_at',
              type: 'TIMESTAMP WITH TIME ZONE',
              isId: false,
              isDefault: false,
              isEditable: true,
              isOptional: false,
              isUnique: false,
              isArray: false,
              defaultValue: 'NOW()',
            },
            {
              id: generateId(),
              name: 'updated_at',
              type: 'TIMESTAMP WITH TIME ZONE',
              isId: false,
              isDefault: false,
              isEditable: true,
              isOptional: true,
              isUnique: false,
              isArray: false,
            }
          ],
          uniqueConstraints: [],
          checkConstraints: []
        };

        allTablesRef.current.unshift(profilesTable);
      }

      const tablesNeedingUserId = allTablesRef.current.filter((table: any) => {
        const hasUserId = table.columns.some((c: any) => c.name === 'user_id' || c.name === 'profile_id');
        const hasOwnPolicy = allRLSPoliciesRef.current.some((p: any) =>
          p.tableName === table.name &&
          p.rolePolicies.some((rp: any) => rp.accessType === 'own')
        );
        return hasOwnPolicy && !hasUserId;
      });

      if (tablesNeedingUserId.length > 0) {
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
            message: "Auto-injected user_id columns",
            tables: tablesNeedingUserId.map((t: any) => t.name)
          },
          { label: LOG_LABELS.DATABASE }
        );
      }

      const profilesTable = allTablesRef.current.find((t: any) => t.name === 'profiles' && t.schema === 'public');
      if (profilesTable) {
        const hasRoleColumn = profilesTable.columns.some((c: any) => c.name === 'role');
        if (!hasRoleColumn) {
          const updatedAtIndex = profilesTable.columns.findIndex((c: any) => c.name === 'updated_at');
          const insertIndex = updatedAtIndex >= 0 ? updatedAtIndex : profilesTable.columns.length;
          profilesTable.columns.splice(insertIndex, 0, {
            id: generateId(),
            name: 'role',
            type: 'user_role',
            isDefault: false,
            isEditable: true,
            isOptional: false,
            isUnique: false,
            isId: false,
            isArray: false,
            defaultValue: "'user'",
          });

          conditionalLog(
            {
              message: "Auto-injected role column into profiles table",
              table: profilesTable.name
            },
            { label: LOG_LABELS.DATABASE }
          );
        }
      }

      const techUpdates: Partial<InitialConfigurationType["technologies"]> = {
        supabase: true,
        postgresql: true
      };

      updateInitialConfiguration({
        questions: {
          databaseProvider: "supabase",
        } as any,
        database: {
          hosting: "supabase",
        } as any,
        technologies: techUpdates as any,
      });

      setTablesFromAI(allTablesRef.current);
      setEnumsFromAI(enumsRef.current);
      if (allRLSPoliciesRef.current.length > 0) {
        setRLSPoliciesFromAI(allRLSPoliciesRef.current, allTablesRef.current);
      }
      setDatabaseGenerated(true);
      setShowSuccessView(true);

      toast.dismiss(loadingToastIdRef.current);
      toast.success(`Database schema generated with ${allTablesRef.current.length} tables and ${allRLSPoliciesRef.current.length} RLS policies`);

      setIsGenerating(false);

      conditionalLog(
        {
          message: "GENERATION COMPLETE",
          tables: allTablesRef.current.length,
          enums: enumsRef.current.length,
          rlsPolicies: allRLSPoliciesRef.current.length
        },
        { label: LOG_LABELS.DATABASE }
      );
    } catch (error) {
      conditionalLog(
        {
          message: "Phase 5 Error",
          error: error instanceof Error ? error.message : String(error),
        },
        { label: LOG_LABELS.DATABASE }
      );
      toast.dismiss(loadingToastIdRef.current);
      toast.error("Phase 5 failed: Could not assemble final schema");
      setIsGenerating(false);
    }
  }, [setTablesFromAI, setEnumsFromAI, setRLSPoliciesFromAI, updateInitialConfiguration, setDatabaseGenerated, setShowSuccessView]);

  const startGeneration = useCallback(() => {
    setIsGenerating(true);

    planRef.current = "";
    enumsRef.current = [];
    allTablesRef.current = [];
    allRLSPoliciesRef.current = [];
    tableBatchesRef.current = [];
    currentBatchIndexRef.current = 0;

    if (phase1ToastIdRef.current) {
      toast.dismiss(phase1ToastIdRef.current);
    }

    loadingToastIdRef.current = toast.loading("Phase 1: Generating database plan...", {
      description: `Analyzing ${tableDescriptions.length} tables`
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

    const prompt = buildDatabasePlanPrompt(
      structuredData,
      appStructure,
      tableDescriptions,
      appStructureData.inferredFeatures
    );

    conditionalLog(
      {
        message: "STARTING 5-PHASE GENERATION PIPELINE",
        totalTables: tableDescriptions.length,
        batchSize: BATCH_SIZE,
        estimatedBatches: Math.ceil(tableDescriptions.length / BATCH_SIZE)
      },
      { label: LOG_LABELS.DATABASE }
    );

    generatePlan({ prompt, maxTokens: 4000 });
  }, [tableDescriptions, readmeData, appStructureData, appStructure, phase1ToastIdRef, generatePlan]);

  return {
    generatePlan: startGeneration,
    isGeneratingPlan: isGenerating,
    isGeneratingSchema: isGenerating
  };
};

const prepareBatchesFromPlan = (plan: string, tableDescriptions: any[]): TableBatch[] => {
  const tableSections = plan.split(/###\s*Table:\s*/i).slice(1);

  return tableDescriptions.map((desc) => {
    const section = tableSections.find(s =>
      s.toLowerCase().startsWith(desc.name.toLowerCase())
    ) || "";

    return {
      name: desc.name,
      description: desc.description,
      planExcerpt: section.substring(0, 2000)
    };
  });
};

const buildExtractEnumsPrompt = (plan: string): string => {
  return `Extract ALL enums from the database plan below.

DATABASE PLAN:
${plan}

Find the "Required Enums" section and convert it to JSON format.

OUTPUT FORMAT (JSON only, no markdown):
{
  "enums": [
    {
      "name": "enum_name",
      "values": [
        { "value": "VALUE1" },
        { "value": "VALUE2" }
      ]
    }
  ]
}

IMPORTANT:
- Do NOT include user_role enum (automatically added by system)
- Include ALL other enums mentioned in the plan
- Return ONLY valid JSON (no markdown code blocks)
- Start with { and end with }`;
};

const buildTableBatchPrompt = (
  batch: TableBatch[],
  plan: string,
  enums: DatabaseEnum[],
  batchIndex: number,
  totalBatches: number
): string => {
  const tableNames = batch.map(t => t.name).join(", ");

  return `Generate PostgreSQL table schemas for batch ${batchIndex + 1}/${totalBatches}.

TABLES IN THIS BATCH: ${tableNames}

AVAILABLE ENUMS:
${enums.map(e => `- ${e.name}: ${e.values.map((v: any) => v.value).join(", ")}`).join("\n")}

PLAN EXCERPTS FOR THESE TABLES:
${batch.map(t => `### Table: ${t.name}\n${t.planExcerpt}\n`).join("\n\n")}

Generate table schemas with columns, constraints, and foreign keys.

COLUMN RULES:
- All id columns use UUID type with DEFAULT gen_random_uuid()
- Use enum type NAMES (not TEXT) for columns that reference enums
- Include user_id (UUID REFERENCES auth.users.id) for user-owned tables
- Include created_at and updated_at timestamps

OUTPUT FORMAT (JSON only):
{
  "tables": [
    {
      "name": "table_name",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "UUID",
          "isId": true,
          "defaultValue": "gen_random_uuid()"
        },
        {
          "name": "column_name",
          "type": "TEXT",
          "isOptional": false
        }
      ],
      "checkConstraints": [
        {
          "name": "constraint_name",
          "expression": "LENGTH(column_name) <= 200"
        }
      ],
      "uniqueConstraints": [
        ["column1", "column2"]
      ]
    }
  ]
}

Return ONLY valid JSON (no markdown, no explanations).`;
};

const buildRLSBatchPrompt = (
  tables: DatabaseTable[],
  plan: string,
  batchIndex: number,
  totalBatches: number
): string => {
  const tableNames = tables.map(t => t.name).join(", ");
  const tableInfo = tables.map(t => {
    const hasUserId = t.columns.some((c: any) => c.name === 'user_id' || c.name === 'profile_id');
    return `- ${t.name}: ${hasUserId ? 'USER-OWNED (has user_id)' : 'REFERENCE (no user_id)'}`;
  }).join("\n");

  return `Generate RLS policies for batch ${batchIndex + 1}/${totalBatches}.

TABLES IN THIS BATCH:
${tableInfo}

RLS PATTERNS:

USER-OWNED tables (have user_id):
- SELECT: anon=public, authenticated=public, admin=global
- INSERT/UPDATE/DELETE: anon=none, authenticated=own, admin=global

REFERENCE tables (no user_id):
- SELECT: anon=public, authenticated=public, admin=global
- INSERT/UPDATE/DELETE: anon=none, authenticated=none, admin=global

REQUIRED: Generate ALL 4 operations (SELECT, INSERT, UPDATE, DELETE) for EACH table.
Total policies needed: ${tables.length * 4}

OUTPUT FORMAT (JSON only):
{
  "rlsPolicies": [
    {
      "tableName": "table_name",
      "operation": "SELECT",
      "rolePolicies": [
        { "role": "anon", "accessType": "public" },
        { "role": "authenticated", "accessType": "public" },
        { "role": "admin", "accessType": "global" }
      ]
    }
  ]
}

CRITICAL: Include ALL 4 operations for ALL ${tables.length} tables.
Return ONLY valid JSON (no markdown, no explanations).`;
};
