import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const COMPONENTS_SOURCE_DIR = join(process.cwd(), "components/editor/ui");
const COMPONENTS_DEST_DIR = join(process.cwd(), "public/data/components/ui");
const STYLES_DEST_DIR = join(process.cwd(), "public/data/styles");

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
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

interface ThemeTypography {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: number;
}

interface ThemeOther {
  radius: number;
  spacing: number;
  shadow: {
    color: string;
    opacity: number;
    blurRadius: number;
    spread: number;
    offsetX: number;
    offsetY: number;
  };
}

interface ThemeConfiguration {
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

function getThemeFromStorage(): ThemeConfiguration {
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

  try {
    const themeStoragePath = join(process.cwd(), ".next/cache/theme-storage.json");
    if (existsSync(themeStoragePath)) {
      const themeStoreState = readFileSync(themeStoragePath, "utf-8");
      const parsed = JSON.parse(themeStoreState);
      const theme = parsed?.state?.theme;
      if (theme) {
        return theme;
      }
    }
  } catch (error) {
  }

  return defaultTheme;
}

function generateGlobalCss(): string {
  const theme = getThemeFromStorage();
  const lightColors = theme.colors.light;
  const darkColors = theme.colors.dark;
  const lightTypography = theme.typography.light;
  const darkTypography = theme.typography.dark;
  const lightOther = theme.other.light;
  const darkOther = theme.other.dark;

  const colorKeys = [
    { key: "background", css: "--background" },
    { key: "foreground", css: "--foreground" },
    { key: "card", css: "--card" },
    { key: "cardForeground", css: "--card-foreground" },
    { key: "popover", css: "--popover" },
    { key: "popoverForeground", css: "--popover-foreground" },
    { key: "primary", css: "--primary" },
    { key: "primaryForeground", css: "--primary-foreground" },
    { key: "secondary", css: "--secondary" },
    { key: "secondaryForeground", css: "--secondary-foreground" },
    { key: "muted", css: "--muted" },
    { key: "mutedForeground", css: "--muted-foreground" },
    { key: "accent", css: "--accent" },
    { key: "accentForeground", css: "--accent-foreground" },
    { key: "destructive", css: "--destructive" },
    { key: "destructiveForeground", css: "--destructive-foreground" },
    { key: "border", css: "--border" },
    { key: "input", css: "--input" },
    { key: "ring", css: "--ring" },
    { key: "chart1", css: "--chart-1" },
    { key: "chart2", css: "--chart-2" },
    { key: "chart3", css: "--chart-3" },
    { key: "chart4", css: "--chart-4" },
    { key: "chart5", css: "--chart-5" },
    { key: "sidebarBackground", css: "--sidebar" },
    { key: "sidebarForeground", css: "--sidebar-foreground" },
    { key: "sidebarPrimary", css: "--sidebar-primary" },
    {
      key: "sidebarPrimaryForeground",
      css: "--sidebar-primary-foreground",
    },
    { key: "sidebarAccent", css: "--sidebar-accent" },
    {
      key: "sidebarAccentForeground",
      css: "--sidebar-accent-foreground",
    },
    { key: "sidebarBorder", css: "--sidebar-border" },
    { key: "sidebarRing", css: "--sidebar-ring" },
  ];

  const lines: string[] = ["@import \"tailwindcss\";", "@import \"tw-animate-css\";", "", "@custom-variant dark (&:is(.dark *));", "", ":root {"];

  colorKeys.forEach(({ key, css }) => {
    const color = (lightColors as any)[key];
    if (color) {
      lines.push(`  ${css}: ${color};`);
    }
  });

  lines.push(`  --font-sans:`);
  lines.push(`    ${lightTypography.fontSans};`);
  lines.push(`  --font-serif: ${lightTypography.fontSerif};`);
  lines.push(`  --font-mono:`);
  lines.push(`    ${lightTypography.fontMono};`);
  lines.push(`  --radius: ${lightOther.radius}rem;`);
  lines.push(`  --shadow-x: ${lightOther.shadow.offsetX};`);
  lines.push(`  --shadow-y: ${lightOther.shadow.offsetY}px;`);
  lines.push(`  --shadow-blur: ${lightOther.shadow.blurRadius}px;`);
  lines.push(`  --shadow-spread: ${lightOther.shadow.spread}px;`);
  lines.push(`  --shadow-opacity: ${lightOther.shadow.opacity};`);
  lines.push(`  --shadow-color: ${lightOther.shadow.color};`);
  lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-sm:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-md:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-lg:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-xl:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
  lines.push(`  --tracking-normal: ${lightTypography.letterSpacing}em;`);
  lines.push(`  --spacing: ${lightOther.spacing}rem;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.dark {`);

  colorKeys.forEach(({ key, css }) => {
    const color = (darkColors as any)[key];
    if (color) {
      lines.push(`  ${css}: ${color};`);
    }
  });

  lines.push(`  --font-sans:`);
  lines.push(`    ${darkTypography.fontSans};`);
  lines.push(`  --font-serif: ${darkTypography.fontSerif};`);
  lines.push(`  --font-mono:`);
  lines.push(`    ${darkTypography.fontMono};`);
  lines.push(`  --radius: ${darkOther.radius}rem;`);
  lines.push(`  --shadow-x: ${darkOther.shadow.offsetX};`);
  lines.push(`  --shadow-y: ${darkOther.shadow.offsetY}px;`);
  lines.push(`  --shadow-blur: ${darkOther.shadow.blurRadius}px;`);
  lines.push(`  --shadow-spread: ${darkOther.shadow.spread}px;`);
  lines.push(`  --shadow-opacity: ${darkOther.shadow.opacity};`);
  lines.push(`  --shadow-color: ${darkOther.shadow.color};`);
  lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
  lines.push(`  --shadow-sm:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-md:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-lg:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-xl:`);
  lines.push(`    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
  lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`@theme inline {`);
  lines.push(`  --color-background: var(--background);`);
  lines.push(`  --color-foreground: var(--foreground);`);
  lines.push(`  --color-card: var(--card);`);
  lines.push(`  --color-card-foreground: var(--card-foreground);`);
  lines.push(`  --color-popover: var(--popover);`);
  lines.push(`  --color-popover-foreground: var(--popover-foreground);`);
  lines.push(`  --color-primary: var(--primary);`);
  lines.push(`  --color-primary-foreground: var(--primary-foreground);`);
  lines.push(`  --color-secondary: var(--secondary);`);
  lines.push(`  --color-secondary-foreground: var(--secondary-foreground);`);
  lines.push(`  --color-muted: var(--muted);`);
  lines.push(`  --color-muted-foreground: var(--muted-foreground);`);
  lines.push(`  --color-accent: var(--accent);`);
  lines.push(`  --color-accent-foreground: var(--accent-foreground);`);
  lines.push(`  --color-destructive: var(--destructive);`);
  lines.push(`  --color-destructive-foreground: var(--destructive-foreground);`);
  lines.push(`  --color-border: var(--border);`);
  lines.push(`  --color-input: var(--input);`);
  lines.push(`  --color-ring: var(--ring);`);
  lines.push(`  --color-chart-1: var(--chart-1);`);
  lines.push(`  --color-chart-2: var(--chart-2);`);
  lines.push(`  --color-chart-3: var(--chart-3);`);
  lines.push(`  --color-chart-4: var(--chart-4);`);
  lines.push(`  --color-chart-5: var(--chart-5);`);
  lines.push(`  --color-sidebar: var(--sidebar);`);
  lines.push(`  --color-sidebar-foreground: var(--sidebar-foreground);`);
  lines.push(`  --color-sidebar-primary: var(--sidebar-primary);`);
  lines.push(`  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);`);
  lines.push(`  --color-sidebar-accent: var(--sidebar-accent);`);
  lines.push(`  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);`);
  lines.push(`  --color-sidebar-border: var(--sidebar-border);`);
  lines.push(`  --color-sidebar-ring: var(--sidebar-ring);`);
  lines.push(``);
  lines.push(`  --font-sans: var(--font-sans);`);
  lines.push(`  --font-mono: var(--font-mono);`);
  lines.push(`  --font-serif: var(--font-serif);`);
  lines.push(``);
  lines.push(`  --radius-sm: calc(var(--radius) - 4px);`);
  lines.push(`  --radius-md: calc(var(--radius) - 2px);`);
  lines.push(`  --radius-lg: var(--radius);`);
  lines.push(`  --radius-xl: calc(var(--radius) + 4px);`);
  lines.push(``);
  lines.push(`  --shadow-2xs: var(--shadow-2xs);`);
  lines.push(`  --shadow-xs: var(--shadow-xs);`);
  lines.push(`  --shadow-sm: var(--shadow-sm);`);
  lines.push(`  --shadow: var(--shadow);`);
  lines.push(`  --shadow-md: var(--shadow-md);`);
  lines.push(`  --shadow-lg: var(--shadow-lg);`);
  lines.push(`  --shadow-xl: var(--shadow-xl);`);
  lines.push(`  --shadow-2xl: var(--shadow-2xl);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-radius {`);
  lines.push(`  border-radius: var(--radius);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-shadow {`);
  lines.push(`  box-shadow: var(--shadow);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="checked"].theme-data-checked-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="checked"].theme-data-checked-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-state="unchecked"].theme-data-unchecked-bg-input {`);
  lines.push(`  background-color: var(--input);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-ring:focus-visible {`);
  lines.push(`  outline: none;`);
  lines.push(`  box-shadow: 0 0 0 2px var(--ring);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-selected-single="true"].theme-data-selected-single-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-selected-single="true"].theme-data-selected-single-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-start="true"].theme-data-range-start-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-start="true"].theme-data-range-start-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-end="true"].theme-data-range-end-bg-primary {`);
  lines.push(`  background-color: var(--primary);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-end="true"].theme-data-range-end-text-primary-foreground {`);
  lines.push(`  color: var(--primary-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-middle="true"].theme-data-range-middle-bg-accent {`);
  lines.push(`  background-color: var(--accent);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`[data-range-middle="true"].theme-data-range-middle-text-accent-foreground {`);
  lines.push(`  color: var(--accent-foreground);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-border-ring:focus-visible {`);
  lines.push(`  border-color: var(--ring);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`.theme-focus-ring-color:focus-visible {`);
  lines.push(`  --tw-ring-color: var(--ring);`);
  lines.push(`}`);

  return lines.join("\n");
}

function copyComponentFiles(): void {
  mkdirSync(COMPONENTS_DEST_DIR, { recursive: true });

  const files = readdirSync(COMPONENTS_SOURCE_DIR).filter((file) => file.endsWith(".tsx"));

  files.forEach((file) => {
    const sourcePath = join(COMPONENTS_SOURCE_DIR, file);
    const destPath = join(COMPONENTS_DEST_DIR, file);
    let content = readFileSync(sourcePath, "utf-8");
    content = content.replace(/theme-/g, "");
    content = content.replace(/@\/lib\/tailwind\.utils/g, "@/lib/utils");
    content = content.replace(/@\/components\/editor\/ui/g, "@/components/ui");
    writeFileSync(destPath, content, "utf-8");
  });

  console.log(JSON.stringify({success:true,componentsCopied:files.length}));
}

function generateGlobalCssFile(): void {
  mkdirSync(STYLES_DEST_DIR, { recursive: true });

  const globalCssContent = generateGlobalCss();
  const globalCssPath = join(STYLES_DEST_DIR, "global.css");

  writeFileSync(globalCssPath, globalCssContent, "utf-8");

  console.log(JSON.stringify({success:true,globalCssGenerated:true}));
}

copyComponentFiles();
generateGlobalCssFile();
