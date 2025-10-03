import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EditorState,
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
  ThemeConfigState,
  WireframeData,
  WireframeElement,
  WireframeElementType,
  WireframeState,
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
    neondb: false,
    prisma: false,
    betterAuth: false,
    postgresql: false,
    vercel: true,
    railway: false,
    cypress: false,
    resend: false,
    stripe: false,
    paypal: false,
    openrouter: false,
  },
  questions: {
    useSupabase: "no",
    alwaysOnServer: false,
  },
  features: {
    authentication: {
      enabled: false,
      magicLink: false,
      emailPassword: false,
      otp: false,
      googleAuth: false,
      githubAuth: false,
      appleAuth: false,
    },
    admin: {
      enabled: false,
      superAdmins: false,
      orgAdmins: false,
      orgMembers: false,
    },
    payments: {
      enabled: false,
      paypalPayments: false,
      stripePayments: false,
      stripeSubscriptions: false,
    },
    aiIntegration: {
      enabled: false,
      imageGeneration: false,
      textGeneration: false,
    },
    realTimeNotifications: {
      enabled: false,
      emailNotifications: false,
      inAppNotifications: false,
    },
    fileStorage: false,
  },
  database: {
    hosting: "neondb",
  },
  deployment: {
    platform: "vercel",
  },
};

const defaultWireframeState: WireframeState = {
  currentPageIndex: 0,
  totalPages: 0,
  availablePages: [],
  wireframeData: {
    layouts: {},
    pages: {},
  },
  isConfigPopoverOpen: false,
  selectedElementType: null,
  selectedType: null,
  selectedPath: null,
};

const defaultThemeConfigState: ThemeConfigState = {
  selectedComponentId: null,
  activeVariant: "default",
  themeMode: "light",
  lightModeTheme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#10b981",
    borderRadiusPreset: "md",
    shadowIntensity: "sm",
    fontSizeScale: "md",
    previewBackgroundColor: "#ffffff",
  },
  darkModeTheme: {
    primaryColor: "#60a5fa",
    secondaryColor: "#a78bfa",
    accentColor: "#34d399",
    borderRadiusPreset: "md",
    shadowIntensity: "sm",
    fontSizeScale: "md",
    previewBackgroundColor: "#111827",
  },
  lightModeComponentStyles: {},
  darkModeComponentStyles: {},
  availableComponents: [],
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

const createInitialState = (data: MarkdownData) => ({
  version: STORE_VERSION,
  data,
  darkMode: true,
  previewMode: false,
  refreshKey: 0,
  visitedPages: [getFirstPagePath(data)],
  appStructure: defaultAppStructure,
  placeholderValues: {},
  initialConfiguration: defaultInitialConfiguration,
  storedContentVersion: data.contentVersion,
  wireframeState: defaultWireframeState,
  themeConfigState: defaultThemeConfigState,
});

