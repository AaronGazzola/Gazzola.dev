//-| File path: app/(components)/AuthDialog.hooks.ts
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { SignInCredentials, SignUpCredentials } from "@/app/(types)/auth.types";
import { Toast } from "@/components/shared/Toast";
import { CyDataAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { signInAction, signUpAction } from "./AuthDialog.actions";

export const useSignIn = () => {
  const { setUser, setIsVerified, setIsAdmin } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      const { data, error } = await signInAction(credentials);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setUser(data);
        setIsVerified(data.emailVerified || false);
        setIsAdmin(data.role === "admin");
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed in"
          cy-data={CyDataAttributes.SUCCESS_AUTH_SIGN_IN}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to sign in"}
          cy-data={CyDataAttributes.ERROR_AUTH_SIGN_IN}
        />
      ));
    },
  });
};

export const useSignUp = () => {
  const { setUser, setIsVerified, setIsAdmin } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const { data, error } = await signUpAction(credentials);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setUser(data);
        setIsVerified(data.emailVerified || false);
        setIsAdmin(data.role === "admin");
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Account created successfully"
          cy-data={CyDataAttributes.SUCCESS_AUTH_SIGN_UP}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create account"}
          cy-data={CyDataAttributes.ERROR_AUTH_SIGN_UP}
        />
      ));
    },
  });
};
