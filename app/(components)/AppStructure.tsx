"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { FileSystemEntry } from "@/app/(editor)/layout.types";
import { useCodeGeneration } from "@/app/(editor)/openrouter.hooks";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Bot,
  CornerLeftUp,
  FolderTree,
  HelpCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  convertInferredFeaturesToFeatures,
  createPageIdToPathMap,
  getUtilityFileTypesNeeded,
} from "./AppStructure.feature-linker";
import {
  addUtilityFilesToStructure,
  parseRoutesToStructure,
} from "./AppStructure.parser";
import { buildStructureGenerationPrompt } from "./AppStructure.prompts";
import { InferredFeature, FeatureCategory, FeatureComplexity } from "./AppStructure.types";
import {
  addRouteSegment,
  createRouteFromPath,
  deleteRouteFromFileSystem,
  generateId,
  generateRoutesFromFileSystem,
  generateUniqueSegmentName,
  getQualifyingFiles,
  validateRoutePath,
} from "./AppStructure.utils";
import { PageFeaturesAccordionItem } from "./AppStructure/PageFeaturesAccordionItem";
import { useAppStructureStore } from "./AppStructure.stores";
import { SiteMapNode } from "./SiteMapNode";
import { TreeNode } from "./TreeNode";
import { useREADMEStore } from "./READMEComponent.stores";
import { LayoutInput, PageInput, PageAccess, AuthMethods } from "./READMEComponent.types";

export { WireFrame } from "./WireFrame";

const isDevelopment = process.env.NODE_ENV === "development";

