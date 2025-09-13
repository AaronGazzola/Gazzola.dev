"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/tailwind.utils";
import { useEditorStore } from "@/app/(editor)/layout.stores";

export const FullStackOrFrontEnd = () => {
  const { getSectionOptions, getSectionContent, setSectionSelection, getSectionSelection, darkMode, updateInclusionRules } = useEditorStore();
  const [isFullStack, setIsFullStack] = useState<boolean | null>(null);
  
  useEffect(() => {
    const currentSelection = getSectionSelection("section1");
    if (currentSelection === "option1") {
      setIsFullStack(true);
      updateInclusionRules({ "database": true });
    } else if (currentSelection === "option2") {
      setIsFullStack(false);
      updateInclusionRules({ "database": false });
    }
  }, [getSectionSelection, updateInclusionRules]);

  const handleToggle = useCallback(() => {
    const newValue = !isFullStack;
    setIsFullStack(newValue);
    const option = newValue ? "option1" : "option2";
    setSectionSelection("section1", option);
    updateInclusionRules({ "database": newValue });
  }, [isFullStack, setSectionSelection, updateInclusionRules]);

  return (
    <div className={cn(
      "flex items-center justify-center gap-4 p-6 rounded-lg",
      darkMode ? "bg-gray-800" : "bg-gray-50"
    )}>
      <span className={cn(
        "text-sm font-medium",
        darkMode ? "text-gray-300" : "text-gray-700"
      )}>
        Frontend
      </span>
      
      <button
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isFullStack === null 
            ? darkMode ? "bg-gray-600" : "bg-gray-300"
            : isFullStack 
            ? "bg-blue-600" 
            : darkMode ? "bg-gray-600" : "bg-gray-400",
          darkMode && "focus:ring-offset-gray-900"
        )}
        role="switch"
        aria-checked={isFullStack ?? false}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            isFullStack === null
              ? "translate-x-2.5"
              : isFullStack 
              ? "translate-x-5" 
              : "translate-x-0"
          )}
        />
      </button>
      
      <span className={cn(
        "text-sm font-medium",
        darkMode ? "text-gray-300" : "text-gray-700"
      )}>
        Full Stack
      </span>
    </div>
  );
};