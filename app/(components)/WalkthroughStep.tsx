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
  const [isPositioned, setIsPositioned] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const { isElementVisible, setActiveTarget } = useWalkthroughStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsPositioned(false);
    setTargetElement(null);
    setActiveTarget(null);

    const findAndPositionElement = () => {
      if (!isMounted) return;
      const element = document.querySelector(
        `[data-walkthrough="${step.targetDataAttribute}"]`
      );
      if (element && isElementVisible(step.targetDataAttribute)) {
        setTargetElement(element);
        setActiveTarget(step.targetDataAttribute);

        const rect = element.getBoundingClientRect();
        const stepElement = stepRef.current;
        const stepRect = stepElement?.getBoundingClientRect();
        if (stepRect) {
          let top = 0;
          let left = 0;

          const defaultOffset = 16;
          const xOffset = step.offset?.x ?? 0;
          const yOffset = step.offset?.y ?? 0;

          switch (step.position) {
            case "top":
              top = rect.top - stepRect.height - defaultOffset + yOffset;
              if (step.side === "start") {
                left = rect.left + xOffset;
              } else if (step.side === "end") {
                left = rect.right - stepRect.width + xOffset;
              } else {
                left = rect.left + (rect.width - stepRect.width) / 2 + xOffset;
              }
              break;
            case "bottom":
              top = rect.bottom + defaultOffset + yOffset;
              if (step.side === "start") {
                left = rect.left + xOffset;
              } else if (step.side === "end") {
                left = rect.right - stepRect.width + xOffset;
              } else {
                left = rect.left + (rect.width - stepRect.width) / 2 + xOffset;
              }
              break;
            case "left":
              left = rect.left - stepRect.width - defaultOffset + xOffset;
              if (step.alignment === "start") {
                top = rect.top + yOffset;
              } else if (step.alignment === "end") {
                top = rect.bottom - stepRect.height + yOffset;
              } else {
                top = rect.top + (rect.height - stepRect.height) / 2 + yOffset;
              }
              break;
            case "right":
              left = rect.right + defaultOffset + xOffset;
              if (step.alignment === "start") {
                top = rect.top + yOffset;
              } else if (step.alignment === "end") {
                top = rect.bottom - stepRect.height + yOffset;
              } else {
                top = rect.top + (rect.height - stepRect.height) / 2 + yOffset;
              }
              break;
          }

          const padding = 16;
          const maxLeft = window.innerWidth - stepRect.width - padding;
          const maxTop = window.innerHeight - stepRect.height - padding;

          left = Math.max(padding, Math.min(left, maxLeft));
          top = Math.max(padding, Math.min(top, maxTop));

          setPosition({ top, left });
          setIsPositioned(true);
        }
      } else {
        setTargetElement(null);
        setActiveTarget(null);
        setIsPositioned(false);
      }
    };

    const frameId = requestAnimationFrame(findAndPositionElement);
    window.addEventListener("resize", findAndPositionElement);
    window.addEventListener("scroll", findAndPositionElement);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", findAndPositionElement);
      window.removeEventListener("scroll", findAndPositionElement);
    };
  }, [
    step.targetDataAttribute,
    step.position,
    step.side,
    step.alignment,
    step.offset,
    isElementVisible,
    setActiveTarget,
    isMounted,
  ]);

  if (!targetElement && !isMounted) {
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
        isPositioned && "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{
        top: position.top,
        left: position.left,
        opacity: isPositioned ? 1 : 0,
        visibility: isPositioned ? "visible" : "hidden",
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
