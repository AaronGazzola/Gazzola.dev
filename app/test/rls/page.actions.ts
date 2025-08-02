//-| File path: app/test/rls/page.actions.ts
"use server";

import { prisma } from "@/lib/prisma-client";
import { ActionResponse, getActionResponse, withAuthenticatedAction } from "@/lib/action.utils";
import { RLSTestResult } from "@/app/test/rls/page.types";

export const testProfileSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const profiles = await prisma.profile.findMany();
      return getActionResponse({ 
        data: { success: true, count: profiles.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testProfileInsertAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      await prisma.profile.create({
        data: {
          userId: "test-user-id",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
      });
      
      await prisma.profile.deleteMany({
        where: { userId: "test-user-id" },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testProfileUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      await prisma.profile.update({
        where: { id: userProfile.id },
        data: { firstName: userProfile.firstName },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testProfileDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      await prisma.profile.delete({
        where: { id: userProfile.id },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to delete profile" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testContractSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const contracts = await prisma.contract.findMany();
      return getActionResponse({ 
        data: { success: true, count: contracts.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testContractInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const newContract = await prisma.contract.create({
        data: {
          title: "Test Contract",
          description: "Test contract description",
          startDate: new Date(),
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          price: 1000,
          profileId: userProfile.id,
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
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testContractUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id, isPaid: false },
      });

      if (!userContract) {
        return getActionResponse({ 
          data: { success: false, error: "No unpaid contract found for user" } 
        });
      }

      await prisma.contract.update({
        where: { id: userContract.id },
        data: { title: userContract.title },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testContractDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({ 
          data: { success: false, error: "No contract found for user" } 
        });
      }

      await prisma.contract.delete({
        where: { id: userContract.id },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to delete contract as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testTaskSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const tasks = await prisma.task.findMany();
      return getActionResponse({ 
        data: { success: true, count: tasks.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testTaskInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({ 
          data: { success: false, error: "No contract found for user" } 
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
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testTaskUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({ 
          data: { success: false, error: "No contract found for user" } 
        });
      }

      const userTask = await prisma.task.findFirst({
        where: { contractId: userContract.id },
      });

      if (!userTask) {
        return getActionResponse({ 
          data: { success: false, error: "No task found for user contract" } 
        });
      }

      await prisma.task.update({
        where: { id: userTask.id },
        data: { title: userTask.title },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testTaskDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userProfile = await prisma.profile.findFirst({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return getActionResponse({ 
          data: { success: false, error: "No profile found for user" } 
        });
      }

      const userContract = await prisma.contract.findFirst({
        where: { profileId: userProfile.id },
      });

      if (!userContract) {
        return getActionResponse({ 
          data: { success: false, error: "No contract found for user" } 
        });
      }

      const userTask = await prisma.task.findFirst({
        where: { contractId: userContract.id },
      });

      if (!userTask) {
        return getActionResponse({ 
          data: { success: false, error: "No task found for user contract" } 
        });
      }

      await prisma.task.delete({
        where: { id: userTask.id },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to delete task as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testConversationSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const conversations = await prisma.conversation.findMany();
      return getActionResponse({ 
        data: { success: true, count: conversations.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testConversationInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
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
        data: { success: false, error: "Should not be able to create conversation as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testConversationUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: 'desc' },
      });

      if (!existingConversation) {
        return getActionResponse({ 
          data: { success: false, error: "No conversation found for user" } 
        });
      }

      await prisma.conversation.update({
        where: { id: existingConversation.id },
        data: { title: existingConversation.title },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testConversationDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: 'desc' },
      });

      if (!existingConversation) {
        return getActionResponse({ 
          data: { success: false, error: "No conversation found for user" } 
        });
      }

      await prisma.conversation.delete({
        where: { id: existingConversation.id },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to delete conversation as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testMessageSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const messages = await prisma.message.findMany();
      return getActionResponse({ 
        data: { success: true, count: messages.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testMessageInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: { participants: { has: user.id } },
        orderBy: { lastMessageAt: 'desc' },
      });

      if (!existingConversation) {
        return getActionResponse({ 
          data: { success: false, error: "No conversation found for user" } 
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
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testMessageUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!userMessage) {
        return getActionResponse({ 
          data: { success: false, error: "No message found for user" } 
        });
      }

      await prisma.message.update({
        where: { id: userMessage.id },
        data: { content: userMessage.content },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testMessageDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!userMessage) {
        return getActionResponse({ 
          data: { success: false, error: "No message found for user" } 
        });
      }

      await prisma.message.delete({
        where: { id: userMessage.id },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testFileUploadSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const fileUploads = await prisma.fileUpload.findMany();
      return getActionResponse({ 
        data: { success: true, count: fileUploads.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testFileUploadInsertAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!userMessage) {
        return getActionResponse({ 
          data: { success: false, error: "No message found for user" } 
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
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testFileUploadUpdateAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!userMessage) {
        return getActionResponse({ 
          data: { success: false, error: "No message found for user" } 
        });
      }

      const userFileUpload = await prisma.fileUpload.findFirst({
        where: { messageId: userMessage.id },
      });

      if (!userFileUpload) {
        return getActionResponse({ 
          data: { success: false, error: "No file upload found for user message" } 
        });
      }

      await prisma.fileUpload.update({
        where: { id: userFileUpload.id },
        data: { filename: userFileUpload.filename },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testFileUploadDeleteAction = withAuthenticatedAction(
  async (user): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      if (!user) {
        return getActionResponse({ 
          data: { success: false, error: "User not authenticated" } 
        });
      }

      const userMessage = await prisma.message.findFirst({
        where: { senderId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!userMessage) {
        return getActionResponse({ 
          data: { success: false, error: "No message found for user" } 
        });
      }

      const userFileUpload = await prisma.fileUpload.findFirst({
        where: { messageId: userMessage.id },
      });

      if (!userFileUpload) {
        return getActionResponse({ 
          data: { success: false, error: "No file upload found for user message" } 
        });
      }

      await prisma.fileUpload.delete({
        where: { id: userFileUpload.id },
      });
      
      return getActionResponse({ data: { success: true } });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testPaymentSelectAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const payments = await prisma.payment.findMany();
      return getActionResponse({ 
        data: { success: true, count: payments.length } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testPaymentInsertAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
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
        data: { success: false, error: "Should not be able to create payment as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testPaymentUpdateAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const existingPayment = await prisma.payment.findFirst();

      if (!existingPayment) {
        return getActionResponse({ 
          data: { success: false, error: "No payment found" } 
        });
      }

      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { amount: existingPayment.amount },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to update payment as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);

export const testPaymentDeleteAction = withAuthenticatedAction(
  async (): Promise<ActionResponse<RLSTestResult>> => {
    if (process.env.APP_ENV !== "test") {
      throw new Error("RLS test actions can only be run in test environment");
    }
    try {
      const existingPayment = await prisma.payment.findFirst();

      if (!existingPayment) {
        return getActionResponse({ 
          data: { success: false, error: "No payment found" } 
        });
      }

      await prisma.payment.delete({
        where: { id: existingPayment.id },
      });
      
      return getActionResponse({ 
        data: { success: false, error: "Should not be able to delete payment as non-admin" } 
      });
    } catch (error) {
      return getActionResponse({ 
        data: { success: false, error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }
);