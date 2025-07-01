//-| File path: app/stores/admin.store.ts
import { AdminFilters, UserData } from "@/app/admin/page.types";
import { create } from "zustand";

interface AdminState {
  filters: AdminFilters;
  users: UserData[];
  setFilters: (filters: Partial<AdminFilters>) => void;
  setUsers: (users: UserData[]) => void;
  resetFilters: () => void;
}

const initialFilters: AdminFilters = {
  searchTerm: "",
  page: 1,
  pageSize: 10,
  orderBy: "createdAt",
  orderDirection: "desc",
};

export const useAdminStore = create<AdminState>((set, get) => ({
  filters: initialFilters,
  users: [],

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  setUsers: (users) => set({ users }),

  resetFilters: () => set({ filters: initialFilters }),
}));
