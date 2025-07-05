//-| File path: app/chat/(components)/ChatWindow.tsx
"use client";
import { useScrollToMessage } from "@/app/(hooks)/useScrollToMessage";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { Message } from "@/app/(types)/chat.types";
import { useGetAppData } from "@/app/app.hooks";
import ChatInput from "@/app/chat/(components)/ChatInput";
import { useGetConversations } from "@/app/chat/(components)/ChatWindow.hooks";
import { cn } from "@/lib/tailwind.utils";
import { format } from "date-fns";
import { CircleUserRound, PersonStanding } from "lucide-react";
import { useMemo } from "react";

interface ChatWindowProps {
  className?: string;
}

export default function ChatWindow({ className }: ChatWindowProps) {
  const { user } = useAuthStore();
  const { currentConversation, targetUser } = useChatStore();

  const { isLoading } = useGetAppData();
  useGetConversations();

  const messages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation]
  );

  const messagesEndRef = useScrollToMessage(messages);

  const isUser = (senderId: string) => {
    return senderId === user?.id;
  };

  if (isLoading) {
    return (
      <div
        className={`grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full ${className}`}
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
  return (
    <div
      className={`grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full ${className}`}
    >
      <div className="w-full h-full flex flex-col items-left">
        {targetUser && (
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-gray-100 tracking-wider">
              Chat with {targetUser.name}
            </h2>
          </div>
        )}

        <div className="grow scrollbar scrollbar-track scrollbar-thumb overflow-y-scroll pr-5 pt-3 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8 italic">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg: Message) => (
              <div key={msg.id} className="w-full py-3 pl-7">
                <div className="w-full">
                  <div className="flex items-center pl-1">
                    <div
                      className={cn(
                        "flex items-center gap-3 pl-1 pr-2",
                        !isUser(msg.senderId) && "w-full flex-row-reverse"
                      )}
                    >
                      {!isUser(msg.senderId) ? (
                        <PersonStanding className="stroke-[1.5px] h-5 w-5 text-gray-400" />
                      ) : (
                        <CircleUserRound className="stroke-[1.5px] h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                      </span>
                      <h3 className="tracking-wider font-medium text-sm text-gray-200">
                        {isUser(msg.senderId)
                          ? user?.name
                          : targetUser?.name || "Az Anything"}
                      </h3>
                    </div>
                  </div>
                  <div className="relative pt-1 pl-1">
                    <hr className="border-gray-600 mt-1 mb-2" />
                    <hr className="border-black opacity-50 absolute w-full top-[2px] -z-10" />
                  </div>
                </div>
                <div
                  className={cn(
                    "font-medium tracking-wider text-gray-300 pt-1 space-y-2 py-2 px-3 pb-3 whitespace-pre-wrap bg-black/40 rounded",
                    !isUser(msg.senderId) && "text-right"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput />
      </div>
    </div>
  );
}
