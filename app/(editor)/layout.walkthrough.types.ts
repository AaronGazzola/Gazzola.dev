export enum WalkthroughStep {
  INITIAL_DIALOG = "INITIAL_DIALOG",
  PLACEHOLDER = "PLACEHOLDER",
  CONFIGURATION = "CONFIGURATION",
  PREVIEW_MODE = "PREVIEW_MODE",
  DOWNLOAD = "DOWNLOAD",
  NEXT_BUTTON = "NEXT_BUTTON",
}

export interface WalkthroughState {
  isDismissed: boolean;
  completedSteps: Set<WalkthroughStep>;
  initialDialogShown: boolean;
  markStepComplete: (step: WalkthroughStep) => void;
  dismissWalkthrough: () => void;
  startWalkthrough: () => void;
  resetWalkthrough: () => void;
  isStepComplete: (step: WalkthroughStep) => boolean;
  shouldShowStep: (step: WalkthroughStep) => boolean;
  isStepOpen: (step: WalkthroughStep) => boolean;
  setStepOpen: (step: WalkthroughStep, isOpen: boolean) => void;
  openSteps: Set<WalkthroughStep>;
}
