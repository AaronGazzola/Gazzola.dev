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
const UNVERIFIED_USER_EMAIL = process.env.UNVERIFIED_USER_EMAIL;

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

export async function rlsSelectOtherUserAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: UNVERIFIED_USER_EMAIL },
    });

    if (!user) {
      throw new Error("Other user not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Other user found",
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

// Contract Actions
export async function rlsSelectAdminContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: true },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const contract = await db.contract.findFirst({
      where: { profileId: adminUser.profile.id },
    });

    if (!contract) {
      throw new Error("Admin contract not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin contract found",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const contract = await db.contract.findFirst({
      where: { profileId: user.profile.id },
    });

    if (!contract) {
      throw new Error("User contract not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User contract found",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertAdminContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: true },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const existingContract = await db.contract.findFirst({
      where: { profileId: adminUser.profile.id },
    });

    if (existingContract) {
      throw new Error("Admin contract already exists");
    }

    const contract = await db.contract.create({
      data: {
        title: "Admin Test Contract",
        description: "Test contract for admin user",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        price: 1000.0,
        profileId: adminUser.profile.id,
        conversationIds: [],
        userApproved: false,
        adminApproved: false,
        isPaid: false,
      },
    });

    const createdContract = await db.contract.findUnique({
      where: { id: contract.id },
    });

    if (!createdContract) {
      throw new Error("Created admin contract cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin contract created successfully",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertUserContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const existingContract = await db.contract.findFirst({
      where: { profileId: user.profile.id },
    });

    if (existingContract) {
      throw new Error("User contract already exists");
    }

    const contract = await db.contract.create({
      data: {
        title: "User Test Contract",
        description: "Test contract for regular user",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        price: 500.0,
        profileId: user.profile.id,
        conversationIds: [],
        userApproved: false,
        adminApproved: false,
        isPaid: false,
      },
    });

    const createdContract = await db.contract.findUnique({
      where: { id: contract.id },
    });

    if (!createdContract) {
      throw new Error("Created user contract cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User contract created successfully",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: true },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const updatedTitle = `Updated Admin Contract ${Date.now()}`;
    const contract = await db.contract.updateMany({
      where: { profileId: adminUser.profile.id },
      data: { title: updatedTitle, isPaid: true },
    });

    const verifiedContract = await db.contract.findFirst({
      where: { profileId: adminUser.profile.id },
    });

    if (!verifiedContract || verifiedContract.title !== updatedTitle) {
      throw new Error("Admin contract update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin contract updated successfully",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const updatedTitle = `Updated User Contract ${Date.now()}`;
    const contract = await db.contract.updateMany({
      where: { profileId: user.profile.id },
      data: { title: updatedTitle, isPaid: true },
    });

    const verifiedContract = await db.contract.findFirst({
      where: { profileId: user.profile.id },
    });

    if (!verifiedContract || verifiedContract.title !== updatedTitle) {
      throw new Error("User contract update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User contract updated successfully",
        data: contract,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: true },
    });

    if (adminUser?.profile) {
      await db.contract.deleteMany({
        where: { profileId: adminUser.profile.id },
      });

      const remainingContract = await db.contract.findFirst({
        where: { profileId: adminUser.profile.id },
      });

      if (remainingContract) {
        throw new Error("Admin contract still exists after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin contract deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (user?.profile) {
      await db.contract.deleteMany({
        where: { profileId: user.profile.id },
      });

      const remainingContract = await db.contract.findFirst({
        where: { profileId: user.profile.id },
      });

      if (remainingContract) {
        throw new Error("User contract still exists after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User contract deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAllUserContractsAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: true },
    });

    if (user?.profile) {
      await db.contract.deleteMany({
        where: { profileId: user.profile.id },
      });

      const remainingContracts = await db.contract.findMany({
        where: { profileId: user.profile.id },
      });

      if (remainingContracts.length > 0) {
        throw new Error(
          `${remainingContracts.length} user contracts still exist after deletion`
        );
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "All user contracts deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

// Task Actions
export async function rlsSelectAdminTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const contract = adminUser.profile.contracts[0];
    if (!contract) {
      throw new Error("Admin contract not found for task selection");
    }

    const task = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (!task) {
      throw new Error("Admin task not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin task found",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const contract = user.profile.contracts[0];
    if (!contract) {
      throw new Error("User contract not found for task selection");
    }

    const task = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (!task) {
      throw new Error("User task not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User task found",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertAdminTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const contract = adminUser.profile.contracts[0];
    if (!contract) {
      throw new Error("Admin contract not found for task creation");
    }

    const existingTask = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (existingTask) {
      throw new Error("Admin task already exists");
    }

    const task = await db.task.create({
      data: {
        title: "Admin Test Task",
        description: "Test task for admin user",
        price: 250.0,
        contractId: contract.id,
        progressStatus: "not_started",
      },
    });

    const createdTask = await db.task.findUnique({
      where: { id: task.id },
    });

    if (!createdTask) {
      throw new Error("Created admin task cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin task created successfully",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertUserTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const contract = user.profile.contracts[0];
    if (!contract) {
      throw new Error("User contract not found for task creation");
    }

    const existingTask = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (existingTask) {
      throw new Error("User task already exists");
    }

    const task = await db.task.create({
      data: {
        title: "User Test Task",
        description: "Test task for regular user",
        price: 150.0,
        contractId: contract.id,
        progressStatus: "not_started",
      },
    });

    const createdTask = await db.task.findUnique({
      where: { id: task.id },
    });

    if (!createdTask) {
      throw new Error("Created user task cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User task created successfully",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!adminUser?.profile) {
      throw new Error("Admin user or profile not found");
    }

    const contract = adminUser.profile.contracts[0];
    if (!contract) {
      throw new Error("Admin contract not found for task update");
    }

    const updatedTitle = `Updated Admin Task ${Date.now()}`;
    const task = await db.task.updateMany({
      where: { contractId: contract.id },
      data: { title: updatedTitle },
    });

    const verifiedTask = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (!verifiedTask || verifiedTask.title !== updatedTitle) {
      throw new Error("Admin task update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin task updated successfully",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const contract = user.profile.contracts[0];
    if (!contract) {
      throw new Error("User contract not found for task update");
    }

    const updatedTitle = `Updated User Task ${Date.now()}`;
    const task = await db.task.updateMany({
      where: { contractId: contract.id },
      data: { title: updatedTitle },
    });

    const verifiedTask = await db.task.findFirst({
      where: { contractId: contract.id },
    });

    if (!verifiedTask || verifiedTask.title !== updatedTitle) {
      throw new Error("User task update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User task updated successfully",
        data: task,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (adminUser?.profile?.contracts) {
      for (const contract of adminUser.profile.contracts) {
        await db.task.deleteMany({
          where: { contractId: contract.id },
        });
      }

      const remainingTasks = await db.task.findMany({
        where: {
          contractId: { in: adminUser.profile.contracts.map((c) => c.id) },
        },
      });

      if (remainingTasks.length > 0) {
        throw new Error("Admin tasks still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin tasks deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserTaskAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (user?.profile?.contracts) {
      for (const contract of user.profile.contracts) {
        await db.task.deleteMany({
          where: { contractId: contract.id },
        });
      }

      const remainingTasks = await db.task.findMany({
        where: {
          contractId: { in: user.profile.contracts.map((c) => c.id) },
        },
      });

      if (remainingTasks.length > 0) {
        throw new Error("User tasks still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User tasks deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAllUserTasksAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (user?.profile?.contracts) {
      for (const contract of user.profile.contracts) {
        await db.task.deleteMany({
          where: { contractId: contract.id },
        });
      }

      const remainingTasks = await db.task.findMany({
        where: {
          contractId: { in: user.profile.contracts.map((c) => c.id) },
        },
      });

      if (remainingTasks.length > 0) {
        throw new Error(
          `${remainingTasks.length} user tasks still exist after deletion`
        );
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "All user tasks deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

// Conversation Actions
export async function rlsSelectAdminConversationAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: adminUser.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("Admin conversation not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin conversation found",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserConversationAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: user.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("User conversation not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User conversation found",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertAdminConversationAction(): Promise<
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

    const conversation = await db.conversation.create({
      data: {
        title: "Admin Test Conversation",
        participants: [adminUser.id],
        lastMessageAt: new Date(),
      },
    });

    const createdConversation = await db.conversation.findUnique({
      where: { id: conversation.id },
    });

    if (!createdConversation) {
      throw new Error(
        "Created admin conversation cannot be found after creation"
      );
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin conversation created successfully",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertUserConversationAction(): Promise<
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

    const conversation = await db.conversation.create({
      data: {
        title: "User Test Conversation",
        participants: [user.id],
        lastMessageAt: new Date(),
      },
    });

    const createdConversation = await db.conversation.findUnique({
      where: { id: conversation.id },
    });

    if (!createdConversation) {
      throw new Error(
        "Created user conversation cannot be found after creation"
      );
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User conversation created successfully",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminConversationAction(): Promise<
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

    const updatedTitle = `Updated Admin Conversation ${Date.now()}`;
    const conversation = await db.conversation.updateMany({
      where: {
        participants: {
          has: adminUser.id,
        },
      },
      data: { title: updatedTitle },
    });

    const verifiedConversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: adminUser.id,
        },
        title: updatedTitle,
      },
    });

    if (!verifiedConversation) {
      throw new Error(
        "Admin conversation update was not reflected in database"
      );
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin conversation updated successfully",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserConversationAction(): Promise<
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

    const updatedTitle = `Updated User Conversation ${Date.now()}`;
    const conversation = await db.conversation.updateMany({
      where: {
        participants: {
          has: user.id,
        },
      },
      data: { title: updatedTitle },
    });

    const verifiedConversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: user.id,
        },
        title: updatedTitle,
      },
    });

    if (!verifiedConversation) {
      throw new Error("User conversation update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User conversation updated successfully",
        data: conversation,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminConversationAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (adminUser) {
      await db.conversation.deleteMany({
        where: {
          participants: {
            has: adminUser.id,
          },
        },
      });

      const remainingConversations = await db.conversation.findMany({
        where: {
          participants: {
            has: adminUser.id,
          },
        },
      });

      if (remainingConversations.length > 0) {
        throw new Error("Admin conversations still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin conversations deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserConversationAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (user) {
      await db.conversation.deleteMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      const remainingConversations = await db.conversation.findMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      if (remainingConversations.length > 0) {
        throw new Error("User conversations still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User conversations deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAllUserConversationsAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (user) {
      await db.conversation.deleteMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      const remainingConversations = await db.conversation.findMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      if (remainingConversations.length > 0) {
        throw new Error(
          `${remainingConversations.length} user conversations still exist after deletion`
        );
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "All user conversations deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

// Message Actions
export async function rlsSelectAdminMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: adminUser.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("Admin conversation not found for message selection");
    }

    const message = await db.message.findFirst({
      where: { conversationId: conversation.id },
    });

    if (!message) {
      throw new Error("Admin message not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin message found",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsSelectUserMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: user.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("User conversation not found for message selection");
    }

    const message = await db.message.findFirst({
      where: { conversationId: conversation.id },
    });

    if (!message) {
      throw new Error("User message not found");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User message found",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertAdminMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: adminUser.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("Admin conversation not found for message creation");
    }

    const message = await db.message.create({
      data: {
        senderId: adminUser.id,
        content: "Admin test message",
        conversationId: conversation.id,
      },
    });

    const createdMessage = await db.message.findUnique({
      where: { id: message.id },
    });

    if (!createdMessage) {
      throw new Error("Created admin message cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin message created successfully",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsInsertUserMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: user.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("User conversation not found for message creation");
    }

    const message = await db.message.create({
      data: {
        senderId: user.id,
        content: "User test message",
        conversationId: conversation.id,
      },
    });

    const createdMessage = await db.message.findUnique({
      where: { id: message.id },
    });

    if (!createdMessage) {
      throw new Error("Created user message cannot be found after creation");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User message created successfully",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateAdminMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: adminUser.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("Admin conversation not found for message update");
    }

    const updatedContent = `Updated admin message ${Date.now()}`;
    const message = await db.message.updateMany({
      where: { conversationId: conversation.id },
      data: { content: updatedContent },
    });

    const verifiedMessage = await db.message.findFirst({
      where: {
        conversationId: conversation.id,
        content: updatedContent,
      },
    });

    if (!verifiedMessage) {
      throw new Error("Admin message update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin message updated successfully",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsUpdateUserMessageAction(): Promise<
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

    const conversation = await db.conversation.findFirst({
      where: {
        participants: {
          has: user.id,
        },
      },
    });

    if (!conversation) {
      throw new Error("User conversation not found for message update");
    }

    const updatedContent = `Updated user message ${Date.now()}`;
    const message = await db.message.updateMany({
      where: { conversationId: conversation.id },
      data: { content: updatedContent },
    });

    const verifiedMessage = await db.message.findFirst({
      where: {
        conversationId: conversation.id,
        content: updatedContent,
      },
    });

    if (!verifiedMessage) {
      throw new Error("User message update was not reflected in database");
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User message updated successfully",
        data: message,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAdminMessageAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const adminUser = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (adminUser) {
      const conversations = await db.conversation.findMany({
        where: {
          participants: {
            has: adminUser.id,
          },
        },
      });

      for (const conversation of conversations) {
        await db.message.deleteMany({
          where: { conversationId: conversation.id },
        });
      }

      const remainingMessages = await db.message.findMany({
        where: {
          conversationId: {
            in: conversations.map((c) => c.id),
          },
        },
      });

      if (remainingMessages.length > 0) {
        throw new Error("Admin messages still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Admin messages deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteUserMessageAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (user) {
      const conversations = await db.conversation.findMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      for (const conversation of conversations) {
        await db.message.deleteMany({
          where: { conversationId: conversation.id },
        });
      }

      const remainingMessages = await db.message.findMany({
        where: {
          conversationId: {
            in: conversations.map((c) => c.id),
          },
        },
      });

      if (remainingMessages.length > 0) {
        throw new Error("User messages still exist after deletion");
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "User messages deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

export async function rlsDeleteAllUserMessagesAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
    });

    if (user) {
      const conversations = await db.conversation.findMany({
        where: {
          participants: {
            has: user.id,
          },
        },
      });

      for (const conversation of conversations) {
        await db.message.deleteMany({
          where: { conversationId: conversation.id },
        });
      }

      const remainingMessages = await db.message.findMany({
        where: {
          conversationId: {
            in: conversations.map((c) => c.id),
          },
        },
      });

      if (remainingMessages.length > 0) {
        throw new Error(
          `${remainingMessages.length} user messages still exist after deletion`
        );
      }
    }

    return getActionResponse({
      data: {
        success: true,
        message: "All user messages deleted successfully",
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}

// Pay User Contract Action (using secure payment processing)
export async function rlsPayUserContractAction(): Promise<
  ActionResponse<RLSActionResponse>
> {
  try {
    const { db } = await getAuthenticatedClient();
    const user = await db.user.findUnique({
      where: { email: USER_EMAIL },
      include: { profile: { include: { contracts: true } } },
    });

    if (!user?.profile) {
      throw new Error("User or profile not found");
    }

    const contract = user.profile.contracts[0];
    if (!contract) {
      throw new Error("User contract not found for payment creation");
    }

    const existingPayment = await db.payment.findFirst({
      where: { contractId: contract.id },
    });

    if (existingPayment) {
      throw new Error("Payment for user contract already exists");
    }

    // Generate unique identifiers for test payment
    const stripeSessionId = `session_user_${Date.now()}`;
    const stripePaymentIntentId = `pi_user_${Date.now()}`;

    // First create the payment record in pending status
    const payment = await db.payment.create({
      data: {
        contractId: contract.id,
        stripeSessionId: stripeSessionId,
        amount: contract.price,
        currency: "usd",
        status: "pending",
      },
    });

    // Use the secure payment processing function to complete the payment
    await db.$executeRaw`
      SELECT process_payment_securely(
        ${stripeSessionId}::TEXT,
        ${stripePaymentIntentId}::TEXT,
        ${contract.price}::DECIMAL,
        ${contract.id}::TEXT
      )
    `;

    const completedPayment = await db.payment.findUnique({
      where: { id: payment.id },
    });

    if (!completedPayment) {
      throw new Error(
        "Created user contract payment cannot be found after processing"
      );
    }

    return getActionResponse({
      data: {
        success: true,
        message: "Payment for user contract processed successfully",
        data: completedPayment,
      },
    });
  } catch (error) {
    return getActionResponse({
      data: { success: false },
      error,
    });
  }
}
