//-| File path: app/chat/(components)/ChatWindow.actions.ts
"use server";

import { getAuthenticatedUser } from "@/app/(actions)/app.actions";
import { Conversation } from "@/app/(types)/chat.types";
import { ActionResponse, getActionResponse, withAuthenticatedAction } from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

export const getConversationsAction = withAuthenticatedAction(async (
  currentUser,
  targetUserId?: string
): Promise<ActionResponse<Conversation[]>> => {
  try {
    const data = await prisma.conversation.findMany({
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
});
