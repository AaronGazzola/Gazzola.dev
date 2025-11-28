import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { twoFactor } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  appName: process.env.APP_NAME || "My App",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
  },
  plugins: [
    twoFactor()
  ],
});

export type Session = typeof auth.$Infer.Session;