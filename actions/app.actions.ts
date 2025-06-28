//-| File path: actions/app.actions.ts
"use server";

import { User as PrismaUser } from "@/generated/prisma";
import { auth, User } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { UserData } from "@/types/admin.types";
import { ActionResponse, AppData } from "@/types/app.types";
import { Profile } from "@/types/auth.types";
import { Conversation } from "@/types/chat.types";
import { Contract } from "@/types/contract.types";
import { headers } from "next/headers";

async function getAuthenticatedUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return session.user;
}

async function checkUserVerification(userId: string): Promise<boolean> {
  try {
    const userSignedInWithSocial = await prisma.account.findFirst({
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

    const user = await prisma.user.findUnique({
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
    const profile = await prisma.profile.findUnique({
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
    const users = await prisma.user.findMany({
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

    const lastMessages = await prisma.message.findMany({
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
        name: user.name,
        email: user.email,
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
    let whereClause = {};

    if (!isAdmin) {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return [];
      }

      whereClause = { profileId: profile.id };
    }

    const contracts = await prisma.contract.findMany({
      where: whereClause,
      include: {
        profile: true,
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

export const getTargetUserAction = async (
  userId: string
): Promise<
  ActionResponse<{ user: PrismaUser; profile: Profile | null } | null>
> => {
  try {
    const isAdmin = await adminGuard();

    if (!isAdmin) {
      return { data: null, error: "Unauthorized: Admin access required" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { data: null, error: "User not found" };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        contracts: true,
      },
    });

    return { data: { user, profile }, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to get target user",
    };
  }
};

export const getAppDataAction = async (
  userId?: string
): Promise<ActionResponse<AppData | null>> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) return { data: null };

    const isAdmin = user.role === "admin";
    const isVerified = await checkUserVerification(user.id);
    const profile = await getUserProfile(user.id);
    const users = await getAllUsers(isAdmin);
    const conversations = await getUserConversations(user.id);
    const contracts = await getUserContracts(user.id, isAdmin);

    let targetUser: PrismaUser | null = null;
    if (userId) {
      const targetUserResult = await getTargetUserAction(userId);
      if (targetUserResult.data) {
        targetUser = targetUserResult.data.user;
      }
    }

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

    return { data: appData, error: null };
  } catch (error) {
    return {
      data: {
        user: null,
        profile: null,
        isVerified: false,
        isAdmin: false,
        users: [],
        conversations: [],
        contracts: [],
        targetUser: null,
      },
      error: error instanceof Error ? error.message : "Failed to load app data",
    };
  }
};
