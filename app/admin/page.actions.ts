//-| File path: app/admin/admin.actions.ts
"use server";

import { GetUsersParams, UserData } from "@/app/admin/page.types";
import {
  ActionResponse,
  getActionResponse,
  withAuthenticatedAction,
} from "@/lib/action.utils";
import { prisma } from "@/lib/prisma-client";

export const isAdminAction = withAuthenticatedAction(
  async (currentUser): Promise<ActionResponse<boolean>> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { role: true },
      });

      if (!user || user.role !== "admin") {
        return getActionResponse({ data: false, error: "Unauthorized" });
      }

      return getActionResponse({ data: true });
    } catch (error) {
      return getActionResponse({ data: false, error });
    }
  }
);

export const getUsersAction = withAuthenticatedAction(
  async (
    currentUser,
    params: GetUsersParams = {}
  ): Promise<ActionResponse<UserData[]>> => {
    try {
      if (currentUser.role !== "admin") {
        return getActionResponse({ error: "Unauthorized" });
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
            AND: [
              { email: { contains: "@" } },
              { email: { not: process.env.ADMIN_EMAIL } },
              {
                OR: [
                  {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    email: {
                      contains: searchTerm,
                      mode: "insensitive" as const,
                    },
                  },
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
              },
            ],
          }
        : {
            AND: [
              { email: { contains: "@" } },
              { email: { not: process.env.ADMIN_EMAIL } },
            ],
          };

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

      const messageMap = new Map(
        lastMessages.map((msg) => [msg.senderId, msg])
      );

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

      return getActionResponse({ data: userData });
    } catch (error) {
      return getActionResponse({ error });
    }
  }
);
