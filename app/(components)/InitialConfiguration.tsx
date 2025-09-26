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
  Mail,
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
  { id: "prisma", name: "Prisma", icon: SiPrisma },
  { id: "betterAuth", name: "Better Auth", icon: BetterAuthIcon },
  { id: "postgresql", name: "PostgreSQL", icon: SiPostgresql },
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
  }[];
}

const questionConfigs: QuestionConfig[] = [
  {
    id: "supabaseAuthOnly",
    question: "Use only Supabase for authentication?",
    description: "Provides established security reputation for enterprise compliance and audit requirements.",
    icon: Database,
    requiredTechnologies: ["supabase"],
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
      },
      {
        id: "orgMembers",
        label: "Organisation members",
        description:
          "Have read access to content related to their organisations",
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
        description: "Recurring subscription billing with Stripe and Better Auth",
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

  if (questionId === "payments") {
    if (optionId === "paypalPayments") {
      required.push("paypal");
    } else if (optionId === "stripePayments") {
      required.push("stripe");
    } else if (optionId === "stripeSubscriptions") {
      required.push("stripe", "betterAuth");
    }
  } else if (questionId === "authentication") {
    if (optionId === "magicLink" || optionId === "emailPassword" || optionId === "otp") {
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
  if (questionId === "payments") {
    return initialConfiguration.features.payments.paypalPayments ||
           initialConfiguration.features.payments.stripePayments ||
           initialConfiguration.features.payments.stripeSubscriptions;
  } else if (questionId === "admin") {
    return initialConfiguration.features.admin.superAdmins ||
           initialConfiguration.features.admin.orgAdmins ||
           initialConfiguration.features.admin.orgMembers;
  } else if (questionId === "authentication") {
    return initialConfiguration.features.authentication.magicLink ||
           initialConfiguration.features.authentication.emailPassword ||
           initialConfiguration.features.authentication.otp ||
           initialConfiguration.features.authentication.googleAuth ||
           initialConfiguration.features.authentication.githubAuth ||
           initialConfiguration.features.authentication.appleAuth;
  } else if (questionId === "aiIntegration") {
    return initialConfiguration.features.aiIntegration.imageGeneration ||
           initialConfiguration.features.aiIntegration.textGeneration;
  } else if (questionId === "realTimeNotifications") {
    return initialConfiguration.features.realTimeNotifications.emailNotifications ||
           initialConfiguration.features.realTimeNotifications.inAppNotifications;
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
    if (featureId === "authentication") {
      return initialConfiguration.features.authentication.enabled;
    } else if (featureId === "admin") {
      return initialConfiguration.features.admin.enabled;
    } else if (featureId === "payments") {
      return initialConfiguration.features.payments.enabled;
    } else if (featureId === "aiIntegration") {
      return initialConfiguration.features.aiIntegration.enabled;
    } else if (featureId === "realTimeNotifications") {
      return initialConfiguration.features.realTimeNotifications.enabled;
    } else if (featureId === "supabaseAuthOnly") {
      return initialConfiguration.questions.supabaseAuthOnly;
    }
    return initialConfiguration.features[
      featureId as keyof typeof initialConfiguration.features
    ] as boolean;
  };

  const getEnabledTechnologies = () => {
    const enabledTechs = new Set<
      keyof InitialConfigurationType["technologies"]
    >();

    // Always include core technologies
    enabledTechs.add("nextjs");
    enabledTechs.add("shadcn");
    enabledTechs.add("tailwindcss");
    enabledTechs.add("zustand");
    enabledTechs.add("reactQuery");

    questionConfigs.forEach((question) => {
      const isQuestionEnabled = getFeatureEnabled(question.id);
      if (isQuestionEnabled) {
        question.requiredTechnologies.forEach((tech) => {
          enabledTechs.add(tech);
        });
      }
    });

    // Check if any database functionality is selected
    const hasDatabaseFunctionality =
      initialConfiguration.features.authentication.enabled ||
      initialConfiguration.features.admin.enabled ||
      initialConfiguration.features.fileStorage ||
      initialConfiguration.features.realTimeNotifications.enabled;

    if (hasDatabaseFunctionality) {
      enabledTechs.add("prisma");
      enabledTechs.add("postgresql");
    }

    if (initialConfiguration.features.authentication.enabled) {
      if (initialConfiguration.questions.supabaseAuthOnly) {
        enabledTechs.add("supabase");
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

    // Core technologies are always included
    if (
      techId === "nextjs" ||
      techId === "shadcn" ||
      techId === "tailwindcss" ||
      techId === "zustand" ||
      techId === "reactQuery"
    ) {
      requiredBy.push("Core technology stack");
    }

    questionConfigs.forEach((question) => {
      const isEnabled = getFeatureEnabled(question.id);
      if (isEnabled && question.requiredTechnologies.includes(techId)) {
        requiredBy.push(question.question);
      }
    });

    // Database technologies
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

    if (
      techId === "betterAuth" &&
      initialConfiguration.features.authentication.enabled &&
      !initialConfiguration.questions.supabaseAuthOnly
    ) {
      requiredBy.push("Can users sign in to your app?");
    }
    if (
      techId === "supabase" &&
      initialConfiguration.features.authentication.enabled &&
      initialConfiguration.questions.supabaseAuthOnly
    ) {
      requiredBy.push("Can users sign in to your app?");
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
      if (initialConfiguration.features.realTimeNotifications.enabled &&
          initialConfiguration.features.realTimeNotifications.emailNotifications) {
        requiredBy.push("Email notifications");
      }
    }

    if (techId === "openrouter" &&
        initialConfiguration.features.aiIntegration.enabled) {
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

  const updateQuestion = (
    key: keyof InitialConfigurationType["questions"],
    value: boolean
  ) => {
    const updates: Partial<InitialConfigurationType> = {
      questions: {
        ...initialConfiguration.questions,
        [key]: value,
      },
    };

    if (key === "supabaseAuthOnly" && value) {
      updates.technologies = {
        ...initialConfiguration.technologies,
        betterAuth: false,
        supabase: true,
      };

      updates.features = {
        ...initialConfiguration.features,
        payments: {
          ...initialConfiguration.features.payments,
          enabled: false,
          stripeSubscriptions: false,
        },
      };
    }

    updateInitialConfiguration(updates);
  };

  const updateFeature = (featureId: string, enabled: boolean) => {
    const question = questionConfigs.find((q) => q.id === featureId);
    if (!question) return;

    if (enabled) {
      const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};
      question.requiredTechnologies.forEach((tech) => {
        techUpdates[tech] = true;
      });

      if (featureId === "authentication") {
        if (!initialConfiguration.questions.supabaseAuthOnly) {
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
      if (enabled && initialConfiguration.questions.supabaseAuthOnly) {
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
    } else if (featureId === "supabaseAuthOnly") {
      const updates: Partial<InitialConfigurationType> = {
        questions: {
          ...initialConfiguration.questions,
          supabaseAuthOnly: enabled,
        },
      };

      if (enabled) {
        updates.technologies = {
          ...initialConfiguration.technologies,
          betterAuth: false,
          supabase: true,
        };

        updates.features = {
          ...initialConfiguration.features,
          payments: {
            ...initialConfiguration.features.payments,
            enabled: false,
            stripeSubscriptions: false,
          },
          admin: {
            ...initialConfiguration.features.admin,
            enabled: false,
            orgAdmins: false,
            orgMembers: false,
          },
        };
      }

      updateInitialConfiguration(updates);
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
          {questionConfigs.map((question) => {
            const Icon = question.icon;
            // If question has children, parent is enabled only if any children are selected
            // If no children, use the standard enabled state
            const isEnabled = question.subOptions && question.subOptions.length > 0
              ? hasAnyChildrenSelected(question.id, initialConfiguration)
              : getFeatureEnabled(question.id);
            let questionRequiredTechs = question.requiredTechnologies
              .map((techId) => technologies.find((t) => t.id === techId))
              .filter((tech): tech is Technology => tech !== undefined);

            if (question.id === "authentication") {
              const authTech = initialConfiguration.questions.supabaseAuthOnly
                ? technologies.find((t) => t.id === "supabase")
                : technologies.find((t) => t.id === "betterAuth");
              if (authTech) {
                questionRequiredTechs = [...questionRequiredTechs, authTech];
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
                <div className="flex items-center justify-between w-full py-1 px-2">
                  <div className="flex-grow ">
                    <AccordionTrigger className="hover:no-underline flex-1 justify-between mr-2 group">
                      <div className="flex items-center gap-2">
                        <Icon className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          darkMode
                            ? "text-white group-data-[state=open]:text-blue-400"
                            : "text-black group-data-[state=open]:text-blue-600"
                        )} />
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
                    disabled={question.subOptions && question.subOptions.length > 0}
                    onCheckedChange={(checked) => {
                      // Only allow direct parent interaction if no sub-options exist
                      if (question.subOptions && question.subOptions.length > 0) {
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
                      question.subOptions && question.subOptions.length > 0
                        ? "data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-600 data-[state=checked]:text-white cursor-not-allowed"
                        : "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                    )}
                  />
                </div>
                <AccordionContent>
                  <div className="px-2 pb-2">
                    {question.subOptions && question.subOptions.length > 0 ? (
                      <div className="space-y-1">
                        {question.subOptions.map((option) => (
                          <label
                            key={option.id}
                            className={cn(
                              "flex items-start gap-2 cursor-pointer",
                              question.id === "admin" &&
                                (option.id === "orgAdmins" ||
                                  option.id === "orgMembers") &&
                                initialConfiguration.questions
                                  .supabaseAuthOnly &&
                                "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {question.id === "admin" &&
                            (option.id === "orgAdmins" || option.id === "orgMembers") &&
                            initialConfiguration.questions.supabaseAuthOnly ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Checkbox
                                    checked={
                                      initialConfiguration.features.admin[
                                        option.id as keyof typeof initialConfiguration.features.admin
                                      ] || false
                                    }
                                    disabled={true}
                                    className={cn(
                                      "size-4 mt-0.5 border border-gray-500 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white select-none"
                                    )}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Disabled when using Supabase-only authentication</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Checkbox
                                checked={
                                  question.id === "payments"
                                    ? initialConfiguration.features.payments[
                                        option.id as keyof typeof initialConfiguration.features.payments
                                      ] || false
                                    : question.id === "admin"
                                      ? initialConfiguration.features.admin[
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
                                          : question.id === "realTimeNotifications"
                                            ? initialConfiguration.features
                                                .realTimeNotifications[
                                                option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                              ] || false
                                            : false
                                }
                                onCheckedChange={(checked) => {
                                  // Check if this sub-item is disabled and should not trigger updates
                                  const isSubItemDisabled = question.id === "admin" &&
                                    (option.id === "orgAdmins" || option.id === "orgMembers") &&
                                    initialConfiguration.questions.supabaseAuthOnly;

                                  // Early return if trying to check a disabled item
                                  if (checked && isSubItemDisabled) {
                                    return;
                                  }

                                  // Update the specific sub-option - parent state will update automatically
                                  if (question.id === "payments") {
                                    updatePaymentOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (question.id === "admin") {
                                    updateAdminOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (question.id === "authentication") {
                                    updateAuthenticationOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (question.id === "aiIntegration") {
                                    updateAIIntegrationOption(
                                      option.id,
                                      checked === true
                                    );
                                  } else if (question.id === "realTimeNotifications") {
                                    updateRealTimeNotificationsOption(
                                      option.id,
                                      checked === true
                                    );
                                  }
                                  if (canAutoProgress("initial-configuration")) {
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
                                {getRequiredTechnologiesForSubOption(question.id, option.id).map((techId) => {
                                  const tech = technologies.find((t) => t.id === techId);
                                  if (!tech) return null;

                                  const Icon = tech.icon;

                                  // Check if this specific sub-option is selected
                                  const isSubOptionSelected = question.id === "payments"
                                    ? initialConfiguration.features.payments[
                                        option.id as keyof typeof initialConfiguration.features.payments
                                      ] || false
                                    : question.id === "admin"
                                      ? initialConfiguration.features.admin[
                                          option.id as keyof typeof initialConfiguration.features.admin
                                        ] || false
                                      : question.id === "authentication"
                                        ? initialConfiguration.features.authentication[
                                            option.id as keyof typeof initialConfiguration.features.authentication
                                          ] || false
                                        : question.id === "aiIntegration"
                                          ? initialConfiguration.features.aiIntegration[
                                              option.id as keyof typeof initialConfiguration.features.aiIntegration
                                            ] || false
                                          : question.id === "realTimeNotifications"
                                            ? initialConfiguration.features.realTimeNotifications[
                                                option.id as keyof typeof initialConfiguration.features.realTimeNotifications
                                              ] || false
                                            : false;

                                  // Badge is active only if technology is enabled AND this specific sub-option is selected
                                  const isBadgeActive = initialConfiguration.technologies[techId] && isSubOptionSelected;

                                  const isAvailable = question.id === "payments" ?
                                    (option.id !== "stripeSubscriptions" || !initialConfiguration.questions.supabaseAuthOnly) :
                                    question.id === "admin" ?
                                      (option.id === "superAdmins" || !initialConfiguration.questions.supabaseAuthOnly) :
                                      true;

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
                        ))}
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
