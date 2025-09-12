import { create } from "zustand";
import { persist } from "zustand/middleware";
import { markdownData } from "./layout.data";
import { EditorState, MarkdownData } from "./layout.types";

const initialState = {
  data: markdownData,
  darkMode: false,
  refreshKey: 0,
  visitedPages: ["welcome"],
  sectionSelections: {},
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateContent: (path: string, content: string) => {
        set((state) => {
          const node = state.data.flatIndex[path];
          if (node && node.type === "file") {
            node.content = content;
          }
          return { data: { ...state.data } };
        });
      },
      setContent: (path: string, content: string) => {
        set((state) => {
          const node = state.data.flatIndex[path];
          if (node && node.type === "file") {
            node.content = content;
          }
          return { data: { ...state.data } };
        });
      },
      getNode: (path: string) => {
        const state = get();
        return state.data.flatIndex[path] || null;
      },
      setDarkMode: (darkMode) => set({ darkMode }),
      markPageVisited: (path) =>
        set((state) => ({
          visitedPages: state.visitedPages.includes(path)
            ? state.visitedPages
            : [...state.visitedPages, path],
        })),
      isPageVisited: (path) => {
        const state = get();
        return state.visitedPages.includes(path);
      },
      getNextUnvisitedPage: (currentPath) => {
        const state = get();
        const pages = Object.values(state.data.flatIndex)
          .filter((node) => node.type === "file")
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const currentIndex = pages.findIndex((p) => p.path === currentPath);
        for (let i = currentIndex + 1; i < pages.length; i++) {
          if (!state.visitedPages.includes(pages[i].path)) {
            return pages[i].path;
          }
        }
        return null;
      },
      getSectionOptions: (sectionId: string) => {
        const state = get();
        const welcomeNode = state.data.flatIndex["welcome"];
        if (welcomeNode && welcomeNode.type === "file") {
          return welcomeNode.sections[sectionId] || {};
        }
        return {};
      },
      getSectionContent: (sectionId: string, optionId: string) => {
        const state = get();
        const welcomeNode = state.data.flatIndex["welcome"];
        if (welcomeNode && welcomeNode.type === "file") {
          return welcomeNode.sections[sectionId]?.[optionId] || "";
        }
        return "";
      },
      setSectionContent: (
        sectionId: string,
        optionId: string,
        content: string
      ) => {
        set((state) => {
          const welcomeNode = state.data.flatIndex["welcome"];
          if (welcomeNode && welcomeNode.type === "file") {
            if (!welcomeNode.sections[sectionId]) {
              welcomeNode.sections[sectionId] = {};
            }
            welcomeNode.sections[sectionId][optionId] = content;
          }
          return { data: { ...state.data } };
        });
      },
      setSectionSelection: (sectionId: string, optionId: string) => {
        set((state) => ({
          sectionSelections: {
            ...state.sectionSelections,
            [sectionId]: optionId,
          },
        }));
      },
      getSectionSelection: (sectionId: string) => {
        const state = get();
        return state.sectionSelections[sectionId] || null;
      },
      reset: () => set(initialState),
      forceRefresh: () =>
        set((state) => ({ refreshKey: state.refreshKey + 1 })),
    }),
    {
      name: "editor-storage",
      partialize: (state) => ({
        data: state.data,
        darkMode: state.darkMode,
        visitedPages: state.visitedPages,
        sectionSelections: state.sectionSelections,
      }),
    }
  )
);
