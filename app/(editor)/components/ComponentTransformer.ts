import { ElementTransformer } from "@lexical/markdown";
import { $createComponentNode, ComponentNode } from "./ComponentNode";
import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";

export const COMPONENT_TRANSFORMER: ElementTransformer = {
  dependencies: [ComponentNode],
  export: (node: LexicalNode) => {
    if (node instanceof ComponentNode) {
      return `<!-- component-${node.getComponentName()} -->`;
    }
    return null;
  },
  regExp: /^<!--\s*component-([A-Za-z][A-Za-z0-9]*)\s*-->$/,
  replace: (parentNode, children, match, isImport) => {
    if (isImport) {
      const componentName = match[1];
      const componentNode = $createComponentNode(componentName);
      parentNode.replace(componentNode);
      return;
    }

    const paragraph = $createParagraphNode();
    const textNode = $createTextNode(match[0]);
    paragraph.append(textNode);
    parentNode.replace(paragraph);
  },
  type: "element",
};