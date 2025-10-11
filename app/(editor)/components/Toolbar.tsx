"use client";

import { conditionalLog } from "@/lib/log.util";
import { Checkbox } from "@/components/editor/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/editor/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Progress } from "@/components/editor/ui/progress";
import { Switch } from "@/components/editor/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { Button } from "@/components/editor/ui/button";
import { Label } from "@/components/editor/ui/label";
import { cn } from "@/lib/tailwind.utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  File,
  Files,
  Folder,
  ListRestart,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useContentVersionCheck } from "../layout.hooks";
import { parseAndGetMarkdownDataAction } from "../layout.actions";
import { useEditorStore } from "../layout.stores";

const isDevelopment = process.env.NODE_ENV === "development";

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
        }}
        className="h-8 w-8"
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
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);
  const [resetAllLoading, setResetAllLoading] = useState(false);
  const [sectionsPopoverOpen, setSectionsPopoverOpen] = useState(false);
  const [fileTreePopoverOpen, setFileTreePopoverOpen] = useState(false);

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
    forceRefresh(); // Force editor refresh to display updated content
    setResetPageDialogOpen(false);
  };

  const handleResetAll = async () => {
    conditionalLog("Toolbar.handleResetAll: Starting", { label: "markdown-parse" });
    setResetAllLoading(true);
    try {
      const { data: freshData, error } = await parseAndGetMarkdownDataAction();

      conditionalLog({
        hasFreshData: !!freshData,
        hasError: !!error,
        freshDataNodeCount: freshData ? Object.keys(freshData.flatIndex).length : 0,
        freshDataVersion: freshData?.contentVersion
      }, { label: "markdown-parse" });

      if (error) {
        conditionalLog({ parseError: String(error) }, { label: "markdown-parse" });
        alert("Failed to parse markdown files. Please check the console for details.");
        return;
      }

      if (freshData) {
        conditionalLog("Toolbar.handleResetAll: Invalidating queries", { label: "markdown-parse" });

        queryClient.invalidateQueries({ queryKey: ["markdownData"] });
        queryClient.invalidateQueries({ queryKey: ["contentVersion"] });

        const firstPagePath = Object.values(freshData.flatIndex)
          .filter((node) => node.type === "file" && node.include !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))[0];

        const resetKey = Date.now();

        conditionalLog({
          resetKey,
          firstPageUrl: firstPagePath?.urlPath,
          message: "Setting markdown data in store"
        }, { label: "markdown-parse" });

        setMarkdownData(freshData);
        reset();
        setRefreshKey(resetKey);

        conditionalLog("Toolbar.handleResetAll: Store updated, waiting for state to settle", { label: "markdown-parse" });

        await new Promise(resolve => setTimeout(resolve, 100));

        conditionalLog("Toolbar.handleResetAll: State settled, navigating", { label: "markdown-parse" });

        if (firstPagePath?.urlPath) {
          router.push(firstPagePath.urlPath);
        }
      }
      setResetAllDialogOpen(false);
    } catch (error) {
      conditionalLog({ catchError: String(error) }, { label: "markdown-parse" });
      alert("An unexpected error occurred during reset. Please try again.");
      setResetAllDialogOpen(false);
    } finally {
      setResetAllLoading(false);
      conditionalLog("Toolbar.handleResetAll: Complete", { label: "markdown-parse" });
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
      <div className="w-full border-b bg-[hsl(var(--background))] border-[hsl(var(--border))]">
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
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
          </div>

          <div className="flex items-center gap-3">
            <Dialog
              open={resetPageDialogOpen}
              onOpenChange={setResetPageDialogOpen}
            >
              <DialogTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setResetPageDialogOpen(true)}
                    tooltip="Reset current page"
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
                  <Button
                    variant="outline"
                    onClick={() => setResetPageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetPage}
                  >
                    Reset Page
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <IconButton
              onClick={() => setResetAllDialogOpen(true)}
              tooltip="Reset all pages"
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
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isDevelopment && (
              <Popover
                open={sectionsPopoverOpen}
                onOpenChange={setSectionsPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <div>
                    <IconButton
                      onClick={() => setSectionsPopoverOpen(true)}
                      tooltip="Manage sections"
                    >
                      <Settings className="h-4 w-4" />
                    </IconButton>
                  </div>
                </PopoverTrigger>
              <PopoverContent
                className="w-80 max-h-96 overflow-y-auto"
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
                                <Label
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
                                </Label>
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
            )}

            {isDevelopment && (
              <Popover
                open={fileTreePopoverOpen}
                onOpenChange={setFileTreePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <div>
                    <IconButton
                      onClick={() => setFileTreePopoverOpen(true)}
                      tooltip="Manage file inclusion"
                    >
                      <Files className="h-4 w-4" />
                    </IconButton>
                  </div>
                </PopoverTrigger>
              <PopoverContent
                className="w-80 max-h-96 overflow-y-auto"
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
                        <Label
                          className="text-sm cursor-pointer flex-1"
                          onClick={() =>
                            updateInclusionRules({ [item.path]: !item.include })
                          }
                        >
                          {item.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            )}
          </div>

          <div className="flex items-center gap-2">
            {previewMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 bg-orange-500/20 border border-orange-500 text-orange-900 dark:text-orange-100">
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
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    Edit
                  </span>
                  <Switch
                    checked={previewMode}
                    onCheckedChange={setPreviewMode}
                  />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    Preview
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between edit mode and processed preview</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  variant="outline"
                  style={{
                    borderRadius: "3px",
                  }}
                  className="px-3 py-1 flex items-center gap-2 font-medium"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{canGoNext ? `Next: ${nextPageTitle}` : "No next page"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
