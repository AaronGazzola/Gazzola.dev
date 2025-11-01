"use client";

import { useWalkthroughStore } from "@/app/(editor)/layout.walkthrough.stores";
import { getBackgroundStyle, useThemeStore } from "@/app/layout.stores";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import { HelpCircle } from "lucide-react";

interface WalkthroughHelperProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showAnimation?: boolean;
  title?: string;
  description?: string;
  iconSize?: "sm" | "md";
  className?: string;
  showRestartButton?: boolean;
  asDiv?: boolean;
}

export const WalkthroughHelper = ({
  isOpen = false,
  onOpenChange,
  showAnimation = false,
  title,
  description,
  iconSize = "sm",
  className = "",
  showRestartButton = false,
  asDiv = true,
}: WalkthroughHelperProps) => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { resetWalkthrough } = useWalkthroughStore();
  const backgroundStyle = getBackgroundStyle(
    gradientColors,
    singleColor,
    gradientEnabled
  );
  const trigger = (
    <div
      role={asDiv ? "button" : undefined}
      tabIndex={asDiv ? 0 : undefined}
      className={cn(
        "h-5 w-5 rounded-full relative",
        title && description && "p-0.5"
      )}
      style={{
        ...backgroundStyle,
      }}
      onKeyDown={
        asDiv
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenChange?.(!isOpen);
              }
            }
          : undefined
      }
    >
      {showAnimation && (
        <div
          className="absolute inset-0 animate-ping rounded-full"
          style={{
            ...backgroundStyle,
          }}
        ></div>
      )}
      <HelpCircle className="h-full w-full cursor-pointer text-white" />
    </div>
  );
  if (!title && !description) return trigger;
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild={!asDiv}>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking">
        <div className="flex flex-col theme-gap-3">
          <h4 className="font-semibold text-sm theme-font-sans theme-tracking">
            {title}
          </h4>
          <p className="text-sm theme-font-sans theme-tracking">
            {description}
          </p>
          {showRestartButton && (
            <Button
              variant="outline"
              className="w-full theme-font-sans theme-tracking"
              onClick={() => {
                resetWalkthrough();
                onOpenChange?.(false);
              }}
            >
              Restart Walkthrough
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
