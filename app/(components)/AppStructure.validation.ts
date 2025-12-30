import { FileSystemEntry, Feature } from "@/app/(editor)/layout.types";
import { ValidationResult, ValidationWarning } from "./AppStructure.types";
import { conditionalLog, LOG_LABELS } from "@/lib/log.util";
import { generateRoutesFromFileSystem } from "./AppStructure.utils";

export const validateAppStructure = (
  structure: FileSystemEntry[],
  features: Record<string, Feature[]>,
  readmeContent: string
): ValidationResult => {
  console.log("✅ [VALIDATION] Starting app structure validation...");
  console.log("  - Structure entries:", structure.length);
  console.log("  - Feature groups:", Object.keys(features).length);
  console.log("  - Total features:", Object.values(features).flat().length);
  console.log("  - README length:", readmeContent.length);

  const warnings: ValidationWarning[] = [];

  const routes = generateRoutesFromFileSystem(structure, "", true);
  const routePaths = routes.map((r) => r.path.toLowerCase());

  console.log("🛣️  [VALIDATION] Generated routes:");
  console.log("  - Total routes:", routes.length);
  console.log("  - Route paths:", routePaths);

  const readmeLower = readmeContent.toLowerCase();

  const hasRootLayout = structure.some(
    (entry) =>
      entry.name === "app" &&
      entry.children?.some((child) => child.name === "layout.tsx")
  );

  console.log("🏗️  [VALIDATION] Checking root layout...");
  if (!hasRootLayout) {
    console.log("  ❌ Missing root layout");
    warnings.push({
      severity: "error",
      category: "incomplete-structure",
      message: "Missing required root layout (app/layout.tsx)",
      suggestion: "Add layout.tsx file to app directory",
    });
  } else {
    console.log("  ✅ Root layout exists");
  }

  console.log("🏗️  [VALIDATION] Checking routes...");
  if (routes.length === 0) {
    console.log("  ❌ No routes found");
    warnings.push({
      severity: "error",
      category: "incomplete-structure",
      message: "No routes generated - structure has no page.tsx files",
      suggestion: "Add at least one page.tsx file to create a route",
    });
  } else {
    console.log("  ✅", routes.length, "routes found");
  }

  console.log("🎯 [VALIDATION] Validating features...");
  let featureWarningCount = 0;
  let genericKeywordCount = 0;
  let missingActionCount = 0;

  Object.entries(features).forEach(([fileId, featureList]) => {
    featureList.forEach((feature) => {
      if (!feature.title || feature.title.trim().length === 0) {
        featureWarningCount++;
        warnings.push({
          severity: "warning",
          category: "generic-feature",
          message: `Feature has empty title`,
          suggestion: "Add a descriptive title for the feature",
        });
      }

      if (!feature.description || feature.description.length < 10) {
        warnings.push({
          severity: "warning",
          category: "generic-feature",
          message: `Feature "${feature.title}" has minimal or missing description`,
          suggestion: "Add description explaining what this feature does",
        });
      }

      const GENERIC_KEYWORDS = [
        "display", "view", "show", "render", "page", "section",
        "management", "handler", "functionality", "feature",
        "component", "interface", "system", "module"
      ];

      const titleLower = feature.title.toLowerCase();
      const hasGenericKeyword = GENERIC_KEYWORDS.some(keyword =>
        titleLower.includes(keyword)
      );

      if (hasGenericKeyword && feature.description.length < 30) {
        genericKeywordCount++;
        warnings.push({
          severity: "warning",
          category: "generic-feature",
          message: `Feature "${feature.title}" uses generic terminology and lacks detail`,
          suggestion: `Describe specific data shown, actions available, and user interactions. Example: "User list table with sorting by name/email, search filter, and edit/delete buttons" instead of "User management"`,
        });
      }

      const needsActions = /\b(save|submit|upload|delete|create|update|fetch|load|send|process)\b/i.test(
        feature.description
      );
      const hasActionLink = feature.linkedFiles?.actions;

      if (needsActions && !hasActionLink) {
        missingActionCount++;
        warnings.push({
          severity: "warning",
          category: "missing-action-file",
          message: `Feature "${feature.title}" describes operations requiring server actions but has no linked actions file`,
          suggestion: `Add linkedFiles.actions pointing to page.actions.ts or layout.actions.ts`,
        });
      }
    });
  });

  console.log("  - Features with warnings:", featureWarningCount);
  console.log("  - Features with generic keywords:", genericKeywordCount);
  console.log("  - Features missing action files:", missingActionCount);

  console.log("📝 [VALIDATION] Checking for missing types files...");
  let missingTypesCount = 0;

  const referencedTypeFiles = new Set<string>();
  Object.values(features).forEach(featureList => {
    featureList.forEach(feature => {
      if (feature.linkedFiles?.types) {
        referencedTypeFiles.add(feature.linkedFiles.types);
      }
    });
  });

  const existingTypeFiles = new Set<string>();
  const collectTypeFiles = (entries: FileSystemEntry[], path: string = "") => {
    entries.forEach(entry => {
      const fullPath = path + "/" + entry.name;
      if (entry.type === "file" && entry.name.endsWith(".types.ts")) {
        existingTypeFiles.add(fullPath);
      }
      if (entry.children) {
        collectTypeFiles(entry.children, fullPath);
      }
    });
  };
  collectTypeFiles(structure);

  referencedTypeFiles.forEach(typeFile => {
    if (!existingTypeFiles.has(typeFile)) {
      missingTypesCount++;
      warnings.push({
        severity: "error",
        category: "missing-type-file",
        message: `Feature references types file ${typeFile} but it doesn't exist in structure`,
        suggestion: `Add {name: "${typeFile.split("/").pop()}", type: "file"} to structure at ${typeFile.substring(0, typeFile.lastIndexOf("/"))}`,
      });
    }
  });

  console.log("  - Missing types files:", missingTypesCount);

  console.log("📖 [VALIDATION] Validating README-mentioned routes...");

  const validateReadmeRoutes = (
    readme: string,
    routes: Array<{ path: string }>
  ): ValidationWarning[] => {
    const routeWarnings: ValidationWarning[] = [];
    const routePaths = routes.map(r => r.path.toLowerCase());
    const readmeLower = readme.toLowerCase();

    const routeExists = (targetRoute: string, allowNested: boolean = true): boolean => {
      return routePaths.some(path => {
        if (path === targetRoute) return true;
        if (allowNested && path.includes(targetRoute + "/")) return true;
        if (targetRoute === "/profile" && path.includes("/[username]")) return true;
        if (targetRoute === "/edit" && path.includes("/edit")) return true;
        return false;
      });
    };

    const contextPatterns = [
      {
        searchPhrases: ["user settings", "settings page", "account settings", "sticker customization settings"],
        route: "/settings",
        confidence: "high"
      },
      {
        searchPhrases: ["admin dashboard", "admin panel", "admin management", "moderation queue"],
        route: "/admin",
        confidence: "high"
      },
      {
        searchPhrases: ["notification center", "notification page", "notifications page"],
        route: "/notifications",
        confidence: "medium"
      },
    ];

    contextPatterns.forEach(({ searchPhrases, route, confidence }) => {
      const mentioned = searchPhrases.some(phrase => readmeLower.includes(phrase));
      const exists = routeExists(route, true);

      if (mentioned && !exists && confidence === "high") {
        routeWarnings.push({
          severity: "error",
          category: "missing-route",
          message: `README describes "${searchPhrases[0]}" but no ${route} route found`,
          suggestion: `Add ${route} route for ${searchPhrases[0]} functionality`,
          expectedRoute: route,
          readmeKeyword: searchPhrases[0],
        });
      }
    });

    return routeWarnings;
  };

  const readmeRouteWarnings = validateReadmeRoutes(readmeContent, routes);
  console.log("  - Missing routes from README:", readmeRouteWarnings.length);
  if (readmeRouteWarnings.length > 0) {
    console.log("  - Missing route details:", readmeRouteWarnings.map(w => w.expectedRoute));
  }
  warnings.push(...readmeRouteWarnings);

  const errors = warnings.filter((w) => w.severity === "error");
  const warningsOnly = warnings.filter((w) => w.severity === "warning");

  console.log("📊 [VALIDATION] Validation summary:");
  console.log("  - Total warnings:", warnings.length);
  console.log("  - Errors:", errors.length);
  console.log("  - Warnings:", warningsOnly.length);
  console.log("  - Is valid:", errors.length === 0);
  console.log("  - Has errors:", errors.length > 0);
  console.log("  - Has warnings:", warningsOnly.length > 0);

  if (errors.length > 0) {
    console.log("❌ [VALIDATION] Errors found:");
    errors.forEach((error, i) => {
      console.log(`  ${i + 1}. [${error.category}] ${error.message}`);
      if (error.suggestion) console.log(`     Suggestion: ${error.suggestion}`);
    });
  }

  if (warningsOnly.length > 0) {
    console.log("⚠️  [VALIDATION] Warnings found:");
    warningsOnly.forEach((warning, i) => {
      console.log(`  ${i + 1}. [${warning.category}] ${warning.message}`);
      if (warning.suggestion) console.log(`     Suggestion: ${warning.suggestion}`);
    });
  }

  const result: ValidationResult = {
    isValid: errors.length === 0,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warningsOnly.length > 0,
  };

  conditionalLog(
    {
      message: "App structure validation complete",
      result,
      routeCount: routes.length,
      featureCount: Object.values(features).flat().length,
      errorCount: errors.length,
      warningCount: warningsOnly.length,
      routes: routePaths,
    },
    { label: LOG_LABELS.APP_STRUCTURE }
  );

  return result;
};
