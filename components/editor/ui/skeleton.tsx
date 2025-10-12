"use client";

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

function Skeleton({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const theme = useTheme()

  return (
    <div
      className={cn("animate-pulse", className)}
      style={{
        borderRadius: theme.radiusRem,
        backgroundColor: `${theme.hsl(theme.colors.primary)}1a`,
        ...style
      }}
      {...props}
    />
  )
}

export { Skeleton }
