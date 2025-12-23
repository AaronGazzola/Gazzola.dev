export type RelationType = "one-to-many" | "many-to-one" | "one-to-one";

export interface PrismaEnum {
  id: string;
  name: string;
  values: PrismaEnumValue[];
  isDefault: boolean;
  isEditable: boolean;
}

export interface PrismaEnumValue {
  id: string;
  value: string;
}

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
    relationType?: RelationType;
    inverseFieldName?: string;
    foreignKeyFieldId?: string;
  };
  attributes: string[];
}

export interface PrismaTable {
  id: string;
  name: string;
  schema: string;
  isDefault: boolean;
  isEditable: boolean;
  columns: PrismaColumn[];
  uniqueConstraints: string[][];
  questionId?: string;
}

export type UserRole = "user" | "admin" | "super-admin" | "org-admin" | "org-member";

export type RLSAccessType = "none" | "global" | "own" | "organization" | "related";

export interface RLSRolePolicy {
  role: UserRole;
  accessType: RLSAccessType;
  relatedTable?: string;
}

export interface RLSPolicy {
  id: string;
  tableId: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  rolePolicies: RLSRolePolicy[];
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
  enums: PrismaEnum[];
  rlsPolicies: RLSPolicy[];
  plugins: Plugin[];

  setActiveTab: (tab: DatabaseConfigurationState["activeTab"]) => void;

  addTable: (name: string, schema: string) => string;
  deleteTable: (tableId: string) => void;
  deleteSchema: (schema: string) => void;
  updateTableName: (tableId: string, name: string) => void;
  updateTableSchema: (tableId: string, schema: string) => void;
  getAvailableSchemas: () => string[];
  getAvailableSchemasWithConfig: (config: import("@/app/(editor)/layout.types").InitialConfigurationType) => string[];

  addEnum: (name: string) => string;
  deleteEnum: (enumId: string) => void;
  updateEnumName: (enumId: string, name: string) => void;
  addEnumValue: (enumId: string, value: string) => void;
  deleteEnumValue: (enumId: string, valueId: string) => void;
  updateEnumValue: (enumId: string, valueId: string, value: string) => void;
  getAllEnums: () => PrismaEnum[];

  addColumn: (tableId: string, column: Omit<PrismaColumn, "id">) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  updateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
  applyTemplate: (template: DatabaseTemplate, schema: string) => string;

  addOrUpdateRLSPolicy: (tableId: string, operation: RLSPolicy["operation"], role: UserRole, accessType: RLSAccessType, relatedTable?: string) => void;
  removeRLSRolePolicy: (tableId: string, operation: RLSPolicy["operation"], role: UserRole) => void;
  getRLSPoliciesForTable: (tableId: string) => RLSPolicy[];
  getRLSPolicyForOperation: (tableId: string, operation: RLSPolicy["operation"]) => RLSPolicy | undefined;

  addPlugin: (plugin: Omit<Plugin, "id">) => void;
  deletePlugin: (pluginId: string) => void;
  updatePlugin: (pluginId: string, updates: Partial<Plugin>) => void;
  getPluginsByFile: (file: "auth" | "auth-client") => Plugin[];

  generatePrismaSchema: () => string;
  generateSupabaseMigration: () => string;
  generateRLSPolicies: () => string;

  initializeFromConfig: (
    config: import("@/app/(editor)/layout.types").InitialConfigurationType
  ) => void;
  setTablesFromAI: (tables: PrismaTable[]) => void;
  setEnumsFromAI: (enums: PrismaEnum[]) => void;
  setRLSPoliciesFromAI: (
    policies: {
      tableName: string;
      operation: RLSPolicy["operation"];
      rolePolicies: { role: UserRole; accessType: RLSAccessType; relatedTable?: string }[];
    }[],
    tables: PrismaTable[]
  ) => void;
  reset: () => void;
}

export const POSTGRES_TYPES = [
  "TEXT",
  "INTEGER",
  "BIGINT",
  "BOOLEAN",
  "TIMESTAMP WITH TIME ZONE",
  "JSONB",
  "DECIMAL",
  "DOUBLE PRECISION",
  "BYTEA",
] as const;

export type PostgresType = (typeof POSTGRES_TYPES)[number];

