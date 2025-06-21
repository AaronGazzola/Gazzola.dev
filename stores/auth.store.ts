//-| Filepath: stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isVerified: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsVerified: (isVerified: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isVerified: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setIsVerified: (isVerified) => set({ isVerified }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, isVerified: false, isLoading: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isVerified: state.isVerified,
      }),
    }
  )
);
