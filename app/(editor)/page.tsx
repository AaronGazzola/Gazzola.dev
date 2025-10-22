import { redirect } from "next/navigation";
import { getMarkdownDataAction } from "./layout.actions";

const getFirstPageUrl = async (): Promise<string | null> => {
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

  return pages[0].urlPath;
};

const page = async () => {
  const firstPageUrl = await getFirstPageUrl();
  redirect(firstPageUrl);
};

export default page;
