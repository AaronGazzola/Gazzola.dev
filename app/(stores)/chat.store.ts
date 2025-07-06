//-| File path: app/(stores)/chat.store.ts
import { ChatState, Conversation, FileUpload, Message } from "@/app/(types)/chat.types";
import { User as PrismaUser } from "@/generated/prisma";
import { create } from "zustand";

const initialState = {
  conversations: [],
  files: [],
  currentConversation: null,
  targetUser: null,
  unreadMessages: [],
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  setFiles: (files: FileUpload[]) => set({ files }),
  setCurrentConversation: (conversation: Conversation | null) =>
    set({ currentConversation: conversation }),
  setTargetUser: (user: PrismaUser | null) => set({ targetUser: user }),
  setUnreadMessages: (unreadMessages: Message[]) => set({ unreadMessages }),
  addUnreadMessages: (messages: Message[]) => {
    const currentUnread = get().unreadMessages;
    const newMessages = messages.filter(
      (msg) => !currentUnread.some((existing) => existing.id === msg.id)
    );
    set({ unreadMessages: [...currentUnread, ...newMessages] });
  },
  markMessagesAsRead: (conversationId: string) => {
    const currentUnread = get().unreadMessages;
    const filteredUnread = currentUnread.filter(
      (msg) => msg.conversationId !== conversationId
    );
    set({ unreadMessages: filteredUnread });
  },
  reset: () => set(initialState),
}));
