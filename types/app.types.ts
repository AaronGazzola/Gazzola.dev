// app.types.ts
import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  userId: string;
  role: "admin" | "client";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  participants: string[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  userId: string;
  amount: number;
  startDate: string;
  dueDate: string;
  paymentStatus: "pending" | "paid" | "overdue";
  refundStatus: "none" | "requested" | "approved";
  progressStatus: "not_started" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface FileUpload {
  id: string;
  messageId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface Filters {
  search: string;
  status: string[];
}

export interface UIState {
  selectedConversationId: string | null;
  contractModal: {
    isOpen: boolean;
    contractId: string | null;
  };
  profileModal: {
    isOpen: boolean;
    profileId: string | null;
  };
  filters: Filters;
}

export type UserInfo = Pick<
  User,
  "id" | "email" | "created_at" | "confirmed_at" | "email_confirmed_at"
>;

export interface AppState {
  user: UserInfo | null;
  profile: Profile | null;
  conversations: Conversation[];
  contracts: Contract[];
  messages: Message[];
  files: FileUpload[];
  profiles: Profile[];
  ui: UIState;

  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setContracts: (contracts: Contract[]) => void;
  setMessages: (messages: Message[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setProfiles: (profiles: Profile[]) => void;

  setSelectedConversationId: (id: string | null) => void;
  openContractModal: (contractId: string) => void;
  closeContractModal: () => void;
  openProfileModal: (profileId?: string) => void;
  closeProfileModal: () => void;
  setFilters: (filters: Partial<Filters>) => void;

  getConversationMessages: (conversationId: string) => Message[];
  getMessageFiles: (messageId: string) => FileUpload[];
  getUserConversations: () => Conversation[];
  getUserContracts: () => Contract[];
  isAdmin: () => boolean;

  reset: () => void;
}

export type PaymentStatus = "pending" | "paid" | "overdue";
export type RefundStatus = "none" | "requested" | "approved";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type UserRole = "admin" | "client";
