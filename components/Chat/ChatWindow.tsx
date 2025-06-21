//-| Filepath: components/Chat/ChatWindow.tsx
"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAuth,
  useResendVerificationEmail,
  useSignOutMutation,
} from "@/hooks/auth.hooks";
import { useChatWindow } from "@/hooks/chat.hooks";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";
import { cn } from "@/lib/tailwind.utils";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import { LogIn, Mail, Plus, Send } from "lucide-react";
import Conversation from "./Conversation";

const ChatWindowSkeleton = () => {
  return (
    <div className="grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full">
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
};

const ChatWindow = () => {
  const {
    conversations,
    currentMessage,
    isLoading,
    handleSendMessage,
    handleMessageChange,
    handleCreateNewConversation,
  } = useChatWindow();

  const { openAuthModal } = useAppStore();
  const { isPending: authLoading } = useGetAuth();
  const { user, isVerified, isAdmin } = useAuthStore();
  const resendVerificationEmail = useResendVerificationEmail();
  const signOutMutation = useSignOutMutation();

  const isAuthenticated = !!user;

  const { scrollRef } = useScrollToMessage(conversations);

  if (authLoading) {
    return <ChatWindowSkeleton />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isAuthenticated && isVerified) {
        handleSendMessage();
      }
    }
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

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const isMessageEmpty = !currentMessage.trim();
  const canInteract = isAuthenticated && isVerified;

  return (
    <div className="grow rounded border border-b-gray-900 border-r-gray-800 border-t-gray-600 border-l-gray-700 opacity-0 w-full flex flex-col items-center pr-2 pt-4 max-w-[650px] h-full expand">
      <div className="w-full h-full flex flex-col items-left opacity-0 fade-in-content">
        {isAuthenticated && !isVerified && (
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

        <div
          ref={scrollRef}
          className="grow scrollbar scrollbar-track scrollbar-thumb overflow-y-scroll pr-5 pt-3 space-y-2"
        >
          {sortedConversations.map((conversation) => (
            <Conversation key={conversation.id} conversation={conversation} />
          ))}
        </div>
        <div className="pt-4 pl-4 pr-4 pb-4 relative">
          <div className="relative">
            <Textarea
              value={currentMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading || !canInteract}
              className={cn(
                "min-h-[80px] resize-none border border-white/10 focus:border-white/40 pr-16",
                !canInteract && "blur-sm"
              )}
            />
            <div className="absolute right-2 bottom-2 flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || isMessageEmpty || !canInteract}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isMessageEmpty || !canInteract
                    ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700",
                  !canInteract && "blur-sm"
                )}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
              {isAdmin && (
                <Button
                  onClick={handleCreateNewConversation}
                  disabled={isLoading || isMessageEmpty || !canInteract}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    isMessageEmpty || !canInteract
                      ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700",
                    !canInteract && "blur-sm"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Create new conversation</span>
                </Button>
              )}
            </div>
          </div>
          {!isAuthenticated && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded">
              <Button
                onClick={handleSignInClick}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
