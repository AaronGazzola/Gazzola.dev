import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import type {
  DatabaseTemplate,
  PrismaColumn,
  PrismaEnum,
  PrismaTable,
} from "./DatabaseConfiguration.types";

export const generateId = () => Math.random().toString(36).substring(2, 11);

export interface DatabaseSchemaResponse {
  configuration: {
    databaseProvider: "supabase" | "neondb" | "both" | "none";
    roles: {
      admin: boolean;
      superAdmin: boolean;
      organizations: boolean;
    };
    authentication: {
      magicLink: boolean;
      emailPassword: boolean;
      otp: boolean;
      twoFactor: boolean;
      passkey: boolean;
      anonymous: boolean;
      googleAuth: boolean;
      githubAuth: boolean;
      appleAuth: boolean;
      passwordOnly: boolean;
    };
  };
  tables: PrismaTable[];
  enums: PrismaEnum[];
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
- databaseProvider: supabase | neondb | both | none
- roles: admin, superAdmin, organizations (organizations requires neondb/both)
- authentication: magicLink, emailPassword, otp, twoFactor, passkey, anonymous, googleAuth, githubAuth, appleAuth, passwordOnly

Rules:
- Create enums for status/type/priority/category fields, use enum name as column type
- Include id (String @id @default(cuid())), createdAt, updatedAt for each table
- No auth/user tables - managed by auth system
- Prisma types: String, Int, Float, Boolean, DateTime, Json, Decimal
- Foreign keys: String type named userId, postId, etc.

JSON Structure (IDs auto-generated if omitted, defaults applied by parser):
{
  "configuration": {
    "databaseProvider": "supabase",
    "roles": { "admin": true, "superAdmin": false, "organizations": false },
    "authentication": { "emailPassword": true, "googleAuth": true }
  },
  "enums": [{ "name": "Status", "values": [{ "value": "ACTIVE" }, { "value": "INACTIVE" }] }],
  "tables": [{
    "name": "Task",
    "columns": [
      { "name": "id", "type": "String", "isId": true, "defaultValue": "cuid()", "attributes": ["@id", "@default(cuid())"] },
      { "name": "status", "type": "Status", "defaultValue": "ACTIVE", "attributes": ["@default(ACTIVE)"] },
      { "name": "title", "type": "String" },
      { "name": "createdAt", "type": "DateTime", "defaultValue": "now()", "attributes": ["@default(now())"] },
      { "name": "updatedAt", "type": "DateTime", "attributes": ["@updatedAt"] }
    ]
  }]
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
        tableCount: parsed.tables?.length || 0,
        enumCount: parsed.enums?.length || 0,
        databaseProvider: parsed.configuration?.databaseProvider,
        rawParsedKeys: Object.keys(parsed),
      },
      { label: LOG_LABELS.DATABASE }
    );

    const configuration = parsed.configuration || {
      databaseProvider: "none" as const,
      roles: {
        admin: false,
        superAdmin: false,
        organizations: false,
      },
      authentication: {
        magicLink: false,
        emailPassword: false,
        otp: false,
        twoFactor: false,
        passkey: false,
        anonymous: false,
        googleAuth: false,
        githubAuth: false,
        appleAuth: false,
        passwordOnly: false,
      },
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

    return {
      configuration,
      tables,
      enums,
    };
  } catch (error) {
    conditionalLog(
      { message: "Failed to parse database schema response", error, response: response.substring(0, 500) },
      { label: LOG_LABELS.DATABASE }
    );
    return null;
  }
};
