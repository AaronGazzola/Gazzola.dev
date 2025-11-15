import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InitialConfigurationType } from "@/app/(editor)/layout.types";
import type {
  DatabaseConfigurationState,
  PrismaColumn,
  PrismaTable,
  RLSPolicy,
  Plugin,
} from "./DatabaseConfiguration.types";

const generateId = () => Math.random().toString(36).substring(2, 11);

const getDefaultAuthTables = (): PrismaTable[] => [
  {
    id: "default-user",
    name: "user",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "user-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "user-email",
        name: "email",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
        attributes: ["@unique"],
      },
      {
        id: "user-name",
        name: "name",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "user-role",
        name: "role",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"user"',
        attributes: ['@default("user")'],
      },
      {
        id: "user-banned",
        name: "banned",
        type: "Boolean",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "false",
        attributes: ["@default(false)"],
      },
      {
        id: "user-banReason",
        name: "banReason",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "user-banExpires",
        name: "banExpires",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "user-emailVerified",
        name: "emailVerified",
        type: "Boolean",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "user-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "user-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
      },
      {
        id: "user-image",
        name: "image",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
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
        attributes: [],
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
        attributes: [],
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
        attributes: [],
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
        attributes: [],
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
        attributes: [],
      },
    ],
  },
  {
    id: "default-session",
    name: "session",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "session-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "session-userId",
        name: "userId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "session-expiresAt",
        name: "expiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "session-token",
        name: "token",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
        attributes: ["@unique"],
      },
      {
        id: "session-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "session-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
      },
      {
        id: "session-ipAddress",
        name: "ipAddress",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "session-userAgent",
        name: "userAgent",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "session-impersonatedBy",
        name: "impersonatedBy",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "session-activeOrganizationId",
        name: "activeOrganizationId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
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
        attributes: [
          "@relation(fields: [userId], references: [id], onDelete: Cascade)",
        ],
      },
    ],
  },
  {
    id: "default-account",
    name: "account",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["providerId", "accountId"]],
    questionId: "authentication",
    columns: [
      {
        id: "account-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "account-userId",
        name: "userId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-accountId",
        name: "accountId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-providerId",
        name: "providerId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-accessToken",
        name: "accessToken",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-refreshToken",
        name: "refreshToken",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-idToken",
        name: "idToken",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-accessTokenExpiresAt",
        name: "accessTokenExpiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-refreshTokenExpiresAt",
        name: "refreshTokenExpiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-scope",
        name: "scope",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-password",
        name: "password",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "account-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "account-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
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
        attributes: [
          "@relation(fields: [userId], references: [id], onDelete: Cascade)",
        ],
      },
    ],
  },
  {
    id: "default-verification",
    name: "verification",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["identifier", "value"]],
    questionId: "authentication",
    columns: [
      {
        id: "verification-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "verification-identifier",
        name: "identifier",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "verification-value",
        name: "value",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "verification-expiresAt",
        name: "expiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "verification-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "verification-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
      },
    ],
  },
  {
    id: "default-MagicLink",
    name: "MagicLink",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "magiclink-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "magiclink-userId",
        name: "userId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "magiclink-token",
        name: "token",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
        attributes: ["@unique"],
      },
      {
        id: "magiclink-email",
        name: "email",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "magiclink-expiresAt",
        name: "expiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "magiclink-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
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
        attributes: [
          "@relation(fields: [userId], references: [id], onDelete: Cascade)",
        ],
      },
    ],
  },
];

