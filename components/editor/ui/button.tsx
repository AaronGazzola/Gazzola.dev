import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 theme-radius theme-font-sans theme-tracking",
  {
    variants: {
      variant: {
        default:
          "border-2 theme-bg-primary theme-text-primary-foreground theme-border-primary theme-shadow hover:opacity-90",
        destructive:
          "border-2 theme-bg-destructive theme-text-destructive-foreground theme-border-destructive theme-shadow hover:opacity-90",
        outline:
          "border-2 theme-border-input theme-bg-background theme-text-foreground theme-shadow hover:theme-bg-accent hover:theme-text-accent-foreground",
        secondary:
          "border-2 theme-bg-secondary theme-text-secondary-foreground theme-border-secondary theme-shadow hover:opacity-80",
        ghost: "hover:theme-bg-accent hover:theme-text-accent-foreground",
        link: "theme-text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
