import type { IDEType } from "@/app/(editor)/layout.types";
import { IDE_ROBOTS_DISPLAY_NAMES } from "@/app/(editor)/layout.types";

export const getSelectedIDE = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): IDEType => {
  return "claudecode";
};

export const getDynamicRobotsFileName = (
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean
): string => {
  const selectedIDE = getSelectedIDE(getSectionInclude);
  return IDE_ROBOTS_DISPLAY_NAMES[selectedIDE];
};
