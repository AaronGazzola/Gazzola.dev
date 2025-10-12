"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { resetPlaceholderTracking } from "./PlaceholderTransformer";

export function FirstPlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    resetPlaceholderTracking();
  }, [editor]);

  return null;
}
