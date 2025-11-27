"use client";

import { Button } from "@/components/editor/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/editor/ui/collapsible";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, List, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";

export const EnumsCollapsible = ({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { addEnum, getAllEnums } = useDatabaseStore();
  const enums = getAllEnums();
  const [isAddingEnum, setIsAddingEnum] = useState(false);
  const [newEnumName, setNewEnumName] = useState("");
  const [expandedEnumId, setExpandedEnumId] = useState<string | null>(null);
  const newEnumInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingEnum && newEnumInputRef.current) {
      newEnumInputRef.current.focus();
    }
  }, [isAddingEnum]);

  const handleAddEnum = () => {
    if (newEnumName.trim()) {
      addEnum(newEnumName.trim());
      setNewEnumName("");
    }
    setIsAddingEnum(false);
  };

  const handleEnumToggle = (enumId: string) => {
    if (expandedEnumId === enumId) {
      setExpandedEnumId(null);
    } else {
      setExpandedEnumId(enumId);
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div
        className="theme-bg-secondary/50 theme-radius theme-p-2 cursor-pointer border-l-4 border-l-amber-500/70"
        onClick={onToggle}
      >
        <div className="flex items-center theme-gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <List className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-base font-semibold theme-font-mono theme-text-foreground flex-1">
            Enums
          </span>
          <span className="text-sm theme-text-muted-foreground">
            {enums.length} {enums.length === 1 ? "enum" : "enums"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingEnum(true);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col theme-gap-2 theme-ml-4 theme-mt-2">
          {enums.length === 0 && !isAddingEnum && (
            <div className="flex items-center theme-gap-2 theme-text-muted-foreground theme-p-4">
              <p className="text-base font-semibold theme-font-sans theme-tracking">
                No enums defined
              </p>
            </div>
          )}
          {enums.map((enumItem) => (
            <EnumItem
              key={enumItem.id}
              enumItem={enumItem}
              isExpanded={expandedEnumId === enumItem.id}
              onToggle={() => handleEnumToggle(enumItem.id)}
            />
          ))}
          {isAddingEnum && (
            <div className="theme-bg-background theme-radius theme-p-2 border theme-border-border">
              <Input
                ref={newEnumInputRef}
                value={newEnumName}
                onChange={(e) => setNewEnumName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddEnum();
                  if (e.key === "Escape") {
                    setIsAddingEnum(false);
                    setNewEnumName("");
                  }
                }}
                onBlur={handleAddEnum}
                placeholder="Enum name"
                className="h-7 theme-px-2 text-base theme-shadow theme-font-mono"
              />
            </div>
          )}
          {!isAddingEnum && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingEnum(true)}
              className="h-7 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm w-fit"
            >
              <Plus className="h-3 w-3" />
              Add enum
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const EnumItem = ({
  enumItem,
  isExpanded,
  onToggle,
}: {
  enumItem: import("./DatabaseConfiguration.types").PrismaEnum;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const {
    deleteEnum,
    updateEnumName,
    addEnumValue,
  } = useDatabaseStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(enumItem.name);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      updateEnumName(enumItem.id, tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      addEnumValue(enumItem.id, newValue.trim());
      setNewValue("");
    }
    setIsAddingValue(false);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn(isExpanded && "border theme-border-chart-4 theme-radius theme-p-1")}>
      <div
        className="theme-bg-background theme-radius theme-p-2 border theme-border-border cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center theme-gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {isEditingName ? (
            <Input
              ref={nameInputRef}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setTempName(enumItem.name);
                  setIsEditingName(false);
                }
              }}
              className="h-7 theme-px-2 text-base w-fit theme-shadow theme-font-mono flex-1"
            />
          ) : (
            <>
              <span
                className="text-base theme-font-mono theme-text-foreground cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {enumItem.name}
              </span>
              <span className="flex-1" />
            </>
          )}
          <span className="text-sm theme-text-muted-foreground">
            {enumItem.values.length} {enumItem.values.length === 1 ? "value" : "values"}
          </span>
          <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-60 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
              <div className="flex flex-col theme-gap-2">
                <p className="text-lg font-semibold theme-text-foreground">
                  Delete enum &quot;{enumItem.name}&quot;?
                </p>
                <div className="flex theme-gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteEnum(enumItem.id);
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
      <CollapsibleContent>
        <div className="flex flex-col theme-gap-1 theme-mt-1 theme-ml-8 theme-p-2 theme-radius theme-bg-background">
          {enumItem.values.map((value) => (
            <EnumValueItem
              key={value.id}
              enumId={enumItem.id}
              value={value}
            />
          ))}
          {isAddingValue ? (
            <Input
              autoFocus
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddValue();
                if (e.key === "Escape") {
                  setIsAddingValue(false);
                  setNewValue("");
                }
              }}
              onBlur={handleAddValue}
              placeholder="Value"
              className="h-7 theme-px-2 text-sm theme-shadow theme-font-mono"
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingValue(true)}
              className="h-6 theme-gap-1 theme-text-muted-foreground hover:theme-text-foreground theme-font-mono text-sm w-fit"
            >
              <Plus className="h-3 w-3" />
              Add value
            </Button>
          )}
        </div>
      </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const EnumValueItem = ({
  enumId,
  value,
}: {
  enumId: string;
  value: import("./DatabaseConfiguration.types").PrismaEnumValue;
}) => {
  const { deleteEnumValue, updateEnumValue } = useDatabaseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.value);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (tempValue.trim()) {
      updateEnumValue(enumId, value.id, tempValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center theme-gap-2 theme-bg-muted theme-radius theme-px-2 theme-py-1">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") {
              setTempValue(value.value);
              setIsEditing(false);
            }
          }}
          className="h-6 theme-px-2 text-sm theme-shadow theme-font-mono flex-1"
        />
      ) : (
        <span
          className="text-sm theme-font-mono theme-text-foreground cursor-pointer hover:underline flex-1"
          onClick={() => setIsEditing(true)}
        >
          {value.value}
        </span>
      )}
      <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 opacity-60 hover:opacity-100">
            <Trash2 className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
          <div className="flex flex-col theme-gap-2">
            <p className="text-lg font-semibold theme-text-foreground">
              Delete value &quot;{value.value}&quot;?
            </p>
            <div className="flex theme-gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteEnumValue(enumId, value.id);
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
  );
};
