export interface LayoutInput {
  id: string;
  name: string;
  description: string;
}

export interface PageInput {
  id: string;
  name: string;
  route: string;
  description: string;
  layoutIds: string[];
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
  lastGeneratedForReadme: string | null;
}

export interface PageGenerationAIResponse {
  layouts?: Array<{
    name: string;
    description: string;
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
