//-| File path: app/test/rls/page.actions.ts
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { headers } from "next/headers";
import {
  RLSActionResponse,
  RLSAuthResponse,
  RLSSignInCredentials,
} from "./page.types";

export async function rlsSignInAction(
  credentials: RLSSignInCredentials
): Promise<ActionResponse<RLSAuthResponse>> {
  try {
    const { user } = await auth.api.signInEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
      },
      headers: await headers(),
    });

    if (!user) {
      return getActionResponse({
        data: { success: false },
        error: "Invalid credentials",
      });
    }

    return getActionResponse({
      data: {
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSignOutAction(): Promise<
  ActionResponse<RLSAuthResponse>
> {
  try {
    const { success } = await auth.api.signOut({
      headers: await headers(),
    });
    if (!success) {
      throw new Error("Failed to sign out");
    }

    return getActionResponse({
      data: { success: true },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const USER_EMAIL = process.env.USER_EMAIL;

export async function rlsSelectAdminUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!user) {
      throw new Error("Admin user not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin user found",
        data: user,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (!user) {
      throw new Error("User user not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User user found",
        data: user,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const updatedName = `Updated Admin ${Date.now()}`;
    console.log("init:", updatedName.slice(-3));
    const user = await db.user.update({
      where: { email: ADMIN_EMAIL },
      data: { name: updatedName },
    });

    console.log("user:", user.name?.slice(-3));
    const verifiedUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });
    console.log("verifiedUser:", verifiedUser?.name?.slice(-3));

    if (!verifiedUser || verifiedUser.name !== updatedName) {
      throw new Error("Admin user update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin user updated successfully",
        data: user,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const updatedName = `Updated User ${Date.now()}`;
    const user = await db.user.update({
      where: { email: USER_EMAIL },
      data: { name: updatedName },
    });

    const verifiedUser = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (!verifiedUser || verifiedUser.name !== updatedName) {
      throw new Error("User user update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User user updated successfully",
        data: user,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    await db.user.delete({
      where: { email: ADMIN_EMAIL },
    });

    const deletedUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (deletedUser) {
      throw new Error("Admin user still exists after deletion");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin user deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    await db.user.delete({
      where: { email: USER_EMAIL },
    });

    const deletedUser = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (deletedUser) {
      throw new Error("User user still exists after deletion");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User user deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertNewUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const newUserEmail = `test-user-${Date.now()}@example.com`;

    const existingUser = await db.user.findUnique({
      where: { email: newUserEmail },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await db.user.create({
      data: {
        email: newUserEmail,
        name: `New Test User ${Date.now()}`,
        emailVerified: true,
      },
    });

    const createdUser = await db.user.findUnique({
      where: { email: newUserEmail },
    });

    if (!createdUser) {
      throw new Error("Created user cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "New user created successfully",
        data: user,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (adminUser) {
      await db.profile.deleteMany({
        where: { userId: adminUser.id },
      });

      const remainingProfile = await db.profile.findFirst({
        where: { userId: adminUser.id },
      });

      if (remainingProfile) {
        throw new Error("Admin profile still exists after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin profile deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (user) {
      await db.profile.deleteMany({
        where: { userId: user.id },
      });

      const remainingProfile = await db.profile.findFirst({
        where: { userId: user.id },
      });

      if (remainingProfile) {
        throw new Error("User profile still exists after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User profile deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertAdminProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    const existingProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    if (existingProfile) {
      throw new Error("Admin profile already exists");
    }

    const profile = await db.profile.create({
      data: {
        userId: adminUser.id,
        firstName: "Admin",
        lastName: "Profile",
        company: "Test Company",
      },
    });

    const createdProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    if (!createdProfile) {
      throw new Error("Created admin profile cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin profile created successfully",
        data: profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertUserProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingProfile = await db.profile.findFirst({
      where: { userId: user.id },
    });

    if (existingProfile) {
      throw new Error("User profile already exists");
    }

    const profile = await db.profile.create({
      data: {
        userId: user.id,
        firstName: "User",
        lastName: "Profile",
        company: "Test Company",
      },
    });

    const createdProfile = await db.profile.findFirst({
      where: { userId: user.id },
    });

    if (!createdProfile) {
      throw new Error("Created user profile cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User profile created successfully",
        data: profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectAdminProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: true },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin profile not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin profile found",
        data: adminUser.profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new Error("User profile not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User profile found",
        data: user.profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    const updatedFirstName = `Updated Admin ${Date.now()}`;
    const profile = await db.profile.updateMany({
      where: { userId: adminUser.id },
      data: { firstName: updatedFirstName },
    });

    const verifiedProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    if (!verifiedProfile || verifiedProfile.firstName !== updatedFirstName) {
      throw new Error("Admin profile update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin profile updated successfully",
        data: profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserProfileAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedFirstName = `Updated User ${Date.now()}`;
    const profile = await db.profile.updateMany({
      where: { userId: user.id },
      data: { firstName: updatedFirstName },
    });

    const verifiedProfile = await db.profile.findFirst({
      where: { userId: user.id },
    });

    if (!verifiedProfile || verifiedProfile.firstName !== updatedFirstName) {
      throw new Error("User profile update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User profile updated successfully",
        data: profile,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}
