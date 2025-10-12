"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/tailwind.utils"
import { useTheme } from "@/app/(components)/ThemeConfiguration.hooks"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const theme = useTheme()
  const [checked, setChecked] = React.useState(props.checked || false)

  React.useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        borderRadius: `calc(${theme.radiusRem} * 0.5)`,
        borderColor: theme.hsl(theme.colors.primary),
        backgroundColor: checked ? theme.hsl(theme.colors.primary) : undefined,
        color: checked ? theme.hsl(theme.colors.primaryForeground) : undefined,
      }}
      {...props}
      onCheckedChange={(value) => {
        setChecked(value)
        props.onCheckedChange?.(value)
      }}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }