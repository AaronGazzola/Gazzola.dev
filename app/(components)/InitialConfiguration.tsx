"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { useWalkthroughStore } from "@/app/(editor)/layout.walkthrough.stores";
import { WalkthroughStep } from "@/app/(editor)/layout.walkthrough.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/editor/ui/accordion";
import { Checkbox } from "@/components/editor/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/editor/ui/tooltip";
import { WalkthroughHelper } from "@/components/WalkthroughHelper";
import { cn } from "@/lib/tailwind.utils";
import {
  Bell,
  ChevronDown,
  CreditCard,
  Database,
  Settings,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  SiCypress,
  SiNextdotjs,
  SiPaypal,
  SiPostgresql,
  SiPrisma,
  SiResend,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";

const BetterAuthIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="69" y="121" width="86.9879" height="259" fill="currentColor" />
    <rect
      x="337.575"
      y="121"
      width="92.4247"
      height="259"
      fill="currentColor"
    />
    <rect
      x="427.282"
      y="121"
      width="83.4555"
      height="174.52"
      transform="rotate(90 427.282 121)"
      fill="currentColor"
    />
    <rect
      x="430"
      y="296.544"
      width="83.4555"
      height="177.238"
      transform="rotate(90 430 296.544)"
      fill="currentColor"
    />
    <rect
      x="252.762"
      y="204.455"
      width="92.0888"
      height="96.7741"
      transform="rotate(90 252.762 204.455)"
      fill="currentColor"
    />
  </svg>
);

const ShadcnIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="currentColor"
  >
    <rect width="256" height="256" fill="none" />
    <line
      x1="208"
      y1="128"
      x2="128"
      y2="208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <line
      x1="192"
      y1="40"
      x2="40"
      y2="192"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </svg>
);

const ZustandIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const ReactQueryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M8 12h8m-4-4v8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const OpenRouterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h4v4H4V4zm8 0h8v4h-8V4zM4 12h8v8H4v-8zm12 0h4v4h-4v-4zm0 8h4v4h-4v-4z" />
  </svg>
);

const NeonDBIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.82l7 3.5v7.36l-7-3.5V9.82zm16 0v7.36l-7 3.5v-7.36l7-3.5z" />
  </svg>
);

const RailwayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8 2 4 3 4 6v9c0 2.21 1.79 4 4 4h.5l-1.5 2h10l-1.5-2h.5c2.21 0 4-1.79 4-4V6c0-3-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-7h-5V6h5v4z" />
  </svg>
);

interface Technology {
  id: keyof InitialConfigurationType["technologies"];
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const technologies: Technology[] = [
  { id: "nextjs", name: "Next.js", icon: SiNextdotjs },
  { id: "tailwindcss", name: "TailwindCSS", icon: SiTailwindcss },
  { id: "shadcn", name: "Shadcn/ui", icon: ShadcnIcon },
  { id: "zustand", name: "Zustand", icon: ZustandIcon },
  { id: "reactQuery", name: "React Query", icon: ReactQueryIcon },
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "neondb", name: "NeonDB", icon: NeonDBIcon },
  { id: "prisma", name: "Prisma", icon: SiPrisma },
  { id: "betterAuth", name: "Better Auth", icon: BetterAuthIcon },
  { id: "postgresql", name: "PostgreSQL", icon: SiPostgresql },
  { id: "vercel", name: "Vercel", icon: SiVercel },
  { id: "railway", name: "Railway", icon: RailwayIcon },
  { id: "cypress", name: "Cypress", icon: SiCypress },
  { id: "resend", name: "Resend", icon: SiResend },
  { id: "stripe", name: "Stripe", icon: SiStripe },
  { id: "paypal", name: "PayPal", icon: SiPaypal },
  { id: "openrouter", name: "OpenRouter", icon: OpenRouterIcon },
];

interface QuestionConfig {
  id: string;
  question: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredTechnologies: (keyof InitialConfigurationType["technologies"])[];
  subOptions?: {
    id: string;
    label: string;
    description: string;
    disabledWhen?: (config: InitialConfigurationType) => boolean;
  }[];
  disabledWhen?: (config: InitialConfigurationType) => boolean;
}

