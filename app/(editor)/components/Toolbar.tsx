"use client";

import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Label } from "@/components/editor/ui/label";
import { Progress } from "@/components/editor/ui/progress";
import { Switch } from "@/components/editor/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { Button as GlobalButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as EditorDialog,
  DialogContent as EditorDialogContent,
  DialogDescription as EditorDialogDescription,
  DialogFooter as EditorDialogFooter,
  DialogHeader as EditorDialogHeader,
  DialogTitle as EditorDialogTitle,
  DialogTrigger as EditorDialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover as EditorPopover,
  PopoverContent as EditorPopoverContent,
  PopoverTrigger as EditorPopoverTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WalkthroughHelper } from "@/components/WalkthroughHelper";
import { conditionalLog } from "@/lib/log.util";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  Eye,
  File,
  Files,
  FlaskConical,
  Folder,
  Info,
  LayoutPanelTop,
  ListRestart,
  Palette,
  RotateCcw,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useThemeStore } from "../../layout.stores";
import { useThemeStore as useThemeConfigStore } from "../../(components)/ThemeConfiguration.stores";
import { parseAndGetMarkdownDataAction } from "../layout.actions";
import { useContentVersionCheck } from "../layout.hooks";
import { useEditorStore } from "../layout.stores";
import { useWalkthroughStore } from "../layout.walkthrough.stores";
import { WalkthroughStep } from "../layout.walkthrough.types";

const isDevelopment = process.env.NODE_ENV === "development";

