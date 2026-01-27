import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { InferredFeature } from "./AppStructure.types";

interface ParsedPage {
  id: string;
  name: string;
  route: string;
  description: string;
}

export interface PageBatch {
  pages: ParsedPage[];
  features: Record<string, InferredFeature[]>;
}

const BATCH_SIZE = 6;

export const splitIntoBatches = (
  parsedPages: ParsedPage[],
  inferredFeatures: Record<string, InferredFeature[]>
): PageBatch[] => {
  const layoutPages = parsedPages.filter(p => p.id.startsWith('layout-'));
  const regularPages = parsedPages.filter(p => !p.id.startsWith('layout-'));

  const batches: PageBatch[] = [];

  for (let i = 0; i < regularPages.length; i += BATCH_SIZE) {
    const batchPages = regularPages.slice(i, i + BATCH_SIZE);

    if (i === 0 && layoutPages.length > 0) {
      batchPages.unshift(...layoutPages);
    }

    const batchFeatures: Record<string, InferredFeature[]> = {};

    batchPages.forEach(page => {
      if (inferredFeatures[page.id]) {
        batchFeatures[page.id] = inferredFeatures[page.id];
      }
    });

    batches.push({
      pages: batchPages,
      features: batchFeatures
    });
  }

  if (batches.length === 0 && layoutPages.length > 0) {
    const batchFeatures: Record<string, InferredFeature[]> = {};
    layoutPages.forEach(page => {
      if (inferredFeatures[page.id]) {
        batchFeatures[page.id] = inferredFeatures[page.id];
      }
    });

    batches.push({
      pages: layoutPages,
      features: batchFeatures
    });
  }

  return batches;
};

export const mergeStructures = (structures: FileSystemEntry[][]): FileSystemEntry[] => {
  if (structures.length === 0) return [];
  if (structures.length === 1) return structures[0];

  const firstStructure = structures[0];
  const appRoot = firstStructure.find(entry => entry.name === "app");

  if (!appRoot || appRoot.type !== "directory" || !appRoot.children) {
    return firstStructure;
  }

  const mergedChildren = [...appRoot.children];
  const existingNames = new Set(mergedChildren.map(child => child.name));

  for (let i = 1; i < structures.length; i++) {
    const currentStructure = structures[i];
    const currentAppRoot = currentStructure.find(entry => entry.name === "app");

    if (!currentAppRoot || currentAppRoot.type !== "directory" || !currentAppRoot.children) {
      continue;
    }

    currentAppRoot.children.forEach(child => {
      if (child.name === "layout.tsx") {
        return;
      }

      if (!existingNames.has(child.name)) {
        mergedChildren.push(child);
        existingNames.add(child.name);
      } else if (child.type === "directory" && child.children) {
        const existingChild = mergedChildren.find(c => c.name === child.name);
        if (existingChild && existingChild.type === "directory" && existingChild.children) {
          existingChild.children = mergeDirectoryChildren(existingChild.children, child.children);
        }
      }
    });
  }

  return [{
    ...appRoot,
    children: mergedChildren
  }];
};

const mergeDirectoryChildren = (
  existing: FileSystemEntry[],
  incoming: FileSystemEntry[]
): FileSystemEntry[] => {
  const merged = [...existing];
  const existingNames = new Set(existing.map(e => e.name));

  incoming.forEach(child => {
    if (!existingNames.has(child.name)) {
      merged.push(child);
      existingNames.add(child.name);
    } else if (child.type === "directory" && child.children) {
      const existingChild = merged.find(c => c.name === child.name);
      if (existingChild && existingChild.type === "directory" && existingChild.children) {
        existingChild.children = mergeDirectoryChildren(existingChild.children, child.children);
      }
    }
  });

  return merged;
};

export const mergeFeatures = (
  featuresArray: Array<Record<string, any[]>>
): Record<string, any[]> => {
  const merged: Record<string, any[]> = {};

  featuresArray.forEach(features => {
    Object.entries(features).forEach(([key, value]) => {
      if (!merged[key]) {
        merged[key] = [];
      }
      merged[key].push(...value);
    });
  });

  return merged;
};
