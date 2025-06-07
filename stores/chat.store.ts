//-\ filepath: stores/chat.store.ts
import { ChatState, Conversation, Message } from "@/types/chat.types";
import { create } from "zustand";

const initialState = {
  conversations: [],
  messages: [],
  selectedConversationId: null,
  expandedGroups: ["Today", "Yesterday"],
  isLoading: false,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  setConversations: (conversations: Conversation[]) => set({ conversations }),

  setMessages: (messages: Message[]) => set({ messages }),

  setSelectedConversationId: (id: string | null) =>
    set({ selectedConversationId: id }),

  setExpandedGroups: (groups: string[]) => set({ expandedGroups: groups }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

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

  reset: () => set(initialState),
}));
