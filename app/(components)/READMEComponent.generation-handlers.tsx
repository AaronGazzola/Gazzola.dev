import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import {
  buildReadmePlan,
  buildReadmeFromPlanPrompt,
  buildReadmeTemplate,
  buildOverviewBatchPrompt,
  buildPagesBatchPrompt
} from "./READMEComponent.prompts";
import React, { useRef, useState } from "react";
import { LayoutInput, PageInput, AuthMethods, PageAccess, ReadmeBatch, AIContentMap } from "./READMEComponent.types";

const BATCH_SIZE = 10;

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
  forceRefresh: () => void,
  phase1ToastIdRef: React.MutableRefObject<string | number | undefined>
) => {
  const phase2LoadingToastIdRef = useRef<string | number | undefined>();
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const currentBatchRef = useRef<ReadmeBatch | null>(null);
  const batchesQueueRef = useRef<ReadmeBatch[]>([]);
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

  const { mutate: generateOverviewBatch } = useCodeGeneration((response) => {
    console.log("========================================");
    console.log("OVERVIEW BATCH COMPLETE");
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
      console.log("✓ Overview batch SUCCESS");
    } catch (error) {
      console.error("✗ Overview batch PARSE ERROR:", error);
      aiContentRef.current["AI_OVERVIEW"] = "[Overview not available]";
      aiContentRef.current["AI_GETTING_STARTED"] = "[Getting started instructions not available]";
    }

    processNextBatch();
  });

  const { mutate: generatePagesBatch } = useCodeGeneration((response) => {
    console.log("========================================");
    console.log("PAGES BATCH COMPLETE");
    console.log("Current batch:", currentBatchRef.current);
    console.log("Response:", response.content);
    console.log("========================================");

    const batch = currentBatchRef.current;
    if (!batch || batch.type !== "pages") {
      console.error("✗ No current batch or wrong type");
      processNextBatch();
      return;
    }

    try {
      const content = response.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      Object.entries(parsed).forEach(([key, value]) => {
        const markerKey = key.replace('page_', 'AI_PAGE_');
        aiContentRef.current[markerKey] = value as string;
        console.log(`Stored: ${markerKey}`);
      });
      console.log(`✓ Pages batch ${batch.batchNumber} SUCCESS`);
    } catch (error) {
      console.error(`✗ Pages batch ${batch.batchNumber} PARSE ERROR:`, error);
      const batchPages = pages.filter((p) => batch.pageIds.includes(p.id));
      batchPages.forEach((p) => {
        aiContentRef.current[`AI_PAGE_${p.id}`] = "[Description not available]";
      });
    }

    processNextBatch();
  });

  const processNextBatch = () => {
    console.log("========================================");
    console.log("PROCESS NEXT BATCH");
    console.log("Queue length:", batchesQueueRef.current.length);
    console.log("========================================");

    if (batchesQueueRef.current.length === 0) {
      console.log("All batches complete, finalizing...");
      toast.dismiss("readme-batch");
      toast.loading("Finalizing README...", {
        id: "readme-finalize",
        duration: Infinity
      });

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

      toast.dismiss("readme-finalize");
      toast.success(`README generated with ${pages.length} pages and ${wordCount} words`);

      setIsBatchGenerating(false);
      return;
    }

    const batch = batchesQueueRef.current.shift()!;
    currentBatchRef.current = batch;

    console.log(`Processing batch ${batch.batchNumber} (${batch.type})`);

    if (batch.type === "overview") {
      toast.loading("Generating overview and getting started...", {
        id: "readme-batch",
        duration: Infinity
      });

      const prompt = buildOverviewBatchPrompt(title, description, authMethods);
      console.log("Calling generateOverviewBatch with prompt:", prompt.substring(0, 200) + "...");

      generateOverviewBatch({ prompt, maxTokens: 1500 });
    } else {
      const batchPages = pages.filter((p) => batch.pageIds.includes(p.id));
      const startPage = (batch.batchNumber - 1) * BATCH_SIZE + 1;
      const endPage = Math.min(startPage + BATCH_SIZE - 1, pages.length);

      toast.loading(`Generating pages ${startPage}-${endPage}...`, {
        id: "readme-batch",
        duration: Infinity
      });

      const batchPagesData = batchPages.map((p) => {
        const access = pageAccess.find((pa) => pa.pageId === p.id);
        return {
          id: p.id,
          name: p.name,
          route: p.route,
          description: p.description,
          access: {
            anon: access?.anon || false,
            auth: access?.auth || false,
            admin: access?.admin || false,
          },
        };
      });

      const prompt = buildPagesBatchPrompt(title, description, batchPagesData);
      console.log(`Calling generatePagesBatch with ${batchPagesData.length} pages`);

      generatePagesBatch({ prompt, maxTokens: 2000 });
    }
  };

  const generateReadmeWithBatching = () => {
    console.log("========================================");
    console.log("README GENERATION - BATCHED APPROACH START");
    console.log("========================================");
    console.log("INPUT DATA:");
    console.log("Title:", title);
    console.log("Pages:", pages.length);
    console.log("Layouts:", layouts.length);
    console.log("========================================");

    try {
      setIsBatchGenerating(true);
      aiContentRef.current = {};

      if (phase1ToastIdRef.current) {
        toast.dismiss(phase1ToastIdRef.current);
      }

      toast.loading("Building README structure...", {
        id: "readme-structure",
        duration: Infinity
      });

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

      const batches: ReadmeBatch[] = [];
      batches.push({
        batchNumber: 0,
        pageIds: [],
        type: "overview"
      });

      for (let i = 0; i < pages.length; i += BATCH_SIZE) {
        const batchPageIds = pages.slice(i, i + BATCH_SIZE).map((p) => p.id);
        batches.push({
          batchNumber: Math.floor(i / BATCH_SIZE) + 1,
          pageIds: batchPageIds,
          type: "pages"
        });
      }

      batchesQueueRef.current = batches;

      console.log(`BATCHES CREATED: ${batches.length} total`);
      console.log(JSON.stringify(batches, null, 2));
      console.log("========================================");

      console.log("Dismissing structure toast...");
      toast.dismiss("readme-structure");

      console.log("Calling processNextBatch...");
      processNextBatch();
    } catch (error) {
      console.error("========================================");
      console.error("ERROR IN generateReadmeWithBatching:");
      console.error(error);
      console.error("========================================");
      toast.dismiss("readme-structure");
      toast.error("Failed to start README generation");
      setIsBatchGenerating(false);
    }
  };

  const generatePlanProgrammatically = () => {
    console.log("========================================");
    console.log("README GENERATION - PHASE 1: PLAN (PROGRAMMATIC)");
    console.log("========================================");
    console.log("INPUT DATA:");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Layouts:", JSON.stringify(layouts, null, 2));
    console.log("Pages:", JSON.stringify(pages, null, 2));
    console.log("Auth Methods:", JSON.stringify(authMethods, null, 2));
    console.log("Page Access:", JSON.stringify(pageAccess, null, 2));
    console.log("========================================");

    const plan = buildReadmePlan(
      title,
      description,
      layouts,
      pages,
      authMethods,
      pageAccess
    );

    console.log("GENERATED PLAN:");
    console.log(plan);
    console.log("========================================");

    setReadmePlan(plan);

    const layoutCount = layouts.length;
    const pageCount = pages.length;

    if (phase1ToastIdRef.current) {
      toast.dismiss(phase1ToastIdRef.current);
    }

    toast.success("Plan created. Generating README...", {
      duration: 3000,
      description: "Converting plan to markdown..."
    });

    const prompt = buildReadmeFromPlanPrompt(plan, title, layouts, pages);

    console.log("========================================");
    console.log("README GENERATION - PHASE 2: MARKDOWN FROM PLAN");
    console.log("========================================");
    console.log("AI INPUT (Prompt):");
    console.log(prompt);
    console.log("========================================");

    phase2LoadingToastIdRef.current = toast.loading("Generating README from plan...", {
      description: `Processing ${layoutCount} layouts and ${pageCount} pages`
    });

    generateReadmeFromPlan({ prompt, maxTokens: 4000 });
  };

  const { mutate: generateReadmeFromPlan, isPending: isGeneratingReadme } =
    useCodeGeneration((response) => {
      console.log("========================================");
      console.log("README GENERATION - PHASE 2: MARKDOWN");
      console.log("========================================");
      console.log("AI OUTPUT (Raw Response):");
      console.log(response.content);
      console.log("========================================");

      try {
        const markdown = response.content.trim();

        const wordCount = markdown.split(/\s+/).length;
        const layoutMentions = layouts.filter(l =>
          markdown.toLowerCase().includes(l.name.toLowerCase())
        ).length;
        const pageMentions = pages.filter(p =>
          markdown.toLowerCase().includes(p.name.toLowerCase())
        ).length;

        console.log("README ANALYSIS:");
        console.log({
          wordCount,
          layoutsInPlan: layouts.length,
          layoutsInReadme: layoutMentions,
          pagesInPlan: pages.length,
          pagesInReadme: pageMentions,
          hasTitle: markdown.includes(`# ${title}`),
          hasSections: {
            overview: markdown.toLowerCase().includes('## overview'),
            layouts: markdown.toLowerCase().includes('## layouts'),
            pages: markdown.toLowerCase().includes('## pages'),
            authentication: markdown.toLowerCase().includes('## authentication'),
            userExperience: markdown.toLowerCase().includes('## user experience'),
            gettingStarted: markdown.toLowerCase().includes('## getting started'),
          }
        });
        console.log("========================================");

        const warnings: string[] = [];

        if (layouts.length > 0 && layoutMentions < layouts.length) {
          console.warn(`⚠️ Only ${layoutMentions}/${layouts.length} layouts mentioned in README`);
          warnings.push(`Layouts: ${layoutMentions}/${layouts.length}`);
        }

        if (pageMentions < pages.length) {
          console.warn(`⚠️ Only ${pageMentions}/${pages.length} pages mentioned in README`);
          warnings.push(`Pages: ${pageMentions}/${pages.length}`);
        }

        if (wordCount < 600) {
          console.warn(`⚠️ README may be too short: ${wordCount} words (target: 600-900)`);
          warnings.push(`Word count: ${wordCount}/600-900`);
        }

        if (warnings.length > 0) {
          toast.warning(`README may be incomplete: ${warnings.join(', ')}`);
        }

        setContent("readme", `<!-- component-READMEComponent -->\n\n${markdown}`);
        setReadmeGenerated(true);
        forceRefresh();

        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.success(`README generated with ${wordCount} words`);
      } catch (error) {
        console.error("========================================");
        console.error("README GENERATION - PHASE 2 ERROR:");
        console.error(error instanceof Error ? error.message : String(error));
        console.error("========================================");
        if (phase2LoadingToastIdRef.current) {
          toast.dismiss(phase2LoadingToastIdRef.current);
        }
        toast.error("Failed to generate README. Please try again.");
      }
    });

  return {
    generatePlan: generatePlanProgrammatically,
    generateReadmeFromPlan,
    generateReadmeWithBatching,
    isGeneratingPlan: false,
    isGeneratingReadme,
    isBatchGenerating
  };
};
