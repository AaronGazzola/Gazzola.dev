//-| File path: app/stores/admin.store.ts
//-| Filepath: app/stores/admin.store.ts
import { AdminFilters } from "@/app/types/admin.types";
import { create } from "zustand";

interface AdminState {
  filters: AdminFilters;
  setFilters: (filters: Partial<AdminFilters>) => void;
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
  
  setFilters: (filters) => 
    set({ filters: { ...get().filters, ...filters } }),
  
  resetFilters: () => set({ filters: initialFilters }),
}));