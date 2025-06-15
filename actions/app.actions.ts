//-| Filepath: actions/app.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { ActionResponse, AuthCredentials, UserInfo } from "@/types/app.types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    redirect("/sign-in");
  }
  
  return session.user;
}

export const signInAction = async (
  credentials: AuthCredentials
): Promise<ActionResponse<UserInfo>> => {
  try {
    const { data, error } = await auth.api.signInEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.user, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
};

export const signUpAction = async (
  credentials: AuthCredentials
): Promise<ActionResponse<UserInfo>> => {
  try {
    const { data, error } = await auth.api.signUpEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
        name: credentials.email.split("@")[0],
      },
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.user, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
};

export const signOutAction = async (): Promise<ActionResponse<boolean>> => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
};

export const getSessionAction = async (): Promise<ActionResponse<UserInfo>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { data: null, error: null };
    }

    return { data: session.user, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to get session",
    };
  }
};
