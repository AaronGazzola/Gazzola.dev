import type { InitialConfigurationType } from "@/app/(editor)/layout.types";
import type { Plugin, PrismaEnum, PrismaTable, RLSPolicy } from "@/app/(components)/DatabaseConfiguration.types";
import type { ThemeConfiguration } from "@/app/(components)/ThemeConfiguration.types";
import type { IDEType } from "@/app/(components)/IDESelection.types";

export interface ConfigSnapshot {
  supabase: boolean;
  postgresql: boolean;
  nextjs: boolean;
  typescript: boolean;
  tailwindcss: boolean;
  shadcn: boolean;
  zustand: boolean;
  reactQuery: boolean;
  vercel: boolean;
  railway: boolean;
  playwright: boolean;
  cypress: boolean;
  resend: boolean;
  stripe: boolean;
  paypal: boolean;
  openrouter: boolean;

  databaseProvider: 'none' | 'supabase';
  alwaysOnServer: boolean;

  tables: PrismaTable[];
  enums: PrismaEnum[];
  rlsPolicies: RLSPolicy[];

  authEnabled: boolean;
  authMethods: {
    magicLink: boolean;
    emailPassword: boolean;
    otp: boolean;
    googleAuth: boolean;
    githubAuth: boolean;
    appleAuth: boolean;
  };

  adminEnabled: boolean;
  adminRoles: {
    admin: boolean;
    superAdmin: boolean;
  };

  paymentsEnabled: boolean;
  payments: {
    paypalPayments: boolean;
    stripePayments: boolean;
    stripeSubscriptions: boolean;
  };

  aiIntegrationEnabled: boolean;
  aiIntegration: {
    imageGeneration: boolean;
    textGeneration: boolean;
  };

  realTimeNotificationsEnabled: boolean;
  realTimeNotifications: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
  };

  fileStorage: boolean;

  selectedIDE: IDEType;
  theme: ThemeConfiguration;
}

export const createConfigSnapshot = (
  initialConfig: InitialConfigurationType,
  theme: ThemeConfiguration,
  tables: PrismaTable[],
  enums: PrismaEnum[],
  rlsPolicies: RLSPolicy[],
  selectedIDE: IDEType
): ConfigSnapshot => {
  return {
    supabase: initialConfig.technologies.supabase,
    postgresql: initialConfig.technologies.postgresql,
    nextjs: initialConfig.technologies.nextjs,
    typescript: initialConfig.technologies.typescript,
    tailwindcss: initialConfig.technologies.tailwindcss,
    shadcn: initialConfig.technologies.shadcn,
    zustand: initialConfig.technologies.zustand,
    reactQuery: initialConfig.technologies.reactQuery,
    vercel: initialConfig.technologies.vercel,
    railway: initialConfig.technologies.railway,
    playwright: initialConfig.technologies.playwright,
    cypress: initialConfig.technologies.cypress,
    resend: initialConfig.technologies.resend,
    stripe: initialConfig.technologies.stripe,
    paypal: initialConfig.technologies.paypal,
    openrouter: initialConfig.technologies.openrouter,

    databaseProvider: initialConfig.questions.databaseProvider,
    alwaysOnServer: initialConfig.questions.alwaysOnServer,

    tables,
    enums,
    rlsPolicies,

    authEnabled: initialConfig.features.authentication.enabled,
    authMethods: {
      magicLink: initialConfig.features.authentication.magicLink,
      emailPassword: initialConfig.features.authentication.emailPassword,
      otp: initialConfig.features.authentication.otp,
      googleAuth: initialConfig.features.authentication.googleAuth,
      githubAuth: initialConfig.features.authentication.githubAuth,
      appleAuth: initialConfig.features.authentication.appleAuth,
    },

    adminEnabled: initialConfig.features.admin.enabled,
    adminRoles: {
      admin: initialConfig.features.admin.admin,
      superAdmin: initialConfig.features.admin.superAdmin,
    },

    paymentsEnabled: initialConfig.features.payments.enabled,
    payments: {
      paypalPayments: initialConfig.features.payments.paypalPayments,
      stripePayments: initialConfig.features.payments.stripePayments,
      stripeSubscriptions: initialConfig.features.payments.stripeSubscriptions,
    },

    aiIntegrationEnabled: initialConfig.features.aiIntegration.enabled,
    aiIntegration: {
      imageGeneration: initialConfig.features.aiIntegration.imageGeneration,
      textGeneration: initialConfig.features.aiIntegration.textGeneration,
    },

    realTimeNotificationsEnabled: initialConfig.features.realTimeNotifications.enabled,
    realTimeNotifications: {
      emailNotifications: initialConfig.features.realTimeNotifications.emailNotifications,
      inAppNotifications: initialConfig.features.realTimeNotifications.inAppNotifications,
    },

    fileStorage: initialConfig.features.fileStorage,

    selectedIDE,
    theme,
  };
};

export const hasDatabase = (config: ConfigSnapshot): boolean => {
  return config.databaseProvider !== 'none';
};

export const hasAuth = (config: ConfigSnapshot): boolean => {
  return config.authEnabled;
};

export const hasRLS = (config: ConfigSnapshot): boolean => {
  return config.rlsPolicies.length > 0;
};

export const isSupabaseOnly = (config: ConfigSnapshot): boolean => {
  return config.databaseProvider === 'supabase';
};
