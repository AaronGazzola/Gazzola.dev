"use server";

import { ParsedTheme } from "./ThemeConfiguration.types";
import themesData from "@/public/data/processed-themes.json";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  const themes = themesData as ParsedTheme[];
  console.log(JSON.stringify({action:"loadThemesAction",themeCount:themes.length,bubbleGumDarkPrimary:themes[4]?.dark.colors.primary}));
  return themes;
}
