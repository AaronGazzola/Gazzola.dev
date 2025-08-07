//-| File path: app/(components)/AuthDialog.actions.ts
"use server";

import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { User } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";

export async function signInAction(
  credentials: SignInCredentials
): Promise<ActionResponse<User | null>> {
  try {
    const { user } = await auth.api.signInEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
      },
      headers: await headers(),
    });

    if (!user) {
      return getActionResponse({ error: "Invalid credentials" });
    }

    const { db } = await getAuthenticatedClient(user);

    const prismaUser = await db.user.findUnique({
      where: { id: user.id },
    });

    return getActionResponse({
      data: prismaUser,
    });
  } catch (error) {
    return getActionResponse({ error });
  }
}

export async function signUpAction(
  credentials: SignUpCredentials
): Promise<ActionResponse<null>> {
  try {
    const { user } = await auth.api.signUpEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || credentials.email.split("@")[0],
      },
      headers: await headers(),
    });

    if (!user) {
      return getActionResponse({ error: "Failed to create account" });
    }

    return getActionResponse();
  } catch (error) {
    return getActionResponse({ error });
  }
}

export const deleteAccountAction = async (
  email?: string
): Promise<ActionResponse<boolean>> => {
  try {
    const userToDelete = await prisma.user.findFirst({
      where: { email },
    });

    if (!userToDelete) {
      return getActionResponse({ data: true });
    }

    await prisma.user.delete({
      where: { id: userToDelete.id },
    });

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export async function signOutAction(): Promise<
  ActionResponse<{ success: boolean }>
> {
  try {
    const { success } = await auth.api.signOut({
      headers: await headers(),
    });
    if (!success) {
      throw new Error("Failed to sign out");
    }

    return getActionResponse({
      data: { success: true },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}
