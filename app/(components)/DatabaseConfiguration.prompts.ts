import { DATABASE_TEMPLATES } from "./DatabaseConfiguration.types";

export const buildDatabasePlanPrompt = (
  structuredData: any,
  appStructure: any,
  tableDescriptions: any[],
  inferredFeatures: Record<string, any[]>
): string => {
  const tableCount = tableDescriptions.length;
  const featureCount = Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0);

  return `🚨 CRITICAL ANTI-TRUNCATION REQUIREMENTS 🚨

You MUST analyze ALL ${tableCount} tables individually. Do NOT use shortcuts like:
❌ "[Continue with similar analysis...]"
❌ "[And so on for remaining tables...]"
❌ Summarizing multiple tables into one section

✅ REQUIRED: Explicitly analyze EVERY table (${tableCount} total)

This is an automated process - there is no human to answer questions or ask you to continue. Complete the ENTIRE plan in ONE response.

Generate a plain text plan for database schema design.

APP CONTEXT:
${JSON.stringify(structuredData, null, 2)}

FILE SYSTEM STRUCTURE:
${JSON.stringify(appStructure, null, 2)}

USER-PROVIDED TABLE DESCRIPTIONS:
${tableDescriptions.map((t, i) => `${i + 1}. ${t.name}: ${t.description}`).join('\n')}

FEATURES BY PAGE (${featureCount} total features):
${Object.entries(inferredFeatures).map(([pageId, features]) => {
  const page = structuredData.pages?.find((p: any) => p.id === pageId);
  return `
Page: ${page?.name || pageId} (${page?.route || ''})
Features:
${(features as any[]).map((f: any) => `  - ${f.title}: ${f.description}
    Action Verbs: ${f.actionVerbs?.join(', ') || 'none'}
    Database Tables: ${f.databaseTables?.join(', ') || 'none'}`).join('\n')}
