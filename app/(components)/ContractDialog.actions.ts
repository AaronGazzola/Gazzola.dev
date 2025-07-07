//-| File path: app/(components)/ContractDialog.actions.ts
"use server";

import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
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
        conversations: true,
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
  contractData: ContractCreateInput
): Promise<ActionResponse<Contract[]>> => {
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

    const { conversationIds, ...contractCreateData } = contractData;

    await prisma.contract.create({
      data: {
        ...contractCreateData,
        profileId: profile.id,
        conversations: {
          connect: conversationIds.map((id) => ({ id })),
        },
      },
      include: {
        profile: true,
        conversations: true,
      },
    });

    const { data: contracts } = await getContractsAction();
    return getActionResponse({ data: contracts });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const updateContractAction = async (
  updates: Partial<Contract>
): Promise<ActionResponse<Contract[]>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }

    const { data: isAdmin } = await isAdminAction();

    const existingContract = await prisma.contract.findUnique({
      where: { id: updates.id },
      include: { profile: true },
    });

    if (!existingContract) {
      return getActionResponse({ error: "Contract not found" });
    }

    if (!isAdmin && existingContract.profile.userId !== user.id) {
      return getActionResponse({
        error: "Not authorized to update this contract",
      });
    }

    const { profile, conversations, ...updateData } = updates;

    await prisma.contract.update({
      where: { id: updates.id },
      data: updateData,
      include: {
        profile: true,
        conversations: true,
      },
    });

    const { data: contracts } = await getContractsAction();
    return getActionResponse({ data: contracts });
  } catch (error) {
    return getActionResponse({ error });
  }
};