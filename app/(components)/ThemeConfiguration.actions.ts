"use server";

import { ParsedTheme } from "./ThemeConfiguration.types";
import fs from "fs";
import path from "path";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  const themesPath = path.join(process.cwd(), "public", "data", "processed-themes.json");
  const themesData = fs.readFileSync(themesPath, "utf-8");
  const themes = JSON.parse(themesData) as ParsedTheme[];
  console.log(JSON.stringify({action:"loadThemesAction",themeCount:themes.length,bubbleGumDarkPrimary:themes[4]?.dark.colors.primary}));
  return themes;
}
