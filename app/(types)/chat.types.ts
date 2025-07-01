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
  setConversations: (conversations: Conversation[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setTargetUser: (user: PrismaUser | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  removeConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  addFile: (file: FileUpload) => void;
  removeFile: (fileId: string) => void;
  getConversationById: (conversationId: string) => Conversation | null;
  getUserConversations: (userId: string) => Conversation[];
  getMessageFiles: (messageId: string) => FileUpload[];
  reset: () => void;
}
