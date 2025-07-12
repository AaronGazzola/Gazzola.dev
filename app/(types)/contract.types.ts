//-| File path: app/(types)/contract.types.ts
import {
  Conversation,
  Contract as PrismaContract,
  Task as PrismaTask,
  Profile,
  ProgressStatus,
  RefundStatus,
} from "@/generated/prisma";

export interface Task extends PrismaTask {}

export interface Contract extends PrismaContract {
  profile: Profile;
  conversations: Conversation[];
  tasks: Task[];
}

export interface ContractCreateInput {
  title: string;
  description: string;
  startDate: Date;
  targetDate: Date;
  dueDate: Date;
  price: number;
  refundStatus?: RefundStatus | null;
  progressStatus?: ProgressStatus | null;
  conversationIds: string[];
  userApproved: boolean;
  adminApproved: boolean;
  tasks?: TaskCreateInput[];
}

export interface TaskCreateInput {
  title: string;
  description: string;
  price: number;
  progressStatus?: ProgressStatus | null;
}

export interface ContractState {
  contracts: Contract[];
  contract: Contract | null;
  contractHasChanged: boolean;
  setContracts: (contracts: Contract[]) => void;
  setContract: (contract: Contract | null) => void;
  reset: () => void;
  setContractHasChanged: (hasChanged: boolean) => void;
}
