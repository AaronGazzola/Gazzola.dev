import { InferredFeature, FeatureCategory, FeatureComplexity } from "./AppStructure.types";
import { PageInput, AuthMethods, PageAccess } from "./READMEComponent.types";
import { generateId } from "./READMEComponent.types";

export const isAuthPage = (page: PageInput): boolean => {
  const authKeywords = ["login", "register", "signup", "sign-up", "auth", "forgot", "reset"];
  const route = page.route.toLowerCase();
  const name = page.name.toLowerCase();

  return authKeywords.some(keyword => route.includes(keyword) || name.includes(keyword));
};

export const isAdminPage = (page: PageInput, pageAccess?: PageAccess): boolean => {
  const route = page.route.toLowerCase();
  const name = page.name.toLowerCase();

  const isAdminOnlyAccess = pageAccess ? (pageAccess.admin && !pageAccess.user && !pageAccess.public) : false;

  return route.includes("/admin") || name.includes("admin") || isAdminOnlyAccess;
};

export const isStaticPublicPage = (page: PageInput): boolean => {
  const staticRoutes = ["/", "/about", "/contact", "/privacy", "/terms"];
  const hasDynamicKeywords = /\b(latest|recent|trending|live|real-time|dynamic|dashboard|manage|edit|create|delete)\b/i.test(page.description);

  return staticRoutes.includes(page.route) && !hasDynamicKeywords;
};

export const generateAuthFeatures = (
  page: PageInput,
  authMethods: AuthMethods
): InferredFeature[] => {
  const features: InferredFeature[] = [];

  features.push({
    id: generateId(),
    pageId: page.id,
    title: "User Authentication",
    description: "Login, signup, and password management functionality",
    category: FeatureCategory.AUTHENTICATION,
    complexity: FeatureComplexity.MODERATE,
    actionVerbs: ["login", "signup", "authenticate", "validate"],
    dataEntities: ["users", "sessions"],
    requiresRealtimeUpdates: false,
    requiresFileUpload: false,
    requiresExternalApi: false,
    databaseTables: ["users"],
    utilityFileNeeds: {
      hooks: true,
      actions: true,
      stores: true,
      types: true,
    },
  });

  return features;
};

export const generateAdminFeatures = (page: PageInput): InferredFeature[] => {
  return [
    {
      id: generateId(),
      pageId: page.id,
      title: "Admin Access Control",
      description: "Role verification and admin-only route protection",
      category: FeatureCategory.AUTHORIZATION,
      complexity: FeatureComplexity.SIMPLE,
      actionVerbs: ["verify", "check", "protect"],
      dataEntities: ["users", "roles"],
      requiresRealtimeUpdates: false,
      requiresFileUpload: false,
      requiresExternalApi: false,
      databaseTables: ["users"],
      utilityFileNeeds: {
        hooks: true,
        actions: false,
        stores: false,
        types: true,
      },
    },
  ];
};

export const applyEdgeCaseHandling = (
  page: PageInput,
  inferredFeatures: InferredFeature[],
  authMethods: AuthMethods,
  pageAccess?: PageAccess
): InferredFeature[] => {
  if (isStaticPublicPage(page)) {
    return [];
  }

  if (isAuthPage(page)) {
    const authFeatures = generateAuthFeatures(page, authMethods);
    return [...authFeatures, ...inferredFeatures];
  }

  if (isAdminPage(page, pageAccess)) {
    const adminFeatures = generateAdminFeatures(page);
    return [...adminFeatures, ...inferredFeatures];
  }

  return inferredFeatures;
};
