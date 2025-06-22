//-| File path: stores/chat.store.ts
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
  selectedConversationId: null,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  setFiles: (files: FileUpload[]) => set({ files }),
  setSelectedConversationId: (id: string | null) =>
    set({ selectedConversationId: id }),
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
    })),
  removeConversation: (conversationId: string) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (conv) => conv.id !== conversationId
      ),
      selectedConversationId:
        state.selectedConversationId === conversationId
          ? null
          : state.selectedConversationId,
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
