//-| File path: app/(components)/AuthDialog.actions.ts
"use server";

import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { User } from "@/generated/prisma";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma-client";

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