//-| File path: app/(stores)/chat.store.ts
import { ChatState, Conversation, FileUpload } from "@/app/(types)/chat.types";
import { User as PrismaUser } from "@/generated/prisma";
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
  reset: () => set(initialState),
}));
