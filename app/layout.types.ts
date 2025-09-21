export interface ThemeState {
  gradientEnabled: boolean;
  setGradientEnabled: (gradientEnabled: boolean) => void;
  starsEnabled: boolean;
  setStarsEnabled: (starsEnabled: boolean) => void;
  singleColor: string;
  setSingleColor: (singleColor: string) => void;
  gradientColors: string[];
  setGradientColors: (gradientColors: string[]) => void;
  starColors: string[];
  setStarColors: (starColors: string[]) => void;
  starSize: number;
  setStarSize: (starSize: number) => void;
  starNumber: number;
  setStarNumber: (starNumber: number) => void;
  headerIsCollapsed: boolean;
  setHeaderIsCollapsed: (headerIsCollapsed: boolean) => void;
  reset: () => void;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  targetDataAttribute: string;
  position: "top" | "bottom" | "left" | "right";
  side?: "start" | "center" | "end";
  alignment?: "start" | "center" | "end";
  offset?: { x?: number; y?: number };
  showSkip?: boolean;
  showPrevious?: boolean;
}

export interface WalkthroughState {
  isActive: boolean;
  currentStepIndex: number;
  steps: WalkthroughStep[];
  completedSteps: string[];
  activeTargetAttribute: string | null;
  startWalkthrough: (steps: WalkthroughStep[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  endWalkthrough: () => void;
  setCurrentStep: (index: number) => void;
  markStepCompleted: (stepId: string) => void;
  isElementVisible: (dataAttribute: string) => boolean;
  setActiveTarget: (dataAttribute: string | null) => void;
  isActiveTarget: (dataAttribute: string) => boolean;
  reset: () => void;
}