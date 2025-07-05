//-| File path: app/chat/(components)/ChatWindow.actions.ts
"use server";

import { Conversation } from "@/app/(types)/chat.types";
import { getAuthenticatedUser } from "@/app/admin/admin.actions";
import { ActionResponse } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

export const getConversationsAction = async (): Promise<ActionResponse<Conversation[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return { data: null, error: "Unauthorized" };
    }

    const conversations = await prisma.conversation.findMany({
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

    return { data: conversations, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to get conversations",
    };
  }
};