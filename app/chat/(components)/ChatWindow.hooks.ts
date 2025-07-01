//-| File path: hooks/chat.hooks.ts
import { Conversation, Message } from "@/app/(types)/chat.types";
import {
  createConversationAction,
  sendMessageAction,
} from "@/app/chat/(components)/ChatWindow.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
