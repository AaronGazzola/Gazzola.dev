//-| File path: app/(components)/EditContractDialog.hooks.tsx
"use client";
import {
  addContractAction,
  contractPaymentAction,
  getContractsAction,
  updateContractAction,
} from "@/app/(components)/EditContractDialog.actions";
import useIsTest from "@/app/(hooks)/useIsTest";
import useParamString from "@/app/(hooks)/useParamString";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { Contract, ContractCreateInput } from "@/app/(types)/contract.types";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
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
  const userId = useParamString("userId");

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
    enabled: !!user && (!isAdmin || !!targetUser),
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
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Contract created successfully"
          data-cy={DataCyAttributes.SUCCESS_CONTRACT_CREATE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to create contract"}
          data-cy={DataCyAttributes.ERROR_CONTRACT_CREATE}
        />
      ));
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
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Contract updated successfully"
          data-cy={DataCyAttributes.SUCCESS_CONTRACT_UPDATE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update contract"}
          data-cy={DataCyAttributes.ERROR_CONTRACT_UPDATE}
        />
      ));
    },
  });
};

export const useContractPayment = () => {
  const isTest = useIsTest();
  const { setContracts, contracts, setContract, contract } = useContractStore();

  return useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await contractPaymentAction(contractId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, contractId) => {
      if (isTest) {
        const updatedContracts = contracts.map((contract) =>
          contract.id === contractId ? { ...contract, isPaid: true } : contract
        );
        setContracts(updatedContracts);
        if (contract) setContract({ ...contract, isPaid: true });
        return;
      } else if (data?.url) {
        window.location.href = data.url;
      }

      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Payment initiated successfully"
          data-cy={DataCyAttributes.SUCCESS_CONTRACT_PAYMENT}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to initiate payment"}
          data-cy={DataCyAttributes.ERROR_CONTRACT_PAYMENT}
        />
      ));
    },
  });
};
