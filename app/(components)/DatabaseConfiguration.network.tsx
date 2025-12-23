"use client";

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
import { cn } from "@/lib/utils";
import {
  Background,
  Controls,
  Edge,
  Handle,
  MiniMap,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type { PrismaColumn, PrismaTable } from "./DatabaseConfiguration.types";

const POSTGRES_TYPE_OPTIONS = [
  "TEXT",
  "INTEGER",
  "BIGINT",
  "BOOLEAN",
  "TIMESTAMP WITH TIME ZONE",
  "JSONB",
  "DECIMAL",
  "DOUBLE PRECISION",
  "BYTEA",
] as const;

interface ColumnRowProps {
  column: PrismaColumn;
  table: PrismaTable;
  allTables: PrismaTable[];
  onUpdateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
}

const ColumnRow = ({
  column,
  table,
  allTables,
  onUpdateColumn,
}: ColumnRowProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(column.name);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onUpdateColumn(table.id, column.id, { name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const isRelation = column.relation !== undefined;
  const typeDisplay = column.isArray ? `${column.type}[]` : column.type;
  const optionalDisplay = column.isOptional ? "?" : "";

  return (
    <div className="flex items-center theme-px-2 theme-py-1 hover:theme-bg-accent theme-radius theme-gap-2 text-xs">
      {isEditingName && !column.isDefault ? (
        <Input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNameSubmit();
            if (e.key === "Escape") {
              setTempName(column.name);
              setIsEditingName(false);
            }
          }}
          className="h-5 theme-px-1 theme-py-0 text-xs w-24 theme-shadow"
          autoFocus
        />
      ) : (
        <span
          className={cn(
            "theme-text-foreground theme-font-mono min-w-[6rem]",
            !column.isDefault && "cursor-pointer hover:theme-bg-muted"
          )}
          onClick={() => !column.isDefault && setIsEditingName(true)}
        >
          {column.name}
        </span>
      )}

      <span className="theme-text-chart-3 theme-font-mono">
        {typeDisplay}
        {optionalDisplay}
      </span>

      {!column.isDefault && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 theme-ml-auto opacity-60 hover:opacity-100"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 theme-p-3 theme-shadow" align="end">
            <div className="flex flex-col theme-gap-3">
              <div>
                <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                  Type
                </label>
                {isRelation ? (
                  <Select
                    value={column.relation?.table || ""}
                    onValueChange={(tableId) => {
                      const targetTable = allTables.find(
                        (t) => t.id === tableId
                      );
                      if (targetTable) {
                        onUpdateColumn(table.id, column.id, {
                          type: targetTable.name,
                          relation: {
                            table: targetTable.name,
                            field: "id",
                            onDelete: column.relation?.onDelete || "Cascade",
                          },
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {allTables.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.schema}.{t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={column.type}
                    onValueChange={(type) =>
                      onUpdateColumn(table.id, column.id, { type })
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSTGRES_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <label className="text-xs theme-text-muted-foreground theme-mb-1 block">
                  Default Value
                </label>
                <Input
                  value={column.defaultValue || ""}
                  onChange={(e) =>
                    onUpdateColumn(table.id, column.id, {
                      defaultValue: e.target.value,
                    })
                  }
                  placeholder="No default"
                  className="h-7 text-xs theme-shadow"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

interface TableNodeData extends Record<string, unknown> {
  table: PrismaTable;
  allTables: PrismaTable[];
  onUpdateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<PrismaColumn>
  ) => void;
}

const TableNode = ({ data }: { data: TableNodeData }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { table, allTables, onUpdateColumn } = data;

  return (
    <div className="theme-bg-card theme-border-border theme-radius theme-shadow-lg min-w-[280px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!theme-bg-chart-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!theme-bg-chart-3"
      />

      <div className="theme-bg-accent theme-px-3 theme-py-2 flex items-center theme-gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        <span className="theme-text-foreground font-semibold text-sm">
          {table.schema}.{table.name}
        </span>
      </div>

      {isExpanded && (
        <div className="theme-p-2 max-h-[400px] overflow-y-auto">
          {table.columns.map((column) => (
            <ColumnRow
              key={column.id}
              column={column}
              table={table}
              allTables={allTables}
              onUpdateColumn={onUpdateColumn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  tableNode: TableNode,
};

export const NetworkVisualization = () => {
  const { tables, updateColumn } = useDatabaseStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableNodeData>>(
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const createNodesAndEdges = useCallback(() => {
    const newNodes: Node<TableNodeData>[] = [];
    const newEdges: Edge[] = [];

    tables.forEach((table, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const xPos = column * 400;
      const yPos = row * 300;

      newNodes.push({
        id: table.id,
        type: "tableNode",
        position: { x: xPos, y: yPos },
        data: {
          table,
          allTables: tables,
          onUpdateColumn: updateColumn,
        },
      });

      table.columns.forEach((col) => {
        if (col.relation) {
          const targetTable = tables.find(
            (t) => t.name === col.relation?.table
          );
          if (targetTable) {
            newEdges.push({
              id: `${table.id}-${col.id}-${targetTable.id}`,
              source: table.id,
              target: targetTable.id,
              sourceHandle: null,
              targetHandle: null,
              label: col.name,
              type: "smoothstep",
              animated: true,
              style: { stroke: "hsl(var(--chart-3))" },
              labelStyle: { fontSize: 10, fill: "hsl(var(--foreground))" },
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [tables, updateColumn, setNodes, setEdges]);

  useEffect(() => {
    createNodesAndEdges();
  }, [createNodesAndEdges]);

  return (
    <div className="w-full h-[calc(100vh-300px)] theme-bg-muted theme-radius theme-shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        className="theme-bg-muted"
      >
        <Background className="theme-bg-muted" />
        <Controls className="theme-bg-card theme-border-border theme-shadow" />
        <MiniMap
          className="theme-bg-card theme-border-border theme-shadow"
          nodeColor="hsl(var(--accent))"
          maskColor="rgba(0, 0, 0, 0.2)"
        />
      </ReactFlow>
    </div>
  );
};
