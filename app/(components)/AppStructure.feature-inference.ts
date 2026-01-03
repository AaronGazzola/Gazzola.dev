import { extractJsonFromResponse } from "@/lib/ai-response.utils";
import { LOG_LABELS } from "@/lib/log.util";
import { PageInput, PageAccess } from "./READMEComponent.types";
import {
  InferredFeature,
  FeatureInferenceAIResponse,
  FeatureCategory,
  FeatureComplexity,
} from "./AppStructure.types";
import { generateId } from "./READMEComponent.types";

export const generateFeatureInferencePrompt = (
  page: PageInput,
  pageAccess: PageAccess | undefined
): string => {
  const accessLevel = pageAccess
    ? pageAccess.public
      ? "Public"
      : pageAccess.admin
      ? "Admin"
      : "User"
    : "Unknown";

  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

PAGE INFORMATION:
Name: ${page.name}
Route: ${page.route}
Description: ${page.description}
Access Level: ${accessLevel}

Your task is to analyze this page description and extract DISTINCT, NON-OVERLAPPING features.

CRITICAL RULES FOR FEATURE EXTRACTION:

1. GRANULARITY: Extract features at the right level
   - Too broad: "Page Management" (covers everything)
   - Too narrow: "Click Save Button" (implementation detail)
   - Just right: "Element Management", "Drag and Drop Positioning"

2. FEATURE INDICATORS - Look for these patterns:
   - Action verbs: "add", "edit", "delete", "drag", "resize", "filter", "search"
   - Data entities: "users", "posts", "elements", "comments"
   - User capabilities: "can", "able to", "allows users to"
   - Limits/constraints: "up to X", "maximum", "minimum"
   - Interaction patterns: "click", "hover", "drag", "drop"

3. CATEGORY CLASSIFICATION:
   - data-management: CRUD operations on entities
   - ui-interaction: Drag/drop, resize, positioning, visual manipulation
   - content-creation: Forms, editors, builders
   - content-display: Lists, grids, cards, previews
   - search-filter: Filtering, sorting, searching data
   - authentication: Login, signup, password reset
   - authorization: Role checks, permission gates
   - navigation: Routing, breadcrumbs, menus
   - communication: Messages, notifications, emails
   - media-handling: Image/video upload, processing
   - real-time: Live updates, websockets, subscriptions
   - admin: Admin-only functionality

4. COMPLEXITY ASSESSMENT:
   - simple: Single entity, basic CRUD, no complex state
   - moderate: Multiple entities, some business logic, moderate state
   - complex: Multiple entities with relationships, complex state, real-time, or advanced algorithms

5. EXTRACTION STRATEGY:
   - Read description completely
   - Identify all action verbs (add, edit, delete, drag, resize, etc.)
   - Identify all data entities (elements, pages, users, etc.)
   - Group related actions on same entity into ONE feature
   - Separate features that operate on DIFFERENT entities
   - Separate features that have DIFFERENT interaction patterns

EXAMPLE ANALYSIS:

Description: "personal page building workshop. Add up to 20 elements including text blocks, shapes, dividers, and up to 3 YouTube embeds. Every element can be dragged, resized, and precisely positioned"

CORRECT EXTRACTION:
Feature 1: "Element Management"
  - Actions: add, delete, manage
  - Entity: elements (text blocks, shapes, dividers, YouTube embeds)
  - Category: data-management

Feature 2: "Drag and Drop Positioning"
  - Actions: drag, position
  - Entity: elements
  - Category: ui-interaction

Feature 3: "Element Resize Controls"
  - Actions: resize
  - Entity: elements
  - Category: ui-interaction

Feature 4: "Element Type Selection"
  - Actions: select, choose type
  - Entity: element types
  - Category: content-creation

WRONG EXTRACTION:
- "Page Editor" (too broad, not a feature)
- "YouTube Embed Support" (too specific, part of Element Management)
- "20 Element Limit Enforcement" (implementation detail)

JSON FORMAT:
{
  "features": [
    {
      "title": "Feature Name (2-4 words)",
      "description": "What this feature does and why (1-2 sentences)",
      "category": "one of the categories above",
      "complexity": "simple | moderate | complex",
      "actionVerbs": ["verb1", "verb2"],
      "dataEntities": ["entity1", "entity2"],
      "requiresRealtimeUpdates": boolean,
      "requiresFileUpload": boolean,
      "requiresExternalApi": boolean
    }
  ]
}

Extract 2-6 features based on page complexity. Be precise and avoid overlapping features.`;
};

export const parseFeatureInferenceResponse = (
  response: string,
  pageId: string,
  pageAccess: PageAccess | undefined
): InferredFeature[] | null => {
  const parsed = extractJsonFromResponse<FeatureInferenceAIResponse>(
    response,
    LOG_LABELS.README
  );

  if (!parsed || !parsed.features || !Array.isArray(parsed.features)) {
    return null;
  }

  return parsed.features
    .filter((f) => f.title && f.description)
    .map((f) => ({
      id: generateId(),
      pageId,
      title: f.title,
      description: f.description,
      category: f.category || FeatureCategory.CONTENT_DISPLAY,
      complexity: f.complexity || FeatureComplexity.MODERATE,
      actionVerbs: f.actionVerbs || [],
      dataEntities: f.dataEntities || [],
      requiresRealtimeUpdates: f.requiresRealtimeUpdates || false,
      requiresFileUpload: f.requiresFileUpload || false,
      requiresExternalApi: f.requiresExternalApi || false,
      databaseTables: inferDatabaseTables(f),
      utilityFileNeeds: determineUtilityFileNeeds(f, pageAccess),
    }));
};

export const inferDatabaseTables = (
  feature: FeatureInferenceAIResponse["features"][0]
): string[] => {
  const matchedTables: Set<string> = new Set();

  const categoryTableMap: Record<FeatureCategory, string[]> = {
    [FeatureCategory.AUTHENTICATION]: ["profiles", "auth_sessions"],
    [FeatureCategory.AUTHORIZATION]: ["profiles", "roles", "permissions"],
    [FeatureCategory.COMMUNICATION]: ["messages", "conversations", "notifications"],
    [FeatureCategory.MEDIA_HANDLING]: ["media", "uploads", "files"],
    [FeatureCategory.ADMIN]: ["profiles", "audit_logs", "moderation_logs"],
    [FeatureCategory.DATA_MANAGEMENT]: [],
    [FeatureCategory.UI_INTERACTION]: [],
    [FeatureCategory.CONTENT_CREATION]: [],
    [FeatureCategory.CONTENT_DISPLAY]: [],
    [FeatureCategory.NAVIGATION]: [],
    [FeatureCategory.SEARCH_FILTER]: [],
    [FeatureCategory.REAL_TIME]: [],
  };

  const categoryTables = categoryTableMap[feature.category] || [];
  categoryTables.forEach((expectedTable) => {
    matchedTables.add(expectedTable);
  });

  feature.dataEntities.forEach((entity) => {
    const singularEntity = entity.replace(/s$/, "");
    const pluralEntity = entity.endsWith("s") ? entity : entity + "s";

    matchedTables.add(pluralEntity.toLowerCase());
  });

  if (
    feature.category === FeatureCategory.AUTHENTICATION ||
    feature.category === FeatureCategory.AUTHORIZATION
  ) {
    matchedTables.add("profiles");
  }

  return Array.from(matchedTables);
};

export const determineUtilityFileNeeds = (
  feature: FeatureInferenceAIResponse["features"][0],
  pageAccess: PageAccess | undefined
): InferredFeature["utilityFileNeeds"] => {
  const needsHooks =
    feature.category === FeatureCategory.DATA_MANAGEMENT ||
    feature.category === FeatureCategory.SEARCH_FILTER ||
    feature.category === FeatureCategory.REAL_TIME ||
    feature.requiresExternalApi ||
    feature.dataEntities.length > 0;

  const needsStore =
    feature.complexity !== FeatureComplexity.SIMPLE ||
    feature.category === FeatureCategory.UI_INTERACTION ||
    feature.category === FeatureCategory.CONTENT_CREATION ||
    feature.requiresRealtimeUpdates;

  const needsActions =
    feature.dataEntities.length > 0 ||
    feature.category === FeatureCategory.DATA_MANAGEMENT ||
    feature.requiresFileUpload;

  return {
    hooks: needsHooks,
    stores: needsStore,
    actions: needsActions,
    types: true,
  };
};

export const validateFeatures = (
  features: InferredFeature[],
  page: PageInput
): InferredFeature[] => {
  const maxFeatures =
    page.description.length < 200 ? 3 : page.description.length < 400 ? 5 : 8;

  let validatedFeatures = features;

  if (features.length > maxFeatures) {
    validatedFeatures = features
      .sort((a, b) => {
        const complexityScore = {
          [FeatureComplexity.COMPLEX]: 3,
          [FeatureComplexity.MODERATE]: 2,
          [FeatureComplexity.SIMPLE]: 1,
        };
        return complexityScore[b.complexity] - complexityScore[a.complexity];
      })
      .slice(0, maxFeatures);
  }

  const uniqueFeatures = validatedFeatures.reduce((acc, feature) => {
    const isDuplicate = acc.some(
      (existing) =>
        existing.title.toLowerCase() === feature.title.toLowerCase() ||
        (existing.category === feature.category &&
          existing.dataEntities.every((e) => feature.dataEntities.includes(e)))
    );
    return isDuplicate ? acc : [...acc, feature];
  }, [] as InferredFeature[]);

  return mergeOverlappingFeatures(uniqueFeatures);
};

const mergeOverlappingFeatures = (features: InferredFeature[]): InferredFeature[] => {
  const entityGroups = features.reduce((groups, feature) => {
    feature.dataEntities.forEach((entity) => {
      if (!groups[entity]) groups[entity] = [];
      groups[entity].push(feature);
    });
    return groups;
  }, {} as Record<string, InferredFeature[]>);

  const merged: InferredFeature[] = [];

  Object.values(entityGroups).forEach((group) => {
    if (group.length === 1) {
      merged.push(group[0]);
      return;
    }

    const categories = new Set(group.map((f) => f.category));
    if (
      categories.size === 1 &&
      categories.has(FeatureCategory.DATA_MANAGEMENT)
    ) {
      const mergedFeature: InferredFeature = {
        ...group[0],
        title: `${group[0].dataEntities[0]} Management`,
        description: `Complete CRUD operations for ${group[0].dataEntities[0].toLowerCase()}`,
        actionVerbs: Array.from(new Set(group.flatMap((f) => f.actionVerbs))),
      };
      merged.push(mergedFeature);
    } else {
      merged.push(...group);
    }
  });

  return merged;
};

export const ensureMinimumFeatures = (
  features: InferredFeature[],
  page: PageInput
): InferredFeature[] => {
  if (features.length === 0 && page.description.length > 100) {
    const genericFeature: InferredFeature = {
      id: generateId(),
      pageId: page.id,
      title: `${page.name} Content`,
      description: `Display and interaction logic for ${page.name.toLowerCase()} page`,
      category: FeatureCategory.CONTENT_DISPLAY,
      complexity: FeatureComplexity.SIMPLE,
      actionVerbs: [],
      dataEntities: [],
      requiresRealtimeUpdates: false,
      requiresFileUpload: false,
      requiresExternalApi: false,
      databaseTables: [],
      utilityFileNeeds: {
        hooks: false,
        stores: false,
        actions: false,
        types: true,
      },
    };

    return [genericFeature];
  }

  return features;
};
