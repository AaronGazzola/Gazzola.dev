//-| Filepath: lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000"],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails =
            process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) ||
            [];
          if (adminEmails.includes(user.email)) {
            return {
              data: {
                ...user,
                role: "admin",
              },
            };
          }
          return { data: user };
        },
        after: async (user) => {
          const adminEmails =
            process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) ||
            [];
          if (adminEmails.includes(user.email)) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "admin" },
            });
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