`;
}).join('\n')}

# YOUR TASK

For each of the ${tableCount} tables provided by the user, you will:

1. **Analyze the table's purpose** based on:
   - User-provided description
   - Related features that reference this table (check databaseTables field in features)
   - Authentication requirements from app context

2. **Define columns** for the table:
   - Column name (snake_case)
   - PostgreSQL type (UUID, TEXT, INTEGER, BIGINT, DOUBLE PRECISION, BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB, DECIMAL, BYTEA)
   - Constraints (NOT NULL, UNIQUE, PRIMARY KEY)
   - Default values (gen_random_uuid(), NOW(), 'string', true/false)
   - Foreign key relationships

3. **Define RLS policies** for the table:
   - For each operation (SELECT, INSERT, UPDATE, DELETE)
   - For each role (anon, authenticated, admin)
   - Access type (none, public, own, global)

4. **Identify required enums** referenced in columns

# CRITICAL RULES

- ALWAYS include a 'profiles' table if not present in user descriptions
- NEVER create 'users' or 'user' table (conflicts with auth.users)
- profiles table structure:
  * id (UUID PRIMARY KEY DEFAULT gen_random_uuid())
  * user_id (UUID UNIQUE REFERENCES auth.users.id ON DELETE CASCADE)
  * role (user_role DEFAULT 'user' NOT NULL)
  * created_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
  * updated_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())

- User ID Denormalization:
  * ANY table with profile_id MUST also have user_id (UUID REFERENCES auth.users.id)
  * ANY table referencing user-owned tables MUST have user_id denormalized
  * This is REQUIRED for RLS "own" access type to work

- Foreign key naming:
  * Referencing profiles → use "profile_id"
  * Referencing auth.users directly → use "user_id"
  * Pattern: {table_name}_id (e.g., post_id, comment_id)

- ALL id columns and FK columns MUST use UUID type (not TEXT)

# OUTPUT FORMAT (PLAIN TEXT)

## Tables Overview
List all ${tableCount} tables:
1. table_name_1
2. table_name_2
...
${tableCount}. table_name_${tableCount}

## Detailed Column Analysis

For each table:

### Table: table_name
Purpose: [What this table stores and why]

Columns:
- id: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- user_id: UUID, REFERENCES auth.users.id (for RLS)
- column_name: TYPE, [constraints], [default]
- created_at: TIMESTAMP WITH TIME ZONE, DEFAULT NOW()
- updated_at: TIMESTAMP WITH TIME ZONE

Foreign Keys:
- profile_id → profiles.id (many-to-one, ON DELETE CASCADE)

Check Constraints:
- check_table_constraint: LENGTH(column) <= 200

## Relationships and Foreign Keys

[Describe how tables relate to each other]

## RLS Policies

IMPORTANT: Determine if table is USER-OWNED or REFERENCE:

**USER-OWNED tables** (have user_id or profile_id):
- SELECT: anon=public, authenticated=public, admin=global
- INSERT/UPDATE/DELETE: anon=none, authenticated=own, admin=global

**REFERENCE tables** (no user_id or profile_id - like categories, tags):
- SELECT: anon=public, authenticated=public, admin=global
- INSERT/UPDATE/DELETE: anon=none, authenticated=none, admin=global

**JUNCTION tables** (many-to-many relationships like page_categories):
- If users control the relationship: MUST have user_id column, use USER-OWNED pattern
- If admin-only: no user_id needed, use REFERENCE pattern
- CRITICAL: Cannot use "own" access without user_id column

Example - page_categories (users assign categories to their pages):
- MUST include user_id column (FK to auth.users)
- Then use USER-OWNED RLS pattern

For each table and operation, specify:

### Table: table_name (USER-OWNED or REFERENCE)
- SELECT:
  * anon: public/none
  * authenticated: public/own/none
  * admin: global

- INSERT:
  * anon: none
  * authenticated: own/none (own only if USER-OWNED)
  * admin: global

- UPDATE:
  * anon: none
  * authenticated: own/none (own only if USER-OWNED)
  * admin: global

- DELETE:
  * anon: none
  * authenticated: own/none (own only if USER-OWNED)
  * admin: global

## Required Enums

IMPORTANT: List ALL enums that should be created. Each enum becomes a PostgreSQL type.

Format:
- enum_name: value1, value2, value3

Example enums (if applicable):
- user_role: user, admin (automatically added by system)
- page_visibility: public, private
- element_type: text, shape, divider, youtube
- sticker_type: beep, buzz
- content_type: page, sticker, element
- flag_reason: inappropriate, spam, offensive, other
- flag_status: pending, reviewed, dismissed
- mod_action: approve, remove, warn, ban
- approval_status: pending, approved, rejected

List each enum with all its values:
1. enum_name_1: value1, value2, value3
2. enum_name_2: value1, value2

CRITICAL: When you list an enum here (e.g., "page_visibility"), Phase 2 MUST use that enum name as the column type (not TEXT).

## Verification (REQUIRED)

Total tables analyzed: ${tableCount}
Tables list:
${tableDescriptions.map((t, i) => `  ${i + 1}. ${t.name}`).join('\n')}

Status: ✅ ALL ${tableCount} TABLES PROCESSED

Return your analysis as plain text following the format above. Be thorough and explicit.`;
};

