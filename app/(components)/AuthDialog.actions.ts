//-| File path: app/(components)/AuthDialog.actions.ts
"use server";

import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { User } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth-utils";
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
    console.log("sign in", prismaUser);

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

    const { db } = await getAuthenticatedClient();

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

export const deleteAccountAction = async (
  email?: string
): Promise<ActionResponse<boolean>> => {
  try {
    if (email) {
      const { db } = await getAuthenticatedClient();

      const userToDelete = await db.user.findFirst({
        where: { email },
      });

      if (!userToDelete) {
        return getActionResponse({ data: true });
      }

      await db.user.delete({
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

export async function deleteCurrentUserAction(): Promise<
  ActionResponse<boolean>
> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        data: false,
        error: "Unauthorized: No valid session",
      });
    }

    await db.user.delete({
      where: { id: session.user.id },
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
