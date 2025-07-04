//-| File path: app/chat/(components)/ChatInput.hooks.ts
"use client";

import { Conversation } from "@/app/(types)/chat.types";
import { useChatStore } from "@/app/(stores)/chat.store";
import { sendMessageAction } from "@/app/chat/(components)/ChatInput.actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendMessage = () => {
  const { targetUser, setConversations, setCurrentConversation } = useChatStore();

  return useMutation({
    mutationFn: async (params: {
      messageContent: string;
      isNewConversation: boolean;
    }): Promise<Conversation[]> => {
      const targetUserId = targetUser?.id;
      
      const result = await sendMessageAction({
        messageContent: params.messageContent,
        targetUserId,
        isNewConversation: params.isNewConversation,
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data!;
    },
    onSuccess: (conversations) => {
      setConversations(conversations);
      
      if (conversations.length > 0) {
        const latestConversation = conversations.reduce((latest, current) => 
          new Date(current.lastMessageAt) > new Date(latest.lastMessageAt) ? current : latest
        );
        setCurrentConversation(latestConversation);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};
