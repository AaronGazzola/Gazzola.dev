//-| File path: hooks/app.hooks.ts
"use client";

import { getAppDataAction } from "@/actions/app.actions";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import { useContractStore } from "@/stores/contract.store";
import { useQuery } from "@tanstack/react-query";

export const useGetAppData = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setUsers } = useAdminStore();
  const { setConversations, setCurrentConversation, currentConversation } =
    useChatStore();
  const { setContracts } = useContractStore();

  return useQuery({
    queryKey: ["app-data"],
    queryFn: async () => {
      const { data, error } = await getAppDataAction();
      if (error) throw new Error(error);
      if (!data) throw new Error("No app data received");
      setUser(data.user);
      setProfile(data.profile);
      setIsVerified(data.isVerified);
      setIsAdmin(data.isAdmin);
      setUsers(data.users);
      setConversations(data.conversations);
      setCurrentConversation(data.conversations[0]);
      setContracts(data.contracts);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
};
