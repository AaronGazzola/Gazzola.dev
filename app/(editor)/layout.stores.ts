import { create } from "zustand";
import { persist } from "zustand/middleware";
import { markdownData } from "./layout.data";
import {
  EditorState,
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
} from "./layout.types";

const generateId = () => Math.random().toString(36).substring(2, 11);

const getFirstPagePath = (data: MarkdownData): string => {
  const pages = Object.values(data.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].path : "";
};

const defaultAppStructure: FileSystemEntry[] = [
  {
    id: generateId(),
    name: "app",
    type: "directory",
    isExpanded: true,
    children: [
      { id: generateId(), name: "layout.tsx", type: "file" },
      { id: generateId(), name: "page.tsx", type: "file" },
    ],
  },
];

const defaultInitialConfiguration: InitialConfigurationType = {
  technologies: {
    nextjs: true,
    tailwindcss: true,
    shadcn: true,
    zustand: true,
    reactQuery: true,
    supabase: false,
    prisma: true,
    betterAuth: false,
    postgresql: false,
    cypress: false,
    resend: false,
    stripe: false,
    paypal: false,
  },
  questions: {
    supabaseAuthOnly: false,
  },
  features: {
    authentication: {
      enabled: false,
      magicLink: false,
      emailPassword: true,
      googleAuth: false,
      githubAuth: false,
      appleAuth: false,
      facebookAuth: false,
    },
    admin: {
      enabled: false,
      basicAdmin: false,
      withOrganizations: false,
    },
    payments: {
      enabled: false,
      stripePayments: false,
      stripeSubscriptions: false,
      paypalPayments: false,
    },
    fileStorage: false,
    realTimeNotifications: false,
    emailSending: false,
  },
  database: {
    hosting: "supabase",
  },
};

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

