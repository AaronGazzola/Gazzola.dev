//-| File path: app/(components)/ProfileDialog.actions.ts
"use server";

import { getAuthenticatedUser } from "@/app/(actions)/app.actions";
import { Profile } from "@/app/(types)/auth.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

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