const questionConfigs: (
  config: InitialConfigurationType
) => QuestionConfig[] = (config) => [
  {
    id: "databaseChoice",
    question: "Do you want to use a database?",
    description: "Choose your database and authentication provider.",
    icon: Database,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "noDatabase",
        label: "No, I don't need any custom backend logic",
        description: "No database or authentication functionality",
      },
      {
        id: "neondb",
        label: "Yes, I want to use NeonDB with Better-auth for authentication",
        description: "Cheaper, more restrictive",
      },
      {
        id: "supabaseWithBetter",
        label:
          "Yes, I want to use Supabase with Better-Auth for authentication",
        description: "More options for authentication and integration",
      },
      {
        id: "supabaseOnly",
        label: "Yes, use only Supabase for authentication",
        description:
          "Fewer options for authentication and integration, but better for compliance and audit requirements",
      },
    ],
  },
  {
    id: "deploymentChoice",
    question: 'Do you need an "always on" server?',
    description: "Choose your deployment platform based on your requirements.",
    icon: Settings,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "serverless",
        label: "No, a serverless deployment is sufficient",
        description: "Simpler and cheaper, suitable for most cases",
      },
      {
        id: "alwaysOn",
        label: "Yes, I need live monitoring for continuous service",
        description:
          "More complex and expensive but required for some backend logic",
      },
    ],
  },
  {
    id: "authentication",
    question: "Can users sign in to your app?",
    description: "Enable user authentication and session management.",
    icon: Users,
    requiredTechnologies: [],
    disabledWhen: (config) => config.questions.useSupabase === "none",
    subOptions: [
      {
        id: "magicLink",
        label: "Magic Link",
        description: "Passwordless authentication via email links",
      },
      {
        id: "emailPassword",
        label: "Email & Password",
        description: "Traditional email and password authentication",
      },
      {
        id: "googleAuth",
        label: "Google OAuth",
        description: "Sign in with Google accounts",
      },
      {
        id: "githubAuth",
        label: "GitHub OAuth",
        description: "Sign in with GitHub accounts",
      },
      {
        id: "appleAuth",
        label: "Apple Sign In",
        description: "Sign in with Apple ID",
      },
      {
        id: "passwordOnly",
        label: "Password only",
        description: "Basic password authentication",
      },
    ],
  },
  {
    id: "admin",
    question: "Does your app use role access?",
    description: "Administrative interface for managing users and content.",
    icon: Settings,
    requiredTechnologies: [],
    disabledWhen: (config) => config.questions.useSupabase === "none",
    subOptions: [
      {
        id: "superAdmins",
        label: "Super admins have elevated access",
        description:
          "Created using a script, super admins have full access and can assign other user roles",
      },
      {
        id: "orgMembers",
        label: "Organization access is limited to organization members",
        description:
          "Have read access to content related to their organizations",
        disabledWhen: (config) =>
          config.questions.useSupabase !== "withBetterAuth" &&
          config.questions.useSupabase !== "no",
      },
      {
        id: "orgAdmins",
        label: "Organization admins have elevated access to organizations",
        description:
          "Invited by super admins, org admins can manage their own organizations and the members they contain",
        disabledWhen: (config) =>
          config.questions.useSupabase !== "withBetterAuth" &&
          config.questions.useSupabase !== "no",
      },
    ],
  },
  {
    id: "fileStorage",
    question: "Can users upload files?",
    description:
      "File storage with secure access controls using Supabase Storage for secure, scalable file uploads and management.",
    icon: Upload,
    requiredTechnologies: ["supabase"],
    disabledWhen: (config) =>
      config.questions.useSupabase === "no" ||
      config.questions.useSupabase === "none",
  },
  {
    id: "payments",
    question: "Does your app process payments?",
    description: "Handle payments and subscriptions.",
    icon: CreditCard,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "paypalPayments",
        label: "One-time payments with PayPal",
        description: "Accept one-time payments via PayPal",
      },
      {
        id: "stripePayments",
        label: "One-time payments with Stripe",
        description: "Accept one-time payments via Stripe",
      },
      {
        id: "stripeSubscriptions",
        label: "Subscription management with Stripe",
        description:
          "Recurring subscription billing with Stripe and Better Auth",
        disabledWhen: (config) =>
          (config.questions.useSupabase !== "withBetterAuth" &&
            config.questions.useSupabase !== "no") ||
          !config.features.authentication.enabled,
      },
    ],
  },
  {
    id: "aiIntegration",
    question: "Do you need AI integration?",
    description: "AI-powered features for enhanced user experience.",
    icon: Settings,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "imageGeneration",
        label: "Yes I need to generate and store images",
        description: "Generate and store AI-generated images",
        disabledWhen: (config) =>
          config.questions.useSupabase === "no" ||
          config.questions.useSupabase === "none",
      },
      {
        id: "textGeneration",
        label: "Yes I need to generate text or analyse images",
        description: "Generate text content or analyze images using AI",
      },
    ],
  },
  {
    id: "realTimeNotifications",
    question: "Do you need realtime notifications?",
    description:
      "Live updates and push notifications using Supabase Realtime for instant data synchronization.",
    icon: Bell,
    requiredTechnologies: ["supabase"],
    disabledWhen: (config) =>
      config.questions.useSupabase === "no" ||
      config.questions.useSupabase === "none",
    subOptions: [
      {
        id: "emailNotifications",
        label: "Email notifications",
        description: "Send notifications via email using Resend",
        disabledWhen: (config) => !config.features.authentication.enabled,
      },
      {
        id: "inAppNotifications",
        label: "In-app notifications",
        description: "Real-time notifications within your application",
      },
    ],
  },
];

const getRequiredTechnologiesForPayments = (
  paymentFeatures: InitialConfigurationType["features"]["payments"]
): (keyof InitialConfigurationType["technologies"])[] => {
  const required: (keyof InitialConfigurationType["technologies"])[] = [];

  if (paymentFeatures.stripePayments || paymentFeatures.stripeSubscriptions) {
    required.push("stripe");
  }
  if (paymentFeatures.paypalPayments) {
    required.push("paypal");
  }
  if (paymentFeatures.stripeSubscriptions) {
    required.push("betterAuth");
  }

  return required;
};

