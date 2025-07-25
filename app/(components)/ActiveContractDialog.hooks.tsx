//-| File path: app/(components)/ActiveContractDialog.hooks.tsx
"use client";

import { updateActiveContractAction } from "@/app/(components)/ActiveContractDialog.actions";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract } from "@/app/(types)/contract.types";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
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

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Active contract updated successfully"
          data-cy={DataCyAttributes.SUCCESS_ACTIVE_CONTRACT_UPDATE}
        />
      ));
    },
    onError: (error) => {
      console.error(error);
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update active contract"}
          data-cy={DataCyAttributes.ERROR_ACTIVE_CONTRACT_UPDATE}
        />
      ));
    },
  });
};
