import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse theme-bg-muted theme-radius", className)}
      {...props}
    />
  );
}

export { Skeleton };
