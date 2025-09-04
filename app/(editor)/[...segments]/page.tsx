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
import { ContentPath, urlToContentPathMapping } from "../layout.data";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const { getContent, setContent } = useEditorStore();

  useEffect(() => {
    useEditorStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const contentPath = useMemo((): ContentPath => {
    const segments = params.segments as string[] | undefined;

    if (!segments || segments.length === 0) {
      return "welcome";
    }

    const firstSegment = segments[0].toLowerCase();
    
    if (segments.length === 1) {
      const mapping = (urlToContentPathMapping as any)[firstSegment];
      if (typeof mapping === 'string') {
        return mapping as ContentPath;
      }
    } else if (segments.length === 2) {
      const secondSegment = segments[1].toLowerCase();
      const mapping = (urlToContentPathMapping as any)[firstSegment];
      if (typeof mapping === 'object' && mapping[secondSegment]) {
        return mapping[secondSegment] as ContentPath;
      }
    }

    return "welcome";
  }, [params]);

  const currentContent = useMemo(() => {
    return getContent(contentPath);
  }, [contentPath, getContent]);

  const setCurrentContent = useCallback(
    (content: string) => {
      setContent(contentPath, content);
    },
    [contentPath, setContent]
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
        ],
        namespace: "markdown-editor",
        theme: {},
        onError: (error: Error) => {
          console.log(JSON.stringify({ error: error.message }, null, 0));
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
          code: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm",
        },
        code: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto block mb-4",
        list: {
          ul: "list-disc pl-6 mb-4",
          ol: "list-decimal pl-6 mb-4",
          listitem: "mb-1",
        },
        link: "text-blue-600 hover:text-blue-800 underline",
        quote: "border-l-4 border-gray-300 pl-4 italic mb-4",
      },
      onError: (error: Error) => {
        console.log(JSON.stringify({ error: error.message }, null, 0));
      },
      editorState: () =>
        $convertFromMarkdownString(currentContent, TRANSFORMERS),
    };
  }, [mounted, currentContent]);

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
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
    <div className="w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative h-full flex flex-col">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="w-full h-full p-6 outline-none resize-none overflow-auto"
                style={{ minHeight: "100%" }}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
                Start typing your markdown content...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default Page;
