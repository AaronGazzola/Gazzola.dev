"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/tailwind.utils";
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks";

const badgeVariants = cva(
  "inline-flex items-center border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent",
        secondary: "border-transparent",
        destructive: "border-transparent",
        outline: "",
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

function Badge({ className, variant = "default", style, ...props }: BadgeProps) {
  const theme = useTheme()

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: theme.hsl(theme.colors.primary),
          color: theme.hsl(theme.colors.primaryForeground),
        }
      case "secondary":
        return {
          backgroundColor: theme.hsl(theme.colors.secondary),
          color: theme.hsl(theme.colors.secondaryForeground),
        }
      case "destructive":
        return {
          backgroundColor: theme.hsl(theme.colors.destructive),
          color: theme.hsl(theme.colors.destructiveForeground),
        }
      case "outline":
        return {
          color: theme.hsl(theme.colors.foreground),
        }
      default:
        return {}
    }
  }

  const shadowStyles = (variant === "default" || variant === "destructive") ? {
    boxShadow: `${theme.other.shadow.offsetX}px ${theme.other.shadow.offsetY}px ${theme.other.shadow.blurRadius}px ${theme.other.shadow.spread}px hsl(${theme.other.shadow.color} / ${theme.other.shadow.opacity * 0.5})`
  } : {}

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{
        borderRadius: theme.radiusRem,
        paddingLeft: `${theme.other.spacing * 0.625}rem`,
        paddingRight: `${theme.other.spacing * 0.625}rem`,
        paddingTop: `${theme.other.spacing * 0.125}rem`,
        paddingBottom: `${theme.other.spacing * 0.125}rem`,
        ...getVariantStyles(),
        ...shadowStyles,
        ...style
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
