"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import {
  Feature,
  FileSystemEntry,
  UserExperienceFileType,
} from "@/app/(editor)/layout.types";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Textarea } from "@/components/editor/ui/textarea";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { getBrowserAPI } from "@/lib/env.utils";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  File,
  Folder,
  FolderOpen,
  LayoutTemplate,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

type ScreenSize = "xs" | "sm" | "md" | "lg";

const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg");

  useEffect(() => {
    const window = getBrowserAPI(() => globalThis.window);
    if (!window) return;

    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("xs");
      else if (width < 768) setScreenSize("sm");
      else if (width < 1024) setScreenSize("md");
      else setScreenSize("lg");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const PAGE_FILE_ICON = "theme-text-chart-4";

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
    border: "theme-border-destructive",
    icon: "theme-text-destructive",
  },
  {
    border: "theme-border-primary",
    icon: "theme-text-primary",
  },
];

const generateDefaultFunctionName = (
  featureTitle: string,
  fileType: UserExperienceFileType
): string => {
  const pascalCase = featureTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);

  switch (fileType) {
    case "stores":
      return `use${pascalCase}Store`;
    case "hooks":
      return `use${pascalCase}`;
    case "actions":
      return `${camelCase}Action`;
    case "types":
      return `${pascalCase}Data`;
  }
};

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
    conditionalLog(
      { message: "No selected file path", selectedFilePath, fileType },
      { label: LOG_LABELS.APP_STRUCTURE }
    );
    return [];
  }

  const selectedDirectory = selectedFilePath.substring(
    0,
    selectedFilePath.lastIndexOf("/")
  );

  const qualifyingFiles: string[] = [];

  const isAncestorOrSameDirectory = (
    fileDir: string,
    selectedDir: string
  ): boolean => {
    if (fileDir === selectedDir) return true;

    if (selectedDir.startsWith(fileDir + "/")) return true;

    return false;
  };

  const traverseStructure = (
    entries: FileSystemEntry[],
    currentPath: string = ""
  ) => {
    for (const entry of entries) {
      const entryPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (entry.type === "file" && isQualifyingFile(entry.name, fileType)) {
        const fileDirectory = entryPath.substring(
          0,
          entryPath.lastIndexOf("/")
        );
        const isQualified = isAncestorOrSameDirectory(
          fileDirectory,
          selectedDirectory
        );

        conditionalLog(
          {
            fileName: entry.name,
            entryPath,
            fileDirectory,
            selectedDirectory,
            isQualified,
            fileType,
          },
          { label: LOG_LABELS.APP_STRUCTURE }
        );

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

  conditionalLog(
    {
      message: "Qualifying files result",
      selectedFilePath,
      selectedDirectory,
      fileType,
      qualifyingFiles,
      totalQualifying: qualifyingFiles.length,
    },
    { label: LOG_LABELS.APP_STRUCTURE }
  );

  return qualifyingFiles;
};

const InlineFeatureCard = ({
  feature,
  fileId,
  appStructure,
  filePath,
  isCollapsed,
  onToggleCollapse,
}: {
  feature: Feature;
  fileId: string;
  appStructure: FileSystemEntry[];
  filePath: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const {
    updateFeature,
    removeFeature,
    unlinkFeatureFile,
    setFeatureFileSelection,
    setSelectedFile,
    clearFeatureFileSelection,
    featureFileSelection,
  } = useEditorStore();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expandedUtilType, setExpandedUtilType] =
    useState<UserExperienceFileType | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCollapsed && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isCollapsed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  const fileTypes: UserExperienceFileType[] = [
    "stores",
    "hooks",
    "actions",
    "types",
  ];

  const getUtilLabel = (fileType: UserExperienceFileType): string => {
    switch (fileType) {
      case "stores":
        return "Store";
      case "hooks":
        return "Hook";
      case "actions":
        return "Action";
      case "types":
        return "Type";
    }
  };

  const handlePlaceholderClick = (fileType: UserExperienceFileType) => {
    const linkedFile = feature.linkedFiles[fileType];
    conditionalLog(
      {
        message: "InlineFeatureCard: handlePlaceholderClick called",
        fileType,
        fileId,
        featureId: feature.id,
        filePath,
        linkedFile,
      },
      { label: LOG_LABELS.APP_STRUCTURE }
    );

    if (linkedFile) {
      setSelectedFile(linkedFile, "");
      setFeatureFileSelection(fileId, feature.id, fileType);
    } else {
      setSelectedFile(filePath, fileId);
      setFeatureFileSelection(fileId, feature.id, fileType);
    }
  };

  const handleUnlinkFile = (
    fileType: UserExperienceFileType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    unlinkFeatureFile(fileId, feature.id, fileType);
  };

  const getDefaultFunctionName = (fileType: UserExperienceFileType): string => {
    const customName = feature.functionNames?.[fileType];
    if (customName) return customName;
    return generateDefaultFunctionName(feature.title || "Untitled", fileType);
  };

  const handleFunctionNameChange = (
    fileType: UserExperienceFileType,
    newName: string
  ) => {
    updateFeature(fileId, feature.id, {
      functionNames: {
        ...feature.functionNames,
        [fileType]: newName,
      },
    });
  };

  const handleResetFunctionName = (fileType: UserExperienceFileType) => {
    const defaultName = generateDefaultFunctionName(feature.title || "Untitled", fileType);
    updateFeature(fileId, feature.id, {
      functionNames: {
        ...feature.functionNames,
        [fileType]: defaultName,
      },
    });
  };

  return (
    <div className="theme-bg-muted/50 theme-radius theme-p-2 theme-border-border border">
      {isCollapsed ? (
        <div
          className="flex items-center justify-between theme-gap-2 cursor-pointer hover:theme-bg-accent/50 transition-colors theme-radius theme-p-1 -theme-m-1"
          onClick={onToggleCollapse}
        >
          <div className="text-xs font-medium theme-text-foreground truncate">
            {feature.title || "Untitled"}
          </div>
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between theme-gap-2 theme-mb-2">
            <Input
              ref={titleInputRef}
              value={feature.title}
              onChange={(e) =>
                updateFeature(fileId, feature.id, { title: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="h-6 text-xs font-medium theme-shadow flex-1"
              placeholder="Feature title"
            />
            <div className="flex items-center theme-gap-1">
              <Popover
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-48 theme-p-2 theme-shadow"
                  align="end"
                >
                  <div className="flex flex-col theme-gap-2">
                    <p className="text-xs theme-text-foreground">
                      Delete {feature.title}?
                    </p>
                    <div className="flex theme-gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 text-xs"
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
                        className="h-6 text-xs"
                        onClick={() => setDeleteConfirmOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 flex-shrink-0"
                onClick={() => {
                  onToggleCollapse();
                  clearFeatureFileSelection();
                }}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col theme-gap-2">
            {fileTypes.map((fileType) => {
              const linkedFile = feature.linkedFiles[fileType];
              const functionName = getDefaultFunctionName(fileType);
              const isExpanded = expandedUtilType === fileType;

              return (
                <div
                  key={fileType}
                  className={cn(
                    "theme-bg-background theme-radius border transition-all",
                    isExpanded
                      ? linkedFile
                        ? "border-green-500"
                        : "border-2 border-dashed theme-border-chart-2"
                      : linkedFile
                        ? "border-green-500"
                        : "theme-border-border"
                  )}
                >
                  <div
                    className="flex items-center justify-between theme-px-2 theme-py-1.5 cursor-pointer hover:theme-bg-accent transition-colors select-none"
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedUtilType(null);
                        clearFeatureFileSelection();
                      } else {
                        setExpandedUtilType(fileType);
                        handlePlaceholderClick(fileType);
                      }
                    }}
                  >
                    <span className="text-xs font-medium theme-text-foreground">
                      {getUtilLabel(fileType)}
                    </span>
                    <div className="flex items-center theme-gap-1">
                      {linkedFile && (
                        <Check className="h-3 w-3 text-green-500" />
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="theme-px-2 theme-pb-2 theme-pt-1 flex flex-col theme-gap-2 border-t theme-border-border">
                      <div className="flex items-center theme-gap-1">
                        <Input
                          value={functionName}
                          onChange={(e) =>
                            handleFunctionNameChange(fileType, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={handleKeyDown}
                          placeholder={`Function name`}
                          className="h-7 text-xs theme-shadow theme-font-mono flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetFunctionName(fileType);
                          }}
                          title="Reset to default name"
                        >
                          <RotateCcw className="h-2.5 w-2.5" />
                        </Button>
                      </div>

                      <div className="flex items-center theme-gap-1">
                        {linkedFile ? (
                          <div
                            className="text-xs theme-font-mono theme-text-foreground theme-px-2 theme-py-1 theme-bg-muted theme-radius cursor-pointer hover:theme-bg-accent transition-colors truncate flex-1 border border-green-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceholderClick(fileType);
                            }}
                          >
                            {linkedFile.split("/").slice(-2).join("/")}
                          </div>
                        ) : (
                          <div
                            className="text-xs theme-text-muted-foreground theme-px-2 theme-py-1 theme-bg-muted/50 theme-radius cursor-pointer hover:theme-bg-accent/50 transition-colors border border-dashed theme-border-muted-foreground/30 flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceholderClick(fileType);
                            }}
                          >
                            Select a {getUtilLabel(fileType).toLowerCase()} file
                          </div>
                        )}
                        {linkedFile && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkFile(fileType, e);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const FeatureCard = ({
  feature,
  fileId,
}: {
  feature: Feature;
  fileId: string;
}) => {
  const {
    updateFeature,
    removeFeature,
    linkFeatureFile,
    unlinkFeatureFile,
    setFeatureFileSelection,
  } = useEditorStore();
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

  const fileTypes: UserExperienceFileType[] = [
    "stores",
    "hooks",
    "actions",
    "types",
  ];

  const handlePlaceholderClick = (fileType: UserExperienceFileType) => {
    setFeatureFileSelection(fileId, feature.id, fileType);
  };

  const handleUnlinkFile = (
    fileType: UserExperienceFileType,
    e: React.MouseEvent
  ) => {
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
            <Popover
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
            >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 theme-gap-2 theme-mt-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 theme-gap-2 theme-mt-3">
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

const getExistingSegmentNames = (
  entries: FileSystemEntry[],
  parentPath: string,
  currentPath: string = "",
  isRoot: boolean = false
): string[] => {
  const segmentNames: string[] = [];

  for (const entry of entries) {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        segmentNames.push(
          ...getExistingSegmentNames(entry.children, parentPath, "", false)
        );
      }
      continue;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        segmentNames.push(
          ...getExistingSegmentNames(
            entry.children,
            parentPath,
            currentPath,
            false
          )
        );
      }
      continue;
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = currentPath
        ? `${currentPath}/${entry.name}`
        : `/${entry.name}`;

      if (parentPath === newPath) {
        return entry.children
          .filter((child) => child.type === "directory")
          .map((child) => child.name);
      }

      segmentNames.push(
        ...getExistingSegmentNames(entry.children, parentPath, newPath, false)
      );
    }
  }

  return segmentNames;
};

const generateUniqueSegmentName = (
  appStructure: FileSystemEntry[],
  parentPath: string
): string => {
  const existingNames = getExistingSegmentNames(
    appStructure,
    parentPath,
    "",
    true
  );
  const baseName = "new-segment";

  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  let counter = 2;
  while (existingNames.includes(`${baseName}-${counter}`)) {
    counter++;
  }

  return `${baseName}-${counter}`;
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
  newlyAddedSegmentPath,
}: {
  route: RouteEntry;
  depth?: number;
  isLast?: boolean;
  appStructure: FileSystemEntry[];
  onUpdateAppStructure: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDeleteRoute: (routePath: string) => void;
  onAddSegment: (parentPath: string) => void;
  ancestorIsLast?: boolean[];
  newlyAddedSegmentPath?: string | null;
}) => {
  const screenSize = useScreenSize();
  const [editingSegmentIndex, setEditingSegmentIndex] = useState<number | null>(
    null
  );
  const [tempValue, setTempValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSegmentIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSegmentIndex]);

  useEffect(() => {
    if (newlyAddedSegmentPath && route.path === newlyAddedSegmentPath) {
      const pathSegments =
        route.path === "/" ? ["/"] : route.path.split("/").filter(Boolean);
      const lastSegmentIndex = pathSegments.length - 1;
      setEditingSegmentIndex(lastSegmentIndex);
      setTempValue(pathSegments[lastSegmentIndex]);
    }
  }, [newlyAddedSegmentPath, route.path]);

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
    setMenuOpen(false);
  };

  const handleAddSegment = () => {
    onAddSegment(route.path);
    setMenuOpen(false);
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

        <div className="flex items-center theme-spacing">
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 theme-shadow"
                title="Options"
              >
                <Ellipsis className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 theme-p-2 theme-shadow" align="end">
              <div className="flex flex-col theme-gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 justify-start theme-gap-2"
                  onClick={handleAddSegment}
                >
                  <Plus className="h-3 w-3" />
                  Add segment
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 justify-start theme-gap-2 theme-text-destructive hover:theme-text-destructive"
                  onClick={handleDeleteRoute}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete route
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
              newlyAddedSegmentPath={newlyAddedSegmentPath}
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

      const linkedFile = feature.linkedFiles[featureFileSelection.fileType];
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
          <div className="text-sm font-medium theme-text-muted-foreground theme-mb-2">
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
              <div className="text-xs theme-text-muted-foreground text-center theme-py-2">
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

      {node.type === "directory" && node.isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
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

export const LayoutAndStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    featureFileSelection,
    selectedFilePath,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const [templatePopoverOpen, setTemplatePopoverOpen] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = APP_STRUCTURE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setAppStructure(template.structure);
    }
    setTemplatePopoverOpen(false);
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
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
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
    <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
      <div className="flex flex-col theme-gap-2 md:theme-gap-4 min-h-[calc(100vh-800px)]">
        <div className="flex flex-col flex-[2] min-h-0 overflow-hidden">
          <div className="flex items-center justify-between theme-mb-2">
            <h3 className="text-base md:text-lg font-semibold theme-text-card-foreground theme-font-sans theme-tracking">
              App Directory
            </h3>
            <Popover
              open={templatePopoverOpen}
              onOpenChange={setTemplatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 theme-shadow"
                  title="Select template"
                >
                  <LayoutTemplate className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 theme-p-2 theme-shadow"
                align="end"
              >
                <div className="flex flex-col theme-gap-1">
                  <div className="theme-px-2 theme-py-1 text-xs font-semibold theme-text-muted-foreground">
                    Templates
                  </div>
                  {APP_STRUCTURE_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant={
                        selectedTemplate === template.id ? "secondary" : "ghost"
                      }
                      size="sm"
                      className="justify-start theme-gap-2 w-full"
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <LayoutTemplate className="h-4 w-4" />
                      <span>{template.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
            {appStructure.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                isLast={index === appStructure.length - 1}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAddFile={handleAddFile}
                onAddDirectory={handleAddDirectory}
                appStructure={appStructure}
                onAddSpecificFile={handleAddSpecificFile}
                newNodeId={newNodeId}
                qualifyingFilePaths={qualifyingFilePaths}
                expandedFileId={expandedFileId}
                setExpandedFileId={setExpandedFileId}
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
                  newlyAddedSegmentPath={newlyAddedSegmentPath}
                />
              ))}
            </div>
          </div>
        )}
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
    featureFileSelection,
    selectedFilePath,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

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
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
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
            qualifyingFilePaths={qualifyingFilePaths}
            expandedFileId={expandedFileId}
            setExpandedFileId={setExpandedFileId}
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
                newlyAddedSegmentPath={newlyAddedSegmentPath}
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
