//-| File path: app/page.hooks.ts
"use client";

import useParamString from "@/app/(hooks)/useParamString";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAdminStore } from "@/app/admin/page.store";
import { getAppDataAction } from "@/app/page.actions";
import { useQuery } from "@tanstack/react-query";

export const useGetAppData = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setUsers } = useAdminStore();
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const userId = useParamString("userId");

  return useQuery({
    queryKey: ["app-data", userId],
    queryFn: async () => {
      const { data, error } = await getAppDataAction(userId);
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
      if (data.targetUser) {
        setTargetUser(data.targetUser);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
};
