"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import {
  Feature,
  FileSystemEntry,
  UserExperienceFileType,
} from "@/app/(editor)/layout.types";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Ellipsis,
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScreenSize } from "./AppStructure.hooks";
import { InlineFeatureCard } from "./FeatureCard";
import { PAGE_FILE_ICON, LAYOUT_COLORS } from "./AppStructure.types";
import { generateId, getFileExtension, getBaseFileName } from "./AppStructure.utils";

export const TreeNode = ({
  node,
  depth = 0,
  isLast = false,
  parentPath = "",
  onUpdate,
  onDelete,
  onAddFile,
  onAddDirectory,
  appStructure,
  ancestorIsLast = [],
  onAddSpecificFile,
  newNodeId,
  qualifyingFilePaths = [],
  expandedFileId,
  setExpandedFileId,
}: {
  node: FileSystemEntry;
  depth?: number;
  isLast?: boolean;
  parentPath?: string;
  onUpdate: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDelete: (id: string) => void;
  onAddFile: (parentId: string) => void;
  onAddDirectory: (parentId: string) => void;
  appStructure: FileSystemEntry[];
  ancestorIsLast?: boolean[];
  onAddSpecificFile?: (parentId: string, fileName: string) => void;
  newNodeId?: string | null;
  qualifyingFilePaths?: string[];
  expandedFileId?: string | null;
  setExpandedFileId?: (id: string | null) => void;
}) => {
  const {
    wireframeState,
    setWireframeCurrentPage,
    addAppStructureNodeAfterSibling,
    setSelectedFile,
    addUtilityFile,
    getUtilityFiles,
    featureFileSelection,
    linkFeatureFile,
    clearFeatureFileSelection,
    selectedFilePath,
    getFeatures,
    addFeature,
    updateFeature,
    removeFeature,
    linkFeatureFile: linkFeatureFileStore,
    unlinkFeatureFile,
    setFeatureFileSelection,
  } = useEditorStore();
  const screenSize = useScreenSize();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [directoryPopoverOpen, setDirectoryPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const isPageFile = node.type === "file" && node.name === "page.tsx";
  const isLayoutFile = node.type === "file" && node.name === "layout.tsx";
  const isClickableFile = isPageFile || isLayoutFile;
  const isExpanded = expandedFileId === node.id;

  const currentFilePath = parentPath ? `${parentPath}/${node.name}` : node.name;
  const isQualified = qualifyingFilePaths.includes(currentFilePath);
  const isInSelectionMode = featureFileSelection.fileType !== null;

  const features = isClickableFile && node.id ? getFeatures(node.id) : [];

  const checkLinkedFeatureInfo = (): { showBorder: boolean; isLinked: boolean } => {
    if (isClickableFile) return { showBorder: false, isLinked: false };
    if (!isInSelectionMode) return { showBorder: false, isLinked: false };

    const getAllFeaturesWithFileId = (entries: FileSystemEntry[]): Array<{ feature: Feature; fileId: string }> => {
      let allFeatures: Array<{ feature: Feature; fileId: string }> = [];
      for (const entry of entries) {
        if ((entry.name === "page.tsx" || entry.name === "layout.tsx") && entry.id) {
          const features = getFeatures(entry.id);
          allFeatures = [...allFeatures, ...features.map(f => ({ feature: f, fileId: entry.id }))];
        }
        if (entry.children) {
          allFeatures = [...allFeatures, ...getAllFeaturesWithFileId(entry.children)];
        }
      }
      return allFeatures;
    };

    const allFeatures = getAllFeaturesWithFileId(appStructure);
    for (const { feature, fileId } of allFeatures) {
      if (!featureFileSelection.fileType) continue;

      const linkedFile = feature.linkedFiles?.[featureFileSelection.fileType];
      if (linkedFile === currentFilePath &&
          featureFileSelection.fileId === fileId &&
          featureFileSelection.featureId === feature.id) {
        return { showBorder: true, isLinked: true };
      }
    }
    return { showBorder: false, isLinked: false };
  };

  const linkedFeatureInfo = checkLinkedFeatureInfo();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameClick = (e: React.MouseEvent) => {
    if (node.type === "directory") {
      e.stopPropagation();
      setIsEditing(true);
    } else if (isClickableFile) {
      if (isQualified && isInSelectionMode) {
        handleFileClick();
        return;
      }
      if (setExpandedFileId) {
        if (isExpanded) {
          clearFeatureFileSelection();
          setExpandedFileId(null);
        } else {
          setExpandedFileId(node.id);
        }
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    if (isQualified && isInSelectionMode) {
      e.stopPropagation();
      handleFileClick();
      return;
    }
    if (isClickableFile && setExpandedFileId) {
      e.stopPropagation();
      if (isExpanded) {
        clearFeatureFileSelection();
        setExpandedFileId(null);
      } else {
        setExpandedFileId(node.id);
      }
    }
  };

  const isUtilityFile = node.type === "file" && (
    node.name.endsWith(".stores.ts") ||
    node.name.endsWith(".hooks.tsx") ||
    node.name.endsWith(".actions.ts") ||
    node.name.endsWith(".types.ts")
  );

  const getFileIconColor = (): string => {
    if (isPageFile) {
      return PAGE_FILE_ICON;
    }
    if (isLayoutFile) {
      const fullPath = parentPath + "/" + node.name;
      const normalizedPath = fullPath.startsWith("/")
        ? fullPath.substring(1)
        : fullPath;

      let directoryPath = normalizedPath
        .replace("/layout.tsx", "")
        .replace(/^app/, "");
      const directoryPathWithGroups = directoryPath || "/";
      directoryPath = directoryPath.replace(/\/\([^)]+\)/g, "");
      if (!directoryPath.startsWith("/")) {
        directoryPath = "/" + directoryPath;
      }
      if (directoryPath === "//" || directoryPath === "") {
        directoryPath = "/";
      }

      const findFirstDescendantPage = (
        entries: FileSystemEntry[],
        currentPath: string = "",
        searchPath: string = "",
        insideApp: boolean = false
      ): string | null => {
        for (const entry of entries) {
          if (entry.name === "app" && !insideApp) {
            const result = findFirstDescendantPage(
              entry.children || [],
              "",
              searchPath,
              true
            );
            if (result) return result;
            continue;
          }

          if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
            const groupPath = currentPath
              ? `${currentPath}/${entry.name}`
              : `/${entry.name}`;

            if (searchPath === groupPath) {
              const hasPage = (entry.children || []).some(
                (child) => child.type === "file" && child.name === "page.tsx"
              );
              if (hasPage) return currentPath || "/";

              const result = findFirstDescendantPage(
                entry.children || [],
                currentPath,
                "/",
                true
              );
              if (result) return result;
            }

            if (searchPath === "/" || searchPath.startsWith(groupPath + "/")) {
              const strippedSearchPath = searchPath.replace(
                groupPath,
                currentPath || ""
              );
              const result = findFirstDescendantPage(
                entry.children || [],
                currentPath,
                strippedSearchPath,
                true
              );
              if (result) return result;
            }
            continue;
          }

          if (entry.type === "directory" && entry.children) {
            const newPath = currentPath
              ? `${currentPath}/${entry.name}`
              : `/${entry.name}`;

            const hasPage = entry.children.some(
              (child) => child.type === "file" && child.name === "page.tsx"
            );
            if (
              hasPage &&
              (searchPath === "/" ||
                searchPath === newPath ||
                newPath.startsWith(searchPath + "/"))
            ) {
              return newPath;
            }

            if (
              searchPath === "/" ||
              searchPath === newPath ||
              searchPath.startsWith(newPath + "/") ||
              newPath.startsWith(searchPath + "/")
            ) {
              const result = findFirstDescendantPage(
                entry.children,
                newPath,
                searchPath,
                true
              );
              if (result) return result;
            }
          }
        }
        return null;
      };

      const descendantPagePath = findFirstDescendantPage(
        appStructure,
        "",
        directoryPathWithGroups,
        false
      );

      if (descendantPagePath) {
        const layouts = findLayoutsForPagePath(
          appStructure,
          descendantPagePath,
          "",
          true
        );
        const layoutIndex = layouts.findIndex((l) => {
          const expectedFile =
            l === "/" ? "app/layout.tsx" : `app${l}/layout.tsx`;
          return normalizedPath === expectedFile;
        });

        if (layoutIndex !== -1) {
          return LAYOUT_COLORS[0].icon;
        }
      }
    }
    if (isUtilityFile) {
      return "theme-text-chart-2";
    }
    return "";
  };

  const getFileBorderColor = (): string => {
    const iconColor = getFileIconColor();
    if (!iconColor) return "theme-border-foreground";
    return iconColor.replace("theme-text-", "theme-border-");
  };

  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const spacingMap = { xs: 2, sm: 3, md: 4, lg: 5 };
    const spacing = spacingMap[screenSize];
    const spaces = " ".repeat(spacing);
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push(ancestorIsLast[i + 1] ? spaces : `│${spaces.slice(1)}`);
    }
    return lines.join("");
  };

  const getPagePath = () => {
    const fullPath = parentPath + "/" + node.name;
    let normalizedPath = fullPath.startsWith("/")
      ? fullPath.substring(1)
      : fullPath;
    normalizedPath = normalizedPath.replace("/page.tsx", "");
    normalizedPath = normalizedPath.replace(/^app\/?/, "");
    normalizedPath = normalizedPath.replace(/\(([^)]+)\)/g, "");
    normalizedPath = normalizedPath.replace(/\/+/g, "/");
    normalizedPath = normalizedPath.replace(/\/$/, "");
    let pagePath = normalizedPath;
    if (!pagePath.startsWith("/") && pagePath !== "") {
      pagePath = "/" + pagePath;
    }
    if (pagePath === "" || pagePath === "//") {
      pagePath = "/";
    }
    return pagePath;
  };

  const pagePath = isPageFile ? getPagePath() : "";
  const isCurrentPage =
    isPageFile &&
    wireframeState.availablePages[wireframeState.currentPageIndex] === pagePath;

  const handlePageFileClick = () => {
    if (!isPageFile) return;
    const pageIndex = wireframeState.availablePages.indexOf(pagePath);
    if (pageIndex !== -1) {
      setWireframeCurrentPage(pageIndex);
    }
  };

  const handleFileClick = () => {
    if (
      isInSelectionMode &&
      isQualified &&
      featureFileSelection.fileId &&
      featureFileSelection.featureId &&
      featureFileSelection.fileType
    ) {
      linkFeatureFile(
        featureFileSelection.fileId,
        featureFileSelection.featureId,
        featureFileSelection.fileType,
        currentFilePath
      );
      clearFeatureFileSelection();
      return;
    }

    if (!isClickableFile) return;
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    setSelectedFile(fullPath, node.id);
  };

  const handleAddUtilityFile = (fileType: UserExperienceFileType) => {
    if (!isClickableFile) return;

    const baseFileName = getBaseFileName(node.name);
    const extension = getFileExtension(fileType, isPageFile);
    const newFileName = `${baseFileName}${extension}`;

    const newFile: FileSystemEntry = {
      id: generateId(),
      name: newFileName,
      type: "file",
    };

    addAppStructureNodeAfterSibling(node.id, newFile);
    addUtilityFile(node.id, node.name, fileType);
    setPopoverOpen(false);
  };

  const utilityFiles = getUtilityFiles(node.id);
  const availableOptions: UserExperienceFileType[] = [
    "stores",
    "hooks",
    "actions",
    "types",
  ];
  const remainingOptions = availableOptions.filter(
    (opt) => !utilityFiles.includes(opt)
  );

  const hasPageFile = node.children?.some((child) => child.name === "page.tsx");
  const hasLayoutFile = node.children?.some((child) => child.name === "layout.tsx");

  const pageRelatedFiles = {
    "page.stores.ts": node.children?.some((child) => child.name === "page.stores.ts"),
    "page.hooks.tsx": node.children?.some((child) => child.name === "page.hooks.tsx"),
    "page.actions.ts": node.children?.some((child) => child.name === "page.actions.ts"),
    "page.types.ts": node.children?.some((child) => child.name === "page.types.ts"),
  };

  const layoutRelatedFiles = {
    "layout.stores.ts": node.children?.some((child) => child.name === "layout.stores.ts"),
    "layout.hooks.tsx": node.children?.some((child) => child.name === "layout.hooks.tsx"),
    "layout.actions.ts": node.children?.some((child) => child.name === "layout.actions.ts"),
    "layout.types.ts": node.children?.some((child) => child.name === "layout.types.ts"),
  };

  const handleFileToggle = (fileName: string, isChecked: boolean) => {
    if (isChecked) {
      if (onAddSpecificFile) {
        onAddSpecificFile(node.id, fileName);
      }
    } else {
      const childToDelete = node.children?.find((child) => child.name === fileName);
      if (childToDelete) {
        onDelete(childToDelete.id);
      }
    }
  };

  const handleRootFileToggle = (rootFileName: string, relatedFiles: Record<string, boolean | undefined>) => {
    const hasRootFile = node.children?.some((child) => child.name === rootFileName);

    if (hasRootFile) {
      const childToDelete = node.children?.find((child) => child.name === rootFileName);
      if (childToDelete) {
        onDelete(childToDelete.id);
      }

      Object.keys(relatedFiles).forEach((fileName) => {
        if (relatedFiles[fileName]) {
          const relatedChild = node.children?.find((child) => child.name === fileName);
          if (relatedChild) {
            onDelete(relatedChild.id);
          }
        }
      });
    } else {
      if (onAddSpecificFile) {
        onAddSpecificFile(node.id, rootFileName);
      }
    }
  };

  return (
    <div
      className={cn(
        isClickableFile &&
          isExpanded &&
          `border ${getFileBorderColor()} theme-radius theme-p-1`
      )}
    >
      <div
        className={cn(
          "group flex items-center theme-spacing theme-radius theme-px theme-text-foreground",
          isClickableFile && "cursor-pointer hover:theme-bg-accent",
          !isClickableFile && "hover:theme-bg-accent",
          isCurrentPage && " theme-bg-muted ",
          isInSelectionMode &&
            selectedFilePath === currentFilePath &&
            !isClickableFile &&
            "border theme-border-chart-2",
          isQualified &&
            isInSelectionMode &&
            selectedFilePath !== currentFilePath &&
            "border-2 border-dashed theme-border-chart-4 theme-bg-accent/20 cursor-pointer",
          linkedFeatureInfo.showBorder && linkedFeatureInfo.isLinked && "border border-green-500"
        )}
        onClick={handleRowClick}
      >
        <span className="font-mono text-base select-none theme-text-muted-foreground">
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>

        <div className="flex items-center theme-spacing flex-1 min-w-0 theme-px theme-gap-2">
          {node.type === "directory" ? (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 theme-text-chart-1" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 theme-text-chart-1" />
            )
          ) : (
            <File
              className={cn(
                "h-4 w-4 flex-shrink-0",
                getFileIconColor() || "theme-text-chart-3",
                isPageFile && "cursor-pointer hover:opacity-70"
              )}
              onClick={(e) => {
                if (isPageFile) {
                  e.stopPropagation();
                  handlePageFileClick();
                }
              }}
            />
          )}

          {isEditing && node.type === "directory" ? (
            <Input
              ref={inputRef}
              value={node.name}
              onChange={(e) => onUpdate(node.id, { name: e.target.value })}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-6 text-sm flex-1 min-w-0"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span
                className={cn(
                  "text-sm truncate theme-text-foreground",
                  node.type === "directory" && "cursor-text",
                  isClickableFile && "cursor-pointer"
                )}
                onClick={handleNameClick}
              >
                {node.name}
              </span>
              {isClickableFile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setExpandedFileId) {
                      if (isExpanded) {
                        clearFeatureFileSelection();
                        setExpandedFileId(null);
                      } else {
                        setExpandedFileId(node.id);
                      }
                    }
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </>
          )}

          {node.type === "directory" && (
            <Popover
              open={directoryPopoverOpen}
              onOpenChange={setDirectoryPopoverOpen}
            >
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Ellipsis className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 theme-p-2 theme-shadow theme-bg-popover theme-border-border theme-font-mono theme-tracking"
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col theme-gap-1">
                  <div
                    className="flex items-center theme-gap-2 theme-py-1 cursor-pointer hover:theme-bg-accent theme-radius theme-px-1 -theme-mx-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRootFileToggle("page.tsx", pageRelatedFiles);
                    }}
                  >
                    <Checkbox
                      checked={hasPageFile}
                      onCheckedChange={() => handleRootFileToggle("page.tsx", pageRelatedFiles)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">page.tsx</span>
                  </div>

                  {Object.entries(pageRelatedFiles).map(([fileName, exists]) => (
                    <div
                      key={fileName}
                      className={cn(
                        "flex items-center theme-gap-2 theme-ml-6 theme-py-0.5 theme-radius theme-px-1 -theme-mx-1",
                        hasPageFile && "cursor-pointer hover:theme-bg-accent"
                      )}
                      onClick={(e) => {
                        if (hasPageFile) {
                          e.stopPropagation();
                          handleFileToggle(fileName, !exists);
                        }
                      }}
                    >
                      <Checkbox
                        checked={!!exists}
                        onCheckedChange={(checked) =>
                          handleFileToggle(fileName, !!checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                        disabled={!hasPageFile}
                      />
                      <span className="text-xs">
                        {fileName}
                      </span>
                    </div>
                  ))}

                  <div
                    className="flex items-center theme-gap-2 theme-py-1 theme-mt-1 cursor-pointer hover:theme-bg-accent theme-radius theme-px-1 -theme-mx-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRootFileToggle("layout.tsx", layoutRelatedFiles);
                    }}
                  >
                    <Checkbox
                      checked={hasLayoutFile}
                      onCheckedChange={() => handleRootFileToggle("layout.tsx", layoutRelatedFiles)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">layout.tsx</span>
                  </div>

                  {Object.entries(layoutRelatedFiles).map(([fileName, exists]) => (
                    <div
                      key={fileName}
                      className={cn(
                        "flex items-center theme-gap-2 theme-ml-6 theme-py-0.5 theme-radius theme-px-1 -theme-mx-1",
                        hasLayoutFile && "cursor-pointer hover:theme-bg-accent"
                      )}
                      onClick={(e) => {
                        if (hasLayoutFile) {
                          e.stopPropagation();
                          handleFileToggle(fileName, !exists);
                        }
                      }}
                    >
                      <Checkbox
                        checked={!!exists}
                        onCheckedChange={(checked) =>
                          handleFileToggle(fileName, !!checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                        disabled={!hasLayoutFile}
                      />
                      <span className="text-xs">
                        {fileName}
                      </span>
                    </div>
                  ))}

                  <div className="border-t theme-border-border theme-pt-2 theme-mt-2 flex flex-col theme-gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start theme-gap-2 theme-shadow theme-font-mono theme-tracking"
                      onClick={() => {
                        onAddDirectory(node.id);
                        setDirectoryPopoverOpen(false);
                      }}
                    >
                      <Plus className="h-3 w-3 theme-text-chart-1" />
                      <span>directory</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start theme-gap-2 theme-shadow theme-font-mono theme-tracking"
                      onClick={() => {
                        onDelete(node.id);
                        setDirectoryPopoverOpen(false);
                      }}
                    >
                      <Trash2 className="h-3 w-3 theme-text-destructive" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {isClickableFile && isExpanded && (
        <div className="theme-mt-1 theme-p-2 theme-bg-background theme-radius animate-in slide-in-from-top-2">
          <div className="text-base font-semibold theme-text-muted-foreground theme-mb-2">
            Features
          </div>
          <div className="flex flex-col theme-gap-2">
            {features.length > 0 ? (
              features.map((feature) => (
                <InlineFeatureCard
                  key={feature.id}
                  feature={feature}
                  fileId={node.id}
                  appStructure={appStructure}
                  filePath={currentFilePath}
                  isCollapsed={expandedFeatureId !== feature.id}
                  onToggleCollapse={() => {
                    setExpandedFeatureId(
                      expandedFeatureId === feature.id ? null : feature.id
                    );
                  }}
                />
              ))
            ) : (
              <div className="text-base font-semibold theme-text-muted-foreground text-center theme-py-2">
                No features yet
              </div>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                addFeature(node.id);
              }}
              size="sm"
              className="w-full theme-gap-1 h-7 text-xs"
            >
              <Plus className="h-3 w-3" />
              Add Feature
            </Button>
          </div>
        </div>
      )}

      {node.type === "directory" && node.isExpanded !== false && node.children && (
        <div>
          {[...node.children]
            .sort((a, b) => {
              if (a.type === "file" && b.type === "directory") return -1;
              if (a.type === "directory" && b.type === "file") return 1;
              return a.name.localeCompare(b.name);
            })
            .map((child, index, sortedArray) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                isLast={index === sortedArray.length - 1}
                parentPath={`${parentPath}/${node.name}`}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddFile={onAddFile}
                onAddDirectory={onAddDirectory}
                appStructure={appStructure}
                ancestorIsLast={[...ancestorIsLast, isLast]}
                onAddSpecificFile={onAddSpecificFile}
                newNodeId={newNodeId}
                qualifyingFilePaths={qualifyingFilePaths}
                expandedFileId={expandedFileId}
                setExpandedFileId={setExpandedFileId}
              />
            ))}
        </div>
      )}
    </div>
  );
};
