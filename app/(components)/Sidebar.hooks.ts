"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitFeedbackAction } from "./Sidebar.actions";
import { FeedbackFormData, SidebarDataAttributes } from "./Sidebar.types";

export const useSubmitFeedback = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: async (formData: FeedbackFormData) => {
      const { data, error } = await submitFeedbackAction(formData);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: () => {
      toast.success("Thanks for your feedback! I'll review it soon.", {
        duration: 5000,
        id: SidebarDataAttributes.SUCCESS_FEEDBACK_SUBMIT,
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send feedback. Please try again.", {
        duration: 5000,
        id: SidebarDataAttributes.ERROR_FEEDBACK_SUBMIT,
      });
    },
  });
};
