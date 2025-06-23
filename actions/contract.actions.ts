//-| File path: actions/contract.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { Contract } from "@/types/contract.types";
import { headers } from "next/headers";
import { isAdminAction } from "./auth.actions";

interface ActionResponse<T> {
  data: T | null;
  error: string | null;
}

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

export const getContractsAction = async (): Promise<
  ActionResponse<Contract[]>
> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: isAdmin } = await isAdminAction();

    let whereClause = {};

    if (!isAdmin) {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        return { data: [], error: null };
      }

      whereClause = { profileId: profile.id };
    }

    const contracts = await prisma.contract.findMany({
      where: whereClause,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: contracts, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get contracts",
    };
  }
};

export const addContractAction = async (
  contractData: Omit<Contract, "id" | "createdAt" | "updatedAt" | "profile">
): Promise<ActionResponse<Contract>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return { data: null, error: "Profile not found" };
    }

    const contract = await prisma.contract.create({
      data: {
        ...contractData,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    });

    return { data: contract, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create contract",
    };
  }
};

export const updateContractAction = async (
  contractId: string,
  updates: Partial<Contract>
): Promise<ActionResponse<Contract>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: isAdmin } = await isAdminAction();

    const existingContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { profile: true },
    });

    if (!existingContract) {
      return { data: null, error: "Contract not found" };
    }

    if (!isAdmin && existingContract.profile.userId !== user.id) {
      return { data: null, error: "Not authorized to update this contract" };
    }

    const { profile, ...updateData } = updates;

    const contract = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
      include: {
        profile: true,
      },
    });

    return { data: contract, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update contract",
    };
  }
};
