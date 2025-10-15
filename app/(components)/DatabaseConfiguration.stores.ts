import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InitialConfigurationType } from "@/app/(editor)/layout.types";
import type {
  DatabaseConfigurationState,
  PrismaColumn,
  PrismaTable,
  RLSPolicy,
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
      },

      deleteTable: (tableId) => {
        set((state) => ({
          tables: state.tables.filter((t) => t.id !== tableId && !t.isDefault),
          rlsPolicies: state.rlsPolicies.filter((p) => p.tableId !== tableId),
        }));
      },

      updateTableName: (tableId, name) => {
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId && t.isEditable ? { ...t, name } : t
          ),
        }));
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
                  columns: t.columns.map((c) =>
                    c.id === columnId && c.isEditable ? { ...c, ...updates } : c
                  ),
                }
              : t
          ),
        }));
      },

      addRLSPolicy: (policy) => {
        const newPolicy: RLSPolicy = {
          ...policy,
          id: generateId(),
        };
        set((state) => ({
          rlsPolicies: [...state.rlsPolicies, newPolicy],
        }));
      },

      deleteRLSPolicy: (policyId) => {
        set((state) => ({
          rlsPolicies: state.rlsPolicies.filter((p) => p.id !== policyId),
        }));
      },

      updateRLSPolicy: (policyId, updates) => {
        set((state) => ({
          rlsPolicies: state.rlsPolicies.map((p) =>
            p.id === policyId ? { ...p, ...updates } : p
          ),
        }));
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

      generateAuthConfig: (config?: InitialConfigurationType) => {
        if (!config) return "";

        const state = get();
        const hasMagicLink = config.features.authentication.magicLink && state.tables.some((t) => t.name === "MagicLink");
        const hasOrganization = (config.features.admin.orgAdmins || config.features.admin.orgMembers) && state.tables.some((t) => t.name === "organization");
        const hasAdmin = config.features.admin.superAdmins && state.tables.some((t) => t.name === "user" && t.columns.some((c) => c.name === "role"));
        const hasEmailPassword = config.features.authentication.emailPassword;
        const hasPasswordOnly = config.features.authentication.passwordOnly;
        const hasGoogleAuth = config.features.authentication.googleAuth;
        const hasGithubAuth = config.features.authentication.githubAuth;
        const hasAppleAuth = config.features.authentication.appleAuth;
        const needsResend = config.technologies.resend && (hasMagicLink || hasEmailPassword);

        const plugins: string[] = [];
        const imports: string[] = [];

        if (hasMagicLink) {
          imports.push("magicLink");
          plugins.push(`    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@example.com",
          to: email,
          subject: "Sign in to your account",
          html: \`<a href="\${url}">Sign In</a>\`,
        });
      },
      expiresIn: 300,
      disableSignUp: false,
    })`);
        }

        if (hasAdmin) {
          imports.push("admin");
          plugins.push("    admin()");
        }

        if (hasOrganization) {
          imports.push("organization");
          plugins.push(`    organization({
      sendInvitationEmail: async (data) => {
        const { email, organization, inviter, invitation } = data;
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@example.com",
          to: email,
          subject: \`You've been invited to join \${organization.name}\`,
          html: \`<a href="\${process.env.BETTER_AUTH_URL}/api/auth/accept-invitation?invitationId=\${invitation.id}">Accept Invitation</a>\`,
        });
      },
    })`);
        }

        const socialProvidersLines: string[] = [];
        if (hasGoogleAuth) {
          socialProvidersLines.push(`    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }`);
        }

        if (hasGithubAuth) {
          socialProvidersLines.push(`    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }`);
        }

        if (hasAppleAuth) {
          socialProvidersLines.push(`    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }`);
        }

        const importLine = imports.length > 0 ? `import { ${imports.join(", ")} } from "better-auth/plugins";\n` : "";
        const resendImport = needsResend ? `import { Resend } from "resend";\n` : "";
        const resendInit = needsResend ? `const resend = new Resend(process.env.RESEND_API_KEY);\n` : "";
        const pluginsArray = plugins.length > 0 ? `  plugins: [\n${plugins.join(",\n")},\n  ],\n` : "";
        const emailPasswordConfig = (hasEmailPassword || hasPasswordOnly) ? `  emailAndPassword: {
    enabled: true,
    requireEmailVerification: ${hasEmailPassword && needsResend ? "true" : "false"},
  },\n` : "";
        const socialProvidersConfig = socialProvidersLines.length > 0 ? `  socialProviders: {\n${socialProvidersLines.join(",\n")},\n  },\n` : "";

        return `import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
${importLine}${resendImport}
const prisma = new PrismaClient();
${resendInit}
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
${emailPasswordConfig}${socialProvidersConfig}${pluginsArray}});
`;
      },

      generateAuthConfigSections: (config?: InitialConfigurationType) => {
        if (!config) return [];

        const state = get();
        const sections: Array<{text: string; questionId?: string}> = [];
        const hasMagicLink = config.features.authentication.magicLink && state.tables.some((t) => t.name === "MagicLink");
        const hasOrganization = (config.features.admin.orgAdmins || config.features.admin.orgMembers) && state.tables.some((t) => t.name === "organization");
        const hasAdmin = config.features.admin.superAdmins && state.tables.some((t) => t.name === "user" && t.columns.some((c) => c.name === "role"));
        const hasEmailPassword = config.features.authentication.emailPassword;
        const hasPasswordOnly = config.features.authentication.passwordOnly;
        const hasGoogleAuth = config.features.authentication.googleAuth;
        const hasGithubAuth = config.features.authentication.githubAuth;
        const hasAppleAuth = config.features.authentication.appleAuth;
        const needsResend = config.technologies.resend && (hasMagicLink || hasEmailPassword);

        const imports: string[] = [];

        if (hasMagicLink) imports.push("magicLink");
        if (hasAdmin) imports.push("admin");
        if (hasOrganization) imports.push("organization");

        const importLine = imports.length > 0 ? `import { ${imports.join(", ")} } from "better-auth/plugins";` : "";
        const resendImport = needsResend ? `import { Resend } from "resend";` : "";
        const resendInit = needsResend ? `const resend = new Resend(process.env.RESEND_API_KEY);` : "";

        sections.push({
          text: `import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
${importLine}${resendImport ? '\n' + resendImport : ''}
const prisma = new PrismaClient();
${resendInit ? resendInit + '\n' : ''}`,
          questionId: "databaseChoice",
        });

        const authConfigStart = `export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),`;

        sections.push({ text: authConfigStart, questionId: "authentication" });

        if (hasEmailPassword || hasPasswordOnly) {
          sections.push({
            text: `  emailAndPassword: {
    enabled: true,
    requireEmailVerification: ${hasEmailPassword && needsResend ? "true" : "false"},
  },`,
            questionId: "authentication",
          });
        }

        if (hasGoogleAuth || hasGithubAuth || hasAppleAuth) {
          let socialProvidersText = "  socialProviders: {\n";
          if (hasGoogleAuth) {
            socialProvidersText += `    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },\n`;
          }
          if (hasGithubAuth) {
            socialProvidersText += `    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },\n`;
          }
          if (hasAppleAuth) {
            socialProvidersText += `    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },\n`;
          }
          socialProvidersText += "  },";
          sections.push({ text: socialProvidersText, questionId: "authentication" });
        }

        const pluginsSections: string[] = [];
        if (hasMagicLink) {
          pluginsSections.push(`    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@example.com",
          to: email,
          subject: "Sign in to your account",
          html: \`<a href="\${url}">Sign In</a>\`,
        });
      },
      expiresIn: 300,
      disableSignUp: false,
    })`);
        }
        if (hasAdmin) pluginsSections.push("    admin()");
        if (hasOrganization) {
          pluginsSections.push(`    organization({
      sendInvitationEmail: async (data) => {
        const { email, organization, inviter, invitation } = data;
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@example.com",
          to: email,
          subject: \`You've been invited to join \${organization.name}\`,
          html: \`<a href="\${process.env.BETTER_AUTH_URL}/api/auth/accept-invitation?invitationId=\${invitation.id}">Accept Invitation</a>\`,
        });
      },
    })`);
        }

        if (pluginsSections.length > 0) {
          sections.push({
            text: `  plugins: [\n${pluginsSections.join(",\n")},\n  ],`,
            questionId: "authentication",
          });
        }

        sections.push({ text: "});", questionId: "authentication" });

        return sections;
      },

      generateAuthClientConfigSections: (config?: InitialConfigurationType) => {
        if (!config) return [];

        const state = get();
        const sections: Array<{text: string; questionId?: string}> = [];
        const hasMagicLink = config.features.authentication.magicLink && state.tables.some((t) => t.name === "MagicLink");
        const hasOrganization = (config.features.admin.orgAdmins || config.features.admin.orgMembers) && state.tables.some((t) => t.name === "organization");
        const hasAdmin = config.features.admin.superAdmins && state.tables.some((t) => t.name === "user" && t.columns.some((c) => c.name === "role"));

        const plugins: string[] = [];
        const imports: string[] = [];
        const exports: string[] = ["useSession", "getSession", "signOut"];

        const hasAuth = config.features.authentication.emailPassword ||
                       config.features.authentication.passwordOnly ||
                       config.features.authentication.googleAuth ||
                       config.features.authentication.githubAuth ||
                       config.features.authentication.appleAuth;

        if (hasAuth) {
          exports.push("signIn", "signUp");
        }

        if (hasMagicLink) {
          imports.push("magicLinkClient");
          plugins.push("magicLinkClient()");
        }
        if (hasAdmin) {
          imports.push("adminClient");
          plugins.push("adminClient()");
          exports.push("admin");
        }
        if (hasOrganization) {
          imports.push("organizationClient");
          plugins.push("organizationClient()");
          exports.push("organization");
        }

        const uniqueExports = Array.from(new Set(exports));
        const importLine = imports.length > 0 ? `import {\n  ${imports.join(",\n  ")},\n} from "better-auth/client/plugins";\n` : "";
        const pluginsArray = plugins.length > 0 ? `[${plugins.join(", ")}]` : "[]";

        sections.push({
          text: `import { createAuthClient } from "better-auth/client";
${importLine}`,
          questionId: "databaseChoice",
        });

        sections.push({
          text: `export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: ${pluginsArray},
});`,
          questionId: "authentication",
        });

        sections.push({
          text: `
export const {
  ${uniqueExports.join(",\n  ")},
} = authClient;`,
          questionId: "authentication",
        });

        return sections;
      },

      generateAuthClientConfig: (config?: InitialConfigurationType) => {
        if (!config) return "";

        const state = get();
        const hasMagicLink = config.features.authentication.magicLink && state.tables.some((t) => t.name === "MagicLink");
        const hasOrganization = (config.features.admin.orgAdmins || config.features.admin.orgMembers) && state.tables.some((t) => t.name === "organization");
        const hasAdmin = config.features.admin.superAdmins && state.tables.some((t) => t.name === "user" && t.columns.some((c) => c.name === "role"));

        const plugins: string[] = [];
        const imports: string[] = [];
        const exports: string[] = ["useSession", "getSession", "signOut"];

        const hasAuth = config.features.authentication.emailPassword ||
                       config.features.authentication.passwordOnly ||
                       config.features.authentication.googleAuth ||
                       config.features.authentication.githubAuth ||
                       config.features.authentication.appleAuth;

        if (hasAuth) {
          exports.push("signIn", "signUp");
        }

        if (hasMagicLink) {
          imports.push("magicLinkClient");
          plugins.push("magicLinkClient()");
        }

        if (hasAdmin) {
          imports.push("adminClient");
          plugins.push("adminClient()");
          exports.push("admin");
        }

        if (hasOrganization) {
          imports.push("organizationClient");
          plugins.push("organizationClient()");
          exports.push("organization");
        }

        const uniqueExports = Array.from(new Set(exports));

        const importLine = imports.length > 0 ? `import {\n  ${imports.join(",\n  ")},\n} from "better-auth/client/plugins";\n\n` : "";
        const pluginsArray = plugins.length > 0 ? `[${plugins.join(", ")}]` : "[]";

        return `import { createAuthClient } from "better-auth/client";
${importLine}export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: ${pluginsArray},
});

export const {
  ${uniqueExports.join(",\n  ")},
} = authClient;
`;
      },

      generateRLSPolicies: () => {
        const { rlsPolicies, tables } = get();
        let sql = "";

        rlsPolicies.forEach((policy) => {
          const table = tables.find((t) => t.id === policy.tableId);
          if (!table) return;

          sql += `CREATE POLICY "${policy.name}"\n`;
          sql += `  ON ${table.schema}.${table.name}\n`;
          sql += `  FOR ${policy.operation}\n`;
          sql += `  USING (${policy.using})`;
          if (policy.withCheck) {
            sql += `\n  WITH CHECK (${policy.withCheck})`;
          }
          sql += `;\n\n`;
        });

        return sql;
      },

      initializeFromConfig: (config: InitialConfigurationType) => {
        let tables: PrismaTable[] = [];

        const isBetterAuthEnabled =
          (config.questions.useSupabase === "no" || config.questions.useSupabase === "withBetterAuth") &&
          config.technologies.betterAuth;

        if (config.questions.useSupabase === "none") {
          tables = [];
        } else if (config.questions.useSupabase === "authOnly") {
          tables = [];
        } else if (isBetterAuthEnabled) {
          tables = [...getDefaultAuthTables()];

          if (
            config.features.admin.orgAdmins ||
            config.features.admin.orgMembers
          ) {
            tables = [...tables, ...getOrganizationTables()];
          }
        }

        set({ tables, rlsPolicies: [] });
      },

      reset: () => set({ tables: [], rlsPolicies: [], activeTab: "schema" }),
    }),
    {
      name: "database-configuration-storage",
    }
  )
);
