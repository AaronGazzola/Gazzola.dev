import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InitialConfigurationType } from "@/app/(editor)/layout.types";
import type {
  DatabaseConfigurationState,
  DatabaseColumn,
  DatabaseTable,
  DatabaseEnum,
  DatabaseEnumValue,
  RLSPolicy,
  Plugin,
  DatabaseTemplate,
  ColumnTemplate,
  UserRole,
} from "./DatabaseConfiguration.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";

const generateId = () => Math.random().toString(36).substring(2, 11);

const pluralize = (word: string): string => {
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2])) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  }
  return word + 's';
};

const getForeignKeyName = (tableName: string): string => {
  return `${tableName}Id`;
};

const getDefaultBetterAuthTables = (isBetterAuth: boolean = false): DatabaseTable[] => [
  {
    id: "default-user",
    name: "user",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "user-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "user-email",
        name: "email",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
      },
      {
        id: "user-name",
        name: "name",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-role",
        name: "role",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"user"',
      },
      {
        id: "user-banned",
        name: "banned",
        type: "BOOLEAN",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "false",
      },
      {
        id: "user-banReason",
        name: "banReason",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-banExpires",
        name: "banExpires",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-emailVerified",
        name: "emailVerified",
        type: "BOOLEAN",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "user-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-image",
        name: "image",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "user-MagicLink",
        name: "MagicLink",
        type: "MagicLink",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
      {
        id: "user-account",
        name: "account",
        type: "account",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
      {
        id: "user-invitation",
        name: "invitation",
        type: "invitation",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
      {
        id: "user-member",
        name: "member",
        type: "member",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
      {
        id: "user-session",
        name: "session",
        type: "session",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
    ],
  },
  {
    id: "default-session",
    name: "session",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "session-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "session-userId",
        name: "userId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-expiresAt",
        name: "expiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-token",
        name: "token",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
      },
      {
        id: "session-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "session-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-ipAddress",
        name: "ipAddress",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-userAgent",
        name: "userAgent",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-impersonatedBy",
        name: "impersonatedBy",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-activeOrganizationId",
        name: "activeOrganizationId",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "session-user",
        name: "user",
        type: "user",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "user",
          field: "id",
          onDelete: "Cascade",
        },
      },
    ],
  },
  {
    id: "default-account",
    name: "account",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["providerId", "accountId"]],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "account-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "account-userId",
        name: "userId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-accountId",
        name: "accountId",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-providerId",
        name: "providerId",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-accessToken",
        name: "accessToken",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-refreshToken",
        name: "refreshToken",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-idToken",
        name: "idToken",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-accessTokenExpiresAt",
        name: "accessTokenExpiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-refreshTokenExpiresAt",
        name: "refreshTokenExpiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-scope",
        name: "scope",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-password",
        name: "password",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "account-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "account-user",
        name: "user",
        type: "user",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "user",
          field: "id",
          onDelete: "Cascade",
        },
      },
    ],
  },
  {
    id: "default-verification",
    name: "verification",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["identifier", "value"]],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "verification-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "verification-identifier",
        name: "identifier",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "verification-value",
        name: "value",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "verification-expiresAt",
        name: "expiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "verification-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "verification-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
    ],
  },
  {
    id: "default-MagicLink",
    name: "MagicLink",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "magiclink-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "magiclink-userId",
        name: "userId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "magiclink-token",
        name: "token",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
      },
      {
        id: "magiclink-email",
        name: "email",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "magiclink-expiresAt",
        name: "expiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "magiclink-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "magiclink-user",
        name: "user",
        type: "user",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "user",
          field: "id",
          onDelete: "Cascade",
        },
      },
    ],
  },
];

