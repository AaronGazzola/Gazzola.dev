import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalkthroughStep, WalkthroughState } from "./layout.walkthrough.types";

const stepOrder = [
  WalkthroughStep.INITIAL_DIALOG,
  WalkthroughStep.PLACEHOLDER,
  WalkthroughStep.CONFIGURATION,
  WalkthroughStep.PREVIEW_MODE,
  WalkthroughStep.DOWNLOAD,
  WalkthroughStep.NEXT_BUTTON,
];

export const useWalkthroughStore = create<WalkthroughState>()(
  persist(
    (set, get) => ({
      isDismissed: false,
      completedSteps: new Set<WalkthroughStep>(),
      initialDialogShown: false,
      openSteps: new Set<WalkthroughStep>(),

      markStepComplete: (step: WalkthroughStep) => {
        set((state) => {
          const newCompletedSteps = new Set(state.completedSteps);
          newCompletedSteps.add(step);
          return { completedSteps: newCompletedSteps };
        });
      },

      dismissWalkthrough: () => {
        set({ isDismissed: true, initialDialogShown: true });
      },

      startWalkthrough: () => {
        set({ isDismissed: false, initialDialogShown: true });
      },

      resetWalkthrough: () => {
        set({
          isDismissed: false,
          completedSteps: new Set<WalkthroughStep>(),
          initialDialogShown: false,
          openSteps: new Set<WalkthroughStep>(),
        });
      },

      isStepComplete: (step: WalkthroughStep) => {
        const state = get();
        return state.completedSteps.has(step);
      },

      shouldShowStep: (step: WalkthroughStep) => {
        const state = get();

        if (state.isDismissed) {
          return false;
        }

        if (step === WalkthroughStep.INITIAL_DIALOG) {
          return !state.initialDialogShown;
        }

        const stepIndex = stepOrder.indexOf(step);
        if (stepIndex === -1) return false;

        const previousStep = stepOrder[stepIndex - 1];
        if (!previousStep) return true;

        return state.completedSteps.has(previousStep) && !state.completedSteps.has(step);
      },

      isStepOpen: (step: WalkthroughStep) => {
        const state = get();
        return state.openSteps.has(step);
      },

      setStepOpen: (step: WalkthroughStep, isOpen: boolean) => {
        set((state) => {
          const newOpenSteps = new Set(state.openSteps);
          if (isOpen) {
            newOpenSteps.add(step);
          } else {
            newOpenSteps.delete(step);
          }
          return { openSteps: newOpenSteps };
        });
      },
    }),
    {
      name: "walkthrough-storage",
      partialize: (state) => ({
        isDismissed: state.isDismissed,
        completedSteps: Array.from(state.completedSteps),
        initialDialogShown: state.initialDialogShown,
      }),
      merge: (persistedState: any, currentState): WalkthroughState => {
        const completedSteps = new Set<WalkthroughStep>(
          persistedState?.completedSteps || []
        );
        return {
          ...currentState,
          isDismissed: persistedState?.isDismissed ?? false,
          completedSteps,
          initialDialogShown: persistedState?.initialDialogShown ?? false,
        };
      },
    }
  )
);
