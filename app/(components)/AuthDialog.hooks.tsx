//-| File path: app/(components)/AuthDialog.hooks.tsx
"use client";

import { getAppDataAction } from "@/app/(actions)/app.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import {
  ResetPasswordCredentials,
  SignInCredentials,
  SignUpCredentials,
} from "@/app/(types)/auth.types";
import { Toast } from "@/components/shared/Toast";
import configuration from "@/configuration";
import { client, resetPassword } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import {
  deleteAccountAction,
  signInAction,
  signUpAction,
} from "./AuthDialog.actions";

export const useSignIn = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
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
  const { setConversations, setCurrentConversation, setTargetUser } =
    useChatStore();
  const { setContracts } = useContractStore();
  const { closeAuthModal, openOnboardingModal } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const { error } = await signUpAction(credentials);
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await client.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}?form=reset-password`,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Password reset email sent! Check your inbox."
          data-cy={DataCyAttributes.SUCCESS_FORGOT_PASSWORD}
        />
      ));
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to send password reset email"}
          data-cy={DataCyAttributes.ERROR_FORGOT_PASSWORD}
        />
      ));
    },
  });
};

export const useResetPassword = () => {
  const [, setForm] = useQueryState("form");

  return useMutation({
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      const { data, error } = await resetPassword({
        newPassword: credentials.password,
        token: credentials.token,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setForm("sign-in");
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Password reset successfully! You can now sign in."
          data-cy={DataCyAttributes.SUCCESS_RESET_PASSWORD}
        />
      ));
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to reset password"}
          data-cy={DataCyAttributes.ERROR_RESET_PASSWORD}
        />
      ));
    },
  });
};
