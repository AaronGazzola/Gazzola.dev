import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 shadow hover:bg-[var(--theme-primary)]/90",
        destructive:
          "border-2 shadow-sm hover:bg-[var(--theme-destructive)]/90",
        outline:
          "border-2 shadow-sm hover:bg-[var(--theme-accent)]",
        secondary:
          "border-2 shadow-sm hover:bg-[var(--theme-secondary)]/80",
        ghost: "hover:bg-[var(--theme-accent)]",
        link: "underline-offset-4 hover:underline",
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
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantStyles = variant === "default"
      ? { backgroundColor: "var(--theme-primary)", color: "var(--theme-primary-foreground)", borderRadius: "var(--theme-radius)", borderColor: "var(--theme-border)", boxShadow: "var(--theme-shadow)" }
      : variant === "destructive"
      ? { backgroundColor: "var(--theme-destructive)", color: "var(--theme-destructive-foreground)", borderRadius: "var(--theme-radius)", borderColor: "var(--theme-border)", boxShadow: "var(--theme-shadow)" }
      : variant === "outline"
      ? { borderColor: "var(--theme-border)", backgroundColor: "var(--theme-background)", color: "var(--theme-foreground)", borderRadius: "var(--theme-radius)", boxShadow: "var(--theme-shadow)" }
      : variant === "secondary"
      ? { backgroundColor: "var(--theme-secondary)", color: "var(--theme-secondary-foreground)", borderRadius: "var(--theme-radius)", borderColor: "var(--theme-border)", boxShadow: "var(--theme-shadow)" }
      : variant === "ghost"
      ? { color: "var(--theme-foreground)", borderRadius: "var(--theme-radius)" }
      : variant === "link"
      ? { color: "var(--theme-primary)", borderRadius: "var(--theme-radius)" }
      : {};

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles, ...style }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
