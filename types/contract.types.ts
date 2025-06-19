//-| Filepath: types/contract.types.ts
import {
  Contract as PrismaContract,
  Profile,
  ProgressStatus,
  RefundStatus,
} from "@/generated/prisma";

export interface Contract extends PrismaContract {
  profile: Profile;
}

export interface ContractInsert {
  title: string;
  description: string;
  startDate: string;
  targetDate: string;
  dueDate: string;
  price: number;
  refundStatus: RefundStatus;
  progressStatus: ProgressStatus;
  user: Profile;
  conversationIds: string[];
  userApproved: boolean;
  adminApproved: boolean;
}

export interface ContractUpdate {
  title?: string;
  description?: string;
  startDate?: string;
  targetDate?: string;
  dueDate?: string;
  price?: number;
  refundStatus?: RefundStatus;
  progressStatus?: ProgressStatus;
  user?: Profile;
  conversationIds?: string[];
  userApproved?: boolean;
  adminApproved?: boolean;
}

export interface GetContractsParams {
  searchTerm?: string;
  progressStatus?: ProgressStatus[];
  refundStatus?: RefundStatus[];
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
    progressStatus: ProgressStatus[];
    refundStatus: RefundStatus[];
  };
  setContracts: (contracts: Contract[]) => void;
  setSelectedContractId: (id: string | null) => void;
  setFilters: (filters: Partial<ContractState["filters"]>) => void;
  addContract: (contract: Contract) => void;
  updateContract: (contractId: string, updates: Partial<Contract>) => void;
  removeContract: (contractId: string) => void;
  addConversationToContract: (
    contractId: string,
    conversationId: string
  ) => void;
  removeConversationFromContract: (
    contractId: string,
    conversationId: string
  ) => void;
  getContractById: (contractId: string) => Contract | null;
  getUserContracts: (userId: string) => Contract[];
  reset: () => void;
}
