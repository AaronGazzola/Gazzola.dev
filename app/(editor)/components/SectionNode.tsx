"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwind.utils";
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
import {
  DecoratorNode,
  EditorState,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ListTodo } from "lucide-react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useEditorStore } from "../layout.stores";
// Import removed - ContentPath no longer exists

export interface SerializedSectionNode
  extends Spread<
    {
      sectionKey: string;
    },
    SerializedLexicalNode
  > {}

export class SectionNode extends DecoratorNode<ReactNode> {
  __sectionKey: string;

  static getType(): string {
    return "section";
  }

  static clone(node: SectionNode): SectionNode {
    return new SectionNode(node.__sectionKey, node.__key);
  }

  constructor(sectionKey: string, key?: NodeKey) {
    super(key);
    this.__sectionKey = sectionKey;
  }

  static importJSON(serializedNode: SerializedSectionNode): SectionNode {
    const { sectionKey } = serializedNode;
    return $createSectionNode(sectionKey);
  }

  exportJSON(): SerializedSectionNode {
    return {
      sectionKey: this.__sectionKey,
      type: "section",
      version: 1,
    };
  }

  getSectionKey(): string {
    return this.__sectionKey;
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

export function $createSectionNode(sectionKey: string): SectionNode {
  return new SectionNode(sectionKey);
}

export function $isSectionNode(
  node: LexicalNode | null | undefined
): node is SectionNode {
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
    getSectionInclude,
    setSectionInclude,
    darkMode,
    data,
  } = useEditorStore();

  const [mounted, setMounted] = useState(false);
  const [sectionPopoverOpen, setSectionPopoverOpen] = useState(false);
  const sectionKey = node.getSectionKey();

  // Find the parent file that contains this section
  const filePath = useMemo(() => {
    // Look for files with sections containing this section ID
    const filesWithSection = Object.values(data.flatIndex).filter(
      (node) =>
        node.type === "file" && node.sections && node.sections[sectionKey]
    );

    // Try to find from URL or other context clues
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const matchingFile = filesWithSection.find(
        (file: any) =>
          currentPath.includes(file.name) ||
          currentPath.includes(file.path.split(".").pop())
      );

      if (matchingFile) {
        return matchingFile.path;
      }
    }

    // Fallback to first file that has this section
    if (filesWithSection.length > 0) {
      return filesWithSection[0].path;
    }

    return sectionKey; // ultimate fallback
  }, [sectionKey, data]);

  const sectionOptions = useMemo(() => {
    const options = getSectionOptions(filePath, sectionKey);
    return Object.entries(options).map(([optionId, optionData]) => ({
      optionId,
      content: optionData.content,
    }));
  }, [getSectionOptions, filePath, sectionKey]);

  const includedOptions = useMemo(() => {
    const options = getSectionOptions(filePath, sectionKey);
    const included: { optionId: string; content: string }[] = [];

    Object.entries(options).forEach(([optionId, optionData]) => {
      if (optionData.include) {
        included.push({
          optionId,
          content: optionData.content,
        });
      }
    });

    return included;
  }, [getSectionOptions, filePath, sectionKey]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createEditorConfig = useCallback(
    (optionId: string, content: string) => ({
      nodes: [
        HeadingNode,
        QuoteNode,
        LinkNode,
        ListNode,
        ListItemNode,
        CodeNode,
      ],
      namespace: `section-editor-${sectionKey}-${optionId}`,
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
          ul: "list-disc pl-6 mb-0",
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
      editorState: content
        ? () => $convertFromMarkdownString(content, TRANSFORMERS)
        : undefined,
    }),
    [darkMode, sectionKey]
  );

  const createHandleContentChange = useCallback(
    (optionId: string) => (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        setSectionContent(filePath, sectionKey, optionId, markdown);
      });
    },
    [setSectionContent, filePath, sectionKey]
  );

  if (!mounted) {
    return (
      <div
        className={`w-full p-4 rounded-lg mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="text-sm text-gray-500">Loading section...</div>
      </div>
    );
  }

  if (includedOptions.length === 0) {
    return (
      <div
        className={`w-full mb-6 p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="flex items-center justify-center">
          <div
            className={`h-px flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
          />
          <span
            className={`px-4 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            no sections selected
          </span>
          <div
            className={`h-px flex-1 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {sectionOptions.length > 0 && (
        <Popover open={sectionPopoverOpen} onOpenChange={setSectionPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "absolute top-0 -left-5 z-10 h-6 w-6 flex items-center justify-center rounded transition-colors border border-gray-500",
                darkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setSectionPopoverOpen(true)}
              data-walkthrough="section-options"
            >
              <ListTodo className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-64 max-h-80 overflow-y-auto",
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            )}
            align="start"
          >
            <div className="space-y-3">
              <div className="font-semibold text-sm">Section Options</div>
              <div className="space-y-2">
                {sectionOptions.map((option) => (
                  <div
                    key={option.optionId}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={getSectionInclude(
                        filePath,
                        sectionKey,
                        option.optionId
                      )}
                      onCheckedChange={(checked) =>
                        setSectionInclude(
                          filePath,
                          sectionKey,
                          option.optionId,
                          checked as boolean
                        )
                      }
                    />
                    <label
                      className="text-sm cursor-pointer flex-1"
                      onClick={() =>
                        setSectionInclude(
                          filePath,
                          sectionKey,
                          option.optionId,
                          !getSectionInclude(
                            filePath,
                            sectionKey,
                            option.optionId
                          )
                        )
                      }
                    >
                      {option.optionId}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {includedOptions.map(({ optionId, content }) => (
        <div key={optionId}>
          <LexicalComposer
            key={`${sectionKey}-${optionId}`}
            initialConfig={createEditorConfig(optionId, content)}
          >
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="w-full px-0 py-1 outline-none resize-none min-h-[20px]" />
                }
                placeholder={
                  <div
                    className={`absolute top-1 left-0 pointer-events-none ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Edit the content...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={createHandleContentChange(optionId)} />
              <HistoryPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            </div>
          </LexicalComposer>
        </div>
      ))}
    </div>
  );
}
