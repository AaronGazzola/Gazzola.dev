"use client";

import { AppStructure } from "@/app/(components)/AppStructure";
import { useWalkthroughStore } from "@/app/layout.stores";
import { conditionalLog } from "@/lib/log.util";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { walkthroughSteps } from "@/public/data/walkthrough/steps";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  File,
  Files,
  Folder,
  FolderOpen,
  HelpCircle,
  ListRestart,
  Moon,
  RotateCcw,
  Settings,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useContentVersionCheck } from "../layout.hooks";
import { parseAndGetMarkdownDataAction } from "../layout.actions";
import { useEditorStore } from "../layout.stores";

interface ToolbarProps {
  currentContentPath: string;
}

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
  darkMode: boolean;
}

const IconButton = ({
  onClick,
  disabled = false,
  children,
  tooltip,
  darkMode,
}: IconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          borderRadius: "3px",
        }}
        className={cn(
          "h-8 w-8 flex items-center justify-center transition-colors",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : darkMode
              ? "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        )}
      >
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export const Toolbar = ({ currentContentPath }: ToolbarProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    startWalkthrough,
    isActiveTarget,
    canAutoProgress,
    autoProgressWalkthrough,
  } = useWalkthroughStore();
  useContentVersionCheck();
  const {
    darkMode,
    setDarkMode,
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
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);
  const [appStructureSheetOpen, setAppStructureSheetOpen] = useState(false);

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
      if (canAutoProgress("next-button")) {
        autoProgressWalkthrough();
      }
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
    forceRefresh(); // Force editor refresh to display updated content
    setResetPageDialogOpen(false);
  };

  const handleResetAll = async () => {
    console.log(conditionalLog("Toolbar.handleResetAll: Starting", { label: "markdown-parse" }));
    setResetAllLoading(true);
    try {
      const { data: freshData, error } = await parseAndGetMarkdownDataAction();

      console.log(conditionalLog({
        hasFreshData: !!freshData,
        hasError: !!error,
        freshDataNodeCount: freshData ? Object.keys(freshData.flatIndex).length : 0,
        freshDataVersion: freshData?.contentVersion
      }, { label: "markdown-parse" }));

      if (error) {
        console.log(conditionalLog({ parseError: String(error) }, { label: "markdown-parse" }));
        alert("Failed to parse markdown files. Please check the console for details.");
        return;
      }

      if (freshData) {
        console.log(conditionalLog("Toolbar.handleResetAll: Invalidating queries", { label: "markdown-parse" }));

        queryClient.invalidateQueries({ queryKey: ["markdownData"] });
        queryClient.invalidateQueries({ queryKey: ["contentVersion"] });

        const firstPagePath = Object.values(freshData.flatIndex)
          .filter((node) => node.type === "file" && node.include !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))[0];

        const resetKey = Date.now();

        console.log(conditionalLog({
          resetKey,
          firstPageUrl: firstPagePath?.urlPath,
          message: "Setting markdown data in store"
        }, { label: "markdown-parse" }));

        setMarkdownData(freshData);
        reset();
        setRefreshKey(resetKey);

        console.log(conditionalLog("Toolbar.handleResetAll: Store updated, navigating", { label: "markdown-parse" }));

        setTimeout(() => {
          if (firstPagePath?.urlPath) {
            router.push(firstPagePath.urlPath);
          }
        }, 0);
      }
      setResetAllDialogOpen(false);
    } catch (error) {
      console.log(conditionalLog({ catchError: String(error) }, { label: "markdown-parse" }));
      alert("An unexpected error occurred during reset. Please try again.");
      setResetAllDialogOpen(false);
    } finally {
      setResetAllLoading(false);
      console.log(conditionalLog("Toolbar.handleResetAll: Complete", { label: "markdown-parse" }));
    }
  };

  const handleStartWalkthrough = () => {
    localStorage.removeItem("walkthrough-completed");
    startWalkthrough(walkthroughSteps);
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
      <div
        className={`w-full border-b ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Progress
                value={progressInfo.progressValue}
                className="h-1 w-full rounded-none"
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

        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleBack}
              disabled={!canGoBack}
              tooltip={
                canGoBack ? `Previous: ${prevPageTitle}` : "No previous page"
              }
              darkMode={darkMode}
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>

            <IconButton
              onClick={() => setAppStructureSheetOpen(true)}
              tooltip="App Structure"
              darkMode={darkMode}
            >
              <FolderOpen className="h-4 w-4" />
            </IconButton>
          </div>

          <div className="flex items-center gap-3">
            <IconButton
              onClick={handleStartWalkthrough}
              tooltip="Start walkthrough tour"
              darkMode={darkMode}
            >
              <HelpCircle className="h-4 w-4" />
            </IconButton>

            <Dialog
              open={resetPageDialogOpen}
              onOpenChange={setResetPageDialogOpen}
            >
              <DialogTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setResetPageDialogOpen(true)}
                    tooltip="Reset current page"
                    darkMode={darkMode}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </IconButton>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Current Page</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset the current file? This will
                    restore it to its original content and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    )}
                    onClick={() => setResetPageDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      darkMode
                        ? "bg-red-700 text-red-100 hover:bg-red-600"
                        : "bg-red-600 text-red-100 hover:bg-red-700"
                    )}
                    onClick={handleResetPage}
                  >
                    Reset Page
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <IconButton
              onClick={() => setResetAllDialogOpen(true)}
              tooltip="Reset all pages"
              darkMode={darkMode}
            >
              <ListRestart className="h-4 w-4" />
            </IconButton>

            <Dialog
              open={resetAllDialogOpen}
              onOpenChange={setResetAllDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset All Files</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset all files? This will restore
                    all content to its original state and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    )}
                    onClick={() => setResetAllDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      resetAllLoading
                        ? "opacity-50 cursor-not-allowed bg-gray-500"
                        : darkMode
                          ? "bg-red-700 text-red-100 hover:bg-red-600"
                          : "bg-red-600 text-red-100 hover:bg-red-700"
                    )}
                    onClick={handleResetAll}
                    disabled={resetAllLoading}
                  >
                    {resetAllLoading ? "Resetting..." : "Reset All"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Popover
              open={sectionsPopoverOpen}
              onOpenChange={setSectionsPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setSectionsPopoverOpen(true)}
                    tooltip="Manage sections"
                    darkMode={darkMode}
                  >
                    <Settings className="h-4 w-4" />
                  </IconButton>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "w-80 max-h-96 overflow-y-auto",
                  darkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-200"
                )}
                align="center"
              >
                <div className="space-y-4">
                  <div className="font-semibold text-sm">Section Options</div>
                  {sectionsData.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No sections found
                    </div>
                  ) : (
                    sectionsData.map((file) => (
                      <div key={file.filePath} className="space-y-3">
                        <div className="font-medium text-sm border-b pb-1">
                          {file.fileName}
                        </div>
                        {file.sections.map((section) => (
                          <div
                            key={section.sectionId}
                            className="ml-2 space-y-2"
                          >
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {section.sectionId}
                            </div>
                            {section.options.map((option) => (
                              <div
                                key={option.optionId}
                                className="flex items-center space-x-2 ml-4"
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
                                <label
                                  className="text-sm cursor-pointer"
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
                                </label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={fileTreePopoverOpen}
              onOpenChange={setFileTreePopoverOpen}
            >
              <PopoverTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setFileTreePopoverOpen(true)}
                    tooltip="Manage file inclusion"
                    darkMode={darkMode}
                  >
                    <Files className="h-4 w-4" />
                  </IconButton>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "w-80 max-h-96 overflow-y-auto",
                  darkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-200"
                )}
                align="center"
              >
                <div className="space-y-3">
                  <div className="font-semibold text-sm">File Inclusion</div>
                  {fileTreeData.length === 0 ? (
                    <div className="text-sm text-gray-500">No files found</div>
                  ) : (
                    fileTreeData.map((item) => (
                      <div
                        key={item.path}
                        className="flex items-center space-x-2"
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
                          <Folder className="h-4 w-4 text-blue-500" />
                        ) : (
                          <File className="h-4 w-4 text-gray-500" />
                        )}
                        <label
                          className="text-sm cursor-pointer flex-1"
                          onClick={() =>
                            updateInclusionRules({ [item.path]: !item.include })
                          }
                        >
                          {item.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            {previewMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5",
                      darkMode
                        ? "bg-orange-900 text-white"
                        : "bg-orange-100 border border-orange-500 text-orange-900"
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    Preview mode (read only)
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
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

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    Edit
                  </span>
                  <Switch
                    checked={previewMode}
                    onCheckedChange={setPreviewMode}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      darkMode ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    Preview
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between edit mode and processed preview</p>
              </TooltipContent>
            </Tooltip>

            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              tooltip={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              darkMode={darkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </IconButton>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  style={{
                    borderRadius: "3px",
                  }}
                  className={cn(
                    "px-3 py-1 flex items-center gap-2 font-medium transition-colors border",
                    !canGoNext
                      ? "opacity-50 cursor-not-allowed border-gray-300"
                      : isActiveTarget("next-button")
                        ? darkMode
                          ? "border-blue-400 text-blue-200 hover:border-blue-300 hover:text-blue-100 ring-2 ring-blue-400/50"
                          : "border-blue-500 text-blue-700 hover:border-blue-600 hover:text-blue-800 ring-2 ring-blue-500/50"
                        : darkMode
                          ? "border-gray-400 text-gray-200 hover:border-white hover:text-white"
                          : "border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
                  )}
                  data-walkthrough="next-button"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{canGoNext ? `Next: ${nextPageTitle}` : "No next page"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <Sheet
        open={appStructureSheetOpen}
        onOpenChange={setAppStructureSheetOpen}
      >
        <SheetContent
          side="left"
          className="w-[640px] !max-w-[95%]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>App Structure</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto w-full">
            <AppStructure />
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};
