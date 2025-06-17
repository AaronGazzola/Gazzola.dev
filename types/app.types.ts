//-| Filepath: types/app.types.ts
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
