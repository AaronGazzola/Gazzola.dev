//-| File path: app/(components)/ProfileDialog.hooks.tsx
"use client";

import { useSignOutMutation } from "@/app/(components)/Sidebar.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resetProfileAction,
  softDeleteAccountAction,
  updateProfileAction,
} from "./ProfileDialog.actions";

interface ProfileUpdateData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
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

export const useDeleteAccount = () => {
  const signOut = useSignOutMutation();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await softDeleteAccountAction();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Account Deleted"
          message="Your account has been permanently deleted"
          data-cy={DataCyAttributes.SUCCESS_ACCOUNT_DELETE}
        />
      ));
      signOut.mutate();
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete account"}
          data-cy={DataCyAttributes.ERROR_ACCOUNT_DELETE}
        />
      ));
    },
  });
};
