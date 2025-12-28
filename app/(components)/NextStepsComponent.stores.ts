import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NextStepsState {
  unlockedSteps: Set<number>;
  openStep: string;
  setUnlockedSteps: (steps: Set<number>) => void;
  setOpenStep: (step: string) => void;
  unlockStep: (stepId: number) => void;
  reset: () => void;
}

const initialState = {
  unlockedSteps: new Set([1, 2]),
  openStep: "step-1",
};

export const useNextStepsStore = create<NextStepsState>()(
  persist(
    (set) => ({
      ...initialState,
      setUnlockedSteps: (steps) => set({ unlockedSteps: steps }),
      setOpenStep: (step) => set({ openStep: step }),
      unlockStep: (stepId) =>
        set((state) => ({
          unlockedSteps: new Set([...state.unlockedSteps, stepId]),
        })),
      reset: () => set(initialState),
    }),
    {
      name: "next-steps-storage",
      partialize: (state) => ({
        unlockedSteps: Array.from(state.unlockedSteps),
        openStep: state.openStep,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          unlockedSteps?: number[];
          openStep?: string;
        };
        const persistedSteps = persisted.unlockedSteps || [1, 2];
        const ensureMinimumSteps = new Set([...persistedSteps, 1, 2]);
        return {
          ...currentState,
          unlockedSteps: ensureMinimumSteps,
          openStep: persisted.openStep || "step-1",
        };
      },
    }
  )
);
