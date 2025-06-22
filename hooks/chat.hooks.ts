//-| Filepath: hooks/chat.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversationsAction, sendMessageAction, createConversationAction } from "@/actions/chat.actions";
import { Conversation, Message } from "@/types/chat.types";
import { ActionResponse } from "@/types/app.types";

export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async (): Promise<Conversation[]> => {
      const result = await getConversationsAction(userId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    enabled: !!userId,
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
