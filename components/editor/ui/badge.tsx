//-| File path: components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/tailwind.utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius)] border px-[calc(var(--spacing)*0.625rem)] py-[calc(var(--spacing)*0.125rem)] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.8)]",
        secondary:
          "border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]",
        destructive:
          "border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.8)]",
        outline: "text-[hsl(var(--foreground))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{
        boxShadow: (variant === "default" || variant === "destructive") ? `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) hsl(var(--shadow-color) / calc(var(--shadow-opacity) * 0.5))` : undefined
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
