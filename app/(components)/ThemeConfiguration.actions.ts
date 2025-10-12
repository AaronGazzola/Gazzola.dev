"use server";

import { parseThemesFromJSON } from "./ThemeConfiguration.utils";
import { ParsedTheme } from "./ThemeConfiguration.types";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  const themes = parseThemesFromJSON();
  console.log("SERVER: bubble gum dark primary =", themes[4]?.dark.colors.primary);
  return themes;
}
