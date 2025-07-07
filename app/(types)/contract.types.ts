//-| File path: app/(types)/contract.types.ts
import {
  Conversation,
  Contract as PrismaContract,
  Profile,
  RefundStatus,
  ProgressStatus,
} from "@/generated/prisma";

export interface Contract extends PrismaContract {
  profile: Profile;
  conversations: Conversation[];
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
}

export interface ContractState {
  contracts: Contract[];
  contract: Contract | null;
  setContracts: (contracts: Contract[]) => void;
  setContract: (contract: Contract | null) => void;
  reset: () => void;
}
