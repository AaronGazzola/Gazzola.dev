"use client";

import { cn } from "@/lib/tailwind.utils";
import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useEditorStore } from "../layout.stores";
import { useWalkthroughStore } from "@/app/layout.stores";

export interface SerializedPlaceholderNode
  extends Spread<
    {
      placeholderKey: string;
      defaultValue: string;
    },
    SerializedLexicalNode
  > {}

export class PlaceholderNode extends DecoratorNode<ReactNode> {
  __placeholderKey: string;
  __defaultValue: string;

  static getType(): string {
    return "placeholder";
  }

  static clone(node: PlaceholderNode): PlaceholderNode {
    return new PlaceholderNode(
      node.__placeholderKey,
      node.__defaultValue,
      node.__key
    );
  }

  constructor(placeholderKey: string, defaultValue: string, key?: NodeKey) {
    super(key);
    this.__placeholderKey = placeholderKey;
    this.__defaultValue = defaultValue;
  }

  static importJSON(
    serializedNode: SerializedPlaceholderNode
  ): PlaceholderNode {
    const { placeholderKey, defaultValue } = serializedNode;
    return $createPlaceholderNode(placeholderKey, defaultValue);
  }

  exportJSON(): SerializedPlaceholderNode {
    return {
      placeholderKey: this.__placeholderKey,
      defaultValue: this.__defaultValue,
      type: "placeholder",
      version: 1,
    };
  }

  getPlaceholderKey(): string {
    return this.__placeholderKey;
  }

  getDefaultValue(): string {
    return this.__defaultValue;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "placeholder-node-container";
    span.setAttribute("data-walkthrough", "placeholder-node");
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return (
      <PlaceholderNodeComponent
        placeholderKey={this.__placeholderKey}
        defaultValue={this.__defaultValue}
      />
    );
  }

  isInline(): true {
    return true;
  }

  isKeyboardSelectable(): true {
    return true;
  }
}

export function $createPlaceholderNode(
  placeholderKey: string,
  defaultValue: string
): PlaceholderNode {
  return new PlaceholderNode(placeholderKey, defaultValue);
}

export function $isPlaceholderNode(
  node: LexicalNode | null | undefined
): node is PlaceholderNode {
  return node instanceof PlaceholderNode;
}

interface PlaceholderNodeComponentProps {
  placeholderKey: string;
  defaultValue: string;
}

function PlaceholderNodeComponent({
  placeholderKey,
  defaultValue,
}: PlaceholderNodeComponentProps) {
  const { getPlaceholderValue, setPlaceholderValue, darkMode } =
    useEditorStore();
  const { isActiveTarget, canAutoProgress, autoProgressWalkthrough } = useWalkthroughStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const currentValue = getPlaceholderValue(placeholderKey) || defaultValue;

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleClick = useCallback(() => {
    setIsEditing(true);
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleSave = useCallback(() => {
    setPlaceholderValue(placeholderKey, localValue.trim() || defaultValue);
    setIsEditing(false);
  }, [placeholderKey, localValue, defaultValue, setPlaceholderValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
        if (canAutoProgress("placeholder-element")) {
          autoProgressWalkthrough();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setLocalValue(currentValue);
        setIsEditing(false);
      }
    },
    [handleSave, currentValue, canAutoProgress, autoProgressWalkthrough]
  );

  const handleBlur = useCallback(() => {
    handleSave();
    if (canAutoProgress("placeholder-element")) {
      autoProgressWalkthrough();
    }
  }, [handleSave, canAutoProgress, autoProgressWalkthrough]);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(width + 4);
    }
  }, [localValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <>
      <span
        ref={measureRef}
        className={cn(
          "inline-block border font-medium rounded px-1 py-0.5 min-w-[2ch] absolute opacity-0 pointer-events-none",
          isActiveTarget("placeholder-node")
            ? darkMode
              ? "text-blue-100 bg-blue-900 border-blue-400"
              : "text-blue-900 bg-blue-50 border-blue-500"
            : darkMode
              ? "text-gray-100 bg-gray-800 border-gray-600"
              : "text-gray-900 bg-gray-50 border-gray-200"
        )}
        style={{
          left: "-9999px",
          top: "-9999px",
        }}
        aria-hidden="true"
      >
        {localValue || " "}
      </span>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "inline-block border font-medium rounded px-1 py-0.5 min-w-[2ch] focus:outline focus:outline-2",
            isActiveTarget("placeholder-node")
              ? darkMode
                ? "text-blue-100 bg-blue-900 border-blue-400 focus:bg-blue-800 focus:outline-blue-400 ring-2 ring-blue-400/50"
                : "text-blue-900 bg-blue-50 border-blue-500 focus:bg-blue-100 focus:outline-blue-500 ring-2 ring-blue-500/50"
              : darkMode
                ? "text-gray-100 bg-gray-800 border-gray-600 focus:bg-gray-750 focus:outline-blue-500"
                : "text-gray-900 bg-gray-50 border-gray-200 focus:bg-gray-100 focus:outline-blue-500"
          )}
          style={{
            width: inputWidth > 0 ? `${inputWidth}px` : "2ch",
          }}
        />
      ) : (
        <span
          onClick={handleClick}
          className={cn(
            "inline-block cursor-pointer font-medium rounded px-1 py-0.5 border transition-colors",
            isActiveTarget("placeholder-node")
              ? darkMode
                ? "text-blue-100 bg-blue-900 border-blue-400 hover:bg-blue-800 ring-2 ring-blue-400/50"
                : "text-blue-900 bg-blue-50 border-blue-500 hover:bg-blue-100 ring-2 ring-blue-500/50"
              : darkMode
                ? "text-gray-100 bg-gray-800 border-gray-600 hover:bg-gray-750"
                : "text-gray-900 bg-gray-50 border-gray-200 hover:bg-gray-100"
          )}
          title={`Click to edit "${placeholderKey}"`}
        >
          {currentValue}
        </span>
      )}
    </>
  );
}
