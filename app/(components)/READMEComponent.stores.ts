import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type AuthMethods,
  type LayoutInput,
  type PageAccess,
  type PageInput,
  type READMEState,
  type ReadmeSnapshot,
  type Stage,
  initialAuthMethods,
} from "./READMEComponent.types";

const getInitialState = (): READMEState => ({
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
});

interface READMEStore extends READMEState {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStage: (stage: Stage) => void;
  setLayouts: (layouts: LayoutInput[]) => void;
  addLayout: (layout: LayoutInput) => void;
  updateLayout: (id: string, updates: Partial<LayoutInput>) => void;
  deleteLayout: (id: string) => void;
  setPages: (pages: PageInput[]) => void;
  addPage: (page: PageInput) => void;
  updatePage: (id: string, updates: Partial<PageInput>) => void;
  deletePage: (id: string) => void;
  setAuthMethods: (authMethods: AuthMethods) => void;
  toggleAuthMethod: (method: keyof AuthMethods) => void;
  setPageAccess: (pageAccess: PageAccess[]) => void;
  updatePageAccess: (pageId: string, level: "anon" | "auth" | "admin", value: boolean) => void;
  setLastGeneratedForAuth: (data: { title: string; description: string } | null) => void;
  setLastGeneratedForPages: (authMethods: AuthMethods | null) => void;
  setLastGeneratedForReadme: (snapshot: ReadmeSnapshot | null) => void;
  reset: () => void;
}

export const useREADMEStore = create<READMEStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setStage: (stage) => set({ stage }),

      setLayouts: (layouts) => set({ layouts }),
      addLayout: (layout) => set((state) => ({ layouts: [...state.layouts, layout] })),
      updateLayout: (id, updates) =>
        set((state) => ({
          layouts: state.layouts.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deleteLayout: (id) =>
        set((state) => ({
          layouts: state.layouts.filter((l) => l.id !== id),
          pages: state.pages.map((p) => ({
            ...p,
            layoutIds: p.layoutIds.filter((layoutId) => layoutId !== id),
          })),
        })),

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
                  anon: level === "anon" ? value : false,
                  auth: level === "auth" ? value : false,
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
                    [level]: value,
                  }
                : pa
            ),
          };
        }),

      setLastGeneratedForAuth: (data) => set({ lastGeneratedForAuth: data }),
      setLastGeneratedForPages: (authMethods) => set({ lastGeneratedForPages: authMethods }),
      setLastGeneratedForReadme: (snapshot) => set({ lastGeneratedForReadme: snapshot }),

      reset: () => set(getInitialState()),
    }),
    {
      name: "readme-store",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          if (!persistedState.layouts) {
            persistedState.layouts = [];
          }
          if (persistedState.pages) {
            persistedState.pages = persistedState.pages.map((page: any) => ({
              ...page,
              layoutIds: page.layoutIds || [],
            }));
          }
          if (persistedState.pageAccess) {
            persistedState.pageAccess = persistedState.pageAccess.map((access: any) => {
              const newAccess: any = { pageId: access.pageId };
              if (access.public !== undefined) {
                newAccess.anon = access.public;
              }
              if (access.user !== undefined) {
                newAccess.auth = access.user;
              }
              if (access.admin !== undefined) {
                newAccess.admin = access.admin;
              }
              return newAccess;
            });
          }
        }
        return persistedState as READMEState;
      },
    }
  )
);
