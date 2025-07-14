//-| File path: app/(components)/EditContractDialog.hooks.ts
"use client";
import {
  addContractAction,
  contractPaymentAction,
  getContractsAction,
  updateContractAction,
} from "@/app/(components)/EditContractDialog.actions";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { toast } from "sonner";

export const useGetContracts = () => {
  const { targetUser } = useChatStore();
  const { user, isAdmin } = useAuthStore();
  const {
    setContracts,
    setContract,
    contracts,
    contract,
    setContractHasChanged,
  } = useContractStore();

  useEffect(() => {
    const currentContract = contracts.find((c) => c.id === contract?.id);
    if (currentContract?.isPaid && !isAdmin)
      return setContract(currentContract);
    const currentContractHasChanged =
      !!currentContract && !!contract && !isEqual(currentContract, contract);
    setContractHasChanged(currentContractHasChanged);
  }, [contract, contracts, setContract, setContractHasChanged, isAdmin]);

  useEffect(() => {
    if (!contract) setContractHasChanged(false);
  }, [contract, setContractHasChanged]);

  return useQuery({
    queryKey: ["contracts", targetUser?.id],
    queryFn: async () => {
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
      toast.error(error.message || "Failed to update contract");
    },
  });
};

export const useContractPayment = () => {
  return useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await contractPaymentAction(contractId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to initiate payment");
    },
  });
};
