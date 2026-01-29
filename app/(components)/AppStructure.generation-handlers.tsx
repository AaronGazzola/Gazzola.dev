import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import {
  buildScopeClassificationPrompt,
  buildDirectoryStructurePrompt,
  buildFunctionAssignmentPrompt,
  assembleStructure
} from "./AppStructure.prompts";
import { FunctionAssignment, FeatureScope, InferredFeature } from "./AppStructure.types";
import { FileSystemEntry, Feature } from "@/app/(editor)/layout.types";
import React, { useRef, useCallback, useState } from "react";

interface ParsedPage {
  id: string;
  name: string;
  route: string;
  description: string;
}

const BATCH_SIZE = 12;

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const useStructureGeneration = (
  parsedPages: ParsedPage[],
  inferredFeatures: Record<string, InferredFeature[]>,
  setStructurePlan: (plan: string | null) => void,
  setAppStructure: (structure: FileSystemEntry[]) => void,
  setFeatures: (features: Record<string, Feature[]>) => void,
  setAppStructureGenerated: (generated: boolean) => void,
  setShowSuccessView: (show: boolean) => void,
  phase1ToastIdRef: React.MutableRefObject<string | number | undefined>
) => {
  const loadingToastIdRef = useRef<string | number | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const scopeMapRef = useRef<Record<string, FeatureScope>>({});
  const directoryStructureRef = useRef<FileSystemEntry[]>([]);
  const filePathsRef = useRef<string[]>([]);
  const allAssignmentsRef = useRef<FunctionAssignment[]>([]);
  const featureBatchesRef = useRef<Array<{ id: string; pageId: string; title: string; description: string; route: string }[]>>([]);
  const currentBatchIndexRef = useRef(0);

  const { mutate: generatePhase1 } = useCodeGeneration((response) => {
    console.log("========================================");
    console.log("PHASE 1 - SCOPE CLASSIFICATION");
    console.log("========================================");
    console.log("AI OUTPUT:");
    console.log(response.content);
    console.log("========================================");

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.scopeMap) {
        toast.error("Phase 1 failed: Invalid scope map format");
        setIsGenerating(false);
        return;
      }

      scopeMapRef.current = parsed.scopeMap;

      const featureCount = Object.keys(parsed.scopeMap).length;
      const globalCount = Object.values(parsed.scopeMap).filter((s: unknown) => s === "GLOBAL").length;

      console.log(`Phase 1 Complete: ${featureCount} features classified (${globalCount} global)`);

      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = toast.loading("Phase 2: Generating directory structure...", {
        description: `${parsedPages.length} pages to process`
      });

      const phase2Prompt = buildDirectoryStructurePrompt(parsedPages, parsed.scopeMap);
      console.log("========================================");
      console.log("PHASE 2 - DIRECTORY STRUCTURE PROMPT");
      console.log("========================================");
      console.log(phase2Prompt);
      console.log("========================================");

      generatePhase2({ prompt: phase2Prompt, maxTokens: 4000 });
    } catch (error) {
      console.error("Phase 1 Error:", error);
      toast.dismiss(loadingToastIdRef.current);
      toast.error("Phase 1 failed: Could not parse scope classification");
      setIsGenerating(false);
    }
  });

  const { mutate: generatePhase2 } = useCodeGeneration((response) => {
    console.log("========================================");
    console.log("PHASE 2 - DIRECTORY STRUCTURE");
    console.log("========================================");
    console.log("AI OUTPUT:");
    console.log(response.content);
    console.log("========================================");

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.structure || !parsed.filePaths) {
        toast.error("Phase 2 failed: Invalid structure format");
        setIsGenerating(false);
        return;
      }

      directoryStructureRef.current = parsed.structure;
      filePathsRef.current = parsed.filePaths;

      console.log(`Phase 2 Complete: ${parsed.filePaths.length} files in structure`);

      const allFeatures: Array<{ id: string; pageId: string; title: string; description: string; route: string }> = [];
      Object.entries(inferredFeatures).forEach(([pageId, features]) => {
        const page = parsedPages.find(p => p.id === pageId);
        features.forEach(f => {
          allFeatures.push({
            id: f.id,
            pageId,
            title: f.title,
            description: f.description,
            route: page?.route || "/"
          });
        });
      });

      featureBatchesRef.current = chunkArray(allFeatures, BATCH_SIZE);
      currentBatchIndexRef.current = 0;
      allAssignmentsRef.current = [];

      const totalBatches = featureBatchesRef.current.length;
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = toast.loading(`Phase 3: Assigning functions (batch 1/${totalBatches})...`, {
        description: `${allFeatures.length} features in ${totalBatches} batches`
      });

      processNextBatch();
    } catch (error) {
      console.error("Phase 2 Error:", error);
      toast.dismiss(loadingToastIdRef.current);
      toast.error("Phase 2 failed: Could not parse directory structure");
      setIsGenerating(false);
    }
  });

  const { mutate: generatePhase3Batch } = useCodeGeneration((response) => {
    const batchIndex = currentBatchIndexRef.current;
    const totalBatches = featureBatchesRef.current.length;

    console.log("========================================");
    console.log(`PHASE 3 - FUNCTION ASSIGNMENTS (Batch ${batchIndex + 1}/${totalBatches})`);
    console.log("========================================");
    console.log("AI OUTPUT:");
    console.log(response.content);
    console.log("========================================");

    try {
      const cleanResponse = response.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);

      if (!parsed.assignments || !Array.isArray(parsed.assignments)) {
        console.error("Invalid assignments format in batch", batchIndex);
        toast.error(`Phase 3 batch ${batchIndex + 1} failed: Invalid format`);
        setIsGenerating(false);
        return;
      }

      allAssignmentsRef.current = [...allAssignmentsRef.current, ...parsed.assignments];

      console.log(`Batch ${batchIndex + 1} Complete: ${parsed.assignments.length} assignments (total: ${allAssignmentsRef.current.length})`);

      currentBatchIndexRef.current = batchIndex + 1;

      if (currentBatchIndexRef.current < totalBatches) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = toast.loading(`Phase 3: Assigning functions (batch ${currentBatchIndexRef.current + 1}/${totalBatches})...`, {
          description: `${allAssignmentsRef.current.length} assignments so far`
        });
        processNextBatch();
      } else {
        completeGeneration();
      }
    } catch (error) {
      console.error(`Phase 3 Batch ${batchIndex + 1} Error:`, error);
      toast.dismiss(loadingToastIdRef.current);
      toast.error(`Phase 3 batch ${batchIndex + 1} failed: Could not parse assignments`);
      setIsGenerating(false);
    }
  });

  const processNextBatch = useCallback(() => {
    const batchIndex = currentBatchIndexRef.current;
    const batch = featureBatchesRef.current[batchIndex];
    const totalBatches = featureBatchesRef.current.length;

    const prompt = buildFunctionAssignmentPrompt(
      batch,
      scopeMapRef.current,
      filePathsRef.current,
      allAssignmentsRef.current,
      batchIndex,
      totalBatches
    );

    console.log("========================================");
    console.log(`PHASE 3 - BATCH ${batchIndex + 1}/${totalBatches} PROMPT`);
    console.log("========================================");
    console.log(prompt);
    console.log("========================================");

    generatePhase3Batch({ prompt, maxTokens: 3000 });
  }, [generatePhase3Batch]);

  const completeGeneration = useCallback(() => {
    console.log("========================================");
    console.log("PHASE 4 - CLIENT-SIDE ASSEMBLY");
    console.log("========================================");

    toast.dismiss(loadingToastIdRef.current);
    loadingToastIdRef.current = toast.loading("Phase 4: Assembling final structure...");

    try {
      const { structure, features } = assembleStructure(
        directoryStructureRef.current,
        parsedPages,
        allAssignmentsRef.current
      );

      const ensureLinkedFilesExist = (struct: FileSystemEntry[], feats: Record<string, Feature[]>) => {
        const existingFiles = new Set<string>();

        const collectFiles = (entries: FileSystemEntry[], path: string = "") => {
          entries.forEach(entry => {
            const fullPath = path + "/" + entry.name;
            if (entry.type === "file") {
              existingFiles.add(fullPath);
            }
            if (entry.children) {
              collectFiles(entry.children, fullPath);
            }
          });
        };

        collectFiles(struct);

        const missingFiles = new Set<string>();
        Object.values(feats).forEach((featureList) => {
          featureList.forEach((feature) => {
            if (feature.linkedFiles) {
              Object.values(feature.linkedFiles).forEach((filePath) => {
                if (typeof filePath === 'string' && !existingFiles.has(filePath)) {
                  missingFiles.add(filePath);
                }
              });
            }
          });
        });

        if (missingFiles.size > 0) {
          console.warn("⚠️ MISSING LINKED FILES DETECTED:");
          console.warn(Array.from(missingFiles));

          missingFiles.forEach(filePath => {
            const parts = filePath.split('/').filter(p => p);
            const fileName = parts[parts.length - 1];

            const findOrCreateDir = (entries: FileSystemEntry[], pathParts: string[]): FileSystemEntry[] => {
              if (pathParts.length === 0) return entries;

              const currentPart = pathParts[0];
              let dirEntry = entries.find(e => e.name === currentPart && e.type === 'directory');

              if (!dirEntry) {
                dirEntry = {
                  id: `${currentPart}-${Date.now()}`,
                  name: currentPart,
                  type: 'directory',
                  children: []
                };
                entries.push(dirEntry);
              }

              if (pathParts.length === 1) {
                return dirEntry.children || [];
              }

              return findOrCreateDir(dirEntry.children || [], pathParts.slice(1));
            };

            const targetDir = findOrCreateDir(struct, parts.slice(0, -1));

            if (!targetDir.find(f => f.name === fileName)) {
              targetDir.push({
                id: `${fileName.replace(/\./g, '-')}-${Date.now()}`,
                name: fileName,
                type: 'file'
              });
              console.log(`✅ Auto-created missing file: ${filePath}`);
            }
          });
        }

        return struct;
      };

      const finalStructure = ensureLinkedFilesExist(structure, features);

      const inputFeatureCount = Object.values(inferredFeatures).reduce((sum, f) => sum + f.length, 0);
      const outputFeatureCount = Object.values(features).reduce((sum, arr) => sum + arr.length, 0);

      console.log("========================================");
      console.log("GENERATION COMPLETE");
      console.log("========================================");
      console.log("FINAL STRUCTURE:");
      console.log(JSON.stringify(finalStructure, null, 2));
      console.log("========================================");
      console.log("FINAL FEATURES:");
      console.log(JSON.stringify(features, null, 2));
      console.log("========================================");
      console.log("SUMMARY:", {
        inputFeatures: inputFeatureCount,
        outputFeatures: outputFeatureCount,
        totalAssignments: allAssignmentsRef.current.length,
        match: inputFeatureCount === outputFeatureCount ? '✅ COMPLETE' : '❌ INCOMPLETE'
      });
      console.log("========================================");

      setAppStructure(finalStructure);
      setFeatures(features);
      setAppStructureGenerated(true);
      setShowSuccessView(true);

      toast.dismiss(loadingToastIdRef.current);

      if (inputFeatureCount !== outputFeatureCount) {
        toast.warning(`Structure generated with ${outputFeatureCount}/${inputFeatureCount} features`, {
          description: "Some features may not have been mapped correctly"
        });
      } else {
        toast.success(`App structure generated with ${parsedPages.length} pages and ${outputFeatureCount} features`);
      }

      setIsGenerating(false);
    } catch (error) {
      console.error("Phase 4 Error:", error);
      toast.dismiss(loadingToastIdRef.current);
      toast.error("Phase 4 failed: Could not assemble final structure");
      setIsGenerating(false);
    }
  }, [parsedPages, inferredFeatures, setAppStructure, setFeatures, setAppStructureGenerated, setShowSuccessView]);

  const startGeneration = useCallback(() => {
    setIsGenerating(true);

    scopeMapRef.current = {};
    directoryStructureRef.current = [];
    filePathsRef.current = [];
    allAssignmentsRef.current = [];
    featureBatchesRef.current = [];
    currentBatchIndexRef.current = 0;

    const featureCount = Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0);

    if (phase1ToastIdRef.current) {
      toast.dismiss(phase1ToastIdRef.current);
    }

    loadingToastIdRef.current = toast.loading("Phase 1: Classifying feature scopes...", {
      description: `Analyzing ${featureCount} features`
    });

    const phase1Prompt = buildScopeClassificationPrompt(parsedPages, inferredFeatures);

    console.log("========================================");
    console.log("STARTING 4-PHASE GENERATION PIPELINE");
    console.log("========================================");
    console.log(`Total Features: ${featureCount}`);
    console.log(`Total Pages: ${parsedPages.length}`);
    console.log(`Batch Size: ${BATCH_SIZE}`);
    console.log(`Estimated Batches: ${Math.ceil(featureCount / BATCH_SIZE)}`);
    console.log("========================================");
    console.log("PHASE 1 - SCOPE CLASSIFICATION PROMPT");
    console.log("========================================");
    console.log(phase1Prompt);
    console.log("========================================");

    generatePhase1({ prompt: phase1Prompt, maxTokens: 2000 });
  }, [parsedPages, inferredFeatures, phase1ToastIdRef, generatePhase1]);

  return {
    generatePlan: startGeneration,
    generateStructureFromPlan: () => {},
    isGeneratingPlan: isGenerating,
    isGeneratingStructure: isGenerating
  };
};
