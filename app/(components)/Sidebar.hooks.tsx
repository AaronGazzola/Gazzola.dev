//-| File path: app/(components)/Sidebar.hooks.tsx
import { useAuthStore } from "@/app/(stores)/auth.store";
import { Toast } from "@/components/shared/Toast";
import { signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
