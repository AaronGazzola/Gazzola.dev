//-| File path: app/(components)/OnboardingDialog.actions.ts
"use server";

import { getAuthenticatedUser } from "@/app/(actions)/app.actions";
import { Profile as PrismaProfile } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

export const saveOnboardingDataAction = async (
  onboardingData: OnboardingData
): Promise<ActionResponse<PrismaProfile>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: currentUser.id },
      include: {
        user: true,
        contracts: true,
      },
    });

    const profileData = {
      firstName: onboardingData.firstName || "",
      lastName: onboardingData.lastName || "",
      email: currentUser.email,
      phone: onboardingData.phone || null,
      company: onboardingData.company || null,
    };

    let data;

    if (existingProfile) {
      data = await prisma.profile.update({
        where: { userId: currentUser.id },
        data: profileData,
      });
    } else {
      data = await prisma.profile.create({
        data: {
          ...profileData,
          userId: currentUser.id,
        },
      });
    }

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const verifyAccountAction = async (): Promise<
  ActionResponse<boolean>
> => {
  try {
    if (process.env.APP_ENV !== "test") {
      throw new Error("This action can only be used in test environment");
    }

    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { emailVerified: true },
    });

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
};
