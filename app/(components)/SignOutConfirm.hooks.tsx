//-| File path: app/(components)/SignOutConfirm.hooks.tsx
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { useAdminStore } from "@/app/admin/admin.store";
import { Toast } from "@/components/shared/Toast";
import configuration from "@/configuration";
import { signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
  const { setUser, setProfile, setIsVerified, setIsAdmin } = useAuthStore();
  const { setUsers } = useAdminStore();
  const { reset: resetChat } = useChatStore();
  const { reset: resetContract } = useContractStore();
  const { reset: resetApp } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error, data } = await signOut();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setUser(null);
      setProfile(null);
      setIsVerified(false);
      setIsAdmin(false);
      setUsers([]);
      resetChat();
      resetContract();
      resetApp();

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed out"
          data-cy={DataCyAttributes.SUCCESS_SIGN_OUT}
        />
      ));
      router.push(configuration.paths.home);
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to sign out"}
          data-cy={DataCyAttributes.ERROR_SIGN_OUT}
        />
      ));
    },
  });
};
