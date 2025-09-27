"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import {
  WireframeElement,
  WireframeElementType,
} from "@/app/(editor)/layout.types";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwind.utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Layout,
  Menu,
  Plus,
  Sidebar,
  Table,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const generateId = () => Math.random().toString(36).substring(2, 11);

const LAYOUT_COLORS = [
  {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-300 dark:border-green-700",
    icon: "text-green-500",
    text: "text-green-800 dark:text-green-200",
  },
  {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    icon: "text-purple-500",
    text: "text-purple-800 dark:text-purple-200",
  },
  {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-300 dark:border-orange-700",
    icon: "text-orange-500",
    text: "text-orange-800 dark:text-orange-200",
  },
  {
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    icon: "text-red-500",
    text: "text-red-800 dark:text-red-200",
  },
  {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    border: "border-indigo-300 dark:border-indigo-700",
    icon: "text-indigo-500",
    text: "text-indigo-800 dark:text-indigo-200",
  },
  {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    border: "border-cyan-300 dark:border-cyan-700",
    icon: "text-cyan-500",
    text: "text-cyan-800 dark:text-cyan-200",
  },
];

const PAGE_COLOR = {
  bg: "bg-slate-100 dark:bg-slate-900/30",
  border: "border-slate-300 dark:border-slate-700",
  icon: "text-slate-500",
  text: "text-slate-800 dark:text-slate-200",
};

const ELEMENT_TYPES: {
  type: WireframeElementType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "layout" | "content";
}[] = [
  { type: "header", label: "Header", icon: Layout, category: "layout" },
  {
    type: "sidebar-left",
    label: "Left Sidebar",
    icon: Sidebar,
    category: "layout",
  },
  {
    type: "sidebar-right",
    label: "Right Sidebar",
    icon: Sidebar,
    category: "layout",
  },
  { type: "footer", label: "Footer", icon: Layout, category: "layout" },
  { type: "form", label: "Form", icon: User, category: "content" },
  { type: "table", label: "Table", icon: Table, category: "content" },
  { type: "tabs", label: "Tabs", icon: Menu, category: "content" },
  {
    type: "accordion",
    label: "Accordion",
    icon: ChevronDown,
    category: "content",
  },
];


