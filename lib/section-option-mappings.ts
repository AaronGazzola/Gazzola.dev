import { InitialConfigurationType } from "@/app/(editor)/layout.types";

type ConfigPath =
  | `technologies.${keyof InitialConfigurationType["technologies"]}`
  | `questions.${keyof InitialConfigurationType["questions"]}`
  | `features.${keyof InitialConfigurationType["features"]}`
  | `features.authentication.${keyof InitialConfigurationType["features"]["authentication"]}`
  | `features.admin.${keyof InitialConfigurationType["features"]["admin"]}`
  | `features.payments.${keyof InitialConfigurationType["features"]["payments"]}`
  | `features.realTimeNotifications.${keyof InitialConfigurationType["features"]["realTimeNotifications"]}`
  | `database.${keyof InitialConfigurationType["database"]}`
  | `deployment.${keyof InitialConfigurationType["deployment"]}`;

export interface SectionOptionMapping {
  filePath: string;
  sectionId: string;
  optionId: string;
  configPath: ConfigPath | null;
  matchValue?: any;
}

export const SECTION_OPTION_MAPPINGS: SectionOptionMapping[] = [
  { filePath: "claude", sectionId: "section1", optionId: "option1", configPath: "technologies.nextjs" },
  { filePath: "claude", sectionId: "section1", optionId: "option2", configPath: "technologies.tailwindcss" },
  { filePath: "claude", sectionId: "section1", optionId: "option3", configPath: "technologies.shadcn" },
  { filePath: "claude", sectionId: "section1", optionId: "option4", configPath: "technologies.zustand" },
  { filePath: "claude", sectionId: "section1", optionId: "option5", configPath: "technologies.reactQuery" },
  { filePath: "claude", sectionId: "section1", optionId: "option6", configPath: "technologies.supabase" },
  { filePath: "claude", sectionId: "section1", optionId: "option7", configPath: "technologies.neondb" },
  { filePath: "claude", sectionId: "section1", optionId: "option8", configPath: "technologies.prisma" },
  { filePath: "claude", sectionId: "section1", optionId: "option9", configPath: "technologies.betterAuth" },
  { filePath: "claude", sectionId: "section1", optionId: "option10", configPath: "technologies.postgresql" },
  { filePath: "claude", sectionId: "section1", optionId: "option11", configPath: "technologies.vercel" },
  { filePath: "claude", sectionId: "section1", optionId: "option12", configPath: "technologies.railway" },
  { filePath: "claude", sectionId: "section1", optionId: "option13", configPath: "technologies.cypress" },
  { filePath: "claude", sectionId: "section1", optionId: "option14", configPath: "technologies.resend" },
  { filePath: "claude", sectionId: "section1", optionId: "option15", configPath: "technologies.stripe" },
  { filePath: "claude", sectionId: "section1", optionId: "option16", configPath: "technologies.paypal" },
  { filePath: "claude", sectionId: "section1", optionId: "option17", configPath: "technologies.openrouter" },

  { filePath: "claude", sectionId: "section3", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "claude", sectionId: "section3", optionId: "option2", configPath: "questions.databaseProvider", matchValue: "neondb" },
  { filePath: "claude", sectionId: "section3", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "claude", sectionId: "section3", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "both" },

  { filePath: "claude", sectionId: "section4", optionId: "option1", configPath: null },
  { filePath: "claude", sectionId: "section4", optionId: "option2", configPath: "technologies.cypress" },

  { filePath: "readme", sectionId: "section1", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "readme", sectionId: "section1", optionId: "option2", configPath: "questions.databaseProvider", matchValue: "neondb" },
  { filePath: "readme", sectionId: "section1", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "readme", sectionId: "section1", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "both" },

  { filePath: "readme", sectionId: "section2", optionId: "option1", configPath: "technologies.nextjs" },
  { filePath: "readme", sectionId: "section2", optionId: "option2", configPath: "technologies.tailwindcss" },
  { filePath: "readme", sectionId: "section2", optionId: "option3", configPath: "technologies.shadcn" },
  { filePath: "readme", sectionId: "section2", optionId: "option4", configPath: "technologies.typescript" },
  { filePath: "readme", sectionId: "section2", optionId: "option5", configPath: "technologies.zustand" },
  { filePath: "readme", sectionId: "section2", optionId: "option6", configPath: "technologies.reactQuery" },
  { filePath: "readme", sectionId: "section2", optionId: "option7", configPath: "technologies.supabase" },
  { filePath: "readme", sectionId: "section2", optionId: "option8", configPath: "technologies.neondb" },
  { filePath: "readme", sectionId: "section2", optionId: "option9", configPath: "technologies.prisma" },
  { filePath: "readme", sectionId: "section2", optionId: "option10", configPath: "technologies.betterAuth" },
  { filePath: "readme", sectionId: "section2", optionId: "option11", configPath: "technologies.postgresql" },
  { filePath: "readme", sectionId: "section2", optionId: "option12", configPath: "technologies.vercel" },
  { filePath: "readme", sectionId: "section2", optionId: "option13", configPath: "technologies.railway" },
  { filePath: "readme", sectionId: "section2", optionId: "option14", configPath: "technologies.playwright" },
  { filePath: "readme", sectionId: "section2", optionId: "option15", configPath: "technologies.cypress" },
  { filePath: "readme", sectionId: "section2", optionId: "option16", configPath: "technologies.resend" },
  { filePath: "readme", sectionId: "section2", optionId: "option17", configPath: "technologies.stripe" },
  { filePath: "readme", sectionId: "section2", optionId: "option18", configPath: "technologies.paypal" },
  { filePath: "readme", sectionId: "section2", optionId: "option19", configPath: "technologies.openrouter" },

  { filePath: "readme", sectionId: "section3", optionId: "option1", configPath: null },
  { filePath: "readme", sectionId: "section3", optionId: "option2", configPath: "technologies.prisma" },
  { filePath: "readme", sectionId: "section3", optionId: "option3", configPath: "technologies.supabase" },

  { filePath: "readme", sectionId: "section4", optionId: "option1", configPath: "technologies.supabase" },
  { filePath: "readme", sectionId: "section4", optionId: "option2", configPath: "technologies.neondb" },
  { filePath: "readme", sectionId: "section4", optionId: "option3", configPath: "technologies.prisma" },
  { filePath: "readme", sectionId: "section4", optionId: "option4", configPath: "technologies.betterAuth" },
  { filePath: "readme", sectionId: "section4", optionId: "option5", configPath: "technologies.stripe" },
  { filePath: "readme", sectionId: "section4", optionId: "option6", configPath: "technologies.paypal" },
  { filePath: "readme", sectionId: "section4", optionId: "option7", configPath: "technologies.resend" },
  { filePath: "readme", sectionId: "section4", optionId: "option8", configPath: "technologies.openrouter" },

  { filePath: "readme", sectionId: "section5", optionId: "option1", configPath: null },
  { filePath: "readme", sectionId: "section5", optionId: "option2", configPath: "technologies.playwright" },
  { filePath: "readme", sectionId: "section5", optionId: "option3", configPath: "technologies.cypress" },
  { filePath: "readme", sectionId: "section5", optionId: "option4", configPath: "technologies.prisma" },

  { filePath: "readme", sectionId: "section6", optionId: "option1", configPath: "technologies.vercel" },
  { filePath: "readme", sectionId: "section6", optionId: "option2", configPath: "technologies.railway" },

  { filePath: "robots", sectionId: "section1", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "robots", sectionId: "section1", optionId: "option2", configPath: "questions.databaseProvider", matchValue: "neondb" },
  { filePath: "robots", sectionId: "section1", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "both" },
  { filePath: "robots", sectionId: "section1", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "none" },

  { filePath: "robots", sectionId: "section2", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "robots", sectionId: "section2", optionId: "option2", configPath: "technologies.betterAuth" },
  { filePath: "robots", sectionId: "section2", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "both" },
  { filePath: "robots", sectionId: "section2", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "none" },

  { filePath: "robots", sectionId: "section3", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "robots", sectionId: "section3", optionId: "option2", configPath: "technologies.betterAuth" },
  { filePath: "robots", sectionId: "section3", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "both" },
  { filePath: "robots", sectionId: "section3", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "none" },

  { filePath: "robots", sectionId: "section4", optionId: "option1", configPath: "technologies.playwright" },
  { filePath: "robots", sectionId: "section4", optionId: "option2", configPath: "technologies.cypress" },
  { filePath: "robots", sectionId: "section4", optionId: "option3", configPath: null },
  { filePath: "robots", sectionId: "section4", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "none" },

  { filePath: "docs.deployment-instructions", sectionId: "section1", optionId: "option1", configPath: "technologies.vercel" },
  { filePath: "docs.deployment-instructions", sectionId: "section1", optionId: "option2", configPath: "technologies.railway" },

  { filePath: "docs.deployment-instructions", sectionId: "section2", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "docs.deployment-instructions", sectionId: "section2", optionId: "option2", configPath: "technologies.neondb" },
  { filePath: "docs.deployment-instructions", sectionId: "section2", optionId: "option3", configPath: "technologies.supabase" },

  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option1", configPath: null },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option2", configPath: "technologies.prisma" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option3", configPath: "technologies.betterAuth" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option4", configPath: "technologies.resend" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option5", configPath: "technologies.stripe" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option6", configPath: "technologies.paypal" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option7", configPath: "technologies.openrouter" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option8", configPath: "features.authentication.googleAuth" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option9", configPath: "features.authentication.githubAuth" },
  { filePath: "docs.deployment-instructions", sectionId: "section3", optionId: "option10", configPath: "features.authentication.appleAuth" },

  { filePath: "docs.deployment-instructions", sectionId: "section4", optionId: "option1", configPath: "technologies.betterAuth" },
  { filePath: "docs.deployment-instructions", sectionId: "section4", optionId: "option2", configPath: "questions.databaseProvider", matchValue: "supabase" },
  { filePath: "docs.deployment-instructions", sectionId: "section4", optionId: "option3", configPath: "features.admin.enabled" },

  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option1", configPath: "technologies.stripe" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option2", configPath: "technologies.paypal" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option3", configPath: "technologies.railway" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option4", configPath: "technologies.vercel" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option5", configPath: "technologies.railway" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option6", configPath: "technologies.resend" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option7", configPath: null },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option8", configPath: "technologies.supabase" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option9", configPath: "technologies.supabase" },
  { filePath: "docs.deployment-instructions", sectionId: "section5", optionId: "option10", configPath: null },

  { filePath: "docs.util", sectionId: "section1", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "docs.util", sectionId: "section1", optionId: "option2", configPath: "technologies.prisma" },

  { filePath: "docs.util", sectionId: "section2", optionId: "option1", configPath: "technologies.prisma" },
  { filePath: "docs.util", sectionId: "section2", optionId: "option2", configPath: "questions.databaseProvider", matchValue: "none" },

  { filePath: "docs.util", sectionId: "section3", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "docs.util", sectionId: "section3", optionId: "option2", configPath: "technologies.betterAuth" },
  { filePath: "docs.util", sectionId: "section3", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "both" },
  { filePath: "docs.util", sectionId: "section3", optionId: "option4", configPath: "questions.databaseProvider", matchValue: "supabase" },

  { filePath: "docs.util", sectionId: "section4", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "docs.util", sectionId: "section4", optionId: "option2", configPath: "technologies.betterAuth" },
  { filePath: "docs.util", sectionId: "section4", optionId: "option3", configPath: "questions.databaseProvider", matchValue: "supabase" },

  { filePath: "docs.util", sectionId: "section5", optionId: "option1", configPath: "questions.databaseProvider", matchValue: "none" },
  { filePath: "docs.util", sectionId: "section5", optionId: "option2", configPath: "technologies.betterAuth" },
  { filePath: "docs.util", sectionId: "section5", optionId: "option3", configPath: "technologies.supabase" },

  { filePath: "robots", sectionId: "section1", optionId: "option1", configPath: null },
  { filePath: "robots", sectionId: "section1", optionId: "option2", configPath: null },
  { filePath: "robots", sectionId: "section1", optionId: "option3", configPath: null },

  { filePath: "ide", sectionId: "section1", optionId: "option1", configPath: null },
  { filePath: "ide", sectionId: "section1", optionId: "option2", configPath: null },
  { filePath: "ide", sectionId: "section1", optionId: "option3", configPath: null },
];

export function getConfigValue(config: InitialConfigurationType, path: ConfigPath): any {
  const parts = path.split(".");
  let value: any = config;

  for (const part of parts) {
    value = value[part];
    if (value === undefined) return undefined;
  }

  return value;
}
