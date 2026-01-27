export type DomainBrand = "gazzola" | "azanything";

export interface DomainConfig {
  brand: DomainBrand;
  displayName: string;
  rootDomain: string;
  defaultUrl: string;
  azUrl: string | null;
  resendApiKey: string;
  adminEmail: string;
  metadata: {
    title: string;
    description: string;
    logoAlt: string;
  };
  api: {
    referer: string;
    title: string;
  };
  email: {
    fromName: string;
  };
  ui: {
    sidebarTitle: string;
    creditDepletionMessage: string;
    starterKitReference: string;
  };
}

export const DOMAIN_CONFIGS: Record<DomainBrand, DomainConfig> = {
  gazzola: {
    brand: "gazzola",
    displayName: "Gazzola.dev",
    rootDomain: "gazzola.dev",
    defaultUrl: "https://gazzola.dev",
    azUrl: "https://az.gazzola.dev",
    resendApiKey: process.env.RESEND_API_KEY || "",
    adminEmail: process.env.ADMIN_EMAIL || "az@gazzola.dev",
    metadata: {
      title: "Gazzola.dev | Web App Starter Kit Generator",
      description:
        "Generate customized starter kits for building full-stack web apps with AI assistance. Download complete configuration files including database schema, app structure, theme settings, and step-by-step implementation plans for Claude Code.",
      logoAlt: "Gazzola development logo",
    },
    api: {
      referer: "https://gazzola.dev",
      title: "Gazzola.dev Code Generator",
    },
    email: {
      fromName: "Gazzola.dev Alerts",
    },
    ui: {
      sidebarTitle: "Gazzola.dev",
      creditDepletionMessage:
        "Gazzola.dev has become so popular that we've temporarily run out of AI generation credits!",
      starterKitReference: "Gazzola.dev",
    },
  },
  azanything: {
    brand: "azanything",
    displayName: "AzAnything.dev",
    rootDomain: "azanything.dev",
    defaultUrl: "https://azanything.dev",
    azUrl: null,
    resendApiKey: process.env.RESEND_API_KEY_AZANYTHING || "",
    adminEmail: process.env.ADMIN_EMAIL_AZANYTHING || "admin@azanything.dev",
    metadata: {
      title: "AzAnything.dev | Web App Starter Kit Generator",
      description:
        "Generate customized starter kits for building full-stack web apps with AI assistance. Download complete configuration files including database schema, app structure, theme settings, and step-by-step implementation plans for Claude Code.",
      logoAlt: "AzAnything development logo",
    },
    api: {
      referer: "https://azanything.dev",
      title: "AzAnything.dev Code Generator",
    },
    email: {
      fromName: "AzAnything.dev Alerts",
    },
    ui: {
      sidebarTitle: "AzAnything.dev",
      creditDepletionMessage:
        "AzAnything.dev has become so popular that we've temporarily run out of AI generation credits!",
      starterKitReference: "AzAnything.dev",
    },
  },
};
