import { useMemo } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useEditorStore } from "@/app/(editor)/layout.stores";
import { ThemeColors, ThemeTypography, ThemeOther } from "./ThemeConfiguration.types";

interface UseThemeReturn {
  colors: ThemeColors;
  typography: ThemeTypography;
  other: ThemeOther;
  darkMode: boolean;
  hsl: (color: string) => string;
  radiusRem: string;
  spacingRem: string;
  shadowStyle: string;
}

export const useTheme = (): UseThemeReturn => {
  const theme = useThemeStore((state) => state.theme);
  const darkMode = useEditorStore((state) => state.darkMode);

  return useMemo(() => {
    const mode = darkMode ? "dark" : "light";
    const colors = theme.colors[mode];
    const typography = theme.typography[mode];
    const other = theme.other[mode];

    const hsl = (color: string) => `hsl(${color})`;
    const radiusRem = `${other.radius}rem`;
    const spacingRem = `${other.spacing}rem`;
    const shadowStyle = `${other.shadow.offsetX}px ${other.shadow.offsetY}px ${other.shadow.blurRadius}px ${other.shadow.spread}px hsl(${other.shadow.color} / ${other.shadow.opacity})`;

    return {
      colors,
      typography,
      other,
      darkMode,
      hsl,
      radiusRem,
      spacingRem,
      shadowStyle,
    };
  }, [theme, darkMode]);
};
