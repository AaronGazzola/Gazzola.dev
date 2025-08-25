//-| File path: app/(actions)/app.actions.ts
"use server";

import { Profile } from "@/app/(types)/auth.types";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { AppData } from "@/app/(types)/ui.types";
import { User as PrismaUser, User } from "@/generated/prisma";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { headers } from "next/headers";

export async function getAuthenticatedUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const { db } = await getAuthenticatedClient();

  const prismaUser = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return prismaUser;
}



export async function getTargetUserAction(
  userId: string
): Promise<
  ActionResponse<{ user: PrismaUser; profile: Profile | null } | null>
> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user || session.user.role !== "admin") {
      return getActionResponse({
        error: "Unauthorized: Admin access required",
      });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            user: true,
            contracts: true,
          },
        },
      },
    });

    if (!user) {
      return getActionResponse({ error: "User not found" });
    }

    return getActionResponse({ 
      data: { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          isDeleted: user.isDeleted,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }, 
        profile: user.profile 
      } 
    });
  } catch (error) {
    return getActionResponse({ error });
  }
}

export async function getAppDataAction(
  targetUserId?: string
): Promise<ActionResponse<AppData | null>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: {
          include: {
            user: true,
            contracts: {
              include: {
                profile: true,
                conversations: true,
                tasks: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!user) {
      return getActionResponse({ error: "User not found" });
    }

    const isAdmin = user.role === "admin";
    const isVerified = user.emailVerified;
    const profile = user.profile;

    let targetUser: PrismaUser | null = null;
    let targetContracts: Contract[] = [];

    if (targetUserId && isAdmin) {
      if (targetUserId !== user.id) {
        const targetUserData = await db.user.findUnique({
          where: { id: targetUserId },
          include: {
            profile: {
              include: {
                user: true,
                contracts: {
                  include: {
                    profile: true,
                    conversations: true,
                    tasks: true,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
        });

        if (!targetUserData) {
          return getActionResponse({ error: "Target user not found" });
        }

        targetUser = {
          id: targetUserData.id,
          name: targetUserData.name,
          email: targetUserData.email,
          emailVerified: targetUserData.emailVerified,
          image: targetUserData.image,
          role: targetUserData.role,
          isDeleted: targetUserData.isDeleted,
          deletedAt: targetUserData.deletedAt,
          createdAt: targetUserData.createdAt,
          updatedAt: targetUserData.updatedAt,
        };
        targetContracts = targetUserData.profile?.contracts || [];
      } else {
        targetUser = user;
        targetContracts = profile?.contracts || [];
      }
    }

    const conversationUserId = isAdmin && targetUserId ? targetUserId : user.id;
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          has: conversationUserId,
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

    const contracts = targetUser ? targetContracts : (profile?.contracts || []);

    const appData: AppData = {
      user,
      profile,
      isVerified,
      isAdmin,
      conversations,
      contracts,
      targetUser,
    };

    return getActionResponse({ data: appData });
  } catch (error) {
    return getActionResponse({
      error,
    });
  }
}
