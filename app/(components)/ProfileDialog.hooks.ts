//-| File path: app/(components)/ProfileDialog.hooks.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/(components)/ProfileDialog.actions";

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
      if (data) {
        setProfile(data);
      }
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};