const defaultMarkdownData: MarkdownData = {
  root: {
    id: "root",
    name: "root",
    displayName: "Root",
    type: "directory",
    path: "",
    urlPath: "/",
    include: true,
    children: [],
  },
  flatIndex: {
    "": {
      id: "root",
      name: "root",
      displayName: "Root",
      type: "directory",
      path: "",
      urlPath: "/",
      include: true,
      children: [],
    }
  },
  contentVersion: 1,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...createInitialState(defaultMarkdownData),
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
      setPreviewMode: (previewMode: boolean) => set({ previewMode }),
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
        set((state) => {
          const newFeatures = updates.features
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
                aiIntegration: updates.features.aiIntegration
                  ? {
                      ...state.initialConfiguration.features.aiIntegration,
                      ...updates.features.aiIntegration,
                    }
                  : state.initialConfiguration.features.aiIntegration,
                realTimeNotifications: updates.features.realTimeNotifications
                  ? {
                      ...state.initialConfiguration.features.realTimeNotifications,
                      ...updates.features.realTimeNotifications,
                    }
                  : state.initialConfiguration.features.realTimeNotifications,
                fileStorage: updates.features.fileStorage !== undefined
                  ? updates.features.fileStorage
                  : state.initialConfiguration.features.fileStorage,
              }
            : state.initialConfiguration.features;

          const newTechnologies = updates.technologies
            ? {
                ...state.initialConfiguration.technologies,
                ...updates.technologies,
                nextjs: true,
                tailwindcss: true,
                shadcn: true,
              }
            : {
                ...state.initialConfiguration.technologies,
                nextjs: true,
                tailwindcss: true,
                shadcn: true,
              };

          const hasDatabaseFunctionality =
            newFeatures.authentication.enabled ||
            newFeatures.admin.enabled ||
            newFeatures.fileStorage ||
            newFeatures.realTimeNotifications.enabled;

          if (hasDatabaseFunctionality) {
            newTechnologies.prisma = true;
            newTechnologies.postgresql = true;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              ...updates,
              technologies: newTechnologies,
              features: newFeatures,
              questions: updates.questions
                ? {
                    ...state.initialConfiguration.questions,
                    ...updates.questions,
                  }
                : state.initialConfiguration.questions,
              database: updates.database
                ? { ...state.initialConfiguration.database, ...updates.database }
                : state.initialConfiguration.database,
            },
          };
        });
      },
      updateAuthenticationOption: (optionId: string, enabled: boolean) => {
        set((state) => {
          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          const newAuthConfig = {
            ...state.initialConfiguration.features.authentication,
            [optionId]: enabled,
          };

          if (enabled) {
            const hasEmailAuth = newAuthConfig.magicLink ||
              newAuthConfig.emailPassword ||
              newAuthConfig.otp;
            if (hasEmailAuth) {
              techUpdates.resend = true;
            }
          }

          const newFeatures = {
            ...state.initialConfiguration.features,
            authentication: {
              ...newAuthConfig,
              enabled: true,
            },
          };

          const hasDatabaseFunctionality =
            newFeatures.authentication.enabled ||
            newFeatures.admin.enabled ||
            newFeatures.fileStorage ||
            newFeatures.realTimeNotifications.enabled;

          if (hasDatabaseFunctionality) {
            techUpdates.prisma = true;
            techUpdates.postgresql = true;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: newFeatures,
            },
          };
        });
      },
      updateAdminOption: (optionId: string, enabled: boolean) => {
        set((state) => {
          if (state.initialConfiguration.questions.useSupabase === "authOnly" &&
              (optionId === "orgAdmins" || optionId === "orgMembers")) {
            return state;
          }

          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          const newFeatures = {
            ...state.initialConfiguration.features,
            admin: {
              ...state.initialConfiguration.features.admin,
              enabled: true,
              [optionId]: enabled,
            },
          };

          const hasDatabaseFunctionality =
            newFeatures.authentication.enabled ||
            newFeatures.admin.enabled ||
            newFeatures.fileStorage ||
            newFeatures.realTimeNotifications.enabled;

          if (hasDatabaseFunctionality) {
            techUpdates.prisma = true;
            techUpdates.postgresql = true;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: newFeatures,
            },
          };
        });
      },
      updatePaymentOption: (optionId: string, enabled: boolean) => {
        set((state) => {
          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          if (enabled) {
            if (optionId === "stripePayments" || optionId === "stripeSubscriptions") {
              if (state.initialConfiguration.questions.useSupabase === "authOnly" && optionId === "stripeSubscriptions") {
                return state;
              }
              techUpdates.stripe = true;
              if (optionId === "stripeSubscriptions") {
                techUpdates.betterAuth = true;
              }
            }
            if (optionId === "paypalPayments") {
              techUpdates.paypal = true;
            }
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: {
                ...state.initialConfiguration.features,
                payments: {
                  ...state.initialConfiguration.features.payments,
                  enabled: true,
                  [optionId]: enabled,
                },
              },
            },
          };
        });
      },
      updateAIIntegrationOption: (optionId: string, enabled: boolean) => {
        set((state) => {
          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          if (enabled) {
            techUpdates.openrouter = true;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: {
                ...state.initialConfiguration.features,
                aiIntegration: {
                  ...state.initialConfiguration.features.aiIntegration,
                  enabled: true,
                  [optionId]: enabled,
                },
              },
            },
          };
        });
      },
      updateRealTimeNotificationsOption: (optionId: string, enabled: boolean) => {
        set((state) => {
          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          if (enabled) {
            techUpdates.supabase = true;
            if (optionId === "emailNotifications") {
              techUpdates.resend = true;
            }
          }

          const hasDatabaseFunctionality =
            state.initialConfiguration.features.authentication.enabled ||
            state.initialConfiguration.features.admin.enabled ||
            state.initialConfiguration.features.fileStorage ||
            true;

          if (hasDatabaseFunctionality) {
            techUpdates.prisma = true;
            techUpdates.postgresql = true;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: {
                ...state.initialConfiguration.features,
                realTimeNotifications: {
                  ...state.initialConfiguration.features.realTimeNotifications,
                  enabled: true,
                  [optionId]: enabled,
                },
              },
            },
          };
        });
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
          ...createInitialState(state.data),
        });
      },
      resetToLatestData: () => {
        const state = get();
        set({
          ...createInitialState(state.data),
          storedContentVersion: state.data.contentVersion,
        });
      },
      forceRefresh: () =>
        set((state) => ({ refreshKey: state.refreshKey + 1 })),
      setRefreshKey: (key: number) =>
        set({ refreshKey: key }),
      setWireframeCurrentPage: (pageIndex: number) => {
        set((state) => ({
          wireframeState: {
            ...state.wireframeState,
            currentPageIndex: pageIndex,
          },
        }));
      },
      getWireframeCurrentPage: () => {
        const state = get();
        const { currentPageIndex, availablePages } = state.wireframeState;
        return availablePages[currentPageIndex] || null;
      },
      addWireframeElement: (
        targetPath: string,
        targetType: "layout" | "page",
        element: WireframeElement
      ) => {
        set((state) => {
          const newWireframeData = { ...state.wireframeState.wireframeData };

          if (targetType === "layout") {
            if (!newWireframeData.layouts[targetPath]) {
              newWireframeData.layouts[targetPath] = {
                layoutPath: targetPath,
                elements: [],
              };
            }
            newWireframeData.layouts[targetPath].elements.push(element);
          } else {
            if (!newWireframeData.pages[targetPath]) {
              newWireframeData.pages[targetPath] = {
                pagePath: targetPath,
                elements: [],
              };
            }
            newWireframeData.pages[targetPath].elements.push(element);
          }

          return {
            wireframeState: {
              ...state.wireframeState,
              wireframeData: newWireframeData,
            },
          };
        });
      },
      removeWireframeElement: (
        targetPath: string,
        targetType: "layout" | "page",
        elementId: string
      ) => {
        set((state) => {
          const newWireframeData = { ...state.wireframeState.wireframeData };

          if (targetType === "layout" && newWireframeData.layouts[targetPath]) {
            newWireframeData.layouts[targetPath].elements =
              newWireframeData.layouts[targetPath].elements.filter(
                (el) => el.id !== elementId
              );
          } else if (targetType === "page" && newWireframeData.pages[targetPath]) {
            newWireframeData.pages[targetPath].elements =
              newWireframeData.pages[targetPath].elements.filter(
                (el) => el.id !== elementId
              );
          }

          return {
            wireframeState: {
              ...state.wireframeState,
              wireframeData: newWireframeData,
            },
          };
        });
      },
      updateWireframeElement: (
        targetPath: string,
        targetType: "layout" | "page",
        elementId: string,
        updates: Partial<WireframeElement>
      ) => {
        set((state) => {
          const newWireframeData = { ...state.wireframeState.wireframeData };

          if (targetType === "layout" && newWireframeData.layouts[targetPath]) {
            newWireframeData.layouts[targetPath].elements =
              newWireframeData.layouts[targetPath].elements.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el
              );
          } else if (targetType === "page" && newWireframeData.pages[targetPath]) {
            newWireframeData.pages[targetPath].elements =
              newWireframeData.pages[targetPath].elements.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el
              );
          }

          return {
            wireframeState: {
              ...state.wireframeState,
              wireframeData: newWireframeData,
            },
          };
        });
      },
      initializeWireframePages: () => {
        set((state) => {
          const extractPagePaths = (
            entries: FileSystemEntry[],
            parentPath: string = "",
            isRoot: boolean = false
          ): string[] => {
            const paths: string[] = [];

            entries.forEach((entry) => {
              if (entry.name === "app" && isRoot) {
                if (entry.children) {
                  const hasRootPageFile = entry.children.some(
                    (child) => child.type === "file" && child.name === "page.tsx"
                  );
                  if (hasRootPageFile) {
                    paths.push("/");
                  }
                  paths.push(...extractPagePaths(entry.children, "", false));
                }
                return;
              }

              if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
                if (entry.children) {
                  const routeGroupPath = parentPath
                    ? `${parentPath}/${entry.name}`
                    : `/${entry.name}`;
                  paths.push(...extractPagePaths(entry.children, routeGroupPath, false));
                }
                return;
              }

              if (entry.type === "directory" && entry.children) {
                const newPath = parentPath
                  ? `${parentPath}/${entry.name}`
                  : `/${entry.name}`;

                const hasPageFile = entry.children.some(
                  (child) => child.type === "file" && child.name === "page.tsx"
                );

                if (hasPageFile) {
                  paths.push(newPath);
                }

                paths.push(...extractPagePaths(entry.children, newPath, false));
              }
            });

            return paths;
          };

          const extractedPages = extractPagePaths(state.appStructure, "", true);
          const availablePages = Array.from(new Set(extractedPages)).sort();

          return {
            wireframeState: {
              ...state.wireframeState,
              availablePages,
              totalPages: availablePages.length,
              currentPageIndex: 0,
            },
          };
        });
      },
      setWireframeConfigPopover: (open: boolean, elementType?: WireframeElementType) => {
        set((state) => ({
          wireframeState: {
            ...state.wireframeState,
            isConfigPopoverOpen: open,
            selectedElementType: elementType || null,
          },
        }));
      },
      selectWireframeItem: (type: "page" | "layout", path: string) => {
        set((state) => ({
          wireframeState: {
            ...state.wireframeState,
            selectedType: type,
            selectedPath: path,
          },
        }));
      },
      clearWireframeSelection: () => {
        set((state) => ({
          wireframeState: {
            ...state.wireframeState,
            selectedType: null,
            selectedPath: null,
          },
        }));
      },
      setSelectedComponent: (componentId: string | null) => {
        set((state) => ({
          themeConfigState: {
            ...state.themeConfigState,
            selectedComponentId: componentId,
          },
        }));
      },
      setActiveVariant: (variant: string) => {
        set((state) => ({
          themeConfigState: {
            ...state.themeConfigState,
            activeVariant: variant,
          },
        }));
      },
      setThemeMode: (mode: "light" | "dark") => {
        set((state) => ({
          themeConfigState: {
            ...state.themeConfigState,
            themeMode: mode,
          },
        }));
      },
      updateGlobalTheme: (updates) => {
        set((state) => {
          const themeKey = state.themeConfigState.themeMode === "light" ? "lightModeTheme" : "darkModeTheme";
          return {
            themeConfigState: {
              ...state.themeConfigState,
              [themeKey]: {
                ...state.themeConfigState[themeKey],
                ...updates,
              },
            },
          };
        });
      },
      updateComponentStyle: (componentId, updates) => {
        set((state) => {
          const stylesKey = state.themeConfigState.themeMode === "light" ? "lightModeComponentStyles" : "darkModeComponentStyles";
          return {
            themeConfigState: {
              ...state.themeConfigState,
              [stylesKey]: {
                ...state.themeConfigState[stylesKey],
                [componentId]: {
                  ...state.themeConfigState[stylesKey][componentId],
                  ...updates,
                },
              },
            },
          };
        });
      },
      resetComponentStyle: (componentId) => {
        set((state) => {
          const stylesKey = state.themeConfigState.themeMode === "light" ? "lightModeComponentStyles" : "darkModeComponentStyles";
          const newStyles = { ...state.themeConfigState[stylesKey] };
          delete newStyles[componentId];
          return {
            themeConfigState: {
              ...state.themeConfigState,
              [stylesKey]: newStyles,
            },
          };
        });
      },
      initializeAvailableComponents: () => {
        set((state) => ({
          themeConfigState: {
            ...state.themeConfigState,
            availableComponents: [],
          },
        }));
      },
    }),
    {
      name: "editor-storage",
      version: STORE_VERSION,
      partialize: (state) => ({
        version: state.version,
        data: state.data,
        darkMode: state.darkMode,
        previewMode: state.previewMode,
        visitedPages: state.visitedPages,
        appStructure: state.appStructure,
        placeholderValues: state.placeholderValues,
        initialConfiguration: state.initialConfiguration,
        storedContentVersion: state.storedContentVersion,
        wireframeState: state.wireframeState,
        themeConfigState: state.themeConfigState,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          const migratedData = migrateSections(
            persistedState.data || defaultMarkdownData
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
