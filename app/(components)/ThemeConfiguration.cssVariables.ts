import { useEffect } from "react";
import { useThemeStore } from "./ThemeConfiguration.stores";
import { useEditorStore } from "@/app/(editor)/layout.stores";

export const useThemeCSSVariables = () => {
  const theme = useThemeStore((state) => state.theme);
  const darkMode = useEditorStore((state) => state.darkMode);

  useEffect(() => {
    const mode = darkMode ? "dark" : "light";
    const colors = theme.colors[mode];
    const typography = theme.typography[mode];
    const other = theme.other[mode];

    const root = document.documentElement;

    root.style.setProperty("--theme-primary", `hsl(${colors.primary})`);
    root.style.setProperty("--theme-primary-foreground", `hsl(${colors.primaryForeground})`);
    root.style.setProperty("--theme-secondary", `hsl(${colors.secondary})`);
    root.style.setProperty("--theme-secondary-foreground", `hsl(${colors.secondaryForeground})`);
    root.style.setProperty("--theme-accent", `hsl(${colors.accent})`);
    root.style.setProperty("--theme-accent-foreground", `hsl(${colors.accentForeground})`);
    root.style.setProperty("--theme-background", `hsl(${colors.background})`);
    root.style.setProperty("--theme-foreground", `hsl(${colors.foreground})`);
    root.style.setProperty("--theme-card", `hsl(${colors.card})`);
    root.style.setProperty("--theme-card-foreground", `hsl(${colors.cardForeground})`);
    root.style.setProperty("--theme-popover", `hsl(${colors.popover})`);
    root.style.setProperty("--theme-popover-foreground", `hsl(${colors.popoverForeground})`);
    root.style.setProperty("--theme-muted", `hsl(${colors.muted})`);
    root.style.setProperty("--theme-muted-foreground", `hsl(${colors.mutedForeground})`);
    root.style.setProperty("--theme-destructive", `hsl(${colors.destructive})`);
    root.style.setProperty("--theme-destructive-foreground", `hsl(${colors.destructiveForeground})`);
    root.style.setProperty("--theme-border", `hsl(${colors.border})`);
    root.style.setProperty("--theme-input", `hsl(${colors.input})`);
    root.style.setProperty("--theme-ring", `hsl(${colors.ring})`);
    root.style.setProperty("--theme-chart-1", `hsl(${colors.chart1})`);
    root.style.setProperty("--theme-chart-2", `hsl(${colors.chart2})`);
    root.style.setProperty("--theme-chart-3", `hsl(${colors.chart3})`);
    root.style.setProperty("--theme-chart-4", `hsl(${colors.chart4})`);
    root.style.setProperty("--theme-chart-5", `hsl(${colors.chart5})`);
    root.style.setProperty("--theme-sidebar-background", `hsl(${colors.sidebarBackground})`);
    root.style.setProperty("--theme-sidebar-foreground", `hsl(${colors.sidebarForeground})`);
    root.style.setProperty("--theme-sidebar-primary", `hsl(${colors.sidebarPrimary})`);
    root.style.setProperty("--theme-sidebar-primary-foreground", `hsl(${colors.sidebarPrimaryForeground})`);
    root.style.setProperty("--theme-sidebar-accent", `hsl(${colors.sidebarAccent})`);
    root.style.setProperty("--theme-sidebar-accent-foreground", `hsl(${colors.sidebarAccentForeground})`);
    root.style.setProperty("--theme-sidebar-border", `hsl(${colors.sidebarBorder})`);
    root.style.setProperty("--theme-sidebar-ring", `hsl(${colors.sidebarRing})`);

    const resolveFontVariable = (fontValue: string): string => {
      if (fontValue.startsWith("var(--font-")) {
        const varName = fontValue.slice(4, -1);
        const bodyStyle = getComputedStyle(document.body);
        const resolved = bodyStyle.getPropertyValue(varName).trim();
        return resolved || fontValue;
      }
      return fontValue;
    };

    root.style.setProperty("--theme-font-sans", resolveFontVariable(typography.fontSans));
    root.style.setProperty("--theme-font-serif", resolveFontVariable(typography.fontSerif));
    root.style.setProperty("--theme-font-mono", resolveFontVariable(typography.fontMono));
    root.style.setProperty("--theme-letter-spacing", `${typography.letterSpacing}em`);

    root.style.setProperty("--theme-radius", `${other.radius}rem`);
    root.style.setProperty("--theme-spacing", `${other.spacing}rem`);

    root.style.setProperty("--theme-shadow-color", `hsl(${other.shadow.color})`);
    root.style.setProperty("--theme-shadow-opacity", `${other.shadow.opacity}`);
    root.style.setProperty("--theme-shadow-blur", `${other.shadow.blurRadius}px`);
    root.style.setProperty("--theme-shadow-spread", `${other.shadow.spread}px`);
    root.style.setProperty("--theme-shadow-x", `${other.shadow.offsetX}px`);
    root.style.setProperty("--theme-shadow-y", `${other.shadow.offsetY}px`);
    root.style.setProperty("--theme-shadow", `${other.shadow.offsetX}px ${other.shadow.offsetY}px ${other.shadow.blurRadius}px ${other.shadow.spread}px hsl(${other.shadow.color} / ${other.shadow.opacity})`);
  }, [theme, darkMode]);
};
