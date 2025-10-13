//-| File path: components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { getBackgroundStyle, useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.375rem] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-primary-foreground shadow",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "shadow-sm text-gray-300 bg-black hover:bg-black/80 font-semibold flex items-center gap-4  px-10 py-8 hover:text-accent-foreground ",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground bg-black",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isActive = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
    const backgroundStyle = getBackgroundStyle(
      gradientColors,
      singleColor,
      gradientEnabled
    );

    if (variant === "outline" || (variant === "ghost" && isActive))
      return (
        <div className="relative z-10">
          <div
            className={cn(
              "group absolute z-0",
              isActive ? "inset-0" : "-inset-[1px]"
            )}
            style={{
              borderRadius: "0.375rem",
              ...backgroundStyle,
            }}
          />
          <Comp
            className={cn(
              buttonVariants({ variant, size, className }),
              isActive && "bg-black/60",
              "relative z-10"
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
