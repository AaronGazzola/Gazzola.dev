//-| File path: stores/contract.store.ts
import { Contract, ContractState } from "@/app/(types)/contract.types";
import { create } from "zustand";

const initialState = {
  contracts: [],
  selectedContractId: null,
  filters: {
    searchTerm: "",
    progressStatus: [],
    refundStatus: [],
  },
};

export const useContractStore = create<ContractState>((set, get) => ({
  ...initialState,
  setContracts: (contracts: Contract[]) => set({ contracts }),
  setSelectedContractId: (id: string | null) => set({ selectedContractId: id }),
  setFilters: (filters: Partial<ContractState["filters"]>) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  addContract: (contract: Contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
    })),
  updateContract: (contractId: string, updates: Partial<Contract>) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId ? { ...contract, ...updates } : contract
      ),
    })),
  removeContract: (contractId: string) =>
    set((state) => ({
      contracts: state.contracts.filter(
        (contract) => contract.id !== contractId
      ),
      selectedContractId:
        state.selectedContractId === contractId
          ? null
          : state.selectedContractId,
    })),
  addConversationToContract: (contractId: string, conversationId: string) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              conversationIds: [...contract.conversationIds, conversationId],
            }
          : contract
      ),
    })),
  removeConversationFromContract: (
    contractId: string,
    conversationId: string
  ) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              conversationIds: contract.conversationIds.filter(
                (id) => id !== conversationId
              ),
            }
          : contract
      ),
    })),
  getContractById: (contractId: string) => {
    const { contracts } = get();
    return contracts.find((contract) => contract.id === contractId) || null;
  },
  getUserContracts: (userId: string) => {
    const { contracts } = get();
    return contracts.filter((contract) => contract.profileId === userId);
  },
  reset: () => set(initialState),
}));
