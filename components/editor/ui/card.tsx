"use client";

import * as React from "react";

import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks";
import { cn } from "@/lib/tailwind.utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme();

  return (
    <div
      ref={ref}
      className={cn("border", className)}
      style={{
        borderRadius: `calc(${theme.radiusRem} * 2)`,
        borderColor: theme.hsl(theme.colors.border),
        backgroundColor: theme.hsl(theme.colors.card),
        color: theme.hsl(theme.colors.cardForeground),
        boxShadow: theme.shadowStyle,
        padding: `${theme.other.spacing * 1.5}rem`,
        ...style,
      }}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme();

  return (
    <div
      ref={ref}
      className={cn("flex flex-col", className)}
      style={{
        padding: `${theme.other.spacing * 1.5}rem`,
        gap: `${theme.other.spacing * 0.375}rem`,
        ...style,
      }}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme();

  return (
    <div
      ref={ref}
      className={cn("text-sm", className)}
      style={{
        color: theme.hsl(theme.colors.mutedForeground),
        ...style,
      }}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme();

  return (
    <div
      ref={ref}
      className={cn("pt-0", className)}
      style={{
        padding: `${theme.other.spacing * 1.5}rem`,
        paddingTop: 0,
        ...style,
      }}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const theme = useTheme();

  return (
    <div
      ref={ref}
      className={cn("flex items-center pt-0", className)}
      style={{
        padding: `${theme.other.spacing * 1.5}rem`,
        paddingTop: 0,
        ...style,
      }}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
