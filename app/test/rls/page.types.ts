//-| File path: app/test/rls/page.types.ts

export interface RLSSignInCredentials {
  email: string;
  password: string;
}

export interface RLSAuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
  } | null;
}

export interface RLSActionResponse {
  success: boolean;
  message?: string;
  data?: any;
}