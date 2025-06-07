//-| filepath: hooks/chat.hooks.ts
"use client";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { Message } from "@/types/chat.types";
import { createId } from "@paralleldrive/cuid2";
import { useCallback, useEffect, useState } from "react";

export const useChatWindow = () => {
  const { user } = useAppStore();
  const {
    conversations,
    selectedConversationId,
    getConversationMessages,
    addMessage,
    addConversation,
    setSelectedConversationId,
  } = useChatStore();

  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messages = selectedConversationId
    ? getConversationMessages(selectedConversationId)
    : [];

  const handleMessageChange = useCallback((value: string) => {
    setCurrentMessage(value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !user) return;

    setIsLoading(true);

    try {
      let conversationId = selectedConversationId;

      if (!conversationId) {
        const userConversations = conversations.filter((conv) =>
          conv.participants.includes(user.id)
        );

        if (userConversations.length > 0) {
          const latestConversation = userConversations.sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          )[0];
          conversationId = latestConversation.id;
          setSelectedConversationId(conversationId);
        } else {
          const newConversation = {
            id: createId(),
            title: "New Conversation",
            participants: [user.id],
            lastMessageAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addConversation(newConversation);
          conversationId = newConversation.id;
          setSelectedConversationId(conversationId);
        }
      }

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: conversationId!,
        senderId: user.id,
        content: currentMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      addMessage(newMessage);
      setCurrentMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentMessage,
    user,
    selectedConversationId,
    conversations,
    addMessage,
    addConversation,
    setSelectedConversationId,
  ]);

  return {
    messages,
    currentMessage,
    isLoading,
    handleSendMessage,
    handleMessageChange,
  };
};

export const useConversationAccordion = () => {
  const { user } = useAppStore();
  const {
    conversations,
    selectedConversationId,
    expandedGroups,
    setSelectedConversationId,
    setExpandedGroups,
    addConversation,
  } = useChatStore();

  const [groupedConversations, setGroupedConversations] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    const userConversations = conversations.filter((conv) =>
      conv.participants.includes(user?.id || "")
    );

    const grouped = userConversations.reduce((acc, conversation) => {
      const date = new Date(conversation.lastMessageAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupName: string;
      if (date.toDateString() === today.toDateString()) {
        groupName = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupName = "Yesterday";
      } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        groupName = "This Week";
      } else if (date.getTime() > today.getTime() - 30 * 24 * 60 * 60 * 1000) {
        groupName = "This Month";
      } else {
        groupName = "Older";
      }

      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(conversation);
      return acc;
    }, {} as Record<string, any[]>);

    Object.keys(grouped).forEach((groupName) => {
      grouped[groupName].sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      );
    });

    setGroupedConversations(grouped);
  }, [conversations, user]);

  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      setSelectedConversationId(conversationId);
    },
    [setSelectedConversationId]
  );

  const handleGroupToggle = useCallback(
    (groupName: string) => {
      setExpandedGroups(
        expandedGroups.includes(groupName)
          ? expandedGroups.filter((g) => g !== groupName)
          : [...expandedGroups, groupName]
      );
    },
    [expandedGroups, setExpandedGroups]
  );

  const handleNewConversation = useCallback(() => {
    if (!user) return;

    const newConversation = {
      id: createId(),
      title: "New Conversation",
      participants: [user.id],
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addConversation(newConversation);
    setSelectedConversationId(newConversation.id);
  }, [user, addConversation, setSelectedConversationId]);

  return {
    groupedConversations,
    selectedConversationId,
    expandedGroups,
    handleConversationSelect,
    handleGroupToggle,
    handleNewConversation,
  };
};
