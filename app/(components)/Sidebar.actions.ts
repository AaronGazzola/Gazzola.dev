//-| File path: app/(components)/Sidebar.actions.ts
"use server";

import { headers } from "next/headers";
import { ActionResponse, getActionResponse, withAuthenticatedAction } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

export const deleteUserContractsAction = withAuthenticatedAction(async (
  currentUser,
  userId: string
): Promise<ActionResponse<{ deletedCount: number }>> => {
  try {
    if (!currentUser) {
      return getActionResponse({ error: "User not authenticated" });
    }

    if (currentUser.role !== "admin") {
      return getActionResponse({ error: "Admin access required" });
    }

    const appEnv = process.env.APP_ENV;
    if (appEnv !== "test") {
      return getActionResponse({ 
        error: "Contract deletion is only allowed in test environment" 
      });
    }

    const userProfile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!userProfile) {
      return getActionResponse({ error: "User profile not found" });
    }

    const deletedContracts = await prisma.contract.deleteMany({
      where: { profileId: userProfile.id },
    });

    return getActionResponse({ 
      data: { deletedCount: deletedContracts.count }
    });
  } catch (error) {
    return getActionResponse({ error });
  }
});