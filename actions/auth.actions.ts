//-| File path: actions/auth.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";

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

export const isAdminAction = async (): Promise<ActionResponse<boolean>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { data: false, error: null };
    }

    const isAdmin = user.role === 'admin';

    return { data: isAdmin, error: null };
  } catch (error) {
    return {
      data: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check admin status",
    };
  }
};

export const checkUserVerificationAction = async (): Promise<
  ActionResponse<boolean>
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { data: false, error: null };
    }

    const userSignedInWithSocial = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: {
          in: [
            "google",
            "github",
            "discord",
            "facebook",
            "twitter",
            "apple",
            "microsoft",
            "linkedin",
          ],
        },
      },
    });

    const isVerified = session.user.emailVerified || !!userSignedInWithSocial;

    return { data: isVerified, error: null };
  } catch (error) {
    return {
      data: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check verification status",
    };
  }
};

export const getCurrentUserAction = async (): Promise<
  ActionResponse<{
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  } | null>
> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return { data: null, error: null };
    }

    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to get current user",
    };
  }
};