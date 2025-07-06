//-| File path: app/(components)/ContractDialog.actions.ts
"use server";

import { Contract } from "@/app/(types)/contract.types";
import { getAuthenticatedUser, isAdminAction } from "@/app/admin/admin.actions";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

export const getContractsAction = async (): Promise<
  ActionResponse<Contract[]>
> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }

    const { data: isAdmin } = await isAdminAction();

    let whereClause = {};

    if (!isAdmin) {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        return getActionResponse({ data: [] });
      }

      whereClause = { profileId: profile.id };
    }

    const data = await prisma.contract.findMany({
      where: whereClause,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const addContractAction = async (
  contractData: Omit<Contract, "id" | "createdAt" | "updatedAt" | "profile">
): Promise<ActionResponse<Contract>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return getActionResponse({ error: "Profile not found" });
    }

    const data = await prisma.contract.create({
      data: {
        ...contractData,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const updateContractAction = async (
  contractId: string,
  updates: Partial<Contract>
): Promise<ActionResponse<Contract>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }

    const { data: isAdmin } = await isAdminAction();

    const existingContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { profile: true },
    });

    if (!existingContract) {
      return getActionResponse({ error: "Contract not found" });
    }

    if (!isAdmin && existingContract.profile.userId !== user.id) {
      return getActionResponse({ error: "Not authorized to update this contract" });
    }

    const { profile, ...updateData } = updates;

    const data = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
      include: {
        profile: true,
      },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
