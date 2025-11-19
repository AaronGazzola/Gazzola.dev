"use client";

import { EditModeSwitch } from "@/components/EditModeSwitch";
import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import {
  Dialog as EditorDialog,
  DialogContent as EditorDialogContent,
  DialogDescription as EditorDialogDescription,
  DialogFooter as EditorDialogFooter,
  DialogHeader as EditorDialogHeader,
  DialogTitle as EditorDialogTitle,
  DialogTrigger as EditorDialogTrigger,
} from "@/components/editor/ui/dialog";
import { Label } from "@/components/editor/ui/label";
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
import { Button as GlobalButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalkthroughHelper } from "@/components/WalkthroughHelper";
import { conditionalLog } from "@/lib/log.util";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  File,
  Files,
  Folder,
  Home,
  ListRestart,
  Menu,
  MessagesSquare,
  Palette,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useDatabaseStore } from "../../(components)/DatabaseConfiguration.stores";
import { useHeaderStore } from "../../(components)/Header.store";
import { useThemeStore as useThemeConfigStore } from "../../(components)/ThemeConfiguration.stores";
import { useThemeStore } from "../../layout.stores";
import { getMarkdownDataAction } from "../layout.actions";
import { useContentVersionCheck } from "../layout.hooks";
import { useEditorStore } from "../layout.stores";
import { useWalkthroughStore } from "../layout.walkthrough.stores";
import { WalkthroughStep } from "../layout.walkthrough.types";

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
  } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { resetTheme } = useThemeConfigStore();
  const { reset: resetDatabase } = useDatabaseStore();
  const {
    shouldShowStep,
    markStepComplete,
    dismissWalkthrough,
    startWalkthrough,
    isStepOpen,
    setStepOpen,
    initialDialogShown,
    resetWalkthrough,
  } = useWalkthroughStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);
  const [menuPopoverOpen, setMenuPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { hasBeenCollapsed } = useHeaderStore();
  const showInitialDialog =
    mounted &&
    shouldShowStep(WalkthroughStep.INITIAL_DIALOG) &&
    !codeReviewDialogOpen &&
    hasBeenCollapsed;
  const showPreviewHelp =
    mounted && shouldShowStep(WalkthroughStep.PREVIEW_MODE);
  const showNextButtonHelp =
    mounted && shouldShowStep(WalkthroughStep.NEXT_BUTTON);

  const [initialDialogOpen, setInitialDialogOpen] = useState(false);
  const [previewHelpOpen, setPreviewHelpOpen] = useState(false);
  const [nextButtonHelpOpen, setNextButtonHelpOpen] = useState(false);
  const [permanentHelperOpen, setPermanentHelperOpen] = useState(false);

  const allPages = useMemo(() => {
    const pages: { path: string; url: string; title: string; order: number }[] =
      [];

    const extractPages = (node: any, parentUrl = ""): void => {
      if (node.include === false) {
        return;
      }

      if (node.type === "file") {
        if (node.includeInToolbar !== false) {
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

  const handleResetPage = () => {
    const node = data.flatIndex[currentContentPath];
    if (node && node.type === "file") {
      const originalContent = node.content
        .replace(/\\n/g, "\n")
        .replace(/\\`/g, "`")
        .replace(/\\\$/g, "$")
        .replace(/\\\\/g, "\\");
      setContent(currentContentPath, originalContent);
    }
    if (currentContentPath === "theme") {
      resetTheme();
    }
    forceRefresh();
    setResetPageDialogOpen(false);
  };

  const handleResetAll = async () => {
    conditionalLog("Toolbar.handleResetAll: Starting", {
      label: "markdown-parse",
    });
    setResetAllLoading(true);
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

        const firstPagePath = Object.values(freshData.flatIndex)
          .filter(
            (node) =>
              node.type === "file" &&
              node.include !== false &&
              !(node as any).previewOnly &&
              !(node as any).visibleAfterPage
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
        resetWalkthrough();
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
        }
      }
      setResetAllDialogOpen(false);
    } catch (error) {
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
    const currentStep = currentPageIndex >= 0 ? currentPageIndex + 1 : 0;
    const totalSteps = numberedPages.length;
    const progressValue =
      totalSteps > 0 && currentStep > 0 ? (currentStep / totalSteps) * 100 : 0;

    return {
      currentStep,
      totalSteps,
      progressValue,
      currentTitle:
        currentPageIndex >= 0
          ? numberedPages[currentPageIndex]?.title || "Unknown"
          : "Unknown",
    };
  }, [numberedPages, currentPageIndex]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-full border-b theme-border-border theme-bg-background theme-text-foreground theme-shadow theme-font-sans theme-tracking overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full max-w-full">
              <Progress
                value={progressInfo.progressValue}
                className="h-1 w-full max-w-full rounded-none"
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
          <div className="flex items-center theme-gap-4">
            <Button
              onClick={() => {
                handleBack();
              }}
              disabled={!canGoBack}
              variant="outline"
              className=" theme-py-1 theme-px-3 flex items-center theme-gap-2 font-medium theme-font-sans theme-tracking"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Back</span>
            </Button>

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

            <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
          </div>

          <div className="flex items-center theme-gap-3">
            {showInitialDialog ? (
              <Dialog
                open={
                  initialDialogOpen ||
                  !isStepOpen(WalkthroughStep.INITIAL_DIALOG)
                }
                onOpenChange={(open) => {
                  setInitialDialogOpen(open);
                  if (!open) {
                    if (!isStepOpen(WalkthroughStep.INITIAL_DIALOG)) {
                      setStepOpen(WalkthroughStep.INITIAL_DIALOG, true);
                    }
                    dismissWalkthrough();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <WalkthroughHelper />
                </DialogTrigger>
                <DialogContent className="max-w-[40rem] outline-none text-base bg-popover  text-popover-foreground  shadow theme-font-sans theme-tracking">
                  <DialogHeader className="gap-3">
                    <DialogTitle className=" text-foreground theme-font-sans theme-tracking">
                      Welcome to Gazzola.dev
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-foreground mt-2 theme-font-sans theme-tracking">
                    Design your roadmap, build it with AI, get a free code
                    review!
                  </div>
                  <div className="flex flex-col my-4">
                    <div className="flex flex-row items-center justify-center relative gap-3 mt-6">
                      {nextSteps.map((step, index) => (
                        <div
                          key={index}
                          className="relative flex flex-row items-center gap-3"
                        >
                          <div className="flex flex-col items-center relative z-10 ">
                            <svg
                              className="w-10 h-10"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <defs>
                                <linearGradient
                                  id={`gradient-next-toolbar-${index}`}
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="100%"
                                >
                                  {gradientEnabled ? (
                                    gradientColors.map((color, colorIndex) => (
                                      <stop
                                        key={colorIndex}
                                        offset={`${(colorIndex / (gradientColors.length - 1)) * 100}%`}
                                        stopColor={color}
                                      />
                                    ))
                                  ) : (
                                    <stop offset="0%" stopColor={singleColor} />
                                  )}
                                </linearGradient>
                              </defs>
                              <step.icon
                                className="w-10 h-10 [stroke-width:1]"
                                stroke={`url(#gradient-next-toolbar-${index})`}
                                fill="none"
                              />
                            </svg>
                            <span className="text-base font-semibold text-center whitespace-nowrap text-foreground theme-font-sans theme-tracking">
                              {step.title}
                            </span>
                          </div>
                          {index < nextSteps.length - 1 && (
                            <ArrowRight className="w-5 h-5 shrink-0 drop-shadow-[0_0_4px_rgba(147,51,234,0.5)]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full flex justify-center text-foreground mt-6 theme-font-sans theme-tracking">
                    Do you want to enable the tutorial?
                  </div>
                  <DialogFooter className="mt-4">
                    <div className="flex sm:flex-row flex-col items-end sm:items-center gap-2 justify-between w-full">
                      <div className="w-full flex justify-start">
                        <GlobalButton
                          variant="ghost"
                          className="text-base focus-visible:ring-none theme-font-sans theme-tracking border"
                          onClick={() => {
                            dismissWalkthrough();
                            setInitialDialogOpen(false);
                          }}
                        >
                          No thanks!, I&apos;ll explore on my own
                        </GlobalButton>
                      </div>
                      <GlobalButton
                        className="text-base theme-font-sans theme-tracking"
                        variant="outline"
                        onClick={() => {
                          startWalkthrough();
                          markStepComplete(WalkthroughStep.INITIAL_DIALOG);
                          setStepOpen(WalkthroughStep.INITIAL_DIALOG, true);
                          setInitialDialogOpen(false);
                        }}
                      >
                        Show helpful tips
                      </GlobalButton>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              initialDialogShown && (
                <WalkthroughHelper
                  isOpen={permanentHelperOpen}
                  onOpenChange={setPermanentHelperOpen}
                  title="Walkthrough Help"
                  description="Need help getting started? Click the button below to restart the walkthrough guide."
                  showRestartButton={true}
                />
              )
            )}

            <div className="hidden lg:flex items-center theme-gap-3">
              <span>
                <IconButton
                  onClick={() => setResetPageDialogOpen(true)}
                  tooltip="Reset current page"
                >
                  <RotateCcw className="h-4 w-4" />
                </IconButton>
              </span>

              <IconButton
                onClick={() => setResetAllDialogOpen(true)}
                tooltip="Reset all pages"
              >
                <ListRestart className="h-4 w-4" />
              </IconButton>

              {isDevelopment && (
                <EditorPopover
                  open={sectionsPopoverOpen}
                  onOpenChange={setSectionsPopoverOpen}
                >
                  <EditorPopoverTrigger asChild>
                    <span>
                      <IconButton
                        onClick={() => setSectionsPopoverOpen(true)}
                        tooltip="Manage sections"
                      >
                        <Settings className="h-4 w-4" />
                      </IconButton>
                    </span>
                  </EditorPopoverTrigger>
                  <EditorPopoverContent
                    className="w-80 max-h-96 overflow-y-auto theme-bg-popover theme-shadow theme-font-sans theme-tracking"
                    align="center"
                  >
                    <div className="flex flex-col theme-gap-4">
                      <div className="font-semibold text-sm theme-text-foreground theme-font-sans theme-tracking">
                        Section Options
                      </div>
                      {sectionsData.length === 0 ? (
                        <div className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
                          No sections found
                        </div>
                      ) : (
                        sectionsData.map((file) => (
                          <div
                            key={file.filePath}
                            className="flex flex-col theme-gap-3"
                          >
                            <div className="font-medium text-sm border-b theme-border-border theme-pb-1 theme-text-foreground theme-font-sans theme-tracking">
                              {file.fileName}
                            </div>
                            {file.sections.map((section) => (
                              <div
                                key={section.sectionId}
                                className="theme-ml-2 flex flex-col theme-gap-2"
                              >
                                <div className="text-sm font-medium theme-text-muted-foreground theme-font-sans theme-tracking">
                                  {section.sectionId}
                                </div>
                                {section.options.map((option) => (
                                  <div
                                    key={option.optionId}
                                    className="flex items-center theme-gap-2 theme-ml-4"
                                  >
                                    <Checkbox
                                      checked={getSectionInclude(
                                        file.filePath,
                                        section.sectionId,
                                        option.optionId
                                      )}
                                      onCheckedChange={(checked) =>
                                        setSectionInclude(
                                          file.filePath,
                                          section.sectionId,
                                          option.optionId,
                                          checked as boolean
                                        )
                                      }
                                    />
                                    <Label
                                      className="text-sm cursor-pointer theme-text-foreground theme-font-sans theme-tracking"
                                      onClick={() =>
                                        setSectionInclude(
                                          file.filePath,
                                          section.sectionId,
                                          option.optionId,
                                          !getSectionInclude(
                                            file.filePath,
                                            section.sectionId,
                                            option.optionId
                                          )
                                        )
                                      }
                                    >
                                      {option.optionId}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </EditorPopoverContent>
                </EditorPopover>
              )}

              {isDevelopment && (
                <EditorPopover
                  open={fileTreePopoverOpen}
                  onOpenChange={setFileTreePopoverOpen}
                >
                  <EditorPopoverTrigger asChild>
                    <span>
                      <IconButton
                        onClick={() => setFileTreePopoverOpen(true)}
                        tooltip="Manage file inclusion"
                      >
                        <Files className="h-4 w-4" />
                      </IconButton>
                    </span>
                  </EditorPopoverTrigger>
                  <EditorPopoverContent
                    className="w-80 max-h-96 overflow-y-auto theme-bg-popover theme-shadow theme-font-sans theme-tracking"
                    align="center"
                  >
                    <div className="flex flex-col theme-gap-3">
                      <div className="font-semibold text-sm theme-text-foreground theme-font-sans theme-tracking">
                        File Inclusion
                      </div>
                      {fileTreeData.length === 0 ? (
                        <div className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
                          No files found
                        </div>
                      ) : (
                        fileTreeData.map((item) => (
                          <div
                            key={item.path}
                            className="flex items-center theme-gap-2"
                            style={{ marginLeft: `${item.level * 12}px` }}
                          >
                            <Checkbox
                              checked={item.include}
                              onCheckedChange={(checked) =>
                                updateInclusionRules({
                                  [item.path]: checked as boolean,
                                })
                              }
                            />
                            {item.type === "directory" ? (
                              <Folder className="h-4 w-4 text-[hsl(217,91%,60%)] theme-text-primary" />
                            ) : (
                              <File className="h-4 w-4 theme-text-muted-foreground" />
                            )}
                            <Label
                              className="text-sm cursor-pointer flex-1 theme-text-foreground theme-font-sans theme-tracking"
                              onClick={() =>
                                updateInclusionRules({
                                  [item.path]: !item.include,
                                })
                              }
                            >
                              {item.name}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </EditorPopoverContent>
                </EditorPopover>
              )}
            </div>

            <EditorPopover
              open={menuPopoverOpen}
              onOpenChange={setMenuPopoverOpen}
            >
              <EditorPopoverTrigger asChild>
                <span className="lg:hidden">
                  <IconButton
                    onClick={() => setMenuPopoverOpen(true)}
                    tooltip="More options"
                  >
                    <Menu className="h-4 w-4" />
                  </IconButton>
                </span>
              </EditorPopoverTrigger>
              <EditorPopoverContent
                className="w-56 theme-bg-popover theme-shadow theme-font-sans theme-tracking"
                align="end"
              >
                <div className="flex flex-col theme-gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setResetPageDialogOpen(true);
                      setMenuPopoverOpen(false);
                    }}
                    className="justify-start theme-gap-2 theme-font-sans theme-tracking"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Current Page
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setResetAllDialogOpen(true);
                      setMenuPopoverOpen(false);
                    }}
                    className="justify-start theme-gap-2 theme-font-sans theme-tracking"
                  >
                    <ListRestart className="h-4 w-4" />
                    Reset All Pages
                  </Button>
                  {isDevelopment && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSectionsPopoverOpen(true);
                          setMenuPopoverOpen(false);
                        }}
                        className="justify-start theme-gap-2 theme-font-sans theme-tracking"
                      >
                        <Settings className="h-4 w-4" />
                        Manage Sections
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setFileTreePopoverOpen(true);
                          setMenuPopoverOpen(false);
                        }}
                        className="justify-start theme-gap-2 theme-font-sans theme-tracking"
                      >
                        <Files className="h-4 w-4" />
                        Manage File Inclusion
                      </Button>
                    </>
                  )}
                </div>
              </EditorPopoverContent>
            </EditorPopover>

            <EditorDialog
              open={resetPageDialogOpen}
              onOpenChange={setResetPageDialogOpen}
            >
              <EditorDialogContent>
                <EditorDialogHeader>
                  <EditorDialogTitle>Reset Current Page</EditorDialogTitle>
                  <EditorDialogDescription>
                    Are you sure you want to reset the current file? This will
                    restore it to its original content and cannot be undone.
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

            {showPreviewHelp && (
              <WalkthroughHelper
                isOpen={previewHelpOpen}
                onOpenChange={(open) => {
                  setPreviewHelpOpen(open);
                  if (!open && isStepOpen(WalkthroughStep.PREVIEW_MODE)) {
                    markStepComplete(WalkthroughStep.PREVIEW_MODE);
                  } else if (
                    open &&
                    !isStepOpen(WalkthroughStep.PREVIEW_MODE)
                  ) {
                    setStepOpen(WalkthroughStep.PREVIEW_MODE, true);
                  }
                }}
                showAnimation={!isStepOpen(WalkthroughStep.PREVIEW_MODE)}
                title="Preview Mode"
                description="Toggle this switch to preview exactly how your markdown content will look when you download your roadmap. In preview mode, the editor becomes read-only."
                iconSize="sm"
              />
            )}
            <EditModeSwitch
              previewMode={isViewingComponentFile ? true : previewMode}
              onToggle={(checked) => {
                if (!isViewingComponentFile) {
                  setPreviewMode(checked);
                  if (showPreviewHelp) {
                    markStepComplete(WalkthroughStep.PREVIEW_MODE);
                  }
                }
              }}
              disabled={isViewingComponentFile}
            />

            <div className="relative">
              {showNextButtonHelp && (
                <div className="absolute -top-2 -right-2 z-10">
                  <WalkthroughHelper
                    isOpen={nextButtonHelpOpen}
                    onOpenChange={(open) => {
                      setNextButtonHelpOpen(open);
                      if (!open && isStepOpen(WalkthroughStep.NEXT_BUTTON)) {
                        markStepComplete(WalkthroughStep.NEXT_BUTTON);
                      } else if (
                        open &&
                        !isStepOpen(WalkthroughStep.NEXT_BUTTON)
                      ) {
                        setStepOpen(WalkthroughStep.NEXT_BUTTON, true);
                      }
                    }}
                    showAnimation={!isStepOpen(WalkthroughStep.NEXT_BUTTON)}
                    title="Progress Through Documents"
                    description="Click the Next button to move through the documents in your roadmap. Each document builds on the previous ones to provide complete instructions for building your web application."
                    iconSize="sm"
                  />
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      handleNext();
                      if (showNextButtonHelp) {
                        markStepComplete(WalkthroughStep.NEXT_BUTTON);
                      }
                    }}
                    disabled={!canGoNext}
                    variant="outline"
                    className=" theme-py-1 theme-px-3 flex items-center theme-gap-2 font-medium theme-font-sans theme-tracking"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="theme-bg-popover theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking">
                  <p>{canGoNext ? `Next: ${nextPageTitle}` : "No next page"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
