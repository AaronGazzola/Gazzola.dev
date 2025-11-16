"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: "default" | "lg";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center border transition-colors disabled:cursor-not-allowed disabled:opacity-50 rounded-full theme-data-checked-bg-primary theme-data-unchecked-bg-input theme-focus-ring theme-border-primary",
      size === "default" ? "h-5 w-9" : "h-6 w-11",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block ring-0 transition-transform rounded-full theme-bg-background theme-shadow border theme-border-primary ",
        size === "default"
          ? "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          : "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    ></SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
