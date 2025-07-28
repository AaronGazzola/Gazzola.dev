//-| File path: app/(components)/Sidebar.hooks.tsx
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { Toast } from "@/components/shared/Toast";
import { signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteUserContractsAction } from "@/app/(components)/Sidebar.actions";

export function useSignOutMutation() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      return signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.custom(() => (
              <Toast
                variant="success"
                title="Success"
                message="Successfully signed out"
                data-cy={DataCyAttributes.SUCCESS_SIGN_OUT}
              />
            ));
            clearAuth();
          },
          onError: (ctx) => {
            toast.custom(() => (
              <Toast
                variant="error"
                title="Error"
                message={ctx.error.message || "Failed to sign out"}
                data-cy={DataCyAttributes.ERROR_SIGN_OUT}
              />
            ));
          },
        },
      });
    },
    onError: () => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message="Failed to sign out"
          data-cy={DataCyAttributes.ERROR_SIGN_OUT}
        />
      ));
    },
  });
}

export function useDeleteUserContracts() {
  const { targetUser } = useChatStore();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await deleteUserContractsAction(userId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="User contracts deleted successfully"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete user contracts"}
        />
      ));
    },
  });
}
