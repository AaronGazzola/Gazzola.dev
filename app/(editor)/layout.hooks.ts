"use client";

import { useQuery } from "@tanstack/react-query";
import { getContentVersionAction, getMarkdownDataAction } from "./layout.actions";
import { useEditorStore } from "./layout.stores";

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

export const useGetMarkdownData = () => {
  const { setMarkdownData } = useEditorStore();

  const query = useQuery({
    queryKey: ["markdownData"],
    queryFn: async () => {
      const { data, error } = await getMarkdownDataAction();
      if (error) throw new Error(error);
      if (!data) throw new Error("No markdown data received");
      setMarkdownData(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
};