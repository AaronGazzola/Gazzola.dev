import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent shadow hover:bg-[var(--theme-primary)]/80",
        secondary:
          "border-transparent hover:bg-[var(--theme-secondary)]/80",
        destructive:
          "border-transparent shadow hover:bg-[var(--theme-destructive)]/80",
        outline: "",
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

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const variantStyles = variant === "default"
    ? { backgroundColor: "var(--theme-primary)", color: "var(--theme-primary-foreground)", borderRadius: "var(--theme-radius)", boxShadow: "var(--theme-shadow)" }
    : variant === "secondary"
    ? { backgroundColor: "var(--theme-secondary)", color: "var(--theme-secondary-foreground)", borderRadius: "var(--theme-radius)" }
    : variant === "destructive"
    ? { backgroundColor: "var(--theme-destructive)", color: "var(--theme-destructive-foreground)", borderRadius: "var(--theme-radius)", boxShadow: "var(--theme-shadow)" }
    : variant === "outline"
    ? { color: "var(--theme-foreground)", borderColor: "var(--theme-border)", borderRadius: "var(--theme-radius)" }
    : {};

  return (
    <div className={cn(badgeVariants({ variant }), className)} style={{ ...variantStyles, ...style }} {...props} />
  )
}

export { Badge, badgeVariants }
