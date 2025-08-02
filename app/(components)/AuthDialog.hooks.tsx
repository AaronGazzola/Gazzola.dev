//-| File path: app/(components)/AuthDialog.hooks.tsx
"use client";

import { getAppDataAction } from "@/app/(actions)/app.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { useAdminStore } from "@/app/admin/page.store";
import { Toast } from "@/components/shared/Toast";
import configuration from "@/configuration";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteAccountAction,
  signInAction,
  signUpAction,
} from "./AuthDialog.actions";

export const useSignIn = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setUsers } = useAdminStore();
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const { closeAuthModal, openOnboardingModal } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      const { data, error } = await signInAction(credentials);
      if (error) throw new Error(error);

      const appDataResult = await getAppDataAction();
      if (appDataResult.error) throw new Error(appDataResult.error);

      return appDataResult.data;
    },
    onSuccess: (data) => {
      if (data?.user)
        toast.custom(() => (
          <Toast
            variant="success"
            title="Success"
            message="Successfully signed in"
            data-cy={DataCyAttributes.SUCCESS_AUTH_SIGN_IN}
          />
        ));

      const profile = data?.profile;
      const shouldShowOnboarding =
        !profile ||
        (!profile.firstName &&
          !profile.lastName &&
          !profile.phone &&
          !profile.company &&
          !profile.avatar);

      if (shouldShowOnboarding) openOnboardingModal();

      if (data?.isAdmin) {
        setUser(data.user);
        setProfile(data.profile);
        setIsVerified(data.isVerified);
        setIsAdmin(data.isAdmin);
        closeAuthModal();
        return router.push(configuration.paths.admin);
      }

      if (data) {
        setUser(data.user);
        setProfile(data.profile);
        setIsVerified(data.isVerified);
        setIsAdmin(data.isAdmin);
        setConversations(data.conversations);
        setCurrentConversation(data.conversations[0]);
        setContracts(data.contracts);
      }

      closeAuthModal();
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to sign in"}
          data-cy={DataCyAttributes.ERROR_AUTH_SIGN_IN}
        />
      ));
    },
  });
};

export const useSignUp = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setUsers } = useAdminStore();
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const { closeAuthModal, openOnboardingModal } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const { data, error } = await signUpAction(credentials);
      if (error) throw new Error(error);

      const appDataResult = await getAppDataAction();
      if (appDataResult.error) throw new Error(appDataResult.error);

      return appDataResult.data;
    },
    onSuccess: (data) => {
      if (data) {
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
      }

      closeAuthModal();

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Account created successfully"
          data-cy={DataCyAttributes.SUCCESS_AUTH_SIGN_UP}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create account"}
          data-cy={DataCyAttributes.ERROR_AUTH_SIGN_UP}
        />
      ));
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async (email?: string) => {
      const { data, error } = await deleteAccountAction(email);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Account deleted successfully"
          data-cy={DataCyAttributes.SUCCESS_DELETE_ACCOUNT}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete account"}
          data-cy={DataCyAttributes.ERROR_DELETE_ACCOUNT}
        />
      ));
    },
  });
};
