//-| File path: app/(hooks)/app.hooks.ts
"use client";

import { getAppDataAction } from "@/app/(actions)/app.actions";
import useParamString from "@/app/(hooks)/useParamString";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import configuration from "@/configuration";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export const useGetAppData = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin, user } =
    useAuthStore();
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const { openOnboardingModal } = useAppStore();
  const userId = useParamString("userId");
  const pathname = usePathname();
  const router = useRouter();

  return useQuery({
    queryKey: ["app-data", userId],
    queryFn: async () => {
      const { data, error } = await getAppDataAction(userId);
      if (error) throw new Error(error);
      if (!data) throw new Error("No app data received");

      if (data.isAdmin && !userId && pathname !== configuration.paths.admin) {
        router.push(configuration.paths.admin);
        return data;
      }

      setUser(data.user);
      setProfile(data.profile);
      setIsVerified(data.isVerified);
      setIsAdmin(data.isAdmin);
      if (!data.isAdmin || data.targetUser) {
        setConversations(data.conversations);
        setCurrentConversation(data.conversations[0]);
        setContracts(data.contracts);
      }
      if (data.targetUser && data.isAdmin) {
        setTargetUser(data.targetUser);
      }

      const profile = data.profile;
      const shouldShowOnboarding =
        !profile ||
        (!profile.firstName &&
          !profile.lastName &&
          !profile.phone &&
          !profile.company &&
          !profile.avatar);

      if (shouldShowOnboarding) {
        openOnboardingModal();
      }

      if (data.isAdmin && pathname === configuration.paths.home)
        router.push(configuration.paths.admin);

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};
