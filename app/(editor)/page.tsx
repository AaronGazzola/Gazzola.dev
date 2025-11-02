"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getMarkdownDataAction } from "./layout.actions";

const RedirectComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const redirectToFirstPage = async () => {
      if (isRedirecting) return;
      setIsRedirecting(true);

      try {
        const { data, error } = await getMarkdownDataAction();
        if (!data || error) {
          throw new Error(
            "Failed to load markdown data: " + (error || "Unknown error")
          );
        }

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

        const queryString = searchParams.toString();
        const redirectUrl = queryString
          ? `${firstPageUrl}?${queryString}`
          : firstPageUrl;

        router.replace(redirectUrl);
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };

    redirectToFirstPage();
  }, [router, searchParams, isRedirecting]);

  return null;
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <RedirectComponent />
    </Suspense>
  );
};

export default Page;
