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
import { conditionalLog } from "@/lib/log.util";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Home,
  ListRestart,
  MessagesSquare,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useMemo, useRef, useState } from "react";
import { useDatabaseStore } from "../../(components)/DatabaseConfiguration.stores";
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
    setReadmeGenerated,
    readmeGenerated,
    setDatabaseGenerated,
    setAppStructure,
    updateInitialConfiguration,
  } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { resetTheme } = useThemeConfigStore();
  const { reset: resetDatabase } = useDatabaseStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nextTooltipOpen, setNextTooltipOpen] = useState(false);
  const [nextTooltipLocked, setNextTooltipLocked] = useState(false);
  const nextTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextTooltipHoveringRef = useRef(false);

  const allPages = useMemo(() => {
    const pages: { path: string; url: string; title: string; order: number }[] =
      [];

    const extractPages = (node: any, parentUrl = ""): void => {
      if (node.include === false || node.includeInSidebar === false) {
        return;
      }

      if (node.type === "file") {
        if (node.includeInToolbar !== false && node.includeInSidebar !== false) {
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

  const isReadmeNotGenerated = useMemo(() => {
    return currentContentPath === "readme" && !readmeGenerated;
  }, [currentContentPath, readmeGenerated]);

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
      markPageVisited(nextPage.path);
      router.push(nextPage.url);
    }
  };

  const handleNextWrapperClick = () => {
    if (isReadmeNotGenerated) {
      if (nextTooltipTimeoutRef.current) {
        clearTimeout(nextTooltipTimeoutRef.current);
      }

      setNextTooltipLocked(true);
      setNextTooltipOpen(true);

      nextTooltipTimeoutRef.current = setTimeout(() => {
        setNextTooltipLocked(false);
        if (!nextTooltipHoveringRef.current) {
          setNextTooltipOpen(false);
        }
        nextTooltipTimeoutRef.current = null;
      }, 3000);
    }
  };

  const handleNextTooltipOpenChange = (open: boolean) => {
    if (!nextTooltipLocked) {
      setNextTooltipOpen(open);
    } else if (open) {
      setNextTooltipOpen(true);
    }
  };

  const handleNextTooltipPointerEnter = () => {
    nextTooltipHoveringRef.current = true;
  };

  const handleNextTooltipPointerLeave = () => {
    nextTooltipHoveringRef.current = false;
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

    if (currentContentPath === "app-structure") {
      setAppStructure([]);
      setAppStructureGenerated(false);
    }

    if (currentContentPath === "readme") {
      setReadmeGenerated(false);
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
      <div className="w-full max-w-full border-b theme-border-border theme-bg-background theme-text-foreground theme-shadow theme-font-sans theme-tracking overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full max-w-full">
              <Progress
                value={progressInfo.progressValue}
                className="h-[2px] w-full max-w-full rounded-none"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="theme-font-sans theme-tracking">
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
                className="theme-py-1 px-2 md:theme-px-3 flex items-center theme-gap-2 font-medium theme-font-sans theme-tracking"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline">Back</span>
              </Button>
            )}

            <div className="xs:flex hidden md:hidden items-center gap-1 pl-2 pr-1">
              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              <Button
                onClick={handleHome}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleHome}
              variant="outline"
              size="icon"
              className="xs:hidden h-8 w-8"
            >
              <Home className="h-4 w-4" />
            </Button>

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
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </EditorPopoverTrigger>
              <EditorPopoverContent className="w-48 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking p-2">
                <div className="flex flex-col theme-gap-1">
                  <div className="xs:hidden flex items-center justify-between px-2 py-1">
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
                    <ListRestart className="h-4 w-4" />
                    Reset page
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start theme-gap-2 h-9"
                    onClick={() => {
                      setResetAllDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset all
                  </Button>
                </div>
              </EditorPopoverContent>
            </EditorPopover>

            <div className="hidden md:flex items-center theme-gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleHome}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to first page</p>
                </TooltipContent>
              </Tooltip>

              <div className="px-1">
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
              </div>

              <IconButton
                onClick={() => setResetPageDialogOpen(true)}
                tooltip="Reset current page"
              >
                <ListRestart className="h-4 w-4" />
              </IconButton>

              <IconButton
                onClick={() => setResetAllDialogOpen(true)}
                tooltip="Reset all pages"
              >
                <RotateCcw className="h-4 w-4" />
              </IconButton>
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
                    {currentContentPath === "app-structure" &&
                      " and reset the app structure"}
                    . This action cannot be undone.
                  </EditorDialogDescription>
                </EditorDialogHeader>
                <EditorDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResetPageDialogOpen(false)}
                    className="theme-font-sans theme-tracking"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetPage}
                    className="theme-font-sans theme-tracking"
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
                    className="theme-font-sans theme-tracking"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetAll}
                    disabled={resetAllLoading}
                    className="theme-font-sans theme-tracking"
                  >
                    {resetAllLoading ? "Resetting..." : "Reset All"}
                  </Button>
                </EditorDialogFooter>
              </EditorDialogContent>
            </EditorDialog>
          </div>

          <div className="flex items-center theme-gap-4">
            {previewMode && (
              <EditorPopover>
                <EditorPopoverTrigger asChild>
                  <button className=" rounded-full flex items-center justify-center theme-bg-card  cursor-pointer hover:opacity-80 transition-opacity">
                    <AlertCircle className="h-6 w-6 theme-text-primary" />
                  </button>
                </EditorPopoverTrigger>
                <EditorPopoverContent className="w-80 theme-bg-popover theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking">
                  <div className="flex flex-col theme-gap-2">
                    <h4 className="font-semibold text-sm theme-font-sans theme-tracking">
                      Preview Mode (Read Only)
                    </h4>
                    <p className="text-sm theme-font-sans theme-tracking">
                      You are currently in preview mode.
                    </p>
                    <p className="text-sm theme-font-sans theme-tracking">
                      This shows exactly how your content will look when
                      downloaded.
                    </p>
                    <p className="text-sm theme-font-sans theme-tracking">
                      Switch back to Edit mode to continue making changes.
                    </p>
                  </div>
                </EditorPopoverContent>
              </EditorPopover>
            )}

            <EditModeSwitch
              previewMode={isViewingComponentFile ? true : isReadmeNotGenerated ? false : previewMode}
              onToggle={(checked) => {
                if (!isViewingComponentFile && !isReadmeNotGenerated) {
                  setPreviewMode(checked);
                }
              }}
              disabled={isViewingComponentFile || isReadmeNotGenerated}
            />
            {canGoNext && (
              <Tooltip open={nextTooltipOpen} onOpenChange={handleNextTooltipOpenChange}>
                <TooltipTrigger asChild>
                  <span
                    onClick={handleNextWrapperClick}
                    onPointerEnter={handleNextTooltipPointerEnter}
                    onPointerLeave={handleNextTooltipPointerLeave}
                  >
                    <Button
                      onClick={handleNext}
                      size={currentPageIndex <= 4 ? "sm" : "default"}
                      variant={currentPageIndex <= 4 ? "default" : "outline"}
                      className=" theme-py-1 theme-px-3 flex items-center theme-gap-2 font-medium theme-font-sans theme-tracking "
                      disabled={isReadmeNotGenerated}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="theme-bg-popover theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking">
                  <p>
                    {isReadmeNotGenerated
                      ? "Generate your README file to continue"
                      : canGoNext
                        ? `Next: ${nextPageTitle}`
                        : "No next page"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
