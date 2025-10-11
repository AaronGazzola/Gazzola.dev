import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[calc(var(--spacing)*0.5)] whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] rounded-[var(--radius)]",
        destructive:
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)] rounded-[var(--radius)]",
        outline:
          "border border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)]",
        secondary:
          "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)] rounded-[var(--radius)]",
        ghost: "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)]",
        link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-[calc(var(--spacing)*1rem)] py-[calc(var(--spacing)*0.5rem)]",
        sm: "h-8 px-[calc(var(--spacing)*0.75rem)] text-xs rounded-[var(--radius)]",
        lg: "h-10 px-[calc(var(--spacing)*2rem)] rounded-[var(--radius)]",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          boxShadow: variant !== "ghost" && variant !== "link" ? `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) hsl(var(--shadow-color) / calc(var(--shadow-opacity) * ${variant === "default" || variant === "destructive" ? "1" : "0.5"}))` : undefined
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
