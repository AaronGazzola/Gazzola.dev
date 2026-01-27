import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { toast } from "sonner";
import { buildReadmePlanPrompt, buildReadmeFromPlanPrompt } from "./READMEComponent.prompts";
import React, { useRef } from "react";
import { LayoutInput, PageInput, AuthMethods, PageAccess } from "./READMEComponent.types";

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

  const { mutate: generatePlan, isPending: isGeneratingPlan } =
    useCodeGeneration((response) => {
      console.log("========================================");
      console.log("README GENERATION - PHASE 1: PLAN");
      console.log("========================================");
      console.log("INPUT DATA:");
      console.log("Title:", title);
      console.log("Description:", description);
      console.log("Layouts:", JSON.stringify(layouts, null, 2));
      console.log("Pages:", JSON.stringify(pages, null, 2));
      console.log("Auth Methods:", JSON.stringify(authMethods, null, 2));
      console.log("Page Access:", JSON.stringify(pageAccess, null, 2));
      console.log("========================================");
      console.log("AI OUTPUT (Full Plan):");
      console.log(response.content);
      console.log("========================================");

      const plan = response.content.trim();
      setReadmePlan(plan);

      const layoutCount = layouts.length;
      const pageCount = pages.length;

      if (phase1ToastIdRef.current) {
        toast.dismiss(phase1ToastIdRef.current);
      }

      toast.success("Plan generated. Creating README...", {
        duration: 5000,
        description: "This may take up to 2 minutes for complex READMEs..."
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

      generateReadmeFromPlan({ prompt, maxTokens: 3000 });
    });

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
    generatePlan,
    generateReadmeFromPlan,
    isGeneratingPlan,
    isGeneratingReadme
  };
};
