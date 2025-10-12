"use client";

import * as React from "react"

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, style, ...props }, ref) => {
    const theme = useTheme()

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full border bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{
          borderRadius: theme.radiusRem,
          borderColor: theme.hsl(theme.colors.input),
          paddingLeft: `${theme.other.spacing * 0.75}rem`,
          paddingRight: `${theme.other.spacing * 0.75}rem`,
          paddingTop: `${theme.other.spacing * 0.25}rem`,
          paddingBottom: `${theme.other.spacing * 0.25}rem`,
          boxShadow: `${theme.other.shadow.offsetX}px ${theme.other.shadow.offsetY}px ${theme.other.shadow.blurRadius}px ${theme.other.shadow.spread}px hsl(${theme.other.shadow.color} / ${theme.other.shadow.opacity * 0.5})`,
          ...style
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
