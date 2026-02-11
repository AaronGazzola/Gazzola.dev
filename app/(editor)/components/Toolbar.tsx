"use client";

import { EditModeSwitch } from "@/components/EditModeSwitch";
import { Button } from "@/components/editor/ui/button";
import {
  Dialog as EditorDialog,
  DialogContent as EditorDialogContent,
  DialogDescription as EditorDialogDescription,
  DialogFooter as EditorDialogFooter,
  DialogHeader as EditorDialogHeader,
  DialogTitle as EditorDialogTitle,
} from "@/components/editor/ui/dialog";
import {
  Popover as EditorPopover,
  PopoverContent as EditorPopoverContent,
  PopoverTrigger as EditorPopoverTrigger,
} from "@/components/editor/ui/popover";
import { Progress } from "@/components/editor/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { processContent } from "@/lib/download.utils";
import { conditionalLog } from "@/lib/log.util";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowBigDownDash,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  HardDriveUpload,
  HelpCircle,
  ListRestart,
  MessagesSquare,
  Palette,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppStructureStore } from "../../(components)/AppStructure.stores";
import { useDatabaseStore } from "../../(components)/DatabaseConfiguration.stores";
import { useDatabaseTablesStore } from "../../(components)/DatabaseConfiguration.tables.stores";
import { useNextStepsStore } from "../../(components)/NextStepsComponent.stores";
import { useREADMEStore } from "../../(components)/READMEComponent.stores";
import { useThemeStore as useThemeConfigStore } from "../../(components)/ThemeConfiguration.stores";
import { useThemeStore } from "../../layout.stores";
import { getMarkdownDataAction } from "../layout.actions";
import { useContentVersionCheck } from "../layout.hooks";
import { useEditorStore } from "../layout.stores";
import type { InitialConfigurationType } from "../layout.types";

const isDevelopment = process.env.NODE_ENV === "development";

const nextSteps = [
  { icon: Palette, title: "Design" },
  { icon: MessagesSquare, title: "Build" },
  { icon: CheckCircle, title: "Review" },
];

interface ToolbarProps {
  currentContentPath: string;
}

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}

