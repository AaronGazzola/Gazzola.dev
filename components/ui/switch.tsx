//-| File path: components/ui/switch.tsx
"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/tailwind.utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-5 w-9 relative ",
      className
    )}
    style={{
      borderRadius: "1.25rem",
    }}
  >
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:via-purple-500 data-[state=checked]:to-green-500 data-[state=unchecked]:bg-background absolute inset-[1px]"
      )}
      style={{
        borderRadius: "1.25rem",
      }}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-blue-500 data-[state=unchecked]:via-purple-500 data-[state=unchecked]:to-green-500 data-[state=checked]:bg-black h-4 w-4 relative transform transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          className
        )}
        style={{
          borderRadius: "100%",
        }}
      >
        <div
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 absolute inset-[1px]"
          )}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
