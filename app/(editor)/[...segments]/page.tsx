"use client";

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorState } from "lexical";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useEditorStore } from "../layout.stores";
import { markdownData, getFirstPagePath } from "../layout.data";
import { Toolbar } from "../components/Toolbar";
import { SectionNode } from "../components/SectionNode";
import { SECTION_TRANSFORMER, setSectionTransformerContext } from "../components/SectionTransformer";
import { ComponentNode } from "../components/ComponentNode";
import { COMPONENT_TRANSFORMER } from "../components/ComponentTransformer";
import { PlaceholderNode } from "../components/PlaceholderNode";
import { PLACEHOLDER_TRANSFORMER } from "../components/PlaceholderTransformer";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const { updateContent, getNode, darkMode, refreshKey, getSectionOptions } = useEditorStore();

  useEffect(() => {
    useEditorStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const contentPath = useMemo((): string => {
    const segments = params.segments as string[] | undefined;

    if (!segments || segments.length === 0) {
      return getFirstPagePath();
    }

    const urlPath = "/" + segments.join("/");

    for (const [path, node] of Object.entries(markdownData.flatIndex)) {
      if (node.type === "file" && node.urlPath === urlPath) {
        return path;
      }
    }

    return getFirstPagePath();
  }, [params]);

  // Set transformer context when contentPath changes
  useEffect(() => {
    setSectionTransformerContext({
      currentFilePath: contentPath,
      getSectionOptions: getSectionOptions
    });
  }, [contentPath, getSectionOptions]);

  const currentContent = useMemo(() => {
    const node = getNode(contentPath);
    if (node && node.type === "file") {
      return node.content.replace(/\\n/g, '\n').replace(/\\`/g, '`').replace(/\\\$/g, '$').replace(/\\\\/g, '\\');
    }
    return "";
  }, [contentPath, getNode]);

  const setCurrentContent = useCallback(
    (content: string) => {
      updateContent(contentPath, content);
    },
    [contentPath, updateContent]
  );

  const initialConfig = useMemo(() => {
    if (!mounted) {
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
        namespace: "markdown-editor",
        theme: {},
        onError: (error: Error) => {
        },
      };
    }

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
      namespace: "markdown-editor",
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
      onError: (error: Error) => {
      },
      editorState: () => $convertFromMarkdownString(currentContent, [...TRANSFORMERS, SECTION_TRANSFORMER, COMPONENT_TRANSFORMER, PLACEHOLDER_TRANSFORMER]),
    };
  }, [mounted, currentContent, darkMode, contentPath]);

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString([...TRANSFORMERS, SECTION_TRANSFORMER, COMPONENT_TRANSFORMER, PLACEHOLDER_TRANSFORMER]);
        setCurrentContent(markdown);
      });
    },
    [setCurrentContent]
  );

  if (!mounted) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <LexicalComposer key={refreshKey} initialConfig={initialConfig}>
        <div className="relative h-full flex flex-col">
          <Toolbar currentContentPath={contentPath} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="w-full flex-1 p-6 outline-none resize-none overflow-auto"
                style={{ minHeight: "0" }}
              />
            }
            placeholder={
              <div className={`absolute top-6 left-6 pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Start typing your markdown content...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, SECTION_TRANSFORMER, COMPONENT_TRANSFORMER, PLACEHOLDER_TRANSFORMER]} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default Page;