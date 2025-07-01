//-| File path: app/(types)/contract.types.ts
import {
  Contract as PrismaContract,
  Profile,
  ProgressStatus,
  RefundStatus,
} from "@/generated/prisma";

export interface Contract extends PrismaContract {
  profile: Profile;
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