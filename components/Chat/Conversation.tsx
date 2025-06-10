"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useChatStore } from "@/stores/chat.store";
import { Conversation as ConversationType } from "@/types/chat.types";
import { ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import Message from "./Message";

interface ConversationProps {
  conversation: ConversationType;
}

const Conversation = ({ conversation }: ConversationProps) => {
  const { selectedConversationId, setSelectedConversationId } = useChatStore();

  const isExpanded = selectedConversationId === conversation.id;

  const sortedMessages = [...conversation.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleToggle = () => {
    setSelectedConversationId(isExpanded ? null : conversation.id);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={handleToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-800/50 rounded transition-colors border border-gray-700/50">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-200 truncate tracking-wider">
              {conversation.title ||
                `Conversation ${conversation.id.slice(0, 8)}`}
            </div>
            <div className="text-xs text-gray-400">
              {conversation.messages.length} messages
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {sortedMessages.map((message) => (
          <Message
            key={message.id}
            role={message.senderId}
            message={message.content}
            date={new Date(message.createdAt).toLocaleString()}
            isNew={false}
            isInitial={message.id === "init"}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Conversation;
