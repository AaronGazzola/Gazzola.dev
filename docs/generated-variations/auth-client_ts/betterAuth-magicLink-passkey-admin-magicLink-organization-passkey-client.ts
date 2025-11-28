import { createAuthClient } from "better-auth/react";
import { magicLinkClient, passkeyClient, adminClient, organizationClient } from "better-auth/client/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

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


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    magicLinkClient(),
    passkeyClient(),
    adminClient({
      ac,
      roles: { user, admin, superAdmin }
    }),
    organizationClient({
      ac,
      roles: { owner: superAdmin, admin, member: user }
    })
  ],
});