//-| filepath: stores/chat.store.ts
import {
  ChatState,
  Conversation,
  FileUpload,
  Message,
} from "@/types/chat.types";
import { create } from "zustand";

const initialState = {
  conversations: [],
  messages: [],
  files: [],
  selectedConversationId: null,
  expandedGroups: ["Today", "Yesterday"],
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  setMessages: (messages: Message[]) => set({ messages }),
  setFiles: (files: FileUpload[]) => set({ files }),
  setSelectedConversationId: (id: string | null) =>
    set({ selectedConversationId: id }),
  setExpandedGroups: (groups: string[]) => set({ expandedGroups: groups }),
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
      messages: state.messages.filter(
        (msg) => msg.conversationId !== conversationId
      ),
      selectedConversationId:
        state.selectedConversationId === conversationId
          ? null
          : state.selectedConversationId,
    })),
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((conv) =>
        conv.id === message.conversationId
          ? { ...conv, lastMessageAt: message.createdAt }
          : conv
      ),
    })),
  updateMessage: (messageId: string, updates: Partial<Message>) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    })),
  removeMessage: (messageId: string) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),
  addFile: (file: FileUpload) =>
    set((state) => ({
      files: [...state.files, file],
    })),
  removeFile: (fileId: string) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId),
    })),
  getConversationMessages: (conversationId: string) => {
    const { messages } = get();
    return messages
      .filter((message) => message.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  },
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
