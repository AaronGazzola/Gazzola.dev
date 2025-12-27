"use client";

import { cn } from "@/lib/utils";
import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode, Suspense, lazy, useMemo } from "react";
import { useEditorStore } from "../layout.stores";

export interface SerializedComponentNode
  extends Spread<
    {
      componentName: string;
    },
    SerializedLexicalNode
  > {}

const componentMap: Record<string, any> = {
  FullStackOrFrontEnd: lazy(() =>
    import("@/app/(components)/FullStackOrFrontEnd").then((m) => ({
      default: m.FullStackOrFrontEnd,
    }))
  ),
  WireFrame: lazy(() =>
    import("@/app/(components)/AppStructure").then((m) => ({
      default: m.WireFrame,
    }))
  ),
  AppStructure: lazy(() =>
    import("@/app/(components)/AppStructure").then((m) => ({
      default: m.AppStructure,
    }))
  ),
  AppStructureAscii: lazy(() =>
    import("@/app/(components)/AppStructureAscii").then((m) => ({
      default: m.AppStructureAscii,
    }))
  ),
  LayoutAndStructure: lazy(() =>
    import("@/app/(components)/AppStructure").then((m) => ({
      default: m.LayoutAndStructure,
    }))
  ),
  HelloSwitch: lazy(() =>
    import("@/app/(components)/HelloSwitch").then((m) => ({
      default: m.HelloSwitch,
    }))
  ),
  InitialConfiguration: lazy(() =>
    import("@/app/(components)/InitialConfiguration").then((m) => ({
      default: m.InitialConfiguration,
    }))
  ),
  ThemeConfiguration: lazy(() =>
    import("@/app/(components)/ThemeConfiguration").then((m) => ({
      default: m.ThemeConfiguration,
    }))
  ),
  DatabaseConfiguration: lazy(() =>
    import("@/app/(components)/DatabaseConfiguration").then((m) => ({
      default: m.DatabaseConfiguration,
    }))
  ),
  Tests: lazy(() =>
    import("@/app/(components)/Tests").then((m) => ({
      default: m.Tests,
    }))
  ),
  NextStepsComponent: lazy(() =>
    import("@/app/(components)/NextStepsComponent").then((m) => ({
      default: m.NextStepsComponent,
    }))
  ),
  READMEComponent: lazy(() =>
    import("@/app/(components)/READMEComponent").then((m) => ({
      default: m.READMEComponent,
    }))
  ),
};

export class ComponentNode extends DecoratorNode<ReactNode> {
  __componentName: string;

  static getType(): string {
    return "component";
  }

  static clone(node: ComponentNode): ComponentNode {
    return new ComponentNode(node.__componentName, node.__key);
  }

  constructor(componentName: string, key?: NodeKey) {
    super(key);
    this.__componentName = componentName;
  }

  static importJSON(serializedNode: SerializedComponentNode): ComponentNode {
    const { componentName } = serializedNode;
    return $createComponentNode(componentName);
  }

  exportJSON(): SerializedComponentNode {
    return {
      componentName: this.__componentName,
      type: "component",
      version: 1,
    };
  }

  getComponentName(): string {
    return this.__componentName;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "component-node-container";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <ComponentNodeComponent componentName={this.__componentName} />;
  }

  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): false {
    return false;
  }
}

export function $createComponentNode(componentName: string): ComponentNode {
  return new ComponentNode(componentName);
}

export function $isComponentNode(
  node: LexicalNode | null | undefined
): node is ComponentNode {
  return node instanceof ComponentNode;
}

interface ComponentNodeComponentProps {
  componentName: string;
}

function ComponentNodeComponent({
  componentName,
}: ComponentNodeComponentProps) {
  const { darkMode } = useEditorStore();

  const Component = useMemo(() => {
    return componentMap[componentName];
  }, [componentName]);

  if (!Component) {
    return (
      <div
        className={cn(
          "p-4 rounded-lg mb-4 text-center",
          darkMode ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
        )}
      >
        Component &ldquo;{componentName}&rdquo; not found
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Suspense
        fallback={
          <div
            className={cn(
              "p-4 rounded-lg text-center",
              darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-50 text-gray-600"
            )}
          >
            Loading component...
          </div>
        }
      >
        <Component />
      </Suspense>
    </div>
  );
}
