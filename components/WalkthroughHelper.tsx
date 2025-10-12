"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface WalkthroughHelperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  showAnimation: boolean;
  title: string;
  description: string;
  iconSize?: "sm" | "md";
  className?: string;
}

export const WalkthroughHelper = ({
  isOpen,
  onOpenChange,
  showAnimation,
  title,
  description,
  iconSize = "sm",
  className = "",
}: WalkthroughHelperProps) => {
  const iconClassName = iconSize === "sm" ? "h-3 w-3" : "h-4 w-4";
  const buttonSize = iconSize === "sm" ? "h-5 w-5" : "h-6 w-6";
  const containerSize = iconSize === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className={`relative inline-block ${containerSize} ${className}`}>
          {showAnimation && (
            <div className={`absolute inset-0 ${containerSize} flex items-center justify-center`}>
              <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <Info className={`${iconClassName} text-blue-500 animate-ping`} />
              </div>
              <div
                className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                style={{
                  animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  transform: "scale(1.2) translateY(2px)",
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              >
                <div
                  className="rounded-full bg-blue-500"
                  style={{
                    width: "4px",
                    height: "4px",
                    animation: "breathe 6s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`${buttonSize} bg-transparent hover:bg-transparent relative z-10`}
            style={{ borderRadius: "3px" }}
          >
            <Info className={`${iconClassName} text-blue-500`} />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
