"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { useWalkthroughStore } from "@/app/layout.stores";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/default/ui/accordion";
import { Checkbox } from "@/components/default/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/default/ui/tooltip";
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
    question: "Do you want to use Supabase?",
    description: "Choose your database and authentication provider.",
    icon: Database,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "neondb",
        label: "No, I want to use NeonDB instead",
        description: "Cheaper, more restrictive",
      },
      {
        id: "supabaseWithBetter",
        label: "Yes, use Supabase db with Better-Auth for authentication",
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
    subOptions: [
      {
        id: "magicLink",
        label: "Magic Link",
        description: "Passwordless authentication via email links",
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
      },
      {
        id: "emailPassword",
        label: "Email & Password",
        description: "Traditional email and password authentication",
      },
      {
        id: "otp",
        label: "One-Time Password",
        description: "SMS or email based OTP verification",
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
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
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
      },
    ],
  },
  {
    id: "admin",
    question: "Do you need admin functionality?",
    description: "Administrative interface for managing users and content.",
    icon: Settings,
    requiredTechnologies: [],
    subOptions: [
      {
        id: "superAdmins",
        label: "Super admins",
        description:
          "Created using a script, super admins have full access and can assign other user roles",
      },
      {
        id: "orgAdmins",
        label: "Organisation admins",
        description:
          "Invited by super admins, org admins can manage their own organisations and the members they contain",
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
      },
      {
        id: "orgMembers",
        label: "Organisation members",
        description:
          "Have read access to content related to their organisations",
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
      },
    ],
  },
  {
    id: "fileStorage",
    question: "Do users need to upload files?",
    description:
      "File storage with secure access controls using Supabase Storage for secure, scalable file uploads and management.",
    icon: Upload,
    requiredTechnologies: ["supabase"],
    disabledWhen: (config) => config.questions.useSupabase === "no",
  },
  {
    id: "payments",
    question: "Will you process payments?",
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
        disabledWhen: (config) => config.questions.useSupabase === "authOnly",
      },
    ],
  },
  {
    id: "aiIntegration",
    question: "Do you need AI integration?",
    description: "AI-powered features for enhanced user experience.",
    icon: Settings,
    requiredTechnologies: ["openrouter"],
    subOptions: [
      {
        id: "imageGeneration",
        label: "Image generation",
        description: "AI-powered image creation and editing capabilities",
      },
      {
        id: "textGeneration",
        label: "Text generation",
        description: "AI-powered content creation and text processing",
      },
    ],
  },
  {
    id: "realTimeNotifications",
    question: "Do you need real-time notifications?",
    description:
      "Live updates and push notifications using Supabase Realtime for instant data synchronization.",
    icon: Bell,
    requiredTechnologies: ["supabase"],
    disabledWhen: (config) => config.questions.useSupabase === "no",
    subOptions: [
      {
        id: "emailNotifications",
        label: "Email notifications",
        description: "Send notifications via email using Resend",
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
    if (optionId === "neondb") {
      required.push("neondb", "betterAuth");
    } else if (optionId === "supabaseWithBetter") {
      required.push("supabase", "betterAuth");
    } else if (optionId === "supabaseOnly") {
      required.push("supabase");
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
    if (
      optionId === "magicLink" ||
      optionId === "emailPassword" ||
      optionId === "otp"
    ) {
      required.push("resend");
    }
  } else if (questionId === "admin") {
    if (optionId === "orgAdmins" || optionId === "orgMembers") {
      required.push("betterAuth");
    }
  } else if (questionId === "aiIntegration") {
    required.push("openrouter");
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
      initialConfiguration.features.authentication.appleAuth
    );
  } else if (questionId === "aiIntegration") {
    return (
      initialConfiguration.features.aiIntegration.imageGeneration ||
      initialConfiguration.features.aiIntegration.textGeneration
    );
  } else if (questionId === "realTimeNotifications") {
    return (
      initialConfiguration.features.realTimeNotifications.emailNotifications ||
      initialConfiguration.features.realTimeNotifications.inAppNotifications
    );
  }

  return false;
};

export const InitialConfiguration = () => {
  const {
    darkMode,
    initialConfiguration,
    updateInitialConfiguration,
    updateAuthenticationOption,
    updateAdminOption,
    updatePaymentOption,
    updateAIIntegrationOption,
    updateRealTimeNotificationsOption,
  } = useEditorStore();
  const { canAutoProgress, autoProgressWalkthrough } = useWalkthroughStore();

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

    enabledTechs.add("nextjs");
    enabledTechs.add("shadcn");
    enabledTechs.add("tailwindcss");
    enabledTechs.add("zustand");
    enabledTechs.add("reactQuery");

    if (initialConfiguration.questions.alwaysOnServer) {
      enabledTechs.add("railway");
    } else {
      enabledTechs.add("vercel");
    }

    questionConfigs(initialConfiguration).forEach((question) => {
      const isQuestionEnabled = getFeatureEnabled(question.id);
      if (isQuestionEnabled) {
        question.requiredTechnologies.forEach((tech) => {
          enabledTechs.add(tech);
        });
      }
    });

    const hasDatabaseFunctionality =
      initialConfiguration.features.authentication.enabled ||
      initialConfiguration.features.admin.enabled ||
      initialConfiguration.features.fileStorage ||
      initialConfiguration.features.realTimeNotifications.enabled;

    if (hasDatabaseFunctionality) {
      enabledTechs.add("prisma");
      enabledTechs.add("postgresql");

      if (initialConfiguration.questions.useSupabase !== "no") {
        enabledTechs.add("supabase");
      } else {
        enabledTechs.add("neondb");
      }
    }

    if (initialConfiguration.features.authentication.enabled) {
      if (initialConfiguration.questions.useSupabase === "authOnly") {
        enabledTechs.add("supabase");
      } else if (
        initialConfiguration.questions.useSupabase === "withBetterAuth"
      ) {
        enabledTechs.add("supabase");
        enabledTechs.add("betterAuth");
      } else {
        enabledTechs.add("betterAuth");
      }

      const hasEmailAuth =
        initialConfiguration.features.authentication.magicLink ||
        initialConfiguration.features.authentication.emailPassword ||
        initialConfiguration.features.authentication.otp;
      if (hasEmailAuth) {
        enabledTechs.add("resend");
      }
    }

    if (initialConfiguration.features.payments.enabled) {
      const paymentTechs = getRequiredTechnologiesForPayments(
        initialConfiguration.features.payments
      );
      paymentTechs.forEach((tech) => enabledTechs.add(tech));
    }

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

    if (
      techId === "openrouter" &&
      initialConfiguration.features.aiIntegration.enabled
    ) {
      requiredBy.push("Do you need AI integration?");
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
        className={cn(
          "p-2 rounded-lg border",
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        )}
        data-walkthrough="initial-configuration"
      >
        {enabledTechnologies.length > 0 && (
          <div className="sticky -top-6 z-50 mb-2 p-2 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h4
              className={cn(
                "text-base font-semibold mb-1.5",
                darkMode ? "text-white" : "text-black"
              )}
            >
              Required Technologies
            </h4>
            <div className="flex flex-wrap gap-1">
              {enabledTechnologies.map((tech) => {
                const Icon = tech.icon;
                const requiredBy = getRequiredByFeatures(tech.id);

                return (
                  <Tooltip key={tech.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold cursor-help border",
                          darkMode
                            ? "bg-black text-white border-gray-600"
                            : "bg-gray-100 text-black border-gray-400"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tech.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-48">
                        <p className="font-medium mb-1">Required by:</p>
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

        <Accordion type="single" collapsible className="space-y-1">
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
                className={cn(
                  "transition-all duration-200 data-[state=open]:rounded-lg border-none",
                  darkMode
                    ? "data-[state=open]:bg-black"
                    : "data-[state=open]:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-between w-full py-1 px-2",
                    isQuestionDisabled && "opacity-50"
                  )}
                >
                  <div className="flex-grow ">
                    <AccordionTrigger
                      className="hover:no-underline flex-1 justify-between mr-2 group"
                      disabled={isQuestionDisabled}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors duration-200",
                            darkMode
                              ? "text-white group-data-[state=open]:text-blue-400"
                              : "text-black group-data-[state=open]:text-blue-600"
                          )}
                        />
                        <div className="text-left">
                          <span
                            className={cn(
                              "text-lg font-semibold block",
                              darkMode ? "text-white" : "text-black"
                            )}
                          >
                            {question.question}
                          </span>
                        </div>
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                  </div>

                  <Checkbox
                    checked={isEnabled}
                    disabled={
                      isQuestionDisabled ||
                      (question.subOptions && question.subOptions.length > 0)
                    }
                    onCheckedChange={(checked) => {
                      if (
                        isQuestionDisabled ||
                        (question.subOptions && question.subOptions.length > 0)
                      ) {
                        return;
                      }

                      const isChecking = checked === true;
                      updateFeature(question.id, isChecking);

                      if (canAutoProgress("initial-configuration")) {
                        autoProgressWalkthrough();
                      }
                    }}
                    className={cn(
                      "size-5 border border-gray-500 select-none",
                      isQuestionDisabled ||
                        (question.subOptions && question.subOptions.length > 0)
                        ? "data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-600 data-[state=checked]:text-white cursor-not-allowed opacity-50"
                        : "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                    )}
                  />
                </div>
                <AccordionContent>
                  <div className="px-2 pb-2">
                    {question.subOptions && question.subOptions.length > 0 ? (
                      <div className="space-y-1">
                        {question.subOptions.map((option) => {
                          const isSubOptionDisabled =
                            option.disabledWhen?.(initialConfiguration) ??
                            false;
                          return (
                            <label
                              key={option.id}
                              className={cn(
                                "flex items-start gap-2 cursor-pointer",
                                isSubOptionDisabled &&
                                  "opacity-50 cursor-not-allowed"
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
                                              : false
                                      }
                                      disabled={true}
                                      className={cn(
                                        "size-4 mt-0.5 border border-gray-500 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white select-none"
                                      )}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Requires Better Auth (not available with
                                      Supabase-only auth)
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Checkbox
                                  checked={
                                    question.id === "databaseChoice"
                                      ? (option.id === "neondb" &&
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
                                        | "no"
                                        | "withBetterAuth"
                                        | "authOnly" = "no";
                                      if (option.id === "neondb") {
                                        useSupabaseValue = "no";
                                      } else if (
                                        option.id === "supabaseWithBetter"
                                      ) {
                                        useSupabaseValue = "withBetterAuth";
                                      } else if (option.id === "supabaseOnly") {
                                        useSupabaseValue = "authOnly";
                                      }
                                      updateInitialConfiguration({
                                        questions: {
                                          ...initialConfiguration.questions,
                                          useSupabase: useSupabaseValue,
                                        },
                                        database: {
                                          hosting:
                                            useSupabaseValue === "no"
                                              ? "neondb"
                                              : "supabase",
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
                                    if (
                                      canAutoProgress("initial-configuration")
                                    ) {
                                      autoProgressWalkthrough();
                                    }
                                  }}
                                  className={cn(
                                    "size-4 mt-0.5 border border-gray-500 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white select-none"
                                  )}
                                />
                              )}
                              <div>
                                <span
                                  className={cn(
                                    "text-base font-medium block",
                                    darkMode ? "text-white" : "text-black"
                                  )}
                                >
                                  {option.label}
                                </span>
                                <span
                                  className={cn(
                                    "text-base block mt-0.5 font-medium",
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  )}
                                >
                                  {option.description}
                                </span>
                                <div className="flex flex-wrap gap-1 mt-2">
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
                                        ? (option.id === "neondb" &&
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
                                          "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border",
                                          !isAvailable
                                            ? "bg-gray-200 text-gray-400 border-gray-300 line-through"
                                            : isBadgeActive
                                              ? darkMode
                                                ? "bg-black text-white border-gray-600"
                                                : "bg-black text-white border-gray-400"
                                              : darkMode
                                                ? "bg-gray-800 text-gray-400 border-gray-600"
                                                : "bg-gray-100 text-gray-500 border-gray-300"
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
                      <p
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-gray-200" : "text-gray-800"
                        )}
                      >
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
