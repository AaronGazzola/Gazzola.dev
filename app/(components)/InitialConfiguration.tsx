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
    id: "authentication",
    question: "Can users sign in to your app?",
    description: "Enable user authentication and session management.",
    icon: Users,
    requiredTechnologies: ["resend"],
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
    description: "File storage with secure access controls.",
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
        id: "stripePayments",
        label: "One-time Payments",
        description: "Accept one-time payments via Stripe",
      },
      {
        id: "stripeSubscriptions",
        label: "Subscriptions",
        description: "Recurring subscription billing",
      },
      {
        id: "paypalPayments",
        label: "PayPal",
        description: "Accept payments via PayPal",
      },
    ],
  },
  {
    id: "realTimeNotifications",
    question: "Do you need real-time notifications?",
    description: "Live updates and push notifications for users.",
    icon: Bell,
    requiredTechnologies: ["supabase"],
  },
  {
    id: "emailSending",
    question: "Will you send emails to users?",
    description: "Transactional emails, newsletters, and notifications.",
    icon: Mail,
    requiredTechnologies: ["resend"],
  },
  {
    id: "supabaseAuthOnly",
    question: "Use Supabase for authentication only?",
    description:
      "Most secure: Supabase auth + separate PostgreSQL for app data.",
    icon: Database,
    requiredTechnologies: ["supabase"],
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

  return required;
};

export const InitialConfiguration = () => {
  const {
    darkMode,
    initialConfiguration,
    updateInitialConfiguration,
    updateAuthenticationOption,
    updateAdminOption,
    updatePaymentOption,
  } = useEditorStore();
  const { canAutoProgress, autoProgressWalkthrough } = useWalkthroughStore();

  const getFeatureEnabled = (featureId: string): boolean => {
    if (featureId === "authentication") {
      return initialConfiguration.features.authentication.enabled;
    } else if (featureId === "admin") {
      return initialConfiguration.features.admin.enabled;
    } else if (featureId === "payments") {
      return initialConfiguration.features.payments.enabled;
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

    questionConfigs.forEach((question) => {
      const isQuestionEnabled = getFeatureEnabled(question.id);
      if (isQuestionEnabled) {
        question.requiredTechnologies.forEach((tech) => {
          enabledTechs.add(tech);
        });
      }
    });

    if (initialConfiguration.features.authentication.enabled) {
      if (initialConfiguration.questions.supabaseAuthOnly) {
        enabledTechs.add("supabase");
      } else {
        enabledTechs.add("betterAuth");
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

    questionConfigs.forEach((question) => {
      const isEnabled = getFeatureEnabled(question.id);
      if (isEnabled && question.requiredTechnologies.includes(techId)) {
        requiredBy.push(question.question);
      }
    });

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
            const isEnabled = getFeatureEnabled(question.id);
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
                className="transition-all duration-200"
              >
                <div className="flex items-center justify-between w-full py-1 px-2">
                  <div className="flex-grow ">
                    <AccordionTrigger className="hover:no-underline flex-1 justify-between mr-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-500" />
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
                    onCheckedChange={(checked) => {
                      updateFeature(question.id, checked === true);
                      if (canAutoProgress("initial-configuration")) {
                        autoProgressWalkthrough();
                      }
                    }}
                    className={cn(
                      "size-5 border border-gray-500 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
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
                            className="flex items-start gap-2 cursor-pointer"
                          >
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
                                      : false
                              }
                              onCheckedChange={(checked) => {
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
                                }
                                if (canAutoProgress("initial-configuration")) {
                                  autoProgressWalkthrough();
                                }
                              }}
                              className={cn(
                                "size-4 mt-0.5 border border-gray-500 data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                              )}
                            />
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
                                  "text-base block mt-0.5",
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                )}
                              >
                                {option.description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : null}
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
