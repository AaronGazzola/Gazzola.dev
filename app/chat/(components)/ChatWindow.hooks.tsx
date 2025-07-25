//-| File path: app/chat/(components)/ChatWindow.hooks.tsx
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useSendMessage } from "@/app/chat/(components)/ChatInput.hooks";
import { getConversationsAction } from "@/app/chat/(components)/ChatWindow.actions";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useGetConversations = () => {
  const { user, isAdmin } = useAuthStore();
  const {
    conversations,
    setConversations,
    addUnreadMessages,
    currentConversation,
    targetUser,
    setCurrentConversation,
  } = useChatStore();
  const [conversationsUpdated, setConversationsUpdated] = useState(false);
  const [prevConversations, setPrevConversations] = useState(conversations);
  const { isPending: isSendingMessage } = useSendMessage();

  useEffect(() => {
    if (!conversationsUpdated) return;

    const existingMessageIds = new Set([
      ...prevConversations.flatMap((conv) =>
        conv.messages.map((msg) => msg.id)
      ),
    ]);

    const newMessages = conversations.flatMap((conv) =>
      conv.messages.filter((msg) => !existingMessageIds.has(msg.id))
    );

    if (newMessages.length) {
      const newMessageIsInCurrentConversation =
        currentConversation &&
        newMessages.some(
          (msg) => msg.conversationId === currentConversation.id
        );
      if (!newMessageIsInCurrentConversation) addUnreadMessages(newMessages);
      if (newMessageIsInCurrentConversation)
        setCurrentConversation(conversations[0]);
    }
    setPrevConversations(conversations);
    setConversationsUpdated(false);
  }, [
    addUnreadMessages,
    conversations,
    conversationsUpdated,
    currentConversation,
    prevConversations,
    setCurrentConversation,
  ]);

  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const { data, error } = await getConversationsAction(targetUser?.id);
        if (error) throw new Error(error);
        if (data) {
          setConversationsUpdated(true);
          setConversations(data);
        }
        return data;
      } catch (error) {
        toast.custom(() => (
          <Toast
            variant="error"
            title="Error"
            message={
              error instanceof Error
                ? error.message
                : "Failed to load conversations"
            }
            data-cy={DataCyAttributes.ERROR_GET_CONVERSATIONS}
          />
        ));
        throw error;
      }
    },
    enabled: !!user && !isSendingMessage && (!isAdmin || !!targetUser),
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
