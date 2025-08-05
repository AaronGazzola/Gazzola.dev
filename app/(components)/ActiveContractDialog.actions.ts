//-| File path: app/(components)/ActiveContractDialog.actions.ts
"use server";

import { getContractsAction } from "@/app/(components)/EditContractDialog.actions";
import { Contract } from "@/app/(types)/contract.types";
import { isAdminAction } from "@/app/admin/page.actions";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

export async function updateActiveContractAction(
  updates: Partial<Contract>,
  userId?: string
): Promise<ActionResponse<Contract[]>> {
  try {
    const { db } = await getAuthenticatedClient();

    const { data: isAdmin } = await isAdminAction();

    if (!isAdmin) {
      return getActionResponse({
        error: "Not authorized to update active contracts",
      });
    }

    const existingContract = await db.contract.findUnique({
      where: { id: updates.id },
      include: {
        profile: true,
        tasks: true,
      },
    });

    if (!existingContract) {
      return getActionResponse({ error: "Contract not found" });
    }

    const {
      id,
      profile,
      conversations,
      tasks,
      createdAt,
      updatedAt,
      ...updateData
    } = updates;

    if (tasks) {
      await db.task.deleteMany({
        where: { contractId: updates.id },
      });
    }

    const tasksToCreate =
      tasks?.map((taskData) => ({
        title: taskData.title,
        description: taskData.description,
        price: taskData.price,
        progressStatus: taskData.progressStatus,
      })) || [];

    await db.contract.update({
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
}
