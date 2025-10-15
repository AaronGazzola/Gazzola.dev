"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { Button } from "@/components/editor/ui/button";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Textarea } from "@/components/editor/ui/textarea";
import { cn } from "@/lib/tailwind.utils";
import { File, Folder, FolderOpen, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUserExperienceStore } from "./UserExperience.stores";
import { Feature, UserExperienceFileType } from "./UserExperience.types";

const generateId = () => Math.random().toString(36).substring(2, 11);

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

const TreeNode = ({
  node,
  depth = 0,
  isLast = false,
  parentPath = "",
  ancestorIsLast = [],
  appStructure,
}: {
  node: FileSystemEntry;
  depth?: number;
  isLast?: boolean;
  parentPath?: string;
  ancestorIsLast?: boolean[];
  appStructure: FileSystemEntry[];
}) => {
  const { addAppStructureNodeAfterSibling } = useEditorStore();
  const { setSelectedFile, addUtilityFile, getUtilityFiles } =
    useUserExperienceStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isPageFile = node.type === "file" && node.name === "page.tsx";
  const isLayoutFile = node.type === "file" && node.name === "layout.tsx";
  const isClickableFile = isPageFile || isLayoutFile;

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

  const getFileIconColor = (): string => {
    if (isPageFile) {
      return "text-[var(--theme-chart-1)]";
    }
    if (isLayoutFile) {
      return "text-[var(--theme-chart-5)]";
    }
    return "";
  };

  const handleFileClick = () => {
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
          isClickableFile && "cursor-pointer hover:theme-bg-primary"
        )}
        onClick={handleFileClick}
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
                getFileIconColor()
              )}
            />
          )}

          <span className="text-sm truncate theme-text-foreground">
            {node.name}
          </span>

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
      </div>

      {node.type === "directory" && node.isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              parentPath={`${parentPath}/${node.name}`}
              ancestorIsLast={[...ancestorIsLast, isLast]}
              appStructure={appStructure}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({
  feature,
  fileId,
  utilityFiles,
}: {
  feature: Feature;
  fileId: string;
  utilityFiles: UserExperienceFileType[];
}) => {
  const { updateFeature, removeFeature } = useUserExperienceStore();
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

  if (!feature.isEditing) {
    return (
      <div
        className="theme-bg-muted theme-radius theme-p-3 cursor-pointer hover:theme-bg-accent transition-colors"
        onClick={handleEdit}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center theme-gap-2 theme-mb-1">
              <span className="text-sm font-medium theme-text-foreground">
                {feature.title}
              </span>
              {utilityFiles.length > 0 && (
                <div className="flex items-center theme-gap-1">
                  {utilityFiles
                    .filter((fileType) => feature.fileTypes[fileType])
                    .map((fileType) => (
                      <span
                        key={fileType}
                        className="text-xs theme-font-mono theme-text-chart-3"
                      >
                        {fileType}
                      </span>
                    ))}
                </div>
              )}
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

        {utilityFiles.length > 0 && (
          <div>
            <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
              File Types
            </label>
            <div className="flex flex-col theme-gap-2">
              {utilityFiles.map((fileType) => (
                <div key={fileType} className="flex items-center theme-gap-2">
                  <Checkbox
                    checked={feature.fileTypes[fileType] || false}
                    onCheckedChange={(checked) => {
                      updateFeature(fileId, feature.id, {
                        fileTypes: {
                          ...feature.fileTypes,
                          [fileType]: checked === true,
                        },
                      });
                    }}
                  />
                  <span className="text-sm theme-text-foreground capitalize">
                    {fileType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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

export const UserExperience = () => {
  const { appStructure } = useEditorStore();
  const {
    selectedFilePath,
    selectedFileId,
    getUtilityFiles,
    getFeatures,
    addFeature,
  } = useUserExperienceStore();

  const utilityFiles = selectedFileId ? getUtilityFiles(selectedFileId) : [];
  const features = selectedFileId ? getFeatures(selectedFileId) : [];

  return (
    <div className="theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking">
      <div className="grid grid-cols-[minmax(400px,2fr)_minmax(400px,3fr)] theme-gap-4 min-h-[calc(100vh-800px)] max-xl:grid-cols-1">
        <div className="flex flex-col theme-gap-4 h-full overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between theme-mb-2">
              <h3 className="text-lg font-semibold theme-text-card-foreground theme-font-sans theme-tracking">
                App Structure
              </h3>
            </div>

            <div className="theme-font-mono text-base theme-bg-background theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
              {appStructure.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isLast={false}
                  appStructure={appStructure}
                />
              ))}

              {appStructure.length === 0 && (
                <div className="text-center theme-py-8 theme-text-muted-foreground theme-font-sans theme-tracking">
                  No app structure defined. Visit the App Structure page to
                  create one.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between theme-mb-2">
            <h3 className="text-lg font-semibold theme-text-card-foreground theme-font-sans theme-tracking">
              Features
            </h3>
            {selectedFileId && (
              <Button
                onClick={() => addFeature(selectedFileId)}
                size="sm"
                className="theme-gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </Button>
            )}
          </div>
          <div className="theme-p-3 theme-radius theme-bg-background flex-1 overflow-y-auto theme-shadow">
            {selectedFilePath ? (
              <div className="flex flex-col theme-gap-3">
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
                        utilityFiles={utilityFiles}
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
        </div>
      </div>
    </div>
  );
};
