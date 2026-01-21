import { create } from "zustand";
import { getBrowserAPI } from "@/lib/env.utils";

interface SubdomainState {
  variant: "default" | "az";
  isAzVariant: boolean;
}

const getSubdomainVariant = (): "default" | "az" => {
  const document = getBrowserAPI(() => globalThis.document);
  if (!document) return "default";

  const cookies = document.cookie;
  const match = cookies.match(/subdomain-variant=([^;]+)/);
  const variant = match?.[1] as "default" | "az" | undefined;

  return variant || "default";
};

export const useSubdomainStore = create<SubdomainState>()(() => {
  const variant = getSubdomainVariant();
  return {
    variant,
    isAzVariant: variant === "az",
  };
});
