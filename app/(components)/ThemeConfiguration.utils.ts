import { ThemeColors, ThemeTypography, ThemeOther, ThemeShadow } from "./ThemeConfiguration.types";
import { sanitizeThemeColors, sanitizeThemeOther } from "./ThemeConfiguration.sanitize";
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

const oklchToHsl = (oklch: string): string => {
  const match = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
  if (!match) {
    console.log(JSON.stringify({action:"oklch_parse_failed",input:oklch}));
    return "0 0% 0%";
  }

  const [, lStr, cStr, hStr] = match;
  const L = parseFloat(lStr);
  const C = parseFloat(cStr);
  const h = parseFloat(hStr);

  const lightness = L * 100;
  const saturation = C * 100;
  const hue = h;

  const result = `${hue.toFixed(1)} ${saturation.toFixed(1)}% ${lightness.toFixed(1)}%`;
  return result;
};

const oklchToHex = (oklch: string): string => {
  const match = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
  if (!match) return "#000000";

  const [, lStr, cStr, hStr] = match;
  const L = parseFloat(lStr);
  const C = parseFloat(cStr);
  const H = parseFloat(hStr);

  const aLab = C * Math.cos((H * Math.PI) / 180);
  const bLab = C * Math.sin((H * Math.PI) / 180);

  const fy = (L + 0.16) / 1.16;
  const fx = aLab / 5.0 + fy;
  const fz = fy - bLab / 2.0;

  const xr = fx ** 3 > 0.008856 ? fx ** 3 : (fx - 16 / 116) / 7.787;
  const yr = L > 0.08 ? ((L + 0.16) / 1.16) ** 3 : L / 9.033;
  const zr = fz ** 3 > 0.008856 ? fz ** 3 : (fz - 16 / 116) / 7.787;

  const X = xr * 95.047;
  const Y = yr * 100.0;
  const Z = zr * 108.883;

  let R = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
  let G = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
  let B = X * 0.000557 + Y * -0.00204 + Z * 0.01057;

  R = R > 0.0031308 ? 1.055 * R ** (1 / 2.4) - 0.055 : 12.92 * R;
  G = G > 0.0031308 ? 1.055 * G ** (1 / 2.4) - 0.055 : 12.92 * G;
  B = B > 0.0031308 ? 1.055 * B ** (1 / 2.4) - 0.055 : 12.92 * B;

  const r = Math.max(0, Math.min(255, Math.round(R * 255)));
  const g = Math.max(0, Math.min(255, Math.round(G * 255)));
  const b = Math.max(0, Math.min(255, Math.round(B * 255)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};


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
      const hsl = oklchToHsl(value);
      const varName = key.replace(/^--/, "");
      const camelCase = varName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      if (varName === "sidebar") {
        colors.sidebarBackground = hsl;
      } else if (varName.startsWith("shadow-color")) {
        other.shadow.color = hsl;
      } else {
        (colors as any)[camelCase] = hsl;
      }
    } else if (value.startsWith("hsl(")) {
      const hslMatch = value.match(/hsl\(([^)]+)\)/);
      if (hslMatch) {
        const varName = key.replace(/^--/, "");
        if (varName === "shadow-color") {
          other.shadow.color = hslMatch[1];
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
