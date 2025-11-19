import type { IDEType } from "@/app/(components)/IDESelection.types";
import { IDE_ROBOTS_DISPLAY_NAMES } from "@/app/(editor)/layout.types";

export const getSelectedIDE = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): IDEType => {
  const lovableIncluded = getSectionInclude("ide", "section1", "option1");
  const replitIncluded = getSectionInclude("ide", "section1", "option2");
  const claudecodeIncluded = getSectionInclude("ide", "section1", "option3");
  const cursorIncluded = getSectionInclude("ide", "section1", "option4");

  if (lovableIncluded) return "lovable";
  if (replitIncluded) return "replit";
  if (cursorIncluded) return "cursor";
  return "claudecode";
};

export const getDynamicRobotsFileName = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): string => {
  const selectedIDE = getSelectedIDE(getSectionInclude);
  return IDE_ROBOTS_DISPLAY_NAMES[selectedIDE];
};
