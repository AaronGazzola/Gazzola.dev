"use client";

import { useEffect } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useEditorStore } from "@/app/(editor)/layout.stores";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();
  const { darkMode } = useEditorStore();

  useEffect(() => {
    const root = document.documentElement;
    const colors = darkMode ? theme.colors.dark : theme.colors.light;

    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    root.style.setProperty("--font-sans", theme.typography.fontSans);
    root.style.setProperty("--font-serif", theme.typography.fontSerif);
    root.style.setProperty("--font-mono", theme.typography.fontMono);
    root.style.setProperty(
      "--letter-spacing",
      `${theme.typography.letterSpacing}px`
    );

    root.style.setProperty("--radius", `${theme.other.radius}rem`);
    root.style.setProperty("--spacing", `${theme.other.spacing}rem`);

    const shadow = theme.other.shadow;
    root.style.setProperty(
      "--shadow",
      `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px hsl(${shadow.color} / ${shadow.opacity})`
    );
  }, [theme, darkMode]);

  return <>{children}</>;
};
