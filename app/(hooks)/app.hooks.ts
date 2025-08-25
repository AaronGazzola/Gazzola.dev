//-| File path: app/(hooks)/app.hooks.ts
"use client";

import { getAppDataAction } from "@/app/(actions)/app.actions";
import useIsTest from "@/app/(hooks)/useIsTest";
import useParamString from "@/app/(hooks)/useParamString";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import configuration from "@/configuration";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export const useGetAppData = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const { openOnboardingModal } = useAppStore();
  const targetUserId = useParamString("userId");
  const pathname = usePathname();
  const router = useRouter();
  const isTest = useIsTest();

  const query = useQuery({
    queryKey: ["app-data", targetUserId],
    queryFn: async () => {
      const { data, error } = await getAppDataAction(targetUserId);
      if (error) throw new Error(error);
      if (!data) throw new Error("No app data received");

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

      // Handle routing logic
      const isAdminRoute =
        pathname.startsWith(configuration.paths.admin) ||
        pathname.startsWith("/chat");
      const isHome = pathname === "/";

      // Redirect non-admin users away from admin routes (unless on home)
      if (
        isAdminRoute &&
        (!data.isVerified || data.user?.role !== "admin") &&
        !isHome
      ) {
        router.push(configuration.paths.home);
        return data;
      }

      // Redirect admin users to admin area if not already there
      if (
        !isAdminRoute &&
        data.user?.role === "admin" &&
        data.isVerified &&
        !pathname.startsWith(configuration.paths.test)
      ) {
        router.push(configuration.paths.admin);
        return data;
      }

      // Handle test route restrictions
      if (pathname.startsWith(configuration.paths.test) && !isTest) {
        router.push(configuration.paths.home);
        return data;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  return query;
};
