//-| File path: types/app.types.ts
//-| Filepath: types/app.types.ts

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
