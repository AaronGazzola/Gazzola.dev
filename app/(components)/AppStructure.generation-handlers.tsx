import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import { buildStructurePlanPrompt, buildStructureFromPlanPrompt } from "./AppStructure.prompts";
import React, { useRef } from "react";

export const useStructureGeneration = (
  parsedPages: any[],
  inferredFeatures: Record<string, any[]>,
  setStructurePlan: (plan: string | null) => void,
  setAppStructure: (structure: any[]) => void,
  setFeatures: (features: Record<string, any[]>) => void,
  setAppStructureGenerated: (generated: boolean) => void,
  setShowSuccessView: (show: boolean) => void,
  phase1ToastIdRef: React.MutableRefObject<string | number | undefined>
) => {
  const phase2LoadingToastIdRef = useRef<string | number | undefined>();

  const { mutate: generatePlan, isPending: isGeneratingPlan } =
    useCodeGeneration((response) => {
      console.log("========================================");
      console.log("PHASE 1 - PLAN GENERATION");
      console.log("========================================");
      console.log("AI OUTPUT (Full Plan):");
      console.log(response.content);
      console.log("========================================");

      const plan = response.content.trim();
      setStructurePlan(plan);

      const featureCount = Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0);
      const pageIds = Object.keys(inferredFeatures);

      if (phase1ToastIdRef.current) {
        toast.dismiss(phase1ToastIdRef.current);
      }

      toast.success("Plan generated. Converting to structure...", {
        duration: 5000,
        description: "This may take up to 2-3 minutes for complex structures..."
      });

      const prompt = buildStructureFromPlanPrompt(plan, parsedPages, inferredFeatures);

      console.log("========================================");
      console.log("PHASE 2 - STRUCTURE GENERATION FROM PLAN");
      console.log("========================================");
      console.log("AI INPUT (Prompt):");
      console.log(prompt);
      console.log("========================================");

      phase2LoadingToastIdRef.current = toast.loading("Generating structure from plan...", {
        description: `Processing ${featureCount} features across ${pageIds.length} pages`
      });

      generateStructureFromPlan({ prompt, maxTokens: 8000 });
    });

  const { mutate: generateStructureFromPlan, isPending: isGeneratingStructure } =
    useCodeGeneration((response) => {
      console.log("========================================");
      console.log("PHASE 2 - STRUCTURE GENERATION");
      console.log("========================================");
      console.log("AI OUTPUT (Raw Response):");
      console.log(response.content);
      console.log("========================================");

      try {
        const cleanResponse = response.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        const parsed = JSON.parse(cleanResponse);

        if (!parsed.structure || !parsed.features) {
          if (phase2LoadingToastIdRef.current) {
            toast.dismiss(phase2LoadingToastIdRef.current);
          }
          toast.error("Invalid AI response format");
          return;
        }

        const ensureLinkedFilesExist = (structure: any[], features: Record<string, any[]>) => {
          const existingFiles = new Set<string>();

          const collectFiles = (entries: any[], path: string = "") => {
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

          collectFiles(structure);

          const missingFiles = new Set<string>();
          Object.values(features).forEach((featureList: any[]) => {
            featureList.forEach((feature: any) => {
              if (feature.linkedFiles) {
                Object.values(feature.linkedFiles).forEach((filePath: any) => {
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

              const findOrCreateDir = (entries: any[], pathParts: string[]): any => {
                if (pathParts.length === 0) return entries;

                const currentPart = pathParts[0];
                let dirEntry = entries.find((e: any) => e.name === currentPart && e.type === 'directory');

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
                  return dirEntry.children;
                }

                return findOrCreateDir(dirEntry.children, pathParts.slice(1));
              };

              const targetDir = findOrCreateDir(structure, parts.slice(0, -1));

              if (!targetDir.find((f: any) => f.name === fileName)) {
                targetDir.push({
                  id: `${fileName.replace(/\./g, '-')}-${Date.now()}`,
                  name: fileName,
                  type: 'file'
                });
                console.log(`✅ Auto-created missing file: ${filePath}`);
              }
            });
          }

          return structure;
        };

        parsed.structure = ensureLinkedFilesExist(parsed.structure, parsed.features);

        console.log("PARSED STRUCTURE:");
        console.log(JSON.stringify(parsed.structure, null, 2));
        console.log("========================================");
        console.log("PARSED FEATURES:");
        console.log(JSON.stringify(parsed.features, null, 2));
        console.log("========================================");
        console.log("SUMMARY:", {
          structureCount: parsed.structure.length,
          featurePageCount: Object.keys(parsed.features).length,
          totalFeatures: Object.values(parsed.features).reduce((sum: number, arr: any) => sum + arr.length, 0)
        });
        console.log("========================================");

        const inputPageIds = Object.keys(inferredFeatures);
        const outputPageIds = Object.keys(parsed.features);
        const inputFeatureCount = Object.values(inferredFeatures).reduce((sum, f) => sum + f.length, 0);
        const outputFeatureCount = Object.values(parsed.features).reduce((sum: number, arr: any) => sum + arr.length, 0);

        const missingPageIds = inputPageIds.filter(id => {
          const inputFeatures = inferredFeatures[id];
          const inputFeatureIds = inputFeatures.map(f => f.id);

          const foundInOutput = Object.values(parsed.features).some((features: any) =>
            features.some((f: any) => inputFeatureIds.includes(f.id))
          );

          return !foundInOutput;
        });

        console.log("========================================");
        console.log("FEATURE COUNT VERIFICATION:");
        console.log(`Input pages: ${inputPageIds.length}`);
        console.log(`Output pages: ${outputPageIds.length}`);
        console.log(`Input features: ${inputFeatureCount}`);
        console.log(`Output features: ${outputFeatureCount}`);
        console.log(`Match: ${inputFeatureCount === outputFeatureCount ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);

        if (missingPageIds.length > 0) {
          console.error("❌ MISSING PAGES:");
          missingPageIds.forEach(pageId => {
            const page = parsedPages.find(p => p.id === pageId);
            const featureCount = inferredFeatures[pageId].length;
            console.error(`  - ${page?.name} (${page?.route}): ${featureCount} features missing`);
          });
        }

        console.log("========================================");

        if (inputFeatureCount !== outputFeatureCount) {
          toast.error(`Incomplete structure: ${outputFeatureCount}/${inputFeatureCount} features generated`);
        }

        setAppStructure(parsed.structure);
        setFeatures(parsed.features);
        setAppStructureGenerated(true);
        setShowSuccessView(true);

        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.success(`App structure generated with ${parsedPages.length} pages`);
      } catch (error) {
        console.error("========================================");
        console.error("PHASE 2 ERROR:");
        console.error(error instanceof Error ? error.message : String(error));
        console.error("========================================");
        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.error("Failed to generate structure. Please try again.");
      }
    });

  return {
    generatePlan,
    generateStructureFromPlan,
    isGeneratingPlan,
    isGeneratingStructure
  };
};
