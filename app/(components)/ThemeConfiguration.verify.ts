import { ThemeConfiguration, ParsedTheme } from "./ThemeConfiguration.types";

export interface VerificationResult {
  isComplete: boolean;
  missingFields: string[];
  mismatchedFields: Array<{
    field: string;
    mode: "light" | "dark";
    storeValue: any;
    themeValue: any;
  }>;
}

export const verifyThemeApplication = (
  storeTheme: ThemeConfiguration,
  parsedTheme: ParsedTheme,
  selectedThemeIndex: number
): VerificationResult => {
  const missingFields: string[] = [];
  const mismatchedFields: Array<{
    field: string;
    mode: "light" | "dark";
    storeValue: any;
    themeValue: any;
  }> = [];

  if (storeTheme.selectedTheme !== selectedThemeIndex) {
    mismatchedFields.push({
      field: "selectedTheme",
      mode: "light",
      storeValue: storeTheme.selectedTheme,
      themeValue: selectedThemeIndex,
    });
  }

  const verifyColors = (mode: "light" | "dark") => {
    const storeColors = storeTheme.colors[mode];
    const themeColors = parsedTheme[mode].colors;

    const colorKeys: (keyof typeof themeColors)[] = [
      "primary",
      "primaryForeground",
      "secondary",
      "secondaryForeground",
      "accent",
      "accentForeground",
      "background",
      "foreground",
      "card",
      "cardForeground",
      "popover",
      "popoverForeground",
      "muted",
      "mutedForeground",
      "destructive",
      "destructiveForeground",
      "border",
      "input",
      "ring",
      "chart1",
      "chart2",
      "chart3",
      "chart4",
      "chart5",
      "sidebarBackground",
      "sidebarForeground",
      "sidebarPrimary",
      "sidebarPrimaryForeground",
      "sidebarAccent",
      "sidebarAccentForeground",
      "sidebarBorder",
      "sidebarRing",
    ];

    for (const key of colorKeys) {
      if (!storeColors[key]) {
        missingFields.push(`colors.${mode}.${key}`);
      } else if (storeColors[key] !== themeColors[key]) {
        mismatchedFields.push({
          field: `colors.${key}`,
          mode,
          storeValue: storeColors[key],
          themeValue: themeColors[key],
        });
      }
    }
  };

  const verifyTypography = (mode: "light" | "dark") => {
    const storeTypography = storeTheme.typography[mode];
    const themeTypography = parsedTheme[mode].typography;

    const typographyKeys: (keyof typeof themeTypography)[] = [
      "fontSans",
      "fontSerif",
      "fontMono",
      "letterSpacing",
    ];

    for (const key of typographyKeys) {
      if (storeTypography[key] === undefined) {
        missingFields.push(`typography.${mode}.${key}`);
      } else if (storeTypography[key] !== themeTypography[key]) {
        mismatchedFields.push({
          field: `typography.${key}`,
          mode,
          storeValue: storeTypography[key],
          themeValue: themeTypography[key],
        });
      }
    }
  };

  const verifyOther = (mode: "light" | "dark") => {
    const storeOther = storeTheme.other[mode];
    const themeOther = parsedTheme[mode].other;

    const otherKeys: (keyof typeof themeOther)[] = [
      "hueShift",
      "saturationMultiplier",
      "lightnessMultiplier",
      "radius",
      "spacing",
    ];

    for (const key of otherKeys) {
      if (storeOther[key] === undefined) {
        missingFields.push(`other.${mode}.${key}`);
      } else if (storeOther[key] !== themeOther[key]) {
        mismatchedFields.push({
          field: `other.${key}`,
          mode,
          storeValue: storeOther[key],
          themeValue: themeOther[key],
        });
      }
    }

    const shadowKeys: (keyof typeof themeOther.shadow)[] = [
      "color",
      "opacity",
      "blurRadius",
      "spread",
      "offsetX",
      "offsetY",
    ];

    for (const key of shadowKeys) {
      if (storeOther.shadow[key] === undefined) {
        missingFields.push(`other.${mode}.shadow.${key}`);
      } else if (storeOther.shadow[key] !== themeOther.shadow[key]) {
        mismatchedFields.push({
          field: `other.shadow.${key}`,
          mode,
          storeValue: storeOther.shadow[key],
          themeValue: themeOther.shadow[key],
        });
      }
    }
  };

  verifyColors("light");
  verifyColors("dark");
  verifyTypography("light");
  verifyTypography("dark");
  verifyOther("light");
  verifyOther("dark");

  return {
    isComplete: missingFields.length === 0 && mismatchedFields.length === 0,
    missingFields,
    mismatchedFields,
  };
};
