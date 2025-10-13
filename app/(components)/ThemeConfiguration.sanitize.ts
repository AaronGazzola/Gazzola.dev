import { ThemeColors, ThemeOther } from "./ThemeConfiguration.types";

export const sanitizeColorValue = (value: string): string => {
  if (value.startsWith("oklch(")) {
    const match = value.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
    if (match) {
      return `oklch(${match[1]} ${match[2]} ${match[3]})`;
    }
    return value;
  }

  if (value.startsWith("hsl(")) {
    const withoutAlpha = value.replace(/\s*\/\s*[0-9.]+\s*$/, "").trim();
    const match = withoutAlpha.match(
      /hsl\(\s*([0-9]+(?:\.[0-9]+)?)\s*([0-9]+(?:\.[0-9]+)?)%\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/
    );
    if (match) {
      return `hsl(${match[1]} ${match[2]}% ${match[3]}%)`;
    }
    return value;
  }

  const withoutAlpha = value.replace(/\s*\/\s*[0-9.]+\s*$/, "").trim();
  const match = withoutAlpha.match(
    /([0-9]+(?:\.[0-9]+)?)\s*([0-9]+(?:\.[0-9]+)?)%\s*([0-9]+(?:\.[0-9]+)?)%/
  );
  if (match) {
    return `${match[1]} ${match[2]}% ${match[3]}%`;
  }

  return value;
};

export const sanitizeThemeColors = (colors: ThemeColors): ThemeColors => {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(colors)) {
    sanitized[key] = sanitizeColorValue(value);
  }
  return sanitized as ThemeColors;
};

export const sanitizeThemeOther = (other: ThemeOther): ThemeOther => {
  return {
    ...other,
    shadow: {
      ...other.shadow,
      color: sanitizeColorValue(other.shadow.color),
    },
  };
};
