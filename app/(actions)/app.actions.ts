//-| File path: app/(actions)/app.actions.ts
"use server";

import { Profile } from "@/app/(types)/auth.types";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { AppData } from "@/app/(types)/ui.types";
import { UserData } from "@/app/admin/page.types";
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

async function checkUserVerification(userId: string): Promise<boolean> {
  try {
    const { db } = await getAuthenticatedClient();

    const userSignedInWithSocial = await db.account.findFirst({
      where: {
        userId,
        providerId: {
          in: [
            "google",
            "github",
            "discord",
            "facebook",
            "twitter",
            "apple",
            "microsoft",
            "linkedin",
          ],
        },
      },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    return user?.emailVerified || !!userSignedInWithSocial;
  } catch (error) {
    return false;
  }
}

async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { db } = await getAuthenticatedClient();

    const profile = await db.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        contracts: true,
      },
    });

    return profile;
  } catch (error) {
    return null;
  }
}

async function getAllUsers(isAdmin: boolean): Promise<UserData[]> {
  if (!isAdmin) {
    return [];
  }

  try {
    const { db } = await getAuthenticatedClient();

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          include: {
            contracts: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    const userIds = users.map((user) => user.id);

    const lastMessages = await db.message.findMany({
      where: {
        senderId: { in: userIds },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["senderId"],
      select: {
        senderId: true,
        content: true,
        createdAt: true,
      },
    });

    const messageMap = new Map(lastMessages.map((msg) => [msg.senderId, msg]));

    const userData: UserData[] = users.map((user) => {
      const lastMessage = messageMap.get(user.id);
      const latestContract = user.profile?.contracts[0];

      return {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role,
        createdAt: user.createdAt,
        lastMessage: lastMessage?.content || null,
        lastMessageAt: lastMessage?.createdAt || null,
        contractTitle: latestContract?.title || null,
        contractStatus: latestContract?.progressStatus || null,
        contractCreatedAt: latestContract?.createdAt || null,
        sessionCount: user._count.sessions,
      };
    });

    return userData;
  } catch (error) {
    return [];
  }
}

async function getUserConversations(userId: string): Promise<Conversation[]> {
  try {
    const { db } = await getAuthenticatedClient();

    const conversations = await db.conversation.findMany({
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

    return conversations;
  } catch (error) {
    return [];
  }
}

async function getUserContracts(
  userId: string,
  isAdmin: boolean
): Promise<Contract[]> {
  try {
    const { db } = await getAuthenticatedClient();
    let whereClause = {};

    if (!isAdmin) {
      const profile = await db.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return [];
      }

      whereClause = { profileId: profile.id };
    } else {
      const profile = await db.profile.findUnique({
        where: { userId },
      });

      if (profile) {
        whereClause = { profileId: profile.id };
      }
    }

    const contracts = await db.contract.findMany({
      where: whereClause,
      include: {
        profile: true,
        conversations: true,
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return contracts;
  } catch (error) {
    return [];
  }
}

async function adminGuard(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user?.role === "admin";
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
    });

    if (!user) {
      return getActionResponse({ error: "User not found" });
    }

    const profile = await db.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        contracts: true,
      },
    });

    return getActionResponse({ data: { user, profile } });
  } catch (error) {
    return getActionResponse({ error });
  }
}

export async function getAppDataAction(
  userId?: string
): Promise<ActionResponse<AppData | null>> {
  try {
    const { db, session } = await getAuthenticatedClient();

    if (!session?.user) {
      return getActionResponse({ error: "Unauthorized: No valid session" });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return getActionResponse({ error: "User not found" });
    }

    const isAdmin = user.role === "admin";
    const isVerified = await checkUserVerification(user.id);
    const profile = await getUserProfile(user.id);
    const users = await getAllUsers(isAdmin);
    const conversations = await getUserConversations(
      isAdmin && userId ? userId : user.id
    );

    let targetUser: PrismaUser | null = null;
    if (userId && isAdmin) {
      const targetUserResult = await getTargetUserAction(userId);
      if (targetUserResult.data) {
        targetUser = targetUserResult.data.user;
      }
    }
    const contracts = await getUserContracts(
      targetUser?.id || user.id,
      isAdmin
    );

    const appData: AppData = {
      user,
      profile,
      isVerified,
      isAdmin,
      users,
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
