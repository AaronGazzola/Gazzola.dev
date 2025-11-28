import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin, organization } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const prisma = new PrismaClient();

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({});

const admin = ac.newRole({
  ...adminAc.statements,
});

const superAdmin = ac.newRole({
  ...adminAc.statements,
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    admin({
      ac,
      roles: { user, admin, superAdmin }
    }),
    organization({
      ac,
      roles: { owner: superAdmin, admin, member: user }
    })
  ],
});

export type Session = typeof auth.$Infer.Session;