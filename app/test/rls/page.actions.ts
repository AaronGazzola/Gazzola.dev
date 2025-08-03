//-| File path: app/test/rls/page.actions.ts
"use server";

import { RLSTestResult } from "@/app/test/rls/page.types";
import {
  ActionResponse,
  getActionResponse,
  withAuthenticatedAction,
} from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

export const testProfileSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const profiles = await prisma.profile.findMany();
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
);

export const testProfileInsertAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      // Find the regular user to test profile creation
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found for testing" },
        });
      }

      // Store existing profile if any (to restore later)
      const existingProfile = await prisma.profile.findFirst({
        where: { userId: regularUser.id },
      });

      // Delete existing profile temporarily if it exists
      if (existingProfile) {
        await prisma.profile.delete({
          where: { id: existingProfile.id },
        });
      }

      // Create a test profile (admin should be able to create profiles for anyone)
      const testProfile = await prisma.profile.create({
        data: {
          userId: regularUser.id,
          firstName: "Test Profile",
          lastName: "Insert Test",
          email: `test-profile-insert-${Date.now()}@example.com`,
          company: "Test Insert Company",
        },
      });

      // Clean up the test profile
      await prisma.profile.delete({
        where: { id: testProfile.id },
      });

      // Restore the original profile if it existed
      if (existingProfile) {
        await prisma.profile.create({
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
);

export const testProfileUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      await prisma.profile.update({
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
);

export const testProfileDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      await prisma.profile.delete({
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
);

export const testContractSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contracts = await prisma.contract.findMany();
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
);

export const testContractInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      // Use the regular user's profile to test contract creation (admin can create contracts for anyone)
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found for testing" },
        });
      }

      const regularUserProfile = await prisma.profile.findFirst({
        where: { userId: regularUser.id },
      });

      if (!regularUserProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for regular user" },
        });
      }

      const newContract = await prisma.contract.create({
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

      await prisma.contract.delete({
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
);

export const testContractUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      // Admin should be able to update any contract, so find any existing contract
      const anyContract = await prisma.contract.findFirst({
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

      await prisma.contract.update({
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
);

export const testContractDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({
          data: { success: false, error: "No contract found for user" },
        });
      }

      await prisma.contract.delete({
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
);

export const testTaskSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const tasks = await prisma.task.findMany();
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
);

export const testTaskInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({
          data: { success: false, error: "No contract found for user" },
        });
      }

      const newTask = await prisma.task.create({
        data: {
          title: "Test Task",
          description: "Test task description",
          price: 500,
          contractId: userContract.id,
        },
      });

      await prisma.task.delete({
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
);

export const testTaskUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({
          data: { success: false, error: "No contract found for user" },
        });
      }

      const userTask = await prisma.task.findFirst({
        where: { contractId: userContract.id },
      });

      if (!userTask) {
        return getActionResponse({
          data: { success: false, error: "No task found for user contract" },
        });
      }

      await prisma.task.update({
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
);

export const testTaskDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "No profile found for user" },
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({
          data: { success: false, error: "No contract found for user" },
        });
      }

      const userTask = await prisma.task.findFirst({
        where: { contractId: userContract.id },
      });

      if (!userTask) {
        return getActionResponse({
          data: { success: false, error: "No task found for user contract" },
        });
      }

      await prisma.task.delete({
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
);

export const testConversationSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const conversations = await prisma.conversation.findMany();
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
);

export const testConversationInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      await prisma.conversation.create({
        data: {
          title: "Test Conversation",
          participants: [user.id],
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
);

export const testConversationUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: "desc" },
      });

      if (!existingConversation) {
        return getActionResponse({
          data: { success: false, error: "No conversation found for user" },
        });
      }

      await prisma.conversation.update({
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
);

export const testConversationDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: "desc" },
      });

      if (!existingConversation) {
        return getActionResponse({
          data: { success: false, error: "No conversation found for user" },
        });
      }

      await prisma.conversation.delete({
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
);

export const testMessageSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const messages = await prisma.message.findMany();
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
);

export const testMessageInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: "desc" },
      });

      if (!existingConversation) {
        return getActionResponse({
          data: { success: false, error: "No conversation found for user" },
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId: user.id,
          content: "Test message",
          conversationId: existingConversation.id,
        },
      });

      await prisma.message.delete({
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
);

export const testMessageUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!userMessage) {
        return getActionResponse({
          data: { success: false, error: "No message found for user" },
        });
      }

      await prisma.message.update({
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
);

export const testMessageDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!userMessage) {
        return getActionResponse({
          data: { success: false, error: "No message found for user" },
        });
      }

      await prisma.message.delete({
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
);

export const testFileUploadSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const fileUploads = await prisma.fileUpload.findMany();
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
);

