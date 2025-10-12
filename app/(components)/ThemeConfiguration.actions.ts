"use server";

import { parseThemesFromCSS } from "./ThemeConfiguration.utils";
import { ParsedTheme } from "./ThemeConfiguration.types";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  const themes = parseThemesFromCSS();
  console.log("SERVER: bubble gum dark primary =", themes[4]?.dark.colors.primary);
  return themes;
}
