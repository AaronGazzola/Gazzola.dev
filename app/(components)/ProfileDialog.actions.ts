//-| File path: app/(components)/ProfileDialog.actions.ts
"use server";

import { Profile } from "@/app/(types)/auth.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

interface ProfileUpdateData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
}

export const updateProfileAction = async (
  profileData: ProfileUpdateData
): Promise<ActionResponse<Profile>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const { id, ...updateData } = profileData;

    const existingProfile = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: true,
        contracts: true,
      },
    });

    if (!existingProfile) {
      return getActionResponse({ error: "Profile not found" });
    }

    if (existingProfile.userId !== currentUser.id) {
      return getActionResponse({
        error: "Unauthorized to update this profile",
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        contracts: true,
      },
    });

    return getActionResponse({ data: updatedProfile });
  } catch (error) {
    return getActionResponse({ error });
  }
};
