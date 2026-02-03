"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center theme-gap-2 theme-radius text-sm font-medium transition-colors hover:theme-bg-muted hover:theme-text-muted-foreground focus-visible:outline-none focus-visible:ring-1 theme-focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:theme-bg-accent data-[state=on]:theme-text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 theme-font theme-tracking",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border theme-border-input bg-transparent theme-shadow hover:theme-bg-accent hover:theme-text-accent-foreground",
      },
      size: {
        default: "h-9 theme-px-2 min-w-9",
        sm: "h-8 theme-px-1.5 min-w-8",
        lg: "h-10 theme-px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
