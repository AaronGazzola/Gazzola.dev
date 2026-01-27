import { Feature, UserExperienceFileType, FunctionNameData } from "@/app/(editor)/layout.types";
import { InferredFeature, FeatureCategory } from "./AppStructure.types";
import { generateDefaultFunctionName } from "@/lib/feature.utils";
import { findEntryByPath } from "./AppStructure.parser";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { LayoutInput, PageInput } from "./READMEComponent.types";

const shouldUseParentFile = (
  feature: InferredFeature,
  fileType: UserExperienceFileType
): boolean => {
  if (fileType === 'types') {
    return true;
  }

  return false;
};

const getParentPath = (path: string): string | null => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) return null;
  segments.pop();
  return '/' + segments.join('/');
};

export const linkFeatureToUtilityFiles = (
  feature: InferredFeature,
  structure: FileSystemEntry[],
  pagePath: string,
  allPages?: PageInput[],
  layouts?: LayoutInput[]
): Feature => {
  const linkedFiles: Feature["linkedFiles"] = {};
  const functionNames: Feature["functionNames"] = {};

  const utilityFileTypes: UserExperienceFileType[] = ["stores", "hooks", "actions", "types"];

  utilityFileTypes.forEach((fileType) => {
    if (feature.utilityFileNeeds[fileType]) {
      if (feature.pageId.startsWith('layout-')) {
        const filePath = determineUtilityFilePath(pagePath, fileType, 'layout');
        linkedFiles[fileType] = filePath;

        const functionName = generateDefaultFunctionName(feature.title, fileType);
        const functionData: FunctionNameData = {
          name: functionName,
          utilFile: filePath,
        };
        functionNames[fileType] = functionData;
      } else {
        const page = allPages?.find(p => p.route === pagePath.replace('/app', ''));
        if (page && page.layoutIds && page.layoutIds.length > 0) {
          const parentPath = getParentPath(pagePath);
          if (parentPath && shouldUseParentFile(feature, fileType)) {
            const parentFilePath = determineUtilityFilePath(parentPath, fileType, 'layout');
            linkedFiles[fileType] = parentFilePath;

            const functionName = generateDefaultFunctionName(feature.title, fileType);
            const functionData: FunctionNameData = {
              name: functionName,
              utilFile: parentFilePath,
            };
            functionNames[fileType] = functionData;
            return;
          }
        }

        const filePath = determineUtilityFilePath(pagePath, fileType, 'page');
        linkedFiles[fileType] = filePath;

        const functionName = generateDefaultFunctionName(feature.title, fileType);
        const functionData: FunctionNameData = {
          name: functionName,
          utilFile: filePath,
        };
        functionNames[fileType] = functionData;
      }
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
  fileType: UserExperienceFileType,
  prefix: "page" | "layout" = "page"
): string => {
  const extension = getExtensionForFileType(fileType);
  const fileName = `${prefix}.${fileType}.${extension}`;
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
  pageIdToPath: Record<string, string>,
  allPages?: PageInput[],
  layouts?: LayoutInput[]
): Record<string, Feature[]> => {
  const features: Record<string, Feature[]> = {};

  Object.entries(inferredFeatures).forEach(([pageId, pageFeatures]) => {
    const pagePath = pageIdToPath[pageId];
    if (!pagePath) return;

    features[pageId] = pageFeatures.map((inferredFeature) =>
      linkFeatureToUtilityFiles(inferredFeature, structure, pagePath, allPages, layouts)
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
