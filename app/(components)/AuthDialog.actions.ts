//-| File path: app/(components)/AuthDialog.actions.ts
"use server";

import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { User } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
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
    return getActionResponse({ error: "Sign in failed" });
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
    return getActionResponse({ error: "Sign up failed" });
  }
}

export async function deleteAccountAction(
  email?: string
): Promise<ActionResponse<boolean>> {
  try {
    let userToDelete;

    if (email) {
      userToDelete = await prisma.user.findFirst({
        where: { email },
      });

      if (!userToDelete) {
        return getActionResponse({ data: true });
      }
    } else {
      const currentUser = await getAuthenticatedUser();
      if (!currentUser) {
        return getActionResponse({ error: "Unauthorized" });
      }
      userToDelete = currentUser;
    }

    await prisma.user.delete({
      where: { id: userToDelete.id },
    });

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ data: true });
  }
}

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
