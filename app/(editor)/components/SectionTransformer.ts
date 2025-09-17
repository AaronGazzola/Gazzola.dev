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
    console.log(JSON.stringify({
      transformerCalled: true,
      isImport,
      match: match[0],
      rawSectionKey: match[1],
      hasContext: !!transformerContext.currentFilePath
    }, null, 0));

    if (isImport) {
      const rawSectionKey = match[1]; // e.g., "section-1"
      const normalizedSectionId = rawSectionKey.replace(/-/, ""); // Convert "section-1" to "section1"

      console.log(JSON.stringify({
        rawSectionKey,
        normalizedSectionId,
        filePath: transformerContext.currentFilePath,
        creatingNode: true
      }, null, 0));

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