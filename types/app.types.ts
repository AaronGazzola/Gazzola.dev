//-| Filepath: types/app.types.ts
import { Contract, Profile as PrismaProfile, User } from "@/generated/prisma";

export interface Profile extends PrismaProfile {
  user: User;
  contracts: Contract[];
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
  profile: Profile | null;
  ui: UIState;
  isAdmin: boolean;
  setProfile: (profile: Profile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
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

export interface AuthCredentials {
  email: string;
  password: string;
}