const WireframeElementComponent = ({
  element,
  onDelete,
}: {
  element: WireframeElement;
  onDelete: () => void;
}) => {
  const getElementIcon = () => {
    const elementType = ELEMENT_TYPES.find((t) => t.type === element.type);
    const Icon = elementType?.icon || FileText;
    return <Icon className="w-3 h-3" />;
  };

  const getElementSize = () => {
    const { width = "md", height = "auto" } = element.config;
    let className =
      "border-2 border-dashed border-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2 relative group ";

    if (element.type === "header" || element.type === "footer") {
      className += "w-full ";
    } else if (
      element.type === "sidebar-left" ||
      element.type === "sidebar-right"
    ) {
      className += "w-20 ";
    } else {
      switch (width) {
        case "sm":
          className += "w-16 ";
          break;
        case "md":
          className += "w-24 ";
          break;
        case "lg":
          className += "w-32 ";
          break;
        case "xl":
          className += "w-40 ";
          break;
        case "full":
          className += "w-full ";
          break;
      }
    }

    if (element.type === "sidebar-left" || element.type === "sidebar-right") {
      className += "h-full min-h-24";
    } else {
      switch (height) {
        case "sm":
          className += "h-8";
          break;
        case "md":
          className += "h-12";
          break;
        case "lg":
          className += "h-16";
          break;
        case "xl":
          className += "h-20";
          break;
        case "auto":
          className += "h-auto min-h-8";
          break;
      }
    }

    return className;
  };

  return (
    <div className={getElementSize()}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {getElementIcon()}
          <span className="text-xs font-mono">{element.label}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onDelete}
        >
          <Trash2 className="h-2 w-2 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

const WireframeLayoutContainer = ({
  colorIndex,
  children,
  elements,
  onRemoveElement,
  isSelected,
  onSelect,
}: {
  colorIndex: number;
  children: React.ReactNode;
  elements: WireframeElement[];
  onRemoveElement: (elementId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const colorSet = LAYOUT_COLORS[colorIndex % LAYOUT_COLORS.length];

  const headers = elements.filter((el) => el.type === "header");
  const footers = elements.filter((el) => el.type === "footer");
  const leftSidebars = elements.filter((el) => el.type === "sidebar-left");
  const rightSidebars = elements.filter((el) => el.type === "sidebar-right");

  return (
    <div
      className={cn(
        colorSet.bg,
        "border-2",
        isSelected ? "border-solid" : "border-dashed",
        colorSet.border,
        "rounded p-3 cursor-pointer h-full flex flex-col"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {headers.map((header) => (
        <div key={header.id} className="mb-2">
          <WireframeElementComponent
            element={header}
            onDelete={() => onRemoveElement(header.id)}
          />
        </div>
      ))}

      <div className="flex gap-2 flex-1">
        {leftSidebars.map((sidebar) => (
          <div key={sidebar.id} className="flex-shrink-0 h-full">
            <WireframeElementComponent
              element={sidebar}
              onDelete={() => onRemoveElement(sidebar.id)}
            />
          </div>
        ))}

        <div className="flex-1 h-full">{children}</div>

        {rightSidebars.map((sidebar) => (
          <div key={sidebar.id} className="flex-shrink-0 h-full">
            <WireframeElementComponent
              element={sidebar}
              onDelete={() => onRemoveElement(sidebar.id)}
            />
          </div>
        ))}
      </div>

      {footers.map((footer) => (
        <div key={footer.id} className="mt-2">
          <WireframeElementComponent
            element={footer}
            onDelete={() => onRemoveElement(footer.id)}
          />
        </div>
      ))}
    </div>
  );
};

const ElementConfigPopover = ({
  isOpen,
  onOpenChange,
  onAddElement,
  selectedType,
  selectedPath,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddElement: (
    elementType: WireframeElementType,
    category: "layout" | "content"
  ) => void;
  selectedType: "page" | "layout" | null;
  selectedPath: string | null;
}) => {
  const { darkMode } = useEditorStore();

  const layoutElements = ELEMENT_TYPES.filter((el) => el.category === "layout");
  const contentElements = ELEMENT_TYPES.filter(
    (el) => el.category === "content"
  );

  const handleAddElement = (
    elementType: WireframeElementType,
    category: "layout" | "content"
  ) => {
    onAddElement(elementType, category);
    onOpenChange(false);
  };

  const isDisabled = !selectedType || !selectedPath;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDisabled}>
          <Plus className="h-4 w-4 mr-1" />
          Add Element
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4
            className={cn(
              "font-semibold text-sm",
              darkMode ? "text-gray-200" : "text-gray-800"
            )}
          >
            Add to {selectedType === "layout" ? "Layout" : "Page"}
          </h4>

          {selectedType === "layout" && (
            <div>
              <h5 className="text-xs font-medium mb-2 text-muted-foreground">
                Layout Elements
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {layoutElements.map((element) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={element.type}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAddElement(element.type, "layout")}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {element.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedType === "page" && (
            <div>
              <h5 className="text-xs font-medium mb-2 text-muted-foreground">
                Content Elements
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {contentElements.map((element) => {
                  const Icon = element.icon;
                  return (
                    <Button
                      key={element.type}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAddElement(element.type, "content")}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {element.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {!selectedType && (
            <div className="text-center text-muted-foreground text-sm py-4">
              Select a page or layout to add elements
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const WireFrame = () => {
  const {
    darkMode,
    appStructure,
    wireframeState,
    setWireframeCurrentPage,
    getWireframeCurrentPage,
    addWireframeElement,
    removeWireframeElement,
    initializeWireframePages,
    selectWireframeItem,
    clearWireframeSelection,
  } = useEditorStore();

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const {
    currentPageIndex,
    totalPages,
    wireframeData,
    selectedType,
    selectedPath,
  } = wireframeState;
  const currentPage = getWireframeCurrentPage();

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setWireframeCurrentPage(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setWireframeCurrentPage(currentPageIndex + 1);
    }
  };

  const handleAddElement = (
    elementType: WireframeElementType,
    _category: "layout" | "content"
  ) => {
    if (!selectedPath || !selectedType) return;

    const element: WireframeElement = {
      id: generateId(),
      type: elementType,
      label:
        ELEMENT_TYPES.find((t) => t.type === elementType)?.label || elementType,
      config: {
        width: "md",
        height: "auto",
        position: "center",
        variant: "primary",
      },
    };

    addWireframeElement(selectedPath, selectedType, element);
  };

  const renderWireframeDisplay = () => {
    if (!currentPage) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          No pages available. Create some pages in the App Structure first.
        </div>
      );
    }

    const layouts = findLayoutsForPagePath(appStructure, currentPage, "", true);
    const pageElements = wireframeData.pages[currentPage]?.elements || [];
    const isPageSelected =
      selectedType === "page" && selectedPath === currentPage;

    let content = (
      <div
        className={cn(
          PAGE_COLOR.bg,
          "border-2",
          isPageSelected ? "border-solid" : "border-dashed",
          PAGE_COLOR.border,
          "rounded p-3 text-center h-full cursor-pointer flex flex-col"
        )}
        onClick={(e) => {
          e.stopPropagation();
          selectWireframeItem("page", currentPage);
        }}
      >
        <div
          className={cn(
            "text-sm font-mono font-semibold mb-3",
            PAGE_COLOR.text
          )}
        >
          {currentPage}
        </div>
        <div className={cn("text-xs mb-3", PAGE_COLOR.text)}>page.tsx</div>

        <div className="space-y-2 flex-1">
          {pageElements.map((element) => (
            <WireframeElementComponent
              key={element.id}
              element={element}
              onDelete={() =>
                removeWireframeElement(currentPage, "page", element.id)
              }
            />
          ))}
        </div>
      </div>
    );

    for (let i = layouts.length - 1; i >= 0; i--) {
      const layout = layouts[i];
      const layoutElements = wireframeData.layouts[layout]?.elements || [];
      const isLayoutSelected =
        selectedType === "layout" && selectedPath === layout;

      content = (
        <WireframeLayoutContainer
          key={layout}
          colorIndex={i}
          elements={layoutElements}
          onRemoveElement={(elementId) =>
            removeWireframeElement(layout, "layout", elementId)
          }
          isSelected={isLayoutSelected}
          onSelect={() => selectWireframeItem("layout", layout)}
        >
          {content}
        </WireframeLayoutContainer>
      );
    }

    return content;
  };

  useEffect(() => {
    initializeWireframePages();
  }, [appStructure, initializeWireframePages]);

  useEffect(() => {
    clearWireframeSelection();
  }, [currentPage, clearWireframeSelection]);

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center justify-between mb-2 py-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {currentPage || "No page"}
          </span>
          <span className="text-xs text-muted-foreground">
            ({currentPageIndex + 1} of {totalPages})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <ElementConfigPopover
            isOpen={isConfigOpen}
            onOpenChange={setIsConfigOpen}
            onAddElement={handleAddElement}
            selectedType={selectedType}
            selectedPath={selectedPath}
          />
        </div>
      </div>

      <div
        className={cn(
          "h-96 p-4 rounded border flex flex-col",
          darkMode
            ? "bg-gray-950 border-gray-800"
            : "bg-gray-50 border-gray-200"
        )}
      >
        <div className="flex-1">{renderWireframeDisplay()}</div>
      </div>

      {totalPages > 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          Use the navigation buttons to move between pages. Click on a page or
          layout to select it, then use the Add Element button to add
          components.
        </div>
      )}
    </div>
  );
};
