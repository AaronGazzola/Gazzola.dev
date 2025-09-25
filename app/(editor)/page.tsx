import { redirect } from "next/navigation";
import { getMarkdownDataAction } from "./layout.actions";

const getFirstPageUrl = async (): Promise<string> => {
  const { data } = await getMarkdownDataAction();
  if (!data) return "/";

  const pages = Object.values(data.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].urlPath : "/";
};

const page = async () => {
  const firstPageUrl = await getFirstPageUrl();
  redirect(firstPageUrl);
};

export default page;
