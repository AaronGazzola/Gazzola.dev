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
  primary: "oklch(0.2050 0 0)",
  primaryForeground: "oklch(0.9850 0 0)",
  secondary: "oklch(0.9700 0 0)",
  secondaryForeground: "oklch(0.2050 0 0)",
  accent: "oklch(0.9700 0 0)",
  accentForeground: "oklch(0.2050 0 0)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.1450 0 0)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.1450 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.1450 0 0)",
  muted: "oklch(0.9700 0 0)",
  mutedForeground: "oklch(0.5560 0 0)",
  destructive: "oklch(0.5770 0.2450 27.3250)",
  destructiveForeground: "oklch(1 0 0)",
  border: "oklch(0.9220 0 0)",
  input: "oklch(0.9220 0 0)",
  ring: "oklch(0.7080 0 0)",
  chart1: "oklch(0.8100 0.1000 252)",
  chart2: "oklch(0.6200 0.1900 260)",
  chart3: "oklch(0.5500 0.2200 263)",
  chart4: "oklch(0.4900 0.2200 264)",
  chart5: "oklch(0.4200 0.1800 266)",
  sidebarBackground: "oklch(0.9850 0 0)",
  sidebarForeground: "oklch(0.1450 0 0)",
  sidebarPrimary: "oklch(0.2050 0 0)",
  sidebarPrimaryForeground: "oklch(0.9850 0 0)",
  sidebarAccent: "oklch(0.9700 0 0)",
  sidebarAccentForeground: "oklch(0.2050 0 0)",
  sidebarBorder: "oklch(0.9220 0 0)",
  sidebarRing: "oklch(0.7080 0 0)",
};

const defaultDarkColors: ThemeColors = {
  primary: "oklch(0.9220 0 0)",
  primaryForeground: "oklch(0.2050 0 0)",
  secondary: "oklch(0.2690 0 0)",
  secondaryForeground: "oklch(0.9850 0 0)",
  accent: "oklch(0.3710 0 0)",
  accentForeground: "oklch(0.9850 0 0)",
  background: "oklch(0.1450 0 0)",
  foreground: "oklch(0.9850 0 0)",
  card: "oklch(0.2050 0 0)",
  cardForeground: "oklch(0.9850 0 0)",
  popover: "oklch(0.2690 0 0)",
  popoverForeground: "oklch(0.9850 0 0)",
  muted: "oklch(0.2690 0 0)",
  mutedForeground: "oklch(0.7080 0 0)",
  destructive: "oklch(0.7040 0.1910 22.2160)",
  destructiveForeground: "oklch(0.9850 0 0)",
  border: "oklch(0.2750 0 0)",
  input: "oklch(0.3250 0 0)",
  ring: "oklch(0.5560 0 0)",
  chart1: "oklch(0.8100 0.1000 252)",
  chart2: "oklch(0.6200 0.1900 260)",
  chart3: "oklch(0.5500 0.2200 263)",
  chart4: "oklch(0.4900 0.2200 264)",
  chart5: "oklch(0.4200 0.1800 266)",
  sidebarBackground: "oklch(0.2050 0 0)",
  sidebarForeground: "oklch(0.9850 0 0)",
  sidebarPrimary: "oklch(0.4880 0.2430 264.3760)",
  sidebarPrimaryForeground: "oklch(0.9850 0 0)",
  sidebarAccent: "oklch(0.2690 0 0)",
  sidebarAccentForeground: "oklch(0.9850 0 0)",
  sidebarBorder: "oklch(0.2750 0 0)",
  sidebarRing: "oklch(0.4390 0 0)",
};

const defaultTypography: ThemeTypography = {
  fontSans: "var(--font-inter)",
  fontSerif: "Georgia, serif",
  fontMono: "var(--font-fira-code)",
  primaryFont: "sans",
  letterSpacing: 0,
};

const defaultOther: ThemeOther = {
  hueShift: 0,
  saturationMultiplier: 1,
  lightnessMultiplier: 1,
  radius: 0.5,
  spacing: 0.25,
  shadow: {
    color: "oklch(0 0 0)",
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
      hasInteracted: false,
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
              ...state.theme.typography,
              [mode]: { ...state.theme.typography[mode], ...typography },
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
              ...state.theme.other,
              [mode]: {
                ...state.theme.other[mode],
                shadow: {
                  ...state.theme.other[mode].shadow,
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
      setHasInteracted: (value) => set({ hasInteracted: value }),
      resetTheme: () => set({ theme: defaultTheme, hasInteracted: false }),
    }),
    {
      name: "theme-storage",
      version: 5,
      migrate: (persistedState: any, version: number) => {
        if (version < 3 || !persistedState?.theme?.typography?.light) {
          return { theme: defaultTheme, hasInteracted: false };
        }
        if (version < 4) {
          return { ...persistedState, hasInteracted: false };
        }
        if (version < 5) {
          return {
            ...persistedState,
            theme: {
              ...persistedState.theme,
              typography: {
                light: {
                  ...persistedState.theme.typography.light,
                  primaryFont: persistedState.theme.typography.light.primaryFont || "sans",
                },
                dark: {
                  ...persistedState.theme.typography.dark,
                  primaryFont: persistedState.theme.typography.dark.primaryFont || "sans",
                },
              },
            },
          };
        }
        return persistedState;
      },
    }
  )
);
