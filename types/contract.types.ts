//-| Filepath: types/contract.types.ts
import { UserInfo } from "@/types/app.types";
import { Conversation } from "@/types/chat.types";

export interface Contract {
  id: string;
  title: string;
  description: string;
  startDate: string;
  targetDate: string;
  dueDate: string;
  price: number;
  refundStatus: "pending" | "approved" | "denied" | "completed";
  progressStatus: "not_started" | "in_progress" | "completed" | "cancelled";
  user: UserInfo;
  conversations: Conversation[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractInsert {
  title: string;
  description: string;
  startDate: string;
  targetDate: string;
  dueDate: string;
  price: number;
  refundStatus: "pending" | "approved" | "denied" | "completed";
  progressStatus: "not_started" | "in_progress" | "completed" | "cancelled";
  user: UserInfo;
}

export interface ContractUpdate {
  title?: string;
  description?: string;
  startDate?: string;
  targetDate?: string;
  dueDate?: string;
  price?: number;
  refundStatus?: "pending" | "approved" | "denied" | "completed";
  progressStatus?: "not_started" | "in_progress" | "completed" | "cancelled";
  user?: UserInfo;
}

export interface GetContractsParams {
  searchTerm?: string;
  progressStatus?: Contract["progressStatus"][];
  refundStatus?: Contract["refundStatus"][];
  sortBy?: keyof Contract;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ContractListResponse {
  data: Contract[];
  total: number;
}

export interface ContractState {
  contracts: Contract[];
  selectedContractId: string | null;
  filters: {
    searchTerm: string;
    progressStatus: Contract["progressStatus"][];
    refundStatus: Contract["refundStatus"][];
  };
  setContracts: (contracts: Contract[]) => void;
  setSelectedContractId: (id: string | null) => void;
  setFilters: (filters: Partial<ContractState["filters"]>) => void;
  addContract: (contract: Contract) => void;
  updateContract: (contractId: string, updates: Partial<Contract>) => void;
  removeContract: (contractId: string) => void;
  addConversationToContract: (contractId: string, conversation: Conversation) => void;
  removeConversationFromContract: (contractId: string, conversationId: string) => void;
  getContractById: (contractId: string) => Contract | null;
  getUserContracts: (userId: string) => Contract[];
  reset: () => void;
}
