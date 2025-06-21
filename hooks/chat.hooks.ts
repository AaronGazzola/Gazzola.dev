//-| File path: hooks/chat.hooks.ts
"use client";
import { useSession } from "@/lib/auth-client";
import { useChatStore } from "@/stores/chat.store";
import { Message } from "@/types/chat.types";
import { createId } from "@paralleldrive/cuid2";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getConversationsAction, sendMessageAction, createConversationAction } from "@/actions/chat.actions";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export const useGetConversations = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { isAdmin } = useAuthStore();
  const params = useParams();
  const userId = params?.userId as string;
  const { setConversations } = useChatStore();

  const targetUserId = isAdmin && userId ? userId : user?.id;

  return useQuery({
    queryKey: ["conversations", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];

      const { data, error } = await getConversationsAction(targetUserId);

      if (error) throw new Error(error);

      if (data) {
        setConversations(data);
      }

      return data || [];
    },
    refetchInterval: 3000,
    staleTime: 1000,
    enabled: !!targetUserId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;
  const { isAdmin } = useAuthStore();
  const params = useParams();
  const userId = params?.userId as string;
  const { conversations, addMessage } = useChatStore();

  const targetUserId = isAdmin && userId ? userId : user?.id;

  return useMutation({
    mutationFn: async ({ content, conversationId }: { content: string; conversationId?: string }) => {
      if (!user || !targetUserId) throw new Error("User not authenticated");

      const { data, error } = await sendMessageAction({
        content: content.trim(),
        senderId: user.id,
        targetUserId,
        conversationId,
      });

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        addMessage(data.conversationId, data);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations", targetUserId] });
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;
  const { isAdmin } = useAuthStore();
  const params = useParams();
  const userId = params?.userId as string;
  const { addConversation, setSelectedConversationId } = useChatStore();

  const targetUserId = isAdmin && userId ? userId : user?.id;

  return useMutation({
    mutationFn: async ({ content, title }: { content: string; title?: string }) => {
      if (!user || !targetUserId) throw new Error("User not authenticated");

      const { data, error } = await createConversationAction({
        content: content.trim(),
        senderId: user.id,
        targetUserId,
        title,
      });

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        addConversation(data.conversation);
        setSelectedConversationId(data.conversation.id);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations", targetUserId] });
      toast.success("Conversation created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
};

export const useChatWindow = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { isAdmin } = useAuthStore();
  const params = useParams();
  const userId = params?.userId as string;
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
  } = useChatStore();

  const [currentMessage, setCurrentMessage] = useState("");
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  const targetUserId = isAdmin && userId ? userId : user?.id;

  useGetConversations();

  const handleMessageChange = useCallback((value: string) => {
    setCurrentMessage(value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !user) return;

    let conversationId = selectedConversationId;

    if (!conversationId) {
      const userConversations = conversations.filter((conv) =>
        conv.participants.includes(targetUserId || "")
      );

      if (userConversations.length > 0) {
        const latestConversation = userConversations.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        )[0];
        conversationId = latestConversation.id;
        setSelectedConversationId(conversationId);
      }
    }

    try {
      await sendMessageMutation.mutateAsync({
        content: currentMessage,
        conversationId: conversationId || undefined,
      });
      setCurrentMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [
    currentMessage,
    user,
    selectedConversationId,
    conversations,
    targetUserId,
    sendMessageMutation,
    setSelectedConversationId,
  ]);

  const handleCreateNewConversation = useCallback(async () => {
    if (!currentMessage.trim() || !user || !isAdmin) return;

    try {
      await createConversationMutation.mutateAsync({
        content: currentMessage,
        title: `Conversation ${createId().slice(0, 8)}`,
      });
      setCurrentMessage("");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  }, [currentMessage, user, isAdmin, createConversationMutation]);

  return {
    conversations,
    currentMessage,
    isLoading: sendMessageMutation.isPending || createConversationMutation.isPending,
    handleSendMessage,
    handleMessageChange,
    handleCreateNewConversation,
  };
};

export const useConversationAccordion = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { isAdmin } = useAuthStore();
  const params = useParams();
  const userId = params?.userId as string;
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
  } = useChatStore();

  const [groupedConversations, setGroupedConversations] = useState<
    Record<string, any[]>
  >({});

  const targetUserId = isAdmin && userId ? userId : user?.id;

  useEffect(() => {
    const userConversations = conversations.filter((conv) =>
      conv.participants.includes(targetUserId || "")
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
  }, [conversations, targetUserId]);

  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      setSelectedConversationId(conversationId);
    },
    [setSelectedConversationId]
  );

  const handleNewConversation = useCallback(() => {
    if (!user) return;

    setSelectedConversationId(null);
  }, [user, setSelectedConversationId]);

  return {
    groupedConversations,
    selectedConversationId,
    handleConversationSelect,
    handleNewConversation,
  };
};
