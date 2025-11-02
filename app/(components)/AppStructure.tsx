"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Feature, FileSystemEntry, UserExperienceFileType } from "@/app/(editor)/layout.types";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/editor/ui/tabs";
import { Textarea } from "@/components/editor/ui/textarea";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { cn } from "@/lib/tailwind.utils";
import {
  ChevronDown,
  ChevronUp,
  File,
  Folder,
  FolderOpen,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const PAGE_FILE_ICON = "text-[var(--theme-chart-1)]";

const getFileExtension = (
  fileType: UserExperienceFileType,
  isPage: boolean
): string => {
  if (fileType === "stores") return ".stores.ts";
  if (fileType === "hooks") return ".hooks.tsx";
  if (fileType === "actions") return ".actions.ts";
  if (fileType === "types") return ".types.ts";
  return "";
};

const getBaseFileName = (fileName: string): string => {
  return fileName.replace(/\.(tsx|ts)$/, "");
};

type AppStructureTemplate = {
  id: string;
  name: string;
  structure: FileSystemEntry[];
};

const APP_STRUCTURE_TEMPLATES: AppStructureTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    structure: [
      {
        id: "app-blank",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-blank", name: "layout.tsx", type: "file" },
          { id: "page-blank", name: "page.tsx", type: "file" },
        ],
      },
    ],
  },
  {
    id: "auth",
    name: "Auth (grouped routes)",
    structure: [
      {
        id: "app-auth",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-auth", name: "layout.tsx", type: "file" },
          {
            id: "auth-group",
            name: "(auth)",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "auth-layout", name: "layout.tsx", type: "file" },
              {
                id: "login-dir",
                name: "login",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "login-page", name: "page.tsx", type: "file" },
                ],
              },
              {
                id: "register-dir",
                name: "register",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "register-page", name: "page.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            id: "dashboard-group",
            name: "(dashboard)",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "dashboard-layout", name: "layout.tsx", type: "file" },
              { id: "dashboard-page", name: "page.tsx", type: "file" },
              {
                id: "settings-dir",
                name: "settings",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "settings-page", name: "page.tsx", type: "file" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nested",
    name: "Nested layouts",
    structure: [
      {
        id: "app-nested",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-nested", name: "layout.tsx", type: "file" },
          { id: "page-nested", name: "page.tsx", type: "file" },
          {
            id: "products-dir",
            name: "products",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "products-layout", name: "layout.tsx", type: "file" },
              { id: "products-page", name: "page.tsx", type: "file" },
              {
                id: "category-dir",
                name: "[category]",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "category-layout", name: "layout.tsx", type: "file" },
                  { id: "category-page", name: "page.tsx", type: "file" },
                  {
                    id: "product-dir",
                    name: "[id]",
                    type: "directory",
                    isExpanded: true,
                    children: [
                      { id: "product-page", name: "page.tsx", type: "file" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "blog",
    name: "Blog structure",
    structure: [
      {
        id: "app-blog",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-blog", name: "layout.tsx", type: "file" },
          { id: "page-blog", name: "page.tsx", type: "file" },
          {
            id: "blog-dir",
            name: "blog",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "blog-layout", name: "layout.tsx", type: "file" },
              { id: "blog-page", name: "page.tsx", type: "file" },
              {
                id: "slug-dir",
                name: "[slug]",
                type: "directory",
                isExpanded: true,
                children: [{ id: "slug-page", name: "page.tsx", type: "file" }],
              },
            ],
          },
          {
            id: "about-dir",
            name: "about",
            type: "directory",
            isExpanded: true,
            children: [{ id: "about-page", name: "page.tsx", type: "file" }],
          },
          {
            id: "contact-dir",
            name: "contact",
            type: "directory",
            isExpanded: true,
            children: [{ id: "contact-page", name: "page.tsx", type: "file" }],
          },
        ],
      },
    ],
  },
];

const LayoutInsertionButtons = ({
  layoutPath,
  onAddElement,
  onRemoveElement,
  hasHeader,
  hasFooter,
  hasLeftSidebar,
  hasRightSidebar,
}: {
  layoutPath: string;
  onAddElement: (
    type: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => void;
  onRemoveElement: (
    type: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => void;
  hasHeader: boolean;
  hasFooter: boolean;
  hasLeftSidebar: boolean;
  hasRightSidebar: boolean;
}) => {
  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-20 opacity-60 hover:opacity-100 transition-opacity theme-bg-background theme-border-border theme-shadow"
          onClick={() =>
            hasHeader ? onRemoveElement("header") : onAddElement("header")
          }
          title={hasHeader ? "Remove header" : "Add header"}
        >
          {hasHeader ? (
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-20 w-6 opacity-60 hover:opacity-100 transition-opacity theme-bg-background theme-border-border theme-shadow"
          onClick={() =>
            hasLeftSidebar
              ? onRemoveElement("sidebar-left")
              : onAddElement("sidebar-left")
          }
          title={hasLeftSidebar ? "Remove left sidebar" : "Add left sidebar"}
        >
          {hasLeftSidebar ? (
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-20 w-6 opacity-60 hover:opacity-100 transition-opacity theme-bg-background theme-border-border theme-shadow"
          onClick={() =>
            hasRightSidebar
              ? onRemoveElement("sidebar-right")
              : onAddElement("sidebar-right")
          }
          title={hasRightSidebar ? "Remove right sidebar" : "Add right sidebar"}
        >
          {hasRightSidebar ? (
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-20 opacity-60 hover:opacity-100 transition-opacity theme-bg-background theme-border-border theme-shadow"
          onClick={() =>
            hasFooter ? onRemoveElement("footer") : onAddElement("footer")
          }
          title={hasFooter ? "Remove footer" : "Add footer"}
        >
          {hasFooter ? (
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>
    </>
  );
};

const WireframeElementComponent = ({
  element,
  colorSet,
}: {
  element: import("@/app/(editor)/layout.types").WireframeElement;
  colorSet: { border: string; icon: string };
}) => {
  const getElementStyles = () => {
    switch (element.type) {
      case "header":
        return `w-full h-4`;
      case "footer":
        return `w-full h-4`;
      case "sidebar-left":
      case "sidebar-right":
        return `w-4 h-full`;
      default:
        return "";
    }
  };

  const getBgColorClass = () => {
    const bgClass = colorSet.border.replace("border-", "bg-");
    return bgClass + "/10";
  };

  return (
    <div
      className={cn(
        "border theme-radius theme-shadow",
        colorSet.border,
        getBgColorClass(),
        getElementStyles()
      )}
    />
  );
};

const LAYOUT_COLORS = [
  {
    border: "theme-border-chart-5",
    icon: "theme-text-chart-5",
  },
  {
    border: "theme-border-chart-2",
    icon: "theme-text-chart-2",
  },
  {
    border: "theme-border-chart-3",
    icon: "theme-text-chart-3",
  },
];

const isQualifyingFile = (
  fileName: string,
  fileType: UserExperienceFileType
): boolean => {
  const patterns: Record<UserExperienceFileType, RegExp> = {
    stores: /\.stores\.ts$/,
    hooks: /\.hooks\.tsx$/,
    actions: /\.actions\.ts$/,
    types: /\.types\.ts$/,
  };
  return patterns[fileType].test(fileName);
};

const getQualifyingFiles = (
  appStructure: FileSystemEntry[],
  selectedFilePath: string | null,
  fileType: UserExperienceFileType
): string[] => {
  if (!selectedFilePath) {
    conditionalLog({ message: "No selected file path", selectedFilePath, fileType }, { label: LOG_LABELS.APP_STRUCTURE });
    return [];
  }

  const selectedDirectory = selectedFilePath.substring(
    0,
    selectedFilePath.lastIndexOf("/")
  );

  const qualifyingFiles: string[] = [];

  const isAncestorOrSameDirectory = (fileDir: string, selectedDir: string): boolean => {
    if (fileDir === selectedDir) return true;

    if (selectedDir.startsWith(fileDir + "/")) return true;

    return false;
  };

  const traverseStructure = (
    entries: FileSystemEntry[],
    currentPath: string = ""
  ) => {
    for (const entry of entries) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : `/${entry.name}`;

      if (entry.type === "file" && isQualifyingFile(entry.name, fileType)) {
        const fileDirectory = entryPath.substring(0, entryPath.lastIndexOf("/"));
        const isQualified = isAncestorOrSameDirectory(fileDirectory, selectedDirectory);

        conditionalLog({
          fileName: entry.name,
          entryPath,
          fileDirectory,
          selectedDirectory,
          isQualified,
          fileType,
        }, { label: LOG_LABELS.APP_STRUCTURE });

        if (isQualified) {
          qualifyingFiles.push(entryPath);
        }
      }

      if (entry.type === "directory" && entry.children) {
        traverseStructure(entry.children, entryPath);
      }
    }
  };

  traverseStructure(appStructure);

  conditionalLog({
    message: "Qualifying files result",
    selectedFilePath,
    selectedDirectory,
    fileType,
    qualifyingFiles,
    totalQualifying: qualifyingFiles.length,
  }, { label: LOG_LABELS.APP_STRUCTURE });

  return qualifyingFiles;
};

const FeatureCard = ({
  feature,
  fileId,
}: {
  feature: Feature;
  fileId: string;
}) => {
  const { updateFeature, removeFeature, linkFeatureFile, unlinkFeatureFile, setFeatureFileSelection } = useEditorStore();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const canSave =
    feature.title.trim() !== "" && feature.description.trim() !== "";

  const handleSave = () => {
    if (canSave) {
      updateFeature(fileId, feature.id, { isEditing: false });
    }
  };

  const handleEdit = () => {
    updateFeature(fileId, feature.id, { isEditing: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canSave) {
      e.preventDefault();
      handleSave();
    }
  };

  const fileTypes: UserExperienceFileType[] = ["stores", "hooks", "actions", "types"];

  const handlePlaceholderClick = (fileType: UserExperienceFileType) => {
    setFeatureFileSelection(fileId, feature.id, fileType);
  };

  const handleUnlinkFile = (fileType: UserExperienceFileType, e: React.MouseEvent) => {
    e.stopPropagation();
    unlinkFeatureFile(fileId, feature.id, fileType);
  };

  if (!feature.isEditing) {
    return (
      <div className="theme-bg-muted theme-radius theme-p-3">
        <div
          className="cursor-pointer hover:theme-bg-accent transition-colors theme-p-2 theme-radius"
          onClick={handleEdit}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center theme-gap-2 theme-mb-1">
                <span className="text-sm font-medium theme-text-foreground">
                  {feature.title}
                </span>
              </div>
              <div className="text-xs theme-text-muted-foreground theme-truncate">
                {feature.description}
              </div>
            </div>
            <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 theme-ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4 theme-text-destructive" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 theme-p-3 theme-shadow"
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col theme-gap-2">
                  <p className="text-sm theme-text-foreground">
                    Delete feature {feature.title}?
                  </p>
                  <div className="flex theme-gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        removeFeature(fileId, feature.id);
                        setDeleteConfirmOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 theme-gap-2 theme-mt-3">
          {fileTypes.map((fileType) => {
            const linkedFile = feature.linkedFiles[fileType];
            return (
              <div
                key={fileType}
                className={cn(
                  "theme-p-2 theme-radius border-2 transition-colors min-h-[60px] flex flex-col justify-between",
                  linkedFile
                    ? "theme-border-border theme-bg-background cursor-pointer hover:theme-bg-accent"
                    : "border-dashed theme-border-muted-foreground/30 theme-bg-background/50 cursor-pointer hover:theme-bg-accent/50"
                )}
                onClick={() => handlePlaceholderClick(fileType)}
              >
                <div className="text-xs theme-font-mono theme-text-muted-foreground capitalize theme-mb-1">
                  {fileType}
                </div>
                {linkedFile ? (
                  <div className="flex items-center justify-between theme-gap-1">
                    <div className="text-xs theme-font-mono theme-text-foreground truncate flex-1">
                      {linkedFile.split("/").pop()}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 flex-shrink-0"
                      onClick={(e) => handleUnlinkFile(fileType, e)}
                    >
                      <Trash2 className="h-3 w-3 theme-text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs theme-text-muted-foreground/50">
                    Click to select
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-bg-muted theme-radius theme-p-3 relative">
      <div className="flex items-center justify-between theme-mb-2">
        <Input
          value={feature.title}
          onChange={(e) =>
            updateFeature(fileId, feature.id, { title: e.target.value })
          }
          onKeyDown={handleKeyDown}
          className="h-7 text-sm font-medium theme-shadow"
          placeholder="Feature title"
        />
        <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 theme-ml-2">
              <Trash2 className="h-4 w-4 theme-text-destructive" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
            <div className="flex flex-col theme-gap-2">
              <p className="text-sm theme-text-foreground">
                Delete feature {feature.title}?
              </p>
              <div className="flex theme-gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    removeFeature(fileId, feature.id);
                    setDeleteConfirmOpen(false);
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col theme-gap-2">
        <div>
          <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
            Description
          </label>
          <Textarea
            value={feature.description}
            onChange={(e) =>
              updateFeature(fileId, feature.id, { description: e.target.value })
            }
            onKeyDown={handleKeyDown}
            placeholder="Enter feature description"
            className="text-sm theme-shadow min-h-[80px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 theme-gap-2 theme-mt-3">
        {fileTypes.map((fileType) => {
          const linkedFile = feature.linkedFiles[fileType];
          return (
            <div
              key={fileType}
              className={cn(
                "theme-p-2 theme-radius border-2 transition-colors min-h-[60px] flex flex-col justify-between",
                linkedFile
                  ? "theme-border-border theme-bg-background cursor-pointer hover:theme-bg-accent"
                  : "border-dashed theme-border-muted-foreground/30 theme-bg-background/50 cursor-pointer hover:theme-bg-accent/50"
              )}
              onClick={() => handlePlaceholderClick(fileType)}
            >
              <div className="text-xs theme-font-mono theme-text-muted-foreground capitalize theme-mb-1">
                {fileType}
              </div>
              {linkedFile ? (
                <div className="flex items-center justify-between theme-gap-1">
                  <div className="text-xs theme-font-mono theme-text-foreground truncate flex-1">
                    {linkedFile.split("/").pop()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 flex-shrink-0"
                    onClick={(e) => handleUnlinkFile(fileType, e)}
                  >
                    <Trash2 className="h-3 w-3 theme-text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="text-xs theme-text-muted-foreground/50">
                  Click to select
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end theme-mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={!canSave}
          className="h-7 theme-gap-1"
        >
          <Save className="h-3 w-3" />
          Save
        </Button>
      </div>
    </div>
  );
};

const generateRoutesFromFileSystem = (
  entries: FileSystemEntry[],
  parentPath: string = "",
  isRoot: boolean = false
): RouteEntry[] => {
  const routes: RouteEntry[] = [];

  entries.forEach((entry) => {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        routes.push(...generateRoutesFromFileSystem(entry.children, "", false));
      }
      return;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, parentPath, false)
        );
      }
      return;
    }

    if (entry.type === "file" && entry.name === "page.tsx") {
      const route: RouteEntry = {
        path: parentPath || "/",
      };
      routes.push(route);
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = parentPath
        ? `${parentPath}/${entry.name}`
        : `/${entry.name}`;

      const hasPageFile = entry.children.some(
        (child) => child.type === "file" && child.name === "page.tsx"
      );

      if (hasPageFile) {
        const childRoutes = generateRoutesFromFileSystem(
          entry.children,
          newPath,
          false
        );
        if (childRoutes.length > 0) {
          const mainRoute = childRoutes.find((r) => r.path === newPath);
          if (mainRoute) {
            mainRoute.children = childRoutes.filter((r) => r.path !== newPath);
            routes.push(mainRoute);
          } else {
            routes.push({
              path: newPath,
              children: childRoutes,
            });
          }
        } else {
          routes.push({ path: newPath });
        }
      } else {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, newPath, false)
        );
      }
    }
  });

  return routes;
};

const findFileSystemEntryForPath = (
  entries: FileSystemEntry[],
  targetPath: string,
  currentPath: string = "",
  isRoot: boolean = false
): { entry: FileSystemEntry; segmentIndex: number } | null => {
  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          currentPath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (targetPath === newPath || targetPath.startsWith(newPath + "/")) {
        const currentSegments = newPath.split("/").filter(Boolean);

        if (targetPath === newPath) {
          return { entry, segmentIndex: currentSegments.length - 1 };
        }

        const result = findFileSystemEntryForPath(
          entry.children,
          targetPath,
          newPath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const updateFileSystemEntryName = (
  entries: FileSystemEntry[],
  targetEntry: FileSystemEntry,
  newName: string
): FileSystemEntry[] => {
  return entries.map((entry) => {
    if (entry.id === targetEntry.id) {
      return { ...entry, name: newName };
    }
    if (entry.children) {
      return {
        ...entry,
        children: updateFileSystemEntryName(
          entry.children,
          targetEntry,
          newName
        ),
      };
    }
    return entry;
  });
};

const isDirectoryEmpty = (entry: FileSystemEntry): boolean => {
  if (entry.type !== "directory" || !entry.children) {
    return false;
  }

  if (entry.children.length === 0) {
    return true;
  }

  return entry.children.every(
    (child) => child.type === "directory" && isDirectoryEmpty(child)
  );
};

const deleteRouteFromFileSystem = (
  entries: FileSystemEntry[],
  targetPath: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  return entries
    .map((entry) => {
      if (entry.name === "app" && isRoot) {
        if (entry.children) {
          if (targetPath === "/") {
            const updatedChildren = entry.children.filter(
              (child) => !(child.type === "file" && child.name === "page.tsx")
            );
            return { ...entry, children: updatedChildren };
          } else {
            const updatedChildren = deleteRouteFromFileSystem(
              entry.children,
              targetPath,
              "",
              false
            );
            return { ...entry, children: updatedChildren };
          }
        }
        return entry;
      }

      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        if (entry.children) {
          const updatedChildren = deleteRouteFromFileSystem(
            entry.children,
            targetPath,
            currentPath,
            false
          );
          return { ...entry, children: updatedChildren };
        }
        return entry;
      }

      if (entry.type === "directory" && entry.children) {
        const newPath = currentPath
          ? `${currentPath}/${entry.name}`
          : `/${entry.name}`;

        if (targetPath === newPath) {
          const updatedChildren = entry.children.filter(
            (child) => !(child.type === "file" && child.name === "page.tsx")
          );

          const updatedEntry = { ...entry, children: updatedChildren };

          if (isDirectoryEmpty(updatedEntry)) {
            return null;
          }

          return updatedEntry;
        }

        const updatedChildren = deleteRouteFromFileSystem(
          entry.children,
          targetPath,
          newPath,
          false
        );
        const updatedEntry = { ...entry, children: updatedChildren };

        if (isDirectoryEmpty(updatedEntry)) {
          return null;
        }

        return updatedEntry;
      }

      return entry;
    })
    .filter(Boolean) as FileSystemEntry[];
};

const addRouteSegment = (
  entries: FileSystemEntry[],
  parentPath: string,
  segmentName: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  return entries.map((entry) => {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        return {
          ...entry,
          children: addRouteSegment(
            entry.children,
            parentPath,
            segmentName,
            "",
            false
          ),
        };
      }
      return entry;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        return {
          ...entry,
          children: addRouteSegment(
            entry.children,
            parentPath,
            segmentName,
            currentPath,
            false
          ),
        };
      }
      return entry;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (parentPath === newPath) {
        const newSegment: FileSystemEntry = {
          id: generateId(),
          name: segmentName,
          type: "directory",
          isExpanded: true,
          children: [{ id: generateId(), name: "page.tsx", type: "file" }],
        };

        return {
          ...entry,
          children: [...(entry.children || []), newSegment],
          isExpanded: true,
        };
      }

      return {
        ...entry,
        children: addRouteSegment(
          entry.children,
          parentPath,
          segmentName,
          newPath,
          false
        ),
      };
    }

    return entry;
  });
};

const validateSegmentName = (
  name: string
): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Segment name cannot be empty" };
  }

  const trimmedName = name.trim();

  if (!/^[a-zA-Z0-9-_]+$/.test(trimmedName)) {
    return {
      valid: false,
      error: "Only letters, numbers, hyphens, and underscores are allowed",
    };
  }

  if (trimmedName.length > 50) {
    return { valid: false, error: "Segment name cannot exceed 50 characters" };
  }

  return { valid: true };
};

const validateRoutePath = (
  path: string
): { valid: boolean; error?: string } => {
  if (!path || path.trim().length === 0) {
    return { valid: false, error: "Route path cannot be empty" };
  }

  const trimmedPath = path.trim();

  if (!trimmedPath.startsWith("/")) {
    return { valid: false, error: "Route path must start with /" };
  }

  if (trimmedPath !== "/" && trimmedPath.endsWith("/")) {
    const segments = trimmedPath.slice(1, -1).split("/");
    for (const segment of segments) {
      const validation = validateSegmentName(segment);
      if (!validation.valid) {
        return {
          valid: false,
          error: `Invalid segment "${segment}": ${validation.error}`,
        };
      }
    }
  } else if (trimmedPath !== "/") {
    const segments = trimmedPath.slice(1).split("/");
    for (const segment of segments) {
      const validation = validateSegmentName(segment);
      if (!validation.valid) {
        return {
          valid: false,
          error: `Invalid segment "${segment}": ${validation.error}`,
        };
      }
    }
  }

  return { valid: true };
};

const findExistingRouteInStructure = (
  entries: FileSystemEntry[],
  targetRoutePath: string,
  currentRoutePath: string = "",
  isRoot: boolean = false
): { entry: FileSystemEntry; segments: string[] } | null => {
  const normalizedTarget =
    targetRoutePath.endsWith("/") && targetRoutePath !== "/"
      ? targetRoutePath.slice(0, -1)
      : targetRoutePath;

  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          currentRoutePath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const routePath = currentRoutePath
        ? `${currentRoutePath}/${entry.name}`
        : `/${entry.name}`;

      if (normalizedTarget === routePath) {
        const routeSegments =
          routePath === "/" ? [] : routePath.slice(1).split("/");
        return { entry, segments: routeSegments };
      }

      if (normalizedTarget.startsWith(routePath + "/")) {
        const result = findExistingRouteInStructure(
          entry.children,
          normalizedTarget,
          routePath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const findBestParentForRoute = (
  entries: FileSystemEntry[],
  targetRoutePath: string,
  currentRoutePath: string = "",
  isRoot: boolean = false
): { parentEntry: FileSystemEntry; remainingSegments: string[] } | null => {
  const normalizedTarget =
    targetRoutePath.endsWith("/") && targetRoutePath !== "/"
      ? targetRoutePath.slice(0, -1)
      : targetRoutePath;

  const targetSegments =
    normalizedTarget === "/" ? [] : normalizedTarget.slice(1).split("/");

  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          "",
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          currentRoutePath,
          false
        );
        if (result) return result;
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const routePath = currentRoutePath
        ? `${currentRoutePath}/${entry.name}`
        : `/${entry.name}`;

      const currentSegments =
        routePath === "/" ? [] : routePath.slice(1).split("/");

      if (targetSegments.length > currentSegments.length) {
        let matches = true;
        for (let i = 0; i < currentSegments.length; i++) {
          if (currentSegments[i] !== targetSegments[i]) {
            matches = false;
            break;
          }
        }

        if (matches) {
          const hasPageFile = entry.children.some(
            (child) => child.type === "file" && child.name === "page.tsx"
          );

          if (hasPageFile) {
            const remainingSegments = targetSegments.slice(
              currentSegments.length
            );
            if (remainingSegments.length > 0) {
              const deeperResult = findBestParentForRoute(
                entry.children,
                normalizedTarget,
                routePath,
                false
              );

              if (deeperResult) {
                return deeperResult;
              } else {
                return {
                  parentEntry: entry,
                  remainingSegments: remainingSegments,
                };
              }
            }
          }
        }
      }

      if (normalizedTarget.startsWith(routePath + "/")) {
        const result = findBestParentForRoute(
          entry.children,
          normalizedTarget,
          routePath,
          false
        );
        if (result) return result;
      }
    }
  }
  return null;
};

const createRouteFromPath = (
  entries: FileSystemEntry[],
  routePath: string,
  currentPath: string = "",
  isRoot: boolean = false
): FileSystemEntry[] => {
  const normalizedPath =
    routePath.endsWith("/") && routePath !== "/"
      ? routePath.slice(0, -1)
      : routePath;

  const pathSegments =
    normalizedPath === "/" ? [] : normalizedPath.slice(1).split("/");

  const addPageToExistingEntry = (
    targetEntry: FileSystemEntry,
    entryList: FileSystemEntry[]
  ): FileSystemEntry[] => {
    return entryList.map((entry) => {
      if (entry.id === targetEntry.id) {
        const hasPageFile = entry.children?.some(
          (child) => child.type === "file" && child.name === "page.tsx"
        );

        if (!hasPageFile) {
          const updatedChildren = [
            ...(entry.children || []),
            {
              id: generateId(),
              name: "page.tsx",
              type: "file" as const,
            },
          ];
          return { ...entry, children: updatedChildren, isExpanded: true };
        }
        return entry;
      }

      if (entry.children) {
        return {
          ...entry,
          children: addPageToExistingEntry(targetEntry, entry.children),
        };
      }

      return entry;
    });
  };

  const createMissingStructure = (
    currentEntries: FileSystemEntry[],
    segments: string[],
    segmentIndex: number = 0
  ): FileSystemEntry[] => {
    if (segmentIndex >= segments.length) {
      return currentEntries;
    }

    const segment = segments[segmentIndex];
    const existingEntry = currentEntries.find(
      (entry) => entry.type === "directory" && entry.name === segment
    );

    if (existingEntry) {
      const finalChildren = createMissingStructure(
        existingEntry.children || [],
        segments,
        segmentIndex + 1
      );

      let updatedChildren = finalChildren;

      if (segmentIndex === segments.length - 1) {
        const hasPageFile = finalChildren.some(
          (child) => child.type === "file" && child.name === "page.tsx"
        );

        if (!hasPageFile) {
          updatedChildren = [
            ...finalChildren,
            {
              id: generateId(),
              name: "page.tsx",
              type: "file" as const,
            },
          ];
        }
      }

      return currentEntries.map((entry) =>
        entry.id === existingEntry.id
          ? { ...entry, children: updatedChildren, isExpanded: true }
          : entry
      );
    } else {
      const newSegment: FileSystemEntry = {
        id: generateId(),
        name: segment,
        type: "directory" as const,
        isExpanded: true,
        children: [],
      };

      if (segmentIndex === segments.length - 1) {
        newSegment.children = [
          {
            id: generateId(),
            name: "page.tsx",
            type: "file" as const,
          },
        ];
      } else {
        newSegment.children = createMissingStructure(
          [],
          segments,
          segmentIndex + 1
        );
      }

      return [...currentEntries, newSegment];
    }
  };

  if (isRoot) {
    const existingRoute = findExistingRouteInStructure(
      entries,
      normalizedPath,
      "",
      true
    );

    if (existingRoute) {
      return addPageToExistingEntry(existingRoute.entry, entries);
    }

    const bestParent = findBestParentForRoute(
      entries,
      normalizedPath,
      "",
      true
    );

    if (bestParent) {
      const addSegmentsToParent = (
        targetEntry: FileSystemEntry,
        entryList: FileSystemEntry[],
        segments: string[]
      ): FileSystemEntry[] => {
        return entryList.map((entry) => {
          if (entry.id === targetEntry.id) {
            let updatedChildren = [...(entry.children || [])];

            for (let i = 0; i < segments.length; i++) {
              const segment = segments[i];
              let targetContainer = updatedChildren;

              for (let j = 0; j < i; j++) {
                const previousSegment = segments[j];
                const parentDir = targetContainer.find(
                  (child) =>
                    child.type === "directory" && child.name === previousSegment
                );
                if (parentDir?.children) {
                  targetContainer = parentDir.children;
                }
              }

              const existingSegment = targetContainer.find(
                (child) => child.type === "directory" && child.name === segment
              );

              if (!existingSegment) {
                const newSegment: FileSystemEntry = {
                  id: generateId(),
                  name: segment,
                  type: "directory",
                  isExpanded: true,
                  children:
                    i === segments.length - 1
                      ? [{ id: generateId(), name: "page.tsx", type: "file" }]
                      : [],
                };

                targetContainer.push(newSegment);
              } else if (i === segments.length - 1) {
                const hasPageFile = existingSegment.children?.some(
                  (child) => child.type === "file" && child.name === "page.tsx"
                );
                if (!hasPageFile && existingSegment.children) {
                  existingSegment.children.push({
                    id: generateId(),
                    name: "page.tsx",
                    type: "file",
                  });
                }
              }
            }

            return { ...entry, children: updatedChildren, isExpanded: true };
          }

          if (entry.children) {
            return {
              ...entry,
              children: addSegmentsToParent(
                targetEntry,
                entry.children,
                segments
              ),
            };
          }

          return entry;
        });
      };

      return addSegmentsToParent(
        bestParent.parentEntry,
        entries,
        bestParent.remainingSegments
      );
    }

    if (normalizedPath === "/" || pathSegments.length === 0) {
      return entries.map((entry) => {
        if (entry.name === "app") {
          const hasRootPage = entry.children?.some(
            (child) => child.type === "file" && child.name === "page.tsx"
          );

          if (!hasRootPage && entry.children) {
            return {
              ...entry,
              children: [
                ...entry.children,
                {
                  id: generateId(),
                  name: "page.tsx",
                  type: "file" as const,
                },
              ],
              isExpanded: true,
            };
          }
        }
        return entry;
      });
    }

    return entries.map((entry) => {
      if (entry.name === "app" && entry.children) {
        return {
          ...entry,
          children: createMissingStructure(entry.children, pathSegments),
          isExpanded: true,
        };
      }
      return entry;
    });
  }

  return entries.map((entry) => {
    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        return {
          ...entry,
          children: createRouteFromPath(
            entry.children,
            routePath,
            currentPath,
            false
          ),
        };
      }
      return entry;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;
      return {
        ...entry,
        children: createRouteFromPath(
          entry.children,
          routePath,
          newPath,
          false
        ),
      };
    }

    return entry;
  });
};

const SiteMapNode = ({
  route,
  depth = 0,
  isLast = false,
  appStructure,
  onUpdateAppStructure,
  onDeleteRoute,
  onAddSegment,
  ancestorIsLast = [],
}: {
  route: RouteEntry;
  depth?: number;
  isLast?: boolean;
  appStructure: FileSystemEntry[];
  onUpdateAppStructure: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDeleteRoute: (routePath: string) => void;
  onAddSegment: (parentPath: string) => void;
  ancestorIsLast?: boolean[];
}) => {
  const [editingSegmentIndex, setEditingSegmentIndex] = useState<number | null>(
    null
  );
  const [tempValue, setTempValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSegmentIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSegmentIndex]);

  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push(ancestorIsLast[i] ? "    " : "│   ");
    }
    return lines.join("");
  };

  const pathSegments =
    route.path === "/" ? ["/"] : route.path.split("/").filter(Boolean);

  const handleSegmentClick = (segmentIndex: number) => {
    if (route.path === "/") return;

    setEditingSegmentIndex(segmentIndex);
    setTempValue(pathSegments[segmentIndex]);
  };

  const handleSegmentSubmit = () => {
    if (editingSegmentIndex === null) {
      setEditingSegmentIndex(null);
      return;
    }

    const validation = validateSegmentName(tempValue);
    if (!validation.valid) {
      console.error("Invalid segment name:", validation.error);
      setEditingSegmentIndex(null);
      return;
    }

    const targetPath =
      "/" + pathSegments.slice(0, editingSegmentIndex + 1).join("/");
    const result = findFileSystemEntryForPath(
      appStructure,
      targetPath,
      "",
      true
    );

    if (result) {
      onUpdateAppStructure(result.entry.id, { name: tempValue.trim() });
    } else {
      console.error("Could not find filesystem entry for path:", targetPath);
    }

    setEditingSegmentIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSegmentSubmit();
    }
    if (e.key === "Escape") {
      setEditingSegmentIndex(null);
    }
  };

  const renderPathSegments = () => {
    if (route.path === "/") {
      return <span className="text-sm font-mono theme-text-foreground">/</span>;
    }

    return (
      <div className="flex items-center theme-spacing">
        <span className="text-sm font-mono theme-text-muted-foreground">/</span>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center">
            {editingSegmentIndex === index ? (
              <Input
                ref={inputRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSegmentSubmit}
                onKeyDown={handleKeyDown}
                className="h-6 theme-px-2 theme-py-0 text-sm w-20 min-w-fit theme-shadow"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-sm font-mono cursor-pointer hover:theme-bg-accent theme-px theme-py theme-radius theme-text-foreground"
                onClick={() => handleSegmentClick(index)}
              >
                {segment}
              </span>
            )}
            {index < pathSegments.length - 1 && (
              <span className="text-sm font-mono theme-text-muted-foreground">
                /
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleDeleteRoute = () => {
    onDeleteRoute(route.path);
  };

  const handleAddSegment = () => {
    onAddSegment(route.path);
  };

  return (
    <>
      <div className="group flex items-center justify-between theme-spacing hover:theme-bg-accent theme-radius theme-px theme-text-foreground">
        <div className="flex items-center theme-spacing">
          <span className="font-mono text-base select-none theme-text-muted-foreground">
            {getLinePrefix()}
            {getTreeChar()}
            {depth > 0 && "─ "}
          </span>
          {renderPathSegments()}
        </div>

        <div className="flex items-center theme-spacing opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 theme-shadow"
            onClick={handleAddSegment}
            title="Add segment"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 theme-shadow"
            onClick={handleDeleteRoute}
            title="Delete route"
          >
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          </Button>
        </div>
      </div>
      {route.children && route.children.length > 0 && (
        <>
          {route.children.map((child, index) => (
            <SiteMapNode
              key={child.path}
              route={child}
              depth={depth + 1}
              isLast={index === route.children!.length - 1}
              appStructure={appStructure}
              onUpdateAppStructure={onUpdateAppStructure}
              onDeleteRoute={onDeleteRoute}
              onAddSegment={onAddSegment}
              ancestorIsLast={[...ancestorIsLast, isLast]}
            />
          ))}
        </>
      )}
    </>
  );
};

const TreeNode = ({
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
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
  } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isPageFile = node.type === "file" && node.name === "page.tsx";
  const isLayoutFile = node.type === "file" && node.name === "layout.tsx";
  const isClickableFile = isPageFile || isLayoutFile;

  const currentFilePath = parentPath ? `${parentPath}/${node.name}` : node.name;
  const isQualified = qualifyingFilePaths.includes(currentFilePath);
  const isInSelectionMode = featureFileSelection.fileType !== null;

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
          return LAYOUT_COLORS[layoutIndex % LAYOUT_COLORS.length].icon;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (newNodeId && node.id === newNodeId) {
      setIsEditing(true);
    }
  }, [newNodeId, node.id]);

  const handleNameSubmit = (newName: string) => {
    if (newName.trim()) {
      onUpdate(node.id, { name: newName.trim() });
      setIsEditing(false);
    } else {
      onDelete(node.id);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit(e.currentTarget.value);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push(ancestorIsLast[i] ? "    " : "│   ");
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
    if (isInSelectionMode && isQualified && featureFileSelection.fileId && featureFileSelection.featureId && featureFileSelection.fileType) {
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

  return (
    <div>
      <div
        className={cn(
          "group flex items-center theme-spacing theme-radius theme-px theme-text-foreground",
          isClickableFile && "cursor-pointer hover:theme-bg-primary",
          !isClickableFile && "hover:theme-bg-accent",
          isCurrentPage && " theme-bg-muted ",
          isQualified && isInSelectionMode && "border-2 border-dashed theme-border-chart-4 theme-bg-accent/20 cursor-pointer"
        )}
        onClick={(e) => {
          if (isQualified && isInSelectionMode) {
            e.stopPropagation();
            handleFileClick();
            return;
          }
          if (isClickableFile) {
            e.stopPropagation();
            if (isPageFile) {
              handlePageFileClick();
            }
            handleFileClick();
          }
        }}
      >
        <span className="font-mono text-base select-none theme-text-muted-foreground">
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>

        <div className="flex items-center theme-spacing flex-1 min-w-0 theme-px">
          {node.type === "directory" ? (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 theme-text-chart-2" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 theme-text-chart-2" />
            )
          ) : (
            <File
              className={cn(
                "h-4 w-4 flex-shrink-0 theme-text-chart-3",
                getFileIconColor(),
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

          {isEditing ? (
            <Input
              ref={inputRef}
              defaultValue={node.name}
              onBlur={(e) => handleNameSubmit(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-6 theme-px-2 theme-py-0 text-sm theme-shadow"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-sm truncate cursor-pointer hover:underline theme-text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {node.name}
            </span>
          )}

          {isClickableFile && remainingOptions.length > 0 && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 theme-ml-auto"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 theme-p-2 theme-shadow theme-bg-popover theme-border-border"
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col theme-gap-1">
                  {remainingOptions.map((option) => (
                    <Button
                      key={option}
                      variant="ghost"
                      size="sm"
                      className="justify-start theme-gap-2 theme-shadow"
                      onClick={() => handleAddUtilityFile(option)}
                    >
                      <File className="h-4 w-4 theme-text-chart-4" />
                      <span>{option}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isClickableFile && utilityFiles.length > 0 && (
            <div className="flex items-center theme-gap-1 theme-ml-2">
              {utilityFiles.map((fileType, i) => (
                <span
                  key={i}
                  className="text-xs theme-font-mono theme-px-1 theme-py-0.5 theme-bg-accent theme-radius theme-text-muted-foreground"
                >
                  {fileType[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center theme-spacing transition-opacity",
            isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isEditing && (
            <div
              className="h-6 w-6 theme-shadow flex items-center justify-center"
              title="Save"
            >
              <Save className="h-3 w-3 theme-text-muted-foreground" />
            </div>
          )}
          <div
            className="h-6 w-6 theme-shadow flex items-center justify-center cursor-pointer hover:theme-bg-accent theme-radius"
            onClick={() => onDelete(node.id)}
            title="Delete"
          >
            <Trash2 className="h-3 w-3 theme-text-destructive" />
          </div>
        </div>
      </div>

      {node.type === "directory" && node.isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={false}
              parentPath={`${parentPath}/${node.name}`}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddFile={onAddFile}
              onAddDirectory={onAddDirectory}
              appStructure={appStructure}
              ancestorIsLast={[...ancestorIsLast, false]}
              onAddSpecificFile={onAddSpecificFile}
              newNodeId={newNodeId}
              qualifyingFilePaths={qualifyingFilePaths}
            />
          ))}

          <div className="flex items-center theme-spacing theme-radius theme-px theme-text-foreground">
            <span className="font-mono text-base select-none theme-text-muted-foreground">
              {(() => {
                const lines = [];
                for (let i = 0; i < depth - 1; i++) {
                  lines.push(ancestorIsLast[i] ? "    " : "│   ");
                }
                if (depth > 0) {
                  lines.push("│   ");
                }
                return lines.join("");
              })()}
              └─{" "}
            </span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 theme-px-2 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-sm">Add...</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 theme-p-2 theme-shadow theme-bg-popover theme-border-border theme-font-mono theme-tracking"
                align="start"
              >
                <div className="flex flex-col theme-gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start theme-gap-2 theme-shadow theme-font-mono theme-tracking"
                    onClick={() => {
                      if (onAddSpecificFile) {
                        onAddSpecificFile(node.id, "page.tsx");
                      }
                    }}
                    disabled={node.children?.some(
                      (child) => child.name === "page.tsx"
                    )}
                  >
                    <File className="h-4 w-4 theme-text-chart-1" />
                    <span>page.tsx</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start theme-gap-2 theme-shadow theme-font-mono theme-tracking"
                    onClick={() => {
                      if (onAddSpecificFile) {
                        onAddSpecificFile(node.id, "layout.tsx");
                      }
                    }}
                    disabled={node.children?.some(
                      (child) => child.name === "layout.tsx"
                    )}
                  >
                    <File className="h-4 w-4 theme-text-secondary" />
                    <span>layout.tsx</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start theme-gap-2 theme-shadow theme-font-mono theme-tracking"
                    onClick={() => onAddDirectory(node.id)}
                  >
                    <Folder className="h-4 w-4 theme-text-chart-2" />
                    <span>directory</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export const LayoutAndStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    wireframeState,
    initializeWireframePages,
    setWireframeCurrentPage,
    addWireframeElement,
    removeWireframeElement,
    selectedFilePath,
    selectedFileId,
    getUtilityFiles,
    getFeatures,
    addFeature,
    featureFileSelection,
  } = useEditorStore();

  useEffect(() => {
    initializeWireframePages();
  }, [appStructure, initializeWireframePages]);

  const { currentPageIndex, availablePages } = wireframeState;
  const currentPage = availablePages[currentPageIndex] || null;

  const layouts = currentPage
    ? findLayoutsForPagePath(appStructure, currentPage, "", true)
    : [];

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const [activeTab, setActiveTab] = useState<string>("layouts");

  const utilityFiles = selectedFileId ? getUtilityFiles(selectedFileId) : [];
  const features = selectedFileId ? getFeatures(selectedFileId) : [];

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(appStructure, selectedFilePath, featureFileSelection.fileType)
    : [];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = APP_STRUCTURE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setAppStructure(template.structure);
    }
  };

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = "new-segment";
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  const handleAddLayoutElement = (
    layoutPath: string,
    elementType: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => {
    const layoutData = wireframeState.wireframeData.layouts[layoutPath];
    const existingElements = layoutData?.elements || [];
    const existingElement = existingElements.find(
      (el) => el.type === elementType
    );

    if (existingElement) {
      removeWireframeElement(layoutPath, "layout", existingElement.id);
    }

    const newElement: import("@/app/(editor)/layout.types").WireframeElement = {
      id: generateId(),
      type: elementType,
      label: elementType.replace("-", " "),
      config: {
        position:
          elementType === "header"
            ? "top"
            : elementType === "footer"
              ? "bottom"
              : elementType === "sidebar-left"
                ? "left"
                : "right",
      },
    };
    addWireframeElement(layoutPath, "layout", newElement);
  };

  const handleRemoveLayoutElementByType = (
    layoutPath: string,
    elementType: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => {
    const layoutData = wireframeState.wireframeData.layouts[layoutPath];
    const existingElements = layoutData?.elements || [];
    const existingElement = existingElements.find(
      (el) => el.type === elementType
    );

    if (existingElement) {
      removeWireframeElement(layoutPath, "layout", existingElement.id);
    }
  };

  const renderNestedBoxes = () => {
    if (!currentPage) {
      return (
        <div className="text-center theme-py-8 theme-text-muted-foreground theme-font-sans theme-tracking">
          No pages available
        </div>
      );
    }

    if (layouts.length === 0) {
      return (
        <div
          className={cn(
            "border-2 border-dashed theme-shadow",
            PAGE_FILE_ICON.replace("text-", "border-"),
            "theme-radius theme-p h-full flex flex-col"
          )}
        />
      );
    }

    let content: JSX.Element | null = null;

    for (let i = layouts.length - 1; i >= 0; i--) {
      const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];
      const layoutPath = layouts[i];
      const layoutData = wireframeState.wireframeData.layouts[layoutPath];
      const elements = layoutData?.elements || [];

      const headers = elements.filter((el) => el.type === "header");
      const footers = elements.filter((el) => el.type === "footer");
      const leftSidebars = elements.filter((el) => el.type === "sidebar-left");
      const rightSidebars = elements.filter(
        (el) => el.type === "sidebar-right"
      );

      const hasHeader = headers.length > 0;
      const hasFooter = footers.length > 0;
      const hasLeftSidebar = leftSidebars.length > 0;
      const hasRightSidebar = rightSidebars.length > 0;

      content = (
        <div
          className={cn(
            "border-2 border-dashed relative theme-shadow",
            colorSet.border,
            "theme-radius theme-p-4 h-full flex flex-col theme-gap-4"
          )}
        >
          <LayoutInsertionButtons
            layoutPath={layoutPath}
            onAddElement={(type) => handleAddLayoutElement(layoutPath, type)}
            onRemoveElement={(type) =>
              handleRemoveLayoutElementByType(layoutPath, type)
            }
            hasHeader={hasHeader}
            hasFooter={hasFooter}
            hasLeftSidebar={hasLeftSidebar}
            hasRightSidebar={hasRightSidebar}
          />

          {headers.map((el) => (
            <WireframeElementComponent
              key={el.id}
              element={el}
              colorSet={colorSet}
            />
          ))}

          <div className="flex-1 flex theme-gap-4">
            {leftSidebars.length > 0 && (
              <div className="flex flex-col theme-gap-4">
                {leftSidebars.map((el) => (
                  <WireframeElementComponent
                    key={el.id}
                    element={el}
                    colorSet={colorSet}
                  />
                ))}
              </div>
            )}

            <div className="flex-1">{content}</div>

            {rightSidebars.length > 0 && (
              <div className="flex flex-col theme-gap-4">
                {rightSidebars.map((el) => (
                  <WireframeElementComponent
                    key={el.id}
                    element={el}
                    colorSet={colorSet}
                  />
                ))}
              </div>
            )}
          </div>

          {footers.map((el) => (
            <WireframeElementComponent
              key={el.id}
              element={el}
              colorSet={colorSet}
            />
          ))}
        </div>
      );
    }

    return content;
  };

  return (
    <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,2fr)_minmax(300px,3fr)] theme-gap-2 md:theme-gap-4 min-h-[calc(100vh-800px)]">
        <div className="flex flex-col theme-gap-2 md:theme-gap-4 h-full overflow-hidden">
          <div className="flex flex-col flex-[2] min-h-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between theme-mb-2 theme-gap-2">
              <h3 className="text-base md:text-lg font-semibold theme-text-card-foreground theme-font-sans theme-tracking">
                App Directory
              </h3>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-8 theme-font-mono text-xs md:text-sm">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {APP_STRUCTURE_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
              {appStructure.map((node, index) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isLast={false}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onAddFile={handleAddFile}
                  onAddDirectory={handleAddDirectory}
                  appStructure={appStructure}
                  onAddSpecificFile={handleAddSpecificFile}
                  newNodeId={newNodeId}
                  qualifyingFilePaths={qualifyingFilePaths}
                />
              ))}

              {appStructure.length === 0 && (
                <div className="text-center theme-py-8 theme-text-muted-foreground theme-font-sans theme-tracking">
                  Select a template above to start building your app structure
                </div>
              )}
            </div>
          </div>

          {routes.length > 0 && (
            <div className="flex flex-col flex-[1] min-h-0 overflow-hidden">
              <h3 className="text-base md:text-lg font-semibold theme-mb-2 theme-text-card-foreground theme-font-sans theme-tracking">
                Site Map
              </h3>

              <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
                {routes.map((route, index) => (
                  <SiteMapNode
                    key={`${route.path}-${index}`}
                    route={route}
                    isLast={index === routes.length - 1}
                    appStructure={appStructure}
                    onUpdateAppStructure={handleUpdate}
                    onDeleteRoute={handleDeleteRoute}
                    onAddSegment={handleAddSegment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between theme-mb-2 theme-gap-2">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="layouts" className="flex-1 sm:flex-none text-xs md:text-sm">Layouts</TabsTrigger>
                <TabsTrigger value="features" className="flex-1 sm:flex-none text-xs md:text-sm">Features</TabsTrigger>
              </TabsList>
              {activeTab === "layouts" && (
                <div className="flex items-center theme-gap-1 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-6 md:w-6 theme-shadow"
                    onClick={() => {
                      if (currentPageIndex > 0) {
                        setWireframeCurrentPage(currentPageIndex - 1);
                      }
                    }}
                    disabled={currentPageIndex === 0}
                    title="Previous page"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-6 md:w-6 theme-shadow"
                    onClick={() => {
                      if (currentPageIndex < availablePages.length - 1) {
                        setWireframeCurrentPage(currentPageIndex + 1);
                      }
                    }}
                    disabled={currentPageIndex === availablePages.length - 1}
                    title="Next page"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {activeTab === "features" && selectedFileId && (
                <Button
                  onClick={() => addFeature(selectedFileId)}
                  size="sm"
                  className="theme-gap-1 md:theme-gap-2 w-full sm:w-auto text-xs md:text-sm h-8 md:h-9"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4" />
                  Add Feature
                </Button>
              )}
            </div>

            <TabsContent value="layouts" className="flex-1 overflow-hidden theme-mt-0">
              <div className="flex flex-col h-full">
                <h3 className="text-xs md:text-sm font-semibold theme-text-card-foreground theme-font-sans theme-tracking theme-mb-2">
                  {currentPage && `${currentPage}`}
                </h3>
                <div className="theme-p-2 md:theme-p-3 theme-radius theme-bg-background flex-1 overflow-y-auto theme-shadow">
                  {renderNestedBoxes()}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="flex-1 overflow-hidden theme-mt-0">
              <div className="theme-p-2 md:theme-p-3 theme-radius theme-bg-background flex-1 overflow-y-auto theme-shadow h-full">
                {selectedFilePath ? (
                  <div className="flex flex-col theme-gap-3 h-full">
                    <div className="theme-mb-2">
                      <span className="text-sm theme-font-mono theme-text-muted-foreground">
                        {selectedFilePath}
                      </span>
                    </div>

                    {features.length > 0 ? (
                      <div className="flex flex-col theme-gap-3">
                        {features.map((feature) => (
                          <FeatureCard
                            key={feature.id}
                            feature={feature}
                            fileId={selectedFileId!}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center theme-py-8">
                        <span className="theme-text-muted-foreground theme-font-sans theme-tracking">
                          No features added. Click &quot;Add Feature&quot; to begin.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="theme-text-muted-foreground theme-font-sans theme-tracking">
                      Select a page.tsx or layout.tsx file to begin
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export const WireFrame = () => {
  const {
    appStructure,
    wireframeState,
    initializeWireframePages,
    setWireframeCurrentPage,
    addWireframeElement,
    removeWireframeElement,
  } = useEditorStore();

  useEffect(() => {
    initializeWireframePages();
  }, [appStructure, initializeWireframePages]);

  const { currentPageIndex, availablePages } = wireframeState;
  const currentPage = availablePages[currentPageIndex] || null;

  const layouts = currentPage
    ? findLayoutsForPagePath(appStructure, currentPage, "", true)
    : [];

  const handleAddLayoutElement = (
    layoutPath: string,
    elementType: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => {
    const layoutData = wireframeState.wireframeData.layouts[layoutPath];
    const existingElements = layoutData?.elements || [];
    const existingElement = existingElements.find(
      (el) => el.type === elementType
    );

    if (existingElement) {
      removeWireframeElement(layoutPath, "layout", existingElement.id);
    }

    const newElement: import("@/app/(editor)/layout.types").WireframeElement = {
      id: generateId(),
      type: elementType,
      label: elementType.replace("-", " "),
      config: {
        position:
          elementType === "header"
            ? "top"
            : elementType === "footer"
              ? "bottom"
              : elementType === "sidebar-left"
                ? "left"
                : "right",
      },
    };
    addWireframeElement(layoutPath, "layout", newElement);
  };

  const handleRemoveLayoutElementByType = (
    layoutPath: string,
    elementType: "header" | "footer" | "sidebar-left" | "sidebar-right"
  ) => {
    const layoutData = wireframeState.wireframeData.layouts[layoutPath];
    const existingElements = layoutData?.elements || [];
    const existingElement = existingElements.find(
      (el) => el.type === elementType
    );

    if (existingElement) {
      removeWireframeElement(layoutPath, "layout", existingElement.id);
    }
  };

  const renderNestedBoxes = () => {
    if (!currentPage) {
      return (
        <div className="text-center theme-py-8 text-[hsl(var(--muted-foreground))]">
          No pages available
        </div>
      );
    }

    if (layouts.length === 0) {
      return (
        <div
          className={cn(
            "border-2 border-dashed",
            PAGE_FILE_ICON.replace("text-", "border-"),
            "rounded theme-p-3 min-h-[200px] flex flex-col"
          )}
        />
      );
    }

    let content: JSX.Element | null = null;

    for (let i = layouts.length - 1; i >= 0; i--) {
      const colorSet = LAYOUT_COLORS[i % LAYOUT_COLORS.length];
      const layoutPath = layouts[i];
      const layoutData = wireframeState.wireframeData.layouts[layoutPath];
      const elements = layoutData?.elements || [];

      const headers = elements.filter((el) => el.type === "header");
      const footers = elements.filter((el) => el.type === "footer");
      const leftSidebars = elements.filter((el) => el.type === "sidebar-left");
      const rightSidebars = elements.filter(
        (el) => el.type === "sidebar-right"
      );

      const hasHeader = headers.length > 0;
      const hasFooter = footers.length > 0;
      const hasLeftSidebar = leftSidebars.length > 0;
      const hasRightSidebar = rightSidebars.length > 0;

      content = (
        <div
          className={cn(
            "border-2 border-dashed relative",
            colorSet.border,
            "rounded theme-p-4 min-h-[200px] flex flex-col theme-gap-4"
          )}
        >
          <LayoutInsertionButtons
            layoutPath={layoutPath}
            onAddElement={(type) => handleAddLayoutElement(layoutPath, type)}
            onRemoveElement={(type) =>
              handleRemoveLayoutElementByType(layoutPath, type)
            }
            hasHeader={hasHeader}
            hasFooter={hasFooter}
            hasLeftSidebar={hasLeftSidebar}
            hasRightSidebar={hasRightSidebar}
          />

          {headers.map((el) => (
            <WireframeElementComponent
              key={el.id}
              element={el}
              colorSet={colorSet}
            />
          ))}

          <div className="flex-1 flex theme-gap-4">
            {leftSidebars.length > 0 && (
              <div className="flex flex-col theme-gap-4">
                {leftSidebars.map((el) => (
                  <WireframeElementComponent
                    key={el.id}
                    element={el}
                    colorSet={colorSet}
                  />
                ))}
              </div>
            )}

            <div className="flex-1">{content}</div>

            {rightSidebars.length > 0 && (
              <div className="flex flex-col theme-gap-4">
                {rightSidebars.map((el) => (
                  <WireframeElementComponent
                    key={el.id}
                    element={el}
                    colorSet={colorSet}
                  />
                ))}
              </div>
            )}
          </div>

          {footers.map((el) => (
            <WireframeElementComponent
              key={el.id}
              element={el}
              colorSet={colorSet}
            />
          ))}
        </div>
      );
    }

    return content;
  };

  return (
    <div className="theme-p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center justify-between theme-mb-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
          Layout Wireframe {currentPage && `- ${currentPage}`}
        </h3>
        <div className="flex items-center theme-gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              if (currentPageIndex > 0) {
                setWireframeCurrentPage(currentPageIndex - 1);
              }
            }}
            disabled={currentPageIndex === 0}
            title="Previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              if (currentPageIndex < availablePages.length - 1) {
                setWireframeCurrentPage(currentPageIndex + 1);
              }
            }}
            disabled={currentPageIndex === availablePages.length - 1}
            title="Next page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="theme-p-4 rounded bg-[hsl(var(--muted))] flex-1">
        {renderNestedBoxes()}
      </div>
    </div>
  );
};

export const AppStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = "new-segment";
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  return (
    <div className="theme-p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[calc(100vh-200px)] flex flex-col">
      <h3 className="text-lg font-semibold theme-mb-4 text-[hsl(var(--card-foreground))]">
        App Directory Structure
      </h3>

      <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
        {appStructure.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            isLast={false}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddFile={handleAddFile}
            onAddDirectory={handleAddDirectory}
            appStructure={appStructure}
            onAddSpecificFile={handleAddSpecificFile}
            newNodeId={newNodeId}
          />
        ))}

        {appStructure.length === 0 && (
          <div className="text-center theme-py-8 text-[hsl(var(--muted-foreground))]">
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="theme-mt-6 theme-mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                appStructure={appStructure}
                onUpdateAppStructure={handleUpdate}
                onDeleteRoute={handleDeleteRoute}
                onAddSegment={handleAddSegment}
              />
            ))}

            <div className="theme-mt-2 flex items-center theme-gap-2 rounded dark:border-gray-700 ">
              <Input
                ref={routeInputRef}
                value={routeInputValue}
                onChange={(e) => setRouteInputValue(e.target.value)}
                onKeyDown={handleRouteKeyDown}
                onBlur={handleRouteSubmit}
                placeholder="Enter route path (e.g., /register/)"
                className="h-6 theme-px-2 theme-py-0 text-sm flex-1 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
