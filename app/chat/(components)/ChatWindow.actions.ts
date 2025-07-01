//-| Filepath: actions/chat.actions.ts
"use server";

import { getAuthenticatedUser } from "@/app/admin/page.actions";
import { prisma } from "@/lib/prisma-client";
import { ActionResponse } from "@/types/app.types";
import { Conversation, Message } from "@/types/chat.types";
import { createId } from "@paralleldrive/cuid2";

export const getConversationsAction = async (
  userId: string
): Promise<ActionResponse<Conversation[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (currentUser?.role !== "admin" && currentUser?.id !== userId) {
      return { data: null, error: "Unauthorized" };
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          has: userId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            files: true,
          },
        },
        contracts: true,
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return { data: conversations, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch conversations",
    };
  }
};

export const sendMessageAction = async (params: {
  content: string;
  senderId: string;
  targetUserId: string;
  conversationId?: string;
}): Promise<ActionResponse<Message>> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (currentUser?.id !== params.senderId) {
      return { data: null, error: "Unauthorized" };
    }

    let conversationId = params.conversationId;

    if (!conversationId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            hasEvery: [params.senderId, params.targetUserId],
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        const adminUser = await prisma.user.findFirst({
          where: { role: "admin" },
        });

        if (!adminUser) {
          return { data: null, error: "Admin user not found" };
        }

        const newConversation = await prisma.conversation.create({
          data: {
            id: createId(),
            title: "New Conversation",
            participants: [params.senderId, params.targetUserId, adminUser.id],
            lastMessageAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        conversationId = newConversation.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        id: createId(),
        senderId: params.senderId,
        content: params.content,
        conversationId,
        createdAt: new Date(),
      },
      include: {
        files: true,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { data: message, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
};

export const createConversationAction = async (params: {
  content: string;
  senderId: string;
  targetUserId: string;
  title?: string;
}): Promise<
  ActionResponse<{ conversation: Conversation; message: Message }>
> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (currentUser?.id !== params.senderId || currentUser.role !== "admin") {
      return { data: null, error: "Unauthorized" };
    }

    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (!adminUser) {
      return { data: null, error: "Admin user not found" };
    }

    const conversationId = createId();
    const messageId = createId();
    const now = new Date();

    const conversation = await prisma.conversation.create({
      data: {
        id: conversationId,
        title: params.title || "New Conversation",
        participants: [params.senderId, params.targetUserId, adminUser.id],
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        messages: {
          include: {
            files: true,
          },
        },
        contracts: true,
      },
    });

    const message = await prisma.message.create({
      data: {
        id: messageId,
        senderId: params.senderId,
        content: params.content,
        conversationId,
        createdAt: now,
      },
      include: {
        files: true,
      },
    });

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            files: true,
          },
        },
        contracts: true,
      },
    });

    if (!updatedConversation) {
      return { data: null, error: "Failed to create conversation" };
    }

    return {
      data: {
        conversation: updatedConversation,
        message,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create conversation",
    };
  }
};
