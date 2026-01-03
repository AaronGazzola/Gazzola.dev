export interface PageInput {
  id: string;
  name: string;
  route: string;
  description: string;
}

export type Stage = "description" | "auth" | "pages";

export type PageAccessLevel = "public" | "user" | "admin";

export interface PageAccess {
  pageId: string;
  public: boolean;
  user: boolean;
  admin: boolean;
}

export interface AuthMethods {
  emailPassword: boolean;
  magicLink: boolean;
}

export interface READMEState {
  title: string;
  description: string;
  pages: PageInput[];
  authMethods: AuthMethods;
  pageAccess: PageAccess[];
  stage: Stage;
  lastGeneratedForAuth: { title: string; description: string } | null;
  lastGeneratedForPages: AuthMethods | null;
  lastGeneratedForReadme: string | null;
}

export interface PageGenerationAIResponse {
  pages: Array<{
    name: string;
    route: string;
    description: string;
    access: {
      public: boolean;
      user: boolean;
      admin: boolean;
    };
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
  pages: [],
  authMethods: initialAuthMethods,
  pageAccess: [],
  stage: "description",
  lastGeneratedForAuth: null,
  lastGeneratedForPages: null,
  lastGeneratedForReadme: null,
};
