import { cn } from "@/lib/tailwind.utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius)] bg-[hsl(var(--primary)/0.1)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
