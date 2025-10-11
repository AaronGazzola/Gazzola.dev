import * as React from "react"

import { cn } from "@/lib/tailwind.utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-[calc(var(--spacing)*0.75rem)] py-[calc(var(--spacing)*0.5rem)] text-base placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        boxShadow: `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) hsl(var(--shadow-color) / calc(var(--shadow-opacity) * 0.5))`
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
