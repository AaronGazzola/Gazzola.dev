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
  const query = useQuery({
    queryKey: ["markdownData"],
    queryFn: async () => {
      const { data, error } = await getMarkdownDataAction();
      if (error) throw new Error(error);
      if (!data) throw new Error("No markdown data received");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export const useInitializeMarkdownData = () => {
  const { data, storedContentVersion, setMarkdownData } = useEditorStore();
  const { data: markdownData, isLoading, error } = useGetMarkdownData();

  const needsInitialization = !data.root.children.length || data.contentVersion === 1;

  if (needsInitialization && markdownData && !isLoading) {
    setMarkdownData(markdownData);
  }

  return {
    needsInitialization,
    isLoading,
    error,
    isInitialized: !needsInitialization && !isLoading && !error,
  };
};