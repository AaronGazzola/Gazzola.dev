//-| Filepath: hooks/app.hooks.ts
"use client";

import { signIn, signOut, signUp } from "@/lib/auth-client";
import { useAppStore } from "@/stores/app.store";
import { AuthCredentials } from "@/types/app.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const { closeAuthModal, setUser } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      closeAuthModal();
      toast.success("Signed in successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { closeAuthModal, setUser } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.log({
        email: credentials.email,
        password: credentials.password,
        name: credentials.email.split("@")[0], // Default name from email
      });
      const result = await signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.email.split("@")[0], // Default name from email
      });
      console.log(result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      closeAuthModal();
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { reset, setUser } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      const result = await signOut();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },
    onSuccess: () => {
      setUser(null);
      reset();
      queryClient.clear();
      toast.success("Signed out successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign out");
    },
  });
};
