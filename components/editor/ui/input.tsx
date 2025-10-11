import * as React from "react"

import { cn } from "@/lib/tailwind.utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-[calc(var(--spacing)*0.75rem)] py-[calc(var(--spacing)*0.25rem)] text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{
          boxShadow: `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) hsl(var(--shadow-color) / calc(var(--shadow-opacity) * 0.5))`
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
