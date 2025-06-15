//-| filepath: components/Chat/ChatWindow.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatWindow } from "@/hooks/chat.hooks";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";
import { cn } from "@/lib/tailwind.utils";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { createId } from "@paralleldrive/cuid2";
import { Plus, Send } from "lucide-react";
import Conversation from "./Conversation";

const ChatWindow = () => {
  const {
    conversations,
    currentMessage,
    isLoading,
    handleSendMessage,
    handleMessageChange,
  } = useChatWindow();

  const { isAdmin, user } = useAppStore();
  const { addConversation, addMessage, setSelectedConversationId } =
    useChatStore();

  const { scrollRef } = useScrollToMessage(conversations);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewConversation = () => {
    if (!currentMessage.trim() || !user) return;

    const conversationId = createId();
    const messageId = createId();
    const now = new Date().toISOString();

    const newConversation = {
      id: conversationId,
      title: `Conversation ${conversationId.slice(0, 8)}`,
      participants: [user.id],
      messages: [],
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const newMessage = {
      id: messageId,
      senderId: user.id,
      content: currentMessage,
      createdAt: now,
    };

    addConversation(newConversation);
    addMessage(conversationId, newMessage);
    setSelectedConversationId(conversationId);
    handleMessageChange("");
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const isMessageEmpty = !currentMessage.trim();

  return (
    <div className="grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 opacity-0 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full expand">
      <div className="w-full h-full flex flex-col items-left opacity-0 fade-in-content">
        <div
          ref={scrollRef}
          className="grow scrollbar scrollbar-track scrollbar-thumb overflow-y-scroll pr-5 pt-3 space-y-2"
        >
          {sortedConversations.map((conversation) => (
            <Conversation key={conversation.id} conversation={conversation} />
          ))}
        </div>
        <div className="pt-4 pl-4 pr-4 pb-4">
          <div className="relative">
            <Textarea
              value={currentMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-h-[80px] resize-none border border-white/10 focus:border-white/40 pr-16"
            />
            <div className="absolute right-2 bottom-2 flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || isMessageEmpty}
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
              {isAdmin && (
                <Button
                  onClick={handleCreateNewConversation}
                  disabled={isLoading || isMessageEmpty}
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
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
