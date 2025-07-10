//-| File path: app/(components)/ActiveContractDialog.hooks.ts
"use client";

import {
  updateActiveContractAction,
} from "@/app/(components)/ActiveContractDialog.actions";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract } from "@/app/(types)/contract.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateActiveContract = () => {
  const { setContracts } = useContractStore();
  const { targetUser } = useChatStore();

  return useMutation({
    mutationFn: async ({ updates }: { updates: Partial<Contract> }) => {
      const { data, error } = await updateActiveContractAction(
        updates,
        targetUser?.id
      );

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setContracts(data);
      }

      toast.success("Active contract updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to update active contract");
    },
  });
};
