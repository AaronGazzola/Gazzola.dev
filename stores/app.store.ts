// app.store.ts
import {
  AppState,
  Contract,
  Conversation,
  FileUpload,
  Filters,
  Message,
  Profile,
  UIState,
} from "@/types/app.types";
import { createId } from "@paralleldrive/cuid2";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

const defaultUser = {
  id: createId(),
  email: "email@exmaple.com",
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
};

const initialUIState: UIState = {
  selectedConversationId: null,
  contractModal: {
    isOpen: false,
    contractId: null,
  },
  profileModal: {
    isOpen: false,
    profileId: null,
  },
  filters: {
    search: "",
    status: [],
  },
};

const initialState = {
  user: defaultUser,
  profile: null,
  conversations: [],
  contracts: [],
  messages: [],
  files: [],
  profiles: [],
  ui: initialUIState,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setUser: (user: User | null) => set({ user }),

  setProfile: (profile: Profile | null) => set({ profile }),

  setConversations: (conversations: Conversation[]) => set({ conversations }),

  setContracts: (contracts: Contract[]) => set({ contracts }),

  setMessages: (messages: Message[]) => set({ messages }),

  setFiles: (files: FileUpload[]) => set({ files }),

  setProfiles: (profiles: Profile[]) => set({ profiles }),

  setSelectedConversationId: (id: string | null) =>
    set((state) => ({ ui: { ...state.ui, selectedConversationId: id } })),

  openContractModal: (contractId: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: true, contractId },
      },
    })),

  closeContractModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        contractModal: { isOpen: false, contractId: null },
      },
    })),

  openProfileModal: (profileId?: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        profileModal: { isOpen: true, profileId: profileId || null },
      },
    })),

  closeProfileModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        profileModal: { isOpen: false, profileId: null },
      },
    })),

  setFilters: (filters: Partial<Filters>) =>
    set((state) => ({
      ui: { ...state.ui, filters: { ...state.ui.filters, ...filters } },
    })),

  getConversationMessages: (conversationId: string) => {
    const { messages } = get();
    return messages.filter(
      (message) => message.conversationId === conversationId
    );
  },

  getMessageFiles: (messageId: string) => {
    const { files } = get();
    return files.filter((file) => file.messageId === messageId);
  },

  getUserConversations: () => {
    const { user, conversations } = get();
    if (!user) return [];
    return conversations.filter((conv) => conv.participants.includes(user.id));
  },

  getUserContracts: () => {
    const { user, contracts } = get();
    if (!user) return [];
    return contracts.filter((contract) => contract.userId === user.id);
  },

  isAdmin: () => {
    const { profile } = get();
    return profile?.role === "admin";
  },

  reset: () => set(initialState),
}));
