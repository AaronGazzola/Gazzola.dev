//-| File path: app/(stores)/ui.store.ts
import { AppState, UIState } from "@/app/(types)/ui.types";
import { create } from "zustand";

const initialUIState: UIState = {
  contractModal: {
    isOpen: false,
  },
  profileModal: {
    isOpen: false,
  },
  authModal: {
    isOpen: false,
  },
  onboardingModal: {
    isOpen: false,
  },
};

const initialState = {
  ui: initialUIState,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  openContractModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: true },
      },
    })),
  closeContractModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: false, contractId: null },
      },
    })),
  openProfileModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        profileModal: { isOpen: true },
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
  openOnboardingModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        onboardingModal: { isOpen: true },
      },
    })),
  closeOnboardingModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        onboardingModal: { isOpen: false },
      },
    })),
  reset: () => set(initialState),
}));
