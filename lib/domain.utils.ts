import { DOMAIN_CONFIGS, type DomainBrand } from "./domain.config";

export function parseDomain(hostname: string): {
  brand: DomainBrand;
  rootDomain: string;
  subdomain: string;
  variant: "default" | "az";
} {
  const parts = hostname.split(".");
  const rootDomain = parts.slice(-2).join(".");
  const subdomain = parts.length > 2 ? parts[0] : "";

  const brand: DomainBrand =
    rootDomain === "azanything.dev" ? "azanything" : "gazzola";

  const variant = subdomain === "az" && brand === "gazzola" ? "az" : "default";

  return { brand, rootDomain, subdomain, variant };
}

export function getDomainConfig(brand: DomainBrand) {
  return DOMAIN_CONFIGS[brand];
}

export function getDomainConfigFromHostname(hostname: string) {
  const { brand } = parseDomain(hostname);
  return getDomainConfig(brand);
}
