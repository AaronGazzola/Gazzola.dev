"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:theme-bg-background group-[.toaster]:theme-text-foreground group-[.toaster]:theme-border-border group-[.toaster]:theme-shadow group-[.toaster]:theme-font-sans group-[.toaster]:theme-tracking",
          description: "group-[.toast]:theme-text-muted-foreground group-[.toast]:theme-font-sans group-[.toast]:theme-tracking",
          actionButton:
            "group-[.toast]:theme-bg-primary group-[.toast]:theme-text-primary-foreground group-[.toast]:theme-font-sans group-[.toast]:theme-tracking",
          cancelButton:
            "group-[.toast]:theme-bg-muted group-[.toast]:theme-text-muted-foreground group-[.toast]:theme-font-sans group-[.toast]:theme-tracking",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
