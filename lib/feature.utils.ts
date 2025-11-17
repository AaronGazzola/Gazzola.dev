export type UserExperienceFileType = "stores" | "hooks" | "actions" | "types";

export const generateDefaultFunctionName = (
  featureTitle: string,
  fileType: UserExperienceFileType
): string => {
  const pascalCase = featureTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);

  switch (fileType) {
    case "stores":
      return `use${pascalCase}Store`;
    case "hooks":
      return `use${pascalCase}`;
    case "actions":
      return `${camelCase}Action`;
    case "types":
      return `${pascalCase}Data`;
  }
};
