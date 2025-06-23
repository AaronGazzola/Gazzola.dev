//-| File path: stores/auth.store.ts
import { User } from "@/generated/prisma";
import { Profile } from "@/types/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isVerified: false,
      isAdmin: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setIsVerified: (isVerified) => set({ isVerified }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      clearAuth: () =>
        set({ user: null, profile: null, isVerified: false, isAdmin: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isVerified: state.isVerified,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
