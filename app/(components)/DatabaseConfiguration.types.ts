export interface PrismaColumn {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isEditable: boolean;
  isOptional: boolean;
  isUnique: boolean;
  isId: boolean;
  isArray: boolean;
  defaultValue?: string;
  relation?: {
    table: string;
    field: string;
    onDelete?: "Cascade" | "Restrict" | "SetNull" | "NoAction";
  };
  attributes: string[];
}

export interface PrismaTable {
  id: string;
  name: string;
  schema: "auth" | "public";
  isDefault: boolean;
  isEditable: boolean;
  columns: PrismaColumn[];
  uniqueConstraints: string[][];
  questionId?: string;
}

export interface RLSPolicy {
  id: string;
  tableId: string;
  name: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";
  using: string;
  withCheck?: string;
  isEditing: boolean;
}

export interface CodeSection {
  text: string;
  questionId?: string;
}

export interface Plugin {
  id: string;
  name: string;
  enabled: boolean;
  file: "auth" | "auth-client";
  config?: Record<string, unknown>;
  questionId?: string;
  description?: string;
}

export interface DatabaseConfigurationState {
  activeTab: "network" | "schema" | "plugins" | "rls";
  tables: PrismaTable[];
  rlsPolicies: RLSPolicy[];
  plugins: Plugin[];

  setActiveTab: (tab: DatabaseConfigurationState["activeTab"]) => void;

  addTable: (name: string, schema: "auth" | "public") => void;
  deleteTable: (tableId: string) => void;
  updateTableName: (tableId: string, name: string) => void;
  updateTableSchema: (tableId: string, schema: "auth" | "public") => void;

  addColumn: (tableId: string, column: Omit<PrismaColumn, "id">) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  updateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;

  addRLSPolicy: (policy: Omit<RLSPolicy, "id">) => void;
  deleteRLSPolicy: (policyId: string) => void;
  updateRLSPolicy: (policyId: string, updates: Partial<RLSPolicy>) => void;

  addPlugin: (plugin: Omit<Plugin, "id">) => void;
  deletePlugin: (pluginId: string) => void;
  updatePlugin: (pluginId: string, updates: Partial<Plugin>) => void;
  getPluginsByFile: (file: "auth" | "auth-client") => Plugin[];

  generatePrismaSchema: () => string;
  generateRLSPolicies: () => string;

  initializeFromConfig: (
    config: import("@/app/(editor)/layout.types").InitialConfigurationType
  ) => void;
  reset: () => void;
}

export const PRISMA_TYPES = [
  "String",
  "Int",
  "Float",
  "Boolean",
  "DateTime",
  "Json",
  "BigInt",
  "Decimal",
  "Bytes",
] as const;

export type PrismaType = (typeof PRISMA_TYPES)[number];
