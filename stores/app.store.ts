//-| filepath: stores/app.store.ts
import { AppState, Profile, UIState, UserInfo } from "@/types/app.types";
import { createId } from "@paralleldrive/cuid2";
import { create } from "zustand";

const defaultUser: UserInfo = {
  id: createId(),
  email: "email@example.com",
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
};

const initialUIState: UIState = {
  contractModal: {
    isOpen: false,
    contractId: null,
  },
  profileModal: {
    isOpen: false,
    profileId: null,
  },
};

const initialState = {
  user: defaultUser,
  profile: null,
  ui: initialUIState,
  isAdmin: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  setUser: (user: UserInfo | null) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
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
  reset: () => set(initialState),
}));
