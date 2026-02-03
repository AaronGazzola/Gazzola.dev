export interface LayoutOptions {
  header: {
    enabled: boolean;
    title: boolean;
    navigationItems: boolean;
    profileAvatarPopover: boolean;
    sticky: boolean;
    sidebarToggleButton: boolean;
  };
  leftSidebar: {
    enabled: boolean;
    title: boolean;
    navigationItems: boolean;
    profileAvatarPopover: boolean;
  };
  rightSidebar: {
    enabled: boolean;
    title: boolean;
    navigationItems: boolean;
    profileAvatarPopover: boolean;
  };
  footer: {
    enabled: boolean;
    title: boolean;
    allNavItems: boolean;
    legalNavItems: boolean;
  };
}

export interface LayoutInput {
  id: string;
  name: string;
  options: LayoutOptions;
}

export interface PageInput {
  id: string;
  name: string;
  route: string;
  description: string;
  layoutIds: string[];
  isAuthRequired?: boolean;
  isCompliancePage?: boolean;
}

export type Stage = "description" | "auth" | "pages";

export type PageAccessLevel = "anon" | "auth" | "admin";

export interface PageAccess {
  pageId: string;
  anon: boolean;
  auth: boolean;
  admin: boolean;
}

export interface AuthMethods {
  emailPassword: boolean;
  magicLink: boolean;
}

export interface ReadmeSnapshot {
  title: string;
  description: string;
  authMethods: AuthMethods;
  layouts: LayoutInput[];
  pages: PageInput[];
}

export interface READMEState {
  title: string;
  description: string;
  layouts: LayoutInput[];
  pages: PageInput[];
  authMethods: AuthMethods;
  pageAccess: PageAccess[];
  stage: Stage;
  lastGeneratedForAuth: { title: string; description: string } | null;
  lastGeneratedForPages: AuthMethods | null;
  lastGeneratedForReadme: ReadmeSnapshot | null;
}

export interface PageGenerationAIResponse {
  layouts?: Array<{
    name: string;
    options: LayoutOptions;
  }>;
  pages: Array<{
    name: string;
    route: string;
    description: string;
    access: {
      anon: boolean;
      auth: boolean;
      admin: boolean;
    };
    layoutNames?: string[];
  }>;
}

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const getDefaultLayoutOptions = (): LayoutOptions => ({
  header: {
    enabled: false,
    title: false,
    navigationItems: false,
    profileAvatarPopover: false,
    sticky: false,
    sidebarToggleButton: false,
  },
  leftSidebar: {
    enabled: false,
    title: false,
    navigationItems: false,
    profileAvatarPopover: false,
  },
  rightSidebar: {
    enabled: false,
    title: false,
    navigationItems: false,
    profileAvatarPopover: false,
  },
  footer: {
    enabled: false,
    title: false,
    allNavItems: false,
    legalNavItems: false,
  },
});

export const initialAuthMethods: AuthMethods = {
  emailPassword: true,
  magicLink: false,
};

export const initialState: READMEState = {
  title: "",
  description: "",
  layouts: [],
  pages: [],
  authMethods: initialAuthMethods,
  pageAccess: [],
  stage: "description",
  lastGeneratedForAuth: null,
  lastGeneratedForPages: null,
  lastGeneratedForReadme: null,
};
