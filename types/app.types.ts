//-| filepath: types/app.types.ts

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

export type UserInfo = {
  id: string;
  email?: string | undefined;
  created_at: string;
  confirmed_at?: string | undefined;
  email_confirmed_at?: string | undefined;
};

export interface AppState {
  user: UserInfo | null;
  profile: Profile | null;
  ui: UIState;
  isAdmin: boolean;
  setUser: (user: UserInfo | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  openContractModal: (contractId: string) => void;
  closeContractModal: () => void;
  openProfileModal: (profileId?: string) => void;
  closeProfileModal: () => void;
  reset: () => void;
}