export interface ColumnTemplate {
  name: string;
  type: string;
  isOptional?: boolean;
  isUnique?: boolean;
  isId?: boolean;
  isArray?: boolean;
  defaultValue?: string;
  attributes?: string[];
}

export interface TableTemplate {
  name: string;
  columns: ColumnTemplate[];
  uniqueConstraints?: string[][];
}

export interface DatabaseTemplate {
  id: string;
  name: string;
  description: string;
  tables: TableTemplate[];
}

export const DATABASE_TEMPLATES: DatabaseTemplate[] = [
  {
    id: "blog",
    name: "Blog Platform",
    description: "Blog with posts, comments, and categories",
    tables: [
      {
        name: "Profile",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "userId", type: "String", isUnique: true },
          { name: "bio", type: "String", isOptional: true },
          { name: "avatar", type: "String", isOptional: true },
          { name: "website", type: "String", isOptional: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Post",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "title", type: "String" },
          { name: "slug", type: "String", isUnique: true },
          { name: "content", type: "String" },
          { name: "excerpt", type: "String", isOptional: true },
          { name: "published", type: "Boolean", defaultValue: "false" },
          { name: "authorId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Comment",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "content", type: "String" },
          { name: "postId", type: "String" },
          { name: "authorId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Category",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "name", type: "String", isUnique: true },
          { name: "slug", type: "String", isUnique: true },
          { name: "description", type: "String", isOptional: true }
        ]
      }
    ]
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    description: "Products, orders, and cart management",
    tables: [
      {
        name: "Product",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "name", type: "String" },
          { name: "slug", type: "String", isUnique: true },
          { name: "description", type: "String" },
          { name: "price", type: "Decimal" },
          { name: "stock", type: "Int", defaultValue: "0" },
          { name: "imageUrl", type: "String", isOptional: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Order",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "userId", type: "String" },
          { name: "total", type: "Decimal" },
          { name: "status", type: "String", defaultValue: '"pending"' },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "OrderItem",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "orderId", type: "String" },
          { name: "productId", type: "String" },
          { name: "quantity", type: "Int" },
          { name: "price", type: "Decimal" }
        ]
      },
      {
        name: "Cart",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "userId", type: "String", isUnique: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "CartItem",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "cartId", type: "String" },
          { name: "productId", type: "String" },
          { name: "quantity", type: "Int", defaultValue: "1" }
        ]
      }
    ]
  },
  {
    id: "social",
    name: "Social Network",
    description: "Users, posts, likes, and follows",
    tables: [
      {
        name: "Profile",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "userId", type: "String", isUnique: true },
          { name: "username", type: "String", isUnique: true },
          { name: "displayName", type: "String" },
          { name: "bio", type: "String", isOptional: true },
          { name: "avatar", type: "String", isOptional: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" }
        ]
      },
      {
        name: "Post",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "content", type: "String" },
          { name: "authorId", type: "String" },
          { name: "imageUrl", type: "String", isOptional: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Like",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "postId", type: "String" },
          { name: "userId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" }
        ],
        uniqueConstraints: [["postId", "userId"]]
      },
      {
        name: "Follow",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "followerId", type: "String" },
          { name: "followingId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" }
        ],
        uniqueConstraints: [["followerId", "followingId"]]
      }
    ]
  },
  {
    id: "taskmanager",
    name: "Task Manager",
    description: "Projects, tasks, and collaboration",
    tables: [
      {
        name: "Project",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "name", type: "String" },
          { name: "description", type: "String", isOptional: true },
          { name: "ownerId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Task",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "title", type: "String" },
          { name: "description", type: "String", isOptional: true },
          { name: "status", type: "String", defaultValue: '"todo"' },
          { name: "priority", type: "String", defaultValue: '"medium"' },
          { name: "projectId", type: "String" },
          { name: "assigneeId", type: "String", isOptional: true },
          { name: "dueDate", type: "DateTime", isOptional: true },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" },
          { name: "updatedAt", type: "DateTime", attributes: ["@updatedAt"] }
        ]
      },
      {
        name: "Comment",
        columns: [
          { name: "id", type: "String", isId: true, defaultValue: "cuid()" },
          { name: "content", type: "String" },
          { name: "taskId", type: "String" },
          { name: "authorId", type: "String" },
          { name: "createdAt", type: "DateTime", defaultValue: "now()" }
        ]
      }
    ]
  }
];
