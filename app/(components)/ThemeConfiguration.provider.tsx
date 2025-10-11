"use client";

import { useEffect } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useEditorStore } from "@/app/(editor)/layout.stores";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();
  const { darkMode } = useEditorStore();

  useEffect(() => {
    const root = document.documentElement;
    const mode = darkMode ? "dark" : "light";
    const colors = theme.colors[mode];
    const typography = theme.typography[mode];
    const other = theme.other[mode];

    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    root.style.setProperty("--font-sans", typography.fontSans);
    root.style.setProperty("--font-serif", typography.fontSerif);
    root.style.setProperty("--font-mono", typography.fontMono);
    root.style.setProperty(
      "--letter-spacing",
      `${typography.letterSpacing}px`
    );

    root.style.setProperty("--radius", `${other.radius}rem`);
    root.style.setProperty("--spacing", `${other.spacing}rem`);

    const shadow = other.shadow;
    root.style.setProperty(
      "--shadow",
      `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px hsl(${shadow.color} / ${shadow.opacity})`
    );
  }, [theme, darkMode]);

  return <>{children}</>;
};
