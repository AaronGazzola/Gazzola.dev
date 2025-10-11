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
  typography: ThemeTypography;
  other: ThemeOther;
}

export interface ThemeState {
  theme: ThemeConfiguration;
  setTheme: (theme: Partial<ThemeConfiguration>) => void;
  updateColors: (mode: "light" | "dark", colors: Partial<ThemeColors>) => void;
  updateTypography: (typography: Partial<ThemeTypography>) => void;
  updateOther: (other: Partial<ThemeOther>) => void;
  setThemePreset: (themeIndex: number) => void;
  resetTheme: () => void;
}
