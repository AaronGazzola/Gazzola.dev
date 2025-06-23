//-| File path: hooks/contract.hooks.ts
"use client";

import {
  getContractsAction,
  addContractAction,
  updateContractAction,
} from "@/actions/contract.actions";
import { useContractStore } from "@/stores/contract.store";
import { Contract } from "@/types/contract.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetContracts = () => {
  const { setContracts, filters } = useContractStore();

  return useQuery({
    queryKey: ["contracts", filters],
    queryFn: async () => {
      const { data, error } = await getContractsAction();

      if (error) throw new Error(error);

      if (data) {
        setContracts(data);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'profile'>) => {
      const { data, error } = await addContractAction(contractData);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["contracts"] });
      }

      toast.success("Contract created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create contract");
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Contract> }) => {
      const { data, error } = await updateContractAction(id, updates);

      if (error) throw new Error(error);

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["contracts"] });
      }

      toast.success("Contract updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update contract");
    },
  });
};
