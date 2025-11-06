"use server";

import { ParsedTheme } from "./ThemeConfiguration.types";
import themesData from "@/public/data/processed-themes.json";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  const themes = themesData as ParsedTheme[];
  conditionalLog(
    {
      action: "loadThemesAction",
      themeCount: themes.length,
      bubbleGumDarkPrimary: themes[4]?.dark.colors.primary,
    },
    { label: LOG_LABELS.THEME }
  );
  return themes;
}
