//-| File path: app/(components)/OnboardingDialog.actions.ts
"use server";

import { Profile as PrismaProfile } from "@/generated/prisma";

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

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  avatar: string;
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
      avatar: onboardingData.avatar || null,
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
