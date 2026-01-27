"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
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
import { Textarea } from "@/components/editor/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { cn } from "@/lib/utils";
import { generateDefaultFunctionName } from "@/lib/feature.utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FunctionNameSelect = ({
  functionName,
  utilFilePath,
  availableFunctions,
  onFunctionNameChange,
  onReset,
}: {
  functionName: string;
  utilFilePath: string;
  availableFunctions: string[];
  onFunctionNameChange: (name: string) => void;
  onReset: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(functionName);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempName(functionName);
  }, [functionName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onFunctionNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
    if (e.key === "Escape") {
      setTempName(functionName);
      setIsEditing(false);
    }
  };

  const uniqueAvailableFunctions = Array.from(new Set(availableFunctions));

  return (
    <div className="flex items-center theme-gap-1">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={handleKeyDown}
          className="h-7 theme-px-2 text-xs theme-shadow theme-font-mono flex-1"
        />
      ) : (
        <div
          className="border theme-border-border rounded theme-bg-background flex-1 cursor-pointer hover:theme-bg-accent transition-colors"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-xs theme-font-mono theme-text-foreground hover:underline theme-px-2 theme-py-1.5 inline-block">
            {functionName || "Function name"}
          </span>
        </div>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 theme-p-2 theme-shadow" align="start">
          <div className="flex flex-col theme-gap-1">
            {uniqueAvailableFunctions.length > 0 && (
              <>
                {uniqueAvailableFunctions.map((fn) => (
                  <Button
                    key={fn}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs theme-font-mono"
                    onClick={() => {
                      onFunctionNameChange(fn);
                      setIsOpen(false);
                    }}
                  >
                    {fn}
                  </Button>
                ))}
                <div className="theme-border-border border-t theme-my-1" />
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs"
              onClick={() => {
                setIsEditing(true);
                setIsOpen(false);
              }}
            >
              <Plus className="h-3 w-3 theme-mr-1" />
              Add new function...
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0"
        onClick={onReset}
        title="Reset to default name"
      >
        <RotateCcw className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};

export const InlineFeatureCard = ({
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
    getUtilFileFunctions,
    setFunctionForUtilFile,
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
    e.stopPropagation();
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
    const linkedFile = feature.linkedFiles?.[fileType];
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
    if (typeof customName === "object") {
      return customName.name;
    }
    if (typeof customName === "string") {
      return customName;
    }
    return generateDefaultFunctionName(feature.title || "Untitled", fileType);
  };

  const handleFunctionNameChange = (
    fileType: UserExperienceFileType,
    newName: string
  ) => {
    setFunctionForUtilFile(fileId, feature.id, fileType, newName);
  };

  const handleResetFunctionName = (fileType: UserExperienceFileType) => {
    const defaultName = generateDefaultFunctionName(feature.title || "Untitled", fileType);
    setFunctionForUtilFile(fileId, feature.id, fileType, defaultName);
  };

  return (
    <div className="theme-bg-muted/50 theme-radius theme-p-2 theme-border-border border">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-between theme-gap-2 cursor-pointer hover:theme-bg-accent/50 transition-colors theme-radius theme-p-1 -theme-m-1"
                onClick={onToggleCollapse}
              >
                <div className="text-base font-semibold theme-text-foreground truncate">
                  {feature.title || "Untitled"}
                </div>
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
              </div>
            </TooltipTrigger>
            {feature.description && (
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-base font-semibold">{feature.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <div className="flex items-start justify-between theme-gap-2 theme-mb-1">
            <Input
              ref={titleInputRef}
              value={feature.title}
              onChange={(e) =>
                updateFeature(fileId, feature.id, { title: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="h-6 text-base font-semibold theme-shadow flex-1"
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
                    <p className="text-base font-semibold theme-text-foreground">
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

          <Textarea
            value={feature.description}
            onChange={(e) =>
              updateFeature(fileId, feature.id, { description: e.target.value })
            }
            onKeyDown={(e) => e.stopPropagation()}
            className="text-xs theme-shadow min-h-[40px] resize-none theme-mb-2"
            placeholder="Feature description"
            rows={2}
          />

          <div className="flex flex-col theme-gap-2">
            {fileTypes.map((fileType) => {
              const linkedFile = feature.linkedFiles?.[fileType];
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
                    <span className="text-base font-semibold theme-text-foreground">
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
                      <div onClick={(e) => e.stopPropagation()}>
                        <FunctionNameSelect
                          functionName={functionName}
                          utilFilePath={linkedFile || ""}
                          availableFunctions={linkedFile ? getUtilFileFunctions(linkedFile) : []}
                          onFunctionNameChange={(name) => handleFunctionNameChange(fileType, name)}
                          onReset={() => handleResetFunctionName(fileType)}
                        />
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
                            className="text-base font-semibold theme-text-muted-foreground theme-px-2 theme-py-1 theme-bg-muted/50 theme-radius cursor-pointer hover:theme-bg-accent/50 transition-colors border border-dashed theme-border-muted-foreground/30 flex-1"
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

export const FeatureCard = ({
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
    e.stopPropagation();
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
                <span className="text-base font-semibold theme-text-foreground">
                  {feature.title}
                </span>
              </div>
              <div className="text-base font-semibold theme-text-muted-foreground theme-truncate">
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
                  <p className="text-base font-semibold theme-text-foreground">
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
                <div className="text-base font-semibold theme-font-mono theme-text-muted-foreground capitalize theme-mb-1">
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
                  <div className="text-base font-semibold theme-text-muted-foreground/50">
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
          className="h-7 text-base font-semibold theme-shadow"
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
              <p className="text-base font-semibold theme-text-foreground">
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
          <label className="text-base font-semibold theme-text-muted-foreground theme-mb-1 block">
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
              <div className="text-base font-semibold theme-font-mono theme-text-muted-foreground capitalize theme-mb-1">
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
                <div className="text-base font-semibold theme-text-muted-foreground/50">
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
