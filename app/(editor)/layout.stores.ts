import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  ContentPath,
  EditorState,
  getAllPagesInOrder,
  markdownContent,
} from "./layout.data";

const initialState = markdownContent;

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      darkMode: false,
      refreshKey: 0,
      visitedPages: ["welcome" as ContentPath],
      setContent: (path: ContentPath, content: string) => {
        set((state) => {
          const newState = { ...state };
          const pathParts = path.split(".");

          if (pathParts.length === 1) {
            (newState as any)[pathParts[0]] = content;
          } else if (pathParts.length === 2) {
            (newState as any)[pathParts[0]] = {
              ...(newState as any)[pathParts[0]],
              [pathParts[1]]: content,
            };
          }

          return newState;
        });
      },
      getContent: (path: ContentPath): string => {
        const state = get();
        const pathParts = path.split(".");

        if (pathParts.length === 1) {
          return (state as any)[pathParts[0]] || "";
        } else if (pathParts.length === 2) {
          return (state as any)[pathParts[0]]?.[pathParts[1]] || "";
        }

        return "";
      },
      setDarkMode: (darkMode: boolean) => set({ darkMode }),
      markPageVisited: (path: ContentPath) => {
        set((state) => ({
          visitedPages: state.visitedPages.includes(path)
            ? state.visitedPages
            : [...state.visitedPages, path],
        }));
      },
      isPageVisited: (path: ContentPath): boolean => {
        const state = get();
        return state.visitedPages.includes(path);
      },
      getNextUnvisitedPage: (currentPath: ContentPath): ContentPath | null => {
        const allPages = getAllPagesInOrder();
        const currentIndex = allPages.findIndex(
          (page) => page.path === currentPath
        );
        if (currentIndex === -1 || currentIndex >= allPages.length - 1)
          return null;

        const nextPage = allPages[currentIndex + 1];
        return nextPage.path;
      },
      reset: () => {
        const currentState = get();
        set({
          ...initialState,
          darkMode: currentState.darkMode,
          refreshKey: currentState.refreshKey + 1,
          visitedPages: ["welcome" as ContentPath],
        });
      },
      forceRefresh: () => {
        const currentState = get();
        set({ refreshKey: currentState.refreshKey + 1 });
      },
    }),
    {
      name: "editor-store",
    }
  )
);
