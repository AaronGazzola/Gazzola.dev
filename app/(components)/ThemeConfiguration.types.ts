export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemeTypography {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: number;
}

export interface ThemeShadow {
  color: string;
  opacity: number;
  blurRadius: number;
  spread: number;
  offsetX: number;
  offsetY: number;
}

export interface ThemeOther {
  hueShift: number;
  saturationMultiplier: number;
  lightnessMultiplier: number;
  radius: number;
  spacing: number;
  shadow: ThemeShadow;
}

export interface ThemeConfiguration {
  selectedTheme: number;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: {
    light: ThemeTypography;
    dark: ThemeTypography;
  };
  other: {
    light: ThemeOther;
    dark: ThemeOther;
  };
}

export interface ParsedTheme {
  name: string;
  light: {
    colors: ThemeColors;
    typography: ThemeTypography;
    other: ThemeOther;
  };
  dark: {
    colors: ThemeColors;
    typography: ThemeTypography;
    other: ThemeOther;
  };
  previewColors: string[];
}

export interface ThemeState {
  theme: ThemeConfiguration;
  hasInteracted: boolean;
  setTheme: (theme: Partial<ThemeConfiguration>) => void;
  updateColors: (mode: "light" | "dark", colors: Partial<ThemeColors>) => void;
  updateColor: (mode: "light" | "dark", colorKey: keyof ThemeColors, value: string) => void;
  updateTypography: (mode: "light" | "dark", typography: Partial<ThemeTypography>) => void;
  updateOther: (mode: "light" | "dark", other: Partial<ThemeOther>) => void;
  updateShadow: (mode: "light" | "dark", shadowField: keyof ThemeShadow, value: number | string) => void;
  setThemePreset: (themeIndex: number) => void;
  applyThemePreset: (themeIndex: number, parsedTheme: ParsedTheme) => void;
  setHasInteracted: (value: boolean) => void;
  resetTheme: () => void;
}
