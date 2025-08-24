//-| File path: app/(components)/ProfileDialog.actions.ts
"use server";

import { ProfileUpdateData } from "@/app/(components)/ProfileDialog.hooks";
import { Profile } from "@/app/(types)/auth.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

export async function updateProfileAction(
  profileData: ProfileUpdateData
): Promise<ActionResponse<Profile>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const { id, ...updateData } = profileData;

    const existingProfile = await db.profile.findUnique({
      where: { id },
      include: {
        user: true,
        contracts: true,
      },
    });

    if (!existingProfile) {
      return getActionResponse({ error: "Profile not found" });
    }

    if (existingProfile.userId !== session.user.id) {
      return getActionResponse({
        error: "Unauthorized to update this profile",
      });
    }

    const updatedProfile = await db.profile.update({
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
}

export async function resetProfileAction(): Promise<
  ActionResponse<Profile | null>
> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const existingProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
      include: {
        user: true,
        contracts: true,
      },
    });

    if (!existingProfile) {
      return getActionResponse({ error: "Profile not found" });
    }

    const resetProfile = await db.profile.update({
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
}

export async function softDeleteAccountAction(): Promise<
  ActionResponse<boolean>
> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    await db.$transaction([
      db.$executeRaw`SELECT set_config('app.current_user_id', ${session.user.id}, TRUE)`,
      db.$executeRaw`SELECT soft_delete_user(${session.user.id}::TEXT)`,
    ]);

    return getActionResponse({ data: true });
  } catch (error) {
    return getActionResponse({ error });
  }
}
