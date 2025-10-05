import { ComponentStyleConfig, GlobalThemeConfig, VariantStyleConfig } from "@/app/(editor)/layout.types";

const borderRadiusMap = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};

const shadowMap = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};

const fontSizeMap = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

export const applyGlobalThemeToComponent = (
  globalTheme: GlobalThemeConfig
): ComponentStyleConfig => {
  return {
    borderRadius: borderRadiusMap[globalTheme.borderRadiusPreset],
    boxShadow: shadowMap[globalTheme.shadowIntensity],
    fontSize: fontSizeMap[globalTheme.fontSizeScale],
    color: globalTheme.primaryColor,
  };
};

export const mergeThemeStyles = (
  globalTheme: GlobalThemeConfig,
  variantStyles: VariantStyleConfig,
  currentVariant: string
): Record<string, any> => {
  const globalStyles = applyGlobalThemeToComponent(globalTheme);
  const componentVariantStyles = variantStyles[currentVariant] || {};

  const mergedStyles: Record<string, any> = {
    ...globalStyles,
    ...componentVariantStyles,
  };

  if (mergedStyles.paddingX !== undefined || mergedStyles.paddingY !== undefined) {
    const paddingX = mergedStyles.paddingX || "0";
    const paddingY = mergedStyles.paddingY || "0";
    mergedStyles.padding = `${paddingY} ${paddingX}`;
    delete mergedStyles.paddingX;
    delete mergedStyles.paddingY;
  }

  if (mergedStyles.cellPaddingX !== undefined || mergedStyles.cellPaddingY !== undefined) {
    const cellPaddingX = mergedStyles.cellPaddingX || "0";
    const cellPaddingY = mergedStyles.cellPaddingY || "0";
    mergedStyles.cellPadding = `${cellPaddingY} ${cellPaddingX}`;
    delete mergedStyles.cellPaddingX;
    delete mergedStyles.cellPaddingY;
  }

  return mergedStyles;
};
