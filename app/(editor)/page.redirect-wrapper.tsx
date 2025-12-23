"use client";

import { useEditorStore } from "./layout.stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useContentVersionCheck, useInitializeMarkdownData } from "./layout.hooks";

const PageRedirectWrapper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useEditorStore();
  const { versionChecked, isLoading: versionCheckLoading } = useContentVersionCheck();
  const { isInitialized, isLoading } = useInitializeMarkdownData(versionChecked, versionCheckLoading);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const pages = Object.values(data.flatIndex)
      .filter(
        (node) =>
          node.type === "file" &&
          node.include !== false &&
          !(node as any).previewOnly &&
          !(node as any).visibleAfterPage
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (pages.length === 0) {
      throw new Error("No valid pages found in markdown data");
    }

    const firstPageUrl = pages[0].urlPath;
    if (!firstPageUrl) {
      throw new Error("First page has no urlPath");
    }

    const queryStr = searchParams.toString();
    const redirectUrl = queryStr ? `${firstPageUrl}?${queryStr}` : firstPageUrl;

    router.replace(redirectUrl);
  }, [data, router, searchParams, isInitialized, isLoading]);

  return null;
};

export default PageRedirectWrapper;