export const buildDatabaseSchemaFromPlanPrompt = (
  plan: string,
  tableDescriptions: any[],
  structuredData: any
): string => {
  const tableCount = tableDescriptions.length;
  const expectedRLSPolicyCount = tableCount * 4;

  return `🚨 CRITICAL ANTI-TRUNCATION REQUIREMENTS 🚨

You MUST generate complete output for ALL tables and ALL RLS policies.

REQUIRED COUNTS:
- Tables: ${tableCount} tables (all must appear in output)
- RLS Policies: ${expectedRLSPolicyCount} policy objects minimum (${tableCount} tables × 4 operations)
- Each table needs: SELECT, INSERT, UPDATE, DELETE policies

❌ DO NOT use shortcuts like:
- "[Similar policies for other tables...]"
- "[Continue pattern...]"
- Stopping early
- Omitting columns from the plan

✅ REQUIRED: Explicitly define EVERY policy for EVERY table with EVERY column from the plan

This is an automated process - complete EVERYTHING in ONE response.

DATABASE PLAN:
${plan}

REFERENCE - USER TABLE DESCRIPTIONS:
${tableDescriptions.map((t, i) => `${i + 1}. ${t.name}: ${t.description}`).join('\n')}

TEMPLATES FOR COMMON PATTERNS:
${JSON.stringify(DATABASE_TEMPLATES, null, 2)}

# BEFORE GENERATING JSON - COMPLETE THESE 4 ANALYSIS STEPS

## STEP 0: EXTRACT ALL COLUMNS FROM PLAN

🚨 CRITICAL: You MUST include EVERY column listed in the plan for EVERY table.

For EACH table, list ALL columns from the "Detailed Column Analysis" section:

REQUIRED FORMAT:
1. [table_name]:
   - [column1]: [type]
   - [column2]: [type]
   - [column3]: [type]
   ...

EXAMPLE:
1. page_categories:
   - id: UUID
   - user_id: UUID (FK to auth.users)
   - page_id: UUID (FK to pages)
   - category_id: UUID (FK to categories)
   - created_at: TIMESTAMP WITH TIME ZONE

YOU MUST LIST EVERY COLUMN FOR EVERY TABLE HERE.

This list becomes your checklist - every column listed here MUST appear in your JSON output.

## STEP 1: CLASSIFY TABLE OWNERSHIP

For EACH of the ${tableCount} tables, determine its type:

**USER-OWNED TABLE:** Has user_id or profile_id column
- Examples: profiles, pages, posts, comments, stickers, orders
- RLS Pattern: SELECT=public, INSERT/UPDATE/DELETE=own (authenticated) or global (admin)

**REFERENCE TABLE:** No user_id or profile_id column
- Examples: categories, tags, settings, countries, product_types
- RLS Pattern: SELECT=public, INSERT/UPDATE/DELETE=none (anon/auth) or global (admin only)

REQUIRED: List each table with its classification:
1. [table_name] → USER-OWNED (reason: has user_id column)
2. [table_name] → REFERENCE (reason: no user ownership columns)
... continue for all ${tableCount} tables

This classification determines your RLS policies.

## STEP 2: MAP ENUMS TO COLUMNS

The plan defines enums. For EACH enum, identify which columns should use it.

REQUIRED FORMAT:
- [enum_name]: [column_name] in [table_name], [column_name2] in [table_name2]

EXAMPLE:
- page_visibility: visibility in pages
- element_type: element_type in page_elements
- sticker_type: sticker_type in stickers, sticker_type in sticker_designs
- user_role: role in profiles
- flag_status: status in content_flags
- approval_status: status in sticker_designs

YOU MUST LIST ALL ENUM→COLUMN MAPPINGS HERE.

Then when generating JSON, use enum name as type:
❌ WRONG: { "name": "visibility", "type": "TEXT", "defaultValue": "'public'" }
✅ CORRECT: { "name": "visibility", "type": "page_visibility", "defaultValue": "'public'" }

## STEP 3: PRE-GENERATION VALIDATION CHECKLIST

Before generating JSON, verify:

□ Column Extraction: Listed ALL columns for ALL ${tableCount} tables (from Step 0)
□ Table Classification: Listed all ${tableCount} tables as USER-OWNED or REFERENCE
□ Enum Mapping: Listed all enums with their target columns
□ RLS Count: Planned ${expectedRLSPolicyCount} policies (${tableCount} tables × 4 operations)
□ Enum Types: Will use enum names (NOT "TEXT") for mapped columns
□ Reference Table RLS: REFERENCE tables will use "public"/"none"/"global" (NOT "own")
□ User-Owned Table RLS: USER-OWNED tables will use "own" for authenticated users
□ Junction Table Check: Any table with "own" access MUST have user_id column
□ Column Completeness: Will include EVERY column from Step 0 list in JSON output

ONLY AFTER COMPLETING STEPS 0-3, generate your JSON.

# JSON STRUCTURE

Now convert the plan into valid JSON with this EXACT structure:

{
  "configuration": {
    "databaseProvider": "supabase" | "none"
  },
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
          "name": "user_id",
          "type": "UUID",
          "relation": {
            "table": "auth.users",
            "field": "id",
            "onDelete": "Cascade",
            "relationType": "many-to-one"
          }
        },
        {
          "name": "column_name",
          "type": "TEXT",
          "isOptional": false
        }
      ],
      "checkConstraints": [
        {
          "name": "check_constraint_name",
          "expression": "LENGTH(column_name) <= 200"
        }
      ]
    }
  ],
  "enums": [
    {
      "name": "enum_name",
      "values": [
        { "value": "VALUE1" },
        { "value": "VALUE2" }
      ]
    }
  ],
  "rlsPolicies": [
    {
      "tableName": "table_name",
      "operation": "SELECT" | "INSERT" | "UPDATE" | "DELETE",
      "rolePolicies": [
        {
          "role": "anon" | "authenticated" | "admin",
          "accessType": "none" | "public" | "own" | "global"
        }
      ]
    }
  ]
}

# VALIDATION REQUIREMENTS

1. ✅ Ensure ALL ${tableCount} tables from plan are included in JSON
2. ✅ Include EVERY column listed in Step 0 for each table (do not omit any columns)
3. ✅ Generate ALL ${expectedRLSPolicyCount}+ RLS policy objects (${tableCount} tables × 4 operations minimum)
4. ✅ Verify all foreign key references exist
5. ✅ Include profiles table if not present
6. ✅ Do NOT include user_role enum (automatically added)
7. ✅ Use templates for standard patterns (profiles table, auth integration)
8. ✅ Include ALL check constraints mentioned in plan
9. ✅ Use enum type NAMES in columns (not TEXT)

# JSON GENERATION RULES

**Columns (CRITICAL):**
- Include EVERY column from your Step 0 extraction
- Do NOT skip or omit columns from the plan
- If the plan says "user_id: UUID REFERENCES auth.users.id", you MUST include it

**RLS Policies:**
- Generate ALL 4 operations (SELECT, INSERT, UPDATE, DELETE) for EACH table
- Total required: ${expectedRLSPolicyCount} policy objects minimum
- Use your Step 1 classification to determine "own" vs "public"/"none"
- If Step 1 says USER-OWNED, RLS MUST be "own" for authenticated
- If Step 1 says REFERENCE, RLS MUST be "none" for authenticated

**Enum Types:**
- Use your Step 2 mappings to set column types
- Column type = enum name (e.g., type: "page_visibility", NOT "TEXT")

**Check Constraints:**
- Include ALL constraints mentioned in plan
- Format: { "name": "constraint_name", "expression": "..." }

**Other Rules:**

- Column type options: UUID, TEXT, INTEGER, BIGINT, DOUBLE PRECISION, BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB, DECIMAL, BYTEA
- OR use enum type names (page_visibility, element_type, etc.)
- ALL id columns and FK columns use UUID type
- Foreign keys format: { "table": "table_name", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" }
- profiles table MUST have: id, user_id (FK to auth.users), role, created_at, updated_at
- Tables with profile_id MUST also have user_id for RLS
- Use snake_case for all names

# OUTPUT FORMAT

Return ONLY valid JSON. No markdown code blocks, no explanations, no analysis text.

Start with { and end with }

🚨 FINAL VERIFICATION BEFORE SUBMITTING:
- ${tableCount} tables in "tables" array
- EVERY column from Step 0 list included in corresponding table
- ${expectedRLSPolicyCount}+ policies in "rlsPolicies" array
- Enum type names used (from Step 2 mapping)
- RLS access types match table classification (from Step 1)
- No columns omitted or skipped from the plan`;
};

export const validateTableCount = (
  expected: number,
  received: number,
  source: string
): boolean => {
  if (expected !== received) {
    conditionalLog(
      {
        message: `Table count mismatch in ${source}`,
        expected,
        received,
        diff: expected - received,
      },
      { label: LOG_LABELS.DATABASE }
    );
    return false;
  }
  return true;
};

export const extractTableCountFromPlan = (plan: string): number => {
  const countMatch = plan.match(/(\d+)\s+total\s+tables/i);
  if (countMatch) {
    return parseInt(countMatch[1], 10);
  }
  const tableMatches = plan.match(/^[-•]\s+\w+/gm);
  return tableMatches ? tableMatches.length : 0;
};

import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