const getOrganizationTables = (): PrismaTable[] => [
  {
    id: "default-organization",
    name: "organization",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [],
    questionId: "authentication",
    columns: [
      {
        id: "organization-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "organization-name",
        name: "name",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "organization-slug",
        name: "slug",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: true,
        isId: false,
        isArray: false,
        attributes: ["@unique"],
      },
      {
        id: "organization-logo",
        name: "logo",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
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
        attributes: [],
      },
      {
        id: "organization-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "organization-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
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
        attributes: [],
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
        attributes: [],
      },
    ],
  },
  {
    id: "default-member",
    name: "member",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["userId", "organizationId"]],
    questionId: "authentication",
    columns: [
      {
        id: "member-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "member-userId",
        name: "userId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "member-organizationId",
        name: "organizationId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "member-role",
        name: "role",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"member"',
        attributes: ['@default("member")'],
      },
      {
        id: "member-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "member-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
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
        attributes: [
          "@relation(fields: [organizationId], references: [id], onDelete: Cascade)",
        ],
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
        attributes: [
          "@relation(fields: [userId], references: [id], onDelete: Cascade)",
        ],
      },
    ],
  },
  {
    id: "default-invitation",
    name: "invitation",
    schema: "auth",
    isDefault: true,
    isEditable: false,
    uniqueConstraints: [["email", "organizationId"]],
    questionId: "authentication",
    columns: [
      {
        id: "invitation-id",
        name: "id",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: true,
        isArray: false,
        defaultValue: "cuid()",
        attributes: ["@id", "@default(cuid())"],
      },
      {
        id: "invitation-organizationId",
        name: "organizationId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "invitation-email",
        name: "email",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "invitation-role",
        name: "role",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"member"',
        attributes: ['@default("member")'],
      },
      {
        id: "invitation-inviterId",
        name: "inviterId",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "invitation-token",
        name: "token",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: true,
        isUnique: true,
        isId: false,
        isArray: false,
        attributes: ["@unique"],
      },
      {
        id: "invitation-status",
        name: "status",
        type: "String",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: '"pending"',
        attributes: ['@default("pending")'],
      },
      {
        id: "invitation-expiresAt",
        name: "expiresAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: [],
      },
      {
        id: "invitation-createdAt",
        name: "createdAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        defaultValue: "now()",
        attributes: ["@default(now())"],
      },
      {
        id: "invitation-updatedAt",
        name: "updatedAt",
        type: "DateTime",
        isDefault: true,
        isEditable: false,
        isOptional: false,
        isUnique: false,
        isId: false,
        isArray: false,
        attributes: ["@updatedAt"],
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
        attributes: [
          "@relation(fields: [inviterId], references: [id], onDelete: Cascade)",
        ],
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
        attributes: [
          "@relation(fields: [organizationId], references: [id], onDelete: Cascade)",
        ],
      },
    ],
  },
];

