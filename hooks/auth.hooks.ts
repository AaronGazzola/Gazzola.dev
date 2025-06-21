//-| Filepath: src/hooks/auth.hooks.ts
import { checkUserVerificationAction } from "@/actions/auth.actions";
import config from "@/configuration";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { client, signIn, signOut, signUp, useSession } from "@/lib/auth-client";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

interface SocialSignInParams {
  provider: "google";
  callbackURL?: string;
}

interface SignOutParams {
  redirectTo?: string;
}

export function useGetAuth() {
  const { data: session, isPending: sessionPending } = useSession();
  const { setUser, setIsVerified, setIsLoading, clearAuth } = useAuthStore();

  const {
    data: isVerified,
    isPending: verificationPending,
    refetch: refetchVerification,
  } = useQuery({
    queryKey: ["user-verification"],
    queryFn: () => checkUserVerificationAction(),
    enabled: !!session?.user,
  });

  const isLoading = sessionPending || verificationPending;

  useEffect(() => {
    setIsLoading(isLoading);

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
      });

      if (isVerified?.data !== null && isVerified?.data !== undefined) {
        setIsVerified(isVerified.data);
      }
    } else {
      clearAuth();
    }
  }, [
    session,
    isVerified,
    isLoading,
    setUser,
    setIsVerified,
    setIsLoading,
    clearAuth,
  ]);

  const resendVerificationEmail = useMutation({
    mutationFn: async () => {
      if (!session?.user?.email) {
        throw new Error("No user email found");
      }
      await client.sendVerificationEmail({
        email: session.user.email,
      });
    },
    onSuccess: () => {
      toast.success("Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification email");
    },
  });

  return {
    isLoading,
    refetchVerification,
    resendVerificationEmail,
  };
}

export function useSignInMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: SignInCredentials) => {
      return signIn.email(credentials);
    },
    onSuccess: () => {
      toast.success("Successfully logged in!");
      router.push(config.paths.home);
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
