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
import { useWalkthroughStore } from "../layout.walkthrough.stores";
import { WalkthroughStep } from "../layout.walkthrough.types";
import { WalkthroughHelper } from "@/components/WalkthroughHelper";

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
  __isFirstPlaceholder: boolean;

  static getType(): string {
    return "placeholder";
  }

  static clone(node: PlaceholderNode): PlaceholderNode {
    return new PlaceholderNode(
      node.__placeholderKey,
      node.__defaultValue,
      node.__isFirstPlaceholder,
      node.__key
    );
  }

  constructor(
    placeholderKey: string,
    defaultValue: string,
    isFirstPlaceholder: boolean = false,
    key?: NodeKey
  ) {
    super(key);
    this.__placeholderKey = placeholderKey;
    this.__defaultValue = defaultValue;
    this.__isFirstPlaceholder = isFirstPlaceholder;
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
        isFirstPlaceholder={this.__isFirstPlaceholder}
      />
    );
  }

  setIsFirstPlaceholder(isFirst: boolean): void {
    const writable = this.getWritable();
    writable.__isFirstPlaceholder = isFirst;
  }

  getIsFirstPlaceholder(): boolean {
    return this.__isFirstPlaceholder;
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
  defaultValue: string,
  isFirstPlaceholder: boolean = false
): PlaceholderNode {
  return new PlaceholderNode(placeholderKey, defaultValue, isFirstPlaceholder);
}

export function $isPlaceholderNode(
  node: LexicalNode | null | undefined
): node is PlaceholderNode {
  return node instanceof PlaceholderNode;
}

interface PlaceholderNodeComponentProps {
  placeholderKey: string;
  defaultValue: string;
  isFirstPlaceholder?: boolean;
}

function PlaceholderNodeComponent({
  placeholderKey,
  defaultValue,
  isFirstPlaceholder = false,
}: PlaceholderNodeComponentProps) {
  const { getPlaceholderValue, setPlaceholderValue, darkMode } =
    useEditorStore();
  const { shouldShowStep, markStepComplete, isStepOpen, setStepOpen } =
    useWalkthroughStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const [inputWidth, setInputWidth] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentValue = getPlaceholderValue(placeholderKey) || defaultValue;
  const showPlaceholderHelp = mounted && isFirstPlaceholder && shouldShowStep(WalkthroughStep.PLACEHOLDER);

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
      } else if (e.key === "Escape") {
        e.preventDefault();
        setLocalValue(currentValue);
        setIsEditing(false);
      }
    },
    [handleSave, currentValue]
  );

  const handleBlur = useCallback(() => {
    handleSave();
    if (isFirstPlaceholder && showPlaceholderHelp) {
      markStepComplete(WalkthroughStep.PLACEHOLDER);
    }
  }, [handleSave, isFirstPlaceholder, showPlaceholderHelp, markStepComplete]);

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
    <span className="relative inline-block placeholder-node-container">
      <span
        ref={measureRef}
        className={cn(
          "inline-block border font-medium rounded px-1 py-0.5 min-w-[2ch] absolute opacity-0 pointer-events-none",
          darkMode
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
            darkMode
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
            darkMode
              ? "text-gray-100 bg-gray-800 border-gray-600 hover:bg-gray-750"
              : "text-gray-900 bg-gray-50 border-gray-200 hover:bg-gray-100"
          )}
          title={`Click to edit "${placeholderKey}"`}
        >
          {currentValue}
        </span>
      )}
      {showPlaceholderHelp && (
        <WalkthroughHelper
          isOpen={popoverOpen}
          onOpenChange={(open) => {
            setPopoverOpen(open);
            if (!open && isStepOpen(WalkthroughStep.PLACEHOLDER)) {
              markStepComplete(WalkthroughStep.PLACEHOLDER);
            } else if (open && !isStepOpen(WalkthroughStep.PLACEHOLDER)) {
              setStepOpen(WalkthroughStep.PLACEHOLDER, true);
            }
          }}
          showAnimation={!isStepOpen(WalkthroughStep.PLACEHOLDER)}
          title="Placeholder Values"
          description="Click on any placeholder like this to edit it. When you change a placeholder value, it will automatically update everywhere it appears throughout your roadmap documents."
          iconSize="sm"
          className="ml-1 align-middle"
        />
      )}
    </span>
  );
}
