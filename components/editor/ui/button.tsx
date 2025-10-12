"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "border",
        secondary: "",
        ghost: "",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9",
        sm: "h-8 text-xs",
        lg: "h-10",
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
  ({ className, variant = "default", size = "default", asChild = false, style, ...props }, ref) => {
    const theme = useTheme()
    const Comp = asChild ? Slot : "button"

    const getVariantStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        borderRadius: theme.radiusRem,
      }

      switch (variant) {
        case "default":
          return {
            ...baseStyles,
            backgroundColor: theme.hsl(theme.colors.primary),
            color: theme.hsl(theme.colors.primaryForeground),
          }
        case "destructive":
          return {
            ...baseStyles,
            backgroundColor: theme.hsl(theme.colors.destructive),
            color: theme.hsl(theme.colors.destructiveForeground),
          }
        case "outline":
          return {
            ...baseStyles,
            borderColor: theme.hsl(theme.colors.input),
            backgroundColor: theme.hsl(theme.colors.background),
          }
        case "secondary":
          return {
            ...baseStyles,
            backgroundColor: theme.hsl(theme.colors.secondary),
            color: theme.hsl(theme.colors.secondaryForeground),
          }
        case "ghost":
          return {
            ...baseStyles,
          }
        case "link":
          return {
            color: theme.hsl(theme.colors.primary),
          }
        default:
          return baseStyles
      }
    }

    const getSizeStyles = (): React.CSSProperties => {
      const spacing = theme.other.spacing
      switch (size) {
        case "default":
          return {
            paddingLeft: `${spacing}rem`,
            paddingRight: `${spacing}rem`,
            paddingTop: `${spacing * 0.5}rem`,
            paddingBottom: `${spacing * 0.5}rem`,
          }
        case "sm":
          return {
            paddingLeft: `${spacing * 0.75}rem`,
            paddingRight: `${spacing * 0.75}rem`,
          }
        case "lg":
          return {
            paddingLeft: `${spacing * 2}rem`,
            paddingRight: `${spacing * 2}rem`,
          }
        case "icon":
          return {}
        default:
          return {}
      }
    }

    const shadowStyles = variant !== "ghost" && variant !== "link" ? {
      boxShadow: `${theme.other.shadow.offsetX}px ${theme.other.shadow.offsetY}px ${theme.other.shadow.blurRadius}px ${theme.other.shadow.spread}px hsl(${theme.other.shadow.color} / ${theme.other.shadow.opacity * (variant === "default" || variant === "destructive" ? 1 : 0.5)})`
    } : {}

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          gap: `${theme.other.spacing * 0.5}rem`,
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...shadowStyles,
          ...style,
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
