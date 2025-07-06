//-| File path: app/chat/(components)/ChatInput.actions.ts
"use server";

import { Conversation } from "@/app/(types)/chat.types";
import { getAuthenticatedUser } from "@/app/admin/admin.actions";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";
import { createId } from "@paralleldrive/cuid2";

export const sendMessageAction = async (params: {
  messageContent: string;
  targetUserId?: string;
  isNewConversation: boolean;
}): Promise<ActionResponse<Conversation[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const isAdminAction = currentUser.role === "admin";

    if (params.isNewConversation && !isAdminAction) {
      return getActionResponse({ error: "Only admins can create new conversations" });
    }

    if (params.targetUserId && !isAdminAction) {
      return getActionResponse({ error: "Only admins can send messages to specific users" });
    }

    let targetUserId = params.targetUserId;

    if (!targetUserId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: "admin" },
      });

      if (!adminUser) {
        return getActionResponse({ error: "Admin user not found" });
      }

      targetUserId = adminUser.id;
    }

    let conversationId: string;

    if (params.isNewConversation) {
      const newConversation = await prisma.conversation.create({
        data: {
          id: createId(),
          title: "New Conversation",
          participants: [currentUser.id, targetUserId],
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      conversationId = newConversation.id;
    } else {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            has: currentUser.id,
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      if (!existingConversation) {
        const newConversation = await prisma.conversation.create({
          data: {
            id: createId(),
            title: "New Conversation",
            participants: [currentUser.id, targetUserId],
            lastMessageAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        conversationId = newConversation.id;
      } else {
        conversationId = existingConversation.id;
      }
    }

    await prisma.message.create({
      data: {
        id: createId(),
        senderId: currentUser.id,
        content: params.messageContent,
        conversationId,
        createdAt: new Date(),
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const data = await prisma.conversation.findMany({
      where: {
        participants: {
          has: currentUser.id,
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

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
