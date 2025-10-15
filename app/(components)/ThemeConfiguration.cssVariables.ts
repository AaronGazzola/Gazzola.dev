import { useEditorStore } from "@/app/(editor)/layout.stores";
import { useEffect, useState } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";

export const useThemeCSSVariables = () => {
  const theme = useThemeStore((state) => state.theme);
  const darkMode = useEditorStore((state) => state.darkMode);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const mode = darkMode ? "dark" : "light";
    const colors = theme.colors[mode];
    const typography = theme.typography[mode];
    const other = theme.other[mode];

    const root = document.documentElement;

    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty(
      "--theme-primary-foreground",
      colors.primaryForeground
    );
    root.style.setProperty("--theme-secondary", colors.secondary);
    root.style.setProperty(
      "--theme-secondary-foreground",
      colors.secondaryForeground
    );
    root.style.setProperty("--theme-accent", colors.accent);
    root.style.setProperty(
      "--theme-accent-foreground",
      colors.accentForeground
    );
    root.style.setProperty("--theme-background", colors.background);
    root.style.setProperty("--theme-foreground", colors.foreground);
    root.style.setProperty("--theme-card", colors.card);
    root.style.setProperty("--theme-card-foreground", colors.cardForeground);
    root.style.setProperty("--theme-popover", colors.popover);
    root.style.setProperty(
      "--theme-popover-foreground",
      colors.popoverForeground
    );
    root.style.setProperty("--theme-muted", colors.muted);
    root.style.setProperty("--theme-muted-foreground", colors.mutedForeground);
    root.style.setProperty("--theme-destructive", colors.destructive);
    root.style.setProperty(
      "--theme-destructive-foreground",
      colors.destructiveForeground
    );
    root.style.setProperty("--theme-border", colors.border);
    root.style.setProperty("--theme-input", colors.input);
    root.style.setProperty("--theme-ring", colors.ring);
    root.style.setProperty("--theme-chart-1", colors.chart1);
    root.style.setProperty("--theme-chart-2", colors.chart2);
    root.style.setProperty("--theme-chart-3", colors.chart3);
    root.style.setProperty("--theme-chart-4", colors.chart4);
    root.style.setProperty("--theme-chart-5", colors.chart5);
    root.style.setProperty(
      "--theme-sidebar-background",
      colors.sidebarBackground
    );
    root.style.setProperty(
      "--theme-sidebar-foreground",
      colors.sidebarForeground
    );
    root.style.setProperty("--theme-sidebar-primary", colors.sidebarPrimary);
    root.style.setProperty(
      "--theme-sidebar-primary-foreground",
      colors.sidebarPrimaryForeground
    );
    root.style.setProperty("--theme-sidebar-accent", colors.sidebarAccent);
    root.style.setProperty(
      "--theme-sidebar-accent-foreground",
      colors.sidebarAccentForeground
    );
    root.style.setProperty("--theme-sidebar-border", colors.sidebarBorder);
    root.style.setProperty("--theme-sidebar-ring", colors.sidebarRing);

    const resolveFontVariable = (fontValue: string): string => {
      if (fontValue.startsWith("var(--font-")) {
        const varName = fontValue.slice(4, -1);
        const bodyStyle = getComputedStyle(document.body);
        const resolved = bodyStyle.getPropertyValue(varName).trim();
        return resolved || fontValue;
      }
      return fontValue;
    };

    root.style.setProperty(
      "--theme-font-sans",
      resolveFontVariable(typography.fontSans)
    );
    root.style.setProperty(
      "--theme-font-serif",
      resolveFontVariable(typography.fontSerif)
    );
    root.style.setProperty(
      "--theme-font-mono",
      resolveFontVariable(typography.fontMono)
    );
    root.style.setProperty(
      "--theme-letter-spacing",
      `${typography.letterSpacing}em`
    );

    root.style.setProperty("--theme-radius", `${other.radius}rem`);
    root.style.setProperty("--theme-spacing", `${other.spacing}rem`);

    root.style.setProperty("--theme-shadow-color", other.shadow.color);
    root.style.setProperty("--theme-shadow-opacity", `${other.shadow.opacity}`);
    root.style.setProperty(
      "--theme-shadow-blur",
      `${other.shadow.blurRadius}px`
    );
    root.style.setProperty("--theme-shadow-spread", `${other.shadow.spread}px`);
    root.style.setProperty("--theme-shadow-x", `${other.shadow.offsetX}px`);
    root.style.setProperty("--theme-shadow-y", `${other.shadow.offsetY}px`);

    const shadowColor = other.shadow.color.startsWith("#")
      ? `${other.shadow.color}${Math.round(other.shadow.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
      : other.shadow.color.startsWith("oklch(")
        ? other.shadow.color.includes(" / ")
          ? other.shadow.color.replace(
              /\s*\/\s*[0-9.]+\s*\)$/,
              ` / ${other.shadow.opacity})`
            )
          : other.shadow.color.replace(/\)$/, ` / ${other.shadow.opacity})`)
        : other.shadow.color.startsWith("hsl(")
          ? other.shadow.color.includes(" / ")
            ? other.shadow.color.replace(
                /\s*\/\s*[0-9.]+%?\s*\)$/,
                ` / ${other.shadow.opacity})`
              )
            : other.shadow.color.replace(/\)$/, ` / ${other.shadow.opacity})`)
          : other.shadow.color.startsWith("rgb(")
            ? other.shadow.color.replace(
                /rgb\(([^)]+)\)/,
                `rgba($1, ${other.shadow.opacity})`
              )
            : other.shadow.color;

    root.style.setProperty(
      "--theme-shadow",
      `${other.shadow.offsetX}px ${other.shadow.offsetY}px ${other.shadow.blurRadius}px ${other.shadow.spread}px ${shadowColor}`
    );

    setThemeReady(true);
  }, [theme, darkMode]);

  return themeReady;
};
