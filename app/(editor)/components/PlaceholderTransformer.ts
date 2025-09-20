import { TextMatchTransformer } from "@lexical/markdown";
import { $createPlaceholderNode, PlaceholderNode } from "./PlaceholderNode";
import { $createTextNode, LexicalNode } from "lexical";

export const PLACEHOLDER_TRANSFORMER: TextMatchTransformer = {
  dependencies: [PlaceholderNode],
  export: (node: LexicalNode) => {
    if (node instanceof PlaceholderNode) {
      return `{{${node.getPlaceholderKey()}:${node.getDefaultValue()}}}`;
    }
    return null;
  },
  importRegExp: /\{\{([a-zA-Z][a-zA-Z0-9]*):([^}]*)\}\}/,
  regExp: /\{\{([a-zA-Z][a-zA-Z0-9]*):([^}]*)\}\}$/,
  replace: (textNode, match) => {
    const [, placeholderKey, defaultValue] = match;
    const placeholderNode = $createPlaceholderNode(placeholderKey, defaultValue);
    textNode.replace(placeholderNode);
  },
  trigger: "}",
  type: "text-match",
};