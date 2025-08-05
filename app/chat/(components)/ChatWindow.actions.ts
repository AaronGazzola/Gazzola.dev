//-| File path: app/chat/(components)/ChatWindow.actions.ts
"use server";

import { Conversation } from "@/app/(types)/chat.types";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getAuthenticatedClient } from "@/lib/auth-utils";

export async function getConversationsAction(
  targetUserId?: string
): Promise<ActionResponse<Conversation[]>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const currentUser = session.user;

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
