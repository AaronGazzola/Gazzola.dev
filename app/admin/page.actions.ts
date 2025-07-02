//-| File path: app/admin/page.actions.ts
"use server";

import { GetUsersParams, UserData } from "@/app/admin/page.types";
import { ActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
}

export const isAdminAction = async (): Promise<ActionResponse<boolean>> => {
  try {
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return { data: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return { data: false, error: "Unauthorized" };
    }

    return { data: true, error: null };
  } catch (error) {
    return {
      data: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to verify admin status",
    };
  }
};

export const getUsersAction = async (
  params: GetUsersParams = {}
): Promise<ActionResponse<UserData[]>> => {
  try {
    const adminCheck = await isAdminAction();

    if (adminCheck.error || !adminCheck.data) {
      return { data: null, error: "Unauthorized" };
    }

    const {
      searchTerm,
      page = 1,
      pageSize = 10,
      orderBy = "createdAt",
      orderDirection = "desc",
    } = params;

    const where = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" as const } },
            { email: { contains: searchTerm, mode: "insensitive" as const } },
            {
              profile: {
                contracts: {
                  some: {
                    title: {
                      contains: searchTerm,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: { [orderBy]: orderDirection },
      take: pageSize,
      skip: (page - 1) * pageSize,
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

    return { data: userData, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
};
