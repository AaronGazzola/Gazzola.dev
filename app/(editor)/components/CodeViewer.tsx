"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  code: string;
  language?: string;
  darkMode: boolean;
}

export const CodeViewer = ({
  code,
  language = "tsx",
  darkMode,
}: CodeViewerProps) => {
  return (
    <div className="w-full h-full overflow-auto theme-bg-background">
      <SyntaxHighlighter
        language={language}
        style={darkMode ? oneDark : oneLight}
        showLineNumbers={true}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          background: "transparent",
        }}
        lineNumberStyle={{
          minWidth: "3em",
          paddingRight: "1em",
          userSelect: "none",
          opacity: 0.5,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
