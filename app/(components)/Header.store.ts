import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HeaderState } from "./Header.types";

const initialState = {
  isExpanded: true,
  hasBeenCollapsed: false,
};

export const useHeaderStore = create<HeaderState>()(
  persist(
    (set) => ({
      ...initialState,
      setIsExpanded: (isExpanded) =>
        set((state) => ({
          isExpanded,
          hasBeenCollapsed: state.hasBeenCollapsed || !isExpanded,
        })),
      reset: () => set(initialState),
    }),
    {
      name: "header-state",
    }
  )
);