const updateNodeIncludeRecursively = (node: any, include: boolean): any => {
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

const STORE_VERSION = 2;

const migrateSections = (data: any): any => {
  if (!data || !data.flatIndex) return data;

  const migratedData = JSON.parse(JSON.stringify(data));

  Object.values(migratedData.flatIndex).forEach((node: any) => {
    if (node.type === "file" && node.sections) {
      Object.keys(node.sections).forEach((sectionId) => {
        const section = node.sections[sectionId];
        Object.keys(section).forEach((optionId) => {
          const option = section[optionId];
          if (typeof option === "string") {
            section[optionId] = {
              content: option,
              include: false,
            };
          }
        });
      });
    }

    if (node.type === "segment" && node.options) {
      Object.keys(node.options).forEach((optionId) => {
        const option = node.options[optionId];
        if (typeof option === "string") {
          node.options[optionId] = {
            content: option,
            include: false,
          };
        }
      });
    }
  });

  return migratedData;
};

const initialState = {
  version: STORE_VERSION,
  data: markdownData,
  darkMode: true,
  refreshKey: 0,
  visitedPages: [getFirstPagePath(markdownData)],
  appStructure: defaultAppStructure,
  placeholderValues: {},
  initialConfiguration: defaultInitialConfiguration,
  storedContentVersion: markdownData.contentVersion,
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
      getSectionOptions: (filePath: string, sectionId: string) => {
        const state = get();
        const targetNode = state.data.flatIndex[filePath];
        if (targetNode && targetNode.type === "file") {
          return targetNode.sections[sectionId] || {};
        }
        return {};
      },
      getSectionContent: (
        filePath: string,
        sectionId: string,
        optionId: string
      ) => {
        const state = get();
        const targetNode = state.data.flatIndex[filePath];
        if (targetNode && targetNode.type === "file") {
          return targetNode.sections[sectionId]?.[optionId]?.content || "";
        }
        return "";
      },
      setSectionContent: (
        filePath: string,
        sectionId: string,
        optionId: string,
        content: string
      ) => {
        set((state) => {
          const targetNode = state.data.flatIndex[filePath];
          if (targetNode && targetNode.type === "file") {
            if (!targetNode.sections[sectionId]) {
              targetNode.sections[sectionId] = {};
            }
            if (!targetNode.sections[sectionId][optionId]) {
              targetNode.sections[sectionId][optionId] = {
                content: "",
                include: false,
              };
            }
            targetNode.sections[sectionId][optionId].content = content;
          }
          return { data: { ...state.data } };
        });
      },
      setSectionInclude: (
        filePath: string,
        sectionId: string,
        optionId: string,
        include: boolean
      ) => {
        set((state) => {
          const targetNode = state.data.flatIndex[filePath];
          if (targetNode && targetNode.type === "file") {
            if (!targetNode.sections[sectionId]) {
              targetNode.sections[sectionId] = {};
            }
            if (!targetNode.sections[sectionId][optionId]) {
              targetNode.sections[sectionId][optionId] = {
                content: "",
                include: false,
              };
            }
            targetNode.sections[sectionId][optionId].include = include;
          }
          return { data: { ...state.data } };
        });
      },
      getSectionInclude: (
        filePath: string,
        sectionId: string,
        optionId: string
      ) => {
        const state = get();
        const targetNode = state.data.flatIndex[filePath];
        if (targetNode && targetNode.type === "file") {
          const result =
            targetNode.sections[sectionId]?.[optionId]?.include || false;
          return result;
        }
        return false;
      },
      getPlaceholderValue: (key: string) => {
        const state = get();
        return state.placeholderValues[key] || null;
      },
      setPlaceholderValue: (key: string, value: string) => {
        set((state) => ({
          placeholderValues: {
            ...state.placeholderValues,
            [key]: value,
          },
        }));
      },
      setAppStructure: (appStructure: FileSystemEntry[]) =>
        set({ appStructure }),
      updateAppStructureNode: (
        id: string,
        updates: Partial<FileSystemEntry>
      ) => {
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

          const updateTreeRecursively = (node: any): any => {
            let updatedNode = { ...node };

            if (inclusionConfig.hasOwnProperty(node.path)) {
              updatedNode.include = inclusionConfig[node.path];
            }

            if (node.children) {
              updatedNode.children = node.children.map(updateTreeRecursively);
            }

            return updatedNode;
          };

          newRoot = updateTreeRecursively(newRoot);
          updateFlatIndexRecursively(newRoot);

          return {
            data: {
              ...state.data,
              root: newRoot,
              flatIndex: newFlatIndex,
            },
          };
        });
      },
      getInitialConfiguration: () => {
        const state = get();
        return state.initialConfiguration;
      },
      setInitialConfiguration: (config: InitialConfigurationType) => {
        set({ initialConfiguration: config });
      },
      updateInitialConfiguration: (
        updates: Partial<InitialConfigurationType>
      ) => {
        set((state) => ({
          initialConfiguration: {
            ...state.initialConfiguration,
            ...updates,
            technologies: updates.technologies
              ? {
                  ...state.initialConfiguration.technologies,
                  ...updates.technologies,
                }
              : state.initialConfiguration.technologies,
            questions: updates.questions
              ? {
                  ...state.initialConfiguration.questions,
                  ...updates.questions,
                }
              : state.initialConfiguration.questions,
            features: updates.features
              ? {
                  ...state.initialConfiguration.features,
                  ...updates.features,
                  authentication: updates.features.authentication
                    ? {
                        ...state.initialConfiguration.features.authentication,
                        ...updates.features.authentication,
                      }
                    : state.initialConfiguration.features.authentication,
                  admin: updates.features.admin
                    ? {
                        ...state.initialConfiguration.features.admin,
                        ...updates.features.admin,
                      }
                    : state.initialConfiguration.features.admin,
                  payments: updates.features.payments
                    ? {
                        ...state.initialConfiguration.features.payments,
                        ...updates.features.payments,
                      }
                    : state.initialConfiguration.features.payments,
                  fileStorage: updates.features.fileStorage !== undefined
                    ? updates.features.fileStorage
                    : state.initialConfiguration.features.fileStorage,
                  realTimeNotifications: updates.features.realTimeNotifications !== undefined
                    ? updates.features.realTimeNotifications
                    : state.initialConfiguration.features.realTimeNotifications,
                  emailSending: updates.features.emailSending !== undefined
                    ? updates.features.emailSending
                    : state.initialConfiguration.features.emailSending,
                }
              : state.initialConfiguration.features,
            database: updates.database
              ? { ...state.initialConfiguration.database, ...updates.database }
              : state.initialConfiguration.database,
          },
        }));
      },
      setMarkdownData: (newData: MarkdownData) => {
        set((state) => ({
          data: newData,
          storedContentVersion: newData.contentVersion,
          visitedPages: state.visitedPages.length === 0 ? [getFirstPagePath(newData)] : state.visitedPages,
        }));
      },
      refreshMarkdownData: () => {
        set((state) => ({ refreshKey: state.refreshKey + 1 }));
      },
      reset: () => {
        const state = get();
        set({
          ...initialState,
          data: state.data,
          storedContentVersion: state.data.contentVersion,
          visitedPages: [getFirstPagePath(state.data)],
        });
      },
      resetToLatestData: () => {
        const state = get();
        set({
          ...initialState,
          data: state.data,
          storedContentVersion: state.data.contentVersion,
          visitedPages: [getFirstPagePath(state.data)],
        });
      },
      forceRefresh: () =>
        set((state) => ({ refreshKey: state.refreshKey + 1 })),
    }),
    {
      name: "editor-storage",
      version: STORE_VERSION,
      partialize: (state) => ({
        version: state.version,
        data: state.data,
        darkMode: state.darkMode,
        visitedPages: state.visitedPages,
        appStructure: state.appStructure,
        placeholderValues: state.placeholderValues,
        initialConfiguration: state.initialConfiguration,
        storedContentVersion: state.storedContentVersion,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          const migratedData = migrateSections(
            persistedState.data || markdownData
          );
          return {
            ...persistedState,
            version: STORE_VERSION,
            data: migratedData,
          };
        }
        return persistedState;
      },
    }
  )
);
