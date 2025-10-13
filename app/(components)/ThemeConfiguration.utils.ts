import { ThemeColors, ThemeTypography, ThemeOther, ThemeShadow } from "./ThemeConfiguration.types";
import { sanitizeThemeColors, sanitizeThemeOther } from "./ThemeConfiguration.sanitize";
import { oklchToHex } from "./ThemeConfiguration.colorUtils";
import fs from "fs";
import path from "path";

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

const normalizeFontValue = (fontValue: string): string => {
  const fontMap: Record<string, string> = {
    "Inter, sans-serif": "var(--font-inter)",
    "Roboto, sans-serif": "var(--font-roboto)",
    "Open Sans, sans-serif": "var(--font-open-sans)",
    "Lato, sans-serif": "var(--font-lato)",
    "Montserrat, sans-serif": "var(--font-montserrat)",
    "Poppins, sans-serif": "var(--font-poppins)",
    "Source Sans 3, sans-serif": "var(--font-source-sans)",
    "Raleway, sans-serif": "var(--font-raleway)",
    "DM Sans, sans-serif": "var(--font-dm-sans)",
    "Plus Jakarta Sans, sans-serif": "var(--font-plus-jakarta)",
    "Outfit, sans-serif": "var(--font-outfit)",
    "Quicksand, sans-serif": "var(--font-quicksand)",
    "Oxanium, sans-serif": "var(--font-oxanium)",
    '"Oxanium", sans-serif': "var(--font-oxanium)",
    "Architects Daughter, sans-serif": "var(--font-architects-daughter)",
    "Geist, sans-serif": "system-ui, sans-serif",
    "Merriweather, serif": "var(--font-merriweather)",
    "Playfair Display, serif": "var(--font-playfair)",
    "Lora, serif": "var(--font-lora)",
    '"Lora", Georgia, serif': "var(--font-lora)",
    "PT Serif, serif": "var(--font-pt-serif)",
    "Crimson Text, serif": "var(--font-crimson)",
    "Libre Baskerville, serif": "var(--font-libre-baskerville)",
    "Source Serif 4, serif": "Georgia, serif",
    "Source Code Pro, monospace": "var(--font-source-code)",
    '"Source Code Pro", monospace': "var(--font-source-code)",
    "JetBrains Mono, monospace": "var(--font-jetbrains)",
    "Fira Code, monospace": "var(--font-fira-code)",
    '"Fira Code", "Courier New", monospace': "var(--font-fira-code)",
    '"Fira Code", monospace': "var(--font-fira-code)",
    "IBM Plex Mono, monospace": "var(--font-ibm-plex)",
    "Space Mono, monospace": "var(--font-space-mono)",
    "Roboto Mono, monospace": "var(--font-roboto-mono)",
    "Ubuntu Mono, monospace": "var(--font-ubuntu-mono)",
    "Geist Mono, monospace": "var(--font-geist-mono)",
    "Geist Mono, ui-monospace, monospace": "var(--font-geist-mono)",
    "Georgia, serif": "Georgia, serif",
    "Menlo, monospace": "Menlo, monospace",
    '"Courier New", Courier, monospace': "'Courier New', Courier, monospace",
    "Courier New, monospace": "'Courier New', Courier, monospace",
    "monospace": "monospace",
    "serif": "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif': "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  };

  return fontMap[fontValue] || fontValue;
};

const parseThemeObject = (themeObj: Record<string, string>): {
  colors: Partial<ThemeColors>;
  typography: Partial<ThemeTypography>;
  other: Partial<ThemeOther>;
} => {
  const colors: Partial<ThemeColors> = {};
  const typography: Partial<ThemeTypography> = {};
  const other: any = { shadow: {} };

  for (const [key, value] of Object.entries(themeObj)) {
    if (value.startsWith("oklch(")) {
      const varName = key.replace(/^--/, "");
      const camelCase = varName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      if (varName === "sidebar") {
        colors.sidebarBackground = value;
      } else if (varName.startsWith("shadow-color")) {
        other.shadow.color = value;
      } else {
        (colors as any)[camelCase] = value;
      }
    } else if (value.startsWith("hsl(")) {
      const hslMatch = value.match(/hsl\(([^)]+)\)/);
      if (hslMatch) {
        const varName = key.replace(/^--/, "");
        if (varName === "shadow-color") {
          other.shadow.color = value;
        }
      }
    } else if (key === "--font-sans") {
      typography.fontSans = normalizeFontValue(value);
    } else if (key === "--font-serif") {
      typography.fontSerif = normalizeFontValue(value);
    } else if (key === "--font-mono") {
      typography.fontMono = normalizeFontValue(value);
    } else if (key === "--tracking-normal") {
      typography.letterSpacing = parseFloat(value.replace("em", ""));
    } else if (key === "--radius") {
      other.radius = parseFloat(value.replace("rem", ""));
    } else if (key === "--spacing") {
      other.spacing = parseFloat(value.replace("rem", ""));
    } else if (key === "--shadow-x") {
      other.shadow.offsetX = parseFloat(value.replace("px", ""));
    } else if (key === "--shadow-y") {
      other.shadow.offsetY = parseFloat(value.replace("px", ""));
    } else if (key === "--shadow-blur") {
      other.shadow.blurRadius = parseFloat(value.replace("px", ""));
    } else if (key === "--shadow-spread") {
      other.shadow.spread = parseFloat(value.replace("px", ""));
    } else if (key === "--shadow-opacity") {
      other.shadow.opacity = parseFloat(value);
    }
  }

  other.hueShift = 0;
  other.saturationMultiplier = 1;
  other.lightnessMultiplier = 1;

  return { colors, typography, other };
};

export const parseThemesFromJSON = (): ParsedTheme[] => {
  const jsonPath = path.join(process.cwd(), "public", "data", "themes.json");
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(jsonContent);

  const themes: ParsedTheme[] = data.themes.map((theme: any) => {
    const lightParsed = parseThemeObject(theme.light);
    const darkParsed = parseThemeObject(theme.dark);

    const lightColors = sanitizeThemeColors({ ...defaultLightColors, ...lightParsed.colors });
    const darkColors = sanitizeThemeColors({ ...defaultDarkColors, ...darkParsed.colors });

    const lightTypography = { ...defaultTypography, ...lightParsed.typography };
    const darkTypography = { ...defaultTypography, ...darkParsed.typography };

    const lightOther = sanitizeThemeOther({
      ...defaultOther,
      ...lightParsed.other,
      shadow: { ...defaultOther.shadow, ...lightParsed.other.shadow }
    });
    const darkOther = sanitizeThemeOther({
      ...defaultOther,
      ...darkParsed.other,
      shadow: { ...defaultOther.shadow, ...darkParsed.other.shadow }
    });

    const previewColors = [
      theme.light["--primary"] ? oklchToHex(theme.light["--primary"]) : "#09090b",
      theme.light["--secondary"] ? oklchToHex(theme.light["--secondary"]) : "#fafafa",
      theme.light["--accent"] ? oklchToHex(theme.light["--accent"]) : "#f4f4f5",
      theme.light["--background"] ? oklchToHex(theme.light["--background"]) : "#18181b",
    ];

    return {
      name: theme.name,
      light: {
        colors: lightColors,
        typography: lightTypography,
        other: lightOther,
      },
      dark: {
        colors: darkColors,
        typography: darkTypography,
        other: darkOther,
      },
      previewColors,
    };
  });

  return themes;
};
