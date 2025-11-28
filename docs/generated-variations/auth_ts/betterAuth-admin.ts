import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin } from "better-auth/plugins";
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
  plugins: [
    admin({
      ac,
      roles: { user, admin, superAdmin }
    })
  ],
});

export type Session = typeof auth.$Infer.Session;