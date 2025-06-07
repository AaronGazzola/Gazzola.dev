//-\ filepath: components/Chat/ConversationAccordion.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useConversationAccordion } from "@/hooks/chat.hooks";
import { ChevronDown, ChevronRight, MessageCircle, Plus } from "lucide-react";

const ConversationAccordion = () => {
  const {
    groupedConversations,
    selectedConversationId,
    expandedGroups,
    handleConversationSelect,
    handleGroupToggle,
    handleNewConversation,
  } = useConversationAccordion();

  return (
    <div className="h-full flex flex-col rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 opacity-0 expand">
      <div className="opacity-0 fade-in-content p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200 tracking-wider font-brand">
            Conversations
          </h2>
          <Button
            onClick={handleNewConversation}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-gray-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {Object.entries(groupedConversations).map(
            ([groupName, conversations]) => (
              <Collapsible
                key={groupName}
                open={expandedGroups.includes(groupName)}
                onOpenChange={() => handleGroupToggle(groupName)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-800/50 rounded transition-colors">
                  <span className="text-sm font-medium text-gray-300 tracking-wider">
                    {groupName} ({conversations.length})
                  </span>
                  {expandedGroups.includes(groupName) ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 ml-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation.id)}
                      className={`w-full flex items-center gap-3 p-2 text-left rounded transition-colors ${
                        selectedConversationId === conversation.id
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : "hover:bg-gray-800/30"
                      }`}
                    >
                      <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200 truncate">
                          {conversation.title ||
                            `Conversation ${conversation.id.slice(0, 8)}`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(
                            conversation.lastMessageAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationAccordion;
