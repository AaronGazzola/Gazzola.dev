"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import { cn } from "@/lib/tailwind.utils";
import {
  Bell,
  CreditCard,
  Database,
  Lock,
  Palette,
  Settings,
} from "lucide-react";

interface GroupHeaderProps {
  title: string;
  icon: React.ReactNode;
}

const GroupHeader = ({ title, icon }: GroupHeaderProps) => {
  const { darkMode } = useEditorStore();

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-blue-500">{icon}</div>
      <h3
        className={cn(
          "font-semibold text-sm",
          darkMode ? "text-gray-200" : "text-gray-800"
        )}
      >
        {title}
      </h3>
    </div>
  );
};

export const InitialConfiguration = () => {
  const { darkMode, initialConfiguration, updateInitialConfiguration } =
    useEditorStore();

  const updateAuth = (
    key: keyof InitialConfigurationType["authentication"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      authentication: {
        ...initialConfiguration.authentication,
        [key]: value,
      },
    });
  };

  const updateTheme = (
    key: keyof InitialConfigurationType["theme"],
    value: any
  ) => {
    updateInitialConfiguration({
      theme: {
        ...initialConfiguration.theme,
        [key]: value,
      },
    });
  };

  const updateAdmin = (
    key: keyof InitialConfigurationType["admin"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      admin: {
        ...initialConfiguration.admin,
        [key]: value,
      },
    });
  };

  const updatePayments = (
    key: keyof InitialConfigurationType["payments"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      payments: {
        ...initialConfiguration.payments,
        [key]: value,
      },
    });
  };

  const updateFeatures = (
    key: keyof InitialConfigurationType["features"],
    value: boolean
  ) => {
    updateInitialConfiguration({
      features: {
        ...initialConfiguration.features,
        [key]: value,
      },
    });
  };

  const updateDatabase = (
    key: keyof InitialConfigurationType["database"],
    value: any
  ) => {
    updateInitialConfiguration({
      database: {
        ...initialConfiguration.database,
        [key]: value,
      },
    });
  };

  return (
    <div
      className={cn("p-6 rounded-lg", darkMode ? "bg-gray-800" : "bg-gray-50")}
    >
      <div className="mb-4">
        <h2
          className={cn(
            "text-lg font-semibold mb-2",
            darkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          Initial Configuration
        </h2>
        <p
          className={cn(
            "text-sm",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}
        >
          Configure the core features and technologies for your application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <GroupHeader
            title="Authentication"
            icon={<Lock className="h-4 w-4" />}
          />
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.emailPassword}
                onChange={(e) => updateAuth("emailPassword", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Email & Password
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.magicLink}
                onChange={(e) => updateAuth("magicLink", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Magic Link
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.googleAuth}
                onChange={(e) => updateAuth("googleAuth", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Google OAuth
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.githubAuth}
                onChange={(e) => updateAuth("githubAuth", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                GitHub OAuth
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.appleAuth}
                onChange={(e) => updateAuth("appleAuth", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Apple Sign In
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.authentication.facebookAuth}
                onChange={(e) => updateAuth("facebookAuth", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Facebook Login
              </span>
            </label>
          </div>

          <GroupHeader
            title="Theme & Appearance"
            icon={<Palette className="h-4 w-4" />}
          />
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.theme.supportLightDark}
                onChange={(e) =>
                  updateTheme("supportLightDark", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Support Light & Dark Mode
              </span>
            </label>
            {initialConfiguration.theme.supportLightDark && (
              <div className="ml-6 space-y-1">
                <p
                  className={cn(
                    "text-xs font-medium select-none",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Default Theme:
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="defaultTheme"
                    value="light"
                    checked={
                      initialConfiguration.theme.defaultTheme === "light"
                    }
                    onChange={(e) =>
                      e.target.checked && updateTheme("defaultTheme", "light")
                    }
                    className="w-4 h-4"
                  />
                  <span
                    className={cn(
                      "text-sm select-none",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Light
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="defaultTheme"
                    value="dark"
                    checked={initialConfiguration.theme.defaultTheme === "dark"}
                    onChange={(e) =>
                      e.target.checked && updateTheme("defaultTheme", "dark")
                    }
                    className="w-4 h-4"
                  />
                  <span
                    className={cn(
                      "text-sm select-none",
                      darkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Dark
                  </span>
                </label>
              </div>
            )}
          </div>

          <GroupHeader
            title="Admin System"
            icon={<Settings className="h-4 w-4" />}
          />
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.admin.basicAdmin}
                onChange={(e) => updateAdmin("basicAdmin", e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Basic Admin System
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.admin.withOrganizations}
                onChange={(e) =>
                  updateAdmin("withOrganizations", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Organizations & Teams
              </span>
            </label>
          </div>
        </div>

        <div>
          <GroupHeader
            title="Payment Processing"
            icon={<CreditCard className="h-4 w-4" />}
          />
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.payments.stripePayments}
                onChange={(e) =>
                  updatePayments("stripePayments", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Stripe Payments
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.payments.stripeSubscriptions}
                onChange={(e) =>
                  updatePayments("stripeSubscriptions", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Stripe Subscriptions
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.payments.paypalPayments}
                onChange={(e) =>
                  updatePayments("paypalPayments", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                PayPal Payments
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.payments.cryptoPayments}
                onChange={(e) =>
                  updatePayments("cryptoPayments", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Cryptocurrency Payments
              </span>
            </label>
          </div>

          <GroupHeader
            title="Additional Features"
            icon={<Bell className="h-4 w-4" />}
          />
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.features.realTimeNotifications}
                onChange={(e) =>
                  updateFeatures("realTimeNotifications", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Real-time Notifications
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={initialConfiguration.features.emailSending}
                onChange={(e) =>
                  updateFeatures("emailSending", e.target.checked)
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Email Sending
              </span>
            </label>
          </div>

          <GroupHeader
            title="Database & Hosting"
            icon={<Database className="h-4 w-4" />}
          />
          <div className="space-y-2">
            <p
              className={cn(
                "text-xs font-medium select-none",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              Database Hosting:
            </p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="databaseHosting"
                value="supabase"
                checked={initialConfiguration.database.hosting === "supabase"}
                onChange={(e) =>
                  e.target.checked && updateDatabase("hosting", "supabase")
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Supabase
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="databaseHosting"
                value="postgresql"
                checked={initialConfiguration.database.hosting === "postgresql"}
                onChange={(e) =>
                  e.target.checked && updateDatabase("hosting", "postgresql")
                }
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "text-sm select-none",
                  darkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                Self-hosted PostgreSQL
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
