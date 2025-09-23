"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/default/ui/accordion";
import { Card, CardContent } from "@/components/default/ui/card";
import { Checkbox } from "@/components/default/ui/checkbox";
import { cn } from "@/lib/tailwind.utils";
import { Bell, CreditCard, Lock, Settings, Shield, Zap } from "lucide-react";
import {
  SiCypress,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
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
];

interface FeatureConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredTechnologies: (keyof InitialConfigurationType["technologies"])[];
}

const featureConfigs: FeatureConfig[] = [
  {
    id: "authentication",
    title: "Authentication System",
    description:
      "User login, registration, and session management with various authentication methods.",
    icon: Lock,
    requiredTechnologies: ["betterAuth", "supabase"],
  },
  {
    id: "admin",
    title: "Admin Dashboard",
    description:
      "Administrative interface for managing users, content, and system settings.",
    icon: Settings,
    requiredTechnologies: ["betterAuth"],
  },
  {
    id: "payments",
    title: "Payment Processing",
    description:
      "Handle payments, subscriptions, and financial transactions securely.",
    icon: CreditCard,
    requiredTechnologies: ["betterAuth"],
  },
  {
    id: "realTimeNotifications",
    title: "Real-time Notifications",
    description:
      "Live updates and push notifications for enhanced user engagement.",
    icon: Bell,
    requiredTechnologies: ["supabase"],
  },
  {
    id: "emailSending",
    title: "Email Functionality",
    description:
      "Send transactional emails, newsletters, and notifications to users.",
    icon: Zap,
    requiredTechnologies: [],
  },
];

interface TechnologyCardProps {
  technology: Technology;
  checked: boolean;
  onChange: (checked: boolean) => void;
  darkMode: boolean;
}

const TechnologyCard = ({
  technology,
  checked,
  onChange,
  darkMode,
}: TechnologyCardProps) => {
  const Icon = technology.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 p-3",
        checked
          ? "shadow-lg border-0"
          : "border border-gray-300 hover:border-gray-400",
        darkMode
          ? checked
            ? "bg-blue-900 bg-opacity-20 shadow-blue-500/20"
            : "border-gray-600 hover:border-gray-500 bg-gray-800"
          : checked
            ? "bg-blue-50 shadow-blue-200/50"
            : "border-gray-300 hover:border-gray-400 bg-white"
      )}
      onClick={() => onChange(!checked)}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={onChange}
            onClick={(e) => e.stopPropagation()}
          />
          <Icon
            className={cn(
              "w-5 h-5",
              darkMode ? "text-gray-300" : "text-gray-600"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium select-none",
              darkMode ? "text-gray-200" : "text-gray-800"
            )}
          >
            {technology.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const InitialConfiguration = () => {
  const { darkMode, initialConfiguration, updateInitialConfiguration } =
    useEditorStore();

  const updateTechnology = (
    key: keyof InitialConfigurationType["technologies"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      technologies: {
        ...initialConfiguration.technologies,
        [key]: value,
      },
    });
  };

  const updateQuestion = (
    key: keyof InitialConfigurationType["questions"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      questions: {
        ...initialConfiguration.questions,
        [key]: value,
      },
    });
  };

  const updateFeature = (featureId: string, enabled: boolean) => {
    const feature = featureConfigs.find((f) => f.id === featureId);
    if (!feature) return;

    if (enabled) {
      const techUpdates: Partial<InitialConfigurationType["technologies"]> = {};
      feature.requiredTechnologies.forEach((tech) => {
        techUpdates[tech] = true;
      });

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
      updateInitialConfiguration({
        features: {
          ...initialConfiguration.features,
          payments: {
            ...initialConfiguration.features.payments,
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

  const getFeatureEnabled = (featureId: string): boolean => {
    if (featureId === "authentication") {
      return initialConfiguration.features.authentication.enabled;
    } else if (featureId === "admin") {
      return initialConfiguration.features.admin.enabled;
    } else if (featureId === "payments") {
      return initialConfiguration.features.payments.enabled;
    }
    return initialConfiguration.features[
      featureId as keyof typeof initialConfiguration.features
    ] as boolean;
  };

  return (
    <div
      className={cn("p-6 rounded-lg", darkMode ? "bg-gray-800" : "bg-gray-50")}
    >
      <div className="mb-6">
        <h2
          className={cn(
            "text-lg font-semibold mb-2",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          Technology Stack
        </h2>
        <p
          className={cn(
            "text-sm mb-4",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}
        >
          Select the technologies you want to include in your application.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {technologies.map((tech) => (
            <TechnologyCard
              key={tech.id}
              technology={tech}
              checked={initialConfiguration.technologies[tech.id]}
              onChange={(checked) => updateTechnology(tech.id, checked)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3
          className={cn(
            "text-md font-semibold mb-4",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          Features & Configuration
        </h3>

        <Accordion type="multiple" className="space-y-2">
          {featureConfigs.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = getFeatureEnabled(feature.id);

            return (
              <AccordionItem
                key={feature.id}
                value={feature.id}
                className={cn(
                  "border rounded-lg px-4",
                  darkMode ? "border-gray-600" : "border-gray-200"
                )}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-500" />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          darkMode ? "text-gray-200" : "text-gray-800"
                        )}
                      >
                        {feature.title}
                      </span>
                    </div>

                    <Checkbox
                      checked={isEnabled}
                      onCheckedChange={(checked) => {
                        updateFeature(feature.id, checked === true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-2 size-5"
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-4">
                    <p
                      className={cn(
                        "text-sm mb-3",
                        darkMode ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {feature.description}
                    </p>
                    {feature.requiredTechnologies.length > 0 && (
                      <div>
                        <p
                          className={cn(
                            "text-xs font-medium mb-2",
                            darkMode ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          Required technologies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.requiredTechnologies.map((techId) => {
                            const tech = technologies.find(
                              (t) => t.id === techId
                            );
                            if (!tech) return null;
                            const TechIcon = tech.icon;
                            return (
                              <div
                                key={techId}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-xs",
                                  darkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                )}
                              >
                                <TechIcon className="w-3 h-3" />
                                <span>{tech.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          <AccordionItem
            value="questions"
            className={cn(
              "border rounded-lg px-4",
              darkMode ? "border-gray-600" : "border-gray-200"
            )}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      darkMode ? "text-gray-200" : "text-gray-800"
                    )}
                  >
                    Security Questions
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium mb-1",
                        darkMode ? "text-gray-200" : "text-gray-800"
                      )}
                    >
                      Do you want to use Supabase only for authentication? (Most
                      secure)
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      This limits Supabase access to authentication only, using
                      a separate PostgreSQL database for your application data.
                    </p>
                  </div>
                  <Checkbox
                    checked={initialConfiguration.questions.supabaseAuthOnly}
                    onCheckedChange={(checked) =>
                      updateQuestion("supabaseAuthOnly", checked === true)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