export const useDatabaseStore = create<DatabaseConfigurationState>()(
  persist(
    (set, get) => ({
      activeTab: "schema",
      tables: [],
      rlsPolicies: [],
      plugins: [],

      setActiveTab: (tab) => set({ activeTab: tab }),

      addTable: (name, schema) => {
        const newTable: PrismaTable = {
          id: generateId(),
          name,
          schema,
          isDefault: false,
          isEditable: true,
          uniqueConstraints: [],
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
        return Array.from(schemas).sort();
      },

      addColumn: (tableId, column) => {
        const newColumn: PrismaColumn = {
          ...column,
          id: generateId(),
        };
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? { ...t, columns: [...t.columns, newColumn] }
              : t
          ),
        }));
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
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  columns: t.columns.map((c) => {
                    if (c.id !== columnId) return c;

                    const updated = { ...c, ...updates };
                    const attrs: string[] = [];

                    if (updated.isId) attrs.push("@id");
                    if (updated.isUnique) attrs.push("@unique");
                    if (updated.defaultValue) {
                      attrs.push(`@default(${updated.defaultValue})`);
                    }
                    if (c.attributes.includes("@updatedAt")) attrs.push("@updatedAt");
                    if (updated.relation) {
                      const rel = updated.relation;
                      attrs.push(
                        `@relation(fields: [${c.name}Id], references: [${rel.field}]${rel.onDelete ? `, onDelete: ${rel.onDelete}` : ""})`
                      );
                    }

                    updated.attributes = attrs;
                    return updated;
                  }),
                }
              : t
          ),
        }));
      },

      addOrUpdateRLSPolicy: (tableId, operation, role, accessType, relatedTable) => {
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
                relatedTable,
              };
            } else {
              policy.rolePolicies.push({ role, accessType, relatedTable });
            }

            return { rlsPolicies: updatedPolicies };
          } else {
            const newPolicy: RLSPolicy = {
              id: generateId(),
              tableId,
              operation,
              rolePolicies: [{ role, accessType, relatedTable }],
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

      generatePrismaSchema: () => {
        const { tables } = get();
        let schema = `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n  schemas  = ["auth", "public"]\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\n`;

        tables.forEach((table) => {
          schema += `model ${table.name} {\n`;
          table.columns.forEach((col) => {
            const typeStr = col.isArray ? `${col.type}[]` : col.type;
            const optionalStr = col.isOptional ? "?" : "";
            const padding = " ".repeat(
              Math.max(2, 20 - col.name.length - typeStr.length)
            );
            const attrs = col.attributes.join(" ");
            schema += `  ${col.name}${" ".repeat(Math.max(1, 20 - col.name.length))}${typeStr}${optionalStr}${padding}${attrs}\n`;
          });

          if (table.uniqueConstraints.length > 0) {
            schema += "\n";
            table.uniqueConstraints.forEach((constraint) => {
              schema += `  @@unique([${constraint.join(", ")}])\n`;
            });
          }

          schema += `\n  @@schema("${table.schema}")\n`;
          schema += `}\n\n`;
        });

        return schema;
      },


      generateRLSPolicies: () => {
        const { rlsPolicies, tables } = get();
        let sql = "";

        rlsPolicies.forEach((policy) => {
          const table = tables.find((t) => t.id === policy.tableId);
          if (!table) return;

          policy.rolePolicies.forEach((rolePolicy) => {
            const policyName = `${table.name}_${policy.operation.toLowerCase()}_${rolePolicy.role}`;

            sql += `CREATE POLICY "${policyName}"\n`;
            sql += `  ON ${table.schema}.${table.name}\n`;
            sql += `  FOR ${policy.operation}\n`;
            sql += `  TO ${rolePolicy.role}\n`;

            let usingClause = "";
            switch (rolePolicy.accessType) {
              case "global":
                usingClause = "true";
                break;
              case "own":
                usingClause = "auth.uid() = user_id";
                break;
              case "organization":
                usingClause = "organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())";
                break;
              case "related":
                if (rolePolicy.relatedTable) {
                  usingClause = `id IN (SELECT ${table.name}_id FROM ${rolePolicy.relatedTable} WHERE user_id = auth.uid())`;
                }
                break;
            }

            if (usingClause) {
              sql += `  USING (${usingClause})`;
            }

            sql += `;\n\n`;
          });
        });

        return sql;
      },

      initializeFromConfig: (config: InitialConfigurationType) => {
        const currentState = get();
        if (currentState.tables.length > 0) {
          return;
        }

        let tables: PrismaTable[] = [];
        const plugins: Plugin[] = [];

        const isBetterAuthEnabled =
          (config.questions.useSupabase === "no" || config.questions.useSupabase === "withBetterAuth") &&
          config.technologies.betterAuth;

        if (config.questions.useSupabase === "none") {
          tables = [];
        } else if (config.questions.useSupabase === "authOnly") {
          tables = [];
        } else if (isBetterAuthEnabled) {
          tables = [...getDefaultAuthTables()];

          if (config.features.admin.organizations) {
            tables = [...tables, ...getOrganizationTables()];
          }

          if (config.features.authentication.magicLink && tables.some((t) => t.name === "MagicLink")) {
            plugins.push({
              id: generateId(),
              name: "magicLink",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Email-based authentication with magic links"
            });
            plugins.push({
              id: generateId(),
              name: "magicLinkClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side magic link functionality"
            });
          }

          if (config.features.authentication.otp) {
            plugins.push({
              id: generateId(),
              name: "emailOTP",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "One-time password via email"
            });
            plugins.push({
              id: generateId(),
              name: "emailOTPClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side OTP functionality"
            });
          }

          if ((config.features.admin.admin || config.features.admin.superAdmin) && tables.some((t) => t.name === "user" && t.columns.some((c) => c.name === "role"))) {
            plugins.push({
              id: generateId(),
              name: "admin",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Admin role management and impersonation"
            });
            plugins.push({
              id: generateId(),
              name: "adminClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side admin functionality"
            });
          }

          if (config.features.admin.organizations && tables.some((t) => t.name === "organization")) {
            plugins.push({
              id: generateId(),
              name: "organization",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Organization and member management with invitations"
            });
            plugins.push({
              id: generateId(),
              name: "organizationClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side organization functionality"
            });
          }

          if (config.features.authentication.emailPassword) {
            plugins.push({
              id: generateId(),
              name: "emailAndPassword",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Email and password authentication"
            });
          }

          if (config.features.authentication.passwordOnly) {
            plugins.push({
              id: generateId(),
              name: "username",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Username-based authentication"
            });
          }

          if (config.features.authentication.googleAuth) {
            plugins.push({
              id: generateId(),
              name: "google",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Google OAuth social authentication"
            });
          }

          if (config.features.authentication.githubAuth) {
            plugins.push({
              id: generateId(),
              name: "github",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "GitHub OAuth social authentication"
            });
          }

          if (config.features.authentication.appleAuth) {
            plugins.push({
              id: generateId(),
              name: "apple",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Apple Sign In social authentication"
            });
          }

          if (config.features.payments.stripePayments || config.features.payments.stripeSubscriptions) {
            plugins.push({
              id: generateId(),
              name: "stripe",
              enabled: true,
              file: "auth",
              questionId: "payments",
              description: "Stripe payment and subscription management"
            });
            plugins.push({
              id: generateId(),
              name: "stripeClient",
              enabled: true,
              file: "auth-client",
              questionId: "payments",
              description: "Client-side Stripe functionality"
            });
          }

          if (config.features.realTimeNotifications.emailNotifications) {
            plugins.push({
              id: generateId(),
              name: "emailVerification",
              enabled: true,
              file: "auth",
              questionId: "realTimeNotifications",
              description: "Email verification and notifications"
            });
          }

          if (config.features.fileStorage && config.questions.useSupabase === "withBetterAuth") {
            plugins.push({
              id: generateId(),
              name: "supabaseStorage",
              enabled: true,
              file: "auth",
              questionId: "fileStorage",
              description: "Supabase file storage integration"
            });
          }

          if (config.features.authentication.twoFactor) {
            plugins.push({
              id: generateId(),
              name: "twoFactor",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Two-factor authentication with TOTP/OTP"
            });
            plugins.push({
              id: generateId(),
              name: "twoFactorClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side 2FA functionality"
            });
          }

          if (config.features.authentication.passkey) {
            plugins.push({
              id: generateId(),
              name: "passkey",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Passwordless authentication with passkeys"
            });
            plugins.push({
              id: generateId(),
              name: "passkeyClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side passkey support"
            });
          }

          if (config.features.authentication.anonymous) {
            plugins.push({
              id: generateId(),
              name: "anonymous",
              enabled: true,
              file: "auth",
              questionId: "authentication",
              description: "Anonymous user authentication"
            });
            plugins.push({
              id: generateId(),
              name: "anonymousClient",
              enabled: true,
              file: "auth-client",
              questionId: "authentication",
              description: "Client-side anonymous authentication"
            });
          }

          plugins.push({
            id: generateId(),
            name: "multiSession",
            enabled: true,
            file: "auth",
            questionId: "authentication",
            description: "Multiple active sessions across different accounts"
          });
          plugins.push({
            id: generateId(),
            name: "multiSessionClient",
            enabled: true,
            file: "auth-client",
            questionId: "authentication",
            description: "Client-side multi-session support"
          });
        }

        set({ tables, rlsPolicies: [], plugins });
      },

      reset: () => set({ tables: [], rlsPolicies: [], plugins: [], activeTab: "schema" }),
    }),
    {
      name: "database-configuration-storage",
    }
  )
);
