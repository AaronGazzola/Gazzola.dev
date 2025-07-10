//-| File path: app/(components)/ActiveContractDialog.actions.ts
"use server";

import { Contract } from "@/app/(types)/contract.types";
import { getAuthenticatedUser, isAdminAction } from "@/app/admin/admin.actions";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";
import { getContractsAction } from "@/app/(components)/ContractDialog.actions";

export const updateActiveContractAction = async (
  updates: Partial<Contract>,
  userId?: string
): Promise<ActionResponse<Contract[]>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return getActionResponse({ error: "User not authenticated" });
    }

    const { data: isAdmin } = await isAdminAction();

    if (!isAdmin) {
      return getActionResponse({
        error: "Not authorized to update active contracts",
      });
    }

    const existingContract = await prisma.contract.findUnique({
      where: { id: updates.id },
      include: { 
        profile: true,
        tasks: true,
      },
    });

    if (!existingContract) {
      return getActionResponse({ error: "Contract not found" });
    }

    const { id, profile, conversations, tasks, createdAt, updatedAt, ...updateData } = updates;

    if (tasks) {
      await prisma.task.deleteMany({
        where: { contractId: updates.id },
      });
    }

    const tasksToCreate = tasks?.map((taskData) => ({
      title: taskData.title,
      description: taskData.description,
      price: taskData.price,
      progressStatus: taskData.progressStatus,
    })) || [];

    await prisma.contract.update({
      where: { id: updates.id },
      data: {
        ...updateData,
        ...(tasks && {
          tasks: {
            create: tasksToCreate,
          },
        }),
      },
      include: {
        profile: true,
        conversations: true,
        tasks: true,
      },
    });

    const { data: contracts } = await getContractsAction(userId);
    return getActionResponse({ data: contracts });
  } catch (error) {
    return getActionResponse({ error });
  }
};
