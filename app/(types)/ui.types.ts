//-| File path: app/(types)/ui.types.ts
import { Profile } from "@/app/(types)/auth.types";
import { Conversation } from "@/app/(types)/chat.types";
import { Contract } from "@/app/(types)/contract.types";
import { UserData } from "@/app/admin/admin.types";
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
  };
  profileModal: {
    isOpen: boolean;
  };
  authModal: {
    isOpen: boolean;
  };
  onboardingModal: {
    isOpen: boolean;
  };
}

export interface AppState {
  ui: UIState;
  openContractModal: () => void;
  closeContractModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  reset: () => void;
}
