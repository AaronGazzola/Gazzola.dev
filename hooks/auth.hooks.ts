//-| File path: hooks/auth.hooks.ts
import config from "@/configuration";
import { useAuthStore } from "@/stores/auth.store";
import {
  SignInCredentials,
  SignOutParams,
  SignUpCredentials,
  SocialSignInParams,
} from "@/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getAuthAction } from "@/actions/auth.actions";
import { client, signIn, signOut, signUp } from "@/lib/auth-client";

export function useGetAuth() {
  const { setUser, setIsVerified, setIsAdmin, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data, error } = await getAuthAction();

      if (error) {
        clearAuth();
        throw new Error(error);
      }

      if (!data || !data.user) {
        clearAuth();
        return null;
      }
      setUser(data.user);
      setIsVerified(data.isVerified);
      setIsAdmin(data.isAdmin);

      if (
        data.isAdmin &&
        pathname !== config.paths.admin &&
        !pathname.startsWith("/chat")
      ) {
        router.push(config.paths.admin);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

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

export function useSignInMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: SignInCredentials) => {
      return signIn.email(credentials);
    },
    onSuccess: () => {
      toast.success("Successfully logged in!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log in");
    },
  });
}

export function useSignUpMutation(onNext: () => void) {
  return useMutation({
    mutationFn: (credentials: SignUpCredentials) => {
      return signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || credentials.email.split("@")[0],
      });
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      onNext();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });
}

export function useSocialSignInMutation() {
  return useMutation({
    mutationFn: async (params: SocialSignInParams) => {
      await signIn.social({
        provider: params.provider,
        callbackURL: params.callbackURL || config.paths.home,
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in with Google");
    },
  });
}

export function useSocialSignUpMutation() {
  return useMutation({
    mutationFn: async (params: SocialSignInParams) => {
      const result = await signIn.social({
        provider: params.provider,
        callbackURL: params.callbackURL || config.paths.home,
      });
      return result;
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign up with Google");
    },
  });
}

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
