//-| File path: app/test/rls/page.actions.ts
"use server";

import { RLSTestResult } from "@/app/test/rls/page.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

export async function testProfileSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const profiles = await db.profile.findMany();
    return getActionResponse({
      data: { success: true, count: profiles.length },
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

export async function testProfileInsertAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    // Find the regular user to test profile creation
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found for testing" },
      });
    }

    // Store existing profile if any (to restore later)
    const existingProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    // Delete existing profile temporarily if it exists
    if (existingProfile) {
      await db.profile.delete({
        where: { id: existingProfile.id },
      });
    }

    // Create a test profile (admin should be able to create profiles for anyone)
    const testProfile = await db.profile.create({
      data: {
        userId: regularUser.id,
        firstName: "Test Profile",
        lastName: "Insert Test",
        email: `test-profile-insert-${Date.now()}@example.com`,
        company: "Test Insert Company",
      },
    });

    // Clean up the test profile
    await db.profile.delete({
      where: { id: testProfile.id },
    });

    // Restore the original profile if it existed
    if (existingProfile) {
      await db.profile.create({
        data: {
          userId: existingProfile.userId,
          firstName: existingProfile.firstName,
          lastName: existingProfile.lastName,
          email: existingProfile.email,
          company: existingProfile.company,
          phone: existingProfile.phone,
        },
      });
    }

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

