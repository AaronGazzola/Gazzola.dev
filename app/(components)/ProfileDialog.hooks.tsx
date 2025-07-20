//-| File path: app/(components)/ProfileDialog.hooks.tsx
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resetProfileAction,
  updateProfileAction,
} from "./ProfileDialog.actions";

interface ProfileUpdateData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
}

export const useUpdateProfile = () => {
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      const { data, error } = await updateProfileAction(profileData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) setProfile(data);
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Profile updated successfully"
          data-cy={DataCyAttributes.SUCCESS_PROFILE_UPDATE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update profile"}
          data-cy={DataCyAttributes.ERROR_PROFILE_UPDATE}
        />
      ));
    },
  });
};

export const useResetProfile = () => {
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await resetProfileAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) setProfile(data);
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Profile reset successfully"
          data-cy={DataCyAttributes.SUCCESS_PROFILE_RESET}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to reset profile"}
          data-cy={DataCyAttributes.ERROR_PROFILE_RESET}
        />
      ));
    },
  });
};
