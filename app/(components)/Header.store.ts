import { create } from "zustand";
import { HeaderState } from "./Header.types";

const initialState = {
  isExpanded: false,
  hasBeenCollapsed: false,
};

export const useHeaderStore = create<HeaderState>()((set) => ({
  ...initialState,
  setIsExpanded: (isExpanded) =>
    set((state) => ({
      isExpanded,
      hasBeenCollapsed: state.hasBeenCollapsed || !isExpanded,
    })),
  reset: () => set(initialState),
}));