const buildFeatureGenerationPrompt = (
  readmeContent: string,
  layouts: LayoutInput[],
  pages: PageInput[],
  pageAccess: PageAccess[],
  authMethods: AuthMethods
): string => {
  const layoutsSection = layouts.length > 0
    ? `LAYOUTS:
${layouts.map(l => `${l.name}: ${l.description}`).join('\n')}\n`
    : '';

  const pagesSection = pages.length > 0
    ? `PAGES:
${pages.map(p => `${p.route} - ${p.name}: ${p.description}`).join('\n')}\n`
    : '';

  return `You are analyzing a Next.js web application to infer FUNCTIONAL features for layouts and pages.

${layoutsSection}
${pagesSection}

WHAT IS A FEATURE?

A feature is a FUNCTIONAL CAPABILITY that requires code implementation.

VALID FEATURES require at least one of:
✅ Hook to fetch or mutate data from database/API
✅ Action to perform server-side logic or validation
✅ Store to manage client-side state for user interactions
✅ Custom types to define data structures

INVALID FEATURES (DO NOT GENERATE):
❌ UI structure: "Header", "Footer", "Navigation Menu", "Sidebar"
❌ Layout components: "Main Layout", "Auth Layout", "Page Wrapper"
❌ Generic state: "Auth State Management", "Global State", "App State"
❌ Broad categories: "User Management", "Content Moderation", "Dashboard"
❌ Static displays: "Show Users", "Display Table" (unless specific fetching logic needed)

SPECIAL CASE - Sign Out Button:
✅ "Sign Out User" - YES, this IS a feature (requires action to clear session)
❌ "Header with Sign Out" - NO, the header is not a feature, only the sign out functionality

CONSOLIDATE RELATED FUNCTIONALITY:

When multiple actions share the same hook/action/store pathway, combine them:

✅ GOOD (consolidated):
  - "Fetch and Filter Users by Role"
    → Hook: useUsers (handles fetch + filter)
    → Action: getUsersAction (DB query)
    → Store: useUserFilterStore (filter state)
    → Types: User, UserFilter

  - "Approve or Deny Flagged Content"
    → Hook: useModerateContent
    → Action: moderateContentAction (approve or deny logic)
    → Types: FlaggedContent, ModerationDecision

❌ BAD (unnecessarily split):
  - "Fetch Users" + "Filter Users" (same pathway, should be one feature)
  - "Approve Content" + "Deny Content" (same action, two paths)

ACTION-ORIENTED FEATURES:

Extract a feature for EVERY action verb in the description.

Example description: "Users can add blocks, drag elements, resize shapes, and delete items"
→ Generate features for: add, drag, resize, delete

✅ GOOD (action-oriented):
  - "Sign In with Email and Password"
  - "Reset Password via Email Link"
  - "Create New Blog Post with Tags"
  - "Edit User Profile and Save"
  - "Ban User with Reason and Duration"
  - "Fetch and Filter Products by Category"
  - "Submit Contact Form"
  - "Add and Edit Content Blocks"
  - "Drag and Reorder Elements"
  - "Resize Elements"
  - "Delete Elements"
  - "Toggle Responsive Preview"

❌ BAD (display-oriented or too broad):
  - "User Authentication" (too broad)
  - "Show User Profile" (no specific action)
  - "Display Products" (unless specific fetch logic)
  - "Header Navigation" (UI structure)
  - "Product Management" (too broad)
  - "Content Management" (too broad - split into specific actions)

FEATURE COUNT GUIDANCE:

Analyze the page description for SPECIFIC FUNCTIONALITY mentioned.

- Simple page (display only, no interactions) → 0-2 features
  Example: Static about page → 0 features
  Example: User profile view → 1 feature (fetch user data)

- Standard page (forms, CRUD operations) → 2-4 features
  Example: Login page → 1 feature (sign in with email/password)
  Example: Settings page → 2-3 features (fetch settings, update settings, upload avatar)

- Complex page (admin dashboards, content management, editors) → 4-8 features
  Example: Admin moderation page → 5 features:
    1. Fetch and filter flagged content
    2. Approve or remove flagged content
    3. Warn or ban users
    4. Fetch moderation audit log
    5. Manage user reports

  Example: Page builder/editor → 7 features:
    1. Fetch and save page data
    2. Add text blocks, shapes, dividers, embeds
    3. Edit content blocks
    4. Drag and reorder elements
    5. Resize and align elements
    6. Delete elements
    7. Toggle responsive preview (desktop/tablet/mobile)

HOW TO EXTRACT FEATURES FROM PAGE DESCRIPTIONS:

Step 1: Identify ALL action verbs in the description
  Example: "Users add blocks, drag elements, resize shapes, delete items"
  Actions: add, drag, resize, delete

Step 2: Create a feature for EACH distinct action
  → "Add Content Blocks"
  → "Drag and Reorder Elements"
  → "Resize Elements"
  → "Delete Elements"

Step 3: Add data management features (fetch/save)
  → "Fetch and Save Page Data"

Step 4: Add state management features (toggles, filters, selections)
  → "Toggle Responsive Preview"

WHEN TO SPLIT vs CONSOLIDATE:

Split features when they use DIFFERENT hooks/actions:
✅ "Fetch flagged content" + "Approve or remove content" (different actions)
✅ "Add content blocks" + "Drag and reorder elements" (different interactions)

Consolidate when they share the SAME hook/action pathway:
✅ "Approve or remove content" (one action, two code paths)
✅ "Warn or ban users" (one action, different parameters)

CRITICAL:
- ALWAYS include ALL layouts and pages in the response, even if features array is empty
- Use the 4-step process above to extract features from EVERY page description
- For complex pages with many actions, generate 4-8 specific features (one per action)

CRITICAL OUTPUT REQUIREMENTS:
1. ALWAYS include ALL layouts in the "layouts" array (even if features is empty [])
2. ALWAYS include ALL pages in the "pages" array (even if features is empty [])
3. Match layout names and page routes EXACTLY as provided above
4. Generate specific features for each action mentioned in descriptions

Return a JSON object with this structure:
{
  "layouts": [
    {
      "name": "Main Layout",
      "features": [
        {
          "title": "Sign Out User",
          "description": "Clear user session and redirect to login",
          "category": "authentication",
          "complexity": "simple",
          "actionVerbs": ["signout"],
          "dataEntities": ["user"],
          "requiresRealtimeUpdates": false,
          "requiresFileUpload": false,
          "requiresExternalApi": false,
          "databaseTables": ["profiles"],
          "utilityFileNeeds": {
            "hooks": true,
            "actions": true,
            "stores": false,
            "types": false
          }
        }
      ]
    }
  ],
  "pages": [
    {
      "route": "/admin/moderation",
      "name": "Content Moderation",
      "description": "Admin dashboard for moderation",
      "features": [
        {
          "title": "Fetch and Filter Flagged Content",
          "description": "Get all flagged content with filtering options",
          "category": "data-management",
          "complexity": "medium",
          "actionVerbs": ["fetch", "filter"],
          "dataEntities": ["flaggedContent"],
          "requiresRealtimeUpdates": false,
          "requiresFileUpload": false,
          "requiresExternalApi": false,
          "databaseTables": ["flagged_content"],
          "utilityFileNeeds": {
            "hooks": true,
            "actions": true,
            "stores": true,
            "types": true
          }
        },
        {
          "title": "Approve or Remove Flagged Content",
          "description": "Take action to approve or permanently remove content",
          "category": "content-management",
          "complexity": "medium",
          "actionVerbs": ["approve", "remove"],
          "dataEntities": ["flaggedContent"],
          "requiresRealtimeUpdates": false,
          "requiresFileUpload": false,
          "requiresExternalApi": false,
          "databaseTables": ["flagged_content"],
          "utilityFileNeeds": {
            "hooks": true,
            "actions": true,
            "stores": false,
            "types": true
          }
        },
        {
          "title": "Warn or Ban Users",
          "description": "Issue warnings or ban users with reason",
          "category": "user-management",
          "complexity": "medium",
          "actionVerbs": ["warn", "ban"],
          "dataEntities": ["user"],
          "requiresRealtimeUpdates": false,
          "requiresFileUpload": false,
          "requiresExternalApi": false,
          "databaseTables": ["users"],
          "utilityFileNeeds": {
            "hooks": true,
            "actions": true,
            "stores": false,
            "types": true
          }
        }
      ]
    }
  ]
}

CRITICAL:
- Include ALL layouts and pages in response (even if features is empty)
- Focus on FUNCTIONAL features that require hooks/actions/stores/types
- For complex pages, generate 4-8 specific features covering all mentioned actions
Return only the JSON object, no additional text.`;
};

