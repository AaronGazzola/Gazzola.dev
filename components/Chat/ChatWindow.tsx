//-\ filepath: components/Chat/ChatWindow.tsx
"use client";
import { Textarea } from "@/components/ui/textarea";
import { useChatWindow } from "@/hooks/chat.hooks";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";
import Message from "./Message";

const ChatWindow = () => {
  const {
    messages,
    currentMessage,
    isLoading,
    handleSendMessage,
    handleMessageChange,
  } = useChatWindow();

  const { scrollRef } = useScrollToMessage(messages);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  return (
    <div className="grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 opacity-0 w-full flex flex-col items-center pr-3 pt-4 max-w-[650px] h-full expand">
      <div className="w-full h-full flex flex-col items-left opacity-0 fade-in-content">
        <div
          ref={scrollRef}
          className="grow scrollbar scrollbar-track scrollbar-thumb overflow-y-scroll pr-7 sm:pr-10 pt-3"
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.senderId}
              message={message.content}
              isNew={false}
              isInitial={message.id === "init"}
            />
          ))}
        </div>
        <div className="pt-4">
          <Textarea
            value={currentMessage}
            onChange={(e) => handleMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
