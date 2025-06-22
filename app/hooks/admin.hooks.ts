//-| File path: app/hooks/admin.hooks.ts
//-| Filepath: app/hooks/admin.hooks.ts
"use client";

import { getUsersAction } from "@/app/actions/admin.actions";
import { useAdminStore } from "@/app/stores/admin.store";
import { UserData, GetUsersParams } from "@/app/types/admin.types";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (params: GetUsersParams = {}) => {
  const { filters } = useAdminStore();
  
  const mergedParams = {
    ...filters,
    ...params,
  };

  return useQuery({
    queryKey: ["admin-users", mergedParams],
    queryFn: async () => {
      const { data, error } = await getUsersAction(mergedParams);

      if (error) throw new Error(error);

      return data;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useRefreshUsers = () => {
  const { filters } = useAdminStore();
  
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      const { data, error } = await getUsersAction(filters);

      if (error) throw new Error(error);

      return data;
    },
    enabled: false,
  });
};
