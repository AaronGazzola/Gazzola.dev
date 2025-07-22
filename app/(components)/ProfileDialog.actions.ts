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
  phone: string;
  company: string;
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

export const resetProfileAction = async (): Promise<
  ActionResponse<Profile | null>
> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const existingProfile = await prisma.profile.findFirst({
      where: { userId: currentUser.id },
      include: {
        user: true,
        contracts: true,
      },
    });

    if (!existingProfile) {
      return getActionResponse({ error: "Profile not found" });
    }

    const resetProfile = await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        firstName: "",
        lastName: "",
        phone: "",
        company: "",
      },
      include: {
        user: true,
        contracts: true,
      },
    });

    return getActionResponse({ data: resetProfile });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const deleteAccountAction = async (): Promise<
  ActionResponse<boolean>
> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        email: null,
        name: null,
        image: null,
      },
    });

    await prisma.profile.updateMany({
      where: { userId: currentUser.id },
      data: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        company: null,
      },
    });

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
};
