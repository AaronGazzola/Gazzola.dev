"use client";

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useMemo } from "react";
import { ComponentNode } from "./ComponentNode";
import { COMPONENT_TRANSFORMER } from "./ComponentTransformer";
import { PlaceholderNode } from "./PlaceholderNode";
import { PLACEHOLDER_TRANSFORMER } from "./PlaceholderTransformer";
import { SectionNode } from "./SectionNode";
import { SECTION_TRANSFORMER } from "./SectionTransformer";

interface ReadOnlyLexicalEditorProps {
  content: string;
  darkMode: boolean;
}

export const ReadOnlyLexicalEditor = ({ content, darkMode }: ReadOnlyLexicalEditorProps) => {
  const initialConfig = useMemo(() => {
    return {
      nodes: [
        HeadingNode,
        QuoteNode,
        LinkNode,
        ListNode,
        ListItemNode,
        CodeNode,
        SectionNode,
        ComponentNode,
        PlaceholderNode,
      ],
      namespace: "readonly-markdown-editor",
      theme: {
        paragraph: "mb-4",
        heading: {
          h1: "text-4xl font-bold mb-6 mt-8",
          h2: "text-3xl font-semibold mb-4 mt-6",
          h3: "text-2xl font-medium mb-3 mt-5",
        },
        text: {
          bold: "font-bold",
          italic: "italic",
          code: darkMode
            ? "bg-gray-800 text-gray-200 px-1 py-0.5 rounded font-mono text-sm"
            : "bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm",
        },
        code: darkMode
          ? "bg-gray-800 text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto block mb-4"
          : "bg-gray-100 text-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto block mb-4",
        list: {
          ul: "list-disc pl-6 mb-4",
          ol: "list-decimal pl-6 mb-4",
          listitem: "mb-1",
        },
        link: darkMode
          ? "text-blue-400 hover:text-blue-300 underline"
          : "text-blue-600 hover:text-blue-800 underline",
        quote: darkMode
          ? "border-l-4 border-gray-600 pl-4 italic mb-4"
          : "border-l-4 border-gray-300 pl-4 italic mb-4",
      },
      editable: false,
      onError: (error: Error) => {
        console.error("ReadOnlyLexicalEditor error:", error);
      },
      editorState: () =>
        $convertFromMarkdownString(content, [
          ...TRANSFORMERS,
          SECTION_TRANSFORMER,
          COMPONENT_TRANSFORMER,
          PLACEHOLDER_TRANSFORMER,
        ]),
    };
  }, [content, darkMode]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="w-full h-full p-6 outline-none resize-none overflow-auto focus:outline-none"
              style={{ minHeight: "0" }}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};