export async function testProfileUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    await db.profile.update({
      where: { id: userProfile.id },
      data: { firstName: userProfile.firstName },
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

export async function testProfileDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    await db.profile.delete({
      where: { id: userProfile.id },
    });

    return getActionResponse({
      data: { success: false, error: "Should not be able to delete profile" },
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

export async function testContractSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    const contracts = await db.contract.findMany();
    return getActionResponse({
      data: { success: true, count: contracts.length },
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

export async function testContractInsertAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    // Use the regular user's profile to test contract creation (admin can create contracts for anyone)
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found for testing" },
      });
    }

    const regularUserProfile = await db.profile.findFirst({
      where: { userId: regularUser.id },
    });

    if (!regularUserProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for regular user" },
      });
    }

    const newContract = await db.contract.create({
      data: {
        title: "Test Contract Admin Insert",
        description: "Test contract description for admin insert test",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        price: 1500,
        profileId: regularUserProfile.id,
        conversationIds: [],
        userApproved: false,
        adminApproved: false,
      },
    });

    await db.contract.delete({
      where: { id: newContract.id },
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

export async function testContractUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    // Admin should be able to update any contract, so find any existing contract
    const anyContract = await db.contract.findFirst({
      where: { isPaid: false },
      orderBy: { createdAt: "desc" },
    });

    if (!anyContract) {
      return getActionResponse({
        data: {
          success: false,
          error: "No unpaid contract found for testing",
        },
      });
    }

    await db.contract.update({
      where: { id: anyContract.id },
      data: { title: anyContract.title + " - Admin Updated" },
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

export async function testContractDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    const userContract = await db.contract.findFirst({
      where: { profileId: userProfile.id },
    });

    if (!userContract) {
      return getActionResponse({
        data: { success: false, error: "No contract found for user" },
      });
    }

    await db.contract.delete({
      where: { id: userContract.id },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to delete contract as non-admin",
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

export async function testTaskSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    const tasks = await db.task.findMany();
    return getActionResponse({
      data: { success: true, count: tasks.length },
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

export async function testTaskInsertAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    const userContract = await db.contract.findFirst({
      where: { profileId: userProfile.id },
    });

    if (!userContract) {
      return getActionResponse({
        data: { success: false, error: "No contract found for user" },
      });
    }

    const newTask = await db.task.create({
      data: {
        title: "Test Task",
        description: "Test task description",
        price: 500,
        contractId: userContract.id,
      },
    });

    await db.task.delete({
      where: { id: newTask.id },
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

export async function testTaskUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    const userContract = await db.contract.findFirst({
      where: { profileId: userProfile.id },
    });

    if (!userContract) {
      return getActionResponse({
        data: { success: false, error: "No contract found for user" },
      });
    }

    const userTask = await db.task.findFirst({
      where: { contractId: userContract.id },
    });

    if (!userTask) {
      return getActionResponse({
        data: { success: false, error: "No task found for user contract" },
      });
    }

    await db.task.update({
      where: { id: userTask.id },
      data: { title: userTask.title },
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

export async function testTaskDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userProfile = await db.profile.findFirst({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return getActionResponse({
        data: { success: false, error: "No profile found for user" },
      });
    }

    const userContract = await db.contract.findFirst({
      where: { profileId: userProfile.id },
    });

    if (!userContract) {
      return getActionResponse({
        data: { success: false, error: "No contract found for user" },
      });
    }

    const userTask = await db.task.findFirst({
      where: { contractId: userContract.id },
    });

    if (!userTask) {
      return getActionResponse({
        data: { success: false, error: "No task found for user contract" },
      });
    }

    await db.task.delete({
      where: { id: userTask.id },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to delete task as non-admin",
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

export async function testConversationSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    const conversations = await db.conversation.findMany();
    return getActionResponse({
      data: { success: true, count: conversations.length },
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

export async function testConversationInsertAction(): Promise<
  ActionResponse<RLSTestResult>
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

    await db.conversation.create({
      data: {
        title: "Test Conversation",
        participants: [session.user.id],
        lastMessageAt: new Date(),
      },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to create conversation as non-admin",
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

export async function testConversationUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const existingConversation = await db.conversation.findFirst({
      where: { participants: { has: session.user.id } },
      orderBy: { lastMessageAt: "desc" },
    });

    if (!existingConversation) {
      return getActionResponse({
        data: { success: false, error: "No conversation found for user" },
      });
    }

    await db.conversation.update({
      where: { id: existingConversation.id },
      data: { title: existingConversation.title },
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

export async function testConversationDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const existingConversation = await db.conversation.findFirst({
      where: { participants: { has: session.user.id } },
      orderBy: { lastMessageAt: "desc" },
    });

    if (!existingConversation) {
      return getActionResponse({
        data: { success: false, error: "No conversation found for user" },
      });
    }

    await db.conversation.delete({
      where: { id: existingConversation.id },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to delete conversation as non-admin",
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

export async function testMessageSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  const { db } = await getAuthenticatedClient();
  try {
    const messages = await db.message.findMany();
    return getActionResponse({
      data: { success: true, count: messages.length },
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

export async function testMessageInsertAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const existingConversation = await db.conversation.findFirst({
      where: { participants: { has: session.user.id } },
      orderBy: { lastMessageAt: "desc" },
    });

    if (!existingConversation) {
      return getActionResponse({
        data: { success: false, error: "No conversation found for user" },
      });
    }

    const newMessage = await db.message.create({
      data: {
        senderId: session.user.id,
        content: "Test message",
        conversationId: existingConversation.id,
      },
    });

    await db.message.delete({
      where: { id: newMessage.id },
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

export async function testMessageUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userMessage = await db.message.findFirst({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!userMessage) {
      return getActionResponse({
        data: { success: false, error: "No message found for user" },
      });
    }

    await db.message.update({
      where: { id: userMessage.id },
      data: { content: userMessage.content },
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

export async function testMessageDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userMessage = await db.message.findFirst({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!userMessage) {
      return getActionResponse({
        data: { success: false, error: "No message found for user" },
      });
    }

    await db.message.delete({
      where: { id: userMessage.id },
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

export async function testFileUploadSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  const { db } = await getAuthenticatedClient();
  try {
    const fileUploads = await db.fileUpload.findMany();
    return getActionResponse({
      data: { success: true, count: fileUploads.length },
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

export async function testFileUploadInsertAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userMessage = await db.message.findFirst({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!userMessage) {
      return getActionResponse({
        data: { success: false, error: "No message found for user" },
      });
    }

    const newFileUpload = await db.fileUpload.create({
      data: {
        messageId: userMessage.id,
        filename: "test.txt",
        url: "http://example.com/test.txt",
        size: 1024,
        mimeType: "text/plain",
      },
    });

    await db.fileUpload.delete({
      where: { id: newFileUpload.id },
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

export async function testFileUploadUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userMessage = await db.message.findFirst({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!userMessage) {
      return getActionResponse({
        data: { success: false, error: "No message found for user" },
      });
    }

    const userFileUpload = await db.fileUpload.findFirst({
      where: { messageId: userMessage.id },
    });

    if (!userFileUpload) {
      return getActionResponse({
        data: {
          success: false,
          error: "No file upload found for user message",
        },
      });
    }

    await db.fileUpload.update({
      where: { id: userFileUpload.id },
      data: { filename: userFileUpload.filename },
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

export async function testFileUploadDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const userMessage = await db.message.findFirst({
      where: { senderId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!userMessage) {
      return getActionResponse({
        data: { success: false, error: "No message found for user" },
      });
    }

    const userFileUpload = await db.fileUpload.findFirst({
      where: { messageId: userMessage.id },
    });

    if (!userFileUpload) {
      return getActionResponse({
        data: {
          success: false,
          error: "No file upload found for user message",
        },
      });
    }

    await db.fileUpload.delete({
      where: { id: userFileUpload.id },
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

export async function testPaymentSelectAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const payments = await db.payment.findMany();
    return getActionResponse({
      data: { success: true, count: payments.length },
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

export async function testPaymentInsertAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();

    await db.payment.create({
      data: {
        contractId: "test-contract-id",
        stripeSessionId: "test-session-id",
        amount: 100,
        currency: "usd",
      },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to create payment as non-admin",
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

export async function testPaymentUpdateAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const existingPayment = await db.payment.findFirst();

    if (!existingPayment) {
      return getActionResponse({
        data: { success: false, error: "No payment found" },
      });
    }

    await db.payment.update({
      where: { id: existingPayment.id },
      data: { amount: existingPayment.amount },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to update payment as non-admin",
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

export async function testPaymentDeleteAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db, session } = await getAuthenticatedClient();
    const existingPayment = await db.payment.findFirst();

    if (!existingPayment) {
      return getActionResponse({
        data: { success: false, error: "No payment found" },
      });
    }

    await db.payment.delete({
      where: { id: existingPayment.id },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to delete payment as non-admin",
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

// Utility Actions

export async function deleteAllDataAction(): Promise<
  ActionResponse<RLSTestResult>
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

    // Get profiles for test users
    const testProfiles = await db.profile.findMany({
      where: { userId: { in: testUserIds } },
    });
    const testProfileIds = testProfiles.map((p) => p.id);

    // Get contracts for test users only
    const testContracts = await db.contract.findMany({
      where: { profileId: { in: testProfileIds } },
    });
    const testContractIds = testContracts.map((c) => c.id);

    // Get conversations for test users only
    const testConversations = await db.conversation.findMany({
      where: {
        participants: {
          hasSome: testUserIds,
        },
      },
    });
    const testConversationIds = testConversations.map((c) => c.id);

    // Delete data in dependency order, scoped to test users only
    await db.fileUpload.deleteMany({
      where: {
        message: {
          conversationId: { in: testConversationIds },
        },
      },
    });

    await db.message.deleteMany({
      where: { conversationId: { in: testConversationIds } },
    });

    await db.conversation.deleteMany({
      where: { id: { in: testConversationIds } },
    });

    await db.payment.deleteMany({
      where: { contractId: { in: testContractIds } },
    });

    await db.task.deleteMany({
      where: { contractId: { in: testContractIds } },
    });

    await db.contract.deleteMany({
      where: { id: { in: testContractIds } },
    });

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

// New Step-by-Step Workflow Actions

export async function createAdminProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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

    // Attempt to create admin profile
    await db.profile.create({
      data: {
        userId: adminUser.id,
        firstName: "Admin",
        lastName: "Test User",
        email: adminUser.email,
        company: "Admin Test Company",
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

export async function createUserProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    // Try to create profile for regular user (should succeed for admin, fail for regular user trying to create admin profile)
    const targetUserId =
      session.user.role === "admin" ? regularUser.id : session.user.id;

    // Delete existing profile if it exists
    await db.profile.deleteMany({
      where: { userId: targetUserId },
    });

    // Attempt to create user profile
    await db.profile.create({
      data: {
        userId: targetUserId,
        firstName: "Regular",
        lastName: "Test User",
        email: regularUser.email,
        company: "User Test Company",
        phone: "555-987-6543",
      },
    });

    // Verify the profile was actually created
    const createdProfile = await db.profile.findFirst({
      where: { userId: targetUserId },
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

export async function selectAdminProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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
      data: { success: true, count: adminProfile ? 1 : 0 },
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

export async function selectUserProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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
      data: { success: true, count: userProfile ? 1 : 0 },
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

export async function editAdminProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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

    await db.profile.update({
      where: { id: adminProfile.id },
      data: { company: "Updated Admin Company" },
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

export async function editUserProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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

    await db.profile.update({
      where: { id: userProfile.id },
      data: { company: "Updated User Company" },
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

export async function createContractForUserAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const contract = await db.contract.create({
      data: {
        title: "Step-by-Step Test Contract",
        description: "Contract created for step-by-step RLS testing",
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        price: 2500,
        profileId: userProfile.id,
        conversationIds: [],
        userApproved: false,
        adminApproved: false,
        isPaid: false,
      },
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

export async function selectContractAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const contracts = await db.contract.findMany({
      where: { title: "Step-by-Step Test Contract" },
    });

    return getActionResponse({
      data: { success: true, count: contracts.length },
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

export async function addTaskToContractAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const contract = await db.contract.findFirst({
      where: { title: "Step-by-Step Test Contract" },
    });

    if (!contract) {
      return getActionResponse({
        data: { success: false, error: "Test contract not found" },
      });
    }

    const task = await db.task.create({
      data: {
        title: "Step-by-Step Test Task",
        description: "Task created for step-by-step RLS testing",
        price: 1000,
        contractId: contract.id,
      },
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

export async function selectTaskAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const tasks = await db.task.findMany({
      where: { title: "Step-by-Step Test Task" },
    });

    return getActionResponse({
      data: { success: true, count: tasks.length },
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

export async function updateTaskFirstTimeAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const task = await db.task.findFirst({
      where: { title: "Step-by-Step Test Task" },
    });

    if (!task) {
      return getActionResponse({
        data: { success: false, error: "Test task not found" },
      });
    }

    await db.task.update({
      where: { id: task.id },
      data: { description: "Updated task description - first time" },
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

export async function updateContractToPaidAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const contract = await db.contract.findFirst({
      where: { title: "Step-by-Step Test Contract" },
    });

    if (!contract) {
      return getActionResponse({
        data: { success: false, error: "Test contract not found" },
      });
    }

    await db.contract.update({
      where: { id: contract.id },
      data: { isPaid: true },
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

export async function updateTaskSecondTimeAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const task = await db.task.findFirst({
      where: { title: "Step-by-Step Test Task" },
    });

    if (!task) {
      return getActionResponse({
        data: { success: false, error: "Test task not found" },
      });
    }

    await db.task.update({
      where: { id: task.id },
      data: { description: "Updated task description - second time" },
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

export async function deleteTaskAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const task = await db.task.findFirst({
      where: { title: "Step-by-Step Test Task" },
    });

    if (!task) {
      return getActionResponse({
        data: { success: false, error: "Test task not found" },
      });
    }

    // Attempt to delete the task
    await db.task.delete({
      where: { id: task.id },
    });

    // Verify the task was actually deleted
    const taskStillExists = await db.task.findFirst({
      where: { id: task.id },
    });

    const actuallyDeleted = taskStillExists === null;

    return getActionResponse({
      data: {
        success: actuallyDeleted,
        error: actuallyDeleted ? undefined : "RLS policy blocked task deletion",
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

export async function updateContractSecondTimeAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const contract = await db.contract.findFirst({
      where: { title: "Step-by-Step Test Contract" },
    });

    if (!contract) {
      return getActionResponse({
        data: { success: false, error: "Test contract not found" },
      });
    }

    const newDescription = "Updated contract description - second time";

    // Attempt to update the contract
    await db.contract.update({
      where: { id: contract.id },
      data: { description: newDescription },
    });

    // Verify the contract was actually updated
    const updatedContract = await db.contract.findFirst({
      where: { id: contract.id },
    });

    const actuallyUpdated = updatedContract?.description === newDescription;

    return getActionResponse({
      data: {
        success: actuallyUpdated,
        error: actuallyUpdated
          ? undefined
          : "RLS policy blocked contract update",
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

export async function deleteContractAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const contract = await db.contract.findFirst({
      where: { title: "Step-by-Step Test Contract" },
    });

    if (!contract) {
      return getActionResponse({
        data: { success: false, error: "Test contract not found" },
      });
    }

    // Attempt to delete the contract
    await db.contract.delete({
      where: { id: contract.id },
    });

    // Verify the contract was actually deleted
    const contractStillExists = await db.contract.findFirst({
      where: { id: contract.id },
    });

    const actuallyDeleted = contractStillExists === null;

    return getActionResponse({
      data: {
        success: actuallyDeleted,
        error: actuallyDeleted
          ? undefined
          : "RLS policy blocked contract deletion",
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

export async function createConversationForUserAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const regularUser = await db.user.findFirst({
      where: { email: process.env.USER_EMAIL! },
    });

    if (!regularUser) {
      return getActionResponse({
        data: { success: false, error: "Regular user not found" },
      });
    }

    // Attempt to create conversation
    await db.conversation.create({
      data: {
        title: "Step-by-Step Test Conversation",
        participants: [regularUser.id],
        lastMessageAt: new Date(),
      },
    });

    // Verify the conversation was actually created
    const createdConversation = await db.conversation.findFirst({
      where: { title: "Step-by-Step Test Conversation" },
    });

    const actuallyCreated = createdConversation !== null;

    return getActionResponse({
      data: {
        success: actuallyCreated,
        error: actuallyCreated
          ? undefined
          : "RLS policy blocked conversation creation",
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

export async function addMessageToConversationAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const conversation = await db.conversation.findFirst({
      where: { title: "Step-by-Step Test Conversation" },
    });

    if (!conversation) {
      return getActionResponse({
        data: { success: false, error: "Test conversation not found" },
      });
    }

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        content: "Step-by-step test message",
        conversationId: conversation.id,
      },
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

export async function updateMessageAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const message = await db.message.findFirst({
      where: { content: "Step-by-step test message" },
    });

    if (!message) {
      return getActionResponse({
        data: { success: false, error: "Test message not found" },
      });
    }

    await db.message.update({
      where: { id: message.id },
      data: { content: "Updated step-by-step test message" },
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

export async function deleteMessageAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const message = await db.message.findFirst({
      where: { content: "Updated step-by-step test message" },
    });

    if (!message) {
      return getActionResponse({
        data: { success: false, error: "Updated test message not found" },
      });
    }

    await db.message.delete({
      where: { id: message.id },
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

export async function deleteConversationAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const conversation = await db.conversation.findFirst({
      where: { title: "Step-by-Step Test Conversation" },
    });

    if (!conversation) {
      return getActionResponse({
        data: { success: false, error: "Test conversation not found" },
      });
    }

    await db.conversation.delete({
      where: { id: conversation.id },
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

export async function deleteUserProfileAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
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

export async function deleteAdminProfileAction(): Promise<
  ActionResponse<RLSTestResult>
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

export async function insertAdminMessageToConversationAction(): Promise<
  ActionResponse<RLSTestResult>
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

    const conversation = await db.conversation.findFirst({
      where: { title: "Step-by-Step Test Conversation" },
    });

    if (!conversation) {
      return getActionResponse({
        data: { success: false, error: "Test conversation not found" },
      });
    }

    await db.message.create({
      data: {
        senderId: session.user.id,
        content: "Admin message for RLS testing",
        conversationId: conversation.id,
      },
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

export async function trySelectAdminMessageAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const adminMessage = await db.message.findFirst({
      where: { content: "Admin message for RLS testing" },
    });

    return getActionResponse({
      data: {
        success: adminMessage ? false : true,
        error: adminMessage
          ? "Should not be able to view admin message"
          : "Admin message not found as expected",
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

export async function tryEditAdminMessageAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const adminMessage = await db.message.findFirst({
      where: { content: "Admin message for RLS testing" },
    });

    if (!adminMessage) {
      return getActionResponse({
        data: {
          success: false,
          error: "Admin message not found for editing test",
        },
      });
    }

    await db.message.update({
      where: { id: adminMessage.id },
      data: { content: "User tried to edit admin message" },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to edit admin message",
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

export async function tryDeleteAdminMessageAction(): Promise<
  ActionResponse<RLSTestResult>
> {
  if (process.env.APP_ENV !== "test") {
    return getActionResponse({
      error:
        "TestEnvironmentError: RLS test actions can only be run in test environment",
    });
  }
  try {
    const { db } = await getAuthenticatedClient();
    const adminMessage = await db.message.findFirst({
      where: { content: "Admin message for RLS testing" },
    });

    if (!adminMessage) {
      return getActionResponse({
        data: {
          success: false,
          error: "Admin message not found for deletion test",
        },
      });
    }

    await db.message.delete({
      where: { id: adminMessage.id },
    });

    return getActionResponse({
      data: {
        success: false,
        error: "Should not be able to delete admin message",
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
