//-| filepath: types/app.types.ts
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

export interface UIState {
  contractModal: {
    isOpen: boolean;
    contractId: string | null;
  };
  profileModal: {
    isOpen: boolean;
    profileId: string | null;
  };
}

export type UserInfo = Pick<
  User,
  "id" | "email" | "created_at" | "confirmed_at" | "email_confirmed_at"
>;

export interface AppState {
  user: UserInfo | null;
  profile: Profile | null;
  ui: UIState;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  openContractModal: (contractId: string) => void;
  closeContractModal: () => void;
  openProfileModal: (profileId?: string) => void;
  closeProfileModal: () => void;
  reset: () => void;
}
