//-| File path: types/chat.types.ts
//-| Filepath: types/chat.types.ts
import {
  Contract as PrismaContract,
  Conversation as PrismaConversation,
  FileUpload as PrismaFileUpload,
  Message as PrismaMessage,
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
  selectedConversationId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setSelectedConversationId: (id: string | null) => void;
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
