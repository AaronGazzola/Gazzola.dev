import * as React from "react"

import { cn } from "@/lib/tailwind.utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, style, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full border-2 bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        borderRadius: "var(--theme-radius)",
        borderColor: "var(--theme-input)",
        color: "var(--theme-foreground)",
        boxShadow: "var(--theme-shadow)",
        padding: "calc(var(--theme-spacing) * 2)",
        ...style
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
