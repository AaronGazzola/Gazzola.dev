"use client";

import { useThemeStore } from "@/app/layout.stores";
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
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const iconClassName = iconSize === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = iconSize === "sm" ? "h-6 w-6" : "h-7 w-7";
  const containerSize = iconSize === "sm" ? "h-6 w-6" : "h-7 w-7";
  const svgSize = iconSize === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={`relative inline-block borde ${containerSize} ${className}`}
        >
          {showAnimation && (
            <div
              className={`absolute inset-0 ${containerSize} flex items-center justify-center`}
            >
              <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <svg className={svgSize} viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient
                      id="gradient-info-ping"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      {gradientEnabled ? (
                        gradientColors.map((color, colorIndex) => (
                          <stop
                            key={colorIndex}
                            offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                            stopColor={color}
                          />
                        ))
                      ) : (
                        <stop offset="0%" stopColor={singleColor} />
                      )}
                    </linearGradient>
                  </defs>
                  <Info
                    className={`${iconClassName} animate-ping`}
                    stroke="url(#gradient-info-ping)"
                    fill="none"
                  />
                </svg>
              </div>
              <div
                className="absolute inset-0 rounded-full border-2 animate-[scale-pulse_6s_ease-in-out_infinite]"
                style={{
                  borderColor: gradientEnabled
                    ? `${gradientColors[0]}80`
                    : `${singleColor}80`,
                }}
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`${buttonSize} bg-transparent hover:bg-transparent z-10 absolute inset-0`}
            style={{ borderRadius: "3px" }}
          >
            <svg className={svgSize} viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient
                  id="gradient-info-icon"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  {gradientEnabled ? (
                    gradientColors.map((color, colorIndex) => (
                      <stop
                        key={colorIndex}
                        offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                        stopColor={color}
                      />
                    ))
                  ) : (
                    <stop offset="0%" stopColor={singleColor} />
                  )}
                </linearGradient>
              </defs>
              <Info
                className={iconClassName}
                stroke="url(#gradient-info-icon)"
                fill="none"
              />
            </svg>
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
