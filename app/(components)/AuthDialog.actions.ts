//-| File path: app/(components)/AuthDialog.actions.ts
"use server";

import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { User } from "@/generated/prisma";
import {
  ActionResponse,
  getActionResponse,
  withAuthenticatedAction,
} from "@/lib/action.utils";
import { auth } from "@/lib/auth";
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

    const prismaUser = await prisma.user.findUnique({
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
): Promise<ActionResponse<User | null>> {
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

    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return getActionResponse({
      data: prismaUser,
    });
  } catch (error) {
    return getActionResponse({ error });
  }
}

export const deleteAccountAction = async (
  email?: string
): Promise<ActionResponse<boolean>> => {
  try {
    if (email) {
      const userToDelete = await prisma.user.findFirst({
        where: { email },
      });

      if (!userToDelete) {
        return getActionResponse({ data: true });
      }

      await prisma.user.delete({
        where: { id: userToDelete.id },
      });
    } else {
      // For current user deletion, we need authentication
      return await deleteCurrentUserAction();
    }

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const deleteCurrentUserAction = withAuthenticatedAction(
  async (currentUser): Promise<ActionResponse<boolean>> => {
    try {
      if (!currentUser) {
        return getActionResponse({ error: "User not authenticated" });
      }

      await prisma.user.delete({
        where: { id: currentUser.id },
      });

      return getActionResponse({ data: true });
    } catch (error) {
      return getActionResponse({ data: true });
    }
  }
);

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
