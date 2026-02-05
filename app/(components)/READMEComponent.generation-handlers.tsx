import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import {
  buildReadmeTemplate,
  buildOverviewBatchPrompt
} from "./READMEComponent.prompts";
import React, { useRef, useState } from "react";
import { LayoutInput, PageInput, AuthMethods, PageAccess, AIContentMap } from "./READMEComponent.types";

export const useReadmeGeneration = (
  title: string,
  description: string,
  layouts: LayoutInput[],
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[],
  setReadmePlan: (plan: string | null) => void,
  setContent: (type: string, content: string) => void,
  setReadmeGenerated: (generated: boolean) => void,
  forceRefresh: () => void
) => {
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const aiContentRef = useRef<AIContentMap>({});
  const templateRef = useRef<string>("");

  const mergeAIContent = (template: string, aiContent: AIContentMap): string => {
    let result = template;
    Object.entries(aiContent).forEach(([marker, content]) => {
      result = result.replace(`[${marker}]`, content);
    });

    const remainingMarkers = result.match(/\[AI_[^\]]+\]/g);
    if (remainingMarkers) {
      console.warn("⚠️ Remaining markers after merge:", remainingMarkers);
      remainingMarkers.forEach((marker) => {
        result = result.replace(marker, "[Description not available]");
      });
    }

    return result;
  };

  const { mutate: generateOverviewAndGettingStarted, isPending: isGeneratingReadme } = useCodeGeneration((response) => {
    console.log("========================================");
    console.log("GENERATION COMPLETE");
    console.log("Response:", response.content);
    console.log("========================================");

    try {
      const content = response.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      aiContentRef.current["AI_OVERVIEW"] = parsed.overview;
      aiContentRef.current["AI_GETTING_STARTED"] = parsed.gettingStarted;
      console.log("✓ Generation SUCCESS");

      const finalReadme = mergeAIContent(templateRef.current, aiContentRef.current);

      console.log("========================================");
      console.log("FINAL README:");
      console.log(finalReadme.substring(0, 500) + "...");
      console.log("========================================");

      const wordCount = finalReadme.split(/\s+/).length;
      const pagesInReadme = pages.filter((p) =>
        finalReadme.toLowerCase().includes(p.name.toLowerCase())
      ).length;

      console.log("README ANALYSIS:");
      console.log({
        wordCount,
        pagesInPlan: pages.length,
        pagesInReadme,
        layoutsInPlan: layouts.length,
      });

      if (pagesInReadme < pages.length) {
        console.warn(`⚠️ Only ${pagesInReadme}/${pages.length} pages in README`);
      }

      setContent("readme", `<!-- component-READMEComponent -->\n\n${finalReadme}`);
      setReadmeGenerated(true);
      forceRefresh();

      toast.success(`README generated with ${pages.length} pages and ${wordCount} words`);

      setIsBatchGenerating(false);
    } catch (error) {
      console.error("✗ Generation PARSE ERROR:", error);

      toast.error("Failed to generate README. Please try again.");
      setIsBatchGenerating(false);
    }
  });

  const generateReadmeWithBatching = () => {
    console.log("========================================");
    console.log("README GENERATION START");
    console.log("========================================");
    console.log("INPUT DATA:");
    console.log("Title:", title);
    console.log("Pages:", pages.length);
    console.log("Layouts:", layouts.length);
    console.log("========================================");

    try {
      setIsBatchGenerating(true);
      aiContentRef.current = {};

      console.log("Creating template...");
      const template = buildReadmeTemplate(
        title,
        description,
        layouts,
        pages,
        authMethods,
        pageAccess
      );
      templateRef.current = template;

      console.log("TEMPLATE CREATED (first 500 chars):");
      console.log(template.substring(0, 500));
      console.log("========================================");

      const prompt = buildOverviewBatchPrompt(title, description, authMethods);
      console.log("Calling generateOverviewAndGettingStarted with prompt:", prompt.substring(0, 200) + "...");

      generateOverviewAndGettingStarted({ prompt, maxTokens: 1500 });
    } catch (error) {
      console.error("========================================");
      console.error("ERROR IN generateReadmeWithBatching:");
      console.error(error);
      console.error("========================================");

      toast.error("Failed to start README generation");
      setIsBatchGenerating(false);
    }
  };

  return {
    generateReadmeWithBatching,
    isGeneratingReadme,
    isBatchGenerating
  };
};
