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
- PostgreSQL types: TEXT, INTEGER, BIGINT, DOUBLE PRECISION, BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB, DECIMAL, BYTEA
- Default values: gen_random_uuid(), NOW(), 'string', true/false

Users Table:
- ALWAYS create a 'users' table in the 'public' schema for application-specific user data
- Include at minimum: id (references auth.users.id), createdAt, updatedAt
- Add additional user profile columns mentioned in README (username, displayName, bio, avatarUrl, etc.)
- Use snake_case for column names (user_id, display_name, avatar_url)

Foreign Keys:
- Columns ending in _id (user_id, post_id, author_id) should have relation objects
- Relation format: { "table": "users", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" }
- Use snake_case consistently (user_id not userId)

Check Constraints:
- Add checkConstraints array to tables for business rules mentioned in README
- Examples: max item limits, value ranges, string length limits
- Format: { "name": "check_constraint_name", "expression": "LENGTH(title) <= 200" }

RLS Policy Rules:
- Generate rlsPolicies for EVERY table with ALL operations: SELECT, INSERT, UPDATE, DELETE
- Access types: none (no access - default), global (all rows), own (user's own data via userId), related (via related table)
- Roles available: user (always), admin (always), super-admin (always)
- IMPORTANT: Every role must have an explicit policy for every operation on every table. Default to "none" if no access should be granted

Column Verification Requirements:
- BEFORE assigning "own" access, verify the table has a user_id, userId, OR id column (for users table)
- If table has user_id/userId/id column: use "own" access type
- If table has NO user column but has foreign key to another table with user column: use "related" access with relatedTable specified
- For "related" access, you MUST specify the relatedTable name (e.g., "pages", "users", "posts")

Access Type Examples:
- users table (has "id" column that references auth.users.id):
  * INSERT: "own" (users create their own record where auth.uid() = id)
  * UPDATE: "own" (auth.uid() = id)
  * DELETE: "own" (auth.uid() = id)
  * SELECT: "global" (everyone can see user profiles)

- page_elements table (has page_id → pages, pages table has user_id):
  * INSERT: "related" with relatedTable = "pages" (user must own the page)
  * UPDATE: "related" with relatedTable = "pages"
  * DELETE: "related" with relatedTable = "pages"
  * SELECT: "global" (everyone can see page elements)

- stickers table (users can place stickers on any page, has user_id for sticker owner):
  * INSERT: "global" (anyone authenticated can place stickers)
  * UPDATE: "own" (auth.uid() = user_id, can only update your own stickers)
  * DELETE: "own" (auth.uid() = user_id, can only delete your own stickers)
  * SELECT: "global" (everyone can see stickers)

General Rules:
- super-admin gets "global" access to all tables for all operations
- admin gets "global" access only to tables they should manage (user data tables, not system tables)
- user role: "own" for their data, "related" for data they own through foreign keys, "none" for admin-only tables
- Public reference tables (categories, tags, products): "global" SELECT for all roles, "none" for INSERT/UPDATE/DELETE except admins

JSON Structure (IDs auto-generated if omitted, defaults applied by parser):
{
  "configuration": {
    "databaseProvider": "supabase"
  },
  "enums": [{ "name": "Status", "values": [{ "value": "ACTIVE" }, { "value": "INACTIVE" }] }],
  "tables": [
    {
      "name": "users",
      "schema": "public",
      "columns": [
        { "name": "id", "type": "TEXT", "isId": true, "defaultValue": "gen_random_uuid()", "attributes": ["@id", "@default(gen_random_uuid())"], "relation": { "table": "auth.users", "field": "id", "onDelete": "Cascade", "relationType": "one-to-one" } },
        { "name": "username", "type": "TEXT", "isUnique": true },
        { "name": "display_name", "type": "TEXT", "isOptional": true },
        { "name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "defaultValue": "NOW()", "attributes": ["@default(NOW())"] },
        { "name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE", "attributes": ["@updatedAt"] }
      ],
      "checkConstraints": [
        { "name": "check_username_length", "expression": "LENGTH(username) >= 3 AND LENGTH(username) <= 20" }
      ]
    },
    {
      "name": "posts",
      "schema": "public",
      "columns": [
        { "name": "id", "type": "TEXT", "isId": true, "defaultValue": "gen_random_uuid()", "attributes": ["@id", "@default(gen_random_uuid())"] },
        { "name": "user_id", "type": "TEXT", "relation": { "table": "users", "field": "id", "onDelete": "Cascade", "relationType": "many-to-one" } },
        { "name": "title", "type": "TEXT" },
        { "name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "defaultValue": "NOW()", "attributes": ["@default(NOW())"] },
        { "name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE", "attributes": ["@updatedAt"] }
      ],
      "checkConstraints": [
        { "name": "check_title_length", "expression": "LENGTH(title) > 0 AND LENGTH(title) <= 200" }
      ]
    }
  ],
  "rlsPolicies": [
    { "tableName": "users", "operation": "SELECT", "rolePolicies": [{ "role": "user", "accessType": "global" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "users", "operation": "INSERT", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "users", "operation": "UPDATE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "users", "operation": "DELETE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "SELECT", "rolePolicies": [{ "role": "user", "accessType": "global" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "INSERT", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "UPDATE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "global" }, { "role": "super-admin", "accessType": "global" }] },
    { "tableName": "posts", "operation": "DELETE", "rolePolicies": [{ "role": "user", "accessType": "own" }, { "role": "admin", "accessType": "none" }, { "role": "super-admin", "accessType": "global" }] }
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
        attributes: col.attributes || [],
      })),
    }));

    const hasUsersTable = tables.some(
      (t: PrismaTable) => t.name.toLowerCase() === 'users' && t.schema === 'public'
    );

    if (!hasUsersTable) {
      const usersTable: PrismaTable = {
        id: generateId(),
        name: 'users',
        schema: 'public',
        isDefault: false,
        isEditable: true,
        columns: [
          {
            id: generateId(),
            name: 'id',
            type: 'TEXT',
            isId: true,
            isDefault: false,
            isEditable: true,
            isOptional: false,
            isUnique: false,
            isArray: false,
            defaultValue: 'gen_random_uuid()',
            attributes: ['@id', '@default(gen_random_uuid())'],
            relation: {
              table: 'auth.users',
              field: 'id',
              onDelete: 'Cascade',
              relationType: 'one-to-one'
            }
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
            attributes: ['@default(NOW())']
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
            attributes: ['@updatedAt']
          }
        ],
        uniqueConstraints: [],
        checkConstraints: []
      };

      tables.unshift(usersTable);
    }

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
