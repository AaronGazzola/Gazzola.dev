import {
  $applyNodeReplacement,
  $createParagraphNode,
  $insertNodes,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import { DynamicComponent } from "../layout.data";
import { DynamicComponentRenderer } from "./DynamicComponents";

export interface DynamicComponentNodeProps {
  component: DynamicComponent;
  onContentChange?: (componentId: string, content: string) => void;
}

type SerializedDynamicComponentNode = Spread<
  {
    component: DynamicComponent;
    type: "dynamic-component";
    version: 1;
  },
  SerializedLexicalNode
>;

export class DynamicComponentNode extends DecoratorNode<ReactNode> {
  __component: DynamicComponent;
  __onContentChange?: (componentId: string, content: string) => void;

  static getType(): string {
    return "dynamic-component";
  }

  static clone(node: DynamicComponentNode): DynamicComponentNode {
    return new DynamicComponentNode(node.__component, node.__onContentChange, node.__key);
  }

  constructor(
    component: DynamicComponent,
    onContentChange?: (componentId: string, content: string) => void,
    key?: NodeKey
  ) {
    super(key);
    this.__component = component;
    this.__onContentChange = onContentChange;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "dynamic-component-container";
    div.setAttribute("data-lexical-decorator", "true");
    return div;
  }

  updateDOM(): false {
    return false;
  }

  setComponent(component: DynamicComponent): void {
    const writable = this.getWritable();
    writable.__component = component;
  }

  getComponent(): DynamicComponent {
    return this.__component;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
    return (
      <DynamicComponentRenderer
        component={this.__component}
        onContentChange={(componentId, content) => {
          this.__onContentChange?.(componentId, content);
        }}
      />
    );
  }

  static importJSON(serializedNode: SerializedDynamicComponentNode): DynamicComponentNode {
    const { component } = serializedNode;
    return $createDynamicComponentNode(component);
  }

  exportJSON(): SerializedDynamicComponentNode {
    return {
      ...super.exportJSON(),
      component: this.__component,
      type: "dynamic-component",
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        const element = node as HTMLElement;
        if (element.getAttribute("data-lexical-decorator") === "true") {
          return {
            conversion: (domNode: Node): DOMConversionOutput => {
              return {
                node: null,
              };
            },
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.className = "dynamic-component-container";
    element.setAttribute("data-lexical-decorator", "true");
    return { element };
  }

  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

export function $createDynamicComponentNode(
  component: DynamicComponent,
  onContentChange?: (componentId: string, content: string) => void
): DynamicComponentNode {
  return $applyNodeReplacement(new DynamicComponentNode(component, onContentChange));
}

export function $isDynamicComponentNode(
  node: LexicalNode | null | undefined
): node is DynamicComponentNode {
  return node instanceof DynamicComponentNode;
}