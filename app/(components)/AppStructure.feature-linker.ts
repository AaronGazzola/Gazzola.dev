import { Feature, UserExperienceFileType, FunctionNameData } from "@/app/(editor)/layout.types";
import { InferredFeature } from "./AppStructure.types";
import { generateDefaultFunctionName } from "@/lib/feature.utils";
import { findEntryByPath } from "./AppStructure.parser";
import { FileSystemEntry } from "@/app/(editor)/layout.types";

export const linkFeatureToUtilityFiles = (
  feature: InferredFeature,
  structure: FileSystemEntry[],
  pagePath: string
): Feature => {
  const linkedFiles: Feature["linkedFiles"] = {};
  const functionNames: Feature["functionNames"] = {};

  const utilityFileTypes: UserExperienceFileType[] = ["stores", "hooks", "actions", "types"];

  utilityFileTypes.forEach((fileType) => {
    if (feature.utilityFileNeeds[fileType]) {
      const filePath = determineUtilityFilePath(pagePath, fileType);
      linkedFiles[fileType] = filePath;

      const functionName = generateDefaultFunctionName(feature.title, fileType);
      const functionData: FunctionNameData = {
        name: functionName,
        utilFile: filePath,
      };
      functionNames[fileType] = functionData;
    }
  });

  return {
    id: feature.id,
    title: feature.title,
    description: feature.description,
    linkedFiles,
    functionNames,
    isEditing: false,
  };
};

const determineUtilityFilePath = (
  pagePath: string,
  fileType: UserExperienceFileType
): string => {
  const extension = getExtensionForFileType(fileType);
  const fileName = `page.${fileType}.${extension}`;
  return `${pagePath}/${fileName}`;
};

const getExtensionForFileType = (fileType: UserExperienceFileType): string => {
  switch (fileType) {
    case "hooks":
      return "tsx";
    case "actions":
      return "ts";
    case "stores":
      return "ts";
    case "types":
      return "ts";
    default:
      return "ts";
  }
};

export const convertInferredFeaturesToFeatures = (
  inferredFeatures: Record<string, InferredFeature[]>,
  structure: FileSystemEntry[],
  pageIdToPath: Record<string, string>
): Record<string, Feature[]> => {
  const features: Record<string, Feature[]> = {};

  Object.entries(inferredFeatures).forEach(([pageId, pageFeatures]) => {
    const pagePath = pageIdToPath[pageId];
    if (!pagePath) return;

    features[pageId] = pageFeatures.map((inferredFeature) =>
      linkFeatureToUtilityFiles(inferredFeature, structure, pagePath)
    );
  });

  return features;
};

export const createPageIdToPathMap = (
  pages: Array<{ id: string; route: string }>
): Record<string, string> => {
  const map: Record<string, string> = {};

  pages.forEach((page) => {
    let path = "/app";
    if (page.route !== "/") {
      path += page.route;
    }
    map[page.id] = path;
  });

  return map;
};

export const getUtilityFileTypesNeeded = (
  feature: InferredFeature
): UserExperienceFileType[] => {
  const types: UserExperienceFileType[] = [];

  if (feature.utilityFileNeeds.hooks) types.push("hooks");
  if (feature.utilityFileNeeds.actions) types.push("actions");
  if (feature.utilityFileNeeds.stores) types.push("stores");
  if (feature.utilityFileNeeds.types) types.push("types");

  return types;
};
