//-| File path: app/(stores)/contract.store.ts
import { Contract, ContractState } from "@/app/(types)/contract.types";
import { create } from "zustand";

const initialState = {
  contracts: [],
  contract: null,
};

export const useContractStore = create<ContractState>((set, get) => ({
  ...initialState,
  setContracts: (contracts: Contract[]) => set({ contracts }),
  setContract: (contract: Contract | null) => set({ contract }),
  reset: () => set(initialState),
}));
