//-| Filepath: hooks/app.hooks.ts
"use client";

import {
  getSessionAction,
  signInAction,
  signOutAction,
  signUpAction,
} from "@/actions/app.actions";
import { useAppStore } from "@/stores/app.store";
import { AuthCredentials } from "@/types/app.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useSession = () => {
  const { setUser, setIsAuthenticated } = useAppStore();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await getSessionAction();

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setUser(data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const { closeAuthModal } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const { data, error } = await signInAction(credentials);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: () => {
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
  const { closeAuthModal } = useAppStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const { data, error } = await signUpAction(credentials);
      console.log({ data, error });
      if (error) throw error;

      return data;
    },
    onSuccess: () => {
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
  const { reset } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await signOutAction();

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: () => {
      reset();
      queryClient.clear();
      toast.success("Signed out successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign out");
    },
  });
};

export const useAuthInitialization = () => {
  const { data: user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      console.log("Auth initialized:", { user });
    }
  }, [user, isLoading]);

  return { user, isLoading };
};
