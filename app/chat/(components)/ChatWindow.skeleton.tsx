import { DataCyAttributes } from "@/types/cypress.types";

interface ChatWindowSkeletonProps {
  className?: string;
}

export default function ChatWindowSkeleton({
  className,
}: ChatWindowSkeletonProps) {
  return (
    <div
      className={`grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pl-4 pr-2 pt-4 max-w-[650px] h-full ${className}`}
      data-cy={DataCyAttributes.CHAT_LOADING_STATE}
    >
      <div className="w-full h-full flex flex-col items-left">
        <div className="grow pr-5 pt-3 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-1/4" />
              <div className="h-16 bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="pt-4 pl-4 pr-4 pb-4">
          <div className="h-20 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
