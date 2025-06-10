//-| Filepath: components/Sidebar.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { useContractStore } from "@/stores/contract.store";
import { MessageCircle, FileText, User, LogOut } from "lucide-react";
import { useState } from "react";
import ContractDialog from "@/component/ContractDialog";
import ProfileDialog from "@/component/ProfileDialog";
import SignOutConfirm from "@/component/SignOutConfirm";

const Sidebar = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
  } = useChatStore();
  const {
    contracts,
    setSelectedContractId,
  } = useContractStore();
  const {
    user,
    profile,
    ui,
    openContractModal,
    openProfileModal,
  } = useAppStore();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || "User";

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleContractClick = (contractId: string) => {
    setSelectedContractId(contractId);
    openContractModal(contractId);
  };

  const handleProfileClick = () => {
    openProfileModal(profile?.id);
  };

  const handleSignOutClick = () => {
    setIsSignOutDialogOpen(true);
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const sortedContracts = [...contracts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      <div className="w-80 h-full bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Gazzola.dev</h1>
          <p className="text-sm text-gray-400 mt-1">
            A web dev consultation and contract management chat app
          </p>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-medium text-gray-200">Conversations</h2>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  {sortedConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors border ${
                        selectedConversationId === conversation.id
                          ? "bg-gray-800 border-gray-600"
                          : "hover:bg-gray-800/50 border-gray-700/50"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-200 truncate">
                        {conversation.title || `Conversation ${conversation.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {conversation.messages.length} messages
                      </div>
                    </button>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-xs text-gray-500 italic p-3">
                      No conversations yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-medium text-gray-200">Contracts</h2>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  {sortedContracts.map((contract) => (
                    <button
                      key={contract.id}
                      onClick={() => handleContractClick(contract.id)}
                      className="w-full text-left p-3 rounded-lg transition-colors border border-gray-700/50 hover:bg-gray-800/50"
                    >
                      <div className="text-sm font-medium text-gray-200 truncate">
                        {contract.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${contract.price.toLocaleString()} • {contract.progressStatus.replace('_', ' ')}
                      </div>
                    </button>
                  ))}
                  {contracts.length === 0 && (
                    <p className="text-xs text-gray-500 italic p-3">
                      No contracts yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 p-3 h-auto text-gray-200 hover:bg-gray-800"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-700 text-gray-200 text-xs">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{displayName}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={handleProfileClick}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOutClick}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <ContractDialog />
      <ProfileDialog />
      <SignOutConfirm
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
      />
    </>
  );
};

export default Sidebar;
