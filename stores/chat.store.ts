//-| File path: stores/chat.store.ts
import { User as PrismaUser } from "@/generated/prisma";
import {
  ChatState,
  Conversation,
  FileUpload,
  Message,
} from "@/types/chat.types";
import { create } from "zustand";

const initialState = {
  conversations: [],
  files: [],
  currentConversation: null,
  targetUser: null,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  setFiles: (files: FileUpload[]) => set({ files }),
  setCurrentConversation: (conversation: Conversation | null) =>
    set({ currentConversation: conversation }),
  setTargetUser: (user: PrismaUser | null) => set({ targetUser: user }),
  addConversation: (conversation: Conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? { ...state.currentConversation, ...updates }
          : state.currentConversation,
    })),
  removeConversation: (conversationId: string) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (conv) => conv.id !== conversationId
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? null
          : state.currentConversation,
    })),
  addMessage: (conversationId: string, message: Message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessageAt: message.createdAt,
            }
          : conv
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? {
              ...state.currentConversation,
              messages: [...state.currentConversation.messages, message],
              lastMessageAt: message.createdAt,
            }
          : state.currentConversation,
    })),
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
            }
          : conv
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? {
              ...state.currentConversation,
              messages: state.currentConversation.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
            }
          : state.currentConversation,
    })),
  removeMessage: (conversationId: string, messageId: string) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.filter((msg) => msg.id !== messageId),
            }
          : conv
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? {
              ...state.currentConversation,
              messages: state.currentConversation.messages.filter(
                (msg) => msg.id !== messageId
              ),
            }
          : state.currentConversation,
    })),
  addFile: (file: FileUpload) =>
    set((state) => ({
      files: [...state.files, file],
    })),
  removeFile: (fileId: string) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId),
    })),
  getConversationById: (conversationId: string) => {
    const { conversations } = get();
    return conversations.find((conv) => conv.id === conversationId) || null;
  },
  getUserConversations: (userId: string) => {
    const { conversations } = get();
    return conversations.filter((conv) => conv.participants.includes(userId));
  },
  getMessageFiles: (messageId: string) => {
    const { files } = get();
    return files.filter((file) => file.messageId === messageId);
  },
  reset: () => set(initialState),
}));
