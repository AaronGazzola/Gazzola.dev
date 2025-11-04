"use client";

import { conditionalLog } from "@/lib/log.util";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getContentVersionAction, getMarkdownDataAction } from "./layout.actions";
import { useEditorStore } from "./layout.stores";

export const useContentVersion = () => {
  return useQuery({
    queryKey: ["contentVersion"],
    queryFn: async () => {
      conditionalLog("useContentVersion: queryFn starting", { label: "markdown-parse" });
      const { data, error } = await getContentVersionAction();
      if (error) {
        conditionalLog({ error: String(error) }, { label: "markdown-parse" });
        throw error;
      }
      conditionalLog({ version: data || 1 }, { label: "markdown-parse" });
      return data || 1;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
  });
};

export const useGetMarkdownData = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["markdownData"],
    queryFn: async () => {
      conditionalLog("useGetMarkdownData: queryFn starting", { label: "markdown-parse" });
      const { data, error } = await getMarkdownDataAction();
      if (error) {
        conditionalLog({ error: String(error) }, { label: "markdown-parse" });
        throw new Error(error);
      }
      if (!data) {
        conditionalLog("useGetMarkdownData: No data received", { label: "markdown-parse" });
        throw new Error("No markdown data received");
      }
      conditionalLog({
        nodeCount: Object.keys(data.flatIndex).length,
        contentVersion: data.contentVersion
      }, { label: "markdown-parse" });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  return query;
};

export const useInitializeMarkdownData = (versionChecked: boolean, versionCheckLoading: boolean) => {
  const { data, storedContentVersion, setMarkdownData, forceRefresh } = useEditorStore();
  const shouldFetchData = versionChecked && !versionCheckLoading;
  const { data: markdownData, isLoading, error, refetch } = useGetMarkdownData(shouldFetchData);

  const hasDefaultData = data.root.id === "root" &&
    data.root.children.length === 0 &&
    Object.keys(data.flatIndex).length === 1 &&
    data.contentVersion === 1;

  const needsInitialization = hasDefaultData || !data.root.children.length;

  useEffect(() => {
    conditionalLog({
      versionChecked,
      versionCheckLoading,
      shouldFetchData,
      needsInitialization,
      hasMarkdownData: !!markdownData,
      isLoading,
      hasError: !!error,
      dataNodeCount: Object.keys(data.flatIndex).length,
      dataVersion: data.contentVersion
    }, { label: "markdown-parse" });

    if (shouldFetchData && needsInitialization && markdownData && !isLoading && !error) {
      conditionalLog("useInitializeMarkdownData: Setting markdown data", { label: "markdown-parse" });
      setMarkdownData(markdownData);
      forceRefresh();
    }
  }, [shouldFetchData, versionChecked, versionCheckLoading, needsInitialization, markdownData, isLoading, error, setMarkdownData, forceRefresh, data]);

  return {
    needsInitialization,
    isLoading: (needsInitialization && isLoading) || versionCheckLoading,
    error,
    isInitialized: !needsInitialization || (!isLoading && !error && !!markdownData && !versionCheckLoading),
    refetch,
  };
};

export const useContentVersionCheck = () => {
  const queryClient = useQueryClient();
  const { data: currentVersion } = useContentVersion();
  const { storedContentVersion, setMarkdownData, reset, setRefreshKey } = useEditorStore();
  const [isResetting, setIsResetting] = useState(false);
  const [versionChecked, setVersionChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isContentStale = currentVersion !== undefined &&
    storedContentVersion !== undefined &&
    storedContentVersion !== currentVersion;

  useEffect(() => {
    conditionalLog({
      isContentStale,
      currentVersion,
      storedContentVersion,
      isResetting,
      versionChecked,
      isLoading
    }, { label: "markdown-parse" });

    const resetContent = async () => {
      if (currentVersion === undefined) {
        conditionalLog("useContentVersionCheck: Waiting for version", { label: "markdown-parse" });
        setIsLoading(true);
        return;
      }

      if (versionChecked) {
        conditionalLog("useContentVersionCheck: Already checked", { label: "markdown-parse" });
        setIsLoading(false);
        return;
      }

      if (!isContentStale) {
        conditionalLog("useContentVersionCheck: Content not stale, marking checked", { label: "markdown-parse" });
        setVersionChecked(true);
        setIsLoading(false);
        return;
      }

      if (isResetting) {
        conditionalLog("useContentVersionCheck: Already resetting", { label: "markdown-parse" });
        return;
      }

      conditionalLog("useContentVersionCheck: Starting reset", { label: "markdown-parse" });
      setIsResetting(true);
      setIsLoading(true);

      try {
        const { data: freshData, error } = await getMarkdownDataAction();

        if (error) {
          conditionalLog({ parseError: String(error) }, { label: "markdown-parse" });
          setVersionChecked(true);
          setIsLoading(false);
          return;
        }

        if (freshData && currentVersion) {
          conditionalLog({
            freshDataNodeCount: Object.keys(freshData.flatIndex).length,
            freshDataVersion: freshData.contentVersion,
            currentVersion
          }, { label: "markdown-parse" });

          queryClient.invalidateQueries({ queryKey: ["markdownData"] });
          queryClient.invalidateQueries({ queryKey: ["contentVersion"] });

          const resetKey = Date.now();

          const updatedData = {
            ...freshData,
            contentVersion: currentVersion,
          };

          conditionalLog("useContentVersionCheck: Setting markdown data in store", { label: "markdown-parse" });
          setMarkdownData(updatedData);
          reset();
          setRefreshKey(resetKey);
          setVersionChecked(true);
          setIsLoading(false);
          conditionalLog({ resetKey, message: "Content updated successfully" }, { label: "markdown-parse" });
        }
      } catch (error) {
        conditionalLog({ resetError: String(error) }, { label: "markdown-parse" });
        setVersionChecked(true);
        setIsLoading(false);
      } finally {
        setIsResetting(false);
      }
    };

    resetContent();
  }, [isContentStale, currentVersion, storedContentVersion, versionChecked, isResetting, isLoading, queryClient, reset, setMarkdownData, setRefreshKey]);

  return {
    isResetting,
    isContentStale,
    versionChecked,
    isLoading,
  };
};