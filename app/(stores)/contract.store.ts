//-| File path: app/(stores)/contract.store.ts
import { Contract, ContractState } from "@/app/(types)/contract.types";
import { create } from "zustand";

const initialState = {
  contracts: [],
  contract: null,
  contractHasChanged: false,
};

export const useContractStore = create<ContractState>((set, get) => ({
  ...initialState,
  setContractHasChanged: (hasChanged: boolean) =>
    set({ contractHasChanged: hasChanged }),
  setContracts: (contracts: Contract[]) => set({ contracts }),
  setContract: (contract: Contract | null) => set({ contract }),
  reset: () => set(initialState),
}));