const IconButton = ({
  onClick,
  disabled = false,
  children,
  tooltip,
}: IconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className="rounded-[3px] h-8 w-8"
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export const Toolbar = ({ currentContentPath }: ToolbarProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  useContentVersionCheck();
  const [codeReviewDialogOpen] = useQueryState("codeReview");
  const {
    previewMode,
    setPreviewMode,
    reset,
    setContent,
    forceRefresh,
    setRefreshKey,
    markPageVisited,
    data,
    getSectionInclude,
    setSectionInclude,
    updateInclusionRules,
    setMarkdownData,
    darkMode,
    setDarkMode,
    isResetting,
    setIsResetting,
    setAppStructureGenerated,
    appStructureGenerated,
    setReadmeGenerated,
    readmeGenerated,
    setDatabaseGenerated,
    databaseGenerated,
    setAppStructure,
    updateInitialConfiguration,
    getNode,
    appStructure,
    getPlaceholderValue,
    getInitialConfiguration,
  } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { resetTheme, hasInteracted: themeHasInteracted } =
    useThemeConfigStore();
  const { reset: resetAppStructure } = useAppStructureStore();
  const { reset: resetDatabase } = useDatabaseStore();
  const { reset: resetDatabaseTables } = useDatabaseTablesStore();
  const { reset: resetNextSteps } = useNextStepsStore();
  const { reset: resetReadme } = useREADMEStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetPopoverOpen, setResetPopoverOpen] = useState(false);
  const [savePopoverOpen, setSavePopoverOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const allPages = useMemo(() => {
    const pages: { path: string; url: string; title: string; order: number }[] =
      [];

    const extractPages = (node: any, parentUrl = ""): void => {
      if (node.include === false || node.includeInSidebar === false) {
        return;
      }

      if (node.type === "file") {
        if (
          node.includeInToolbar !== false &&
          node.includeInSidebar !== false
        ) {
          pages.push({
            path: node.path,
            url: node.urlPath,
            title: node.displayName,
            order: node.order || 0,
          });
        }
      } else if (node.type === "directory" && node.children) {
        for (const child of node.children) {
          extractPages(child, node.urlPath);
        }
      }
    };

    if (data.root && data.root.children) {
      for (const child of data.root.children) {
        extractPages(child);
      }
    }

    return pages.sort((a, b) => a.order - b.order);
  }, [data]);

  const numberedPages = useMemo(() => {
    return allPages.filter((page) => page.order > 0);
  }, [allPages]);

  const sectionsData = useMemo(() => {
    const filesWithSections: {
      filePath: string;
      fileName: string;
      sections: {
        sectionId: string;
        options: { optionId: string; include: boolean }[];
      }[];
    }[] = [];

    Object.values(data.flatIndex).forEach((node) => {
      if (
        node.type === "file" &&
        node.sections &&
        Object.keys(node.sections).length > 0
      ) {
        const sections = Object.entries(node.sections).map(
          ([sectionId, sectionOptions]) => ({
            sectionId,
            options: Object.entries(sectionOptions).map(
              ([optionId, option]) => ({
                optionId,
                include: option.include,
              })
            ),
          })
        );

        filesWithSections.push({
          filePath: node.path,
          fileName: node.displayName,
          sections,
        });
      }
    });

    return filesWithSections;
  }, [data]);

  const fileTreeData = useMemo(() => {
    const treeItems: {
      path: string;
      name: string;
      type: "directory" | "file";
      include: boolean;
      level: number;
    }[] = [];

    const processNode = (node: any, level: number = 0): void => {
      if (node.type === "directory" || node.type === "file") {
        treeItems.push({
          path: node.path,
          name: node.displayName,
          type: node.type,
          include: node.include,
          level,
        });

        if (node.type === "directory" && node.children) {
          for (const child of node.children) {
            processNode(child, level + 1);
          }
        }
      }
    };

    if (data.root && data.root.children) {
      for (const child of data.root.children) {
        processNode(child, 0);
      }
    }

    return treeItems;
  }, [data]);

  const currentPageIndex = useMemo(() => {
    return numberedPages.findIndex((page) => page.path === currentContentPath);
  }, [numberedPages, currentContentPath]);

  const isViewingComponentFile = useMemo(() => {
    const currentNode = data.flatIndex[currentContentPath];
    return currentNode?.type === "file" && currentNode.previewOnly === true;
  }, [data, currentContentPath]);

  const isPreviewEnabledPage = useMemo(() => {
    return ["theme", "app-directory", "database"].includes(currentContentPath);
  }, [currentContentPath]);

  const canTogglePreview = isPreviewEnabledPage && !isViewingComponentFile;

  const nextPage =
    currentPageIndex >= 0 && currentPageIndex < numberedPages.length - 1
      ? numberedPages[currentPageIndex + 1]
      : null;

  const canGoBack = currentPageIndex > 0;
  const canGoNext = Boolean(nextPage);

  const prevPageTitle = canGoBack
    ? numberedPages[currentPageIndex - 1]?.title
    : "";
  const nextPageTitle = nextPage?.title || "";

  const handleBack = () => {
    if (canGoBack) {
      setPreviewMode(false);
      const prevPage = numberedPages[currentPageIndex - 1];
      router.push(prevPage.url);
    }
  };

  const handleHome = () => {
    conditionalLog(
      JSON.stringify({
        numberedPagesLength: numberedPages.length,
        numberedPages: numberedPages.map((p) => ({
          title: p.title,
          order: p.order,
          url: p.url,
          path: p.path,
        })),
      }),
      { label: "toolbar" }
    );
    const homePage = numberedPages.find((page) => page.order === 1);
    conditionalLog(
      JSON.stringify({
        foundHomePage: !!homePage,
        homePage: homePage
          ? { title: homePage.title, order: homePage.order, url: homePage.url }
          : null,
      }),
      { label: "toolbar" }
    );
    if (homePage) {
      conditionalLog(
        JSON.stringify({ action: "pushing to router", url: homePage.url }),
        { label: "toolbar" }
      );
      router.push(homePage.url);
    } else {
      conditionalLog(
        JSON.stringify({
          action: "no home page found, using first",
          firstPage: numberedPages[0],
        }),
        { label: "toolbar" }
      );
      const firstPage = numberedPages[0];
      if (firstPage) {
        router.push(firstPage.url);
      }
    }
  };

  const handleNext = () => {
    if (nextPage) {
      setPreviewMode(false);
      markPageVisited(nextPage.path);
      router.push(nextPage.url);
    }
  };
  const handleResetPage = async () => {
    const { data: freshData } = await getMarkdownDataAction();

    if (freshData) {
      const freshNode = freshData.flatIndex[currentContentPath];
      if (freshNode && freshNode.type === "file") {
        const originalContent = freshNode.content
          .replace(/\\n/g, "\n")
          .replace(/\\`/g, "`")
          .replace(/\\\$/g, "$")
          .replace(/\\\\/g, "\\");
        setContent(currentContentPath, originalContent);

        if (freshNode.sections) {
          Object.entries(freshNode.sections).forEach(([sectionId, options]) => {
            Object.entries(options).forEach(([optionId, option]) => {
              setSectionInclude(
                currentContentPath,
                sectionId,
                optionId,
                option.include
              );
            });
          });
        }
      }
    }

    if (currentContentPath === "theme") {
      resetTheme();
    }

    if (currentContentPath === "database") {
      resetDatabase();
      resetDatabaseTables();
      updateInitialConfiguration({
        questions: {
          databaseProvider: "none",
          alwaysOnServer: false,
        },
        technologies: {
          supabase: false,
          postgresql: false,
        } as InitialConfigurationType["technologies"],
        features: {
          authentication: {
            enabled: false,
            emailPassword: false,
            emailVerification: false,
            forgotPassword: false,
            magicLink: false,
          },
          admin: {
            enabled: false,
            admin: false,
            superAdmin: false,
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
        } as InitialConfigurationType["features"],
        database: {
          hosting: "neondb",
        },
      });
      setDatabaseGenerated(false);
    }

    if (currentContentPath === "app-directory") {
      setAppStructure([]);
      setAppStructureGenerated(false);
      resetAppStructure();
    }

    if (currentContentPath === "readme") {
      setReadmeGenerated(false);
      resetReadme();
    }

    if (currentContentPath === "starter-kit") {
      resetNextSteps();
    }

    forceRefresh();
    setResetPageDialogOpen(false);
  };

  const handleResetAll = async () => {
    conditionalLog("Toolbar.handleResetAll: Starting", {
      label: "markdown-parse",
    });
    setResetAllLoading(true);
    setIsResetting(true);
    try {
      const { data: freshData, error } = await getMarkdownDataAction();

      conditionalLog(
        {
          hasFreshData: !!freshData,
          hasError: !!error,
          freshDataNodeCount: freshData
            ? Object.keys(freshData.flatIndex).length
            : 0,
          freshDataVersion: freshData?.contentVersion,
        },
        { label: "markdown-parse" }
      );

      if (error) {
        console.error("Reset all failed:", error);
        alert(
          "Failed to load markdown data. Please try again or refresh the page."
        );
        return;
      }

      if (freshData) {
        conditionalLog("Toolbar.handleResetAll: Invalidating queries", {
          label: "markdown-parse",
        });

        queryClient.invalidateQueries({ queryKey: ["markdownData"] });
        queryClient.invalidateQueries({ queryKey: ["contentVersion"] });

        const firstPagePath =
          Object.values(freshData.flatIndex).find(
            (node) =>
              node.type === "file" &&
              node.path === "readme" &&
              node.include !== false
          ) ||
          Object.values(freshData.flatIndex)
            .filter(
              (node) =>
                node.type === "file" &&
                node.include !== false &&
                !(node as any).previewOnly
            )
            .sort((a, b) => (a.order || 0) - (b.order || 0))[0];

        const resetKey = Date.now();

        conditionalLog(
          {
            resetKey,
            firstPageUrl: firstPagePath?.urlPath,
            message: "Setting markdown data in store",
          },
          { label: "markdown-parse" }
        );

        setMarkdownData(freshData);
        reset();
        resetTheme();
        resetDatabase();
        resetDatabaseTables();
        resetNextSteps();
        resetReadme();
        resetAppStructure();
        setAppStructureGenerated(false);
        setReadmeGenerated(false);
        setRefreshKey(resetKey);

        conditionalLog(
          "Toolbar.handleResetAll: Store updated, waiting for state to settle",
          { label: "markdown-parse" }
        );

        await new Promise((resolve) => setTimeout(resolve, 100));

        conditionalLog("Toolbar.handleResetAll: State settled, navigating", {
          label: "markdown-parse",
        });

        if (firstPagePath?.urlPath) {
          router.push(firstPagePath.urlPath);
          setIsResetting(false);
        }
      }
      setResetAllDialogOpen(false);
    } catch (error) {
      setIsResetting(false);
      conditionalLog(
        { catchError: String(error) },
        { label: "markdown-parse" }
      );
      alert("An unexpected error occurred during reset. Please try again.");
      setResetAllDialogOpen(false);
    } finally {
      setResetAllLoading(false);
      conditionalLog("Toolbar.handleResetAll: Complete", {
        label: "markdown-parse",
      });
    }
  };

  const getProcessedContent = () => {
    const currentNode = data.flatIndex[currentContentPath];
    if (!currentNode || currentNode.type !== "file") {
      return null;
    }

    const getSectionContent = (
      filePath: string,
      sectionId: string,
      optionId: string
    ): string => {
      const node = data.flatIndex[filePath];
      if (node?.type === "file" && node.sections?.[sectionId]?.[optionId]) {
        return node.sections[sectionId][optionId].content || "";
      }
      return "";
    };

    const getSectionOptions = (
      filePath: string,
      sectionId: string
    ): Record<string, { content: string; include: boolean }> => {
      const node = data.flatIndex[filePath];
      if (node?.type === "file" && node.sections?.[sectionId]) {
        return node.sections[sectionId];
      }
      return {};
    };

    const content = currentNode.content
      .replace(/\\n/g, "\n")
      .replace(/\\`/g, "`")
      .replace(/\\\$/g, "$")
      .replace(/\\\\/g, "\\");

    return processContent(
      content,
      currentContentPath,
      getSectionInclude,
      getSectionContent,
      getSectionOptions,
      appStructure,
      getPlaceholderValue,
      getInitialConfiguration,
      true
    );
  };

  const handleCopyContent = () => {
    const content = getProcessedContent();
    if (!content) {
      toast.error("No content to copy");
      return;
    }
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success("Content copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy content to clipboard");
      }
    );
  };

  const handleSaveProgress = () => {
    try {
      const state = useEditorStore.getState();
      const themeState = useThemeConfigStore.getState();
      const databaseState = useDatabaseStore.getState();
      const appStructureState = useAppStructureStore.getState();
      const readmeState = useREADMEStore.getState();
      const databaseTablesState = useDatabaseTablesStore.getState();
      const nextStepsState = useNextStepsStore.getState();

      const progressData = {
        version: 1,
        timestamp: new Date().toISOString(),
        editorState: {
          data: state.data,
          previewMode: state.previewMode,
          darkMode: state.darkMode,
          appStructureGenerated: state.appStructureGenerated,
          readmeGenerated: state.readmeGenerated,
          databaseGenerated: state.databaseGenerated,
          appStructure: state.appStructure,
          features: state.features,
          initialConfiguration: state.getInitialConfiguration(),
        },
        themeState: themeState.theme,
        databaseState: {
          tables: databaseState.tables,
          enums: databaseState.enums,
          rlsPolicies: databaseState.rlsPolicies,
          plugins: databaseState.plugins,
          activeTab: databaseState.activeTab,
        },
        appStructureState: {
          inferredFeatures: appStructureState.inferredFeatures,
          parsedPages: appStructureState.parsedPages,
          featuresGenerated: appStructureState.featuresGenerated,
          lastGeneratedReadmeContent:
            appStructureState.lastGeneratedReadmeContent,
          lastGeneratedForStructure:
            appStructureState.lastGeneratedForStructure,
        },
        readmeState: {
          title: readmeState.title,
          description: readmeState.description,
          layouts: readmeState.layouts,
          pages: readmeState.pages,
          authMethods: readmeState.authMethods,
          pageAccess: readmeState.pageAccess,
          stage: readmeState.stage,
          lastGeneratedForAuth: readmeState.lastGeneratedForAuth,
          lastGeneratedForPages: readmeState.lastGeneratedForPages,
          lastGeneratedForReadme: readmeState.lastGeneratedForReadme,
        },
        databaseTablesState: {
          tableDescriptions: databaseTablesState.tableDescriptions,
          tablesGenerated: databaseTablesState.tablesGenerated,
          accordionValue: databaseTablesState.accordionValue,
          expandedTableId: databaseTablesState.expandedTableId,
          lastGeneratedAppStructure:
            databaseTablesState.lastGeneratedAppStructure,
          lastGeneratedTableDescriptions:
            databaseTablesState.lastGeneratedTableDescriptions,
        },
        nextStepsState: {
          openStep: nextStepsState.openStep,
          unlockedSteps: Array.from(nextStepsState.unlockedSteps),
        },
      };

      const appName =
        readmeState.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "starter-kit";
      const dateString = new Date().toISOString().split("T")[0];

      const blob = new Blob([JSON.stringify(progressData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${appName}-progress-${dateString}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Progress saved!");
      setSavePopoverOpen(false);
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast.error("Failed to save progress");
    }
  };

  const processUploadedFile = useCallback(
    async (file: File) => {
      try {
        console.log("[PROGRESS UPLOAD] Starting file processing");
        const text = await file.text();
        const progressData = JSON.parse(text);

        if (!progressData.version || !progressData.editorState) {
          toast.error("Invalid progress file format");
          return;
        }

        console.log("[PROGRESS UPLOAD] Valid progress file, flags:", {
          readmeGenerated: progressData.editorState.readmeGenerated,
          appStructureGenerated: progressData.editorState.appStructureGenerated,
          databaseGenerated: progressData.editorState.databaseGenerated,
        });

        setUploadDialogOpen(false);
        setSavePopoverOpen(false);
        setUploadedFile(null);

        const editorStore = useEditorStore.getState();
        const themeStore = useThemeConfigStore.getState();
        const databaseStore = useDatabaseStore.getState();
        const appStructureStore = useAppStructureStore.getState();
        const readmeStore = useREADMEStore.getState();
        const databaseTablesStore = useDatabaseTablesStore.getState();
        const nextStepsStore = useNextStepsStore.getState();

        console.log("[PROGRESS UPLOAD] Current store states before restore:", {
          readmeGenerated: editorStore.readmeGenerated,
          appStructureGenerated: editorStore.appStructureGenerated,
          databaseGenerated: editorStore.databaseGenerated,
        });

        if (progressData.themeState) {
          themeStore.setTheme(progressData.themeState);
        }

        if (progressData.databaseState) {
          if (progressData.databaseState.tables) {
            databaseStore.setTables(progressData.databaseState.tables);
          }
          if (progressData.databaseState.enums) {
            databaseStore.setEnums(progressData.databaseState.enums);
          }
          if (progressData.databaseState.rlsPolicies) {
            databaseStore.setRLSPolicies(
              progressData.databaseState.rlsPolicies
            );
          }
          if (progressData.databaseState.plugins) {
            progressData.databaseState.plugins.forEach((plugin: any) => {
              databaseStore.addPlugin(plugin);
            });
          }
          if (progressData.databaseState.activeTab !== undefined) {
            databaseStore.setActiveTab(progressData.databaseState.activeTab);
          }
        }

        if (progressData.appStructureState) {
          if (progressData.appStructureState.inferredFeatures) {
            appStructureStore.setInferredFeatures(
              progressData.appStructureState.inferredFeatures
            );
          }
          if (progressData.appStructureState.parsedPages) {
            appStructureStore.setParsedPages(
              progressData.appStructureState.parsedPages
            );
          }
          if (progressData.appStructureState.featuresGenerated !== undefined) {
            appStructureStore.setFeaturesGenerated(
              progressData.appStructureState.featuresGenerated
            );
          }
          if (
            progressData.appStructureState.lastGeneratedReadmeContent !==
            undefined
          ) {
            appStructureStore.setLastGeneratedReadmeContent(
              progressData.appStructureState.lastGeneratedReadmeContent
            );
          }
          if (
            progressData.appStructureState.lastGeneratedForStructure !==
            undefined
          ) {
            appStructureStore.setLastGeneratedForStructure(
              progressData.appStructureState.lastGeneratedForStructure
            );
          }
        }

        if (progressData.readmeState) {
          if (progressData.readmeState.title !== undefined) {
            readmeStore.setTitle(progressData.readmeState.title);
          }
          if (progressData.readmeState.description !== undefined) {
            readmeStore.setDescription(progressData.readmeState.description);
          }
          if (progressData.readmeState.layouts) {
            const migratedLayouts = progressData.readmeState.layouts.map(
              (layout: any) => ({
                ...layout,
                options: {
                  header: {
                    ...layout.options.header,
                    themeToggle: layout.options.header.themeToggle ?? false,
                  },
                  leftSidebar: {
                    ...layout.options.leftSidebar,
                    themeToggle:
                      layout.options.leftSidebar.themeToggle ?? false,
                  },
                  rightSidebar: {
                    ...layout.options.rightSidebar,
                    themeToggle:
                      layout.options.rightSidebar.themeToggle ?? false,
                  },
                  footer: {
                    ...layout.options.footer,
                  },
                },
              })
            );
            readmeStore.setLayouts(migratedLayouts);
          }
          if (progressData.readmeState.pages) {
            readmeStore.setPages(progressData.readmeState.pages);
          }
          if (progressData.readmeState.authMethods) {
            readmeStore.setAuthMethods(progressData.readmeState.authMethods);
          }
          if (progressData.readmeState.pageAccess) {
            readmeStore.setPageAccess(progressData.readmeState.pageAccess);
          }
          if (progressData.readmeState.stage) {
            readmeStore.setStage(progressData.readmeState.stage);
          }
          if (progressData.readmeState.lastGeneratedForAuth !== undefined) {
            readmeStore.setLastGeneratedForAuth(
              progressData.readmeState.lastGeneratedForAuth
            );
          }
          if (progressData.readmeState.lastGeneratedForPages !== undefined) {
            readmeStore.setLastGeneratedForPages(
              progressData.readmeState.lastGeneratedForPages
            );
          }
          if (progressData.readmeState.lastGeneratedForReadme !== undefined) {
            readmeStore.setLastGeneratedForReadme(
              progressData.readmeState.lastGeneratedForReadme
            );
          }
        }

        if (progressData.databaseTablesState) {
          if (progressData.databaseTablesState.tableDescriptions) {
            databaseTablesStore.setTableDescriptions(
              progressData.databaseTablesState.tableDescriptions
            );
          }
          if (progressData.databaseTablesState.tablesGenerated !== undefined) {
            databaseTablesStore.setTablesGenerated(
              progressData.databaseTablesState.tablesGenerated
            );
          }
          if (progressData.databaseTablesState.accordionValue !== undefined) {
            databaseTablesStore.setAccordionValue(
              progressData.databaseTablesState.accordionValue
            );
          }
          if (progressData.databaseTablesState.expandedTableId !== undefined) {
            databaseTablesStore.setExpandedTableId(
              progressData.databaseTablesState.expandedTableId
            );
          }
          if (
            progressData.databaseTablesState.lastGeneratedAppStructure !==
            undefined
          ) {
            databaseTablesStore.setLastGeneratedAppStructure(
              progressData.databaseTablesState.lastGeneratedAppStructure
            );
          }
          if (
            progressData.databaseTablesState.lastGeneratedTableDescriptions !==
            undefined
          ) {
            databaseTablesStore.setLastGeneratedTableDescriptions(
              progressData.databaseTablesState.lastGeneratedTableDescriptions
            );
          }
        }

        if (progressData.nextStepsState) {
          if (progressData.nextStepsState.openStep !== undefined) {
            nextStepsStore.setOpenStep(progressData.nextStepsState.openStep);
          }
          if (progressData.nextStepsState.unlockedSteps) {
            progressData.nextStepsState.unlockedSteps.forEach(
              (stepId: number) => {
                nextStepsStore.unlockStep(stepId);
              }
            );
          }
        }

        if (progressData.editorState) {
          console.log("[PROGRESS UPLOAD] Setting markdown data, length:", progressData.editorState.data?.flatIndex ? Object.keys(progressData.editorState.data.flatIndex).length : 0);

          const currentVersion = editorStore.data.contentVersion;
          console.log("[PROGRESS UPLOAD] Preserving current version:", currentVersion);

          editorStore.setMarkdownData({
            ...progressData.editorState.data,
            contentVersion: currentVersion
          });

          editorStore.setPreviewMode(progressData.editorState.previewMode);
          editorStore.setDarkMode(progressData.editorState.darkMode);
          editorStore.setAppStructure(progressData.editorState.appStructure);

          console.log("[PROGRESS UPLOAD] Setting generated flags");
          editorStore.setReadmeGenerated(
            progressData.editorState.readmeGenerated
          );
          editorStore.setAppStructureGenerated(
            progressData.editorState.appStructureGenerated
          );
          editorStore.setDatabaseGenerated(
            progressData.editorState.databaseGenerated
          );

          if (progressData.editorState.features) {
            editorStore.setFeatures(progressData.editorState.features);
          }
          if (progressData.editorState.initialConfiguration) {
            editorStore.setInitialConfiguration(
              progressData.editorState.initialConfiguration
            );
          }
        }

        const progressLoadTimestamp = Date.now();

        let targetPage = numberedPages.find((page) => page.order === 1);

        if (progressData.editorState.databaseGenerated) {
          targetPage =
            numberedPages.find((page) => page.path === "database") ||
            targetPage;
        } else if (progressData.editorState.appStructureGenerated) {
          targetPage =
            numberedPages.find((page) => page.path === "app-directory") ||
            targetPage;
        } else if (progressData.editorState.readmeGenerated) {
          targetPage =
            numberedPages.find((page) => page.path === "readme") || targetPage;
        }

        console.log("[PROGRESS UPLOAD] Navigating to:", targetPage?.url, "with timestamp:", progressLoadTimestamp);

        if (targetPage) {
          router.push(targetPage.url + `?progressLoaded=${progressLoadTimestamp}`);
        }

        console.log("[PROGRESS UPLOAD] Restore complete, final flags:", {
          readmeGenerated: editorStore.readmeGenerated,
          appStructureGenerated: editorStore.appStructureGenerated,
          databaseGenerated: editorStore.databaseGenerated,
        });

        toast.success("Progress restored successfully!");
      } catch (error) {
        console.error("Failed to upload progress:", error);
        toast.error(
          "Failed to restore progress. Please check the file format."
        );
      }
    },
    [numberedPages, router]
  );

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      uploadDialogOpen &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0
    ) {
      const item = e.dataTransfer.items[0];
      if (item.type === "application/json") {
        setIsDraggingOver(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (!uploadDialogOpen) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        await processUploadedFile(file);
      } else {
        toast.error("Please drop a JSON file");
      }
    }
  };

  useEffect(() => {
    if (!uploadDialogOpen) return;

    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDocumentDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsDraggingOver(true);
      }
    };

    const handleDocumentDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDocumentDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          await processUploadedFile(file);
        } else {
          toast.error("Please drop a JSON file");
        }
      }
    };

    document.addEventListener("dragenter", handleDocumentDragEnter);
    document.addEventListener("dragleave", handleDocumentDragLeave);
    document.addEventListener("dragover", preventDefaults);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragenter", handleDocumentDragEnter);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
      document.removeEventListener("dragover", preventDefaults);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, [uploadDialogOpen, processUploadedFile]);

  const progressInfo = useMemo(() => {
    conditionalLog(
      {
        isResetting,
        currentContentPath,
        currentPageIndex,
        numberedPagesLength: numberedPages.length,
        numberedPaths: numberedPages.map((p) => p.path),
      },
      { label: "progress" }
    );

    if (isResetting) {
      conditionalLog(
        { state: "resetting", progressValue: 0 },
        { label: "progress" }
      );
      return {
        currentStep: 0,
        totalSteps: numberedPages.length,
        progressValue: 0,
        currentTitle: "Resetting...",
      };
    }

    const currentStep = currentPageIndex >= 0 ? currentPageIndex + 1 : 0;
    const totalSteps = numberedPages.length;
    const progressValue =
      totalSteps > 0 && currentStep > 0 ? (currentStep / totalSteps) * 100 : 0;

    conditionalLog(
      {
        state: "calculated",
        currentStep,
        totalSteps,
        progressValue,
        currentPageIndex,
      },
      { label: "progress" }
    );

    return {
      currentStep,
      totalSteps,
      progressValue,
      currentTitle:
        currentPageIndex >= 0
          ? numberedPages[currentPageIndex]?.title || "Unknown"
          : "Unknown",
    };
  }, [numberedPages, currentPageIndex, isResetting, currentContentPath]);

  return (
    <TooltipProvider>
      {uploadDialogOpen && (
        <div
          className={cn(
            "fixed inset-0 z-[60] transition-colors",
            isDraggingOver ? "bg-primary/10" : "bg-transparent"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
      <div className="w-full max-w-full border-b theme-border-border theme-bg-background theme-text-foreground theme-shadow theme-font theme-tracking overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full max-w-full">
              <Progress
                value={progressInfo.progressValue}
                className="h-[2px] w-full max-w-full rounded-none"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="theme-font theme-tracking">
            <p>
              {progressInfo.currentTitle} ({progressInfo.currentStep} of{" "}
              {progressInfo.totalSteps})
            </p>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center justify-between h-12 theme-px-2 max-w-full">
          <div className="flex items-center gap-1 md:theme-gap-2">
            {canGoBack && (
              <Button
                onClick={() => {
                  handleBack();
                }}
                variant="outline"
                className="theme-py-1 px-2 md:theme-px-3 flex items-center theme-gap-2 font-semibold theme-font theme-tracking text-md"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline">Back</span>
              </Button>
            )}

            <div className="flex md:hidden items-center gap-1 pl-2 pr-1">
              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setVideoDialogOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full h-8 w-8"
                >
                  <HelpCircle className="!h-6 !w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How it works</p>
              </TooltipContent>
            </Tooltip>
            <EditorPopover
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <EditorPopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-[3px] h-8 w-8"
                >
                  <Ellipsis style={{ width: 24, height: 24 }} />
                </Button>
              </EditorPopoverTrigger>
              <EditorPopoverContent className="w-64 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font theme-tracking p-2">
                <div className="flex flex-col theme-gap-1">
                  <div className="flex items-center justify-between px-2 py-1 theme-border-border border-b mb-1">
                    <span className="text-sm">Dark mode</span>
                    <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start theme-gap-2 h-9"
                    onClick={() => {
                      setResetPageDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ListRestart className="!h-5 !w-5" />
                    Reset current page
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start theme-gap-2 h-9"
                    onClick={() => {
                      setResetAllDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <RotateCcw className="!h-5 !w-5" />
                    Reset all pages
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start theme-gap-2 h-9"
                    onClick={() => {
                      handleSaveProgress();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Save className="!h-5 !w-5" />
                    Save your progress
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start theme-gap-2 h-9"
                    onClick={() => {
                      setUploadDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <HardDriveUpload className="!h-5 !w-5" />
                    Upload saved progress
                  </Button>
                </div>
              </EditorPopoverContent>
            </EditorPopover>

            <div className="hidden md:flex items-center theme-gap-2">
              <div className="px-1">
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setVideoDialogOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <HelpCircle className="!h-6 !w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How it works</p>
                </TooltipContent>
              </Tooltip>
              <EditorPopover
                open={resetPopoverOpen}
                onOpenChange={setResetPopoverOpen}
              >
                <EditorPopoverTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-[3px] h-8 w-8"
                        >
                          <RotateCcw className="!h-5 !w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset options</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </EditorPopoverTrigger>
                <EditorPopoverContent className="w-56 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font theme-tracking p-2">
                  <div className="flex flex-col theme-gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start theme-gap-2 h-9"
                      onClick={() => {
                        setResetPageDialogOpen(true);
                        setResetPopoverOpen(false);
                      }}
                    >
                      <ListRestart className="!h-5 !w-5" />
                      Reset current page
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start theme-gap-2 h-9"
                      onClick={() => {
                        setResetAllDialogOpen(true);
                        setResetPopoverOpen(false);
                      }}
                    >
                      <RotateCcw className="!h-5 !w-5" />
                      Reset all pages
                    </Button>
                  </div>
                </EditorPopoverContent>
              </EditorPopover>

              <EditorPopover
                open={savePopoverOpen}
                onOpenChange={setSavePopoverOpen}
              >
                <EditorPopoverTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-[3px] h-8 w-8"
                        >
                          <Save className="!h-5 !w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save options</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </EditorPopoverTrigger>
                <EditorPopoverContent className="w-56 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font theme-tracking p-2">
                  <div className="flex flex-col theme-gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start theme-gap-2 h-9"
                      onClick={handleSaveProgress}
                    >
                      <Save className="!h-5 !w-5" />
                      Save your progress
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start theme-gap-2 h-9"
                      onClick={() => {
                        setUploadDialogOpen(true);
                        setSavePopoverOpen(false);
                      }}
                    >
                      <HardDriveUpload className="!h-5 !w-5" />
                      Upload saved progress
                    </Button>
                  </div>
                </EditorPopoverContent>
              </EditorPopover>
            </div>
          </div>

          <div className="flex items-center theme-gap-3">
            <EditorDialog
              open={resetPageDialogOpen}
              onOpenChange={setResetPageDialogOpen}
            >
              <EditorDialogContent>
                <EditorDialogHeader>
                  <EditorDialogTitle>Reset Current Page</EditorDialogTitle>
                  <EditorDialogDescription>
                    Are you sure you want to reset this page? This will restore
                    the content to its original state
                    {currentContentPath === "theme" &&
                      " and reset all theme configuration"}
                    {currentContentPath === "database" &&
                      " and reset all database configuration"}
                    {currentContentPath === "app-directory" &&
                      " and reset the app structure"}
                    . This action cannot be undone.
                  </EditorDialogDescription>
                </EditorDialogHeader>
                <EditorDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResetPageDialogOpen(false)}
                    className="theme-font theme-tracking"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetPage}
                    className="theme-font theme-tracking"
                  >
                    Reset Page
                  </Button>
                </EditorDialogFooter>
              </EditorDialogContent>
            </EditorDialog>

            <EditorDialog
              open={resetAllDialogOpen}
              onOpenChange={setResetAllDialogOpen}
            >
              <EditorDialogContent>
                <EditorDialogHeader>
                  <EditorDialogTitle>Reset All Files</EditorDialogTitle>
                  <EditorDialogDescription>
                    Are you sure you want to reset all files? This will restore
                    all content to its original state and cannot be undone.
                  </EditorDialogDescription>
                </EditorDialogHeader>
                <EditorDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResetAllDialogOpen(false)}
                    className="theme-font theme-tracking"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetAll}
                    disabled={resetAllLoading}
                    className="theme-font theme-tracking"
                  >
                    {resetAllLoading ? "Resetting..." : "Reset All"}
                  </Button>
                </EditorDialogFooter>
              </EditorDialogContent>
            </EditorDialog>

            <EditorDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
            >
              <EditorDialogContent
                className="z-[70]"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <EditorDialogHeader>
                  <EditorDialogTitle>Upload Saved Progress</EditorDialogTitle>
                  <EditorDialogDescription>
                    Select a progress file to restore your previous work. This
                    will replace your current configuration.
                  </EditorDialogDescription>
                </EditorDialogHeader>
                <div className="theme-p-4">
                  <div
                    className={cn(
                      "theme-border-2 border-dashed theme-radius theme-p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
                      isDraggingOver
                        ? "theme-border-primary theme-bg-primary/10"
                        : "theme-border-border hover:theme-bg-accent"
                    )}
                    onClick={() => {
                      if (!isDraggingOver) {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "application/json,.json";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            setUploadedFile(file);
                          }
                        };
                        input.click();
                      }
                    }}
                  >
                    {isDraggingOver ? (
                      <>
                        <ArrowBigDownDash className="h-12 w-12 theme-text-primary mb-2 animate-bounce pointer-events-none" />
                        <p className="text-sm theme-text-foreground font-medium mb-1 pointer-events-none">
                          Drop to restore your progress
                        </p>
                        <p className="text-xs theme-text-muted-foreground pointer-events-none">
                          Release to load the saved configuration
                        </p>
                      </>
                    ) : (
                      <>
                        <HardDriveUpload className="h-8 w-8 theme-text-muted-foreground mb-2 pointer-events-none" />
                        <p className="text-sm theme-text-foreground mb-1 pointer-events-none">
                          {uploadedFile
                            ? uploadedFile.name
                            : "Click to select a JSON file"}
                        </p>
                        <p className="text-xs theme-text-muted-foreground pointer-events-none">
                          or drag and drop
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </EditorDialogContent>
            </EditorDialog>

            {videoDialogOpen && (
              <div
                className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setVideoDialogOpen(false)}
              >
                <Button
                  onClick={() => setVideoDialogOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 rounded-full h-12 w-12 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  <X className="h-7 w-7" />
                </Button>
                <div
                  className="relative aspect-[9/16] bg-black/50 p-4 rounded-lg"
                  style={{
                    height: "min(100vh, calc(100vw * 16 / 9))",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    className="w-full h-full rounded"
                    src="https://www.youtube.com/embed/kBHy4ATV6aY"
                    title="How it works"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center theme-gap-4">
            <div
              className={cn(
                "flex items-center theme-gap-3 transition-all",
                previewMode &&
                  "theme-border-primary border-2 rounded-full theme-px-2 theme-py-1"
              )}
            >
              {previewMode && (
                <EditorPopover>
                  <EditorPopoverTrigger asChild>
                    <button className=" rounded-full flex items-center justify-center theme-bg-card  cursor-pointer hover:opacity-80 transition-opacity">
                      <AlertCircle className="h-6 w-6 theme-text-primary" />
                    </button>
                  </EditorPopoverTrigger>
                  <EditorPopoverContent className="w-80 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font theme-tracking">
                    <div className="flex flex-col theme-gap-2">
                      <h4 className="font-semibold text-sm theme-font theme-tracking">
                        Preview Mode (Read Only)
                      </h4>
                      <p className="text-sm theme-font theme-tracking">
                        You are currently in preview mode.
                      </p>
                      <p className="text-sm theme-font theme-tracking">
                        This shows exactly how your content will look when
                        downloaded.
                      </p>
                      <p className="text-sm theme-font theme-tracking">
                        Switch back to Edit mode to continue making changes.
                      </p>
                    </div>
                  </EditorPopoverContent>
                </EditorPopover>
              )}

              <EditModeSwitch
                previewMode={
                  isViewingComponentFile
                    ? true
                    : !isPreviewEnabledPage
                      ? false
                      : previewMode
                }
                onToggle={(checked) => {
                  setPreviewMode(checked);
                }}
                disabled={!canTogglePreview}
              />
            </div>
            {canGoNext && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNext}
                    size={currentPageIndex <= 4 ? "sm" : "default"}
                    variant={currentPageIndex <= 4 ? "default" : "outline"}
                    className=" theme-py-1 theme-px1 xs:theme-px-3 flex items-center theme-gap-2 font-semibold theme-font theme-tracking text-md"
                  >
                    <span className="xs:block hidden">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="theme-bg-popover theme-text-popover-foreground theme-shadow theme-font theme-tracking">
                  <p>Next: {nextPageTitle}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
