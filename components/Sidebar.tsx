//-| File path: components/Sidebar.tsx
//-| Filepath: components/Sidebar.tsx
"use client";

import AuthDialog from "@/component/AuthDialog";
import ContractDialog from "@/component/ContractDialog";
import ProfileDialog from "@/component/ProfileDialog";
import SignOutConfirm from "@/component/SignOutConfirm";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  useGetAuth,
  useResendVerificationEmail,
  useSignOutMutation,
} from "@/hooks/auth.hooks";
import { useConversationAccordion } from "@/hooks/chat.hooks";
import { cn } from "@/lib/tailwind.utils";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useContractStore } from "@/stores/contract.store";
import {
  FileText,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";

const SidebarSkeleton = () => {
  const { open, isMobile } = useSidebar();
  const isExpanded = isMobile || open;

  return (
    <ShadcnSidebar collapsible="icon" className="border-r-gray-800">
      <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0">
        <SidebarHeader
          className={cn(isExpanded && "pt-8 p-6", "border-b border-gray-700")}
        >
          <div className="h-8 bg-gray-700 rounded animate-pulse" />
          {isExpanded && (
            <div className="h-4 bg-gray-700 rounded animate-pulse mt-2" />
          )}
        </SidebarHeader>
        {isExpanded && (
          <div className="flex-1 p-4 space-y-6">
            <div className="space-y-2">
              <div className="h-6 bg-gray-700 rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-700 rounded animate-pulse" />
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        )}
      </SidebarContent>
    </ShadcnSidebar>
  );
};

const Sidebar = () => {
  const { contracts, setSelectedContractId } = useContractStore();
  const {
    groupedConversations,
    selectedConversationId,
    handleConversationSelect,
    handleNewConversation,
  } = useConversationAccordion();

  const { openContractModal, openProfileModal, openAuthModal } = useAppStore();
  const { isPending } = useGetAuth();

  const { user, isVerified, profile, isAdmin } = useAuthStore();
  const resendVerificationEmail = useResendVerificationEmail();
  const signOutMutation = useSignOutMutation();

  const isAuthenticated = !!user;

  const { open, isMobile, toggleSidebar } = useSidebar();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.name || user?.email || "User";

  const isExpanded = isMobile || open;

  if (isPending && !user) {
    return <SidebarSkeleton />;
  }

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleContractClick = (contractId: string) => {
    setSelectedContractId(contractId);
    openContractModal(contractId);
  };

  const handleCreateContract = () => {
    openContractModal("");
  };

  const handleProfileClick = () => {
    openProfileModal(profile?.id);
  };

  const handleSignOutClick = () => {
    setIsSignOutDialogOpen(true);
  };

  const handleSignInClick = () => {
    openAuthModal();
  };

  const handleResendEmail = () => {
    resendVerificationEmail.mutate();
  };

  const handleSignOut = () => {
    signOutMutation.mutate({});
  };

  const sortedContracts = [...contracts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const allConversations = Object.values(groupedConversations).flat();

  return (
    <>
      <ShadcnSidebar collapsible="icon" className="border-r-gray-800">
        <SidebarContent className="h-full bg-black md:bg-transparent border-gray-700 overflow-x-hidden gap-0">
          <SidebarHeader
            className={cn(isExpanded && "pt-8 p-6", "border-b border-gray-700")}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-gray-800"
                      onClick={toggleSidebar}
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Sidebar</span>
                    </Button>
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

          {isExpanded && isAuthenticated && !isVerified && (
            <div className="p-4">
              <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <Mail className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <div className="flex flex-col gap-2">
                    <span>Verify your email to continue</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResendEmail}
                        disabled={resendVerificationEmail.isPending}
                        className="text-xs"
                      >
                        {resendVerificationEmail.isPending
                          ? "Sending..."
                          : "Resend Email"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSignOut}
                        disabled={signOutMutation.isPending}
                        className="text-xs"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isExpanded && isAuthenticated && isVerified && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 space-y-6 relative">
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-100" />
                        <span className="text-sm font-medium text-gray-100">
                          Conversations
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-100 hover:text-white hover:bg-gray-800"
                        onClick={handleNewConversation}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">New conversation</span>
                      </Button>
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="">
                      <div className="space-y-1">
                        {Object.entries(groupedConversations).map(([groupName, conversations]) => (
                          <div key={groupName} className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium px-1 py-1">
                              {groupName}
                            </div>
                            {conversations.map((conversation) => (
                              <button
                                key={conversation.id}
                                onClick={() =>
                                  handleConversationSelect(conversation.id)
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
                          </div>
                        ))}
                        {allConversations.length === 0 && (
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
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-100" />
                        <span className="text-sm font-medium text-gray-100">
                          Contracts
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-100 hover:text-white hover:bg-gray-800"
                        onClick={handleCreateContract}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Create contract</span>
                      </Button>
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="">
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

              <div className="border-t border-gray-700">
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

          {!isExpanded && isAuthenticated && isVerified && (
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

          {!isAuthenticated && (
            <div className="flex flex-col items-center justify-center flex-1 p-4">
              <Button
                variant="default"
                className="w-full flex items-center gap-2"
                onClick={handleSignInClick}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
        </SidebarContent>
      </ShadcnSidebar>

      <ContractDialog />
      <ProfileDialog />
      <AuthDialog />
      <SignOutConfirm
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
      />
    </>
  );
};

export default Sidebar;
