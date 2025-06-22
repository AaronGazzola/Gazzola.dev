//-| Filepath: components/Chat/ChatWindow.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useConversations,
  useCreateConversation,
  useSendMessage,
} from "@/hooks/chat.hooks";
import { useAuthStore } from "@/stores/auth.store";
import { Message } from "@/types/chat.types";
import { cn } from "@/lib/tailwind.utils";
import { format } from "date-fns";
import { Plus, Send, CircleUserRound, PersonStanding } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface ChatWindowProps {
  className?: string;
}

export default function ChatWindow({ className }: ChatWindowProps) {
  const { user } = useAuthStore();
  const params = useParams();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userId = params.userId as string;
  const conversationId = searchParams.get("conversationId");
  
  const [message, setMessage] = useState("");
  const [targetUser, setTargetUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: conversations = [], isLoading } = useConversations(userId);
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  const currentConversation = conversations.find(
    (conv) => conv.id === conversationId
  );

  const messages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation]
  );

  useEffect(() => {
    if (user && userId) {
      if (user.role === "admin") {
        setTargetUser({ id: userId, name: `User ${userId.slice(0, 8)}` });
      } else {
        setTargetUser({ id: "admin", name: "Admin" });
      }
    }
  }, [user, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !targetUser) return;

    const mostRecentConversation = conversations.length > 0 ? conversations[0] : null;

    try {
      await sendMessageMutation.mutateAsync({
        content: message.trim(),
        senderId: user.id,
        targetUserId: targetUser.id,
        conversationId: mostRecentConversation?.id,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleCreateConversation = async () => {
    if (!message.trim() || !user || !targetUser || user.role !== "admin") return;

    try {
      await createConversationMutation.mutateAsync({
        content: message.trim(),
        senderId: user.id,
        targetUserId: targetUser.id,
        title: `Conversation with ${targetUser.name}`,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return "You";
    if (user?.role === "admin") return `User ${senderId.slice(0, 8)}`;
    return "Az";
  };

  const isUser = (senderId: string) => {
    return senderId === user?.id;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className={`grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full ${className}`}>
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

  const isMessageEmpty = !message.trim();

  return (
    <div className={`grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full ${className}`}>
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
                    <div className="flex items-center">
                      {isUser(msg.senderId) ? (
                        <CircleUserRound className="stroke-[1.5px] h-5 w-5 text-gray-400" />
                      ) : (
                        <PersonStanding className="stroke-[1.5px] h-5 w-5 text-gray-400" />
                      )}
                      <h3 className="tracking-wider font-medium text-sm ml-3 text-gray-200">
                        {getSenderName(msg.senderId)}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1 pl-1">
                    <hr className="border-gray-600 mt-1 mb-2" />
                    <hr className="border-black opacity-50 absolute w-full top-[2px] -z-10" />
                  </div>
                </div>
                <div className="text-sm font-medium tracking-wider text-gray-300 pt-1 space-y-2 pl-2 whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 pl-4 pr-4 pb-4 relative">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
              className={cn(
                "min-h-[80px] resize-none border border-white/10 focus:border-white/40 pr-16"
              )}
            />
            <div className="absolute right-2 bottom-2 flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || isMessageEmpty}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isMessageEmpty
                    ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
              {user?.role === "admin" && (
                <Button
                  onClick={handleCreateConversation}
                  disabled={createConversationMutation.isPending || isMessageEmpty}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    isMessageEmpty
                      ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Create new conversation</span>
                </Button>
              )}
            </div>
          </div>
          {user?.role === "admin" && (
            <div className="text-xs text-gray-400 mt-2">
              Use the + button to create a new conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
