"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useEditorStore } from "../(editor)/layout.stores";
import { IDE_OPTIONS, IDEType } from "./IDESelection.types";
import {
  ClaudeCodeLogo,
  CursorLogo,
  GitHubSmallLogo,
  LovableLogo,
  ReplitLogo,
  VSCodeLogo,
} from "./IDESelection.utils";

const SECTION_FILE_PATH = "start-here.next-steps";

const IDE_LOGOS: Record<
  IDEType,
  React.ComponentType<{ className?: string }>
> = {
  lovable: LovableLogo,
  replit: ReplitLogo,
  claudecode: ClaudeCodeLogo,
  cursor: CursorLogo,
};

export const IDESelection = () => {
  const { darkMode, setSectionInclude, getSectionInclude } = useEditorStore();
  const [selectedIDE, setSelectedIDE] = useState<IDEType>("lovable");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const lovableIncluded = getSectionInclude(
      SECTION_FILE_PATH,
      "section1",
      "option1"
    );
    const replitIncluded = getSectionInclude(
      SECTION_FILE_PATH,
      "section1",
      "option2"
    );
    const claudecodeIncluded = getSectionInclude(
      SECTION_FILE_PATH,
      "section1",
      "option3"
    );
    const cursorIncluded = getSectionInclude(
      SECTION_FILE_PATH,
      "section1",
      "option4"
    );

    const selectedCount = [
      lovableIncluded,
      replitIncluded,
      claudecodeIncluded,
      cursorIncluded,
    ].filter(Boolean).length;

    if (selectedCount !== 1) {
      setSectionInclude(SECTION_FILE_PATH, "section1", "option1", true);
      setSectionInclude(SECTION_FILE_PATH, "section1", "option2", false);
      setSectionInclude(SECTION_FILE_PATH, "section1", "option3", false);
      setSectionInclude(SECTION_FILE_PATH, "section1", "option4", false);
      setSelectedIDE("lovable");
    } else {
      if (lovableIncluded) setSelectedIDE("lovable");
      else if (replitIncluded) setSelectedIDE("replit");
      else if (claudecodeIncluded) setSelectedIDE("claudecode");
      else if (cursorIncluded) setSelectedIDE("cursor");
    }
  }, [mounted, getSectionInclude, setSectionInclude]);

  const handleIDEChange = useCallback(
    (ideType: IDEType) => {
      setSelectedIDE(ideType);

      if (ideType === "lovable") {
        setSectionInclude(SECTION_FILE_PATH, "section1", "option1", true);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option2", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option3", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option4", false);
      } else if (ideType === "replit") {
        setSectionInclude(SECTION_FILE_PATH, "section1", "option1", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option2", true);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option3", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option4", false);
      } else if (ideType === "claudecode") {
        setSectionInclude(SECTION_FILE_PATH, "section1", "option1", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option2", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option3", true);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option4", false);
      } else if (ideType === "cursor") {
        setSectionInclude(SECTION_FILE_PATH, "section1", "option1", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option2", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option3", false);
        setSectionInclude(SECTION_FILE_PATH, "section1", "option4", true);
      }
    },
    [setSectionInclude]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full theme-my-8 theme-font-sans theme-tracking">
      <div className="theme-mb-6">
        <h3 className="text-xl font-semibold theme-mb-2 theme-text-foreground theme-font-sans theme-tracking">
          Choose Your Development Environment
        </h3>
        <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
          Select the IDE you&apos;ll use to build your application
        </p>
      </div>

      <div className="grid grid-cols-1 theme-gap-3">
        {IDE_OPTIONS.map((ide) => {
          const isSelected = selectedIDE === ide.id;
          const LogoComponent = IDE_LOGOS[ide.id];

          return (
            <button
              key={ide.id}
              onClick={() => handleIDEChange(ide.id)}
              className={cn(
                "theme-p-4 theme-radius border-2 transition-all duration-200",
                "hover:theme-shadow focus:outline-none focus:ring-2 focus:ring-offset-2",
                "flex items-center justify-between theme-font-sans theme-tracking",
                isSelected
                  ? "theme-border-primary theme-bg-primary/10 theme-shadow"
                  : "theme-border-border theme-bg-card hover:theme-bg-accent",
                "focus:ring-[hsl(var(--primary))]"
              )}
            >
              <div className="flex items-center theme-gap-4 flex-1">
                <div className="flex flex-col xs:flex-row xs:items-center theme-gap-2 flex-1">
                  <div className="flex items-center theme-gap-4">
                    <LogoComponent className="w-8 h-8 flex-shrink-0 theme-text-foreground" />
                    <h4
                      className={cn(
                        "text-lg font-semibold theme-font-sans theme-tracking",
                        isSelected
                          ? "theme-text-primary"
                          : "theme-text-foreground"
                      )}
                    >
                      {ide.name}
                    </h4>
                  </div>

                  <div className="flex items-center theme-gap-2 ml-12 xs:ml-0">
                    <Plus className="w-4 h-4 theme-text-muted-foreground" />
                    <GitHubSmallLogo className="w-5 h-5 theme-text-muted-foreground" />
                    {ide.id === "claudecode" && (
                      <>
                        <Plus className="w-4 h-4 theme-text-muted-foreground" />
                        <VSCodeLogo className="w-5 h-5 theme-text-muted-foreground" />
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isSelected
                      ? "theme-border-primary theme-bg-primary"
                      : "theme-border-muted-foreground"
                  )}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full theme-bg-primary-foreground" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
