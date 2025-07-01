//-| File path: app/(types)/ui.types.ts
import { Profile } from "@/app/(types)/auth.types";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { UserData } from "@/app/admin/page.types";
import { User as PrismaUser } from "@/generated/prisma";
import { User } from "@/lib/auth";

export interface AppData {
  user: User | null;
  profile: Profile | null;
  isVerified: boolean;
  isAdmin: boolean;
  users: UserData[];
  conversations: Conversation[];
  contracts: Contract[];
  targetUser?: PrismaUser | null;
}

export interface UIState {
  contractModal: {
    isOpen: boolean;
    contractId: string | null;
  };
  profileModal: {
    isOpen: boolean;
    profileId: string | null;
  };
  authModal: {
    isOpen: boolean;
  };
}

export interface AppState {
  ui: UIState;
  openContractModal: (contractId: string) => void;
  closeContractModal: () => void;
  openProfileModal: (profileId?: string) => void;
  closeProfileModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  reset: () => void;
}

export interface ActionResponse<T> {
  data?: T | null;
  error?: string | null;
}
