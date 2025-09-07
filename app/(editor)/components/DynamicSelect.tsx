"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/tailwind.utils";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useMemo, useState } from "react";
import { useEditorStore } from "../layout.stores";

interface DynamicSelectProps {
  id: string;
  options: Record<string, string>;
  onSelectionChange: (value: string, content: string) => void;
}

export const DynamicSelect = ({
  id,
  options,
  onSelectionChange,
}: DynamicSelectProps) => {
  const { darkMode } = useEditorStore();
  const optionKeys = Object.keys(options);
  const firstOption = optionKeys[0] || "";
  const [selectedValue, setSelectedValue] = useState<string>(firstOption);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    const content = options[value] || "";
    onSelectionChange(value, content);
  };

  const nestedEditorConfig = useMemo(() => {
    const selectedContent = options[selectedValue] || "";

    return {
      namespace: `dynamic-select-${id}`,
      nodes: [
        HeadingNode,
        QuoteNode,
        LinkNode,
        ListNode,
        ListItemNode,
        CodeNode,
      ],
      editable: true,
      theme: {
        paragraph: "mb-2",
        heading: {
          h1: "text-2xl font-bold mb-3",
          h2: "text-xl font-semibold mb-2",
          h3: "text-lg font-medium mb-2",
        },
        text: {
          bold: "font-bold",
          italic: "italic",
          code: darkMode
            ? "bg-gray-800 text-gray-200 px-1 py-0.5 rounded font-mono text-xs"
            : "bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-xs",
        },
        code: darkMode
          ? "bg-gray-800 text-gray-200 p-2 rounded font-mono text-xs overflow-x-auto block mb-2"
          : "bg-gray-100 text-gray-800 p-2 rounded font-mono text-xs overflow-x-auto block mb-2",
        list: {
          ul: "list-disc pl-4 mb-2",
          ol: "list-decimal pl-4 mb-2",
          listitem: "mb-1",
        },
        link: darkMode
          ? "text-blue-400 hover:text-blue-300 underline"
          : "text-blue-600 hover:text-blue-800 underline",
        quote: darkMode
          ? "border-l-2 border-gray-600 pl-3 italic mb-2"
          : "border-l-2 border-gray-300 pl-3 italic mb-2",
      },
      onError: (error: Error) => {
        console.log(
          JSON.stringify(
            { error: `Nested editor error: ${error.message}` },
            null,
            0
          )
        );
      },
      editorState: () => {
        // Convert HTML content to markdown-like format for better processing
        const htmlToMarkdown = selectedContent
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p><p>/gi, "\n\n")
          .replace(/<p>/gi, "")
          .replace(/<\/p>/gi, "")
          .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
          .replace(/<b>(.*?)<\/b>/gi, "**$1**")
          .replace(/<em>(.*?)<\/em>/gi, "*$1*")
          .replace(/<i>(.*?)<\/i>/gi, "*$1*")
          .replace(/•/gi, "- ");

        $convertFromMarkdownString(htmlToMarkdown, TRANSFORMERS);
      },
    };
  }, [selectedValue, options, darkMode, id]);

  return (
    <div
      className={cn(
        "my-4 p-4 border rounded-lg",
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
      )}
    >
      <div className="mb-2">
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium mb-1",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}
        >
          Select an option:
        </label>
        <Select onValueChange={handleValueChange} defaultValue={firstOption}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose an option..." />
          </SelectTrigger>
          <SelectContent>
            {optionKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedValue && (
        <div
          className={cn(
            "mt-4 border rounded relative",
            darkMode
              ? "bg-gray-900 border-gray-600"
              : "bg-white border-gray-200"
          )}
        >
          <LexicalComposer
            key={selectedValue}
            initialConfig={nestedEditorConfig}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={cn(
                    "outline-none resize-none min-h-[60px] p-2",
                    darkMode ? "text-gray-100" : "text-gray-900"
                  )}
                />
              }
              placeholder={
                <div className={cn(
                  "absolute top-2 left-2 pointer-events-none text-sm",
                  darkMode ? "text-gray-500" : "text-gray-400"
                )}>
                  Edit the selected content...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </LexicalComposer>
        </div>
      )}
    </div>
  );
};
