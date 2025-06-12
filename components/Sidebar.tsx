"use client";

import ContractDialog from "@/component/ContractDialog";
import ProfileDialog from "@/component/ProfileDialog";
import SignOutConfirm from "@/component/SignOutConfirm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { useContractStore } from "@/stores/contract.store";
import { FileText, LogOut, Menu, MessageCircle, User } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const { conversations, selectedConversationId, setSelectedConversationId } =
    useChatStore();
  const { contracts, setSelectedContractId } = useContractStore();
  const { user, profile, openContractModal, openProfileModal } = useAppStore();
  const { open, isMobile, toggleSidebar } = useSidebar();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || "User";

  const isExpanded = isMobile || open;

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
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const sortedContracts = [...contracts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      <ShadcnSidebar collapsible="icon" className="border-r-gray-800">
        <SidebarContent className="h-full bg-transparent border-gray-700 overflow-x-hidden gap-0">
          <SidebarHeader
            className={cn(isExpanded && "p-6", "border-b border-gray-700")}
          >
            <div
              className={cn(
                "flex items-center",
                isExpanded ? "justify-between" : "justify-center"
              )}
            >
              {isExpanded && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">
                      Gazzola.dev
                    </h1>
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white hover:bg-gray-800"
                        onClick={toggleSidebar}
                      >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Sidebar</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-white font-medium mt-1">
                    Aaron Gazzola&apos;s web development consultation chat app
                  </p>
                </div>
              )}
            </div>
            {!isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-gray-800"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}
          </SidebarHeader>

          {isExpanded && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 space-y-6">
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-100" />
                      <span className="text-sm font-medium text-gray-100">
                        Conversations
                      </span>
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-1">
                        {sortedConversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() =>
                              handleConversationClick(conversation.id)
                            }
                            className={`w-full text-left p-3 rounded-lg transition-colors border ${
                              selectedConversationId === conversation.id
                                ? "bg-gray-800 border-gray-600"
                                : "hover:bg-gray-800/50 border-gray-700/50"
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-100 truncate">
                              {conversation.title ||
                                `Conversation ${conversation.id.slice(0, 8)}`}
                            </div>
                            <div className="text-xs text-gray-100">
                              {conversation.messages.length} messages
                            </div>
                          </button>
                        ))}
                        {conversations.length === 0 && (
                          <p className="text-xs text-gray-200 font-medium italic p-3">
                            No conversations yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-100" />
                      <span className="text-sm font-medium text-gray-100">
                        Contracts
                      </span>
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-1">
                        {sortedContracts.map((contract) => (
                          <button
                            key={contract.id}
                            onClick={() => handleContractClick(contract.id)}
                            className="w-full text-left p-3 rounded-lg transition-colors border border-gray-700/50 hover:bg-gray-800/50"
                          >
                            <div className="text-sm font-medium text-gray-100 truncate">
                              {contract.title}
                            </div>
                            <div className="text-xs text-gray-100">
                              ${contract.price.toLocaleString()} •{" "}
                              {contract.progressStatus.replace("_", " ")}
                            </div>
                          </button>
                        ))}
                        {contracts.length === 0 && (
                          <p className="text-xs text-gray-200 font-medium italic p-3">
                            No contracts yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>

              <div className="p-4 border-t border-gray-700">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 p-3 h-auto text-gray-100 hover:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-700 text-gray-100 text-xs">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">
                        {displayName}
                      </span>
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
          )}

          {!isExpanded && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-100 hover:text-white hover:bg-gray-800"
                onClick={handleProfileClick}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-100 hover:text-red-400 hover:bg-gray-800"
                onClick={handleSignOutClick}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>
          )}
        </SidebarContent>
      </ShadcnSidebar>

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
