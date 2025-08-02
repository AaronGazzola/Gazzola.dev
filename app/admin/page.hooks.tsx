//-| File path: app/admin/page.hooks.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { useAdminStore } from "@/app/admin/page.store";
import { getUsersAction } from "@/app/admin/page.actions";

export const useGetUsers = () => {
  const { filters, setUsers } = useAdminStore();
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const { data, error } = await getUsersAction(filters);
      if (error) throw new Error(error);
      if (data) {
        setUsers(data);
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};