//-| File path: app/(types)/auth.types.ts
import { Contract, Profile as PrismaProfile, User } from "@/generated/prisma";

export interface Profile extends PrismaProfile {
  user: User;
  contracts: Contract[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface SocialSignInParams {
  provider: "google";
  callbackURL?: string;
}

export interface SignOutParams {
  redirectTo?: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isVerified: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsVerified: (isVerified: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  clearAuth: () => void;
}
