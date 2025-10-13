import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 theme-radius theme-border-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent theme-bg-primary theme-text-primary-foreground theme-shadow hover:opacity-80",
        secondary:
          "border-transparent theme-bg-secondary theme-text-secondary-foreground hover:opacity-80",
        destructive:
          "border-transparent theme-bg-destructive theme-text-destructive-foreground theme-shadow hover:opacity-80",
        outline: "theme-text-foreground theme-border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
