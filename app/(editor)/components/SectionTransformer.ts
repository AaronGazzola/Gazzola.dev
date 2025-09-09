import { ElementTransformer } from "@lexical/markdown";
import { $createSectionNode, SectionNode } from "./SectionNode";
import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";

export const SECTION_TRANSFORMER: ElementTransformer = {
  dependencies: [SectionNode],
  export: (node: LexicalNode) => {
    if (node instanceof SectionNode) {
      return `<!-- ${node.getSectionKey()} -->`;
    }
    return null;
  },
  regExp: /^<!--\s*(section-\d+)\s*-->$/,
  replace: (parentNode, children, match, isImport) => {
    if (isImport) {
      const rawSectionKey = match[1];
      const sectionKey = rawSectionKey.replace(/-(\d+)$/, '$1');
      const sectionNode = $createSectionNode(sectionKey);
      parentNode.replace(sectionNode);
      return;
    }

    const paragraph = $createParagraphNode();
    const textNode = $createTextNode(match[0]);
    paragraph.append(textNode);
    parentNode.replace(paragraph);
  },
  type: "element",
};