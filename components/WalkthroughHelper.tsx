"use client";

import { getBackgroundStyle, useThemeStore } from "@/app/layout.stores";
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
}

export const WalkthroughHelper = ({
  isOpen = false,
  onOpenChange,
  showAnimation = false,
  title,
  description,
  iconSize = "sm",
  className = "",
}: WalkthroughHelperProps) => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const backgroundStyle = getBackgroundStyle(
    gradientColors,
    singleColor,
    gradientEnabled
  );
  const trigger = (
    <div
      className={cn(
        "h-5 w-5 rounded-full relative",
        title && description && "p-0.5"
      )}
      style={{
        ...backgroundStyle,
      }}
    >
      <div className="absolute inset-0 animate-ping"></div>
      <HelpCircle className="h-full w-full cursor-pointer text-white" />
    </div>
  );
  if (!title && !description) return trigger;
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