const getOrganizationTables = (isBetterAuth: boolean = false): DatabaseTable[] => [
  {
    id: "default-organization",
    name: "organization",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "organization-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "organization-name",
        name: "name",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "organization-slug",
        name: "slug",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
      },
      {
        id: "organization-logo",
        name: "logo",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "organization-metadata",
        name: "metadata",
        type: "Json",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "organization-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "organization-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "organization-invitation",
        name: "invitation",
        type: "invitation",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
      {
        id: "organization-member",
        name: "member",
        type: "member",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: true,
      },
    ],
  },
  {
    id: "default-member",
    name: "member",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["userId", "organizationId"]],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "member-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "member-userId",
        name: "userId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "member-organizationId",
        name: "organizationId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "member-role",
        name: "role",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"member"',
      },
      {
        id: "member-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "member-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "member-organization",
        name: "organization",
        type: "organization",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "organization",
          field: "id",
          onDelete: "Cascade",
        },
      },
      {
        id: "member-user",
        name: "user",
        type: "user",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "user",
          field: "id",
          onDelete: "Cascade",
        },
      },
    ],
  },
  {
    id: "default-invitation",
    name: "invitation",
    schema: isBetterAuth ? "better_auth" : "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["email", "organizationId"]],
    checkConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "invitation-id",
        name: "id",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "gen_random_uuid()",
      },
      {
        id: "invitation-organizationId",
        name: "organizationId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-email",
        name: "email",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-role",
        name: "role",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"member"',
      },
      {
        id: "invitation-inviterId",
        name: "inviterId",
        type: "UUID",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-token",
        name: "token",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: true,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-status",
        name: "status",
        type: "TEXT",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"pending"',
      },
      {
        id: "invitation-expiresAt",
        name: "expiresAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-createdAt",
        name: "createdAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "NOW()",
      },
      {
        id: "invitation-updatedAt",
        name: "updatedAt",
        type: "TIMESTAMP WITH TIME ZONE",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
      },
      {
        id: "invitation-user",
        name: "user",
        type: "user",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "user",
          field: "id",
          onDelete: "Cascade",
        },
      },
      {
        id: "invitation-organization",
        name: "organization",
        type: "organization",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        relation: {
          table: "organization",
          field: "id",
          onDelete: "Cascade",
        },
      },
    ],
  },
];