const validateFeature = (feature: InferredFeature): boolean => {
  const invalidTitles = [
    'header', 'footer', 'sidebar', 'navigation',
    'layout', 'wrapper', 'container',
    'auth state', 'global state', 'app state',
    'management', 'dashboard', 'page'
  ];

  const titleLower = feature.title.toLowerCase();

  if (invalidTitles.some(invalid => titleLower.includes(invalid))) {
    return false;
  }

  const hasUtility = Object.values(feature.utilityFileNeeds).some(v => v === true);
  if (!hasUtility) {
    return false;
  }

  return true;
};

export const LayoutAndStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    setFeatures,
    featureFileSelection,
    selectedFilePath,
    data,
    appStructureGenerated,
    setAppStructureGenerated,
    readmeGenerated,
    appStructureHelpPopoverOpened,
    setAppStructureHelpPopoverOpened,
  } = useEditorStore();

  const { layouts, pages, pageAccess, authMethods } = useREADMEStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);
  const [helpPopoverOpen, setHelpPopoverOpen] = useState(false);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

  const fullReadmeContent = useMemo(() => {
    const readmeNode = data.flatIndex["readme"];
    if (!readmeNode || readmeNode.type !== "file" || !readmeNode.content) return null;
    return readmeNode.content.replace(/^<!-- component-READMEComponent -->\s*\n*/g, '').trim();
  }, [data]);

  const {
    inferredFeatures,
    parsedPages,
    featuresGenerated,
    accordionValue,
    lastGeneratedReadmeContent,
    lastGeneratedForStructure,
    setInferredFeatures,
    setParsedPages,
    setFeaturesGenerated,
    setAccordionValue,
    setLastGeneratedReadmeContent,
    setLastGeneratedForStructure,
    updateFeature,
  } = useAppStructureStore();

  const [globalExpandedFeatureId, setGlobalExpandedFeatureId] = useState<string | null>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);

  useEffect(() => {
    if (globalExpandedFeatureId === null && featuresGenerated && Object.keys(inferredFeatures).length > 0) {
      const firstPageFeatures = Object.values(inferredFeatures)[0];
      if (firstPageFeatures && firstPageFeatures.length > 0) {
        setGlobalExpandedFeatureId(firstPageFeatures[0].id);
      }
    }
  }, [featuresGenerated, inferredFeatures, globalExpandedFeatureId]);

  useEffect(() => {
    if (appStructureGenerated) {
      setShowSuccessView(true);
    }
  }, [appStructureGenerated]);

  const handleAddFeature = useCallback((pageId: string) => {
    const newFeature: InferredFeature = {
      id: generateId(),
      pageId: pageId,
      title: "New Feature",
      description: "",
      category: FeatureCategory.UI_INTERACTION,
      complexity: FeatureComplexity.SIMPLE,
      actionVerbs: [],
      dataEntities: [],
      requiresRealtimeUpdates: false,
      requiresFileUpload: false,
      requiresExternalApi: false,
      databaseTables: [],
      utilityFileNeeds: {
        hooks: true,
        actions: false,
        stores: false,
        types: true,
      },
    };

    setInferredFeatures({
      ...inferredFeatures,
      [pageId]: [...(inferredFeatures[pageId] || []), newFeature],
    });
    setGlobalExpandedFeatureId(newFeature.id);
  }, [inferredFeatures, setInferredFeatures]);

  const handleDeleteFeature = useCallback((featureId: string) => {
    const updatedFeatures = { ...inferredFeatures };

    for (const pageId in updatedFeatures) {
      updatedFeatures[pageId] = updatedFeatures[pageId].filter(
        (f) => f.id !== featureId
      );
    }

    setInferredFeatures(updatedFeatures);

    if (globalExpandedFeatureId === featureId) {
      setGlobalExpandedFeatureId(null);
    }
  }, [inferredFeatures, setInferredFeatures, globalExpandedFeatureId]);

  useEffect(() => {}, []);

  const { mutate: generateFeatures, isPending: isGeneratingFeatures } =
    useCodeGeneration((response) => {
      try {
        const cleanResponse = response.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const parsed = JSON.parse(cleanResponse);

        const allFeatures: Record<string, InferredFeature[]> = {};
        const displayPages: Array<{
          id: string;
          name: string;
          route: string;
          description: string;
        }> = [];

        if (parsed.layouts && Array.isArray(parsed.layouts)) {
          parsed.layouts.forEach((layoutData: any) => {
            const layout = layouts.find(l => l.name === layoutData.name);
            if (!layout) return;

            const layoutPageId = `layout-${layout.id}`;

            if (layoutData.features && Array.isArray(layoutData.features)) {
              const inferredFeatures: InferredFeature[] = layoutData.features
                .map(
                  (f: any) => ({
                    id: generateId(),
                    pageId: layoutPageId,
                    title: f.title || "Untitled Feature",
                    description: f.description || "",
                    category: f.category || "ui-interaction",
                    complexity: f.complexity || "simple",
                    actionVerbs: f.actionVerbs || [],
                    dataEntities: f.dataEntities || [],
                    requiresRealtimeUpdates: f.requiresRealtimeUpdates || false,
                    requiresFileUpload: f.requiresFileUpload || false,
                    requiresExternalApi: f.requiresExternalApi || false,
                    databaseTables: f.databaseTables || [],
                    utilityFileNeeds: f.utilityFileNeeds || {
                      hooks: false,
                      actions: false,
                      stores: false,
                      types: true,
                    },
                  })
                )
                .filter(validateFeature);

              if (inferredFeatures.length > 0) {
                allFeatures[layoutPageId] = inferredFeatures;
              }
            }

            displayPages.push({
              id: layoutPageId,
              name: `${layout.name} Features`,
              route: '',
              description: layout.description,
            });
          });
        }

        if (!parsed.pages || !Array.isArray(parsed.pages)) {
          toast.error("Invalid response format from AI");
          return;
        }

        parsed.pages.forEach((pageData: any) => {
          const page = pages.find(p => p.route === pageData.route);
          if (!page) return;

          const pageId = page.id;

          displayPages.push({
            id: pageId,
            name: page.name,
            route: page.route,
            description: page.description,
          });

          if (pageData.features && Array.isArray(pageData.features)) {
            const inferredFeatures: InferredFeature[] = pageData.features
              .map(
                (f: any) => ({
                  id: generateId(),
                  pageId: pageId,
                  title: f.title || "Untitled Feature",
                  description: f.description || "",
                  category: f.category || "ui-interaction",
                  complexity: f.complexity || "simple",
                  actionVerbs: f.actionVerbs || [],
                  dataEntities: f.dataEntities || [],
                  requiresRealtimeUpdates: f.requiresRealtimeUpdates || false,
                  requiresFileUpload: f.requiresFileUpload || false,
                  requiresExternalApi: f.requiresExternalApi || false,
                  databaseTables: f.databaseTables || [],
                  utilityFileNeeds: f.utilityFileNeeds || {
                    hooks: true,
                    actions: false,
                    stores: false,
                    types: true,
                  },
                })
              )
              .filter(validateFeature);

            if (inferredFeatures.length > 0) {
              allFeatures[pageId] = inferredFeatures;
            }
          }
        });

        setParsedPages(displayPages);
        setInferredFeatures(allFeatures);
        setFeaturesGenerated(true);
        setAccordionValue("step-features");

        const firstPageFeatures = Object.values(allFeatures)[0];
        if (firstPageFeatures && firstPageFeatures.length > 0) {
          setGlobalExpandedFeatureId(firstPageFeatures[0].id);
        }

        const layoutCount = parsed.layouts?.length || 0;
        const pageCount = parsed.pages?.length || 0;
        toast.success(
          `Generated features for ${layoutCount} layout(s) and ${pageCount} page(s)`
        );
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        toast.error("Failed to parse AI response. Please try again.");
      }
    });

  const { mutate: generateStructure, isPending: isGeneratingStructure } =
    useCodeGeneration((response) => {
      try {
        const cleanResponse = response.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const parsed = JSON.parse(cleanResponse);

        console.log("APP STRUCTURE GENERATION OUTPUT:", JSON.stringify({
          responseContent: response.content,
          cleanedResponse: cleanResponse,
          parsedResult: parsed,
          structureCount: parsed.structure?.length || 0,
          featuresCount: Object.keys(parsed.features || {}).length
        }, null, 2));

        if (!parsed.structure || !parsed.features) {
          toast.error("Invalid AI response format");
          return;
        }

        setAppStructure(parsed.structure);
        setFeatures(parsed.features);
        setAppStructureGenerated(true);
        setShowSuccessView(true);

        toast.success(`App structure generated with ${parsedPages.length} pages`);
      } catch (error) {
        toast.error("Failed to generate structure. Please try again.");
      }
    });

  const handleGenerateFeatures = useCallback(() => {
    if (!fullReadmeContent) {
      toast.error("No README found. Please generate README first.");
      return;
    }

    setLastGeneratedReadmeContent(fullReadmeContent);

    const combinedPrompt = buildFeatureGenerationPrompt(
      fullReadmeContent,
      layouts,
      pages,
      pageAccess,
      authMethods
    );

    console.log("FEATURE GENERATION PROMPT:", {
      promptLength: combinedPrompt.length,
      layoutCount: layouts.length,
      pageCount: pages.length,
      prompt: combinedPrompt
    });

    generateFeatures({ prompt: combinedPrompt, maxTokens: 4500 });
  }, [fullReadmeContent, layouts, pages, pageAccess, authMethods, generateFeatures, setLastGeneratedReadmeContent]);


  const hasFeaturesChanged = useCallback(() => {
    if (!lastGeneratedForStructure) return true;
    const currentState = JSON.stringify({ parsedPages, inferredFeatures });
    return lastGeneratedForStructure !== currentState;
  }, [lastGeneratedForStructure, parsedPages, inferredFeatures]);

  const handleGenerateStructure = useCallback(() => {
    if (!parsedPages || parsedPages.length === 0) {
      toast.error("No pages found. Please generate features first.");
      return;
    }

    if (!inferredFeatures || Object.keys(inferredFeatures).length === 0) {
      toast.error("No features found. Please generate features first.");
      return;
    }

    setLastGeneratedForStructure(JSON.stringify({ parsedPages, inferredFeatures }));

    const prompt = buildStructureGenerationPrompt(parsedPages, inferredFeatures, layouts, pages);

    console.log("APP STRUCTURE GENERATION INPUT:", JSON.stringify({
      prompt,
      inputData: {
        parsedPages,
        inferredFeatures,
        layouts,
        pages,
        pageCount: parsedPages.length,
        totalFeatures: Object.values(inferredFeatures).reduce((sum, features) => sum + features.length, 0)
      }
    }, null, 2));

    generateStructure({ prompt, maxTokens: 6000 });
  }, [parsedPages, inferredFeatures, layouts, pages, generateStructure, setLastGeneratedForStructure]);


  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  const hasReadme = readmeGenerated && fullReadmeContent;
  const isPending = isGeneratingFeatures;

  const totalFeatures = Object.values(inferredFeatures).reduce(
    (sum, features) => sum + features.length,
    0
  );

  if (appStructure.length === 0 || !appStructureGenerated || (appStructureGenerated && !showSuccessView)) {
    if (!hasReadme) {
      return (
        <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center theme-py-12 theme-gap-4">
            <p className="text-base font-semibold theme-text-muted-foreground text-center">
              Generate your{" "}
              <Link
                href="/readme"
                className="theme-text-primary hover:underline"
              >
                README
              </Link>{" "}
              first
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col theme-gap-4 theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto">
        <div className="flex flex-col theme-gap-3">
          <h2 className="text-xl font-bold theme-text-foreground flex items-center theme-gap-2">
            <FolderTree className="h-5 w-5 theme-text-primary" />
            Generate App Structure
          </h2>
          <p className="theme-text-foreground">
            Follow the steps below to define the files and folders for your app.
            <br />
            Start by defining the features for each page based on your README.
          </p>

          {!featuresGenerated && (
            <Button
              onClick={handleGenerateFeatures}
              disabled={isPending}
              className="w-full theme-gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating features...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Generate Features
                </>
              )}
            </Button>
          )}
        </div>

        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full"
        >
          <AccordionItem
            value="step-features"
            className={`theme-border-border ${!featuresGenerated ? "opacity-50 pointer-events-none" : ""}`}
          >
            <AccordionTrigger
              className={`hover:theme-text-primary group ${!featuresGenerated ? "cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center theme-gap-2">
                <Sparkles className="h-5 w-5 theme-text-primary" />
                <span className="font-semibold text-base lg:text-lg group-hover:underline">
                  Features
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col theme-gap-4 pt-4">
                <div className="flex flex-col theme-gap-2">
                  {parsedPages.map((page) => {
                    const features = inferredFeatures[page.id] || [];

                    return (
                      <PageFeaturesAccordionItem
                        key={page.id}
                        pageId={page.id}
                        pageName={page.name}
                        pageRoute={page.route}
                        features={features}
                        expandedFeatureId={globalExpandedFeatureId}
                        onToggleFeature={setGlobalExpandedFeatureId}
                        onUpdateFeature={updateFeature}
                        onAddFeature={handleAddFeature}
                        onDeleteFeature={handleDeleteFeature}
                        disabled={isPending}
                      />
                    );
                  })}
                </div>

                {appStructureGenerated ? (
                  <div className="flex flex-col sm:flex-row theme-gap-2">
                    <Button
                      onClick={handleGenerateStructure}
                      disabled={isGeneratingStructure || !hasFeaturesChanged()}
                      className="flex-1 theme-gap-2"
                    >
                      {isGeneratingStructure ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4" />
                          Regenerate App Structure
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSuccessView(true);
                      }}
                      disabled={isGeneratingStructure}
                      variant="outline"
                      className="flex-1 theme-gap-2"
                    >
                      View App Directory
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateStructure}
                    disabled={isGeneratingStructure || !featuresGenerated}
                    className="w-full theme-gap-2"
                  >
                    {isGeneratingStructure ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating structure...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Generate App Structure
                      </>
                    )}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="theme-p-2 md:theme-p-4 theme-radius theme-border-border theme-bg-card theme-text-card-foreground theme-shadow theme-font-sans theme-tracking max-w-2xl mx-auto relative">
      <div className="absolute top-2 right-2 flex items-center theme-gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => {
            setShowSuccessView(false);
            setAccordionValue("step-features");
          }}
        >
          <CornerLeftUp className="h-4 w-4" />
        </Button>
        <Popover
          open={helpPopoverOpen}
          onOpenChange={(open) => {
            setHelpPopoverOpen(open);
            if (open && !appStructureHelpPopoverOpened) {
              setAppStructureHelpPopoverOpened(true);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${!appStructureHelpPopoverOpened ? "theme-bg-primary theme-text-primary-foreground hover:opacity-90" : ""}`}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        <PopoverContent
          className="sm:w-96 theme-text-popover-foreground theme-shadow theme-font-sans theme-tracking p-0 theme-radius max-h-[45vh] overflow-y-auto"
          style={{ borderColor: "var(--theme-primary)" }}
          align="end"
        >
          <div className="flex flex-col theme-gap-3 theme-bg-background p-4">
            <h4 className="font-semibold text-base theme-font-sans theme-tracking">
              App Structure
            </h4>
            <div className="flex flex-col theme-gap-2 text-sm">
              <p className="theme-font-sans theme-tracking">
                This is your Next.js web app architecture.
              </p>
              <p className="theme-font-sans theme-tracking">
                <strong>Page.tsx</strong> files define pages of your app.
              </p>
              <p className="theme-font-sans theme-tracking">
                <strong>Layout.tsx</strong> files wrap child pages with shared
                UI
              </p>
              <p className="theme-font-sans theme-tracking">
                Add <strong>Features</strong> to pages or layouts
              </p>
              <p className="theme-font-sans theme-tracking">
                Add <strong>hooks, actions, stores or types</strong> to features
              </p>
              <p className="theme-font-sans theme-tracking">
                Each hook, action, store, and type is assigned to a utility file
                in any parent directory (eg. <strong>page.hooks.ts</strong>)
              </p>
              <a
                href="https://nextjs.org/docs/app/building-your-application/routing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm theme-text-primary hover:underline theme-font-sans theme-tracking theme-pt-2"
              >
                Next.js App Router docs →
              </a>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      </div>

      <div className="flex flex-col theme-gap-2 md:theme-gap-4 min-h-[calc(100vh-800px)]">
        <div className="flex flex-col flex-[2] min-h-0 overflow-hidden">
          <div className="flex items-center justify-between theme-mb-2">
            <h3 className="text-base md:text-lg font-semibold theme-text-card-foreground theme-font-sans theme-tracking">
              App Directory
            </h3>
          </div>

          <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
            {appStructure.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                isLast={index === appStructure.length - 1}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAddFile={handleAddFile}
                onAddDirectory={handleAddDirectory}
                appStructure={appStructure}
                onAddSpecificFile={handleAddSpecificFile}
                newNodeId={newNodeId}
                qualifyingFilePaths={qualifyingFilePaths}
                expandedFileId={expandedFileId}
                setExpandedFileId={setExpandedFileId}
              />
            ))}
          </div>
        </div>

        {routes.length > 0 && (
          <div className="flex flex-col flex-[1] min-h-0 overflow-hidden">
            <h3 className="text-base md:text-lg font-semibold theme-mb-2 theme-text-card-foreground theme-font-sans theme-tracking">
              Site Map
            </h3>

            <div className="theme-font-mono text-sm md:text-base theme-bg-background theme-p-2 md:theme-p-3 theme-radius overflow-x-auto overflow-y-auto flex-1 theme-shadow">
              {routes.map((route, index) => (
                <SiteMapNode
                  key={`${route.path}-${index}`}
                  route={route}
                  isLast={index === routes.length - 1}
                  appStructure={appStructure}
                  onUpdateAppStructure={handleUpdate}
                  onDeleteRoute={handleDeleteRoute}
                  onAddSegment={handleAddSegment}
                  newlyAddedSegmentPath={newlyAddedSegmentPath}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AppStructure = () => {
  const {
    appStructure,
    updateAppStructureNode,
    deleteAppStructureNode,
    addAppStructureNode,
    setAppStructure,
    featureFileSelection,
    selectedFilePath,
  } = useEditorStore();

  const [routeInputValue, setRouteInputValue] = useState("");
  const routeInputRef = useRef<HTMLInputElement>(null);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [newlyAddedSegmentPath, setNewlyAddedSegmentPath] = useState<
    string | null
  >(null);

  const qualifyingFilePaths = featureFileSelection.fileType
    ? getQualifyingFiles(
        appStructure,
        selectedFilePath,
        featureFileSelection.fileType
      )
    : [];

  const handleUpdate = (id: string, updates: Partial<FileSystemEntry>) => {
    updateAppStructureNode(id, updates);
  };

  const handleDelete = (id: string) => {
    deleteAppStructureNode(id);
  };

  const handleAddFile = (parentId: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: "new-file.tsx",
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddSpecificFile = (parentId: string, fileName: string) => {
    const newFile: FileSystemEntry = {
      id: generateId(),
      name: fileName,
      type: "file",
    };
    setNewNodeId(newFile.id);
    addAppStructureNode(parentId, newFile);
  };

  const handleAddDirectory = (parentId: string) => {
    const newDir: FileSystemEntry = {
      id: generateId(),
      name: "new-folder",
      type: "directory",
      children: [],
      isExpanded: true,
    };
    setNewNodeId(newDir.id);
    addAppStructureNode(parentId, newDir);
  };

  const handleDeleteRoute = (routePath: string) => {
    const updatedStructure = deleteRouteFromFileSystem(
      appStructure,
      routePath,
      "",
      true
    );
    setAppStructure(updatedStructure);
  };

  const handleAddSegment = (parentPath: string) => {
    const segmentName = generateUniqueSegmentName(appStructure, parentPath);
    const updatedStructure = addRouteSegment(
      appStructure,
      parentPath,
      segmentName,
      "",
      true
    );
    setAppStructure(updatedStructure);
    const newSegmentPath =
      parentPath === "/" ? `/${segmentName}` : `${parentPath}/${segmentName}`;
    setNewlyAddedSegmentPath(newSegmentPath);
  };

  const handleRouteSubmit = () => {
    const path = routeInputValue.trim();

    const validation = validateRoutePath(path);
    if (!validation.valid) {
      console.error("Invalid route path:", validation.error);
      return;
    }

    const updatedStructure = createRouteFromPath(appStructure, path, "", true);
    setAppStructure(updatedStructure);
    setRouteInputValue("");
  };

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRouteSubmit();
    }
    if (e.key === "Escape") {
      setRouteInputValue("");
    }
  };

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  return (
    <div className="theme-p-4 rounded-lg border bg-[hsl(var(--card))] border-[hsl(var(--border))] min-h-[calc(100vh-200px)] flex flex-col">
      <h3 className="text-lg font-semibold theme-mb-4 text-[hsl(var(--card-foreground))]">
        App Directory Structure
      </h3>

      <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
        {[...appStructure]
          .sort((a, b) => {
            if (a.type === "file" && b.type === "directory") return -1;
            if (a.type === "directory" && b.type === "file") return 1;
            return a.name.localeCompare(b.name);
          })
          .map((node, index) => (
            <TreeNode
              key={node.id}
              node={node}
              isLast={false}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddFile={handleAddFile}
              onAddDirectory={handleAddDirectory}
              appStructure={appStructure}
              onAddSpecificFile={handleAddSpecificFile}
              newNodeId={newNodeId}
              qualifyingFilePaths={qualifyingFilePaths}
              expandedFileId={expandedFileId}
              setExpandedFileId={setExpandedFileId}
            />
          ))}

        {appStructure.length === 0 && (
          <div className="text-base font-semibold text-center theme-py-8 text-[hsl(var(--muted-foreground))]">
            Click the buttons above to start building your app structure
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <>
          <div className="theme-mt-6 theme-mb-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Site Map (Resulting Routes)
            </h3>
          </div>

          <div className="font-mono text-base bg-[hsl(var(--muted))] theme-p-3 rounded overflow-x-auto">
            {routes.map((route, index) => (
              <SiteMapNode
                key={route.path}
                route={route}
                isLast={index === routes.length - 1}
                appStructure={appStructure}
                onUpdateAppStructure={handleUpdate}
                onDeleteRoute={handleDeleteRoute}
                onAddSegment={handleAddSegment}
                newlyAddedSegmentPath={newlyAddedSegmentPath}
              />
            ))}

            <div className="theme-mt-2 flex items-center theme-gap-2 rounded dark:border-gray-700 ">
              <Input
                ref={routeInputRef}
                value={routeInputValue}
                onChange={(e) => setRouteInputValue(e.target.value)}
                onKeyDown={handleRouteKeyDown}
                onBlur={handleRouteSubmit}
                placeholder="Enter route path (e.g., /register/)"
                className="h-6 theme-px-2 theme-py-0 text-sm flex-1 font-mono"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
