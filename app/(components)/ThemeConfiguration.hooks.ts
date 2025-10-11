import { useEffect } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";

export const useApplyTheme = (darkMode: boolean) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    const mode = darkMode ? "dark" : "light";
    const colors = theme.colors[mode];
    const typography = theme.typography[mode];
    const other = theme.other[mode];

    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });

    root.style.setProperty("--font-sans", typography.fontSans);
    root.style.setProperty("--font-serif", typography.fontSerif);
    root.style.setProperty("--font-mono", typography.fontMono);
    root.style.setProperty("--tracking-normal", `${typography.letterSpacing}em`);

    root.style.setProperty("--radius", `${other.radius}rem`);
    root.style.setProperty("--spacing", `${other.spacing}`);
    root.style.setProperty("--shadow-x", `${other.shadow.offsetX}px`);
    root.style.setProperty("--shadow-y", `${other.shadow.offsetY}px`);
    root.style.setProperty("--shadow-blur", `${other.shadow.blurRadius}px`);
    root.style.setProperty("--shadow-spread", `${other.shadow.spread}px`);
    root.style.setProperty("--shadow-opacity", `${other.shadow.opacity}`);
    root.style.setProperty("--shadow-color", other.shadow.color);
  }, [theme, darkMode]);
};
