"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const theme = useTheme()

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-2 w-full grow overflow-hidden rounded-full"
        style={{ backgroundColor: theme.hsl(theme.colors.secondary) }}
      >
        <SliderPrimitive.Range
          className="absolute h-full transition-colors"
          style={{ backgroundColor: theme.hsl(theme.colors.primary) }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-5 w-5 rounded-full border-2 shadow-md transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          borderColor: theme.hsl(theme.colors.primary),
          backgroundColor: theme.hsl(theme.colors.background),
        }}
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
