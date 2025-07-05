//-| File path: app/chat/(components)/ChatWindow.hooks.ts
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { getConversationsAction } from "@/app/chat/(components)/ChatWindow.actions";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = () => {
  const { user } = useAuthStore();
  const { setConversations, setCurrentConversation } = useChatStore();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await getConversationsAction();
      if (error) throw new Error(error);
      if (data) {
        setConversations(data);
        setCurrentConversation(data[0]);
      }
      return data;
    },
    enabled: !!user,
    refetchInterval: 3000,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};
