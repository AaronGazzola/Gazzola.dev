//-| File path: app/(components)/Sidebar.tsx
"use client";
import AuthDialog from "@/app/(components)/AuthDialog";
import ContractDialog from "@/app/(components)/ContractDialog";
import ProfileDialog from "@/app/(components)/ProfileDialog";
import {
  useResendVerificationEmail,
  useSignOutMutation,
} from "@/app/(components)/Sidebar.hooks";
import SignOutConfirm from "@/app/(components)/SignOutConfirm";
import { useGetAppData } from "@/app/(hooks)/app.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import { format } from "date-fns";
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
  const { contracts, setContract, contract } = useContractStore();
  const { openContractModal, openProfileModal, openAuthModal } = useAppStore();
  const { isLoading: appDataLoading } = useGetAppData();
  const { user, isVerified, profile, isAdmin } = useAuthStore();
  const {
    setCurrentConversation,
    conversations,
    unreadMessages,
    markMessagesAsRead,
    currentConversation,
    targetUser,
  } = useChatStore();
  const resendVerificationEmail = useResendVerificationEmail();
  const signOutMutation = useSignOutMutation();
  const isAuthenticated = !!user;
  const { open, isMobile, toggleSidebar } = useSidebar();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const conversationsLoading = appDataLoading;
  const contractsLoading = appDataLoading;
  const conversationsError = null;
  const contractsError = null;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.name || user?.email || "User";
  const isExpanded = isMobile || open;

  if (appDataLoading) return <SidebarSkeleton />;

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getUnreadCountForConversation = (conversationId: string) => {
    return unreadMessages.filter((msg) => msg.conversationId === conversationId)
      .length;
  };

  const isContractUnapproved = (contractItem: Contract) => {
    if (isAdmin) {
      return !contractItem.adminApproved;
    } else {
      return !contractItem.userApproved;
    }
  };

  const handleContractClick = (contractItem: Contract) => {
    setContract(contractItem);
    openContractModal();
  };

  const handleOpenContractModal = () => {
    setContract(null);
    openContractModal();
  };

  const handleProfileClick = () => {
    openProfileModal();
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

  const handleConversationClick = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    markMessagesAsRead(conversation.id);
  };

  return (
    <TooltipProvider>
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
                      data-cy={DataCyAttributes.TOGGLE_SIDEBAR_BUTTON}
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
                data-cy={DataCyAttributes.TOGGLE_SIDEBAR_BUTTON}
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
                        data-cy={DataCyAttributes.RESEND_EMAIL_BUTTON}
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
                        data-cy={DataCyAttributes.SIGN_OUT_VERIFY_BUTTON}
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
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="max-h-[33vh] overflow-auto">
                      <div className="space-y-1 overflow-visible">
                        {conversationsLoading ? (
                          <div className="animate-pulse">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-16 bg-gray-700 rounded mb-2"
                              />
                            ))}
                          </div>
                        ) : conversationsError ? (
                          <div className="text-red-400 text-sm p-3">
                            Failed to load conversations
                          </div>
                        ) : conversations.length === 0 ? (
                          <p className="text-xs text-gray-200 font-medium italic p-3">
                            No conversations yet
                          </p>
                        ) : (
                          conversations.map((conversation) => {
                            const lastMessage =
                              conversation.messages[
                                conversation.messages.length - 1
                              ];
                            const unreadCount = getUnreadCountForConversation(
                              conversation.id
                            );
                            const isCurrentConversation =
                              currentConversation?.id === conversation.id;
                            return (
                              <div className="pt-2 pl-2" key={conversation.id}>
                                <button
                                  onClick={() =>
                                    handleConversationClick(conversation)
                                  }
                                  className={cn(
                                    "w-full text-left p-3 rounded-lg transition-colors border hover:bg-gray-800/50 relative overflow-visible",
                                    isCurrentConversation
                                      ? "border-white"
                                      : "border-gray-700/50"
                                  )}
                                  data-cy={DataCyAttributes.CONVERSATION_ITEM}
                                >
                                  {unreadCount > 0 && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="destructive"
                                          className="absolute -top-1 -left-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-500 cursor-help"
                                          data-cy={
                                            DataCyAttributes.UNREAD_BADGE
                                          }
                                        >
                                          {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          You have {unreadCount} unread messages
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {lastMessage && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-400 flex-shrink-0 ">
                                        {format(
                                          new Date(conversation.lastMessageAt),
                                          "MMM d"
                                        )}
                                      </span>
                                      <p className="text-sm text-gray-300 truncate">
                                        {lastMessage.content}
                                      </p>
                                    </div>
                                  )}
                                </button>
                              </div>
                            );
                          })
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
                        onClick={handleOpenContractModal}
                        data-cy={DataCyAttributes.CREATE_CONTRACT_BUTTON}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Create contract</span>
                      </Button>
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <ScrollArea className="">
                      <div className="space-y-1">
                        {contractsLoading ? (
                          <div className="animate-pulse">
                            {[1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-16 bg-gray-700 rounded mb-2"
                              />
                            ))}
                          </div>
                        ) : contractsError ? (
                          <div className="text-red-400 text-sm p-3">
                            Failed to load contracts
                          </div>
                        ) : contracts?.length === 0 ? (
                          <p className="text-xs text-gray-200 font-medium italic p-3">
                            No contracts yet
                          </p>
                        ) : (
                          contracts?.map((contractItem) => {
                            const isCurrentContract =
                              contract?.id === contractItem.id;
                            const isUnapproved =
                              isContractUnapproved(contractItem);
                            const otherUserName =
                              isAdmin && targetUser
                                ? targetUser.name
                                : "Az Anything";
                            return (
                              <div className="relative" key={contractItem.id}>
                                <button
                                  onClick={() =>
                                    handleContractClick(contractItem)
                                  }
                                  className={cn(
                                    "w-full text-left p-3 rounded-lg transition-colors border hover:bg-gray-800/50",
                                    isCurrentContract
                                      ? "border-white"
                                      : "border-gray-700/50"
                                  )}
                                  data-cy={DataCyAttributes.CONTRACT_ITEM}
                                >
                                  <div className="text-sm font-medium text-gray-100 truncate">
                                    {contractItem.title}
                                  </div>
                                  <div className="text-xs text-gray-100">
                                    ${contractItem.price.toLocaleString()} •{" "}
                                    {contractItem.progressStatus?.replace(
                                      "_",
                                      " "
                                    ) || "Not started"}
                                  </div>
                                </button>
                                {isUnapproved && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="destructive"
                                        className="absolute bottom-1 right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-red-500 hover:bg-red-500 cursor-help"
                                        data-cy={
                                          DataCyAttributes.CONTRACT_UNAPPROVED_BADGE
                                        }
                                      >
                                        !
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {otherUserName} has made changes to the
                                        contract and approval or revisions are
                                        required
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            );
                          })
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
                      data-cy={DataCyAttributes.PROFILE_BUTTON}
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
                      {profile && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={handleProfileClick}
                          data-cy={DataCyAttributes.PROFILE_MENU_BUTTON}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleSignOutClick}
                        data-cy={DataCyAttributes.SIGN_OUT_BUTTON}
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
              {profile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-100 hover:text-white hover:bg-gray-800"
                  onClick={handleProfileClick}
                  data-cy={DataCyAttributes.PROFILE_BUTTON_COLLAPSED}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-100 hover:text-red-400 hover:bg-gray-800"
                onClick={handleSignOutClick}
                data-cy={DataCyAttributes.SIGN_OUT_BUTTON_COLLAPSED}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>
          )}
          {!isAuthenticated && (
            <div className="flex flex-col justify-end border items-center flex-1 p-4">
              <Button
                variant="default"
                className="w-full flex items-center gap-2 rounded"
                onClick={handleSignInClick}
                data-cy={DataCyAttributes.SIGN_IN_BUTTON}
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
    </TooltipProvider>
  );
};

export default Sidebar;
