"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { findLayoutsForPagePath } from "@/app/(editor)/layout.utils";
import { WireframeElement } from "@/app/(editor)/layout.types";
import { Button } from "@/components/editor/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { LAYOUT_COLORS, PAGE_FILE_ICON } from "./AppStructure.types";
import { generateId } from "./AppStructure.utils";

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
  element: WireframeElement;
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

    const newElement: WireframeElement = {
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
        <div className="text-base font-semibold text-center theme-py-8 text-[hsl(var(--muted-foreground))]">
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
