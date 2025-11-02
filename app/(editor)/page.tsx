import { redirect } from "next/navigation";
import { getMarkdownDataAction } from "./layout.actions";

const getFirstPageUrl = async (): Promise<string> => {
  const { data, error } = await getMarkdownDataAction();
  if (!data || error) {
    throw new Error("Failed to load markdown data: " + (error || "Unknown error"));
  }

  const pages = Object.values(data.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false && !(node as any).previewOnly && !(node as any).visibleAfterPage)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (pages.length === 0) {
    throw new Error("No valid pages found in markdown data");
  }

  const firstPageUrl = pages[0].urlPath;
  if (!firstPageUrl) {
    throw new Error("First page has no urlPath");
  }

  return firstPageUrl;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const firstPageUrl = await getFirstPageUrl();
  const params = await searchParams;

  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => queryString.append(key, v));
      } else {
        queryString.append(key, value);
      }
    }
  });

  const queryStr = queryString.toString();
  const redirectUrl = queryStr ? `${firstPageUrl}?${queryStr}` : firstPageUrl;

  redirect(redirectUrl);
};

export default page;
