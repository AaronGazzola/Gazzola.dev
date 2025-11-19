"use client";

import { useEffect, useRef, useMemo } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/github.css";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("plaintext", plaintext);

interface CodeViewerProps {
  code: string;
  language?: string;
  darkMode: boolean;
}

export const CodeViewer = ({
  code,
  language = "typescript",
  darkMode,
}: CodeViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightedCode = useMemo(() => {
    try {
      const result = hljs.highlight(code, {
        language: language || "plaintext",
      });
      return result.value;
    } catch (error) {
      return hljs.highlight(code, { language: "plaintext" }).value;
    }
  }, [code, language]);

  const lines = useMemo(() => {
    return highlightedCode.split("\n");
  }, [highlightedCode]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-auto code-viewer ${
        darkMode ? "hljs-github-dark" : "hljs-github-light"
      }`}
      style={{
        backgroundColor: darkMode ? "#0d1117" : "#ffffff",
        color: darkMode ? "#e6edf3" : "#1f2328",
      }}
    >
      <pre
        className="m-0 h-full"
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.5",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            padding: "1.5rem 0",
          }}
        >
          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                <td
                  className="line-number"
                  style={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    paddingLeft: "1.5rem",
                    textAlign: "right",
                    userSelect: "none",
                    color: darkMode ? "#6e7681" : "#57606a",
                    verticalAlign: "top",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  className="line-content"
                  style={{
                    paddingRight: "1.5rem",
                    verticalAlign: "top",
                    width: "100%",
                  }}
                >
                  <code
                    dangerouslySetInnerHTML={{ __html: line || " " }}
                    style={{ background: "transparent" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    </div>
  );
};
