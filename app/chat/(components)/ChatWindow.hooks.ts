//-| File path: app/chat/(components)/ChatWindow.hooks.ts
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useSendMessage } from "@/app/chat/(components)/ChatInput.hooks";
import { getConversationsAction } from "@/app/chat/(components)/ChatWindow.actions";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = () => {
  const { user } = useAuthStore();
  const {
    conversations,
    unreadMessages,
    setConversations,
    addUnreadMessages,
    currentConversation,
    setCurrentConversation,
    targetUser,
  } = useChatStore();
  const { isPending } = useSendMessage();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await getConversationsAction(targetUser?.id);
      if (error) throw new Error(error);
      if (data) {
        const existingMessageIds = new Set([
          ...conversations.flatMap((conv) =>
            conv.messages.map((msg) => msg.id)
          ),
          ...unreadMessages.map((msg) => msg.id),
        ]);

        const newMessages = data.flatMap((conv) =>
          conv.messages.filter((msg) => !existingMessageIds.has(msg.id))
        );

        if (newMessages.length) {
          const newMessageIsInCurrentConversation =
            currentConversation &&
            newMessages.some(
              (msg) => msg.conversationId === currentConversation.id
            );
          if (newMessageIsInCurrentConversation) {
            setCurrentConversation(data[0]);
          } else {
            addUnreadMessages(newMessages);
          }
        }

        setConversations(data);
      }
      return data;
    },
    enabled: !!user && !isPending,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
