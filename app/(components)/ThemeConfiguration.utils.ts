import { ThemeColors, ThemeTypography, ThemeOther, ThemeShadow } from "./ThemeConfiguration.types";
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
  if (!match) return "0 0% 0%";

  const [, lStr, cStr, hStr] = match;
  const L = parseFloat(lStr);
  const C = parseFloat(cStr);
  const h = parseFloat(hStr);

  const lightness = L * 100;
  const saturation = C * 100;
  const hue = h;

  return `${hue.toFixed(1)} ${saturation.toFixed(1)}% ${lightness.toFixed(1)}%`;
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

const parseThemeBlock = (block: string): {
  colors: Partial<ThemeColors>;
  typography: Partial<ThemeTypography>;
  other: Partial<ThemeOther>;
} => {
  const colors: Partial<ThemeColors> = {};
  const typography: Partial<ThemeTypography> = {};
  const other: any = {
    shadow: {}
  };

  const lines = block.split("\n");

  for (const line of lines) {
    const colorMatch = line.match(/--([a-z-]+):\s*oklch\([^)]+\);/);
    if (colorMatch) {
      const [, varName, value] = line.match(/--([a-z-]+):\s*(oklch\([^)]+\));/) || [];
      if (varName && value) {
        const hsl = oklchToHsl(value);
        const camelCase = varName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

        if (varName === "sidebar") {
          colors.sidebarBackground = hsl;
        } else {
          (colors as any)[camelCase] = hsl;
        }
      }
    }

    if (line.includes("--font-sans:")) {
      let fontValue = line.replace(/.*--font-sans:\s*/, "").trim();
      let currentIndex = lines.indexOf(line);
      while (!fontValue.includes(";") && currentIndex < lines.length - 1) {
        currentIndex++;
        fontValue += " " + lines[currentIndex].trim();
      }
      fontValue = fontValue.replace(/;$/, "").trim();
      typography.fontSans = fontValue;
    }
    if (line.includes("--font-serif:")) {
      let fontValue = line.replace(/.*--font-serif:\s*/, "").trim();
      let currentIndex = lines.indexOf(line);
      while (!fontValue.includes(";") && currentIndex < lines.length - 1) {
        currentIndex++;
        fontValue += " " + lines[currentIndex].trim();
      }
      fontValue = fontValue.replace(/;$/, "").trim();
      typography.fontSerif = fontValue;
    }
    if (line.includes("--font-mono:")) {
      let fontValue = line.replace(/.*--font-mono:\s*/, "").trim();
      let currentIndex = lines.indexOf(line);
      while (!fontValue.includes(";") && currentIndex < lines.length - 1) {
        currentIndex++;
        fontValue += " " + lines[currentIndex].trim();
      }
      fontValue = fontValue.replace(/;$/, "").trim();
      typography.fontMono = fontValue;
    }

    if (line.includes("--radius:")) {
      const match = line.match(/--radius:\s*([0-9.]+)rem;/);
      if (match) other.radius = parseFloat(match[1]);
    }
    if (line.includes("--spacing:")) {
      const match = line.match(/--spacing:\s*([0-9.]+)rem;/);
      if (match) other.spacing = parseFloat(match[1]);
    }
    if (line.includes("--tracking-normal:")) {
      const match = line.match(/--tracking-normal:\s*(-?[0-9.]+)em;/);
      if (match) typography.letterSpacing = parseFloat(match[1]);
    }

    if (line.includes("--shadow-x:")) {
      const match = line.match(/--shadow-x:\s*(-?[0-9.]+)(px)?;/);
      if (match) other.shadow!.offsetX = parseFloat(match[1]);
    }
    if (line.includes("--shadow-y:")) {
      const match = line.match(/--shadow-y:\s*(-?[0-9.]+)(px)?;/);
      if (match) other.shadow!.offsetY = parseFloat(match[1]);
    }
    if (line.includes("--shadow-blur:")) {
      const match = line.match(/--shadow-blur:\s*([0-9.]+)(px)?;/);
      if (match) other.shadow!.blurRadius = parseFloat(match[1]);
    }
    if (line.includes("--shadow-spread:")) {
      const match = line.match(/--shadow-spread:\s*(-?[0-9.]+)(px)?;/);
      if (match) other.shadow!.spread = parseFloat(match[1]);
    }
    if (line.includes("--shadow-opacity:")) {
      const match = line.match(/--shadow-opacity:\s*([0-9.]+);/);
      if (match) other.shadow!.opacity = parseFloat(match[1]);
    }
    if (line.includes("--shadow-color:")) {
      const hslMatch = line.match(/--shadow-color:\s*hsl\(([^)]+)\);/);
      const oklchMatch = line.match(/--shadow-color:\s*(oklch\([^)]+\));/);
      if (hslMatch) {
        other.shadow!.color = hslMatch[1];
      } else if (oklchMatch) {
        other.shadow!.color = oklchToHsl(oklchMatch[1]);
      }
    }
  }

  other.hueShift = 0;
  other.saturationMultiplier = 1;
  other.lightnessMultiplier = 1;

  return { colors, typography, other };
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
  fontSans: "Inter, system-ui, sans-serif",
  fontSerif: "Georgia, serif",
  fontMono: "Fira Code, monospace",
  letterSpacing: 0,
};

