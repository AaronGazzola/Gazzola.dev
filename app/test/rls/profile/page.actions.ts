"use server";

import { RLSProfileTestResult } from "@/app/test/rls/profile/page.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

// User CRUD operations
export async function selectAdminUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    return getActionResponse({
      data: { success: !!adminUser, count: adminUser ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function selectRegularUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    return getActionResponse({
      data: { success: !!regularUser, count: regularUser ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function selectOwnUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    const ownUser = await db.user.findFirst({
      where: { id: session.user.id },
    });

    return getActionResponse({
      data: { success: !!ownUser, count: ownUser ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteAdminUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!adminUser) {
      return getActionResponse({
        data: { success: false, error: "Admin user not found" },
      });
    }

    await db.user.delete({
      where: { id: adminUser.id },
    });

    // Verify if the user was actually deleted
    const userStillExists = await db.user.findFirst({
      where: { id: adminUser.id },
    });

    const actuallyDeleted = userStillExists === null;

    return getActionResponse({
      data: {
        success: !actuallyDeleted,
        error: actuallyDeleted
          ? "User was deleted when it should have been blocked"
          : "RLS policy blocked user deletion (expected)",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: true,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteRegularUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    await db.user.delete({
      where: { id: regularUser.id },
    });

    // Verify if the user was actually deleted
    const userStillExists = await db.user.findFirst({
      where: { id: regularUser.id },
    });

    const actuallyDeleted = userStillExists === null;

    return getActionResponse({
      data: {
        success: !actuallyDeleted,
        error: actuallyDeleted
          ? "User was deleted when it should have been blocked"
          : "RLS policy blocked user deletion (expected)",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: true,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteOwnUserAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    await db.user.delete({
      where: { id: session.user.id },
    });

    // Verify if the user was actually deleted
    const userStillExists = await db.user.findFirst({
      where: { id: session.user.id },
    });

    const actuallyDeleted = userStillExists === null;

    return getActionResponse({
      data: {
        success: !actuallyDeleted,
        error: actuallyDeleted
          ? "User was deleted when it should have been blocked"
          : "RLS policy blocked user deletion (expected)",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: true,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

// Profile CRUD operations
export async function selectAdminProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!adminUser) {
      return getActionResponse({
        data: { success: false, error: "Admin user not found" },
      });
    }

    const adminProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    return getActionResponse({
      data: { success: !!adminProfile, count: adminProfile ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function selectRegularUserProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    const userProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    return getActionResponse({
      data: { success: !!userProfile, count: userProfile ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function selectOwnProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    const ownProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    return getActionResponse({
      data: { success: !!ownProfile, count: ownProfile ? 1 : 0 },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function createAdminProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!adminUser) {
      return getActionResponse({
        data: { success: false, error: "Admin user not found" },
      });
    }

    // Delete existing admin profile if it exists
    await db.profile.deleteMany({
      where: { userId: adminUser.id },
    });

    // Create admin profile
    await db.profile.create({
      data: {
        userId: adminUser.id,
        firstName: "Admin",
        lastName: "Profile Test",
        email: adminUser.email,
        company: "Admin Profile Company",
        phone: "555-123-4567",
      },
    });

    // Verify the profile was actually created
    const createdProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    const actuallyCreated = createdProfile !== null;

    return getActionResponse({
      data: {
        success: actuallyCreated,
        error: actuallyCreated
          ? undefined
          : "RLS policy blocked admin profile creation",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function createRegularUserProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    // Delete existing user profile if it exists
    await db.profile.deleteMany({
      where: { userId: regularUser.id },
    });

    // Create regular user profile
    await db.profile.create({
      data: {
        userId: regularUser.id,
        firstName: "Regular",
        lastName: "Profile Test",
        email: regularUser.email,
        company: "Regular Profile Company",
        phone: "555-987-6543",
      },
    });

    // Verify the profile was actually created
    const createdProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    const actuallyCreated = createdProfile !== null;

    return getActionResponse({
      data: {
        success: actuallyCreated,
        error: actuallyCreated
          ? undefined
          : "RLS policy blocked user profile creation",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function createOwnProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    // Delete existing own profile if it exists
    await db.profile.deleteMany({
      where: { userId: session.user.id },
    });

    // Create own profile
    await db.profile.create({
      data: {
        userId: session.user.id,
        firstName: "Own",
        lastName: "Profile Test",
        email: session.user.email,
        company: "Own Profile Company",
        phone: "555-111-2222",
      },
    });

    // Verify the profile was actually created
    const createdProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    const actuallyCreated = createdProfile !== null;

    return getActionResponse({
      data: {
        success: actuallyCreated,
        error: actuallyCreated
          ? undefined
          : "RLS policy blocked own profile creation",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function updateAdminProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!adminUser) {
      return getActionResponse({
        data: { success: false, error: "Admin user not found" },
      });
    }

    const adminProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    if (!adminProfile) {
      return getActionResponse({
        data: { success: false, error: "Admin profile not found" },
      });
    }

    const newCompany = "Updated Admin Profile Company";

    await db.profile.update({
      where: { id: adminProfile.id },
      data: { company: newCompany },
    });

    // Verify the profile was actually updated
    const updatedProfile = await db.profile.findFirst({
      where: { id: adminProfile.id },
    });

    const actuallyUpdated = updatedProfile?.company === newCompany;

    return getActionResponse({
      data: {
        success: actuallyUpdated,
        error: actuallyUpdated
          ? undefined
          : "RLS policy blocked admin profile update",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function updateRegularUserProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    const userProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "User profile not found" },
      });
    }

    const newCompany = "Updated User Profile Company";

    await db.profile.update({
      where: { id: userProfile.id },
      data: { company: newCompany },
    });

    // Verify the profile was actually updated
    const updatedProfile = await db.profile.findFirst({
      where: { id: userProfile.id },
    });

    const actuallyUpdated = updatedProfile?.company === newCompany;

    return getActionResponse({
      data: {
        success: actuallyUpdated,
        error: actuallyUpdated
          ? undefined
          : "RLS policy blocked user profile update",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function updateOwnProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    const ownProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!ownProfile) {
      return getActionResponse({
        data: { success: false, error: "Own profile not found" },
      });
    }

    const newCompany = "Updated Own Profile Company";

    await db.profile.update({
      where: { id: ownProfile.id },
      data: { company: newCompany },
    });

    // Verify the profile was actually updated
    const updatedProfile = await db.profile.findFirst({
      where: { id: ownProfile.id },
    });

    const actuallyUpdated = updatedProfile?.company === newCompany;

    return getActionResponse({
      data: {
        success: actuallyUpdated,
        error: actuallyUpdated
          ? undefined
          : "RLS policy blocked own profile update",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteAdminProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });

    if (!adminUser) {
      return getActionResponse({
        data: { success: false, error: "Admin user not found" },
      });
    }

    const adminProfile = await db.profile.findFirst({
      where: { userId: adminUser.id },
    });

    if (!adminProfile) {
      return getActionResponse({
        data: { success: false, error: "Admin profile not found" },
      });
    }

    await db.profile.delete({
      where: { id: adminProfile.id },
    });

    // Verify the profile was actually deleted
    const profileStillExists = await db.profile.findFirst({
      where: { id: adminProfile.id },
    });

    const actuallyDeleted = profileStillExists === null;

    return getActionResponse({
      data: {
        success: actuallyDeleted,
        error: actuallyDeleted
          ? undefined
          : "RLS policy blocked admin profile deletion",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteRegularUserProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    const userProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "User profile not found" },
      });
    }

    await db.profile.delete({
      where: { id: userProfile.id },
    });

    // Verify the profile was actually deleted
    const profileStillExists = await db.profile.findFirst({
      where: { id: userProfile.id },
    });

    const actuallyDeleted = profileStillExists === null;

    return getActionResponse({
      data: {
        success: actuallyDeleted,
        error: actuallyDeleted
          ? undefined
          : "RLS policy blocked user profile deletion",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteOwnProfileAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({
        error: "Unauthorized: No valid session",
      });
    }

    const ownProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!ownProfile) {
      return getActionResponse({
        data: { success: false, error: "Own profile not found" },
      });
    }

    await db.profile.delete({
      where: { id: ownProfile.id },
    });

    // Verify the profile was actually deleted
    const profileStillExists = await db.profile.findFirst({
      where: { id: ownProfile.id },
    });

    const actuallyDeleted = profileStillExists === null;

    return getActionResponse({
      data: {
        success: actuallyDeleted,
        error: actuallyDeleted
          ? undefined
          : "RLS policy blocked own profile deletion",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

// Utility action for deleting all data
export async function deleteAllDataAction(): Promise<
  ActionResponse<RLSProfileTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();

    // Find the test users to scope deletions
    const adminUser = await db.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL! },
    });
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!adminUser || !regularUser) {
      return getActionResponse({
        data: { success: false, error: "Test users not found" },
      });
    }

    const testUserIds = [adminUser.id, regularUser.id];

    // Delete profiles for test users only
    await db.profile.deleteMany({
      where: { userId: { in: testUserIds } },
    });

    return getActionResponse({ data: { success: true } });
  } catch (error) {
    return getActionResponse({
      data: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
