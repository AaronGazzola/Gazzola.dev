import { TextMatchTransformer } from "@lexical/markdown";
import { $createPlaceholderNode, PlaceholderNode } from "./PlaceholderNode";
import { $createTextNode, LexicalNode } from "lexical";

let firstPlaceholderEncountered = false;

export function resetPlaceholderTracking() {
  firstPlaceholderEncountered = false;
}

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
    const isFirst = !firstPlaceholderEncountered;
    if (isFirst) {
      firstPlaceholderEncountered = true;
    }
    const placeholderNode = $createPlaceholderNode(placeholderKey, defaultValue, isFirst);
    textNode.replace(placeholderNode);
  },
  trigger: "}",
  type: "text-match",
};