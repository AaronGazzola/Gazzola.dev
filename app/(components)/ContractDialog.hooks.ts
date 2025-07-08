//-| File path: app/(components)/ContractDialog.hooks.ts
"use client";

import {
  addContractAction,
  updateContractAction,
} from "@/app/(components)/ContractDialog.actions";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddContract = () => {
  const { setContracts } = useContractStore();

  return useMutation({
    mutationFn: async (
      contractData: ContractCreateInput
    ) => {
      const { data, error } = await addContractAction(contractData);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setContracts(data);
      }

      toast.success("Contract created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to create contract");
    },
  });
};

export const useUpdateContract = () => {
  const { setContracts } = useContractStore();

  return useMutation({
    mutationFn: async ({ updates }: { updates: Partial<Contract> }) => {
      const { data, error } = await updateContractAction(updates);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setContracts(data);
      }

      toast.success("Contract updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to update contract");
    },
  });
};