const getRequiredTechnologiesForSubOption = (
  questionId: string,
  optionId: string
): (keyof InitialConfigurationType["technologies"])[] => {
  const required: (keyof InitialConfigurationType["technologies"])[] = [];

  if (questionId === "databaseChoice") {
    if (optionId === "noDatabase") {
    } else if (optionId === "neondb") {
      required.push("neondb", "betterAuth", "prisma", "postgresql");
    } else if (optionId === "supabaseWithBetter") {
      required.push("supabase", "betterAuth", "prisma", "postgresql");
    } else if (optionId === "supabaseOnly") {
      required.push("supabase", "prisma", "postgresql");
    }
  } else if (questionId === "deploymentChoice") {
    if (optionId === "serverless") {
      required.push("vercel");
    } else if (optionId === "alwaysOn") {
      required.push("railway");
    }
  } else if (questionId === "payments") {
    if (optionId === "paypalPayments") {
      required.push("paypal");
    } else if (optionId === "stripePayments") {
      required.push("stripe");
    } else if (optionId === "stripeSubscriptions") {
      required.push("stripe", "betterAuth");
    }
  } else if (questionId === "authentication") {
    if (optionId === "magicLink" || optionId === "emailPassword") {
      required.push("resend");
    }
  } else if (questionId === "admin") {
    if (optionId === "orgAdmins" || optionId === "orgMembers") {
      required.push("betterAuth");
    }
  } else if (questionId === "aiIntegration") {
    if (optionId === "imageGeneration") {
      required.push("openrouter", "supabase");
    } else if (optionId === "textGeneration") {
      required.push("openrouter");
    }
  } else if (questionId === "realTimeNotifications") {
    required.push("supabase");
    if (optionId === "emailNotifications") {
      required.push("resend");
    }
  }

  return required;
};

const hasAnyChildrenSelected = (
  questionId: string,
  initialConfiguration: InitialConfigurationType
): boolean => {
  if (questionId === "databaseChoice") {
    return true;
  } else if (questionId === "deploymentChoice") {
    return true;
  } else if (questionId === "payments") {
    return (
      initialConfiguration.features.payments.paypalPayments ||
      initialConfiguration.features.payments.stripePayments ||
      initialConfiguration.features.payments.stripeSubscriptions
    );
  } else if (questionId === "admin") {
    return (
      initialConfiguration.features.admin.superAdmins ||
      initialConfiguration.features.admin.orgAdmins ||
      initialConfiguration.features.admin.orgMembers
    );
  } else if (questionId === "authentication") {
    return (
      initialConfiguration.features.authentication.magicLink ||
      initialConfiguration.features.authentication.emailPassword ||
      initialConfiguration.features.authentication.otp ||
      initialConfiguration.features.authentication.googleAuth ||
      initialConfiguration.features.authentication.githubAuth ||
      initialConfiguration.features.authentication.appleAuth ||
      initialConfiguration.features.authentication.passwordOnly
    );
  } else if (questionId === "realTimeNotifications") {
    return (
      initialConfiguration.features.realTimeNotifications.emailNotifications ||
      initialConfiguration.features.realTimeNotifications.inAppNotifications
    );
  } else if (questionId === "aiIntegration") {
    return (
      initialConfiguration.features.aiIntegration.imageGeneration ||
      initialConfiguration.features.aiIntegration.textGeneration
    );
  }

  return false;
};

const getDisabledReason = (
  questionId: string,
  optionId: string | null,
  config: InitialConfigurationType
): string | null => {
  if (questionId === "authentication" && !optionId) {
    if (config.questions.useSupabase === "none") {
      return "Requires a database (Question 1)";
    }
  }

  if (questionId === "admin" && !optionId) {
    if (config.questions.useSupabase === "none") {
      return "Requires a database (Question 1)";
    }
  }

  if (questionId === "fileStorage" && !optionId) {
    if (config.questions.useSupabase === "none") {
      return "Requires a database (Question 1)";
    }
    if (config.questions.useSupabase === "no") {
      return "Requires Supabase (Question 1)";
    }
  }

  if (questionId === "realTimeNotifications" && !optionId) {
    if (config.questions.useSupabase === "none") {
      return "Requires a database (Question 1)";
    }
    if (config.questions.useSupabase === "no") {
      return "Requires Supabase (Question 1)";
    }
  }

  if (questionId === "admin" && optionId === "orgMembers") {
    if (config.questions.useSupabase === "authOnly") {
      return "Requires Better-Auth (Question 1: choose NeonDB or Supabase with Better-Auth)";
    }
  }

  if (questionId === "admin" && optionId === "orgAdmins") {
    if (config.questions.useSupabase === "authOnly") {
      return "Requires Better-Auth (Question 1: choose NeonDB or Supabase with Better-Auth)";
    }
  }

  if (questionId === "payments" && optionId === "stripeSubscriptions") {
    if (config.questions.useSupabase === "authOnly") {
      return "Requires Better-Auth (Question 1: choose NeonDB or Supabase with Better-Auth)";
    }
    if (!config.features.authentication.enabled) {
      return "Requires user authentication (Question 3)";
    }
  }

  if (
    questionId === "realTimeNotifications" &&
    optionId === "emailNotifications"
  ) {
    if (!config.features.authentication.enabled) {
      return "Requires user authentication (Question 3)";
    }
  }

  if (questionId === "aiIntegration" && optionId === "imageGeneration") {
    if (
      config.questions.useSupabase === "no" ||
      config.questions.useSupabase === "none"
    ) {
      return "Requires Supabase (Question 1)";
    }
  }

  return null;
};