export const useDatabaseStore = create<DatabaseConfigurationState>()(
  persist(
    (set, get) => ({
      activeTab: "schema",
      tables: [],
      enums: [],
      rlsPolicies: [],
      plugins: [],

      setActiveTab: (tab) => set({ activeTab: tab }),

      addTable: (name, schema) => {
        const newTable: DatabaseTable = {
          id: generateId(),
          name,
          schema,
          isDefault: false,
          isEditable: true,
          uniqueConstraints: [],
          checkConstraints: [],
          columns: [],
        };
        set((state) => ({ tables: [...state.tables, newTable] }));
        return newTable.id;
      },

      deleteTable: (tableId) => {
        set((state) => ({
          tables: state.tables.filter((t) => t.id !== tableId),
          rlsPolicies: state.rlsPolicies.filter((p) => p.tableId !== tableId),
        }));
      },

      deleteSchema: (schema) => {
        set((state) => ({
          tables: state.tables.filter((t) => t.schema !== schema),
          rlsPolicies: state.rlsPolicies.filter((p) => {
            const table = state.tables.find((t) => t.id === p.tableId);
            return table?.schema !== schema;
          }),
        }));
      },

      updateTableName: (tableId, name) => {
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId && t.isEditable ? { ...t, name } : t
          ),
        }));
      },

      updateTableSchema: (tableId, schema) => {
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId && t.isEditable ? { ...t, schema } : t
          ),
        }));
      },

      getAvailableSchemas: () => {
        const { tables } = get();
        const schemas = new Set<string>();
        tables.forEach((t) => schemas.add(t.schema));
        if (!schemas.has("public")) {
          schemas.add("public");
        }
        return Array.from(schemas).sort();
      },

      getAvailableSchemasWithConfig: (config: InitialConfigurationType) => {
        const { tables } = get();
        const schemas = new Set<string>();
        tables.forEach((t) => schemas.add(t.schema));

        if (!schemas.has("public")) {
          schemas.add("public");
        }

        if (config.technologies.supabase && !schemas.has("auth")) {
          schemas.add("auth");
        }

        return Array.from(schemas).sort();
      },

      addEnum: (name) => {
        const newEnum: DatabaseEnum = {
          id: generateId(),
          name,
          values: [],
          isDefault: false,
          isEditable: true,
        };
        set((state) => ({ enums: [...state.enums, newEnum] }));
        return newEnum.id;
      },

      deleteEnum: (enumId) => {
        set((state) => ({
          enums: state.enums.filter((e) => e.id !== enumId),
        }));
      },

      updateEnumName: (enumId, name) => {
        set((state) => ({
          enums: state.enums.map((e) =>
            e.id === enumId && e.isEditable ? { ...e, name } : e
          ),
        }));
      },

      addEnumValue: (enumId, value) => {
        set((state) => ({
          enums: state.enums.map((e) =>
            e.id === enumId
              ? {
                  ...e,
                  values: [
                    ...e.values,
                    { id: generateId(), value },
                  ],
                }
              : e
          ),
        }));
      },

      deleteEnumValue: (enumId, valueId) => {
        set((state) => ({
          enums: state.enums.map((e) =>
            e.id === enumId
              ? {
                  ...e,
                  values: e.values.filter((v) => v.id !== valueId),
                }
              : e
          ),
        }));
      },

      updateEnumValue: (enumId, valueId, value) => {
        set((state) => ({
          enums: state.enums.map((e) =>
            e.id === enumId
              ? {
                  ...e,
                  values: e.values.map((v) =>
                    v.id === valueId ? { ...v, value } : v
                  ),
                }
              : e
          ),
        }));
      },

      getAllEnums: () => {
        return get().enums;
      },

      addColumn: (tableId, column) => {
        const state = get();
        const currentTable = state.tables.find((t) => t.id === tableId);
        if (!currentTable) return;

        const newColumn: DatabaseColumn = {
          ...column,
          id: generateId(),
        };

        const updatedTables = state.tables.map((t) =>
          t.id === tableId
            ? { ...t, columns: [...t.columns, newColumn] }
            : t
        );

        if (column.relation) {
          const relationTableRef = column.relation.table;
          const relatedTable = state.tables.find(
            (t) => t.name === relationTableRef || `${t.schema}.${t.name}` === relationTableRef
          );
          if (relatedTable && column.relation.relationType) {
            const fkColumnId = generateId();
            const tableName = relationTableRef.includes('.')
              ? relationTableRef.split('.')[1]
              : relationTableRef;
            const fkColumnName = getForeignKeyName(tableName);

            const fkColumn: DatabaseColumn = {
              id: fkColumnId,
              name: fkColumnName,
              type: "UUID",
              isDefault: false,
              isEditable: true,
              isOptional: column.isOptional,
              isUnique: false,
              isId: false,
              isArray: false,
                  };

            const relationColumn: DatabaseColumn = {
              ...newColumn,
              relation: {
                ...column.relation,
                foreignKeyFieldId: fkColumnId,
              },
            };

            updatedTables.forEach((t) => {
              if (t.id === tableId) {
                const existingFk = t.columns.find((c) => c.name === fkColumnName);
                if (!existingFk) {
                  t.columns = t.columns.filter((c) => c.id !== newColumn.id);
                  t.columns.push(fkColumn, relationColumn);
                }
              }
            });

            if (column.relation.relationType === "many-to-one" && column.relation.inverseFieldName && relatedTable.isEditable) {
              const inverseColumn: DatabaseColumn = {
                id: generateId(),
                name: column.relation.inverseFieldName,
                type: currentTable.name,
                isDefault: false,
                isEditable: true,
                isOptional: false,
                isUnique: false,
                isId: false,
                isArray: true,
                      };

              updatedTables.forEach((t) => {
                if (t.id === relatedTable.id) {
                  const existingInverse = t.columns.find((c) => c.name === column.relation?.inverseFieldName);
                  if (!existingInverse) {
                    t.columns.push(inverseColumn);
                  }
                }
              });
            }
          }
        }

        set({ tables: updatedTables });
      },

      deleteColumn: (tableId, columnId) => {
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  columns: t.columns.filter(
                    (c) => c.id !== columnId && !c.isDefault
                  ),
                }
              : t
          ),
        }));
      },

      updateColumn: (tableId, columnId, updates) => {
        const state = get();
        const currentTable = state.tables.find((t) => t.id === tableId);
        if (!currentTable) return;

        const currentColumn = currentTable.columns.find((c) => c.id === columnId);
        if (!currentColumn) return;

        const wasRelation = currentColumn.relation !== undefined;
        const willBeRelation = updates.relation !== undefined;

        set((state) => ({
          tables: state.tables.map((t) => {
            if (t.id !== tableId) return t;

            let updatedColumns = t.columns.map((c) => {
              if (c.id !== columnId) return c;

              const updated = { ...c, ...updates };

              if (updated.relation) {
                const relationTableRef = updated.relation.table;
                const relatedTable = state.tables.find(
                  (rt) => rt.name === relationTableRef || `${rt.schema}.${rt.name}` === relationTableRef
                );

                if (relatedTable) {
                  const tableName = relationTableRef.includes('.')
                    ? relationTableRef.split('.')[1]
                    : relationTableRef;
                  const fkColumnName = getForeignKeyName(tableName);

                  if (!updated.relation.foreignKeyFieldId) {
                    const existingFk = t.columns.find((col) => col.name === fkColumnName);
                    if (existingFk) {
                      updated.relation = {
                        ...updated.relation,
                        foreignKeyFieldId: existingFk.id,
                      };
                    }
                  }
                }
              }

              return updated;
            });

            if (wasRelation && !willBeRelation && currentColumn.relation?.foreignKeyFieldId) {
              updatedColumns = updatedColumns.filter(
                (c) => c.id !== currentColumn.relation?.foreignKeyFieldId
              );
            }

            if (!wasRelation && willBeRelation && updates.relation) {
              const relationTableRef = updates.relation.table;
              const relatedTable = state.tables.find(
                (rt) => rt.name === relationTableRef || `${rt.schema}.${rt.name}` === relationTableRef
              );

              if (relatedTable) {
                const tableName = relationTableRef.includes('.')
                  ? relationTableRef.split('.')[1]
                  : relationTableRef;
                const fkColumnName = getForeignKeyName(tableName);

                const existingFk = updatedColumns.find((c) => c.name === fkColumnName);
                const fkColumnId = existingFk ? existingFk.id : generateId();

                if (!existingFk) {
                  const fkColumn: DatabaseColumn = {
                    id: fkColumnId,
                    name: fkColumnName,
                    type: "UUID",
                    isDefault: false,
                    isEditable: true,
                    isOptional: currentColumn.isOptional,
                    isUnique: false,
                    isId: false,
                    isArray: false,
                              };

                  updatedColumns.push(fkColumn);
                }

                updatedColumns = updatedColumns.map((c) => {
                  if (c.id === columnId && c.relation) {
                    return {
                      ...c,
                      relation: {
                        ...c.relation,
                        foreignKeyFieldId: fkColumnId,
                      },
                    };
                  }
                  return c;
                });
              }
            }

            return { ...t, columns: updatedColumns };
          }),
        }));
      },

      applyTemplate: (template: DatabaseTemplate, schema: string) => {
        const state = get();
        const tablesToDelete = state.tables.filter(
          (t) => t.schema === schema && !t.isDefault
        );
        tablesToDelete.forEach((t) => get().deleteTable(t.id));

        let firstTableId = "";
        template.tables.forEach((tableTemplate) => {
          const tableId = get().addTable(tableTemplate.name, schema);
          if (!firstTableId) firstTableId = tableId;

          tableTemplate.columns.forEach((colTemplate) => {
            get().addColumn(tableId, {
              name: colTemplate.name,
              type: colTemplate.type,
              isDefault: false,
              isEditable: true,
              isOptional: colTemplate.isOptional || false,
              isUnique: colTemplate.isUnique || false,
              isId: colTemplate.isId || false,
              isArray: colTemplate.isArray || false,
              defaultValue: colTemplate.defaultValue,
            });
          });
        });

        return firstTableId;
      },

      addOrUpdateRLSPolicy: (tableId, operation, role, accessType) => {
        set((state) => {
          const existingPolicyIndex = state.rlsPolicies.findIndex(
            (p) => p.tableId === tableId && p.operation === operation
          );

          if (existingPolicyIndex >= 0) {
            const updatedPolicies = [...state.rlsPolicies];
            const policy = updatedPolicies[existingPolicyIndex];
            const existingRoleIndex = policy.rolePolicies.findIndex(
              (rp) => rp.role === role
            );

            if (existingRoleIndex >= 0) {
              policy.rolePolicies[existingRoleIndex] = {
                role,
                accessType,
              };
            } else {
              policy.rolePolicies.push({ role, accessType });
            }

            return { rlsPolicies: updatedPolicies };
          } else {
            const newPolicy: RLSPolicy = {
              id: generateId(),
              tableId,
              operation,
              rolePolicies: [{ role, accessType }],
            };
            return { rlsPolicies: [...state.rlsPolicies, newPolicy] };
          }
        });
      },

      removeRLSRolePolicy: (tableId, operation, role) => {
        set((state) => {
          const updatedPolicies = state.rlsPolicies
            .map((policy) => {
              if (policy.tableId === tableId && policy.operation === operation) {
                return {
                  ...policy,
                  rolePolicies: policy.rolePolicies.filter((rp) => rp.role !== role),
                };
              }
              return policy;
            })
            .filter((policy) => policy.rolePolicies.length > 0);

          return { rlsPolicies: updatedPolicies };
        });
      },

      getRLSPoliciesForTable: (tableId) => {
        return get().rlsPolicies.filter((p) => p.tableId === tableId);
      },

      getRLSPolicyForOperation: (tableId, operation) => {
        return get().rlsPolicies.find(
          (p) => p.tableId === tableId && p.operation === operation
        );
      },

      addPlugin: (plugin) => {
        const newPlugin: Plugin = {
          ...plugin,
          id: generateId(),
        };
        set((state) => ({
          plugins: [...state.plugins, newPlugin],
        }));
      },

      deletePlugin: (pluginId) => {
        set((state) => ({
          plugins: state.plugins.filter((p) => p.id !== pluginId),
        }));
      },

      updatePlugin: (pluginId, updates) => {
        set((state) => ({
          plugins: state.plugins.map((p) =>
            p.id === pluginId ? { ...p, ...updates } : p
          ),
        }));
      },

      getPluginsByFile: (file) => {
        const { plugins } = get();
        return plugins.filter((p) => p.file === file && p.enabled);
      },

      generateSupabaseMigration: () => {
        const { tables, enums, rlsPolicies } = get();
        const lines: string[] = [];

        const userTables = tables.filter(
          (t) => t.schema !== "auth" && t.schema !== "better_auth"
        );

        const userSchemas = new Set(
          userTables
            .filter(t => t.schema !== 'public')
            .map(t => t.schema)
        );

        if (userSchemas.size > 0) {
          lines.push("-- Create schemas");
          userSchemas.forEach(schema => {
            lines.push(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
          });
          lines.push("");
        }

        if (userTables.length > 0) {
          lines.push("-- Create user_role enum type");
          lines.push("-- Defines application-level roles stored in profiles.role column");
          lines.push("-- These are NOT Postgres roles - they are checked in RLS policies using helper functions");
          lines.push("CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');");
          lines.push("");
        }

        if (enums.length > 0) {
          lines.push("-- Create enum types");
          enums.forEach((enumDef) => {
            const values = enumDef.values.map((v) => `'${v.value}'`).join(", ");
            lines.push(`CREATE TYPE ${enumDef.name} AS ENUM (${values});`);
          });
          lines.push("");
        }

        if (userTables.length > 0) {
          lines.push("-- Create tables");
          const enumNames = enums.map(e => e.name);

          userTables.forEach((table) => {
            const columns: string[] = [];
            const foreignKeys: string[] = [];

            table.columns.forEach((col) => {
              let pgType: string;

              if (col.relation) {
                pgType = "UUID";
              } else {
                pgType = col.type;
              }

              if (col.isArray) {
                pgType = `${pgType}[]`;
              }

              const nullable = col.isOptional ? "" : " NOT NULL";

              let defaultVal = "";
              if (col.defaultValue) {
                const isEnumType = enumNames.includes(col.type);
                const needsQuotes = isEnumType &&
                  !col.defaultValue.startsWith("'") &&
                  !col.defaultValue.startsWith('"') &&
                  !col.defaultValue.includes("(");

                defaultVal = needsQuotes
                  ? ` DEFAULT '${col.defaultValue}'`
                  : ` DEFAULT ${col.defaultValue}`;
              }

              const unique = col.isUnique ? " UNIQUE" : "";
              const primaryKey = col.isId ? " PRIMARY KEY" : "";

              columns.push(`  ${col.name} ${pgType}${nullable}${defaultVal}${unique}${primaryKey}`);

              if (col.relation) {
                const onDelete = col.relation.onDelete ? ` ON DELETE ${col.relation.onDelete === "Cascade" ? "CASCADE" : col.relation.onDelete.toUpperCase()}` : "";
                foreignKeys.push(
                  `  CONSTRAINT fk_${table.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${col.relation.table}(${col.relation.field})${onDelete}`
                );
              }
            });

            foreignKeys.forEach((fk) => {
              columns.push(fk);
            });

            table.uniqueConstraints.forEach((constraint) => {
              if (Array.isArray(constraint)) {
                columns.push(`  UNIQUE (${constraint.join(", ")})`);
              }
            });

            table.checkConstraints.forEach((constraint) => {
              columns.push(`  CONSTRAINT ${constraint.name} CHECK (${constraint.expression})`);
            });

            lines.push(`CREATE TABLE ${table.schema}.${table.name} (`);
            lines.push(columns.join(",\n"));
            lines.push(");");
            lines.push("");
          });
        }

        const hasIndexes = userTables.some((t) =>
          t.columns.some((c) => c.relation)
        );
        if (hasIndexes) {
          lines.push("-- Create indexes for foreign keys");
          userTables.forEach((table) => {
            table.columns.forEach((col) => {
              if (col.relation) {
                lines.push(
                  `CREATE INDEX idx_${table.name}_${col.name} ON ${table.schema}.${table.name}(${col.name});`
                );
              }
            });
          });
          lines.push("");
        }

        if (userTables.length > 0) {
          lines.push("-- Enable Row Level Security");
          userTables.forEach((table) => {
            lines.push(`ALTER TABLE ${table.schema}.${table.name} ENABLE ROW LEVEL SECURITY;`);
          });
          lines.push("");
        }

        if (userTables.length > 0) {
          lines.push("-- Create RLS helper function for admin role checks");
          lines.push("-- SECURITY DEFINER: Runs with creator's permissions to read profiles");
          lines.push("-- STABLE: Enables query-level caching for performance");
          lines.push("-- Wrap calls in (SELECT ...) for proper caching: USING ((SELECT is_admin()))");
          lines.push("");

          lines.push("CREATE OR REPLACE FUNCTION is_admin()");
          lines.push("RETURNS boolean");
          lines.push("LANGUAGE sql");
          lines.push("SECURITY DEFINER");
          lines.push("STABLE");
          lines.push("AS $$");
          lines.push("  SELECT (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('admin', 'super-admin');");
          lines.push("$$;");
          lines.push("");
        }

        if (rlsPolicies.length > 0) {
          lines.push("-- Create RLS Policies");
          lines.push("-- Using native PostgreSQL roles: anon, authenticated");
          lines.push("-- Admin policies use authenticated role with is_admin() function check");
          lines.push("");

          rlsPolicies.forEach((policy) => {
            const table = tables.find((t) => t.id === policy.tableId);
            if (!table || table.schema === "auth" || table.schema === "better_auth") return;

            policy.rolePolicies.forEach((rolePolicy) => {
              if (rolePolicy.accessType === "none") return;

              const policyName = `${table.name}_${policy.operation.toLowerCase()}_${rolePolicy.role}`;
              const postgresRole = rolePolicy.role === "admin" ? "authenticated" : rolePolicy.role;

              let usingClause = "";
              switch (rolePolicy.accessType) {
                case "public":
                case "global":
                  if (rolePolicy.role === "admin") {
                    usingClause = "(SELECT is_admin())";
                  } else {
                    usingClause = "true";
                  }
                  break;
                case "own":
                  let userIdColumn = table.columns.find(
                    (c) => c.name === "user_id" || c.name === "userId"
                  );

                  if (!userIdColumn) {
                    const profileIdColumn = table.columns.find(
                      (c) => c.name === "profile_id" && c.relation?.table === "profiles"
                    );

                    if (profileIdColumn) {
                      if (rolePolicy.role === "authenticated") {
                        usingClause = `profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                      } else if (rolePolicy.role === "admin") {
                        usingClause = `((SELECT is_admin()) OR profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                      } else {
                        usingClause = "false";
                      }
                      break;
                    }

                    const reporterIdColumn = table.columns.find(
                      (c) => c.name === "reporter_id" && c.relation?.table === "profiles"
                    );

                    if (reporterIdColumn) {
                      if (rolePolicy.role === "authenticated") {
                        usingClause = `reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                      } else if (rolePolicy.role === "admin") {
                        usingClause = `((SELECT is_admin()) OR reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                      } else {
                        usingClause = "false";
                      }
                      break;
                    }

                    conditionalLog(
                      { message: `RLS Warning: Table ${table.name} has "own" policy but no user_id or profile_id column. Using fallback: false`, table: table.name },
                      { label: LOG_LABELS.DATABASE }
                    );
                    usingClause = "false";
                  } else {
                    if (rolePolicy.role === "authenticated") {
                      usingClause = `auth.uid() = ${userIdColumn.name}`;
                    } else if (rolePolicy.role === "admin") {
                      usingClause = `((SELECT is_admin()) OR auth.uid() = ${userIdColumn.name})`;
                    } else {
                      usingClause = "false";
                    }
                  }
                  break;
              }

              if (!usingClause) {
                usingClause = "false";
              }

              lines.push(`CREATE POLICY "${policyName}"`);
              lines.push(`  ON ${table.schema}.${table.name}`);
              lines.push(`  FOR ${policy.operation}`);
              lines.push(`  TO ${postgresRole}`);

              if (policy.operation === "INSERT") {
                lines.push(`  WITH CHECK (${usingClause});`);
              } else if (policy.operation === "UPDATE") {
                lines.push(`  USING (${usingClause})`);
                lines.push(`  WITH CHECK (${usingClause});`);
              } else {
                lines.push(`  USING (${usingClause});`);
              }

              lines.push("");
            });
          });
        }

        return lines.join("\n").trim();
      },

      generateRLSPolicies: () => {
        const { rlsPolicies, tables } = get();
        let sql = "";

        rlsPolicies.forEach((policy) => {
          const table = tables.find((t) => t.id === policy.tableId);
          if (!table) return;

          policy.rolePolicies.forEach((rolePolicy) => {
            if (rolePolicy.accessType === "none") return;

            const policyName = `${table.name}_${policy.operation.toLowerCase()}_${rolePolicy.role}`;
            const postgresRole = rolePolicy.role === "admin" ? "authenticated" : rolePolicy.role;

            sql += `CREATE POLICY "${policyName}"\n`;
            sql += `  ON ${table.schema}.${table.name}\n`;
            sql += `  FOR ${policy.operation}\n`;
            sql += `  TO ${postgresRole}\n`;

            let usingClause = "";
            switch (rolePolicy.accessType) {
              case "public":
              case "global":
                if (rolePolicy.role === "admin") {
                  usingClause = "(SELECT is_admin())";
                } else {
                  usingClause = "true";
                }
                break;
              case "own":
                let userIdColumnName = table.columns.find(
                  (c) => c.name === "user_id" || c.name === "userId"
                )?.name;

                if (!userIdColumnName) {
                  const profileIdColumn = table.columns.find(
                    (c) => c.name === "profile_id" && c.relation?.table === "profiles"
                  );

                  if (profileIdColumn) {
                    if (rolePolicy.role === "authenticated") {
                      usingClause = `profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                    } else if (rolePolicy.role === "admin") {
                      usingClause = `((SELECT is_admin()) OR profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                    } else {
                      usingClause = "false";
                    }
                    break;
                  }

                  const reporterIdColumn = table.columns.find(
                    (c) => c.name === "reporter_id" && c.relation?.table === "profiles"
                  );

                  if (reporterIdColumn) {
                    if (rolePolicy.role === "authenticated") {
                      usingClause = `reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                    } else if (rolePolicy.role === "admin") {
                      usingClause = `((SELECT is_admin()) OR reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                    } else {
                      usingClause = "false";
                    }
                    break;
                  }

                  usingClause = "false";
                  break;
                }

                if (rolePolicy.role === "authenticated") {
                  usingClause = `auth.uid() = ${userIdColumnName}`;
                } else if (rolePolicy.role === "admin") {
                  usingClause = `((SELECT is_admin()) OR auth.uid() = ${userIdColumnName})`;
                } else {
                  usingClause = "false";
                }
                break;
            }

            if (usingClause) {
              if (policy.operation === "INSERT") {
                sql += `  WITH CHECK (${usingClause});\n\n`;
              } else if (policy.operation === "UPDATE") {
                sql += `  USING (${usingClause})\n`;
                sql += `  WITH CHECK (${usingClause});\n\n`;
              } else {
                sql += `  USING (${usingClause});\n\n`;
              }
            } else {
              sql += `;\n\n`;
            }
          });
        });

        return sql;
      },

      initializeFromConfig: (config: InitialConfigurationType) => {
        const currentState = get();
        const userCreatedTables = currentState.tables.filter((t) => !t.isDefault);

        const deduplicatedUserTables = userCreatedTables.reduce((acc, t) => {
          const key = `${t.schema}.${t.name}`;
          if (!acc.some((existing) => `${existing.schema}.${existing.name}` === key)) {
            acc.push(t);
          }
          return acc;
        }, [] as DatabaseTable[]);

        let authTables: DatabaseTable[] = [];
        if (config.technologies.supabase) {
          authTables = [{
            id: "default-users",
            name: "users",
            schema: "auth",
            isDefault: true,
            isEditable: false,
            uniqueConstraints: [],
            checkConstraints: [],
            questionId: "authentication",
            columns: [
              {
                id: "users-id",
                name: "id",
                type: "UUID",
                isDefault: true,
                isEditable: false,
                isOptional: false,
                isUnique: false,
                isId: true,
                isArray: false,
                defaultValue: "gen_random_uuid()",
                      },
              {
                id: "users-email",
                name: "email",
                type: "TEXT",
                isDefault: true,
                isEditable: false,
                isOptional: false,
                isUnique: true,
                isId: false,
                isArray: false,
                      },
            ],
          }];
        }

        set((state) => ({
          tables: [...authTables, ...deduplicatedUserTables],
          enums: state.enums,
          rlsPolicies: state.rlsPolicies,
          plugins: [],
        }));
      },

      setTablesFromAI: (newTables) => {
        set((state) => {
          const authTables = state.tables.filter((t) => t.schema === "auth");
          return { tables: [...authTables, ...newTables] };
        });
      },

      setTables: (tables) => set({ tables }),

      setEnums: (enums) => set({ enums }),

      setRLSPolicies: (rlsPolicies) => set({ rlsPolicies }),

      setEnumsFromAI: (newEnums) => {
        set({ enums: newEnums });
      },

      setRLSPoliciesFromAI: (policies, tables) => {
        const rlsPolicies: RLSPolicy[] = [];
        const requiredRoles: UserRole[] = ["anon", "authenticated", "admin"];
        const operations: Array<RLSPolicy["operation"]> = ["SELECT", "INSERT", "UPDATE", "DELETE"];

        tables.forEach((table) => {
          operations.forEach((operation) => {
            const aiPolicy = policies.find(
              (p) => p.tableName === table.name && p.operation === operation
            );

            const normalizedRolePolicies = requiredRoles.map((role) => {
              const existingRolePolicy = aiPolicy?.rolePolicies.find((rp) => rp.role === role);
              return existingRolePolicy || { role, accessType: "none" as const };
            });

            rlsPolicies.push({
              id: generateId(),
              tableId: table.id,
              operation,
              rolePolicies: normalizedRolePolicies,
            });
          });
        });

        set({ rlsPolicies });
      },

      reset: () => set({ tables: [], enums: [], rlsPolicies: [], plugins: [], activeTab: "schema" }),
    }),
    {
      name: "database-configuration-storage",
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (persistedState.tables) {
          const seenTables = new Set<string>();
          persistedState.tables = persistedState.tables
            .map((table: DatabaseTable) => {
              if (table.schema === "auth" && table.name === "user") {
                return {
                  ...table,
                  id: "default-users",
                  name: "users",
                };
              }
              return table;
            })
            .filter((table: DatabaseTable) => {
              const key = `${table.schema}.${table.name}`;
              if (seenTables.has(key)) {
                conditionalLog(
                  { message: `Removing duplicate table: ${key}`, table },
                  { label: LOG_LABELS.DATABASE }
                );
                return false;
              }
              seenTables.add(key);
              return true;
            })
            .map((table: DatabaseTable) => ({
              ...table,
              columns: table.columns.map((col: any) => {
                const { attributes, ...rest } = col;
                return rest;
              }),
            }));
        }

        if (persistedState.rlsPolicies && version < 4) {
          persistedState.rlsPolicies = persistedState.rlsPolicies.map((policy: any) => ({
            ...policy,
            rolePolicies: policy.rolePolicies
              .map((rp: any) => {
                let newRole: UserRole;
                if (rp.role === "user") {
                  newRole = "authenticated";
                } else if (rp.role === "admin" || rp.role === "super-admin") {
                  newRole = "admin";
                } else {
                  newRole = rp.role as UserRole;
                }

                if (rp.accessType === "organization" || rp.accessType === "related") {
                  conditionalLog(
                    { message: `Converting ${rp.accessType} access to "none" - manual reconfiguration needed`, role: rp.role },
                    { label: LOG_LABELS.DATABASE }
                  );
                  return {
                    role: newRole,
                    accessType: "none",
                  };
                }

                return {
                  role: newRole,
                  accessType: rp.accessType,
                };
              })
              .filter(Boolean),
          }));
        }

        return persistedState;
      },
    }
  )
);
