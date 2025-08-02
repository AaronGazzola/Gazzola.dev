//-| File path: app/admin/admin.types.ts
import { ProgressStatus } from "@/generated/prisma";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  lastMessage?: string | null;
  lastMessageAt?: Date | null;
  contractTitle?: string | null;
  contractStatus?: ProgressStatus | null;
  contractCreatedAt?: Date | null;
  sessionCount?: number;
}

export interface GetUsersParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  orderBy?: "name" | "email" | "createdAt" | "contractCreatedAt";
  orderDirection?: "asc" | "desc";
}

export interface UserListResponse {
  data: UserData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminFilters {
  searchTerm: string;
  page: number;
  pageSize: number;
  orderBy: "name" | "email" | "createdAt" | "contractCreatedAt";
  orderDirection: "asc" | "desc";
}
