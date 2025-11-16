import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CodeFileNode,
  EditorState,
  Feature,
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
  UserExperienceFileType,
  WireframeData,
  WireframeElement,
  WireframeElementType,
  WireframeState,
} from "./layout.types";
import { createCodeFileNodes } from "@/lib/code-files.registry";
import { useThemeStore } from "@/app/(components)/ThemeConfiguration.stores";
import { useDatabaseStore } from "@/app/(components)/DatabaseConfiguration.stores";
import { conditionalLog } from "@/lib/log.util";

const generateId = () => Math.random().toString(36).substring(2, 11);

const getFirstPagePath = (data: MarkdownData): string => {
  const pages = Object.values(data.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false && !(node as any).previewOnly && !(node as any).visibleAfterPage)
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
    typescript: true,
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
    playwright: false,
    cypress: false,
    resend: false,
    stripe: false,
    paypal: false,
    openrouter: false,
  },
  questions: {
    databaseProvider: "none",
    alwaysOnServer: false,
  },
  features: {
    authentication: {
      enabled: false,
      magicLink: false,
      emailPassword: false,
      otp: false,
      twoFactor: false,
      passkey: false,
      anonymous: false,
      googleAuth: false,
      githubAuth: false,
      appleAuth: false,
      passwordOnly: false,
    },
    admin: {
      enabled: false,
      admin: false,
      superAdmin: false,
      organizations: false,
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

const addNodeAfterSibling = (
  nodes: FileSystemEntry[],
  siblingId: string,
  newNode: FileSystemEntry
): FileSystemEntry[] => {
  return nodes.map((node) => {
    if (node.children) {
      const siblingIndex = node.children.findIndex((child) => child.id === siblingId);
      if (siblingIndex !== -1) {
        const newChildren = [...node.children];
        newChildren.splice(siblingIndex + 1, 0, newNode);
        return {
          ...node,
          children: newChildren,
          isExpanded: true,
        };
      }
      return {
        ...node,
        children: addNodeAfterSibling(node.children, siblingId, newNode),
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
  codeFiles: [],
  darkMode: true,
  previewMode: false,
  refreshKey: 0,
  visitedPages: [getFirstPagePath(data)],
  appStructure: defaultAppStructure,
  placeholderValues: {},
  initialConfiguration: defaultInitialConfiguration,
  storedContentVersion: data.contentVersion,
  wireframeState: defaultWireframeState,
  selectedFilePath: null,
  selectedFileId: null,
  userExperienceFiles: {},
  features: {},
  featureFileSelection: {
    fileId: null,
    featureId: null,
    fileType: null,
  },
  testSuites: [],
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
      getCodeFile: (path: string) => {
        const state = get();
        return state.codeFiles.find(file => file.path === path) || null;
      },
      generateCodeFiles: () => {
        const state = get();
        const themeStore = useThemeStore.getState();
        const databaseStore = useDatabaseStore.getState();

        conditionalLog(
          {
            message: "generateCodeFiles called",
            hasTheme: !!themeStore.theme,
            pluginCount: databaseStore.plugins.length,
            tableCount: databaseStore.tables.length,
            rlsPolicyCount: databaseStore.rlsPolicies.length,
            initialConfig: state.initialConfiguration,
          },
          { label: "code-files" }
        );

        const codeFiles = createCodeFileNodes(
          state.initialConfiguration,
          themeStore.theme,
          databaseStore.plugins,
          databaseStore.tables,
          databaseStore.rlsPolicies,
          state.isPageVisited
        );

        conditionalLog(
          {
            message: "Code files generated",
            count: codeFiles.length,
            files: codeFiles.map((f) => ({ name: f.name, path: f.path })),
          },
          { label: "code-files" }
        );

        set({ codeFiles });
      },
      setDarkMode: (darkMode) => set({ darkMode }),
      setPreviewMode: (previewMode: boolean) => set({ previewMode }),
      markPageVisited: (path) =>
        set((state) => {
          console.log('[VISITED] Marking page as visited:', path);
          console.log('[VISITED] Current visitedPages:', state.visitedPages);
          const newVisitedPages = state.visitedPages.includes(path)
            ? state.visitedPages
            : [...state.visitedPages, path];
          console.log('[VISITED] New visitedPages:', newVisitedPages);

          if (path === "start-here.next-steps" && !state.visitedPages.includes(path)) {
            const themeStore = useThemeStore.getState();
            const databaseStore = useDatabaseStore.getState();

            const codeFiles = createCodeFileNodes(
              state.initialConfiguration,
              themeStore.theme,
              databaseStore.plugins,
              databaseStore.tables,
              databaseStore.rlsPolicies,
              (checkPath: string) => newVisitedPages.includes(checkPath)
            );

            console.log('[VISITED] Regenerating code files after visiting next steps');
            return { visitedPages: newVisitedPages, codeFiles };
          }

          return { visitedPages: newVisitedPages };
        }),
      isPageVisited: (path) => {
        const state = get();
        return state.visitedPages.includes(path);
      },
      getNextUnvisitedPage: (currentPath) => {
        const state = get();
        const pages = Object.values(state.data.flatIndex)
          .filter((node) => node.type === "file" && node.include !== false && !(node as any).previewOnly && !(node as any).visibleAfterPage)
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
      addAppStructureNodeAfterSibling: (siblingId: string, newNode: FileSystemEntry) => {
        set((state) => ({
          appStructure: addNodeAfterSibling(state.appStructure, siblingId, newNode),
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
        get().generateCodeFiles();
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
        get().generateCodeFiles();
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

          const hasEmailAuth = newAuthConfig.magicLink ||
            newAuthConfig.emailPassword ||
            newAuthConfig.otp;

          const hasEmailNotifications = state.initialConfiguration.features.realTimeNotifications.enabled &&
            state.initialConfiguration.features.realTimeNotifications.emailNotifications;

          if (hasEmailAuth || hasEmailNotifications) {
            techUpdates.resend = true;
          } else {
            techUpdates.resend = false;
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
          if (!state.initialConfiguration.technologies.betterAuth &&
              optionId === "organizations") {
            return state;
          }

          const techUpdates: InitialConfigurationType["technologies"] = {
            ...state.initialConfiguration.technologies,
            nextjs: true,
            tailwindcss: true,
            shadcn: true,
          };

          if (enabled && optionId === "organizations") {
            techUpdates.betterAuth = true;
          }

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

          const newPaymentConfig = {
            ...state.initialConfiguration.features.payments,
            [optionId]: enabled,
          };

          const hasStripePayments = newPaymentConfig.stripePayments || newPaymentConfig.stripeSubscriptions;
          const hasPaypalPayments = newPaymentConfig.paypalPayments;
          const hasStripeSubscriptions = newPaymentConfig.stripeSubscriptions;

          if (hasStripePayments) {
            if (!state.initialConfiguration.technologies.betterAuth && hasStripeSubscriptions && enabled && optionId === "stripeSubscriptions") {
              return state;
            }
            techUpdates.stripe = true;
          } else {
            techUpdates.stripe = false;
          }

          if (hasStripeSubscriptions) {
            techUpdates.betterAuth = true;
          }

          if (hasPaypalPayments) {
            techUpdates.paypal = true;
          } else {
            techUpdates.paypal = false;
          }

          return {
            initialConfiguration: {
              ...state.initialConfiguration,
              technologies: techUpdates,
              features: {
                ...state.initialConfiguration.features,
                payments: {
                  ...newPaymentConfig,
                  enabled: true,
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
            if (optionId === "imageGeneration") {
              techUpdates.supabase = true;
            }
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

          const newRealTimeConfig = {
            ...state.initialConfiguration.features.realTimeNotifications,
            [optionId]: enabled,
          };

          if (enabled) {
            techUpdates.supabase = true;
          }

          const hasEmailAuth = state.initialConfiguration.features.authentication.magicLink ||
            state.initialConfiguration.features.authentication.emailPassword ||
            state.initialConfiguration.features.authentication.otp;

          const hasEmailNotifications = newRealTimeConfig.emailNotifications;

          if (hasEmailAuth || hasEmailNotifications) {
            techUpdates.resend = true;
          } else {
            techUpdates.resend = false;
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
                  ...newRealTimeConfig,
                  enabled: true,
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
        get().generateCodeFiles();
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
                  const hasPageFile = entry.children.some(
                    (child) => child.type === "file" && child.name === "page.tsx"
                  );
                  if (hasPageFile && parentPath === "") {
                    paths.push("/");
                  }
                  paths.push(...extractPagePaths(entry.children, parentPath, false));
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
      setSelectedFile: (filePath, fileId) => {
        set({ selectedFilePath: filePath, selectedFileId: fileId });
      },
      addUtilityFile: (parentFileId, parentFileName, fileType) => {
        set((state) => {
          const existing = state.userExperienceFiles[parentFileId] || [];
          if (existing.includes(fileType)) {
            return state;
          }
          return {
            userExperienceFiles: {
              ...state.userExperienceFiles,
              [parentFileId]: [...existing, fileType],
            },
          };
        });
      },
      getUtilityFiles: (fileId) => {
        const state = get();
        return state.userExperienceFiles[fileId] || [];
      },
      clearSelection: () => {
        set({ selectedFilePath: null, selectedFileId: null });
      },
      addFeature: (fileId) => {
        set((state) => {
          const existingFeatures = state.features[fileId] || [];

          const newFeature: Feature = {
            id: generateId(),
            title: "",
            description: "",
            linkedFiles: {},
            isEditing: true,
          };

          return {
            features: {
              ...state.features,
              [fileId]: [...existingFeatures, newFeature],
            },
          };
        });
      },
      updateFeature: (fileId, featureId, updates) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.map((feature) =>
                feature.id === featureId ? { ...feature, ...updates } : feature
              ),
            },
          };
        });
      },
      removeFeature: (fileId, featureId) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.filter((feature) => feature.id !== featureId),
            },
          };
        });
      },
      getFeatures: (fileId) => {
        const state = get();
        return state.features[fileId] || [];
      },
      linkFeatureFile: (fileId, featureId, fileType, filePath) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.map((feature) =>
                feature.id === featureId
                  ? {
                      ...feature,
                      linkedFiles: {
                        ...feature.linkedFiles,
                        [fileType]: filePath,
                      },
                    }
                  : feature
              ),
            },
          };
        });
      },
      unlinkFeatureFile: (fileId, featureId, fileType) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.map((feature) => {
                if (feature.id === featureId) {
                  const { [fileType]: _, ...remainingFiles } = feature.linkedFiles;
                  return {
                    ...feature,
                    linkedFiles: remainingFiles,
                  };
                }
                return feature;
              }),
            },
          };
        });
      },
      setFeatureFileSelection: (fileId, featureId, fileType) => {
        set({
          featureFileSelection: {
            fileId,
            featureId,
            fileType,
          },
        });
      },
      clearFeatureFileSelection: () => {
        set({
          featureFileSelection: {
            fileId: null,
            featureId: null,
            fileType: null,
          },
        });
      },
      addTestSuite: (suite) => {
        set((state) => ({
          testSuites: [...state.testSuites, { ...suite, id: generateId() }],
        }));
      },
      updateTestSuite: (id, updates) => {
        set((state) => ({
          testSuites: state.testSuites.map((suite) =>
            suite.id === id ? { ...suite, ...updates } : suite
          ),
        }));
      },
      removeTestSuite: (id) => {
        set((state) => ({
          testSuites: state.testSuites.filter((suite) => suite.id !== id),
        }));
      },
      addTestCase: (suiteId, testCase) => {
        set((state) => ({
          testSuites: state.testSuites.map((suite) =>
            suite.id === suiteId
              ? {
                  ...suite,
                  testCases: [...suite.testCases, { ...testCase, id: generateId() }],
                }
              : suite
          ),
        }));
      },
      updateTestCase: (suiteId, caseId, updates) => {
        set((state) => ({
          testSuites: state.testSuites.map((suite) =>
            suite.id === suiteId
              ? {
                  ...suite,
                  testCases: suite.testCases.map((testCase) =>
                    testCase.id === caseId ? { ...testCase, ...updates } : testCase
                  ),
                }
              : suite
          ),
        }));
      },
      removeTestCase: (suiteId, caseId) => {
        set((state) => ({
          testSuites: state.testSuites.map((suite) =>
            suite.id === suiteId
              ? {
                  ...suite,
                  testCases: suite.testCases.filter((testCase) => testCase.id !== caseId),
                }
              : suite
          ),
        }));
      },
      resetTestsFromFeatures: () => {
        const state = get();
        const allFeatures: Array<{ feature: Feature; fileId: string }> = [];

        Object.entries(state.features).forEach(([fileId, featureList]) => {
          featureList.forEach((feature) => {
            allFeatures.push({ feature, fileId });
          });
        });

        const newTestSuites = allFeatures.map(({ feature }) => {
          const kebabCaseName = feature.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

          return {
            id: generateId(),
            name: `${feature.title} Tests`,
            featureId: feature.id,
            description: feature.description,
            command: `npm run test:${kebabCaseName}`,
            testCases: [],
          };
        });

        set({ testSuites: newTestSuites });
      },
      reorderTestSuites: (fromIndex, toIndex) => {
        set((state) => {
          const newSuites = [...state.testSuites];
          const [removed] = newSuites.splice(fromIndex, 1);
          newSuites.splice(toIndex, 0, removed);
          return { testSuites: newSuites };
        });
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
        selectedFilePath: state.selectedFilePath,
        selectedFileId: state.selectedFileId,
        userExperienceFiles: state.userExperienceFiles,
        features: state.features,
        featureFileSelection: state.featureFileSelection,
        testSuites: state.testSuites,
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
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            conditionalLog({ message: "Editor store rehydrated" }, { label: "code-files" });

            const themeStore = useThemeStore.getState();
            const databaseStore = useDatabaseStore.getState();

            const codeFiles = createCodeFileNodes(
              state.initialConfiguration,
              themeStore.theme,
              databaseStore.plugins,
              databaseStore.tables,
              databaseStore.rlsPolicies,
              state.isPageVisited
            );

            conditionalLog(
              {
                message: "Code files generated on rehydration",
                count: codeFiles.length,
                files: codeFiles.map((f) => ({ name: f.name, path: f.path })),
              },
              { label: "code-files" }
            );

            state.codeFiles = codeFiles;
          }
        };
      },
    }
  )
);
