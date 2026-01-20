import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import type {
  DatabaseTemplate,
  DatabaseColumn,
  DatabaseEnum,
  DatabaseTable,
  RLSAccessType,
  UserRole,
} from "./DatabaseConfiguration.types";

export const generateId = () => Math.random().toString(36).substring(2, 11);

export interface TableDescription {
  id: string;
  name: string;
  description: string;
}

export interface TableDescriptionsResponse {
  tables: TableDescription[];
}

export interface AIRLSRolePolicy {
  role: UserRole;
  accessType: RLSAccessType;
  relatedTable?: string;
}

export interface AIRLSPolicy {
  tableName: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  rolePolicies: AIRLSRolePolicy[];
}

export interface DatabaseSchemaResponse {
  configuration: {
    databaseProvider: "supabase" | "none";
  };
  tables: DatabaseTable[];
  enums: DatabaseEnum[];
  rlsPolicies: AIRLSPolicy[];
}

export const generateDatabaseSchemaPrompt = (
  structuredAppData: string,
  appStructure: FileSystemEntry[],
  _templates: DatabaseTemplate[]
): string => {
  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

APP DATA (Structured JSON with title, description, auth methods, pages, features, and access levels):
${structuredAppData}

FILE SYSTEM STRUCTURE:
${JSON.stringify(appStructure)}

Options:
- databaseProvider: supabase | none

IMPORTANT - Supabase Authentication:
- Supabase automatically provides authentication tables in the "auth" schema
- DO NOT create tables for: users, sessions, accounts, verification_tokens, magic_links, or any auth-related infrastructure
- The auth.users table (plural "users") handles authentication, email verification, and sessions
- DO NOT create a "users" or "user" table - this conflicts with auth.users
- Use a "profiles" table in the "public" schema for application-specific profile data

Available Auth Schema Table for Relations:
- auth.users - Main user authentication table with id, email, and other user fields
- You CAN create foreign key relations to auth.users when you need to reference the authenticated user

Rules:
- Create enums for status/type/priority/category fields, use enum name as column type
- Include id (UUID PRIMARY KEY DEFAULT gen_random_uuid()), created_at, updated_at for each table
- PostgreSQL types: UUID, TEXT, INTEGER, BIGINT, DOUBLE PRECISION, BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB, DECIMAL, BYTEA
- Default values: gen_random_uuid(), NOW(), 'string', true/false
- Use snake_case for all column names
- IMPORTANT: ALL id columns and foreign key columns referencing ids MUST use UUID type (not TEXT)
- CRITICAL: User ID Denormalization for RLS - ANY table that references profiles (via profile_id) or other user-owned tables MUST include a denormalized user_id UUID column. This is REQUIRED for Row Level Security policies to work correctly. NO EXCEPTIONS.

Public Profiles Table:
- ALWAYS create a 'profiles' table in the 'public' schema for application-specific user data
- Never use "users" or "user" as a table name - always use "profiles" instead
- Structure: The profiles table MUST have:
  * Its own primary key: id (UUID, PRIMARY KEY, DEFAULT gen_random_uuid())
  * A foreign key to auth: user_id (UUID, UNIQUE, references auth.users.id, onDelete: Cascade)
  * A role column: role (user_role enum type, DEFAULT 'user', NOT NULL) - automatically added by the system
- The user_id column creates a one-to-one relationship with auth.users
- Add additional user profile columns mentioned in README (username, display_name, bio, avatar_url, etc.)
- Use snake_case for all column names

IMPORTANT - User Role Enum:
- A user_role enum is automatically generated with values: 'user', 'admin', 'super-admin'
- DO NOT include user_role in your enums array - it's handled automatically
- The profiles table automatically gets a 'role' column of type 'user_role' with default 'user'

Foreign Key Naming Conventions:
- Foreign key names MUST match the table they reference using pattern: {table_name}_id
- Examples:
  * Referencing profiles table → use "profile_id" (NOT "user_id")
  * Referencing posts table → use "post_id"
  * Referencing auth.users directly → use "user_id"
- Format: { "table": "table_name", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" }
- Use snake_case consistently (profile_id not profileId)
- IMPORTANT: Only use "user_id" when directly referencing auth.users, use "profile_id" when referencing profiles table
- ALL foreign key columns MUST use UUID type (not TEXT)

Check Constraints:
- Add checkConstraints array to tables for business rules mentioned in README
- Examples: max item limits, value ranges, string length limits
- Format: { "name": "check_constraint_name", "expression": "LENGTH(title) <= 200" }

RLS Policy Rules:
- Generate rlsPolicies for EVERY table with ALL operations: SELECT, INSERT, UPDATE, DELETE
- Access types: none (no access), public (everyone), own (user's own data via user_id), global (all users of role)
- Roles: anon (unauthenticated), authenticated (logged-in users), admin (administrators)
- IMPORTANT: These are PostgreSQL roles - they map directly to database role grants
- IMPORTANT: Use security definer function is_admin() for admin role checks
- IMPORTANT: Every role must have an explicit policy for every operation on every table. Default to "none" if no access should be granted

CRITICAL - User ID Denormalization (REQUIRED for RLS):
- EVERY table that has profile_id MUST also have user_id (UUID, references auth.users.id)
- EVERY table that references a user-owned table MUST have user_id denormalized
- Examples:
  * pages table: has profile_id → MUST also have user_id
  * comments table: has post_id → MUST also have user_id (even though 2 levels from profiles)
  * stickers table: has profile_id → MUST also have user_id
  * reports table: has reporter_id (FK to profiles) → MUST also have user_id
- The user_id column enables efficient RLS policies with "own" access type
- Without user_id, RLS will fail with USING (false) and users cannot manage their data
- Add user_id column immediately after the primary ownership FK (profile_id, etc.)
- Format: { "name": "user_id", "type": "UUID", "relation": { "table": "auth.users", "field": "id", "onDelete": "Cascade" } }

Access Type Examples:

1. User-owned tables (profiles, posts, comments with user_id):
   - anon: SELECT=public, others=none
   - authenticated: SELECT=public, INSERT/UPDATE/DELETE=own
   - admin: all operations=global

2. Reference tables (categories, tags - no user_id):
   - anon: SELECT=public, others=none
   - authenticated: SELECT=public, others=none
   - admin: all operations=global

3. Admin-only tables (system config):
   - anon: all=none
   - authenticated: all=none
   - admin: all=global

4. User-owned nested tables (comments, page_elements, stickers):
   - MUST include user_id column for RLS to work
   - Example - comments: id, content, post_id (FK to posts), user_id (FK to auth.users)
   - Example - stickers: id, page_id, profile_id, user_id (FK to auth.users), position, style
   - anon: SELECT=public, others=none
   - authenticated: SELECT=public, INSERT/UPDATE/DELETE=own
   - admin: all operations=global

NOTE on user_id maintenance:
- The user_id column MUST be defined as a regular UUID column with FK to auth.users
- Applications can set user_id directly using auth.uid() in their INSERT statements
- Triggers are OPTIONAL and only needed for automatic maintenance
- Example trigger (optional, for reference only - do not include in JSON):

CREATE OR REPLACE FUNCTION set_comment_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := (SELECT user_id FROM posts WHERE id = NEW.post_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

JSON Structure (IDs auto-generated if omitted, defaults applied by parser):
{
  "configuration": {
    "databaseProvider": "supabase"
  },
  "enums": [{ "name": "Status", "values": [{ "value": "ACTIVE" }, { "value": "INACTIVE" }] }],
  "tables": [
    {
      "name": "profiles",
      "schema": "public",
      "columns": [
        { "name": "id", "type": "UUID", "isId": true, "defaultValue": "gen_random_uuid()" },
        { "name": "user_id", "type": "UUID", "isUnique": true, "relation": { "table": "auth.users", "field": "id", "onDelete": "Cascade", "relationType": "one-to-one" } },
        { "name": "username", "type": "TEXT", "isUnique": true },
        { "name": "display_name", "type": "TEXT", "isOptional": true },
        { "name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "defaultValue": "NOW()" },
        { "name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE" }
      ],
      "checkConstraints": [
        { "name": "check_username_length", "expression": "LENGTH(username) >= 3 AND LENGTH(username) <= 20" }
      ]
    },
    {
      "name": "posts",
      "schema": "public",
      "columns": [
        { "name": "id", "type": "UUID", "isId": true, "defaultValue": "gen_random_uuid()" },
        { "name": "profile_id", "type": "UUID", "relation": { "table": "profiles", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" } },
        { "name": "user_id", "type": "UUID", "relation": { "table": "auth.users", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" } },
        { "name": "title", "type": "TEXT" },
        { "name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "defaultValue": "NOW()" },
        { "name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE" }
      ],
      "checkConstraints": [
        { "name": "check_title_length", "expression": "LENGTH(title) > 0 AND LENGTH(title) <= 200" }
      ]
    }
  ],
  "rlsPolicies": [
    { "tableName": "profiles", "operation": "SELECT", "rolePolicies": [{ "role": "anon", "accessType": "public" }, { "role": "authenticated", "accessType": "public" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "profiles", "operation": "INSERT", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "profiles", "operation": "UPDATE", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "profiles", "operation": "DELETE", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "SELECT", "rolePolicies": [{ "role": "anon", "accessType": "public" }, { "role": "authenticated", "accessType": "public" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "INSERT", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "UPDATE", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "DELETE", "rolePolicies": [{ "role": "anon", "accessType": "none" }, { "role": "authenticated", "accessType": "own" }, { "role": "admin", "accessType": "global" }] }
  ]
}`;
};

export const parseDatabaseSchemaFromResponse = (
  response: string
): DatabaseSchemaResponse | null => {
  try {
    let jsonContent = response;

    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonContent = jsonBlockMatch[1];
    } else {
      const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1];
      } else {
        const jsonStartIndex = response.indexOf("{");
        const jsonEndIndex = response.lastIndexOf("}");
        if (
          jsonStartIndex !== -1 &&
          jsonEndIndex !== -1 &&
          jsonEndIndex > jsonStartIndex
        ) {
          jsonContent = response.substring(jsonStartIndex, jsonEndIndex + 1);
        }
      }
    }

    const parsed = JSON.parse(jsonContent.trim());

    conditionalLog(
      {
        message: "Parsing database schema response",
        hasConfiguration: !!parsed.configuration,
        hasTables: !!parsed.tables,
        hasEnums: !!parsed.enums,
        hasRLSPolicies: !!parsed.rlsPolicies,
        tableCount: parsed.tables?.length || 0,
        enumCount: parsed.enums?.length || 0,
        rlsPolicyCount: parsed.rlsPolicies?.length || 0,
        databaseProvider: parsed.configuration?.databaseProvider,
        rawParsedKeys: Object.keys(parsed),
      },
      { label: LOG_LABELS.DATABASE }
    );

    const configuration = parsed.configuration || {
      databaseProvider: "none" as const,
    };

    let tables = (parsed.tables || []).map((table: any) => ({
      ...table,
      id: table.id || generateId(),
      schema: table.schema || "public",
      isDefault: false,
      isEditable: true,
      uniqueConstraints: table.uniqueConstraints || [],
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

    const hasProfilesTable = tables.some(
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
              relationType: 'one-to-one'
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
            isDefault: false,
            isEditable: true,
            isOptional: false,
            isUnique: false,
            isId: false,
            isArray: false,
            defaultValue: 'NOW()',
          },
          {
            id: generateId(),
            name: 'updated_at',
            type: 'TIMESTAMP WITH TIME ZONE',
            isDefault: false,
            isEditable: true,
            isOptional: false,
            isUnique: false,
            isId: false,
            isArray: false,
          }
        ],
        uniqueConstraints: [],
        checkConstraints: []
      };

      tables.unshift(profilesTable);
    }

    const profilesTable = tables.find((t: DatabaseTable) => t.name === 'profiles' && t.schema === 'public');
    if (profilesTable) {
      const hasRoleColumn = profilesTable.columns.some((c: DatabaseColumn) => c.name === 'role');
      if (!hasRoleColumn) {
        const updatedAtIndex = profilesTable.columns.findIndex((c: DatabaseColumn) => c.name === 'updated_at');
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
      }
    }

    const enums = (parsed.enums || []).map((enumItem: DatabaseEnum) => ({
      ...enumItem,
      id: enumItem.id || generateId(),
      isDefault: false,
      isEditable: true,
      values: (enumItem.values || []).map((v) => ({
        ...v,
        id: v.id || generateId(),
      })),
    }));

    const rlsPolicies: AIRLSPolicy[] = (parsed.rlsPolicies || []).map(
      (policy: AIRLSPolicy) => ({
        tableName: policy.tableName,
        operation: policy.operation,
        rolePolicies: (policy.rolePolicies || []).map((rp) => ({
          role: rp.role,
          accessType: rp.accessType,
          relatedTable: rp.relatedTable,
        })),
      })
    );

    return {
      configuration,
      tables,
      enums,
      rlsPolicies,
    };
  } catch (error) {
    conditionalLog(
      { message: "Failed to parse database schema response", error, response: response.substring(0, 500) },
      { label: LOG_LABELS.DATABASE }
    );
    return null;
  }
};

export const generateTableDescriptionsPrompt = (
  structuredAppData: string,
  appStructure: FileSystemEntry[]
): string => {
  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

APP DATA (Structured JSON with title, description, auth methods, pages, features, and access levels):
${structuredAppData}

FILE SYSTEM STRUCTURE:
${JSON.stringify(appStructure)}

Based on the app data and features, generate a list of database tables with names and descriptions.

IMPORTANT - Supabase Auth Tables:
- DO NOT include auth-related tables (users, user, sessions, accounts, verification_tokens, magic_links, etc.)
- Supabase automatically provides authentication tables in the "auth" schema
- The auth.users table (plural "users") handles authentication, email verification, and session management
- DO NOT create a "users" or "user" table - this conflicts with auth.users
- Use a "profiles" table in the "public" schema for application-specific user profile data (bio, avatar, preferences, etc.)

Rules:
- Table names should be in snake_case (e.g., "profiles", "user_posts", "page_elements")
- Always include a "profiles" table in the "public" schema for application-specific user data that extends auth.users
- Never use "users" or "user" as a table name - use "profiles" instead
- Create tables for each main entity mentioned in the features
- Description should explain what data the table stores and its purpose
- Keep descriptions concise (1-2 sentences)
- Focus on application-specific data, not authentication infrastructure

JSON Structure:
{
  "tables": [
    { "name": "profiles", "description": "Stores application-specific user profile data (username, bio, avatar, preferences) that extends the Supabase auth.users table" },
    { "name": "posts", "description": "Contains user-created posts with titles, content, and metadata" }
  ]
}

Return only the JSON object, no additional text.`;
};

export const parseTableDescriptionsFromResponse = (
  response: string
): TableDescriptionsResponse | null => {
  try {
    let jsonContent = response;

    const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonContent = jsonBlockMatch[1];
    } else {
      const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1];
      } else {
        const jsonStartIndex = response.indexOf("{");
        const jsonEndIndex = response.lastIndexOf("}");
        if (
          jsonStartIndex !== -1 &&
          jsonEndIndex !== -1 &&
          jsonEndIndex > jsonStartIndex
        ) {
          jsonContent = response.substring(jsonStartIndex, jsonEndIndex + 1);
        }
      }
    }

    const parsed = JSON.parse(jsonContent.trim());

    if (!parsed.tables || !Array.isArray(parsed.tables)) {
      conditionalLog(
        {
          message: "Invalid table descriptions response - no tables array",
          parsed,
        },
        { label: LOG_LABELS.DATABASE }
      );
      return null;
    }

    const tables: TableDescription[] = parsed.tables.map((table: any) => ({
      id: generateId(),
      name: table.name || "",
      description: table.description || "",
    }));

    return { tables };
  } catch (error) {
    conditionalLog(
      {
        message: "Failed to parse table descriptions response",
        error,
        response: response.substring(0, 500),
      },
      { label: LOG_LABELS.DATABASE }
    );
    return null;
  }
};
