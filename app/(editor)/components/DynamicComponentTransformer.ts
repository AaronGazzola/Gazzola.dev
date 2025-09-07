import { Transformer } from "@lexical/markdown";
import { $createDynamicComponentNode, DynamicComponentNode } from "./DynamicComponentNode";
import { DynamicComponent } from "../layout.data";
import { LexicalNode } from "lexical";

export const DYNAMIC_COMPONENT_TRANSFORMER: Transformer = {
  dependencies: [DynamicComponentNode],
  export: (node: LexicalNode) => {
    if (node instanceof DynamicComponentNode) {
      const component = node.getComponent();
      const optionsJson = JSON.stringify(component.options);
      return `DYNAMIC_COMPONENT:${optionsJson}`;
    }
    return null;
  },
  importRegExp: /DYNAMIC_COMPONENT:(\{[^}]+\})/g,
  regExp: /DYNAMIC_COMPONENT:(\{[^}]+\})/g,
  replace: (textNode: LexicalNode, match: RegExpMatchArray) => {
    try {
      console.log(JSON.stringify({ 
        debug: "DynamicComponentTransformer triggered",
        match: match[0],
        optionsMatch: match[1]
      }, null, 0));
      
      const optionsJson = match[1];
      if (typeof optionsJson !== 'string') {
        console.log(JSON.stringify({ error: `Expected string but got ${typeof optionsJson}` }, null, 0));
        return;
      }
      
      const options = JSON.parse(optionsJson);
      
      const component: DynamicComponent = {
        id: `dynamic-${Math.random().toString(36).substr(2, 9)}`,
        type: 'select',
        options,
        position: 0
      };

      console.log(JSON.stringify({ 
        debug: "Creating dynamic component node",
        componentId: component.id,
        optionsCount: Object.keys(component.options).length
      }, null, 0));

      const dynamicComponentNode = $createDynamicComponentNode(component);
      textNode.replace(dynamicComponentNode);
    } catch (error) {
      console.log(JSON.stringify({ error: `Failed to parse dynamic component: ${error}` }, null, 0));
    }
  },
  type: "text-match",
};