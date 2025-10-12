"use client";

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

const alertVariants = cva(
  "relative w-full border text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
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
>(({ className, variant = "default", style, ...props }, ref) => {
  const theme = useTheme()

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: theme.hsl(theme.colors.card),
          color: theme.hsl(theme.colors.cardForeground),
          borderColor: theme.hsl(theme.colors.border),
        }
      case "destructive":
        return {
          borderColor: `${theme.hsl(theme.colors.destructive)}80`,
          color: theme.hsl(theme.colors.destructive),
        }
      default:
        return {}
    }
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      style={{
        borderRadius: theme.radiusRem,
        paddingLeft: `${theme.other.spacing}rem`,
        paddingRight: `${theme.other.spacing}rem`,
        paddingTop: `${theme.other.spacing * 0.75}rem`,
        paddingBottom: `${theme.other.spacing * 0.75}rem`,
        boxShadow: `${theme.other.shadow.offsetX}px ${theme.other.shadow.offsetY}px ${theme.other.shadow.blurRadius}px ${theme.other.shadow.spread}px hsl(${theme.other.shadow.color} / ${theme.other.shadow.opacity * 0.5})`,
        ...getVariantStyles(),
        ...style
      }}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme()

  return (
    <h5
      ref={ref}
      className={cn("font-medium leading-none tracking-tight", className)}
      style={{
        marginBottom: `${theme.other.spacing * 0.25}rem`,
        ...style
      }}
      {...props}
    />
  )
})
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
