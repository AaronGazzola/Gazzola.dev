//-| File path: app/(components)/ContractDialog.hooks.ts
"use client";

import {
  addContractAction,
  getContractsAction,
  updateContractAction,
  contractPaymentAction,
} from "@/app/(components)/ContractDialog.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetContracts = () => {
  const { targetUser } = useChatStore();
  const { user, isAdmin } = useAuthStore();
  const { setContracts } = useContractStore();

  return useQuery({
    queryKey: ["contracts", targetUser?.id],
    queryFn: async () => {
      console.log("test2");
      const { data, error } = await getContractsAction(targetUser?.id);
      if (error) throw new Error(error);
      if (data) {
        setContracts(data);
      }
      return data;
    },
    enabled: !!user,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });
};

export const useAddContract = () => {
  const { setContracts } = useContractStore();
  const { targetUser } = useChatStore();

  return useMutation({
    mutationFn: async (contractData: ContractCreateInput) => {
      const { data, error } = await addContractAction(
        contractData,
        targetUser?.id
      );

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
  const { targetUser } = useChatStore();

  return useMutation({
    mutationFn: async ({ updates }: { updates: Partial<Contract> }) => {
      const { data, error } = await updateContractAction(
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

      toast.success("Contract updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to update contract");
    },
  });
};

export const useContractPayment = () => {
  const { setContracts } = useContractStore();
  const { targetUser } = useChatStore();

  return useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await contractPaymentAction(
        contractId,
        targetUser?.id
      );

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setContracts(data);
      }

      toast.success("Payment completed successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to complete payment");
    },
  });
};
