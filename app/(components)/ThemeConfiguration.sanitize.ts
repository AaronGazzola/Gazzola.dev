import { ThemeColors, ThemeOther } from "./ThemeConfiguration.types";

export const sanitizeHslValue = (value: string): string => {
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
    sanitized[key] = sanitizeHslValue(value);
  }
  const san = sanitized as ThemeColors;
  console.log("sanitized colors:", san.card);
  return sanitized as ThemeColors;
};

export const sanitizeThemeOther = (other: ThemeOther): ThemeOther => {
  return {
    ...other,
    shadow: {
      ...other.shadow,
      color: sanitizeHslValue(other.shadow.color),
    },
  };
};
