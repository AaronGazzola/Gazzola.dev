import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import type {
  DatabaseTemplate,
  PrismaColumn,
  PrismaEnum,
  PrismaTable,
  RLSAccessType,
  UserRole,
} from "./DatabaseConfiguration.types";

export const generateId = () => Math.random().toString(36).substring(2, 11);

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
  tables: PrismaTable[];
  enums: PrismaEnum[];
  rlsPolicies: AIRLSPolicy[];
}

export const generateDatabaseSchemaPrompt = (
  readmeContent: string,
  appStructure: FileSystemEntry[],
  _templates: DatabaseTemplate[]
): string => {
  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

README:
${readmeContent}

App Structure:
${JSON.stringify(appStructure)}

Options:
- databaseProvider: supabase | none

Rules:
- Create enums for status/type/priority/category fields, use enum name as column type
- Include id (TEXT PRIMARY KEY DEFAULT gen_random_uuid()), createdAt, updatedAt for each table
- No auth/user tables - managed by auth system
- PostgreSQL types: TEXT, INTEGER, BIGINT, DOUBLE PRECISION, BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB, DECIMAL, BYTEA
- Foreign keys: TEXT type named userId, postId, etc.
- Default values: gen_random_uuid(), NOW(), 'string', true/false

RLS Policy Rules:
- Generate rlsPolicies for EVERY table with ALL operations: SELECT, INSERT, UPDATE, DELETE
- Access types: none (no access - default), global (all rows), own (user's own data via userId), related (via related table)
- Roles available: user (always), admin (always), super-admin (always)
- IMPORTANT: Every role must have an explicit policy for every operation on every table. Default to "none" if no access should be granted
- Tables with userId/authorId/ownerId column: user role gets "own" for SELECT/UPDATE/DELETE, "own" for INSERT
- super-admin gets "global" access to all tables for all operations
- admin gets "global" access only to tables they should manage (user data tables, not system tables)
- user role: "own" for their data, "none" for admin-only tables
- Public reference tables (categories, tags, products): "global" SELECT for all roles, "none" for INSERT/UPDATE/DELETE except admins

JSON Structure (IDs auto-generated if omitted, defaults applied by parser):
{
  "configuration": {
    "databaseProvider": "supabase"
  },
  "enums": [{ "name": "Status", "values": [{ "value": "ACTIVE" }, { "value": "INACTIVE" }] }],
  "tables": [{
    "name": "Task",
    "columns": [
      { "name": "id", "type": "TEXT", "isId": true, "defaultValue": "gen_random_uuid()", "attributes": ["@id", "@default(gen_random_uuid())"] },
      { "name": "userId", "type": "TEXT" },
      { "name": "status", "type": "Status", "defaultValue": "ACTIVE", "attributes": ["@default(ACTIVE)"] },
      { "name": "title", "type": "TEXT" },
      { "name": "createdAt", "type": "TIMESTAMP WITH TIME ZONE", "defaultValue": "NOW()", "attributes": ["@default(NOW())"] },
      { "name": "updatedAt", "type": "TIMESTAMP WITH TIME ZONE", "attributes": ["@updatedAt"] }
    ]
  }],
  "rlsPolicies": [
    { "tableName": "Task", "operation": "SELECT", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "Task", "operation": "INSERT", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "Task", "operation": "UPDATE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "Task", "operation": "DELETE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] }
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

    const tables = (parsed.tables || []).map((table: PrismaTable) => ({
      ...table,
      id: table.id || generateId(),
      schema: table.schema || "public",
      isDefault: false,
      isEditable: true,
      uniqueConstraints: table.uniqueConstraints || [],
      columns: (table.columns || []).map((col: PrismaColumn) => ({
        ...col,
        id: col.id || generateId(),
        isDefault: false,
        isEditable: true,
        attributes: col.attributes || [],
      })),
    }));

    const enums = (parsed.enums || []).map((enumItem: PrismaEnum) => ({
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