const nextSteps = [
  { icon: Cpu, title: "Tech Stack" },
  { icon: Palette, title: "Theme" },
  { icon: LayoutPanelTop, title: "Layout" },
  { icon: Database, title: "Database" },
  { icon: User, title: "User Flow" },
  { icon: FlaskConical, title: "Tests" },
  { icon: BookDown, title: "Download" },
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
        style={{
          borderRadius: "3px",
          height: "32px",
          width: "32px",
        }}
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
  } = useEditorStore();
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const { resetTheme } = useThemeConfigStore();
  const {
    shouldShowStep,
    markStepComplete,
    dismissWalkthrough,
    startWalkthrough,
    resetWalkthrough,
    isStepOpen,
    setStepOpen,
    initialDialogShown,
  } = useWalkthroughStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);

  const showInitialDialog = shouldShowStep(WalkthroughStep.INITIAL_DIALOG);
  const showPreviewHelp = shouldShowStep(WalkthroughStep.PREVIEW_MODE);
  const showNextButtonHelp = shouldShowStep(WalkthroughStep.NEXT_BUTTON);

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
        pages.push({
          path: node.path,
          url: node.urlPath,
          title: node.displayName,
          order: node.order || 0,
        });
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
    return allPages.findIndex((page) => page.path === currentContentPath);
  }, [allPages, currentContentPath]);

  const nextPage =
    currentPageIndex < allPages.length - 1
      ? allPages[currentPageIndex + 1]
      : null;

  const canGoBack = currentPageIndex > 0;
  const canGoNext = Boolean(nextPage);

  const prevPageTitle = canGoBack ? allPages[currentPageIndex - 1]?.title : "";
  const nextPageTitle = nextPage?.title || "";

  const handleBack = () => {
    if (canGoBack) {
      const prevPage = allPages[currentPageIndex - 1];
      router.push(prevPage.url);
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
    if (currentContentPath === "start-here.theme") {
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
      const { data: freshData, error } = await parseAndGetMarkdownDataAction();

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
        conditionalLog(
          { parseError: String(error) },
          { label: "markdown-parse" }
        );
        alert(
          "Failed to parse markdown files. Please check the console for details."
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
          .filter((node) => node.type === "file" && node.include !== false)
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
    const currentStep = currentPageIndex + 1;
    const totalSteps = allPages.length;
    const progressValue = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

    return {
      currentStep,
      totalSteps,
      progressValue,
      currentTitle: allPages[currentPageIndex]?.title || "Unknown",
    };
  }, [allPages, currentPageIndex]);

  return (
    <TooltipProvider>
      <div style={{ width: "100%", borderBottom: "1px solid var(--theme-border)", backgroundColor: "var(--theme-background)", color: "var(--theme-foreground)" }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div style={{ width: "100%" }}>
              <Progress
                value={progressInfo.progressValue}
                style={{ height: "4px", width: "100%", borderRadius: "0" }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {progressInfo.currentTitle} ({progressInfo.currentStep} of{" "}
              {progressInfo.totalSteps})
            </p>
          </TooltipContent>
        </Tooltip>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px", padding: "0 calc(var(--theme-spacing) * 4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 2)" }}>
            <IconButton
              onClick={handleBack}
              disabled={!canGoBack}
              tooltip={
                canGoBack ? `Previous: ${prevPageTitle}` : "No previous page"
              }
            >
              <ChevronLeft style={{ height: "16px", width: "16px" }} />
            </IconButton>
            {showInitialDialog ? (
              <Dialog
                open={
                  initialDialogOpen ||
                  !isStepOpen(WalkthroughStep.INITIAL_DIALOG)
                }
                onOpenChange={(open) => {
                  setInitialDialogOpen(open);
                  if (!open && !isStepOpen(WalkthroughStep.INITIAL_DIALOG)) {
                    setStepOpen(WalkthroughStep.INITIAL_DIALOG, true);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <div style={{ position: "relative", display: "inline-block", height: "32px", width: "32px" }}>
                    {!isStepOpen(WalkthroughStep.INITIAL_DIALOG) && (
                      <div style={{ position: "absolute", inset: "0", height: "32px", width: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "0", pointerEvents: "none" }}>
                          <Info style={{ height: "16px", width: "16px", color: "hsl(217 91% 60%)", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            inset: "0",
                            borderRadius: "9999px",
                            border: "2px solid hsl(217 91% 60% / 0.3)",
                            animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                            transform: "scale(1.2) translateY(2px)",
                          }}
                        />
                        <div
                          style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10", pointerEvents: "none" }}
                        >
                          <div
                            style={{
                              borderRadius: "9999px",
                              backgroundColor: "hsl(217 91% 60%)",
                              width: "4px",
                              height: "4px",
                              animation: "breathe 6s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      style={{ height: "32px", width: "32px", backgroundColor: "transparent", position: "relative", zIndex: "10", borderRadius: "3px" }}
                      onClick={() => setInitialDialogOpen(true)}
                    >
                      <Info style={{ height: "16px", width: "16px", color: "hsl(217 91% 60%)" }} />
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent style={{ maxWidth: "56rem", outline: "none", fontSize: "1rem" }}>
                  <DialogHeader>
                    <DialogTitle>Welcome to Gazzola.dev</DialogTitle>
                  </DialogHeader>
                  <div style={{ marginTop: "calc(var(--theme-spacing) * 0.75)" }}>
                    Design and download your full-stack web app roadmap
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 6)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(var(--theme-spacing) * 2)", position: "relative", margin: "calc(var(--theme-spacing) * 6) 0" }}>
                      {nextSteps.map((step, index) => (
                        <div key={index} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: "10", backgroundColor: "var(--theme-background)", padding: "0 calc(var(--theme-spacing) * 2)" }}>
                            <svg
                              style={{ width: "40px", height: "40px" }}
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
                                style={{ width: "40px", height: "40px", strokeWidth: "1" }}
                                stroke={`url(#gradient-next-toolbar-${index})`}
                                fill="none"
                              />
                            </svg>
                            <span style={{ fontSize: "1rem", fontWeight: "600", marginTop: "calc(var(--theme-spacing) * 0.25)", textAlign: "center", whiteSpace: "nowrap" }}>
                              {step.title}
                            </span>
                          </div>
                          {index < nextSteps.length - 1 && (
                            <ArrowRight
                              style={{
                                width: "20px",
                                height: "20px",
                                margin: "0 calc(var(--theme-spacing) * 0.25)",
                                flexShrink: "0",
                                filter: "drop-shadow(0 0 4px rgba(147, 51, 234, 0.5))",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "calc(var(--theme-spacing) * 4)" }}>
                    Do you want to enable the tutorial?
                  </div>
                  <DialogFooter>
                    <GlobalButton
                      variant="ghost"
                      style={{ fontSize: "1rem" }}
                      onClick={() => {
                        dismissWalkthrough();
                        setInitialDialogOpen(false);
                      }}
                    >
                      No thanks, I&apos;ll explore on my own
                    </GlobalButton>
                    <GlobalButton
                      style={{ fontSize: "1rem" }}
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
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              initialDialogShown && (
                <Popover
                  open={permanentHelperOpen}
                  onOpenChange={setPermanentHelperOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      style={{ borderRadius: "3px", height: "32px", width: "32px" }}
                    >
                      <Info style={{ height: "16px", width: "16px" }} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent style={{ width: "20rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 3)" }}>
                      <h4 style={{ fontWeight: "600" }}>Walkthrough Help</h4>
                      <p style={{ fontSize: "0.875rem" }}>
                        Need help getting started? Click the button below to
                        restart the walkthrough guide.
                      </p>
                      <Button
                        variant="outline"
                        style={{ width: "100%" }}
                        onClick={() => {
                          resetWalkthrough();
                          setPermanentHelperOpen(false);
                        }}
                      >
                        Restart Walkthrough
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 3)" }}>
            <EditorDialog
              open={resetPageDialogOpen}
              onOpenChange={setResetPageDialogOpen}
            >
              <EditorDialogTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setResetPageDialogOpen(true)}
                    tooltip="Reset current page"
                  >
                    <RotateCcw style={{ height: "16px", width: "16px" }} />
                  </IconButton>
                </div>
              </EditorDialogTrigger>
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
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleResetPage}>
                    Reset Page
                  </Button>
                </EditorDialogFooter>
              </EditorDialogContent>
            </EditorDialog>

            <IconButton
              onClick={() => setResetAllDialogOpen(true)}
              tooltip="Reset all pages"
            >
              <ListRestart style={{ height: "16px", width: "16px" }} />
            </IconButton>

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
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetAll}
                    disabled={resetAllLoading}
                  >
                    {resetAllLoading ? "Resetting..." : "Reset All"}
                  </Button>
                </EditorDialogFooter>
              </EditorDialogContent>
            </EditorDialog>

            {isDevelopment && (
              <EditorPopover
                open={sectionsPopoverOpen}
                onOpenChange={setSectionsPopoverOpen}
              >
                <EditorPopoverTrigger asChild>
                  <div>
                    <IconButton
                      onClick={() => setSectionsPopoverOpen(true)}
                      tooltip="Manage sections"
                    >
                      <Settings style={{ height: "16px", width: "16px" }} />
                    </IconButton>
                  </div>
                </EditorPopoverTrigger>
                <EditorPopoverContent
                  style={{ width: "20rem", maxHeight: "24rem", overflowY: "auto" }}
                  align="center"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                    <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>Section Options</div>
                    {sectionsData.length === 0 ? (
                      <div style={{ fontSize: "0.875rem", color: "hsl(0 0% 45%)" }}>
                        No sections found
                      </div>
                    ) : (
                      sectionsData.map((file) => (
                        <div key={file.filePath} style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 3)" }}>
                          <div style={{ fontWeight: "500", fontSize: "0.875rem", borderBottom: "1px solid var(--theme-border)", paddingBottom: "calc(var(--theme-spacing) * 0.25)" }}>
                            {file.fileName}
                          </div>
                          {file.sections.map((section) => (
                            <div
                              key={section.sectionId}
                              style={{ marginLeft: "calc(var(--theme-spacing) * 2)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 2)" }}
                            >
                              <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--theme-muted-foreground)" }}>
                                {section.sectionId}
                              </div>
                              {section.options.map((option) => (
                                <div
                                  key={option.optionId}
                                  style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 2)", marginLeft: "calc(var(--theme-spacing) * 4)" }}
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
                                    style={{ fontSize: "0.875rem", cursor: "pointer" }}
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
                  <div>
                    <IconButton
                      onClick={() => setFileTreePopoverOpen(true)}
                      tooltip="Manage file inclusion"
                    >
                      <Files style={{ height: "16px", width: "16px" }} />
                    </IconButton>
                  </div>
                </EditorPopoverTrigger>
                <EditorPopoverContent
                  style={{ width: "20rem", maxHeight: "24rem", overflowY: "auto" }}
                  align="center"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 3)" }}>
                    <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>File Inclusion</div>
                    {fileTreeData.length === 0 ? (
                      <div style={{ fontSize: "0.875rem", color: "hsl(0 0% 45%)" }}>
                        No files found
                      </div>
                    ) : (
                      fileTreeData.map((item) => (
                        <div
                          key={item.path}
                          style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 2)", marginLeft: `${item.level * 12}px` }}
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
                            <Folder style={{ height: "16px", width: "16px", color: "hsl(217 91% 60%)" }} />
                          ) : (
                            <File style={{ height: "16px", width: "16px", color: "hsl(0 0% 45%)" }} />
                          )}
                          <Label
                            style={{ fontSize: "0.875rem", cursor: "pointer", flex: "1" }}
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

          <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 2)" }}>
            {previewMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div style={{ padding: "calc(var(--theme-spacing) * 1) calc(var(--theme-spacing) * 3)", fontSize: "0.75rem", fontWeight: "bold", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)", backgroundColor: "hsl(25 95% 53% / 0.2)", border: "1px solid hsl(25 95% 53%)", color: "hsl(25 95% 20%)" }}>
                    <Eye style={{ height: "12px", width: "12px" }} />
                    Preview mode (read only)
                  </div>
                </TooltipTrigger>
                <TooltipContent style={{ maxWidth: "20rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 2)" }}>
                    <p>You are currently in preview mode.</p>
                    <p>
                      This shows exactly how your content will look when
                      downloaded.
                    </p>
                    <p>Switch back to Edit mode to continue making changes.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--theme-muted-foreground)" }}>
                    Edit
                  </span>
                  <Switch
                    checked={previewMode}
                    onCheckedChange={(checked) => {
                      setPreviewMode(checked);
                      if (showPreviewHelp) {
                        markStepComplete(WalkthroughStep.PREVIEW_MODE);
                      }
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--theme-muted-foreground)" }}>
                    Preview
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between edit mode and processed preview</p>
              </TooltipContent>
            </Tooltip>

            <div style={{ position: "relative" }}>
              {showNextButtonHelp && (
                <div style={{ position: "absolute", top: "-8px", right: "-8px", zIndex: "10" }}>
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
                    style={{
                      borderRadius: "3px",
                      padding: "calc(var(--theme-spacing) * 0.25) calc(var(--theme-spacing) * 3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "calc(var(--theme-spacing) * 2)",
                      fontWeight: "500",
                    }}
                  >
                    Next
                    <ChevronRight style={{ height: "16px", width: "16px" }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
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
