//-| File path: hooks/chat.hooks.ts
import {
  createConversationAction,
  getConversationsAction,
  sendMessageAction,
} from "@/actions/chat.actions";
import { useAdminStore } from "@/app/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import { Conversation, Message } from "@/types/chat.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useConversations = () => {
  const { user, isAdmin } = useAuthStore();
  const { users } = useAdminStore();
  const { setTargetUser } = useChatStore();
  const params = useParams();
  const userId = params.userId as string;
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async (): Promise<Conversation[]> => {
      const result = await getConversationsAction(userId);
      if (result.error) {
        throw new Error(result.error);
      }
      if (isAdmin && userId && users.length > 0) {
        const foundUser = users.find((u) => u.id === userId);
        setTargetUser(foundUser || null);
      } else if (!isAdmin && user) {
        // TODO: add an action to get the admin user data
        setTargetUser({
          ...user,
          createdAt: user.createdAt,
        });
      }
      return result.data || [];
    },
    enabled: !!user && !!((isAdmin && userId && users.length) || !isAdmin),
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      content: string;
      senderId: string;
      targetUserId: string;
      conversationId?: string;
    }): Promise<Message> => {
      const result = await sendMessageAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data!;
    },
    onSuccess: (message, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.senderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.targetUserId],
      });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      content: string;
      senderId: string;
      targetUserId: string;
      title?: string;
    }): Promise<{ conversation: Conversation; message: Message }> => {
      const result = await createConversationAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data!;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.senderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.targetUserId],
      });
    },
  });
};
