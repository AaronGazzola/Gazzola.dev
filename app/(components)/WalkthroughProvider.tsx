"use client";

import { useWalkthroughStore } from "@/app/layout.stores";
import { walkthroughSteps } from "@/public/data/walkthrough/steps";
import { ReactNode, useEffect, useState } from "react";
import { WalkthroughConfirmDialog } from "./WalkthroughConfirmDialog";
import { WalkthroughStep } from "./WalkthroughStep";

interface WalkthroughProviderProps {
  children: ReactNode;
}

export const WalkthroughProvider = ({ children }: WalkthroughProviderProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    isActive,
    currentStepIndex,
    steps,
    nextStep,
    previousStep,
    endWalkthrough,
    startWalkthrough,
    setActiveTarget,
  } = useWalkthroughStore();

  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('walkthrough-completed');
    if (!hasSeenWalkthrough && !isActive && steps.length === 0) {
      const timer = setTimeout(() => {
        startWalkthrough(walkthroughSteps);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, steps.length, startWalkthrough]);

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleEndRequest = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmEnd = () => {
    setShowConfirmDialog(false);
    endWalkthrough();
    setActiveTarget(null);
    localStorage.setItem('walkthrough-completed', 'true');
  };

  const handleCancelEnd = () => {
    setShowConfirmDialog(false);
  };


  return (
    <>
      {children}
      {isActive && currentStep && (
        <WalkthroughStep
          step={currentStep}
          currentIndex={currentStepIndex}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onEnd={handleEndRequest}
        />
      )}
      <WalkthroughConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmEnd}
        onCancel={handleCancelEnd}
      />
    </>
  );
};
