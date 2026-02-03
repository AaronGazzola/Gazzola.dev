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
            defaultValue: 'NOW()',
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
