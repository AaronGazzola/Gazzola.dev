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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { ChevronLeft, ChevronRight, ListRestart, Moon, RotateCcw, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ContentPath, markdownContent, navigationData } from "../layout.data";
import { useEditorStore } from "../layout.stores";

interface ToolbarProps {
  currentContentPath: ContentPath;
}

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
  darkMode: boolean;
}

const IconButton = ({ onClick, disabled = false, children, tooltip, darkMode }: IconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center transition-colors",
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
  const { darkMode, setDarkMode, reset, setContent, forceRefresh } = useEditorStore();
  const [resetPageDialogOpen, setResetPageDialogOpen] = useState(false);
  const [resetAllDialogOpen, setResetAllDialogOpen] = useState(false);

  const allPages = useMemo(() => {
    const pages: { path: ContentPath; url: string; title: string }[] = [];

    const flattenNavigation = (items: typeof navigationData) => {
      items.forEach((item) => {
        if (item.type === "page") {
          pages.push({
            path: item.name as ContentPath,
            url: `/${item.name}`,
            title: item.name.charAt(0).toUpperCase() + item.name.slice(1)
          });
        } else if (item.type === "segment" && item.children) {
          item.children.forEach((child) => {
            if (child.type === "page") {
              const childNameLower = child.name.toLowerCase();
              const pathSuffix = childNameLower === "next.js" ? "nextjs" : childNameLower;
              const path = `${item.name}.${pathSuffix}` as ContentPath;
              const url = `/${item.name}/${childNameLower}`;
              pages.push({
                path,
                url,
                title: child.name
              });
            }
          });
        }
      });
    };

    flattenNavigation(navigationData);
    return pages;
  }, []);

  const currentPageIndex = useMemo(() => {
    return allPages.findIndex((page) => page.path === currentContentPath);
  }, [allPages, currentContentPath]);

  const canGoBack = currentPageIndex > 0;
  const canGoNext = currentPageIndex < allPages.length - 1;
  
  const prevPageTitle = canGoBack ? allPages[currentPageIndex - 1]?.title : '';
  const nextPageTitle = canGoNext ? allPages[currentPageIndex + 1]?.title : '';

  const handleBack = () => {
    if (canGoBack) {
      const prevPage = allPages[currentPageIndex - 1];
      router.push(prevPage.url);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      const nextPage = allPages[currentPageIndex + 1];
      router.push(nextPage.url);
    }
  };

  const handleResetPage = () => {
    const pathParts = currentContentPath.split(".");
    if (pathParts.length === 1) {
      const originalContent = (markdownContent as any)[pathParts[0]];
      setContent(currentContentPath, originalContent || "");
    } else if (pathParts.length === 2) {
      const originalContent = (markdownContent as any)[pathParts[0]]?.[
        pathParts[1]
      ];
      setContent(currentContentPath, originalContent || "");
    }
    forceRefresh(); // Force editor refresh to display updated content
    setResetPageDialogOpen(false);
  };

  const handleResetAll = () => {
    reset(); // This already includes forceRefresh via refreshKey increment
    setResetAllDialogOpen(false);
  };

  const progressInfo = useMemo(() => {
    const currentStep = currentPageIndex + 1;
    const totalSteps = allPages.length;
    const progressValue = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
    
    return {
      currentStep,
      totalSteps,
      progressValue,
      currentTitle: allPages[currentPageIndex]?.title || 'Unknown'
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
              <Progress value={progressInfo.progressValue} className="h-1 w-full rounded-none" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{progressInfo.currentTitle} ({progressInfo.currentStep} of {progressInfo.totalSteps})</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleBack}
              disabled={!canGoBack}
              tooltip={canGoBack ? `Previous: ${prevPageTitle}` : "No previous page"}
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
              tooltip={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              darkMode={darkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={!canGoNext}
              tooltip={canGoNext ? `Next: ${nextPageTitle}` : "No next page"}
              darkMode={darkMode}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
