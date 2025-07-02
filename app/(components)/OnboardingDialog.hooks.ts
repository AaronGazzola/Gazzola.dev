//-| File path: app/(components)/OnboardingDialog.hooks.ts
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
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
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save profile data");
    },
  });
};
