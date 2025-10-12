import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ThemeConfiguration,
  ThemeState,
  ThemeColors,
  ThemeTypography,
  ThemeOther,
} from "./ThemeConfiguration.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { sanitizeThemeColors, sanitizeThemeOther } from "./ThemeConfiguration.sanitize";

const defaultLightColors: ThemeColors = {
  primary: "222.2 47.4% 11.2%",
  primaryForeground: "210 40% 98%",
  secondary: "210 40% 96.1%",
  secondaryForeground: "222.2 47.4% 11.2%",
  accent: "210 40% 96.1%",
  accentForeground: "222.2 47.4% 11.2%",
  background: "0 0% 100%",
  foreground: "222.2 47.4% 11.2%",
  card: "0 0% 100%",
  cardForeground: "222.2 47.4% 11.2%",
  popover: "0 0% 100%",
  popoverForeground: "222.2 47.4% 11.2%",
  muted: "210 40% 96.1%",
  mutedForeground: "215.4 16.3% 46.9%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "210 40% 98%",
  border: "214.3 31.8% 91.4%",
  input: "214.3 31.8% 91.4%",
  ring: "222.2 47.4% 11.2%",
  chart1: "40 70% 50%",
  chart2: "80 70% 50%",
  chart3: "120 70% 50%",
  chart4: "160 70% 50%",
  chart5: "200 70% 50%",
  sidebarBackground: "0 0% 98%",
  sidebarForeground: "240 5.3% 26.1%",
  sidebarPrimary: "240 5.9% 10%",
  sidebarPrimaryForeground: "0 0% 98%",
  sidebarAccent: "240 4.8% 95.9%",
  sidebarAccentForeground: "240 5.9% 10%",
  sidebarBorder: "220 13% 91%",
  sidebarRing: "217.2 91.2% 59.8%",
};

const defaultDarkColors: ThemeColors = {
  primary: "210 40% 98%",
  primaryForeground: "222.2 47.4% 11.2%",
  secondary: "217.2 32.6% 17.5%",
  secondaryForeground: "210 40% 98%",
  accent: "217.2 32.6% 17.5%",
  accentForeground: "210 40% 98%",
  background: "222.2 84% 4.9%",
  foreground: "210 40% 98%",
  card: "222.2 84% 4.9%",
  cardForeground: "210 40% 98%",
  popover: "222.2 84% 4.9%",
  popoverForeground: "210 40% 98%",
  muted: "217.2 32.6% 17.5%",
  mutedForeground: "215 20.2% 65.1%",
  destructive: "0 62.8% 30.6%",
  destructiveForeground: "210 40% 98%",
  border: "217.2 32.6% 17.5%",
  input: "217.2 32.6% 17.5%",
  ring: "212.7 26.8% 83.9%",
  chart1: "40 70% 50%",
  chart2: "80 70% 50%",
  chart3: "120 70% 50%",
  chart4: "160 70% 50%",
  chart5: "200 70% 50%",
  sidebarBackground: "222.2 84% 4.9%",
  sidebarForeground: "210 40% 98%",
  sidebarPrimary: "210 40% 98%",
  sidebarPrimaryForeground: "222.2 47.4% 11.2%",
  sidebarAccent: "217.2 32.6% 17.5%",
  sidebarAccentForeground: "210 40% 98%",
  sidebarBorder: "217.2 32.6% 17.5%",
  sidebarRing: "217.2 91.2% 59.8%",
};

const defaultTypography: ThemeTypography = {
  fontSans: "var(--font-inter)",
  fontSerif: "Georgia, serif",
  fontMono: "var(--font-fira-code)",
  letterSpacing: 0,
};

const defaultOther: ThemeOther = {
  hueShift: 0,
  saturationMultiplier: 1,
  lightnessMultiplier: 1,
  radius: 0.5,
  spacing: 0.25,
  shadow: {
    color: "0 0% 0%",
    opacity: 0.1,
    blurRadius: 10,
    spread: 0,
    offsetX: 0,
    offsetY: 4,
  },
};

