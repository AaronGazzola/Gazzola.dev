"use client";

import { useWalkthroughStore } from "@/app/layout.stores";
import { WalkthroughStep as WalkthroughStepType } from "@/app/layout.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/tailwind.utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface WalkthroughStepProps {
  step: WalkthroughStepType;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onEnd: () => void;
}

export const WalkthroughStep = ({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onPrevious,
  onEnd,
}: WalkthroughStepProps) => {
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const stepRef = useRef<HTMLDivElement>(null);
  const { isElementVisible } = useWalkthroughStore();

  useEffect(() => {
    const findAndPositionElement = () => {
      const element = document.querySelector(`[data-walkthrough="${step.targetDataAttribute}"]`);
      if (element && isElementVisible(step.targetDataAttribute)) {
        setTargetElement(element);

        const rect = element.getBoundingClientRect();
        const stepElement = stepRef.current;

        if (stepElement) {
          const stepRect = stepElement.getBoundingClientRect();
          let top = 0;
          let left = 0;

          switch (step.position) {
            case "top":
              top = rect.top - stepRect.height - 16;
              left = rect.left + (rect.width - stepRect.width) / 2;
              break;
            case "bottom":
              top = rect.bottom + 16;
              left = rect.left + (rect.width - stepRect.width) / 2;
              break;
            case "left":
              top = rect.top + (rect.height - stepRect.height) / 2;
              left = rect.left - stepRect.width - 16;
              break;
            case "right":
              top = rect.top + (rect.height - stepRect.height) / 2;
              left = rect.right + 16;
              break;
          }

          const padding = 16;
          const maxLeft = window.innerWidth - stepRect.width - padding;
          const maxTop = window.innerHeight - stepRect.height - padding;

          left = Math.max(padding, Math.min(left, maxLeft));
          top = Math.max(padding, Math.min(top, maxTop));

          setPosition({ top, left });
        }
      } else {
        setTargetElement(null);
      }
    };

    const timeoutId = setTimeout(findAndPositionElement, 100);
    window.addEventListener("resize", findAndPositionElement);
    window.addEventListener("scroll", findAndPositionElement);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", findAndPositionElement);
      window.removeEventListener("scroll", findAndPositionElement);
    };
  }, [step.targetDataAttribute, step.position, isElementVisible]);

  if (!targetElement) {
    return null;
  }

  const progress = ((currentIndex + 1) / totalSteps) * 100;
  const isLastStep = currentIndex === totalSteps - 1;
  const isFirstStep = currentIndex === 0;

  const stepContent = (
    <div
      ref={stepRef}
      className={cn(
        "fixed z-50 w-80 bg-background border rounded-lg shadow-lg p-6",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {totalSteps}
          </span>
        </div>
        {step.showSkip && (
          <Button variant="ghost" size="icon" onClick={onEnd}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Progress value={progress} className="mb-4" />

      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{step.description}</p>

      <div className="flex justify-between">
        <div>
          {step.showPrevious && !isFirstStep && (
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          )}
        </div>
        <div>
          <Button onClick={isLastStep ? onEnd : onNext}>
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(stepContent, document.body);
};