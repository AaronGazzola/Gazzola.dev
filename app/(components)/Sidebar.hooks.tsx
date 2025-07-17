//-| File path: app/(components)/Sidebar.hooks.tsx
import { useAuthStore } from "@/app/(stores)/auth.store";
import { SignOutParams } from "@/app/(types)/auth.types";
import { Toast } from "@/components/shared/Toast";
import config from "@/configuration";
import { client, signOut } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useResendVerificationEmail = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error("No user email found");
      await client.sendVerificationEmail({
        email: user.email,
      });
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Verification email sent!"
          data-cy={DataCyAttributes.SUCCESS_RESEND_EMAIL}
        />
      ));
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to send verification email"}
          data-cy={DataCyAttributes.ERROR_RESEND_EMAIL}
        />
      ));
    },
  });
};

export function useSignOutMutation() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (params?: SignOutParams) => {
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
            router.push(params?.redirectTo || config.paths.home);
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
