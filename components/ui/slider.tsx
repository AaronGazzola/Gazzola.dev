"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/tailwind.utils";
import { useThemeStore } from "@/app/layout.stores";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, disabled, ...props }, ref) => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();

  const getBackgroundStyle = () => {
    if (gradientEnabled) {
      return {
        background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
      };
    }
    return {
      background: singleColor,
    };
  };

  return (
    <div
      className={cn(
        "h-1.5 w-full relative rounded-full",
        disabled && "opacity-50"
      )}
      style={getBackgroundStyle()}
    >
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "flex w-full touch-none select-none items-center absolute inset-[1px] pr-[2px]",
          className
        )}
        disabled={disabled}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-full bg-background">
          <SliderPrimitive.Range 
            className="absolute h-full rounded-full"
            style={getBackgroundStyle()}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className="block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative"
          style={getBackgroundStyle()}
        >
          <div className="pointer-events-none block rounded-full bg-background shadow-lg ring-0 absolute inset-[1px]" />
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
