import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeState } from "./layout.types";

const initialState = {
  isDarkMode: false,
  gradientEnabled: false,
  starsEnabled: false,
  singleColor: "#3b82f6",
  gradientColors: ["#3b82f6", "#8b5cf6", "#10b981"],
  starColors: ["#ffffff", "#ffff00", "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"],
  starSize: 50,
  starNumber: 75,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...initialState,
      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
      setGradientEnabled: (gradientEnabled) => set({ gradientEnabled }),
      setStarsEnabled: (starsEnabled) => set({ starsEnabled }),
      setSingleColor: (singleColor) => set({ singleColor }),
      setGradientColors: (gradientColors) => set({ gradientColors }),
      setStarColors: (starColors) => set({ starColors }),
      setStarSize: (starSize) => set({ starSize }),
      setStarNumber: (starNumber) => set({ starNumber }),
      reset: () => set(initialState),
    }),
    {
      name: "theme-store",
    }
  )
);