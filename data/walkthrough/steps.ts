import { WalkthroughStep } from "@/app/layout.types";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "placeholder-nodes",
    title: "Customize Placeholder Values",
    description:
      "Click on any highlighted placeholder element throughout the documents to update them with your project-specific details. These placeholders help you customize the content to match your needs.",
    targetDataAttribute: "placeholder-node",
    position: "right",
    side: "center",
    alignment: "center",
    offset: { y: 8 },
    showSkip: true,
    showPrevious: false,
  },
  {
    id: "section-options",
    title: "Select Content Sections",
    description:
      "Click on the section option buttons (small icons next to content blocks) to choose which sections are included in your document. This allows you to customize what content appears based on your requirements.",
    targetDataAttribute: "section-options",
    position: "right",
    side: "center",
    alignment: "center",
    offset: { x: -8 },
    showSkip: true,
    showPrevious: true,
  },
  {
    id: "next-document",
    title: "Progress Through Documents",
    description:
      "Use the 'Next' button to progress through the documents sequentially. This will reveal and take you to the next document in your project workflow.",
    targetDataAttribute: "next-button",
    position: "left",
    side: "center",
    alignment: "center",
    offset: { x: -8 },
    showSkip: false,
    showPrevious: true,
  },
];
