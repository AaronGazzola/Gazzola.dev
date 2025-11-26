import type { IDEType } from "@/app/(components)/IDESelection.types";
import { IDE_ROBOTS_DISPLAY_NAMES } from "@/app/(editor)/layout.types";

export const getSelectedIDE = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): IDEType => {
  const windsurfIncluded = getSectionInclude("ai-integration", "section1", "option1");
  const claudecodeIncluded = getSectionInclude("ai-integration", "section1", "option2");
  const cursorIncluded = getSectionInclude("ai-integration", "section1", "option3");

  if (windsurfIncluded) return "windsurf";
  if (cursorIncluded) return "cursor";
  return "claudecode";
};

export const getDynamicRobotsFileName = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): string => {
  const selectedIDE = getSelectedIDE(getSectionInclude);
  return IDE_ROBOTS_DISPLAY_NAMES[selectedIDE];
};
