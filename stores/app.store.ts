//-| File path: stores/app.store.ts
//-| Filepath: stores/app.store.ts
import { AppState, UIState } from "@/types/app.types";
import { create } from "zustand";

const initialUIState: UIState = {
  contractModal: {
    isOpen: false,
    contractId: null,
  },
  profileModal: {
    isOpen: false,
    profileId: null,
  },
  authModal: {
    isOpen: false,
  },
};

const initialState = {
  ui: initialUIState,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  openContractModal: (contractId: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: true, contractId },
      },
    })),
  closeContractModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: false, contractId: null },
      },
    })),
  openProfileModal: (profileId?: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        profileModal: { isOpen: true, profileId: profileId || null },
      },
    })),
  closeProfileModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        profileModal: { isOpen: false, profileId: null },
      },
    })),
  openAuthModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        authModal: { isOpen: true },
      },
    })),
  closeAuthModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        authModal: { isOpen: false },
      },
    })),
  reset: () => set(initialState),
}));