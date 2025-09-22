"use client";

import { useQuery } from "@tanstack/react-query";
import { getContentVersionAction } from "./layout.actions";

export const useContentVersion = () => {
  return useQuery({
    queryKey: ["contentVersion"],
    queryFn: async () => {
      const { data, error } = await getContentVersionAction();
      if (error) throw error;
      return data || 1;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
  });
};