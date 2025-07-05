//-| File path: app/chat/(components)/ChatInput.hooks.ts
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { Conversation } from "@/app/(types)/chat.types";
import { sendMessageAction } from "@/app/chat/(components)/ChatInput.actions";
import { createId } from "@paralleldrive/cuid2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useSendMessage = () => {
  const {
    targetUser,
    conversations,
    currentConversation,
    setConversations,
    setCurrentConversation,
  } = useChatStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [originalConversations, setOriginalConversations] = useState<
    Conversation[]
  >([]);

  return useMutation({
    mutationFn: async (params: {
      messageContent: string;
      isNewConversation: boolean;
    }): Promise<Conversation[]> => {
      setOriginalConversations(conversations);

      const targetUserId = targetUser?.id;
      const currentUserId = user?.id;
      const now = new Date();

      if (!currentUserId)
        return Promise.reject(new Error("User not authenticated"));

      let optimisticConversations: Conversation[];

      if (params.isNewConversation) {
        const newConversationId = createId();
        const newMessage = {
          id: createId(),
          senderId: currentUserId,
          content: params.messageContent,
          createdAt: now,
          conversationId: newConversationId,
          files: [],
        };

        const newConversation: Conversation = {
          id: newConversationId,
          title: "New Conversation",
          participants: targetUserId
            ? [currentUserId, targetUserId]
            : [currentUserId],
          lastMessageAt: now,
          createdAt: now,
          updatedAt: now,
          messages: [newMessage],
          contracts: [],
        };

        optimisticConversations = [newConversation, ...conversations];
        setCurrentConversation(newConversation);
      } else {
        const activeConversation = currentConversation || conversations[0];

        if (!activeConversation) {
          const newConversationId = createId();
          const newMessage = {
            id: createId(),
            senderId: currentUserId,
            content: params.messageContent,
            createdAt: now,
            conversationId: newConversationId,
            files: [],
          };

          const newConversation: Conversation = {
            id: newConversationId,
            title: "New Conversation",
            participants: targetUserId
              ? [currentUserId, targetUserId]
              : [currentUserId],
            lastMessageAt: now,
            createdAt: now,
            updatedAt: now,
            messages: [newMessage],
            contracts: [],
          };

          optimisticConversations = [newConversation];
          setCurrentConversation(newConversation);
        } else {
          const newMessage = {
            id: createId(),
            senderId: currentUserId,
            content: params.messageContent,
            createdAt: now,
            conversationId: activeConversation.id,
            files: [],
          };

          const updatedConversation: Conversation = {
            ...activeConversation,
            messages: [...activeConversation.messages, newMessage],
            lastMessageAt: now,
            updatedAt: now,
          };

          optimisticConversations = conversations
            .map((conv) =>
              conv.id === activeConversation.id ? updatedConversation : conv
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime()
            );

          setCurrentConversation(updatedConversation);
        }
      }

      setConversations(optimisticConversations);

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
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      if (conversations.length) setCurrentConversation(conversations[0]);

      toast.success("Message sent successfully");
    },
    onError: (error) => {
      setConversations(originalConversations);
      toast.error(error.message || "Failed to send message");
    },
  });
};
