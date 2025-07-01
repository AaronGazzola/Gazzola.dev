//-| File path: stores/auth.store.ts
import { Profile } from "@/app/(types)/auth.types";
import { User } from "@/lib/auth";
import { create } from "zustand";

const initialState = {
  user: null,
  profile: null,
  isVerified: false,
  isAdmin: false,
};

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isVerified: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsVerified: (isVerified: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  clearAuth: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsVerified: (isVerified) => set({ isVerified }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  clearAuth: () => set(initialState),
  reset: () => set(initialState),
}));
