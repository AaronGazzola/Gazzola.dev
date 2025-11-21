import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { PrismaColumn, PrismaTable } from "./DatabaseConfiguration.types";

export interface SchemaTableDefinition {
  name: string;
  schema: string;
  isEditable: boolean;
  columns: Omit<PrismaColumn, "id">[];
  condition: (config: InitialConfigurationType) => boolean;
}

export interface SchemaFieldDefinition {
  tableName: string;
  schema: string;
  column: Omit<PrismaColumn, "id">;
  condition: (config: InitialConfigurationType) => boolean;
}

const createColumn = (
  name: string,
  type: PrismaColumn["type"],
  options: Partial<Omit<PrismaColumn, "id" | "name" | "type">> = {}
): Omit<PrismaColumn, "id"> => ({
  name,
  type,
  isDefault: true,
  isEditable: false,
  isOptional: options.isOptional ?? false,
  isUnique: options.isUnique ?? false,
  isId: options.isId ?? false,
  isArray: options.isArray ?? false,
  attributes: options.attributes ?? [],
  defaultValue: options.defaultValue,
  relation: options.relation,
});

export const BETTER_AUTH_CORE_TABLES: SchemaTableDefinition[] = [
  {
    name: "user",
    schema: "better_auth",
    isEditable: false,
    condition: (config) => config.technologies.betterAuth,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("name", "String", { isOptional: true }),
      createColumn("email", "String", { isUnique: true }),
      createColumn("emailVerified", "Boolean", { defaultValue: "false" }),
      createColumn("image", "String", { isOptional: true }),
      createColumn("isAnonymous", "Boolean", { defaultValue: "false" }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "session",
    schema: "better_auth",
    isEditable: false,
    condition: (config) => config.technologies.betterAuth,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
      }),
      createColumn("expiresAt", "DateTime"),
      createColumn("ipAddress", "String", { isOptional: true }),
      createColumn("userAgent", "String", { isOptional: true }),
    ],
  },
  {
    name: "account",
    schema: "better_auth",
    isEditable: false,
    condition: (config) => config.technologies.betterAuth,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
      }),
      createColumn("accountId", "String"),
      createColumn("provider", "String"),
      createColumn("accessToken", "String", { isOptional: true }),
      createColumn("refreshToken", "String", { isOptional: true }),
      createColumn("accessTokenExpiresAt", "DateTime", { isOptional: true }),
      createColumn("idToken", "String", { isOptional: true }),
      createColumn("scope", "String", { isOptional: true }),
      createColumn("password", "String", { isOptional: true }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "verification",
    schema: "better_auth",
    isEditable: false,
    condition: (config) => config.technologies.betterAuth,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("identifier", "String"),
      createColumn("value", "String"),
      createColumn("expiresAt", "DateTime"),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
];

export const BETTER_AUTH_FEATURE_TABLES: SchemaTableDefinition[] = [
  {
    name: "twoFactor",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth &&
      config.features.authentication.twoFactor,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
        isUnique: true,
      }),
      createColumn("secret", "String"),
      createColumn("backupCodes", "String"),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "passkey",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth &&
      config.features.authentication.passkey,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
      }),
      createColumn("name", "String", { isOptional: true }),
      createColumn("publicKey", "String"),
      createColumn("credentialID", "String", { isUnique: true }),
      createColumn("counter", "Int"),
      createColumn("deviceType", "String"),
      createColumn("backedUp", "Boolean"),
      createColumn("transports", "String", { isOptional: true }),
      createColumn("aaguid", "String", { isOptional: true }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "organization",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("name", "String"),
      createColumn("logo", "String", { isOptional: true }),
      createColumn("metadata", "Json", { isOptional: true }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "member",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("organizationId", "String", {
        relation: { table: "organization", field: "id", onDelete: "Cascade" },
      }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
      }),
      createColumn("role", "String", { defaultValue: "'member'" }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "invitation",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("organizationId", "String", {
        relation: { table: "organization", field: "id", onDelete: "Cascade" },
      }),
      createColumn("email", "String"),
      createColumn("role", "String", { isOptional: true }),
      createColumn("expiresAt", "DateTime", { isOptional: true }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "team",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("organizationId", "String", {
        relation: { table: "organization", field: "id", onDelete: "Cascade" },
      }),
      createColumn("name", "String"),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
      createColumn("updatedAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
  {
    name: "teamMember",
    schema: "better_auth",
    isEditable: false,
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
    columns: [
      createColumn("id", "String", { isId: true, defaultValue: "cuid()" }),
      createColumn("teamId", "String", {
        relation: { table: "team", field: "id", onDelete: "Cascade" },
      }),
      createColumn("userId", "String", {
        relation: { table: "user", field: "id", onDelete: "Cascade" },
      }),
      createColumn("createdAt", "DateTime", { defaultValue: "now()" }),
    ],
  },
];

export const BETTER_AUTH_CONDITIONAL_FIELDS: SchemaFieldDefinition[] = [
  {
    tableName: "user",
    schema: "better_auth",
    column: createColumn("twoFactorEnabled", "Boolean", {
      defaultValue: "false",
    }),
    condition: (config) =>
      config.technologies.betterAuth &&
      config.features.authentication.twoFactor,
  },
  {
    tableName: "user",
    schema: "better_auth",
    column: createColumn("role", "String", { defaultValue: "'user'" }),
    condition: (config) =>
      config.technologies.betterAuth &&
      (config.features.admin.admin ||
        config.features.admin.superAdmin ||
        config.features.admin.organizations),
  },
  {
    tableName: "session",
    schema: "better_auth",
    column: createColumn("activeOrganizationId", "String", {
      isOptional: true,
      relation: { table: "organization", field: "id", onDelete: "SetNull" },
    }),
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
  },
  {
    tableName: "session",
    schema: "better_auth",
    column: createColumn("activeTeamId", "String", {
      isOptional: true,
      relation: { table: "team", field: "id", onDelete: "SetNull" },
    }),
    condition: (config) =>
      config.technologies.betterAuth && config.features.admin.organizations,
  },
];

export const getAllRequiredTables = (
  config: InitialConfigurationType
): SchemaTableDefinition[] => {
  return [...BETTER_AUTH_CORE_TABLES, ...BETTER_AUTH_FEATURE_TABLES].filter(
    (table) => table.condition(config)
  );
};

export const getAllConditionalFields = (
  config: InitialConfigurationType
): SchemaFieldDefinition[] => {
  return BETTER_AUTH_CONDITIONAL_FIELDS.filter((field) =>
    field.condition(config)
  );
};
