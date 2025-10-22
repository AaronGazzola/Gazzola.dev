"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCodeReviewAction } from "./Footer.actions";
import { CodeReviewFormData, FooterDataAttributes } from "./Footer.types";

export const useSubmitCodeReview = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: async (formData: CodeReviewFormData) => {
      const { data, error } = await submitCodeReviewAction(formData);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: () => {
      toast.success("Code review request submitted successfully!", {
        duration: 5000,
        id: FooterDataAttributes.SUCCESS_CODE_REVIEW_SUBMIT,
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit code review request", {
        duration: 5000,
        id: FooterDataAttributes.ERROR_CODE_REVIEW_SUBMIT,
      });
    },
  });
};
