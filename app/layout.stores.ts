import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeState, WalkthroughState } from "./layout.types";

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
  headerIsCollapsed: true,
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
      setHeaderIsCollapsed: (headerIsCollapsed) => set({ headerIsCollapsed }),
      reset: () => set(initialState),
    }),
    {
      name: "theme-store",
    }
  )
);

const walkthroughInitialState = {
  isActive: false,
  currentStepIndex: 0,
  steps: [],
  completedSteps: [],
};

export const useWalkthroughStore = create<WalkthroughState>()(
  persist(
    (set, get) => ({
      ...walkthroughInitialState,
      startWalkthrough: (steps) =>
        set({
          isActive: true,
          currentStepIndex: 0,
          steps,
          completedSteps: [],
        }),
      nextStep: () => {
        const { currentStepIndex, steps, completedSteps } = get();
        const currentStep = steps[currentStepIndex];
        if (currentStep) {
          const newCompletedSteps = [...completedSteps];
          if (!newCompletedSteps.includes(currentStep.id)) {
            newCompletedSteps.push(currentStep.id);
          }
          set({ completedSteps: newCompletedSteps });
        }
        if (currentStepIndex < steps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 });
        } else {
          set({ isActive: false });
        }
      },
      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },
      endWalkthrough: () => set({ isActive: false }),
      setCurrentStep: (index) => set({ currentStepIndex: index }),
      markStepCompleted: (stepId) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(stepId)) {
          set({ completedSteps: [...completedSteps, stepId] });
        }
      },
      isElementVisible: (dataAttribute) => {
        if (typeof document === "undefined") return false;
        const element = document.querySelector(`[data-walkthrough="${dataAttribute}"]`);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      reset: () => set(walkthroughInitialState),
    }),
    {
      name: "walkthrough-store",
    }
  )
);
