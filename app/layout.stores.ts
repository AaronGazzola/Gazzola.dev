import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeState } from "./layout.types";

const initialState = {
  gradientEnabled: true,
  starsEnabled: true,
  singleColor: "#3b82f6",
  gradientColors: ["#3b82f6", "#8b5cf6", "#10b981"],
  starColors: [
    "#3b82f6",
    "#5a92f7",
    "#8b5cf6",
    "#a478f7",
    "#10b981",
    "#2bc891",
  ],
  starSize: 5,
  starNumber: 15,
};

export const getBackgroundStyle = (
  gradientColors: string[],
  singleColor: string,
  gradientEnabled: boolean
) => {
  if (gradientEnabled) {
    return {
      background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
    };
  }
  return {
    background: singleColor,
  };
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...initialState,
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
