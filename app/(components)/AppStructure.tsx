"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/tailwind.utils";
import {
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FoldVertical,
  Plus,
  SquareStack,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FileSystemEntry = {
  id: string;
  name: string;
  type: "file" | "directory";
  children?: FileSystemEntry[];
  isExpanded?: boolean;
  isEditing?: boolean;
};

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

const generateId = () => Math.random().toString(36).substring(2, 11);

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

const SiteMapNode = ({
  route,
  depth = 0,
  isLast = false,
  darkMode,
}: {
  route: RouteEntry;
  depth?: number;
  isLast?: boolean;
  darkMode: boolean;
}) => {
  const getTreeChar = () => {
    if (depth === 0) return "";
    return isLast ? "└" : "├";
  };

  const getLinePrefix = () => {
    if (depth === 0) return "";
    const lines = [];
    for (let i = 0; i < depth - 1; i++) {
      lines.push("│   ");
    }
    return lines.join("");
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        <span
          className={cn(
            "font-mono text-sm select-none",
            darkMode ? "text-gray-500" : "text-gray-400"
          )}
        >
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>
        <span className="text-sm font-mono">{route.path}</span>
      </div>
      {route.children && route.children.length > 0 && (
        <>
          {route.children.map((child, index) => (
            <SiteMapNode
              key={child.path}
              route={child}
              depth={depth + 1}
              isLast={index === route.children!.length - 1}
              darkMode={darkMode}
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
}: {
  node: FileSystemEntry;
  depth?: number;
  isLast?: boolean;
  parentPath?: string;
  onUpdate: (id: string, updates: Partial<FileSystemEntry>) => void;
  onDelete: (id: string) => void;
  onAddFile: (parentId: string) => void;
  onAddDirectory: (parentId: string) => void;
}) => {
  const [localName, setLocalName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const { darkMode } = useEditorStore();

  useEffect(() => {
    if (node.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [node.isEditing]);

  const handleNameSubmit = () => {
    if (localName.trim()) {
      onUpdate(node.id, { name: localName.trim(), isEditing: false });
    } else {
      setLocalName(node.name);
      onUpdate(node.id, { isEditing: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
    if (e.key === "Escape") {
      setLocalName(node.name);
      onUpdate(node.id, { isEditing: false });
    }
  };

  const toggleExpand = () => {
    if (node.type === "directory") {
      onUpdate(node.id, { isExpanded: !node.isExpanded });
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
      lines.push("│   ");
    }
    return lines.join("");
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 hover:bg-accent/50 rounded px-1 py-0.5",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        <span
          className={cn(
            "font-mono text-sm select-none",
            darkMode ? "text-gray-500" : "text-gray-400"
          )}
        >
          {getLinePrefix()}
          {getTreeChar()}
          {depth > 0 && "─ "}
        </span>

        <button
          onClick={toggleExpand}
          className="flex items-center gap-1 flex-1 min-w-0"
        >
          {node.type === "directory" ? (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
          )}

          {node.isEditing ? (
            <Input
              ref={inputRef}
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              className="h-6 px-2 py-0 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-sm truncate cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(node.id, { isEditing: true });
              }}
            >
              {node.name}
            </span>
          )}
        </button>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddFile(node.id)}
            title="Add file"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddDirectory(node.id)}
            title="Add directory"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onDelete(node.id)}
            title="Delete"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
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
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddFile={onAddFile}
              onAddDirectory={onAddDirectory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppStructure = () => {
  const { darkMode } = useEditorStore();
  const [fileSystem, setFileSystem] = useState<FileSystemEntry[]>([
    {
      id: generateId(),
      name: "app",
      type: "directory",
      isExpanded: true,
      children: [
        {
          id: generateId(),
          name: "(auth)",
          type: "directory",
          isExpanded: false,
          children: [
            {
              id: generateId(),
              name: "login",
              type: "directory",
              isExpanded: false,
              children: [{ id: generateId(), name: "page.tsx", type: "file" }],
            },
            {
              id: generateId(),
              name: "register",
              type: "directory",
              isExpanded: false,
              children: [{ id: generateId(), name: "page.tsx", type: "file" }],
            },
          ],
        },
        {
          id: generateId(),
          name: "api",
          type: "directory",
          isExpanded: false,
          children: [],
        },
        { id: generateId(), name: "layout.tsx", type: "file" },
        { id: generateId(), name: "page.tsx", type: "file" },
      ],
    },
  ]);

  const updateNode = (
    nodes: FileSystemEntry[],
    id: string,
    updates: Partial<FileSystemEntry>
  ): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNode(node.children, id, updates),
        };
      }
      return node;
    });
  };

  const deleteNode = (
    nodes: FileSystemEntry[],
    id: string
  ): FileSystemEntry[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        if (node.children) {
          return {
            ...node,
            children: deleteNode(node.children, id),
          };
        }
        return node;
      });
  };

  const addNode = (
    nodes: FileSystemEntry[],
    parentId: string,
    newNode: FileSystemEntry
  ): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        const children = node.children || [];
        return {
          ...node,
          children: [...children, newNode],
          isExpanded: true,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addNode(node.children, parentId, newNode),
        };
      }
      return node;
    });
  };

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    setFileSystem((prev) => updateNode(prev, id, updates));
  };

  const handleDelete = (id: string) => {
    setFileSystem((prev) => deleteNode(prev, id));
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
      isEditing: true,
    };
    setFileSystem((prev) => addNode(prev, parentId, newFile));
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      isEditing: true,
      children: [],
      isExpanded: false,
    };
    setFileSystem((prev) => addNode(prev, parentId, newDir));
  };

  const collapseAll = (nodes: FileSystemEntry[]): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.type === "directory") {
        return {
          ...node,
          isExpanded: false,
          children: node.children ? collapseAll(node.children) : [],
        };
      }
      return node;
    });
  };

  const expandAll = (nodes: FileSystemEntry[]): FileSystemEntry[] => {
    return nodes.map((node) => {
      if (node.type === "directory") {
        return {
          ...node,
          isExpanded: true,
          children: node.children ? expandAll(node.children) : [],
        };
      }
      return node;
    });
  };

  const hasExpandedDirectories = (nodes: FileSystemEntry[]): boolean => {
    return nodes.some((node) => {
      if (node.type === "directory") {
        if (node.isExpanded) return true;
        if (node.children) return hasExpandedDirectories(node.children);
      }
      return false;
    });
  };

  const routes = generateRoutesFromFileSystem(fileSystem);

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          App Directory Structure
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const isExpanded = hasExpandedDirectories(fileSystem);
            if (isExpanded) {
              setFileSystem(collapseAll(fileSystem));
            } else {
              setFileSystem(expandAll(fileSystem));
            }
          }}
          title={hasExpandedDirectories(fileSystem) ? "Collapse all" : "Expand all"}
        >
          {hasExpandedDirectories(fileSystem) ? (
            <FoldVertical className="h-4 w-4" />
          ) : (
            <SquareStack className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          "font-mono text-sm",
          darkMode ? "bg-gray-950" : "bg-gray-50",
          "p-3 rounded overflow-x-auto"
        )}
      >
        {fileSystem.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            isLast={index === fileSystem.length - 1}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddFile={handleAddFile}
            onAddDirectory={handleAddDirectory}
          />
        ))}
        {fileSystem.length === 0 && (
          <div
            className={cn(
              "text-center py-8",
              darkMode ? "text-gray-500" : "text-gray-400"
            )}
          >
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="mt-6 mb-4">
            <h3
              className={cn(
                "text-lg font-semibold",
                darkMode ? "text-gray-200" : "text-gray-800"
              )}
            >
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div
            className={cn(
              "font-mono text-sm",
              darkMode ? "bg-gray-950" : "bg-gray-50",
              "p-3 rounded overflow-x-auto"
            )}
          >
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                darkMode={darkMode}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
