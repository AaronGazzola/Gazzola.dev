export interface PageInput {
  id: string;
  name: string;
  route: string;
  description: string;
}

export type Stage = "description" | "pages" | "auth" | "database";

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
  phoneAuth: boolean;
  otp: boolean;
  googleAuth: boolean;
  githubAuth: boolean;
  appleAuth: boolean;
  emailVerification: boolean;
  mfa: boolean;
}

export interface DatabaseTable {
  id: string;
  name: string;
  description: string;
}

export interface READMEState {
  title: string;
  description: string;
  pages: PageInput[];
  authMethods: AuthMethods;
  pageAccess: PageAccess[];
  databaseTables: DatabaseTable[];
  stage: Stage;
  showPasteSection: boolean;
  pastedReadme: string;
}

export interface PageGenerationAIResponse {
  pages: Array<{
    name: string;
    route: string;
    description: string;
  }>;
}

export interface AuthGenerationAIResponse {
  authMethods: AuthMethods;
  pageAccess: Array<{
    pageId: string;
    public: boolean;
    user: boolean;
    admin: boolean;
  }>;
}

export interface DatabaseGenerationAIResponse {
  tables: Array<{
    name: string;
    description: string;
  }>;
}

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const initialAuthMethods: AuthMethods = {
  emailPassword: false,
  magicLink: false,
  phoneAuth: false,
  otp: false,
  googleAuth: false,
  githubAuth: false,
  appleAuth: false,
  emailVerification: false,
  mfa: false,
};

export const initialState: READMEState = {
  title: "",
  description: "",
  pages: [],
  authMethods: initialAuthMethods,
  pageAccess: [],
  databaseTables: [],
  stage: "description",
  showPasteSection: false,
  pastedReadme: "",
};
