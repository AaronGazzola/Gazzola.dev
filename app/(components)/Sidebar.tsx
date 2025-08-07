//-| File path: app/(components)/Sidebar.tsx
"use client";
import AuthDialog from "@/app/(components)/AuthDialog";
import ContractDialog from "@/app/(components)/ContractDialog";
import ProfileDialog from "@/app/(components)/ProfileDialog";
import { useResetProfile } from "@/app/(components)/ProfileDialog.hooks";
import {
  useDeleteUserContracts,
  useDeleteUserConversations,
  useSignOutMutation,
} from "@/app/(components)/Sidebar.hooks";
import SignOutConfirm from "@/app/(components)/SignOutConfirm";
import { useGetAppData } from "@/app/(hooks)/app.hooks";
import useIsTest from "@/app/(hooks)/useIsTest";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import configuration from "@/configuration";
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
  Check,
  DollarSign,
  FileText,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  const isTest = useIsTest();
  const router = useRouter();

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
  const signOutMutation = useSignOutMutation();
  const deleteUserContractsMutation = useDeleteUserContracts();
  const deleteUserConversationsMutation = useDeleteUserConversations();
  const isAuthenticated = !!user;
  const { open, isMobile, toggleSidebar } = useSidebar();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const conversationsLoading = appDataLoading;
  const contractsLoading = appDataLoading;
  const conversationsError = null;
  const contractsError = null;
  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : user?.name || user?.email || "User";
  const isExpanded = isMobile || open;
  const { mutate: resetProfile, isPending: isResetting } = useResetProfile();

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

  const isContractApproved = (contractItem: Contract) => {
    if (contractItem.isPaid) return true;
    if (isAdmin) {
      return contractItem.adminApproved;
    } else {
      return contractItem.userApproved;
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

  const handleAdminClick = () => {
    router.push(configuration.paths.admin);
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const handleReset = () => {
    resetProfile(undefined, {});
  };

  const handleConversationClick = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    markMessagesAsRead(conversation.id);
  };

  const handleDeleteContracts = () => {
    if (targetUser?.id) {
      deleteUserContractsMutation.mutate(targetUser.id);
    }
  };

  const handleDeleteConversations = () => {
    if (targetUser?.id) {
      deleteUserConversationsMutation.mutate(targetUser.id);
    }
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

          {isExpanded && isAuthenticated && isVerified && (
            <div className="flex flex-col flex-grow relative">
              <div className="flex-grow relative">
                <SidebarGroup className="absolute inset-0 flex flex-col">
                  <SidebarGroupLabel className="flex-shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-100" />
                        <span className="text-sm font-medium text-gray-100">
                          Conversations
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isTest && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-100 hover:text-red-400 hover:bg-gray-800"
                            onClick={handleDeleteConversations}
                            data-cy={DataCyAttributes.DELETE_CONVERSATIONS}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete conversations</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </SidebarGroupLabel>

                  <SidebarGroupContent className="flex-grow overflow-hidden">
                    <ScrollArea className="overflow-auto max-h-full">
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
                          <p className="text-xs text-gray-200 font-medium italic p-3" data-cy={DataCyAttributes.NO_CONVERSATIONS_YET}>
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
              </div>
              <div className="flex-grow relative">
                <SidebarGroup className="absolute inset-0 flex flex-col">
                  <SidebarGroupLabel className="flex-shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-100" />
                        <span className="text-sm font-medium text-gray-100" data-cy={DataCyAttributes.CONTRACTS_TITLE}>
                          Contracts
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isTest && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-100 hover:text-red-400 hover:bg-gray-800"
                            onClick={handleDeleteContracts}
                            data-cy={DataCyAttributes.DELETE_CONTRACTS}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete contracts</span>
                          </Button>
                        )}
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
                    </div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="flex-grow overflow-hidden">
                    <ScrollArea className="overflow-auto max-h-full">
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
                          <p className="text-xs text-gray-200 font-medium italic p-3" data-cy={DataCyAttributes.NO_CONTRACTS_YET}>
                            No contracts yet
                          </p>
                        ) : (
                          contracts?.map((contractItem) => {
                            const isCurrentContract =
                              contract?.id === contractItem.id;
                            const isApproved = isContractApproved(contractItem);
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
                                    "w-full text-left p-3 rounded-lg transition-colors border hover:bg-gray-800/50 relative",
                                    isCurrentContract
                                      ? "border-white"
                                      : "border-gray-700/50"
                                  )}
                                  data-cy={DataCyAttributes.CONTRACT_ITEM}
                                >
                                  {contractItem.isPaid && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          className="absolute bottom-1 left-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-blue-500 hover:bg-blue-500 cursor-help"
                                          data-cy={
                                            DataCyAttributes.CONTRACT_PAID_BADGE
                                          }
                                        >
                                          <DollarSign className="h-3 w-3" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Contract has been paid</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {!isAdmin && 
                                    contractItem.adminApproved && 
                                    contractItem.userApproved && 
                                    !contractItem.isPaid && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          className="absolute bottom-1 right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-green-500 hover:bg-green-500 cursor-help text-white"
                                          data-cy={
                                            DataCyAttributes.CONTRACT_APPROVED_BADGE
                                          }
                                        >
                                          <Check className="h-3 w-3" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Contract approved, please complete payment</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {!isApproved && (
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
                                          {otherUserName} has made changes to
                                          the contract and approval or revisions
                                          are required
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
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
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>

              <div className="border-t border-gray-700 flex-shrink-0">
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
                      {isTest && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          disabled={isResetting}
                          className="rounded"
                          data-cy={DataCyAttributes.PROFILE_RESET_BUTTON}
                        >
                          {isResetting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2" />
                              Resetting...
                            </div>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reset
                            </>
                          )}
                        </Button>
                      )}
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
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          onClick={handleAdminClick}
                          data-cy={DataCyAttributes.ADMIN_BUTTON}
                        >
                          <Settings className="h-4 w-4" />
                          Admin
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
