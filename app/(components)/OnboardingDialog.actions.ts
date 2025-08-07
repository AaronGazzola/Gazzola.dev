//-| File path: app/(components)/OnboardingDialog.actions.ts
"use server";

import { Profile as PrismaProfile } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

export async function saveOnboardingDataAction(
  onboardingData: OnboardingData
): Promise<ActionResponse<PrismaProfile>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const currentUser = session.user;

    const existingProfile = await db.profile.findUnique({
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
      data = await db.profile.update({
        where: { userId: currentUser.id },
        data: profileData,
      });
    } else {
      data = await db.profile.create({
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
}

export async function verifyAccountAction(): Promise<ActionResponse<boolean>> {
  try {
    if (process.env.APP_ENV !== "test") {
      throw new Error("This action can only be used in test environment");
    }

    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    await db.$executeRaw`SELECT verify_user_email(${session.user.id})`;

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
}
