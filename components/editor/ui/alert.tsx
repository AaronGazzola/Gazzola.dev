import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"

const alertVariants = cva(
  "relative w-full rounded-[var(--radius)] border border-[hsl(var(--border))] px-[calc(var(--spacing)*1rem)] py-[calc(var(--spacing)*0.75rem)] text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-[calc(var(--spacing)*1rem)] [&>svg]:top-[calc(var(--spacing)*1rem)] [&>svg]:text-[hsl(var(--card-foreground))] [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
        destructive:
          "border-[hsl(var(--destructive)/0.5)] text-[hsl(var(--destructive))] dark:border-[hsl(var(--destructive))] [&>svg]:text-[hsl(var(--destructive))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    style={{
      boxShadow: `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) hsl(var(--shadow-color) / calc(var(--shadow-opacity) * 0.5))`
    }}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-[calc(var(--spacing)*0.25rem)] font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
