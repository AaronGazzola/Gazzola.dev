import { create } from "zustand";
import { getBrowserAPI } from "@/lib/env.utils";
import { type DomainBrand } from "@/lib/domain.config";

interface SubdomainState {
  variant: "default" | "az";
  isAzVariant: boolean;
  brand: DomainBrand;
  isAzAnything: boolean;
}

const getCookie = (name: string): string | null => {
  const document = getBrowserAPI(() => globalThis.document);
  if (!document) return null;

  const cookies = document.cookie;
  const match = cookies.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1] || null;
};

const getSubdomainVariant = (): "default" | "az" => {
  const variant = getCookie("subdomain-variant") as "default" | "az" | null;
  return variant || "default";
};

const getDomainBrand = (): DomainBrand => {
  const brand = getCookie("domain-brand") as DomainBrand | null;
  return brand || "gazzola";
};

export const useSubdomainStore = create<SubdomainState>()(() => {
  const variant = getSubdomainVariant();
  const brand = getDomainBrand();

  return {
    variant,
    isAzVariant: variant === "az",
    brand,
    isAzAnything: brand === "azanything",
  };
});