export const InitialConfiguration = () => {
  const {
    initialConfiguration,
    updateInitialConfiguration,
    updateAuthenticationOption,
    updateAdminOption,
    updatePaymentOption,
    updateAIIntegrationOption,
    updateRealTimeNotificationsOption,
  } = useEditorStore();

  const { shouldShowStep, markStepComplete, isStepOpen, setStepOpen } =
    useWalkthroughStore();

  const [configHelpOpen, setConfigHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showConfigHelp =
    mounted && shouldShowStep(WalkthroughStep.CONFIGURATION);

  const getFeatureEnabled = (featureId: string): boolean => {
    if (featureId === "databaseChoice" || featureId === "deploymentChoice") {
      return true;
    } else if (featureId === "authentication") {
      return initialConfiguration.features.authentication.enabled;
    } else if (featureId === "admin") {
      return initialConfiguration.features.admin.enabled;
    } else if (featureId === "payments") {
      return initialConfiguration.features.payments.enabled;
    } else if (featureId === "aiIntegration") {
      return initialConfiguration.features.aiIntegration.enabled;
    } else if (featureId === "realTimeNotifications") {
      return initialConfiguration.features.realTimeNotifications.enabled;
    }
    return initialConfiguration.features[
      featureId as keyof typeof initialConfiguration.features
    ] as boolean;
  };

  const getEnabledTechnologies = () => {
    const enabledTechs = new Set<
      keyof InitialConfigurationType["technologies"]
    >();

    Object.entries(initialConfiguration.technologies).forEach(
      ([techId, isEnabled]) => {
        if (isEnabled) {
          enabledTechs.add(
            techId as keyof InitialConfigurationType["technologies"]
          );
        }
      }
    );

    return Array.from(enabledTechs)
      .map((techId) => technologies.find((t) => t.id === techId))
      .filter((tech): tech is Technology => tech !== undefined);
  };

  const getRequiredByFeatures = (
    techId: keyof InitialConfigurationType["technologies"]
  ) => {
    const requiredBy: string[] = [];

    if (
      techId === "nextjs" ||
      techId === "shadcn" ||
      techId === "tailwindcss" ||
      techId === "zustand" ||
      techId === "reactQuery"
    ) {
      requiredBy.push("Core technology stack");
    }

    if (techId === "vercel" && !initialConfiguration.questions.alwaysOnServer) {
      requiredBy.push("Serverless deployment");
    }

    if (techId === "railway" && initialConfiguration.questions.alwaysOnServer) {
      requiredBy.push("Always-on server deployment");
    }

    questionConfigs(initialConfiguration).forEach((question) => {
      const isEnabled = getFeatureEnabled(question.id);
      if (isEnabled && question.requiredTechnologies.includes(techId)) {
        requiredBy.push(question.question);
      }
    });

    if (techId === "prisma" || techId === "postgresql") {
      const hasDatabaseFunctionality =
        initialConfiguration.features.authentication.enabled ||
        initialConfiguration.features.admin.enabled ||
        initialConfiguration.features.fileStorage ||
        initialConfiguration.features.realTimeNotifications.enabled;

      if (hasDatabaseFunctionality) {
        requiredBy.push("Database functionality");
      }
    }

    if (techId === "neondb") {
      if (initialConfiguration.questions.useSupabase === "no") {
        requiredBy.push("NeonDB database hosting");
      }
    }

    if (
      techId === "betterAuth" &&
      initialConfiguration.features.authentication.enabled
    ) {
      if (
        initialConfiguration.questions.useSupabase === "no" ||
        initialConfiguration.questions.useSupabase === "withBetterAuth"
      ) {
        requiredBy.push("Can users sign in to your app?");
      }
    }

    if (techId === "supabase") {
      if (initialConfiguration.questions.useSupabase !== "no") {
        requiredBy.push("Supabase database & authentication");
      }
    }

    if (techId === "resend") {
      if (initialConfiguration.features.authentication.enabled) {
        const hasEmailAuth =
          initialConfiguration.features.authentication.magicLink ||
          initialConfiguration.features.authentication.emailPassword ||
          initialConfiguration.features.authentication.otp;
        if (hasEmailAuth) {
          requiredBy.push("Email-based authentication methods");
        }
      }
      if (
        initialConfiguration.features.realTimeNotifications.enabled &&
        initialConfiguration.features.realTimeNotifications.emailNotifications
      ) {
        requiredBy.push("Email notifications");
      }
    }

    if (techId === "openrouter") {
      if (initialConfiguration.features.aiIntegration.imageGeneration) {
        requiredBy.push("AI image generation");
      }
      if (initialConfiguration.features.aiIntegration.textGeneration) {
        requiredBy.push("AI text generation or image analysis");
      }
    }

    if (initialConfiguration.features.payments.enabled) {
      const paymentTechs = getRequiredTechnologiesForPayments(
        initialConfiguration.features.payments
      );
      if (paymentTechs.includes(techId)) {
        requiredBy.push("Will you process payments?");
      }
    }

    return requiredBy;
  };

  const updateFeature = (featureId: string, enabled: boolean) => {
    const question = questionConfigs(initialConfiguration).find(
      (q) => q.id === featureId
    );
    if (!question) return;

    if (enabled) {
      const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};
      question.requiredTechnologies.forEach((tech) => {
        techUpdates[tech] = true;
      });

      if (featureId === "authentication") {
        if (initialConfiguration.questions.useSupabase === "no") {
          techUpdates["betterAuth"] = true;
        } else if (
          initialConfiguration.questions.useSupabase === "withBetterAuth"
        ) {
          techUpdates["supabase"] = true;
          techUpdates["betterAuth"] = true;
        } else {
          techUpdates["supabase"] = true;
        }
      }

      updateInitialConfiguration({
        technologies: {
          ...initialConfiguration.technologies,
          ...techUpdates,
        },
      });
    }

    if (featureId === "authentication") {
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          authentication: {
            ...initialConfiguration.features.authentication,
            enabled,
          },
        },
      });
    } else if (featureId === "admin") {
      if (
        enabled &&
        initialConfiguration.questions.useSupabase === "authOnly"
      ) {
        return;
      }
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          admin: {
            ...initialConfiguration.features.admin,
            enabled,
          },
        },
      });
    } else if (featureId === "payments") {
      const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};

      if (enabled) {
        const paymentTechs = getRequiredTechnologiesForPayments(
          initialConfiguration.features.payments
        );
        paymentTechs.forEach((tech) => {
          techUpdates[tech] = true;
        });
      }

      updateInitialConfiguration({
        technologies: {
          ...initialConfiguration.technologies,
          ...techUpdates,
        },
        features: {
          ...initialConfiguration.features,
          payments: {
            ...initialConfiguration.features.payments,
            enabled,
          },
        },
      });
    } else if (featureId === "aiIntegration") {
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          aiIntegration: {
            ...initialConfiguration.features.aiIntegration,
            enabled,
          },
        },
      });
    } else if (featureId === "realTimeNotifications") {
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          realTimeNotifications: {
            ...initialConfiguration.features.realTimeNotifications,
            enabled,
          },
        },
      });
    } else {
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          [featureId]: enabled,
        },
      });
    }
  };

  const enabledTechnologies = getEnabledTechnologies();

  return (
    <TooltipProvider>
      <div
        className="theme-bg-card theme-text-card-foreground theme-border-border theme-radius theme-shadow theme-p-2 border"
        data-walkthrough="initial-configuration"
      >
        {enabledTechnologies.length > 0 && (
          <div className="theme-bg-background theme-radius theme-shadow sticky top-[-24px] z-50 theme-mb-1 theme-p-6 backdrop-blur-lg">
            <h4 className="theme-text-card-foreground text-sm font-semibold theme-mb-1">
              Required Technologies
            </h4>
            <div className="flex flex-wrap theme-gap-2">
              {enabledTechnologies.map((tech) => {
                const Icon = tech.icon;
                const requiredBy = getRequiredByFeatures(tech.id);

                return (
                  <Tooltip key={tech.id}>
                    <TooltipTrigger asChild>
                      <div className="theme-bg-secondary theme-text-secondary-foreground theme-border-border theme-shadow flex items-center theme-gap-1 theme-px-2 theme-py-0\.5 rounded-full text-xs font-semibold cursor-help border whitespace-nowrap">
                        <Icon className="w-3 h-3" />
                        <span>{tech.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="theme-bg-popover theme-text-popover-foreground theme-border-border theme-radius theme-shadow">
                      <div className="max-w-[12rem]">
                        <p className="font-medium theme-mb-1">Required by:</p>
                        <ul className="text-sm">
                          {requiredBy.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}

        <Accordion
          type="single"
          collapsible
          className="flex flex-col theme-gap-1"
          onValueChange={(value) => {
            if (value === "databaseChoice" && showConfigHelp) {
              markStepComplete(WalkthroughStep.CONFIGURATION);
            }
          }}
        >
          {questionConfigs(initialConfiguration).map((question) => {
            const Icon = question.icon;
            const isQuestionDisabled =
              question.disabledWhen?.(initialConfiguration) ?? false;
            const isEnabled =
              question.subOptions && question.subOptions.length > 0
                ? hasAnyChildrenSelected(question.id, initialConfiguration)
                : getFeatureEnabled(question.id);
            let questionRequiredTechs = question.requiredTechnologies
              .map((techId) => technologies.find((t) => t.id === techId))
              .filter((tech): tech is Technology => tech !== undefined);

            if (question.id === "authentication") {
              if (initialConfiguration.questions.useSupabase === "authOnly") {
                const supabaseTech = technologies.find(
                  (t) => t.id === "supabase"
                );
                if (supabaseTech) {
                  questionRequiredTechs = [
                    ...questionRequiredTechs,
                    supabaseTech,
                  ];
                }
              } else if (
                initialConfiguration.questions.useSupabase === "withBetterAuth"
              ) {
                const supabaseTech = technologies.find(
                  (t) => t.id === "supabase"
                );
                const betterAuthTech = technologies.find(
                  (t) => t.id === "betterAuth"
                );
                if (supabaseTech)
                  questionRequiredTechs = [
                    ...questionRequiredTechs,
                    supabaseTech,
                  ];
                if (betterAuthTech)
                  questionRequiredTechs = [
                    ...questionRequiredTechs,
                    betterAuthTech,
                  ];
              } else {
                const betterAuthTech = technologies.find(
                  (t) => t.id === "betterAuth"
                );
                if (betterAuthTech) {
                  questionRequiredTechs = [
                    ...questionRequiredTechs,
                    betterAuthTech,
                  ];
                }
              }
            }

            if (question.id === "payments") {
              const paymentTechs = getRequiredTechnologiesForPayments(
                initialConfiguration.features.payments
              );
              const additionalTechs = paymentTechs
                .map((techId) => technologies.find((t) => t.id === techId))
                .filter((tech): tech is Technology => tech !== undefined);
              questionRequiredTechs = [
                ...questionRequiredTechs,
                ...additionalTechs,
              ];
            }

            return (
              <AccordionItem
                key={question.id}
                value={question.id}
                className="transition-all duration-200 border-none relative"
              >
                <AccordionTrigger
                  className={cn(
                    "flex items-center w-full theme-py-1 theme-px-2 theme-pr-10 hover:no-underline [&>svg]:hidden [&[data-state=open]_.chevron]:rotate-180",
                    isQuestionDisabled && "opacity-50"
                  )}
                  disabled={isQuestionDisabled}
                >
                  <div className="flex items-center theme-gap-2 flex-1 min-w-0">
                    <Icon className="theme-text-foreground w-5 h-5 transition-colors duration-200 shrink-0" />
                    <span className="theme-text-foreground text-lg font-semibold">
                      {question.question}
                    </span>
                    {question.id === "databaseChoice" && showConfigHelp && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <WalkthroughHelper
                          isOpen={configHelpOpen}
                          onOpenChange={(open) => {
                            setConfigHelpOpen(open);
                            if (
                              !open &&
                              isStepOpen(WalkthroughStep.CONFIGURATION)
                            ) {
                              markStepComplete(WalkthroughStep.CONFIGURATION);
                            } else if (
                              open &&
                              !isStepOpen(WalkthroughStep.CONFIGURATION)
                            ) {
                              setStepOpen(WalkthroughStep.CONFIGURATION, true);
                            }
                          }}
                          showAnimation={
                            !isStepOpen(WalkthroughStep.CONFIGURATION)
                          }
                          title="Technology Selection"
                          description="Select options in these questions to customize your technology stack. Your selections will automatically determine which technologies are required for your web application."
                          iconSize="sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center theme-gap-2 shrink-0">
                    <ChevronDown className="chevron h-4 w-4 shrink-0 transition-transform duration-200" />
                  </div>
                </AccordionTrigger>

                <div className="absolute right-2 top-0 theme-pt-5 z-10">
                  {isQuestionDisabled ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Checkbox
                            checked={isEnabled}
                            disabled={true}
                            className={cn(
                              "size-5 border border-gray-500 select-none data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-600 data-[state=checked]:text-white cursor-not-allowed opacity-50"
                            )}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {getDisabledReason(
                            question.id,
                            null,
                            initialConfiguration
                          ) || "Question not available"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Checkbox
                      checked={isEnabled}
                      disabled={
                        question.subOptions && question.subOptions.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (
                          question.subOptions &&
                          question.subOptions.length > 0
                        ) {
                          return;
                        }

                        const isChecking = checked === true;
                        updateFeature(question.id, isChecking);
                      }}
                      className={cn(
                        "size-5 border border-gray-500 select-none",
                        question.subOptions && question.subOptions.length > 0
                          ? "data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-600 data-[state=checked]:text-white cursor-not-allowed opacity-50"
                          : "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                      )}
                    />
                  )}
                </div>
                <AccordionContent>
                  <div className="theme-px-2 theme-pb-2 theme-pt-0">
                    {question.subOptions && question.subOptions.length > 0 ? (
                      <div className="flex flex-col theme-gap-1">
                        {question.subOptions.map((option) => {
                          const isSubOptionDisabled =
                            option.disabledWhen?.(initialConfiguration) ??
                            false;
                          return (
                            <label
                              key={option.id}
                              className={cn(
                                "flex items-start theme-gap-2",
                                isSubOptionDisabled
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                              )}
                            >
                              {isSubOptionDisabled ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Checkbox
                                      checked={
                                        question.id === "admin"
                                          ? initialConfiguration.features.admin[
                                              option.id as keyof typeof initialConfiguration.features.admin
                                            ] || false
                                          : question.id === "authentication"
                                            ? initialConfiguration.features
                                                .authentication[
                                                option.id as keyof typeof initialConfiguration.features.authentication
                                              ] || false
                                            : question.id === "payments"
                                              ? initialConfiguration.features
                                                  .payments[
                                                  option.id as keyof typeof initialConfiguration.features.payments
                                                ] || false
                                              : question.id ===
                                                  "realTimeNotifications"
                                                ? initialConfiguration.features
                                                    .realTimeNotifications[
                                                    option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                                  ] || false
                                                : false
                                      }
                                      disabled={true}
                                      className="size-4 theme-mt-0\.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {getDisabledReason(
                                        question.id,
                                        option.id,
                                        initialConfiguration
                                      ) || "Option not available"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Checkbox
                                  checked={
                                    question.id === "databaseChoice"
                                      ? (option.id === "noDatabase" &&
                                          initialConfiguration.questions
                                            .useSupabase === "none") ||
                                        (option.id === "neondb" &&
                                          initialConfiguration.questions
                                            .useSupabase === "no") ||
                                        (option.id === "supabaseWithBetter" &&
                                          initialConfiguration.questions
                                            .useSupabase ===
                                            "withBetterAuth") ||
                                        (option.id === "supabaseOnly" &&
                                          initialConfiguration.questions
                                            .useSupabase === "authOnly")
                                      : question.id === "deploymentChoice"
                                        ? (option.id === "serverless" &&
                                            !initialConfiguration.questions
                                              .alwaysOnServer) ||
                                          (option.id === "alwaysOn" &&
                                            initialConfiguration.questions
                                              .alwaysOnServer)
                                        : question.id === "payments"
                                          ? initialConfiguration.features
                                              .payments[
                                              option.id as keyof typeof initialConfiguration.features.payments
                                            ] || false
                                          : question.id === "admin"
                                            ? initialConfiguration.features
                                                .admin[
                                                option.id as keyof typeof initialConfiguration.features.admin
                                              ] || false
                                            : question.id === "authentication"
                                              ? initialConfiguration.features
                                                  .authentication[
                                                  option.id as keyof typeof initialConfiguration.features.authentication
                                                ] || false
                                              : question.id === "aiIntegration"
                                                ? initialConfiguration.features
                                                    .aiIntegration[
                                                    option.id as keyof typeof initialConfiguration.features.aiIntegration
                                                  ] || false
                                                : question.id ===
                                                    "realTimeNotifications"
                                                  ? initialConfiguration
                                                      .features
                                                      .realTimeNotifications[
                                                      option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                                    ] || false
                                                  : false
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked && isSubOptionDisabled) {
                                      return;
                                    }

                                    if (
                                      question.id === "databaseChoice" &&
                                      checked
                                    ) {
                                      let useSupabaseValue:
                                        | "none"
                                        | "no"
                                        | "withBetterAuth"
                                        | "authOnly" = "none";
                                      const techUpdates: Partial<
                                        InitialConfigurationType["technologies"]
                                      > = {};
                                      const featureUpdates: Partial<
                                        InitialConfigurationType["features"]
                                      > = {};

                                      if (option.id === "noDatabase") {
                                        useSupabaseValue = "none";
                                        techUpdates.supabase = false;
                                        techUpdates.neondb = false;
                                        techUpdates.betterAuth = false;
                                        techUpdates.prisma = false;
                                        techUpdates.postgresql = false;
                                        featureUpdates.authentication = {
                                          ...initialConfiguration.features
                                            .authentication,
                                          enabled: false,
                                        };
                                        featureUpdates.admin = {
                                          ...initialConfiguration.features
                                            .admin,
                                          enabled: false,
                                        };
                                        featureUpdates.fileStorage = false;
                                        featureUpdates.realTimeNotifications = {
                                          ...initialConfiguration.features
                                            .realTimeNotifications,
                                          enabled: false,
                                        };
                                      } else if (option.id === "neondb") {
                                        useSupabaseValue = "no";
                                        techUpdates.neondb = true;
                                        techUpdates.betterAuth = true;
                                        techUpdates.prisma = true;
                                        techUpdates.postgresql = true;
                                        techUpdates.supabase = false;
                                        featureUpdates.fileStorage = false;
                                        featureUpdates.realTimeNotifications = {
                                          ...initialConfiguration.features
                                            .realTimeNotifications,
                                          enabled: false,
                                        };
                                      } else if (
                                        option.id === "supabaseWithBetter"
                                      ) {
                                        useSupabaseValue = "withBetterAuth";
                                        techUpdates.supabase = true;
                                        techUpdates.betterAuth = true;
                                        techUpdates.prisma = true;
                                        techUpdates.postgresql = true;
                                        techUpdates.neondb = false;
                                      } else if (option.id === "supabaseOnly") {
                                        useSupabaseValue = "authOnly";
                                        techUpdates.supabase = true;
                                        techUpdates.prisma = true;
                                        techUpdates.postgresql = true;
                                        techUpdates.betterAuth = false;
                                        techUpdates.neondb = false;
                                        const adminUpdates = {
                                          ...initialConfiguration.features
                                            .admin,
                                        };
                                        if (
                                          adminUpdates.orgAdmins ||
                                          adminUpdates.orgMembers
                                        ) {
                                          adminUpdates.orgAdmins = false;
                                          adminUpdates.orgMembers = false;
                                        }
                                        featureUpdates.admin = adminUpdates;
                                      }
                                      updateInitialConfiguration({
                                        questions: {
                                          ...initialConfiguration.questions,
                                          useSupabase: useSupabaseValue,
                                        },
                                        database: {
                                          hosting:
                                            useSupabaseValue === "none"
                                              ? "postgresql"
                                              : useSupabaseValue === "no"
                                                ? "neondb"
                                                : "supabase",
                                        },
                                        technologies: {
                                          ...initialConfiguration.technologies,
                                          ...techUpdates,
                                        },
                                        features: {
                                          ...initialConfiguration.features,
                                          ...featureUpdates,
                                        },
                                      });
                                    } else if (
                                      question.id === "deploymentChoice" &&
                                      checked
                                    ) {
                                      const alwaysOn = option.id === "alwaysOn";
                                      updateInitialConfiguration({
                                        questions: {
                                          ...initialConfiguration.questions,
                                          alwaysOnServer: alwaysOn,
                                        },
                                        deployment: {
                                          platform: alwaysOn
                                            ? "railway"
                                            : "vercel",
                                        },
                                        technologies: {
                                          ...initialConfiguration.technologies,
                                          vercel: !alwaysOn,
                                          railway: alwaysOn,
                                        },
                                      });
                                    } else if (question.id === "payments") {
                                      updatePaymentOption(
                                        option.id,
                                        checked === true
                                      );
                                    } else if (question.id === "admin") {
                                      updateAdminOption(
                                        option.id,
                                        checked === true
                                      );
                                    } else if (
                                      question.id === "authentication"
                                    ) {
                                      updateAuthenticationOption(
                                        option.id,
                                        checked === true
                                      );
                                    } else if (
                                      question.id === "aiIntegration"
                                    ) {
                                      updateAIIntegrationOption(
                                        option.id,
                                        checked === true
                                      );
                                    } else if (
                                      question.id === "realTimeNotifications"
                                    ) {
                                      updateRealTimeNotificationsOption(
                                        option.id,
                                        checked === true
                                      );
                                    }
                                  }}
                                  className="size-4 mt-0.5 border border-[hsl(var(--input))] data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] select-none"
                                />
                              )}
                              <div>
                                <span className="theme-text-foreground text-base font-medium block">
                                  {option.label}
                                </span>
                                <span className="theme-text-muted-foreground text-base block theme-mt-0\.5 font-medium">
                                  {option.description}
                                </span>
                                <div className="flex flex-wrap theme-gap-1 theme-mt-2">
                                  {getRequiredTechnologiesForSubOption(
                                    question.id,
                                    option.id
                                  ).map((techId) => {
                                    const tech = technologies.find(
                                      (t) => t.id === techId
                                    );
                                    if (!tech) return null;

                                    const Icon = tech.icon;

                                    // Check if this specific sub-option is selected
                                    const isSubOptionSelected =
                                      question.id === "databaseChoice"
                                        ? (option.id === "noDatabase" &&
                                            initialConfiguration.questions
                                              .useSupabase === "none") ||
                                          (option.id === "neondb" &&
                                            initialConfiguration.questions
                                              .useSupabase === "no") ||
                                          (option.id === "supabaseWithBetter" &&
                                            initialConfiguration.questions
                                              .useSupabase ===
                                              "withBetterAuth") ||
                                          (option.id === "supabaseOnly" &&
                                            initialConfiguration.questions
                                              .useSupabase === "authOnly")
                                        : question.id === "deploymentChoice"
                                          ? (option.id === "serverless" &&
                                              !initialConfiguration.questions
                                                .alwaysOnServer) ||
                                            (option.id === "alwaysOn" &&
                                              initialConfiguration.questions
                                                .alwaysOnServer)
                                          : question.id === "payments"
                                            ? initialConfiguration.features
                                                .payments[
                                                option.id as keyof typeof initialConfiguration.features.payments
                                              ] || false
                                            : question.id === "admin"
                                              ? initialConfiguration.features
                                                  .admin[
                                                  option.id as keyof typeof initialConfiguration.features.admin
                                                ] || false
                                              : question.id === "authentication"
                                                ? initialConfiguration.features
                                                    .authentication[
                                                    option.id as keyof typeof initialConfiguration.features.authentication
                                                  ] || false
                                                : question.id ===
                                                    "aiIntegration"
                                                  ? initialConfiguration
                                                      .features.aiIntegration[
                                                      option.id as keyof typeof initialConfiguration.features.aiIntegration
                                                    ] || false
                                                  : question.id ===
                                                      "realTimeNotifications"
                                                    ? initialConfiguration
                                                        .features
                                                        .realTimeNotifications[
                                                        option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                                      ] || false
                                                    : false;

                                    // Badge is active only if technology is enabled AND this specific sub-option is selected
                                    const isBadgeActive =
                                      initialConfiguration.technologies[
                                        techId
                                      ] && isSubOptionSelected;

                                    const isAvailable = !isSubOptionDisabled;

                                    return (
                                      <div
                                        key={techId}
                                        className={cn(
                                          "theme-radius theme-shadow flex items-center theme-gap-1 theme-px-1\.5 theme-py-0\.5 text-xs font-medium border",
                                          !isAvailable
                                            ? "theme-bg-muted theme-text-muted-foreground theme-border-border line-through opacity-50"
                                            : isBadgeActive
                                              ? "theme-bg-primary theme-text-primary-foreground theme-border-primary"
                                              : "theme-bg-secondary theme-text-secondary-foreground theme-border-border"
                                        )}
                                      >
                                        <Icon className="w-3 h-3" />
                                        <span>{tech.name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="theme-text-foreground text-sm font-medium">
                        {question.description}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </TooltipProvider>
  );
};
