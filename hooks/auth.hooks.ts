//-| Filepath: hooks/auth.hooks.ts
import config from "@/configuration";
import { useAuthStore } from "@/stores/auth.store";
import {
  SignInCredentials,
  SignOutParams,
  SignUpCredentials,
  SocialSignInParams,
} from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { client, signIn, signOut, signUp, useSession } from "@/lib/auth-client";

export function useGetAuth() {
  const { data: session, isPending } = useSession();
  const { setUser, setProfile, setIsVerified, setIsAdmin, clearAuth } =
    useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        image: session.user.image || null,
        role: session.user.role || "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsVerified(session.user.emailVerified);
      const isAdmin = session.user.role === "admin";
      setIsAdmin(isAdmin);

      if (
        isAdmin &&
        pathname !== config.paths.admin &&
        !pathname.startsWith("/chat")
      )
        router.push(config.paths.admin);
    } else {
      clearAuth();
    }
  }, [
    session,
    setUser,
    setProfile,
    setIsVerified,
    setIsAdmin,
    clearAuth,
    router,
    pathname,
  ]);

  return {
    isPending,
  };
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
