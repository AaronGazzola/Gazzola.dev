//-| Filepath: stores/app.store.ts
import { AppState, Profile, UIState, User } from "@/types/app.types";
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
  user: null,
  profile: null,
  ui: initialUIState,
  isAdmin: false,
  isAuthenticated: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
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
