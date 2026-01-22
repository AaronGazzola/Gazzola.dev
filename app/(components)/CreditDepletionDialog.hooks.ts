"use client";

import { useMutation } from "@tanstack/react-query";
import { sendCreditDepletionNotificationAction } from "./CreditDepletionDialog.actions";
import { CreditDepletionNotificationData } from "./CreditDepletionDialog.types";

export const useSendCreditDepletionNotification = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: async (data: CreditDepletionNotificationData) => {
      const { data: result, error } =
        await sendCreditDepletionNotificationAction(data);

      if (error) throw new Error(error);

      return result;
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      console.error("Failed to send credit depletion notification:", error);
    },
  });
};
