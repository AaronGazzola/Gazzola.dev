"use client";

import { Skeleton } from "@/components/editor/ui/skeleton";

export const EditorSkeleton = () => {
  return (
    <div className="w-full h-full theme-bg-background theme-text-foreground theme-font-sans theme-shadow">
      <div className="relative h-full flex flex-col">
        <div className="border-b theme-border-border p-2 flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>

        <div className="w-full flex-1 overflow-auto p-6 space-y-4">
          <Skeleton className="h-10 w-3/4" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-8 w-2/3" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>

          <Skeleton className="h-32 w-full" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-6 w-1/2" />

          <div className="pl-6 space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
