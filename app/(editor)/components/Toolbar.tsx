"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import configuration from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import {
  ChevronLeft,
  ChevronRight,
  ListRestart,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  const {
    darkMode,
    setDarkMode,
    reset,
    setContent,
    forceRefresh,
    markPageVisited,
    isPageVisited,
    data,
  } = useEditorStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);

  const allPages = useMemo(() => {
    const pages: { path: string; url: string; title: string; order: number }[] = [];

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

  const currentPageIndex = useMemo(() => {
    return allPages.findIndex((page) => page.path === currentContentPath);
  }, [allPages, currentContentPath]);

  const nextPage = currentPageIndex < allPages.length - 1
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
      const originalContent = node.content.replace(/\\n/g, '\n').replace(/\\`/g, '`').replace(/\\\$/g, '$').replace(/\\\\/g, '\\');
      setContent(currentContentPath, originalContent);
    }
    forceRefresh(); // Force editor refresh to display updated content
    setResetPageDialogOpen(false);
  };

  const handleResetAll = () => {
    reset();
    setResetAllDialogOpen(false);
    router.push(configuration.paths.home);
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

            <Dialog
              open={resetAllDialogOpen}
              onOpenChange={setResetAllDialogOpen}
            >
              <DialogTrigger asChild>
                <div>
                  <IconButton
                    onClick={() => setResetAllDialogOpen(true)}
                    tooltip="Reset all pages"
                    darkMode={darkMode}
                  >
                    <ListRestart className="h-4 w-4" />
                  </IconButton>
                </div>
              </DialogTrigger>
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
                      darkMode
                        ? "bg-red-700 text-red-100 hover:bg-red-600"
                        : "bg-red-600 text-red-100 hover:bg-red-700"
                    )}
                    onClick={handleResetAll}
                  >
                    Reset All
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
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
                      : darkMode
                        ? "border-gray-400 text-gray-200 hover:border-white hover:text-white"
                        : "border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
                  )}
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
    </TooltipProvider>
  );
};
