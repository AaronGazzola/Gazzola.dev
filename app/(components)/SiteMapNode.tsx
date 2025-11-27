"use client";

import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Ellipsis, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScreenSize } from "./AppStructure.hooks";
import { RouteEntry } from "./AppStructure.types";
import { findFileSystemEntryForPath, validateSegmentName } from "./AppStructure.utils";

export const SiteMapNode = ({
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
