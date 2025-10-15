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
}

export interface CodeSection {
  text: string;
  questionId?: string;
}

export interface DatabaseConfigurationState {
  activeTab: "schema" | "auth" | "auth-client" | "rls" | "network";
  tables: PrismaTable[];
  rlsPolicies: RLSPolicy[];

  setActiveTab: (tab: DatabaseConfigurationState["activeTab"]) => void;

  addTable: (name: string, schema: "auth" | "public") => void;
  deleteTable: (tableId: string) => void;
  updateTableName: (tableId: string, name: string) => void;

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

  generatePrismaSchema: () => string;
  generateAuthConfig: (config?: import("@/app/(editor)/layout.types").InitialConfigurationType) => string;
  generateAuthClientConfig: (config?: import("@/app/(editor)/layout.types").InitialConfigurationType) => string;
  generateAuthConfigSections: (config?: import("@/app/(editor)/layout.types").InitialConfigurationType) => CodeSection[];
  generateAuthClientConfigSections: (config?: import("@/app/(editor)/layout.types").InitialConfigurationType) => CodeSection[];
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
