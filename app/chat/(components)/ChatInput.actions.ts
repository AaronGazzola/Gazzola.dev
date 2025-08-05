//-| File path: app/chat/(components)/ChatInput.actions.ts
"use server";

import { Conversation } from "@/app/(types)/chat.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

export async function sendMessageAction(params: {
  messageContent: string;
  targetUserId?: string;
  isNewConversation: boolean;
}): Promise<ActionResponse<Conversation[]>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const currentUser = session.user;

    const isAdminAction = currentUser.role === "admin";

    if (params.isNewConversation && !isAdminAction) {
      return getActionResponse({
        error: "Only admins can create new conversations",
      });
    }

    if (params.targetUserId && !isAdminAction) {
      return getActionResponse({
        error: "Only admins can send messages to specific users",
      });
    }

    let targetUserId = params.targetUserId;

    if (!targetUserId) {
      const adminUser = await db.user.findFirst({
        where: { role: "admin" },
      });

      if (!adminUser) {
        return getActionResponse({ error: "Admin user not found" });
      }

      targetUserId = adminUser.id;
    }

    let conversationId: string;

    if (params.isNewConversation) {
      const newConversation = await db.conversation.create({
        data: {
          title: "New Conversation",
          participants: [currentUser.id, targetUserId],
          lastMessageAt: new Date(),
        },
      });

      conversationId = newConversation.id;
    } else {
      const existingConversation = await db.conversation.findFirst({
        where: {
          participants: {
            has: targetUserId || currentUser.id,
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });

      if (!existingConversation) {
        const newConversation = await db.conversation.create({
          data: {
            title: "New Conversation",
            participants: [currentUser.id, targetUserId],
            lastMessageAt: new Date(),
          },
        });

        conversationId = newConversation.id;
      } else {
        conversationId = existingConversation.id;
      }
    }

    await db.message.create({
      data: {
        senderId: currentUser.id,
        content: params.messageContent,
        conversationId,
      },
    });

    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const data = await db.conversation.findMany({
      where: {
        participants: {
          has: targetUserId || currentUser.id,
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
}
