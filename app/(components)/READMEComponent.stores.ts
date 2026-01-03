import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type AuthMethods,
  type PageAccess,
  type PageInput,
  type READMEState,
  type Stage,
  initialAuthMethods,
} from "./READMEComponent.types";

const getInitialState = (): READMEState => ({
  title: "",
  description: "",
  pages: [],
  authMethods: initialAuthMethods,
  pageAccess: [],
  stage: "description",
  lastGeneratedForAuth: null,
  lastGeneratedForPages: null,
  lastGeneratedForReadme: null,
});

interface READMEStore extends READMEState {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStage: (stage: Stage) => void;
  setPages: (pages: PageInput[]) => void;
  addPage: (page: PageInput) => void;
  updatePage: (id: string, updates: Partial<PageInput>) => void;
  deletePage: (id: string) => void;
  setAuthMethods: (authMethods: AuthMethods) => void;
  toggleAuthMethod: (method: keyof AuthMethods) => void;
  setPageAccess: (pageAccess: PageAccess[]) => void;
  updatePageAccess: (pageId: string, level: "public" | "user" | "admin", value: boolean) => void;
  setLastGeneratedForAuth: (data: { title: string; description: string } | null) => void;
  setLastGeneratedForPages: (authMethods: AuthMethods | null) => void;
  setLastGeneratedForReadme: (pagesSnapshot: string | null) => void;
  reset: () => void;
}

export const useREADMEStore = create<READMEStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setStage: (stage) => set({ stage }),

      setPages: (pages) => set({ pages }),
      addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
      updatePage: (id, updates) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePage: (id) =>
        set((state) => ({
          pages: state.pages.filter((p) => p.id !== id),
        })),

      setAuthMethods: (authMethods) => set({ authMethods }),
      toggleAuthMethod: (method) =>
        set((state) => ({
          authMethods: {
            ...state.authMethods,
            [method]: !state.authMethods[method],
          },
        })),

      setPageAccess: (pageAccess) => set({ pageAccess }),
      updatePageAccess: (pageId, level, value) =>
        set((state) => {
          const existing = state.pageAccess.find((pa) => pa.pageId === pageId);

          if (!existing) {
            return {
              pageAccess: [
                ...state.pageAccess,
                {
                  pageId,
                  public: level === "public" ? value : false,
                  user: level === "user" ? value : false,
                  admin: level === "admin" ? value : false,
                },
              ],
            };
          }

          return {
            pageAccess: state.pageAccess.map((pa) =>
              pa.pageId === pageId
                ? {
                    ...pa,
                    public: level === "public" ? value : (value ? false : pa.public),
                    user: level === "user" ? value : pa.user,
                    admin: level === "admin" ? value : pa.admin,
                  }
                : pa
            ),
          };
        }),

      setLastGeneratedForAuth: (data) => set({ lastGeneratedForAuth: data }),
      setLastGeneratedForPages: (authMethods) => set({ lastGeneratedForPages: authMethods }),
      setLastGeneratedForReadme: (pagesSnapshot) => set({ lastGeneratedForReadme: pagesSnapshot }),

      reset: () => set(getInitialState()),
    }),
    {
      name: "readme-store",
    }
  )
);
