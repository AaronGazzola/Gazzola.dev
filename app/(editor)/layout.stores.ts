import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ContentPath, EditorState, markdownContent } from "./layout.data";

const initialState = {
  ...markdownContent,
  darkMode: false,
  refreshKey: 0,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,
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
      reset: () => {
        const currentState = get();
        set({
          ...initialState,
          darkMode: currentState.darkMode, // Preserve the current theme
          refreshKey: currentState.refreshKey + 1, // Increment to force refresh
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
