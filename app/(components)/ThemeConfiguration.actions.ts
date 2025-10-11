"use server";

import { parseThemesFromCSS } from "./ThemeConfiguration.utils";
import { ParsedTheme } from "./ThemeConfiguration.types";

export async function loadThemesAction(): Promise<ParsedTheme[]> {
  return parseThemesFromCSS();
}
