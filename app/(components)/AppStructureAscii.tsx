"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { generateAppStructureAscii, generateRouteMapAscii } from "@/lib/download.utils";

export const AppStructureAscii = () => {
  const { appStructure } = useEditorStore();

  const asciiStructure = generateAppStructureAscii(appStructure);
  const asciiRouteMap = generateRouteMapAscii(appStructure);

  return (
    <div className="theme-bg-card theme-radius theme-p-4">
      <pre className="theme-font-mono text-sm overflow-x-auto theme-text-foreground">
        <code>{asciiStructure}</code>
      </pre>
      <pre className="theme-font-mono text-sm overflow-x-auto theme-mt-4 theme-text-foreground">
        <code>{asciiRouteMap}</code>
      </pre>
    </div>
  );
};
