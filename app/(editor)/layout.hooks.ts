"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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
  const { data, storedContentVersion, setMarkdownData, forceRefresh } = useEditorStore();
  const { data: markdownData, isLoading, error, refetch } = useGetMarkdownData();

  const hasDefaultData = data.root.id === "root" &&
    data.root.children.length === 0 &&
    Object.keys(data.flatIndex).length === 1 &&
    data.contentVersion === 1;

  const needsInitialization = hasDefaultData || !data.root.children.length;

  useEffect(() => {
    if (needsInitialization && markdownData && !isLoading && !error) {
      setMarkdownData(markdownData);
      forceRefresh();
    }
  }, [needsInitialization, markdownData, isLoading, error, setMarkdownData, forceRefresh]);

  return {
    needsInitialization,
    isLoading: needsInitialization ? isLoading : false,
    error,
    isInitialized: !needsInitialization || (!isLoading && !error && !!markdownData),
    refetch,
  };
};