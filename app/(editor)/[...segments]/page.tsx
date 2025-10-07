"use client";

import { processContent } from "@/lib/download.utils";
import { conditionalLog } from "@/lib/log.util";
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
import { ComponentNode } from "../components/ComponentNode";
import { COMPONENT_TRANSFORMER } from "../components/ComponentTransformer";
import { PlaceholderNode } from "../components/PlaceholderNode";
import { PLACEHOLDER_TRANSFORMER } from "../components/PlaceholderTransformer";
import { ReadOnlyLexicalEditor } from "../components/ReadOnlyLexicalEditor";
import { SectionNode } from "../components/SectionNode";
import {
  SECTION_TRANSFORMER,
  setSectionTransformerContext,
} from "../components/SectionTransformer";
import { Toolbar } from "../components/Toolbar";
import {
  useContentVersionCheck,
  useInitializeMarkdownData,
} from "../layout.hooks";
import { useEditorStore } from "../layout.stores";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const {
    updateContent,
    getNode,
    darkMode,
    previewMode,
    refreshKey,
    getSectionOptions,
    data,
    getSectionInclude,
    getSectionContent,
    appStructure,
    getPlaceholderValue,
    getInitialConfiguration,
  } = useEditorStore();
  const {
    isResetting,
    versionChecked,
    isLoading: versionCheckLoading,
    isContentStale,
  } = useContentVersionCheck();
  const { needsInitialization, isLoading, error, isInitialized } =
    useInitializeMarkdownData(versionChecked, versionCheckLoading);

  useEffect(() => {
    conditionalLog("Page: Component mounting", { label: "markdown-parse" });
    useEditorStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const canRender =
    mounted && versionChecked && !versionCheckLoading && !isResetting;

  useEffect(() => {
    conditionalLog(
      {
        mounted,
        needsInitialization,
        isLoading,
        hasError: !!error,
        isInitialized,
        isResetting,
        dataNodeCount: data ? Object.keys(data.flatIndex).length : 0,
        dataVersion: data?.contentVersion,
      },
      { label: "markdown-parse" }
    );
  }, [
    mounted,
    needsInitialization,
    isLoading,
    error,
    isInitialized,
    isResetting,
    data,
  ]);

  const getFirstPagePath = useCallback((): string => {
    const pages = Object.values(data.flatIndex)
      .filter((node) => node.type === "file" && node.include !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return pages.length > 0 ? pages[0].path : "";
  }, [data]);

  const contentPath = useMemo((): string => {
    if (!canRender) return "";

    const segments = params.segments as string[] | undefined;

    if (!segments || segments.length === 0) {
      const firstPath = getFirstPagePath();
      conditionalLog(
        { message: "No segments, using first page", firstPath },
        { label: "markdown-parse" }
      );
      return firstPath;
    }

    const urlPath = "/" + segments.join("/");

    for (const [path, node] of Object.entries(data.flatIndex)) {
      if (node.type === "file" && node.urlPath === urlPath) {
        conditionalLog(
          { message: "Found matching path", urlPath, path },
          { label: "markdown-parse" }
        );
        return path;
      }
    }

    const firstPath = getFirstPagePath();
    conditionalLog(
      { message: "No match found, using first page", urlPath, firstPath },
      { label: "markdown-parse" }
    );
    return firstPath;
  }, [canRender, params, data, getFirstPagePath]);

  // Set transformer context when contentPath changes
  useEffect(() => {
    setSectionTransformerContext({
      currentFilePath: contentPath,
      getSectionOptions: getSectionOptions,
    });
  }, [contentPath, getSectionOptions]);

  const currentContent = useMemo(() => {
    if (!canRender || !contentPath) return "";

    const node = getNode(contentPath);
    conditionalLog(
      {
        message: "Getting current content",
        contentPath,
        hasNode: !!node,
        nodeType: node?.type,
        contentLength: node && node.type === "file" ? node.content.length : 0,
      },
      { label: "markdown-parse" }
    );

    if (node && node.type === "file") {
      return node.content
        .replace(/\\n/g, "\n")
        .replace(/\\`/g, "`")
        .replace(/\\\$/g, "$")
        .replace(/\\\\/g, "\\");
    }
    return "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRender, contentPath, getNode, refreshKey, data]);

  const processedContent = useMemo(() => {
    if (!previewMode) return "";
    return processContent(
      currentContent,
      contentPath,
      getSectionInclude,
      getSectionContent,
      getSectionOptions,
      appStructure,
      getPlaceholderValue,
      getInitialConfiguration
    );
  }, [
    previewMode,
    currentContent,
    contentPath,
    getSectionInclude,
    getSectionContent,
    getSectionOptions,
    appStructure,
    getPlaceholderValue,
    getInitialConfiguration,
  ]);

  const setCurrentContent = useCallback(
    (content: string) => {
      updateContent(contentPath, content);
    },
    [contentPath, updateContent]
  );

  const initialConfig = useMemo(() => {
    if (!canRender) {
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
        onError: () => {},
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
      onError: (error: Error) => {},
      editorState: () =>
        $convertFromMarkdownString(currentContent, [
          ...TRANSFORMERS,
          SECTION_TRANSFORMER,
          COMPONENT_TRANSFORMER,
          PLACEHOLDER_TRANSFORMER,
        ]),
    };
  }, [canRender, currentContent, darkMode]);

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString([
          ...TRANSFORMERS,
          SECTION_TRANSFORMER,
          COMPONENT_TRANSFORMER,
          PLACEHOLDER_TRANSFORMER,
        ]);
        setCurrentContent(markdown);
      });
    },
    [setCurrentContent]
  );

  if (!canRender || (needsInitialization && isLoading)) {
    return (
      <div
        className={`w-full h-full ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} flex items-center justify-center`}
      >
        <div className="text-gray-500">
          {!mounted
            ? "Loading editor..."
            : versionCheckLoading
              ? "Checking content version..."
              : isResetting
                ? "Updating content..."
                : "Loading content..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full h-full ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} flex items-center justify-center`}
      >
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-medium">
            Failed to load editor content
          </div>
          <div className="text-gray-500">
            {error.message || "An error occurred while loading the content"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-md transition-colors ${
              darkMode
                ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                : "bg-blue-600 text-blue-100 hover:bg-blue-700"
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div
        className={`w-full h-full ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} flex items-center justify-center`}
      >
        <div className="text-gray-500">Initializing editor...</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
    >
      {previewMode ? (
        <div className="relative h-full flex flex-col">
          <Toolbar currentContentPath={contentPath} />
          <div className="w-full flex-1 overflow-auto">
            <ReadOnlyLexicalEditor
              content={processedContent}
              darkMode={darkMode}
            />
          </div>
        </div>
      ) : (
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
                <div
                  className={`absolute top-6 left-6 pointer-events-none ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Start typing your markdown content...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin
              transformers={[
                ...TRANSFORMERS,
                SECTION_TRANSFORMER,
                COMPONENT_TRANSFORMER,
                PLACEHOLDER_TRANSFORMER,
              ]}
            />
          </div>
        </LexicalComposer>
      )}
    </div>
  );
};

export default Page;
