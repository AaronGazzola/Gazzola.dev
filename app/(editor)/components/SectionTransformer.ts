import { ElementTransformer } from "@lexical/markdown";
import { $createSectionNode, SectionNode } from "./SectionNode";
import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";

interface SectionTransformerContext {
  currentFilePath?: string;
  getSectionOptions?: (filePath: string, sectionId: string) => Record<string, { content: string; include: boolean }>;
}

let transformerContext: SectionTransformerContext = {};

export const setSectionTransformerContext = (context: SectionTransformerContext) => {
  transformerContext = context;
};

export const SECTION_TRANSFORMER: ElementTransformer = {
  dependencies: [SectionNode],
  export: (node: LexicalNode) => {
    if (node instanceof SectionNode) {
      return `<!-- section-${node.getSectionKey().replace(/^section/, '')} -->`;
    }
    return null;
  },
  regExp: /^<!--\s*(section-\d+)\s*-->$/,
  replace: (parentNode, children, match, isImport) => {
    if (isImport) {
      const rawSectionKey = match[1]; // e.g., "section-1"
      const normalizedSectionId = rawSectionKey.replace(/-/, ""); // Convert "section-1" to "section1"

      // Always create one SectionNode per section comment
      const sectionNode = $createSectionNode(normalizedSectionId);
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