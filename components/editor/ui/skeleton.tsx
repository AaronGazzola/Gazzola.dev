import { cn } from "@/lib/tailwind.utils"

function Skeleton({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse", className)}
      style={{
        borderRadius: "var(--theme-radius)",
        backgroundColor: "var(--theme-primary)",
        opacity: 0.1,
        ...style
      }}
      {...props}
    />
  )
}

export { Skeleton }