const defaultOther: ThemeOther = {
  hueShift: 0,
  saturationMultiplier: 1,
  lightnessMultiplier: 1,
  radius: 0.5,
  spacing: 1,
  shadow: {
    color: "0 0% 0%",
    opacity: 0.1,
    blurRadius: 10,
    spread: 0,
    offsetX: 0,
    offsetY: 4,
  },
};

export const parseThemesFromCSS = (): ParsedTheme[] => {
  const cssPath = path.join(process.cwd(), "public", "data", "css", "ThemeTemplates.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  const themeRegex = /\/\*\s*(.+?)\s*\*\/\s*\n\n:root\s*\{([\s\S]+?)\}\s*\n\n\.dark\s*\{([\s\S]+?)\}/g;
  const matches = Array.from(cssContent.matchAll(themeRegex));

  const themes: ParsedTheme[] = matches.map((match) => {
    const [, name, lightBlock, darkBlock] = match;

    const lightParsed = parseThemeBlock(lightBlock);
    const darkParsed = parseThemeBlock(darkBlock);

    const lightColors = { ...defaultLightColors, ...lightParsed.colors };
    const darkColors = { ...defaultDarkColors, ...darkParsed.colors };

    const lightTypography = { ...defaultTypography, ...lightParsed.typography };
    const darkTypography = { ...defaultTypography, ...darkParsed.typography };

    const lightOther = {
      ...defaultOther,
      ...lightParsed.other,
      shadow: { ...defaultOther.shadow, ...lightParsed.other.shadow }
    };
    const darkOther = {
      ...defaultOther,
      ...darkParsed.other,
      shadow: { ...defaultOther.shadow, ...darkParsed.other.shadow }
    };

    const primaryMatch = lightBlock.match(/--primary:\s*(oklch\([^)]+\));/);
    const secondaryMatch = lightBlock.match(/--secondary:\s*(oklch\([^)]+\));/);
    const accentMatch = lightBlock.match(/--accent:\s*(oklch\([^)]+\));/);
    const backgroundMatch = lightBlock.match(/--background:\s*(oklch\([^)]+\));/);

    const previewColors = [
      primaryMatch ? oklchToHex(primaryMatch[1]) : "#09090b",
      secondaryMatch ? oklchToHex(secondaryMatch[1]) : "#fafafa",
      accentMatch ? oklchToHex(accentMatch[1]) : "#f4f4f5",
      backgroundMatch ? oklchToHex(backgroundMatch[1]) : "#18181b",
    ];

    return {
      name: name.trim(),
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
