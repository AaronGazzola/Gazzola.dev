//-| File path: app/(components)/Sidebar.hooks.ts
import { useAuthStore } from "@/app/(stores)/auth.store";
import { SignOutParams } from "@/app/(types)/auth.types";
import config from "@/configuration";
import { client, signOut } from "@/lib/auth-client";
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
      toast.success("Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification email");
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
            toast.success("Successfully signed out");
            clearAuth();
            router.push(params?.redirectTo || config.paths.home);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out");
          },
        },
      });
    },
    onError: () => {
      toast.error("Failed to sign out");
    },
  });
}