export const testFileUploadInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!userMessage) {
        return getActionResponse({
          data: { success: false, error: "No message found for user" },
        });
      }

      const newFileUpload = await prisma.fileUpload.create({
        data: {
          messageId: userMessage.id,
          filename: "test.txt",
          url: "http://example.com/test.txt",
          size: 1024,
          mimeType: "text/plain",
        },
      });

      await prisma.fileUpload.delete({
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
);

export const testFileUploadUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!userMessage) {
        return getActionResponse({
          data: { success: false, error: "No message found for user" },
        });
      }

      const userFileUpload = await prisma.fileUpload.findFirst({
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

      await prisma.fileUpload.update({
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
);

export const testFileUploadDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!userMessage) {
        return getActionResponse({
          data: { success: false, error: "No message found for user" },
        });
      }

      const userFileUpload = await prisma.fileUpload.findFirst({
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

      await prisma.fileUpload.delete({
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
);

export const testPaymentSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const payments = await prisma.payment.findMany();
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
);

export const testPaymentInsertAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      await prisma.payment.create({
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
);

export const testPaymentUpdateAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const existingPayment = await prisma.payment.findFirst();

      if (!existingPayment) {
        return getActionResponse({
          data: { success: false, error: "No payment found" },
        });
      }

      await prisma.payment.update({
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
);

export const testPaymentDeleteAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const existingPayment = await prisma.payment.findFirst();

      if (!existingPayment) {
        return getActionResponse({
          data: { success: false, error: "No payment found" },
        });
      }

      await prisma.payment.delete({
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
);

// Utility Actions

export const deleteAllDataAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      // Find the test users to scope deletions
      const adminUser = await prisma.user.findFirst({
        where: { email: process.env.ADMIN_EMAIL! },
      });
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!adminUser || !regularUser) {
        return getActionResponse({
          data: { success: false, error: "Test users not found" },
        });
      }

      const testUserIds = [adminUser.id, regularUser.id];

      // Get profiles for test users
      const testProfiles = await prisma.profile.findMany({
        where: { userId: { in: testUserIds } },
      });
      const testProfileIds = testProfiles.map((p) => p.id);

      // Get contracts for test users only
      const testContracts = await prisma.contract.findMany({
        where: { profileId: { in: testProfileIds } },
      });
      const testContractIds = testContracts.map((c) => c.id);

      // Get conversations for test users only
      const testConversations = await prisma.conversation.findMany({
        where: {
          participants: {
            hasSome: testUserIds,
          },
        },
      });
      const testConversationIds = testConversations.map((c) => c.id);

      // Delete data in dependency order, scoped to test users only
      await prisma.fileUpload.deleteMany({
        where: {
          message: {
            conversationId: { in: testConversationIds },
          },
        },
      });

      await prisma.message.deleteMany({
        where: { conversationId: { in: testConversationIds } },
      });

      await prisma.conversation.deleteMany({
        where: { id: { in: testConversationIds } },
      });

      await prisma.payment.deleteMany({
        where: { contractId: { in: testContractIds } },
      });

      await prisma.task.deleteMany({
        where: { contractId: { in: testContractIds } },
      });

      await prisma.contract.deleteMany({
        where: { id: { in: testContractIds } },
      });

      // Delete profiles for test users only
      await prisma.profile.deleteMany({
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
);

// New Step-by-Step Workflow Actions

export const createAdminProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminUser = await prisma.user.findFirst({
        where: { email: process.env.ADMIN_EMAIL! },
      });

      if (!adminUser) {
        return getActionResponse({
          data: { success: false, error: "Admin user not found" },
        });
      }

      // Delete existing admin profile if it exists
      await prisma.profile.deleteMany({
        where: { userId: adminUser.id },
      });

      // Attempt to create admin profile
      await prisma.profile.create({
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
      const createdProfile = await prisma.profile.findFirst({
        where: { userId: adminUser.id },
      });

      const actuallyCreated = createdProfile !== null;

      return getActionResponse({ 
        data: { 
          success: actuallyCreated,
          error: actuallyCreated ? undefined : "RLS policy blocked admin profile creation"
        } 
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
);

export const createUserProfileAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      // Try to create profile for regular user (should succeed for admin, fail for regular user trying to create admin profile)
      const targetUserId = user.role === "admin" ? regularUser.id : user.id;

      // Delete existing profile if it exists
      await prisma.profile.deleteMany({
        where: { userId: targetUserId },
      });

      // Attempt to create user profile
      await prisma.profile.create({
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
      const createdProfile = await prisma.profile.findFirst({
        where: { userId: targetUserId },
      });

      const actuallyCreated = createdProfile !== null;

      return getActionResponse({ 
        data: { 
          success: actuallyCreated,
          error: actuallyCreated ? undefined : "RLS policy blocked user profile creation"
        } 
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
);

export const selectAdminProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminUser = await prisma.user.findFirst({
        where: { email: process.env.ADMIN_EMAIL! },
      });

      if (!adminUser) {
        return getActionResponse({
          data: { success: false, error: "Admin user not found" },
        });
      }

      const adminProfile = await prisma.profile.findFirst({
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
);

export const selectUserProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
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
);

export const editAdminProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminUser = await prisma.user.findFirst({
        where: { email: process.env.ADMIN_EMAIL! },
      });

      if (!adminUser) {
        return getActionResponse({
          data: { success: false, error: "Admin user not found" },
        });
      }

      const adminProfile = await prisma.profile.findFirst({
        where: { userId: adminUser.id },
      });

      if (!adminProfile) {
        return getActionResponse({
          data: { success: false, error: "Admin profile not found" },
        });
      }

      await prisma.profile.update({
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
);

export const editUserProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: regularUser.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "User profile not found" },
        });
      }

      await prisma.profile.update({
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
);

export const createContractForUserAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: regularUser.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "User profile not found" },
        });
      }

      const contract = await prisma.contract.create({
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
);

export const selectContractAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contracts = await prisma.contract.findMany({
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
);

export const addTaskToContractAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contract = await prisma.contract.findFirst({
        where: { title: "Step-by-Step Test Contract" },
      });

      if (!contract) {
        return getActionResponse({
          data: { success: false, error: "Test contract not found" },
        });
      }

      const task = await prisma.task.create({
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
);

export const selectTaskAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const tasks = await prisma.task.findMany({
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
);

export const updateTaskFirstTimeAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const task = await prisma.task.findFirst({
        where: { title: "Step-by-Step Test Task" },
      });

      if (!task) {
        return getActionResponse({
          data: { success: false, error: "Test task not found" },
        });
      }

      await prisma.task.update({
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
);

export const updateContractToPaidAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contract = await prisma.contract.findFirst({
        where: { title: "Step-by-Step Test Contract" },
      });

      if (!contract) {
        return getActionResponse({
          data: { success: false, error: "Test contract not found" },
        });
      }

      await prisma.contract.update({
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
);

export const updateTaskSecondTimeAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const task = await prisma.task.findFirst({
        where: { title: "Step-by-Step Test Task" },
      });

      if (!task) {
        return getActionResponse({
          data: { success: false, error: "Test task not found" },
        });
      }

      await prisma.task.update({
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
);

export const deleteTaskAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const task = await prisma.task.findFirst({
        where: { title: "Step-by-Step Test Task" },
      });

      if (!task) {
        return getActionResponse({
          data: { success: false, error: "Test task not found" },
        });
      }

      // Attempt to delete the task
      await prisma.task.delete({
        where: { id: task.id },
      });

      // Verify the task was actually deleted
      const taskStillExists = await prisma.task.findFirst({
        where: { id: task.id },
      });

      const actuallyDeleted = taskStillExists === null;

      return getActionResponse({ 
        data: { 
          success: actuallyDeleted,
          error: actuallyDeleted ? undefined : "RLS policy blocked task deletion"
        } 
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
);

export const updateContractSecondTimeAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contract = await prisma.contract.findFirst({
        where: { title: "Step-by-Step Test Contract" },
      });

      if (!contract) {
        return getActionResponse({
          data: { success: false, error: "Test contract not found" },
        });
      }

      const newDescription = "Updated contract description - second time";

      // Attempt to update the contract
      await prisma.contract.update({
        where: { id: contract.id },
        data: { description: newDescription },
      });

      // Verify the contract was actually updated
      const updatedContract = await prisma.contract.findFirst({
        where: { id: contract.id },
      });

      const actuallyUpdated = updatedContract?.description === newDescription;

      return getActionResponse({ 
        data: { 
          success: actuallyUpdated,
          error: actuallyUpdated ? undefined : "RLS policy blocked contract update"
        } 
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
);

export const deleteContractAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const contract = await prisma.contract.findFirst({
        where: { title: "Step-by-Step Test Contract" },
      });

      if (!contract) {
        return getActionResponse({
          data: { success: false, error: "Test contract not found" },
        });
      }

      // Attempt to delete the contract
      await prisma.contract.delete({
        where: { id: contract.id },
      });

      // Verify the contract was actually deleted
      const contractStillExists = await prisma.contract.findFirst({
        where: { id: contract.id },
      });

      const actuallyDeleted = contractStillExists === null;

      return getActionResponse({ 
        data: { 
          success: actuallyDeleted,
          error: actuallyDeleted ? undefined : "RLS policy blocked contract deletion"
        } 
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
);

export const createConversationForUserAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      // Attempt to create conversation
      await prisma.conversation.create({
        data: {
          title: "Step-by-Step Test Conversation",
          participants: [regularUser.id],
          lastMessageAt: new Date(),
        },
      });

      // Verify the conversation was actually created
      const createdConversation = await prisma.conversation.findFirst({
        where: { title: "Step-by-Step Test Conversation" },
      });

      const actuallyCreated = createdConversation !== null;

      return getActionResponse({ 
        data: { 
          success: actuallyCreated,
          error: actuallyCreated ? undefined : "RLS policy blocked conversation creation"
        } 
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
);

export const addMessageToConversationAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const conversation = await prisma.conversation.findFirst({
        where: { title: "Step-by-Step Test Conversation" },
      });

      if (!conversation) {
        return getActionResponse({
          data: { success: false, error: "Test conversation not found" },
        });
      }

      const message = await prisma.message.create({
        data: {
          senderId: user.id,
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
);

export const updateMessageAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const message = await prisma.message.findFirst({
        where: { content: "Step-by-step test message" },
      });

      if (!message) {
        return getActionResponse({
          data: { success: false, error: "Test message not found" },
        });
      }

      await prisma.message.update({
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
);

export const deleteMessageAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const message = await prisma.message.findFirst({
        where: { content: "Updated step-by-step test message" },
      });

      if (!message) {
        return getActionResponse({
          data: { success: false, error: "Updated test message not found" },
        });
      }

      await prisma.message.delete({
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
);

export const deleteConversationAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const conversation = await prisma.conversation.findFirst({
        where: { title: "Step-by-Step Test Conversation" },
      });

      if (!conversation) {
        return getActionResponse({
          data: { success: false, error: "Test conversation not found" },
        });
      }

      await prisma.conversation.delete({
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
);

export const deleteUserProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const regularUser = await prisma.user.findFirst({
        where: { email: process.env.USER_EMAIL! },
      });

      if (!regularUser) {
        return getActionResponse({
          data: { success: false, error: "Regular user not found" },
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: regularUser.id },
      });

      if (!userProfile) {
        return getActionResponse({
          data: { success: false, error: "User profile not found" },
        });
      }

      await prisma.profile.delete({
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
);

export const deleteAdminProfileAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminUser = await prisma.user.findFirst({
        where: { email: process.env.ADMIN_EMAIL! },
      });

      if (!adminUser) {
        return getActionResponse({
          data: { success: false, error: "Admin user not found" },
        });
      }

      const adminProfile = await prisma.profile.findFirst({
        where: { userId: adminUser.id },
      });

      if (!adminProfile) {
        return getActionResponse({
          data: { success: false, error: "Admin profile not found" },
        });
      }

      await prisma.profile.delete({
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
);

export const insertAdminMessageToConversationAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      if (!user) {
        return getActionResponse({
          data: { success: false, error: "User not authenticated" },
        });
      }

      const conversation = await prisma.conversation.findFirst({
        where: { title: "Step-by-Step Test Conversation" },
      });

      if (!conversation) {
        return getActionResponse({
          data: { success: false, error: "Test conversation not found" },
        });
      }

      await prisma.message.create({
        data: {
          senderId: user.id,
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
);

export const trySelectAdminMessageAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminMessage = await prisma.message.findFirst({
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
);

export const tryEditAdminMessageAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminMessage = await prisma.message.findFirst({
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

      await prisma.message.update({
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
);

export const tryDeleteAdminMessageAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      return getActionResponse({
        error:
          "TestEnvironmentError: RLS test actions can only be run in test environment",
      });
    }
    try {
      const adminMessage = await prisma.message.findFirst({
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

      await prisma.message.delete({
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
);