const defaultTheme: ThemeConfiguration = {
  selectedTheme: 0,
  colors: {
    light: defaultLightColors,
    dark: defaultDarkColors,
  },
  typography: {
    light: defaultTypography,
    dark: defaultTypography,
  },
  other: {
    light: defaultOther,
    dark: defaultOther,
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      setTheme: (theme) =>
        set((state) => ({
          theme: { ...state.theme, ...theme },
        })),
      updateColors: (mode, colors) =>
        set((state) => ({
          theme: {
            ...state.theme,
            colors: {
              ...state.theme.colors,
              [mode]: { ...state.theme.colors[mode], ...colors },
            },
          },
        })),
      updateColor: (mode, colorKey, value) =>
        set((state) => ({
          theme: {
            ...state.theme,
            colors: {
              ...state.theme.colors,
              [mode]: {
                ...state.theme.colors[mode],
                [colorKey]: value
              },
            },
          },
        })),
      updateTypography: (mode, typography) =>
        set((state) => ({
          theme: {
            ...state.theme,
            typography: {
              light: { ...state.theme.typography.light, ...typography },
              dark: { ...state.theme.typography.dark, ...typography },
            },
          },
        })),
      updateOther: (mode, other) =>
        set((state) => ({
          theme: {
            ...state.theme,
            other: {
              light: { ...state.theme.other.light, ...other },
              dark: { ...state.theme.other.dark, ...other },
            },
          },
        })),
      updateShadow: (mode, shadowField, value) =>
        set((state) => ({
          theme: {
            ...state.theme,
            other: {
              light: {
                ...state.theme.other.light,
                shadow: {
                  ...state.theme.other.light.shadow,
                  [shadowField]: value,
                },
              },
              dark: {
                ...state.theme.other.dark,
                shadow: {
                  ...state.theme.other.dark.shadow,
                  [shadowField]: value,
                },
              },
            },
          },
        })),
      setThemePreset: (themeIndex) =>
        set((state) => ({
          theme: {
            ...state.theme,
            selectedTheme: themeIndex,
          },
        })),
      applyThemePreset: (themeIndex, parsedTheme) => {
        const lightColorsSanitized = sanitizeThemeColors(parsedTheme.light.colors);
        const darkColorsSanitized = sanitizeThemeColors(parsedTheme.dark.colors);
        const lightOtherSanitized = sanitizeThemeOther(parsedTheme.light.other);
        const darkOtherSanitized = sanitizeThemeOther(parsedTheme.dark.other);

        conditionalLog({
          action: "store_applyThemePreset_start",
          timestamp: Date.now(),
          themeIndex: themeIndex,
          themeName: parsedTheme.name,
          lightColors: parsedTheme.light.colors,
          darkColors: parsedTheme.dark.colors,
          lightColorsSanitized: lightColorsSanitized,
          darkColorsSanitized: darkColorsSanitized,
          lightTypography: parsedTheme.light.typography,
          darkTypography: parsedTheme.dark.typography,
          lightOther: parsedTheme.light.other,
          darkOther: parsedTheme.dark.other
        }, { label: LOG_LABELS.THEME });

        set(() => {
          const newTheme = {
            selectedTheme: themeIndex,
            colors: {
              light: lightColorsSanitized,
              dark: darkColorsSanitized,
            },
            typography: {
              light: parsedTheme.light.typography,
              dark: parsedTheme.dark.typography,
            },
            other: {
              light: lightOtherSanitized,
              dark: darkOtherSanitized,
            },
          };

          conditionalLog({
            action: "store_applyThemePreset_complete",
            timestamp: Date.now(),
            themeIndex: themeIndex,
            themeName: parsedTheme.name,
            newTheme: newTheme
          }, { label: LOG_LABELS.THEME });

          return { theme: newTheme };
        });
      },
      resetTheme: () => set({ theme: defaultTheme }),
    }),
    {
      name: "theme-storage",
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version < 3 || !persistedState?.theme?.typography?.light) {
          return { theme: defaultTheme };
        }
        return persistedState;
      },
    }
  )
);
