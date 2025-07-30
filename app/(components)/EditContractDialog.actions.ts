//-| File path: app/(components)/EditContractDialog.actions.ts
"use server";

import { getAuthenticatedUser } from "@/app/(actions)/app.actions";
import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
import { isAdminAction } from "@/app/admin/admin.actions";
import { ActionResponse, getActionResponse, withAuthenticatedAction } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

import Stripe from "stripe";

const initializeStripe = (): Stripe => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const errorMessage =
      "❌ STRIPE_SECRET_KEY environment variable is not defined";
    throw new Error(errorMessage);
  }

  if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    const errorMessage =
      "❌ STRIPE_SECRET_KEY must start with 'sk_' (secret key prefix)";
    throw new Error(errorMessage);
  }

  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });

    return stripeClient;
  } catch (error) {
    throw new Error(
      `Failed to initialize Stripe client: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

let stripe: Stripe;
try {
  stripe = initializeStripe();
} catch (error) {
  throw error;
}

export const getContractsAction = withAuthenticatedAction(async (
  user,
  userId?: string
): Promise<ActionResponse<Contract[]>> => {
  try {
    const { data: isAdmin } = await isAdminAction();

    let whereClause = {};

    if (userId && isAdmin) {
      const targetProfile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!targetProfile) {
        return getActionResponse({ data: [] });
      }

      whereClause = { profileId: targetProfile.id };
    } else if (!isAdmin) {
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
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
});

export const addContractAction = withAuthenticatedAction(async (
  user,
  contractData: ContractCreateInput,
  userId?: string
): Promise<ActionResponse<Contract[]>> => {
  try {
    const { data: isAdmin } = await isAdminAction();
    const targetUserId = userId && isAdmin ? userId : user.id;

    const profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
    });

    if (!profile) {
      return getActionResponse({ error: "Profile not found" });
    }

    const { conversationIds, tasks, ...contractCreateData } = contractData;

    const tasksToCreate =
      tasks?.map((taskData) => ({
        title: taskData.title,
        description: taskData.description,
        price: taskData.price,
        progressStatus: taskData.progressStatus,
      })) || [];

    const finalContractData = {
      ...contractCreateData,
      [isAdmin ? "userApproved" : "adminApproved"]: false,
    };

    await prisma.contract.create({
      data: {
        ...finalContractData,
        profileId: profile.id,
        conversations: {
          connect: conversationIds.map((id) => ({ id })),
        },
        tasks: {
          create: tasksToCreate,
        },
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
});

export const updateContractAction = withAuthenticatedAction(async (
  user,
  updates: Partial<Contract>,
  userId?: string
): Promise<ActionResponse<Contract[]>> => {
  try {
    const { data: isAdmin } = await isAdminAction();

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

    if (!isAdmin && existingContract.profile.userId !== user.id) {
      return getActionResponse({
        error: "Not authorized to update this contract",
      });
    }

    const {
      id,
      profile,
      conversations,
      tasks,
      createdAt,
      updatedAt,
      userApproved,
      adminApproved,
      ...updateData
    } = updates;

    type ContractUpdateFields = {
      title?: string;
      description?: string;
      startDate?: Date;
      targetDate?: Date;
      dueDate?: Date;
      price?: number;
      refundStatus?: string | null;
      progressStatus?: string | null;
      conversationIds?: string[];
    };

    type ExistingContractBase = {
      title: string;
      description: string;
      startDate: Date;
      targetDate: Date;
      dueDate: Date;
      price: number;
      refundStatus: string | null;
      progressStatus: string | null;
      conversationIds: string[];
    };

    const hasNonApprovalChanges = (() => {
      const fieldsToCheck: (keyof ContractUpdateFields)[] = [
        "title",
        "description",
        "startDate",
        "targetDate",
        "dueDate",
        "price",
        "refundStatus",
        "progressStatus",
        "conversationIds",
      ];

      for (const field of fieldsToCheck) {
        const updateValue = (updateData as ContractUpdateFields)[field];
        if (updateValue !== undefined) {
          if (
            field === "startDate" ||
            field === "targetDate" ||
            field === "dueDate"
          ) {
            const existingDate = (existingContract as ExistingContractBase)[
              field
            ]
              ? new Date((existingContract as ExistingContractBase)[field])
              : null;
            const updateDate = updateValue
              ? new Date(updateValue as Date)
              : null;
            if (existingDate?.getTime() !== updateDate?.getTime()) {
              return true;
            }
          } else if (field === "conversationIds") {
            const existingIds = JSON.stringify(
              (existingContract as ExistingContractBase)[field]?.sort() || []
            );
            const updateIds = JSON.stringify(
              (updateValue as string[])?.sort() || []
            );
            if (existingIds !== updateIds) {
              return true;
            }
          } else {
            if (
              (existingContract as ExistingContractBase)[field] !== updateValue
            ) {
              return true;
            }
          }
        }
      }

      if (tasks !== undefined) {
        const existingTasks = existingContract.tasks || [];
        const updatedTasks = tasks || [];

        if (existingTasks.length !== updatedTasks.length) {
          return true;
        }

        const sortedExisting = [...existingTasks].sort((a, b) =>
          a.id.localeCompare(b.id)
        );
        const sortedUpdated = [...updatedTasks].sort((a, b) =>
          (a.id || "").localeCompare(b.id || "")
        );

        for (let i = 0; i < sortedExisting.length; i++) {
          const existing = sortedExisting[i];
          const updated = sortedUpdated[i];

          if (
            existing.title !== updated.title ||
            existing.description !== updated.description ||
            existing.price !== updated.price ||
            existing.progressStatus !== updated.progressStatus
          ) {
            return true;
          }
        }
      }

      return false;
    })();

    if (tasks) {
      await prisma.task.deleteMany({
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

    const finalUpdateData = existingContract?.isPaid
      ? updateData
      : {
          ...updateData,
          ...(userApproved !== undefined && { userApproved }),
          ...(adminApproved !== undefined && { adminApproved }),
          ...(hasNonApprovalChanges && {
            [isAdmin ? "userApproved" : "adminApproved"]: false,
          }),
        };

    await prisma.contract.update({
      where: { id: updates.id },
      data: {
        ...finalUpdateData,
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
});

export const contractPaymentAction = withAuthenticatedAction(async (
  user,
  contractId: string,
  userId?: string
): Promise<ActionResponse<{ url: string | null }>> => {
  try {
    const { data: isAdmin } = await isAdminAction();

    const existingContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        profile: true,
        tasks: true,
      },
    });

    if (!existingContract) {
      return getActionResponse({ error: "Contract not found" });
    }

    if (!isAdmin && existingContract.profile.userId !== user.id) {
      return getActionResponse({
        error: "Not authorized to update this contract",
      });
    }

    if (existingContract.isPaid) {
      return getActionResponse({ error: "Contract is already paid" });
    }

    if (process.env.APP_ENV === "test") {
      await prisma.contract.update({
        where: { id: contractId },
        data: { isPaid: true },
      });

      return getActionResponse({ data: { url: null } });
    }

    if (!stripe) {
      return getActionResponse({ error: "Payment system is not available" });
    }

    if (!stripe.checkout) {
      return getActionResponse({ error: "Checkout system is not available" });
    }

    if (!stripe.checkout.sessions) {
      return getActionResponse({ error: "Session creation is not available" });
    }

    if (typeof stripe.checkout.sessions.create !== "function") {
      return getActionResponse({
        error: "Session creation method is not available",
      });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contracts`;

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: existingContract.title,
              description: existingContract.description,
            },
            unit_amount: Math.round(existingContract.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        contractId: contractId,
        userId: user.id,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionData);

    await prisma.payment.create({
      data: {
        contractId: contractId,
        stripeSessionId: session.id,
        amount: existingContract.price,
        currency: "usd",
        status: "pending",
      },
    });

    return getActionResponse({ data: { url: session.url } });
  } catch (error) {
    return getActionResponse({
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during payment setup",
    });
  }
});
