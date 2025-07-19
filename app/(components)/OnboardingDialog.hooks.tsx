//-| File path: app/(components)/OnboardingDialog.hooks.tsx
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { Toast } from "@/components/shared/Toast";
import { client } from "@/lib/auth-client";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveOnboardingDataAction } from "./OnboardingDialog.actions";

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  avatar: string;
}

export const useSaveOnboardingData = () => {
  const { setProfile, profile } = useAuthStore();

  return useMutation({
    mutationFn: async (formData: OnboardingData) => {
      const { data, error } = await saveOnboardingDataAction(formData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data && profile) setProfile({ ...profile, ...data });
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Profile updated successfully"
          data-cy={DataCyAttributes.SUCCESS_ONBOARDING_SAVE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to save profile data"}
          data-cy={DataCyAttributes.ERROR_ONBOARDING_SAVE}
        />
      ));
    },
  });
};

export const useResendVerificationEmail = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error("No user email found");
      const { data, error } = await client.sendVerificationEmail({
        email: user.email,
      });
      if (error) throw error;
      return data;
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
