"use client";

import { DecoratorNode, NodeKey, LexicalNode, SerializedLexicalNode, Spread } from "lexical";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { 
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { EditorState } from "lexical";
import { useEditorStore } from "../layout.stores";
import { ContentPath } from "../layout.data";

export interface SerializedSectionNode extends Spread<
  {
    sectionKey: string;
    selectedOption: string | null;
  },
  SerializedLexicalNode
> {}

export class SectionNode extends DecoratorNode<ReactNode> {
  __sectionKey: string;
  __selectedOption: string | null;

  static getType(): string {
    return "section";
  }

  static clone(node: SectionNode): SectionNode {
    return new SectionNode(node.__sectionKey, node.__selectedOption, node.__key);
  }

  constructor(sectionKey: string, selectedOption: string | null = null, key?: NodeKey) {
    super(key);
    this.__sectionKey = sectionKey;
    this.__selectedOption = selectedOption;
  }

  static importJSON(serializedNode: SerializedSectionNode): SectionNode {
    const { sectionKey, selectedOption } = serializedNode;
    return $createSectionNode(sectionKey, selectedOption);
  }

  exportJSON(): SerializedSectionNode {
    return {
      sectionKey: this.__sectionKey,
      selectedOption: this.__selectedOption,
      type: "section",
      version: 1,
    };
  }

  getSectionKey(): string {
    return this.__sectionKey;
  }

  getSelectedOption(): string | null {
    return this.__selectedOption;
  }

  setSelectedOption(option: string | null): void {
    const writable = this.getWritable();
    writable.__selectedOption = option;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "section-node-container";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <SectionNodeComponent node={this} />;
  }

  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): false {
    return false;
  }
}

export function $createSectionNode(sectionKey: string, selectedOption: string | null = null): SectionNode {
  return new SectionNode(sectionKey, selectedOption);
}

export function $isSectionNode(node: LexicalNode | null | undefined): node is SectionNode {
  return node instanceof SectionNode;
}

interface SectionNodeComponentProps {
  node: SectionNode;
}

function SectionNodeComponent({ node }: SectionNodeComponentProps) {
  const { 
    getSectionOptions, 
    getSectionContent, 
    setSectionContent,
    getSectionSelection, 
    darkMode 
  } = useEditorStore();
  
  const [mounted, setMounted] = useState(false);
  const sectionKey = node.getSectionKey();
  const selectedOption = getSectionSelection(sectionKey);

  useEffect(() => {
    setMounted(true);
  }, []);


  const selectedContent = useMemo(() => {
    if (!selectedOption) return "";
    return getSectionContent(sectionKey, selectedOption);
  }, [getSectionContent, sectionKey, selectedOption]);


  const handleContentChange = useCallback(
    (editorState: EditorState) => {
      if (!selectedOption) return;
      
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        setSectionContent(sectionKey, selectedOption, markdown);
      });
    },
    [sectionKey, selectedOption, setSectionContent]
  );

  const editorConfig = useMemo(() => ({
    nodes: [
      HeadingNode,
      QuoteNode,
      LinkNode,
      ListNode,
      ListItemNode,
      CodeNode,
    ],
    namespace: `section-editor-${sectionKey}`,
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
      console.log(JSON.stringify({ 
        error: `Section editor error: ${error.message}`,
        sectionKey,
        selectedOption 
      }, null, 0));
    },
    editorState: selectedOption && selectedContent 
      ? () => $convertFromMarkdownString(selectedContent, TRANSFORMERS)
      : undefined,
  }), [darkMode, sectionKey, selectedOption, selectedContent]);

  if (!mounted) {
    return (
      <div className={`w-full p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="text-sm text-gray-500">Loading section...</div>
      </div>
    );
  }

  if (!selectedOption) {
    return (
      <div className={`w-full mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center">
          <div className={`h-px flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <span className={`px-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            pending selection
          </span>
          <div className={`h-px flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className={`w-full rounded-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <LexicalComposer key={`${sectionKey}-${selectedOption}`} initialConfig={editorConfig}>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="w-full p-4 outline-none resize-none min-h-[200px]"
                />
              }
              placeholder={
                <div className={`absolute top-4 left-4 pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Edit the content for this section...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleContentChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}