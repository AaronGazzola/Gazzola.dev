//-| File path: app/(types)/chat.types.ts
import {
  Contract as PrismaContract,
  Conversation as PrismaConversation,
  FileUpload as PrismaFileUpload,
  Message as PrismaMessage,
  User as PrismaUser,
} from "@/generated/prisma";

export interface Message extends PrismaMessage {
  files: PrismaFileUpload[];
}

export interface Conversation extends PrismaConversation {
  messages: Message[];
  contracts: PrismaContract[];
}

export interface FileUpload extends PrismaFileUpload {
  message: Message;
}

export interface ChatState {
  conversations: Conversation[];
  files: FileUpload[];
  currentConversation: Conversation | null;
  targetUser: PrismaUser | null;
  unreadMessages: Message[];
  setConversations: (conversations: Conversation[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setTargetUser: (user: PrismaUser | null) => void;
  setUnreadMessages: (unreadMessages: Message[]) => void;
  addUnreadMessages: (messages: Message[]) => void;
  markMessagesAsRead: (conversationId: string) => void;
  reset: () => void;
}
