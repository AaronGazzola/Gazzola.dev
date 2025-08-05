//-| File path: app/(components)/Sidebar.actions.ts
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { headers } from "next/headers";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

export async function deleteUserContractsAction(
  userId: string
): Promise<ActionResponse<{ deletedCount: number }>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user || session.user.role !== "admin") {
      return getActionResponse({ error: "Admin access required" });
    }

    const appEnv = process.env.APP_ENV;
    if (appEnv !== "test") {
      return getActionResponse({
        error: "Contract deletion is only allowed in test environment",
      });
    }

    const userProfile = await db.profile.findFirst({
      where: { userId },
    });

    if (!userProfile) {
      return getActionResponse({ error: "User profile not found" });
    }

    const deletedContracts = await db.contract.deleteMany({
      where: { profileId: userProfile.id },
    });

    return getActionResponse({
      data: { deletedCount: deletedContracts.count },
    });
  } catch (error) {
    return getActionResponse({ error });
  }
}
