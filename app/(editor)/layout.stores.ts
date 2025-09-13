import { create } from "zustand";
import { persist } from "zustand/middleware";
import { markdownData } from "./layout.data";
import { EditorState, FileSystemEntry, MarkdownData } from "./layout.types";

const generateId = () => Math.random().toString(36).substring(2, 11);

const defaultAppStructure: FileSystemEntry[] = [
  {
    id: generateId(),
    name: "app",
    type: "directory",
    isExpanded: true,
    children: [
      {
        id: generateId(),
        name: "(auth)",
        type: "directory",
        isExpanded: false,
        children: [
          {
            id: generateId(),
            name: "login",
            type: "directory",
            isExpanded: false,
            children: [{ id: generateId(), name: "page.tsx", type: "file" }],
          },
          {
            id: generateId(),
            name: "register",
            type: "directory",
            isExpanded: false,
            children: [{ id: generateId(), name: "page.tsx", type: "file" }],
          },
        ],
      },
      {
        id: generateId(),
        name: "api",
        type: "directory",
        isExpanded: false,
        children: [],
      },
      { id: generateId(), name: "layout.tsx", type: "file" },
      { id: generateId(), name: "page.tsx", type: "file" },
    ],
  },
];

const updateNode = (
  nodes: FileSystemEntry[],
  id: string,
  updates: Partial<FileSystemEntry>
): FileSystemEntry[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNode(node.children, id, updates),
      };
    }
    return node;
  });
};

const updateNodeIncludeRecursively = (
  node: any,
  include: boolean
): any => {
  const updated = { ...node, include };
  if (node.children) {
    updated.children = node.children.map((child: any) =>
      updateNodeIncludeRecursively(child, include)
    );
  }
  return updated;
};

const deleteNode = (
  nodes: FileSystemEntry[],
  id: string
): FileSystemEntry[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: deleteNode(node.children, id),
        };
      }
      return node;
    });
};

const addNode = (
  nodes: FileSystemEntry[],
  parentId: string,
  newNode: FileSystemEntry
): FileSystemEntry[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      const children = node.children || [];
      return {
        ...node,
        children: [...children, newNode],
        isExpanded: true,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode),
      };
    }
    return node;
  });
};

const initialState = {
  data: markdownData,
  darkMode: false,
  refreshKey: 0,
  visitedPages: ["welcome"],
  sectionSelections: {},
  appStructure: defaultAppStructure,
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
          .filter((node) => node.type === "file" && node.include !== false)
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
      setAppStructure: (appStructure: FileSystemEntry[]) =>
        set({ appStructure }),
      updateAppStructureNode: (id: string, updates: Partial<FileSystemEntry>) => {
        set((state) => ({
          appStructure: updateNode(state.appStructure, id, updates),
        }));
      },
      deleteAppStructureNode: (id: string) => {
        set((state) => ({
          appStructure: deleteNode(state.appStructure, id),
        }));
      },
      addAppStructureNode: (parentId: string, newNode: FileSystemEntry) => {
        set((state) => ({
          appStructure: addNode(state.appStructure, parentId, newNode),
        }));
      },
      updateInclusionRules: (inclusionConfig: Record<string, boolean>) => {
        set((state) => {
          let newFlatIndex = { ...state.data.flatIndex };
          let newRoot = { ...state.data.root };

          const updateFlatIndexRecursively = (node: any) => {
            newFlatIndex[node.path] = node;
            if (node.children) {
              node.children.forEach(updateFlatIndexRecursively);
            }
          };

          const updateRootChildren = (children: any[]): any[] => {
            return children.map((child) => {
              if (inclusionConfig.hasOwnProperty(child.path)) {
                const updatedChild = updateNodeIncludeRecursively(child, inclusionConfig[child.path]);
                updateFlatIndexRecursively(updatedChild);
                return updatedChild;
              }
              return child;
            });
          };

          newRoot = {
            ...newRoot,
            children: updateRootChildren(newRoot.children),
          };

          newFlatIndex[""] = newRoot;

          return {
            data: {
              ...state.data,
              root: newRoot,
              flatIndex: newFlatIndex,
            },
          };
        });
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
        appStructure: state.appStructure,
      }),
    }
  )
);
