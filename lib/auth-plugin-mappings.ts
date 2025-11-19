import type { Plugin } from "@/app/(components)/DatabaseConfiguration.types";
import type { ConfigSnapshot } from "./config-snapshot";

export interface AuthPluginInfo {
  serverPlugin: string;
  clientPlugin: string;
  serverImportPath: string;
  clientImportPath: string;
  requiresConfig: boolean;
  dependencies?: string[];
  category: "auth-method" | "security" | "role-management" | "oauth";
}

export const AUTH_PLUGIN_REGISTRY: Record<string, AuthPluginInfo> = {
  twoFactor: {
    serverPlugin: "twoFactor",
    clientPlugin: "twoFactorClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    dependencies: ["emailAndPassword"],
    category: "security",
  },
  organization: {
    serverPlugin: "organization",
    clientPlugin: "organizationClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    category: "role-management",
  },
  admin: {
    serverPlugin: "admin",
    clientPlugin: "adminClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    category: "role-management",
  },
  passkey: {
    serverPlugin: "passkey",
    clientPlugin: "passkeyClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: false,
    category: "auth-method",
  },
  magicLink: {
    serverPlugin: "magicLink",
    clientPlugin: "magicLinkClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    category: "auth-method",
  },
  emailOTP: {
    serverPlugin: "emailOTP",
    clientPlugin: "emailOTPClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    category: "auth-method",
  },
  anonymous: {
    serverPlugin: "anonymous",
    clientPlugin: "anonymousClient",
    serverImportPath: "better-auth/plugins",
    clientImportPath: "better-auth/client/plugins",
    requiresConfig: true,
    category: "auth-method",
  },
};

export interface AuthMethodMapping {
  configKey: keyof ConfigSnapshot["authMethods"];
  pluginName?: string;
  requiresPlugin: boolean;
  baseConfig?: string;
}

export const AUTH_METHOD_MAPPINGS: Record<string, AuthMethodMapping> = {
  emailPassword: {
    configKey: "emailPassword",
    requiresPlugin: false,
    baseConfig: "emailAndPassword",
  },
  passwordOnly: {
    configKey: "passwordOnly",
    requiresPlugin: false,
    baseConfig: "emailAndPassword",
  },
  magicLink: {
    configKey: "magicLink",
    pluginName: "magicLink",
    requiresPlugin: true,
  },
  otp: {
    configKey: "otp",
    pluginName: "emailOTP",
    requiresPlugin: true,
  },
  twoFactor: {
    configKey: "twoFactor",
    pluginName: "twoFactor",
    requiresPlugin: true,
  },
  passkey: {
    configKey: "passkey",
    pluginName: "passkey",
    requiresPlugin: true,
  },
  anonymous: {
    configKey: "anonymous",
    pluginName: "anonymous",
    requiresPlugin: true,
  },
  googleAuth: {
    configKey: "googleAuth",
    requiresPlugin: false,
  },
  githubAuth: {
    configKey: "githubAuth",
    requiresPlugin: false,
  },
  appleAuth: {
    configKey: "appleAuth",
    requiresPlugin: false,
  },
};

export function getEnabledAuthMethods(config: ConfigSnapshot): string[] {
  const methods: string[] = [];

  Object.entries(config.authMethods).forEach(([key, enabled]) => {
    if (enabled) {
      methods.push(key);
    }
  });

  return methods;
}

export function getRequiredPlugins(config: ConfigSnapshot): Plugin[] {
  const plugins: Plugin[] = [];

  Object.entries(config.authMethods).forEach(([methodKey, enabled]) => {
    if (!enabled) return;

    const mapping = AUTH_METHOD_MAPPINGS[methodKey];
    if (mapping?.requiresPlugin && mapping.pluginName) {
      const pluginInfo = AUTH_PLUGIN_REGISTRY[mapping.pluginName];
      if (pluginInfo) {
        plugins.push({
          id: mapping.pluginName,
          name: mapping.pluginName,
          enabled: true,
          file: "auth",
        });
      }
    }
  });

  if (config.adminEnabled) {
    const hasAnyRole =
      config.adminRoles.admin ||
      config.adminRoles.superAdmin ||
      config.adminRoles.organizations;

    if (hasAnyRole) {
      plugins.push({
        id: "admin",
        name: "admin",
        enabled: true,
        file: "auth",
      });

      if (config.adminRoles.organizations) {
        plugins.push({
          id: "organization",
          name: "organization",
          enabled: true,
          file: "auth",
        });
      }
    }
  }

  return plugins;
}

export function getOAuthProviders(config: ConfigSnapshot): string[] {
  const providers: string[] = [];

  if (config.authMethods.googleAuth) providers.push("google");
  if (config.authMethods.githubAuth) providers.push("github");
  if (config.authMethods.appleAuth) providers.push("apple");

  return providers;
}

export function hasEmailPasswordBase(config: ConfigSnapshot): boolean {
  return config.authMethods.emailPassword || config.authMethods.passwordOnly;
}

export function needsAppName(config: ConfigSnapshot): boolean {
  return config.authMethods.twoFactor;
}

export function getServerPlugins(config: ConfigSnapshot): Plugin[] {
  const requiredPlugins = getRequiredPlugins(config);
  const explicitPlugins = config.plugins.filter((p) => p.file === "auth");

  return [...requiredPlugins, ...explicitPlugins].filter((plugin) => plugin.enabled);
}

export function getClientPlugins(config: ConfigSnapshot): Plugin[] {
  const requiredPlugins = getRequiredPlugins(config);
  const explicitPlugins = config.plugins.filter((p) => p.file === "auth-client");

  return [...requiredPlugins, ...explicitPlugins].filter((plugin) => plugin.enabled);
}

export function getPluginImports(
  plugins: Plugin[],
  side: "server" | "client"
): { imports: string[]; importPath: string }[] {
  const importMap = new Map<string, string[]>();

  plugins.forEach((plugin) => {
    const info = AUTH_PLUGIN_REGISTRY[plugin.name];
    if (!info) return;

    const importPath =
      side === "server" ? info.serverImportPath : info.clientImportPath;
    const pluginName =
      side === "server" ? info.serverPlugin : info.clientPlugin;

    if (!importMap.has(importPath)) {
      importMap.set(importPath, []);
    }
    importMap.get(importPath)!.push(pluginName);
  });

  return Array.from(importMap.entries()).map(([importPath, imports]) => ({
    imports,
    importPath,
  }));
}

export function generateVersionString(config: ConfigSnapshot): string {
  const parts: string[] = ["betterAuth"];

  const methods = getEnabledAuthMethods(config);
  if (methods.length > 0) {
    parts.push(...methods.sort());
  }

  const plugins = getServerPlugins(config)
    .map((p) => p.name)
    .sort();
  if (plugins.length > 0) {
    parts.push(...plugins);
  }

  return parts.join("-");
}
