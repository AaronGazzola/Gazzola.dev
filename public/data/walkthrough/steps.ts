import { WalkthroughStep } from "@/app/layout.types";

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "placeholder-element",
    title: "Customize Your App Name",
    description:
      "Click on any highlighted placeholder element to customize it with your app name. Try editing one now - the walkthrough will automatically continue when you finish editing.",
    targetDataAttribute: "placeholder-node",
    position: "right",
    side: "center",
    alignment: "center",
    offset: { y: 8 },
    showSkip: true,
    showPrevious: false,
  },
  {
    id: "initial-configuration",
    title: "Configure Your App Features",
    description:
      "Select the features your app needs by checking or unchecking options in the Initial Configuration section. The walkthrough will continue when you make a selection.",
    targetDataAttribute: "initial-configuration",
    position: "left",
    side: "start",
    alignment: "end",
    offset: { x: -8 },
    showSkip: true,
    showPrevious: true,
  },
  {
    id: "next-button",
    title: "Navigate to Next Document",
    description:
      "Click the 'Next' button to progress to the next document. This will advance you through your project workflow.",
    targetDataAttribute: "next-button",
    position: "left",
    side: "center",
    alignment: "center",
    offset: { x: -8 },
    showSkip: false,
    showPrevious: true,
  },
];
